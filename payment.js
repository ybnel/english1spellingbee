function initPaymentApp() {
  const form = document.getElementById('paymentForm');
  const cards = document.querySelectorAll('.form-card');
  const successView = document.getElementById('successView');
  const btnBack = document.getElementById('btnBack');
  const btnClearForm = document.getElementById('btnClearForm');
  const btnSubmitAnother = document.getElementById('btnSubmitAnother');

  // Branch Info Cards
  const branchStudentGroup1 = document.getElementById('branch-student-group1');
  const branchStudentGroup2 = document.getElementById('branch-student-group2');
  const branchNonstudentGroup1 = document.getElementById('branch-nonstudent-group1');
  const branchNonstudentGroup2 = document.getElementById('branch-nonstudent-group2');
  const allBranchCards = [branchStudentGroup1, branchStudentGroup2, branchNonstudentGroup1, branchNonstudentGroup2];

  // Responses Modal Elements
  const responseCountText = document.getElementById('responseCountText');
  const btnOpenResponses = document.getElementById('btnOpenResponses');
  const responsesModal = document.getElementById('responsesModal');
  const btnCloseModal = document.getElementById('btnCloseModal');
  const responsesTableBody = document.getElementById('responsesTableBody');
  const btnExportCSV = document.getElementById('btnExportCSV');
  const btnClearData = document.getElementById('btnClearData');

  let currentCalculatedBranch = '';

  // Get Section 1 data from sessionStorage
  const sec1RawData = sessionStorage.getItem('spelling_bee_temp_section1');
  let sec1Data = null;

  if (sec1RawData) {
    try {
      sec1Data = JSON.parse(sec1RawData);
    } catch (e) {
      sec1Data = null;
    }
  }

  // If no Section 1 data, redirect back to index.html
  if (!sec1Data) {
    window.location.href = 'index.html';
    return;
  }

  // Update & Show matching Branch Payment Card
  updateBranchCard(sec1Data);

  function updateBranchCard(data) {
    const isStudent = data.isEnglish1Student; // "Ya" or "Tidak"
    const center = data.english1Center; // Center choice

    allBranchCards.forEach(card => card.style.display = 'none');
    currentCalculatedBranch = '';

    if (!center) return;

    const group1Centers = [
      'English 1 Plaza Surabaya',
      'English 1 Jemursari',
      'English 1 Galaxy Mall',
      'English 1 Purimas'
    ];

    const isGroup1 = group1Centers.includes(center);
    let activeCard = null;

    if (isStudent === 'Ya' && isGroup1) {
      activeCard = branchStudentGroup1;
      currentCalculatedBranch = 'Student - Plaza/JS/GM/Purimas';
    } else if (isStudent === 'Ya' && !isGroup1) {
      activeCard = branchStudentGroup2;
      currentCalculatedBranch = 'Student - BM/Pakuwon';
    } else if (isStudent === 'Tidak' && isGroup1) {
      activeCard = branchNonstudentGroup1;
      currentCalculatedBranch = 'Non-Student - Plaza/JS/GM/Purimas';
    } else {
      activeCard = branchNonstudentGroup2;
      currentCalculatedBranch = 'Non-Student - BM/Pakuwon';
    }

    if (activeCard) {
      activeCard.style.display = 'block';
    }
  }

  // Active card highlight logic
  cards.forEach(card => {
    card.addEventListener('click', () => {
      setActiveCard(card);
    });

    const inputs = card.querySelectorAll('input, select');
    inputs.forEach(input => {
      input.addEventListener('focus', () => {
        setActiveCard(card);
      });
      input.addEventListener('input', () => {
        card.classList.remove('error-state');
      });
      input.addEventListener('change', () => {
        card.classList.remove('error-state');
      });
    });
  });

  function setActiveCard(targetCard) {
    cards.forEach(c => c.classList.remove('active'));
    targetCard.classList.add('active');
  }

  // File upload controls
  const paymentReceiptInput = document.getElementById('paymentReceipt');
  const btnGalleryUpload = document.getElementById('btnGalleryUpload');
  const fileStatusBox = document.getElementById('fileStatusBox');
  const fileNameDisplay = document.getElementById('fileNameDisplay');
  const btnRemoveFile = document.getElementById('btnRemoveFile');

  if (btnGalleryUpload && paymentReceiptInput) {
    btnGalleryUpload.addEventListener('click', () => {
      paymentReceiptInput.click();
    });
  }

  if (paymentReceiptInput) {
    paymentReceiptInput.addEventListener('change', () => {
      if (paymentReceiptInput.files && paymentReceiptInput.files.length > 0) {
        const file = paymentReceiptInput.files[0];
        if (fileNameDisplay) fileNameDisplay.textContent = file.name;
        if (fileStatusBox) fileStatusBox.style.display = 'flex';
        
        const uploadCard = paymentReceiptInput.closest('.form-card');
        if (uploadCard) uploadCard.classList.remove('error-state');
      }
    });
  }

  if (btnRemoveFile) {
    btnRemoveFile.addEventListener('click', () => {
      if (paymentReceiptInput) paymentReceiptInput.value = '';
      if (fileNameDisplay) fileNameDisplay.textContent = '';
      if (fileStatusBox) fileStatusBox.style.display = 'none';
    });
  }

  // Back button -> return to index.html
  if (btnBack) {
    btnBack.addEventListener('click', () => {
      window.location.href = 'index.html';
    });
  }

  // Clear form button
  if (btnClearForm) {
    btnClearForm.addEventListener('click', () => {
      if (confirm('Are you sure you want to clear the payment receipt selection?')) {
        form.reset();
        if (fileNameDisplay) fileNameDisplay.textContent = '';
        if (fileStatusBox) fileStatusBox.style.display = 'none';
        cards.forEach(c => c.classList.remove('error-state'));
      }
    });
  }

  // Submit Handler
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Validate payment receipt
    let isValid = true;
    let uploadCard = null;

    if (!paymentReceiptInput.files || paymentReceiptInput.files.length === 0) {
      isValid = false;
      uploadCard = paymentReceiptInput.closest('.form-card');
      if (uploadCard) uploadCard.classList.add('error-state');
    }

    if (!isValid) {
      if (uploadCard) {
        setActiveCard(uploadCard);
        uploadCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    const receiptFile = paymentReceiptInput.files[0];
    const submission = {
      id: Date.now(),
      timestamp: new Date().toLocaleString('id-ID'),
      ...sec1Data,
      branchCategory: currentCalculatedBranch,
      paymentReceipt: receiptFile ? receiptFile.name : 'Tidak ada file'
    };

    // Save locally
    saveSubmission(submission);

    // Send payload + file base64 to Google Sheets
    const GOOGLE_SCRIPT_URL_SURABAYA = 'https://script.google.com/macros/s/AKfycbyQym6DmlPm2hxeT3ELSu9BqHff-qL_BIHEA6fJmc4UTCMZKcJHA1VZxlisC6jq_30ScA/exec';

    if (receiptFile) {
      const reader = new FileReader();
      reader.onload = function(evt) {
        const fileBase64 = evt.target.result.split(',')[1];
        sendDataToGoogleSheets(GOOGLE_SCRIPT_URL_SURABAYA, {
          ...submission,
          fileName: receiptFile.name,
          fileType: receiptFile.type,
          fileData: fileBase64
        });
      };
      reader.readAsDataURL(receiptFile);
    } else {
      sendDataToGoogleSheets(GOOGLE_SCRIPT_URL_SURABAYA, submission);
    }

    // Clear temp section1 draft
    sessionStorage.removeItem('spelling_bee_temp_section1');

    // Show Success View
    form.style.display = 'none';
    if (successView) successView.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
    updateResponseCount();
  });

  function sendDataToGoogleSheets(url, payload) {
    if (!url) return;
    fetch(url, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).then(() => {
      console.log('Data pendaftaran berhasil dikirim ke Google Sheets.');
    }).catch(err => {
      console.error('Gagal mengirim data ke Google Sheets:', err);
    });
  }

  // LocalStorage Helper
  function getSubmissions() {
    const data = localStorage.getItem('spelling_bee_submissions');
    return data ? JSON.parse(data) : [];
  }

  function saveSubmission(sub) {
    const list = getSubmissions();
    list.push(sub);
    localStorage.setItem('spelling_bee_submissions', JSON.stringify(list));
  }

  function updateResponseCount() {
    const list = getSubmissions();
    if (responseCountText) {
      responseCountText.textContent = `${list.length} Jawaban tersimpan secara lokal`;
    }
  }

  // Modal handlers
  if (btnOpenResponses) {
    btnOpenResponses.addEventListener('click', () => {
      renderResponsesTable();
      responsesModal.style.display = 'flex';
    });
  }

  if (btnCloseModal) {
    btnCloseModal.addEventListener('click', () => {
      responsesModal.style.display = 'none';
    });
  }

  if (responsesModal) {
    responsesModal.addEventListener('click', (e) => {
      if (e.target === responsesModal) {
        responsesModal.style.display = 'none';
      }
    });
  }

  function renderResponsesTable() {
    const list = getSubmissions();
    if (!responsesTableBody) return;

    if (list.length === 0) {
      responsesTableBody.innerHTML = `
        <tr>
          <td colspan="11" style="text-align:center; padding: 20px; color: #70757a;">Belum ada pendaftaran.</td>
        </tr>
      `;
      return;
    }

    responsesTableBody.innerHTML = list.map(item => `
      <tr>
        <td>${escapeHtml(item.timestamp)}</td>
        <td><strong>${escapeHtml(item.fullName)}</strong></td>
        <td>${escapeHtml(item.birthDetails)}</td>
        <td>${escapeHtml(item.schoolName)}</td>
        <td>${escapeHtml(item.grade)}</td>
        <td>${escapeHtml(item.groupCategory)}</td>
        <td>${escapeHtml(item.parentPhone)}</td>
        <td>${escapeHtml(item.isEnglish1Student)}</td>
        <td>${escapeHtml(item.english1Center)}</td>
        <td>${escapeHtml(item.infoSource)}</td>
        <td><span style="background:#fceef4; color:#e00078; padding:2px 6px; border-radius:4px; font-weight:500;">${escapeHtml(item.branchCategory || '-')}</span></td>
      </tr>
    `).join('');
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // Export CSV
  if (btnExportCSV) {
    btnExportCSV.addEventListener('click', () => {
      const list = getSubmissions();
      if (list.length === 0) {
        alert('Tidak ada data untuk diexport.');
        return;
      }

      const headers = [
        'Timestamp',
        'Nama Lengkap Peserta',
        'Tempat & Tgl Lahir',
        'Asal Sekolah',
        'Kelas',
        'Kategori Group',
        'No Telpon Ortu',
        'Sumber Informasi',
        'Siswa English 1',
        'English 1 Center',
        'Kategori Branch'
      ];

      const rows = list.map(item => [
        `"${item.timestamp}"`,
        `"${(item.fullName || '').replace(/"/g, '""')}"`,
        `"${(item.birthDetails || '').replace(/"/g, '""')}"`,
        `"${(item.schoolName || '').replace(/"/g, '""')}"`,
        `"${item.grade || ''}"`,
        `"${item.groupCategory || ''}"`,
        `"${item.parentPhone || ''}"`,
        `"${item.infoSource || ''}"`,
        `"${item.isEnglish1Student || ''}"`,
        `"${item.english1Center || ''}"`,
        `"${item.branchCategory || ''}"`
      ]);

      const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' 
        + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `Spelling_Bee_2026_Registration_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }

  // Clear All Data
  if (btnClearData) {
    btnClearData.addEventListener('click', () => {
      if (confirm('Apakah Anda yakin ingin menghapus SELURUH data pendaftaran yang tersimpan di browser ini?')) {
        localStorage.removeItem('spelling_bee_submissions');
        renderResponsesTable();
        updateResponseCount();
      }
    });
  }

  // Initial load
  updateResponseCount();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPaymentApp);
} else {
  initPaymentApp();
}
