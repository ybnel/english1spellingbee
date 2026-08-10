function initApp() {
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

  const welcomeScreen = document.getElementById('welcomeScreen');
  const btnStartRegistration = document.getElementById('btnStartRegistration');

  if (btnStartRegistration && welcomeScreen && form) {
    btnStartRegistration.addEventListener('click', () => {
      welcomeScreen.style.display = 'none';
      form.style.display = 'block';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

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

  // Restrict parentPhone & teacherPhone to numbers only
  const parentPhoneInput = document.getElementById('parentPhone');
  if (parentPhoneInput) {
    parentPhoneInput.addEventListener('input', (e) => {
      e.target.value = e.target.value.replace(/[^0-9]/g, '');
    });
  }

  const teacherPhoneInput = document.getElementById('teacherPhone');
  if (teacherPhoneInput) {
    teacherPhoneInput.addEventListener('input', (e) => {
      e.target.value = e.target.value.replace(/[^0-9]/g, '');
    });
  }

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

  // Clear Form handler
  clearButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      if (confirm('Are you sure you want to clear all fields in this form?')) {
        resetForm();
      }
    });
  });

  function resetForm() {
    form.reset();
    if (fileNameDisplay) fileNameDisplay.textContent = '';
    if (fileStatusBox) fileStatusBox.style.display = 'none';
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
    // Group 1: Bali Hayam Wuruk, Bali Kuta
    // Group 2: Bali Gianyar, Bali Gatsu
    const group1Centers = [
      'English 1 Bali Hayam Wuruk',
      'English 1 Bali Kuta'
    ];

    const isGroup1 = group1Centers.includes(center);
    let activeCard = null;

    if (isStudent === 'Ya' && isGroup1) {
      activeCard = branchStudentGroup1;
      currentCalculatedBranch = 'Siswa English 1 (Hayam Wuruk/ Kuta)';
    } else if (isStudent === 'Ya' && !isGroup1) {
      activeCard = branchStudentGroup2;
      currentCalculatedBranch = 'Siswa English 1 (Gianyar / Gatsu Barat)';
    } else if (isStudent === 'Tidak' && isGroup1) {
      activeCard = branchNonstudentGroup1;
      currentCalculatedBranch = 'Non-Siswa English 1 (Hayam Wuruk / Kuta)';
    } else {
      activeCard = branchNonstudentGroup2;
      currentCalculatedBranch = 'Non-Siswa English 1 (Gianyar / Gatsu Barat)';
    }

    if (activeCard) {
      const cutoffDate = new Date('2026-09-10T23:59:59');
      const isEarlyBird = new Date() <= cutoffDate;
      const detailsEl = activeCard.querySelector('.payment-details');
      const bankAccount = isGroup1 ? 'BCA 7730234443 PT. EDUKA BALI UTAMA' : 'BCA 3845205200 PT. Aplus Lorem Indo';
      const isStudentBool = isStudent === 'Ya';

      if (detailsEl) {
        if (isEarlyBird) {
          const fee = 'Rp. 200.000';
          detailsEl.innerHTML = `Early Bird Period (s.d 10 September 2026): <strong>${fee}</strong> | Transfer to bank account <strong>${bankAccount}</strong>`;
        } else {
          const fee = 'Rp. 250.000';
          detailsEl.innerHTML = `Normal Registration Period: <strong>${fee}</strong> | Transfer to bank account <strong>${bankAccount}</strong>`;
        }
      }

      activeCard.style.display = 'block';
      if (shouldScroll) {
        activeCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }

  if (english1CenterSelect) {
    english1CenterSelect.addEventListener('change', () => updateBranchCard(true));
  }

  // Robust validation helper for any section's cards
  function validateCardSection(section) {
    const cards = section.querySelectorAll('.form-card');
    let isValid = true;
    let firstErrorCard = null;

    cards.forEach(card => {
      if (card.dataset.required === 'true') {
        let fieldValid = true;

        // 1. Text, Tel, Email, File inputs
        const inputs = card.querySelectorAll('input:not([type="radio"]):not([type="checkbox"])');
        inputs.forEach(input => {
          if (input.type === 'file') {
            if (!input.files || input.files.length === 0) fieldValid = false;
          } else {
            if (!input.value.trim()) {
              fieldValid = false;
            } else if (input.type === 'email') {
              const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
              if (!emailRegex.test(input.value.trim())) fieldValid = false;
            }
          }
        });

        // 2. Select dropdowns
        const selects = card.querySelectorAll('select');
        selects.forEach(s => {
          if (!s.value) fieldValid = false;
        });

        // 3. Radio groups
        const radios = card.querySelectorAll('input[type="radio"]');
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

    if (!isValid && firstErrorCard) {
      setActiveCard(firstErrorCard);
      firstErrorCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    return isValid;
  }

  // Section 1 Validation & Navigation ("Berikutnya" / Next)
  function goToSection2() {
    if (!validateCardSection(section1)) return;

    // Switch to Section 2
    section1.style.display = 'none';
    section2.style.display = 'block';
    updateBranchCard();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  btnNext.addEventListener('click', goToSection2);

  // Section 2 "Kembali" Button
  btnBack.addEventListener('click', () => {
    section2.style.display = 'none';
    section1.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Handle Enter key: Move focus to the next input field in the active section
  form.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const activeElement = document.activeElement;
      if (!activeElement) return;

      const tagName = activeElement.tagName.toLowerCase();
      // Only intercept Enter key on input fields or select dropdowns (not submit buttons or textareas)
      if ((tagName === 'input' && activeElement.type !== 'submit' && activeElement.type !== 'button') || tagName === 'select') {
        e.preventDefault();

        // Determine current active section
        const activeSection = section1.style.display !== 'none' ? section1 : section2;

        // Find all visible, focusable input controls in the active section
        const focusableSelectors = 'input[type="text"], input[type="email"], input[type="tel"], select, input[type="radio"]';
        const allInputs = Array.from(activeSection.querySelectorAll(focusableSelectors));

        // Group radios so pressing Enter on a radio group skips to the next question
        const filteredInputs = [];
        const seenRadioNames = new Set();

        allInputs.forEach(input => {
          if (input.type === 'radio') {
            if (!seenRadioNames.has(input.name)) {
              seenRadioNames.add(input.name);
              filteredInputs.push(input);
            }
          } else {
            filteredInputs.push(input);
          }
        });

        // Find current index
        const currentIndex = filteredInputs.findIndex(el => {
          if (el.type === 'radio') {
            return el.name === activeElement.name;
          }
          return el === activeElement;
        });

        if (currentIndex !== -1 && currentIndex < filteredInputs.length - 1) {
          const nextInput = filteredInputs[currentIndex + 1];
          nextInput.focus();
          const card = nextInput.closest('.form-card');
          if (card) {
            setActiveCard(card);
            card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        } else if (activeSection === section1) {
          // If on the last field of Section 1, advance to Section 2
          goToSection2();
        }
      }
    }
  });

  // Final Form Submission Validation & Handler
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // If section 1 is currently active (e.g. user pressed Enter key in Section 1 text input)
    if (section1.style.display !== 'none') {
      goToSection2();
      return;
    }

    // Validate Section 2 inputs (file upload receipt)
    if (!validateCardSection(section2)) return;

    const formData = new FormData(form);
    const receiptFile = document.getElementById('paymentReceipt');
    let receiptFileName = receiptFile && receiptFile.files.length > 0 ? receiptFile.files[0].name : 'Tidak ada file';

    const submission = {
      id: Date.now(),
      timestamp: new Date().toLocaleString('id-ID'),
      formType: 'Kolektif Sekolah',
      targetSheet: 'Kolektif',
      fullName: formData.get('fullName'),
      birthDetails: formData.get('birthDetails'),
      schoolName: formData.get('schoolName'),
      grade: formData.get('grade'),
      groupCategory: formData.get('groupCategory'),
      parentName: formData.get('parentName'),
      parentPhone: formData.get('parentPhone'),
      email: formData.get('email'),
      teacherName: formData.get('teacherName'),
      teacherPhone: formData.get('teacherPhone'),
      infoSource: formData.get('infoSource'),
      isEnglish1Student: formData.get('isEnglish1Student'),
      english1Center: formData.get('english1Center'),
      branchCategory: currentCalculatedBranch,
      paymentReceipt: receiptFileName
    };

    saveSubmission(submission);

    // Send data & uploaded file to Google Sheets (Bali Region)
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

    // Send Response Receipt Email & Confirmation Email sequentially with 1.5s delay (info.ef@edukagroup.com)
    sendResponseReceiptEmail(submission)
      .then((res1) => {
        console.log('Email 1 (Copy Receipt) result:', res1);
        return new Promise(resolve => setTimeout(resolve, 1500));
      })
      .then(() => {
        console.log('Mengirim Email 2 (Terima Kasih + Banner)...');
        return sendConfirmationEmail(submission);
      })
      .then((res2) => {
        console.log('Email 2 (Konfirmasi) result:', res2);
      })
      .catch(err => console.error('Error pengiriman email:', err));

    // Show Success View
    form.style.display = 'none';
    successView.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
    updateResponseCount();
  });

  // PHP Email Receipt Sender (info.ef@edukagroup.com)
  function sendResponseReceiptEmail(payload) {
    if (!payload.email) return Promise.resolve(null);

    return fetch('./api/send-email.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    }).then(res => res.json())
      .then(data => {
        console.log('Response Receipt Email status:', data);
        return data;
      })
      .catch(err => {
        console.error('Gagal mengirim email response receipt:', err);
        return null;
      });
  }

  // PHP Email Confirmation Sender with Banner (info.ef@edukagroup.com)
  function sendConfirmationEmail(payload) {
    if (!payload.email) return Promise.resolve(null);

    return fetch('./api/send-confirmation-email.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    }).then(res => res.json())
      .then(data => {
        console.log('Confirmation Email status:', data);
        return data;
      })
      .catch(err => {
        console.error('Gagal mengirim email konfirmasi:', err);
        return null;
      });
  }

  // Google Sheets Webhook Sender
  // Web App URL Google Apps Script Regional Bali
  const GOOGLE_SCRIPT_URL_BALI = 'https://script.google.com/macros/s/AKfycbz2k2PP8Dp7_6gtvh_AqjvqeJrdU7ddUWxW9DeUIrlNWn9sAzMVJe70AzkYKgEFMCWOww/exec';

  function sendDataToGoogleSheets(payload) {
    if (!GOOGLE_SCRIPT_URL_BALI) return;

    fetch(GOOGLE_SCRIPT_URL_BALI, {
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
          <td colspan="15" style="text-align:center; padding: 20px; color: #70757a;">Belum ada pendaftaran.</td>
        </tr>
      `;
      return;
    }

    responsesTableBody.innerHTML = list.map(item => `
      <tr>
        <td>${escapeHtml(item.timestamp)}</td>
        <td><strong>${escapeHtml(item.fullName)}</strong></td>
        <td>${escapeHtml(item.birthDetails)}</td>
        <td>${escapeHtml(item.citizenshipStatus)}</td>
        <td>${escapeHtml(item.schoolName)}</td>
        <td>${escapeHtml(item.grade)}</td>
        <td>${escapeHtml(item.groupCategory)}</td>
        <td>${escapeHtml(item.parentName)}</td>
        <td>${escapeHtml(item.parentPhone)}</td>
        <td>${escapeHtml(item.email)}</td>
        <td>${escapeHtml(item.teacherName)}</td>
        <td>${escapeHtml(item.teacherPhone)}</td>
        <td>${escapeHtml(item.infoSource)}</td>
        <td>${escapeHtml(item.isEnglish1Student)}</td>
        <td>${escapeHtml(item.english1Center)}</td>
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
        'Status WNI/WNA',
        'Asal Sekolah',
        'Kelas',
        'Kategori Group',
        'Nama Orang Tua',
        'No WA Ortu',
        'Email Ortu',
        'Nama Guru Pendamping',
        'No WA Guru',
        'Sumber Informasi',
        'Siswa English 1',
        'English 1 Center'
      ];

      const rows = list.map(item => [
        `"${item.timestamp}"`,
        `"${(item.fullName || '').replace(/"/g, '""')}"`,
        `"${(item.birthDetails || '').replace(/"/g, '""')}"`,
        `"${(item.citizenshipStatus || '').replace(/"/g, '""')}"`,
        `"${(item.schoolName || '').replace(/"/g, '""')}"`,
        `"${item.grade || ''}"`,
        `"${item.groupCategory || ''}"`,
        `"${(item.parentName || '').replace(/"/g, '""')}"`,
        `"${item.parentPhone || ''}"`,
        `"${item.email || ''}"`,
        `"${(item.teacherName || '').replace(/"/g, '""')}"`,
        `"${item.teacherPhone || ''}"`,
        `"${item.infoSource || ''}"`,
        `"${item.isEnglish1Student || ''}"`,
        `"${item.english1Center || ''}"`
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
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
