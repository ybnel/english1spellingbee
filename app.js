document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('spellingBeeForm');
  const cards = document.querySelectorAll('.form-card');
  const section1 = document.getElementById('section1');
  const section2 = document.getElementById('section2');
  const successView = document.getElementById('successView');
  
  const btnNext = document.getElementById('btnNext');
  const btnBack = document.getElementById('btnBack');
  const btnSubmitAnother = document.getElementById('btnSubmitAnother');
  const clearButtons = document.querySelectorAll('.btn-clear-all');
  const english1CenterSelect = document.getElementById('english1Center');

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

  const paymentReceiptInput = document.getElementById('paymentReceipt');
  const fileNameDisplay = document.getElementById('fileNameDisplay');

  if (paymentReceiptInput && fileNameDisplay) {
    paymentReceiptInput.addEventListener('change', () => {
      if (paymentReceiptInput.files && paymentReceiptInput.files.length > 0) {
        fileNameDisplay.textContent = paymentReceiptInput.files[0].name;
        const uploadCard = paymentReceiptInput.closest('.form-card');
        if (uploadCard) uploadCard.classList.remove('error-state');
      } else {
        fileNameDisplay.textContent = '';
      }
    });
  }

  // Clear Form handler
  clearButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      if (confirm('Apakah Anda yakin ingin mengosongkan semua isian formulir ini?')) {
        resetForm();
      }
    });
  });

  function resetForm() {
    form.reset();
    if (fileNameDisplay) fileNameDisplay.textContent = '';
    cards.forEach(c => {
      c.classList.remove('error-state');
      c.classList.remove('active');
    });
    allBranchCards.forEach(card => card.style.display = 'none');
    section2.style.display = 'none';
    section1.style.display = 'block';
    const titleCard = section1.querySelector('.title-card');
    if (titleCard) titleCard.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Calculate & Show Branch Info Card based on Student status + Center choice
  function updateBranchCard(shouldScroll = false) {
    const formData = new FormData(form);
    const isStudent = formData.get('isEnglish1Student'); // "Ya" or "Tidak"
    const center = formData.get('english1Center'); // Center choice

    allBranchCards.forEach(card => card.style.display = 'none');
    currentCalculatedBranch = '';

    if (!center) return;

    // Group Centers:
    // Group 1: Plaza Surabaya, Jemursari, Galaxy Mall, Purimas
    // Group 2: Bukit Mas, Pakuwon Mall
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
      if (shouldScroll) {
        activeCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }

  if (english1CenterSelect) {
    english1CenterSelect.addEventListener('change', () => updateBranchCard(true));
  }

  // Section 1 Validation & Navigation ("Berikutnya")
  btnNext.addEventListener('click', () => {
    const sec1Cards = section1.querySelectorAll('.form-card');
    let isValid = true;
    let firstErrorCard = null;

    sec1Cards.forEach(card => {
      if (card.dataset.required === 'true') {
        const textInputs = card.querySelectorAll('input[type="text"], input[type="tel"]');
        const selects = card.querySelectorAll('select');
        const radios = card.querySelectorAll('input[type="radio"]');

        let fieldValid = true;

        if (textInputs.length > 0) {
          textInputs.forEach(i => {
            if (!i.value.trim()) fieldValid = false;
          });
        }

        if (selects.length > 0) {
          selects.forEach(s => {
            if (!s.value) fieldValid = false;
          });
        }

        if (radios.length > 0) {
          const checked = Array.from(radios).some(r => r.checked);
          if (!checked) fieldValid = false;
        }

        if (!fieldValid) {
          isValid = false;
          card.classList.add('error-state');
          if (!firstErrorCard) {
            firstErrorCard = card;
          }
        } else {
          card.classList.remove('error-state');
        }
      }
    });

    if (!isValid) {
      if (firstErrorCard) {
        setActiveCard(firstErrorCard);
        firstErrorCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // Switch to Section 2
    section1.style.display = 'none';
    section2.style.display = 'block';
    updateBranchCard();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Section 2 "Kembali" Button
  btnBack.addEventListener('click', () => {
    section2.style.display = 'none';
    section1.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Final Form Submission Validation & Handler
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Validate Section 2 inputs (e.g., english1Center)
    const sec2Cards = section2.querySelectorAll('.form-card');
    let isValid = true;
    let firstErrorCard = null;

    sec2Cards.forEach(card => {
      if (card.dataset.required === 'true') {
        const textInputs = card.querySelectorAll('input[type="text"], input[type="tel"]');
        const selects = card.querySelectorAll('select');
        const radios = card.querySelectorAll('input[type="radio"]');

        let fieldValid = true;

        if (textInputs.length > 0) {
          textInputs.forEach(i => {
            if (!i.value.trim()) fieldValid = false;
          });
        }

        if (selects.length > 0) {
          selects.forEach(s => {
            if (!s.value) fieldValid = false;
          });
        }

        if (radios.length > 0) {
          const checked = Array.from(radios).some(r => r.checked);
          if (!checked) fieldValid = false;
        }

        if (!fieldValid) {
          isValid = false;
          card.classList.add('error-state');
          if (!firstErrorCard) {
            firstErrorCard = card;
          }
        } else {
          card.classList.remove('error-state');
        }
      }
    });

    if (!isValid) {
      if (firstErrorCard) {
        setActiveCard(firstErrorCard);
        firstErrorCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    const formData = new FormData(form);
    const receiptFile = document.getElementById('paymentReceipt');
    let receiptFileName = receiptFile && receiptFile.files.length > 0 ? receiptFile.files[0].name : 'Tidak ada file';

    const submission = {
      id: Date.now(),
      timestamp: new Date().toLocaleString('id-ID'),
      fullName: formData.get('fullName'),
      email: formData.get('email'),
      birthDetails: formData.get('birthDetails'),
      schoolName: formData.get('schoolName'),
      grade: formData.get('grade'),
      groupCategory: formData.get('groupCategory'),
      parentPhone: formData.get('parentPhone'),
      infoSource: formData.get('infoSource'),
      isEnglish1Student: formData.get('isEnglish1Student'),
      english1Center: formData.get('english1Center'),
      branchCategory: currentCalculatedBranch,
      paymentReceipt: receiptFileName
    };

    saveSubmission(submission);

    // Send data & uploaded file to Google Sheets (Surabaya Region)
    const receiptInput = document.getElementById('paymentReceipt');
    if (receiptInput && receiptInput.files.length > 0) {
      const file = receiptInput.files[0];
      const reader = new FileReader();
      reader.onload = function(evt) {
        const fileBase64 = evt.target.result.split(',')[1];
        sendDataToGoogleSheets({
          ...submission,
          fileName: file.name,
          fileType: file.type,
          fileData: fileBase64
        });
      };
      reader.readAsDataURL(file);
    } else {
      sendDataToGoogleSheets(submission);
    }

    // Show Success View
    form.style.display = 'none';
    successView.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
    updateResponseCount();
  });

  // Google Sheets Webhook Sender
  // Web App URL Google Apps Script Surabaya
  const GOOGLE_SCRIPT_URL_SURABAYA = 'https://script.google.com/macros/s/AKfycbyQym6DmlPm2hxeT3ELSu9BqHff-qL_BIHEA6fJmc4UTCMZKcJHA1VZxlisC6jq_30ScA/exec';

  function sendDataToGoogleSheets(payload) {
    if (!GOOGLE_SCRIPT_URL_SURABAYA) return;

    fetch(GOOGLE_SCRIPT_URL_SURABAYA, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    }).then(() => {
      console.log('Data pendaftaran berhasil dikirim ke Google Sheets.');
    }).catch(err => {
      console.error('Gagal mengirim data ke Google Sheets:', err);
    });
  }

  // Submit Another Response
  btnSubmitAnother.addEventListener('click', (e) => {
    e.preventDefault();
    resetForm();
    successView.style.display = 'none';
    form.style.display = 'block';
  });

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
        `"${item.fullName.replace(/"/g, '""')}"`,
        `"${item.birthDetails.replace(/"/g, '""')}"`,
        `"${item.schoolName.replace(/"/g, '""')}"`,
        `"${item.grade}"`,
        `"${item.groupCategory}"`,
        `"${item.parentPhone}"`,
        `"${item.infoSource}"`,
        `"${item.isEnglish1Student}"`,
        `"${item.english1Center}"`,
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
});
