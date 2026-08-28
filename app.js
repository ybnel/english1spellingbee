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
  const isStudentRadios = document.querySelectorAll('input[name="isEnglish1Student"]');

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

  // Restrict parentPhone to numbers only
  const parentPhoneInput = document.getElementById('parentPhone');
  if (parentPhoneInput) {
    parentPhoneInput.addEventListener('input', (e) => {
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

  // Calculate & Show Branch Info Card based on Student status (Malang)
  function updateBranchCard(shouldScroll = false) {
    const formData = new FormData(form);
    const isStudent = formData.get('isEnglish1Student'); // "Ya" or "Tidak"
    const cutoffDate = new Date('2026-09-25T23:59:59');
    const isEarlyBird = new Date() <= cutoffDate;

    allBranchCards.forEach(card => card.style.display = 'none');
    currentCalculatedBranch = '';

    if (!isStudent) return;

    let activeCard = null;
    const isStudentBool = isStudent === 'Ya';

    if (isStudentBool) {
      activeCard = branchStudentGroup1;
      currentCalculatedBranch = isEarlyBird
        ? 'Siswa English 1 (Early Bird) - Rp 100.000'
        : 'Siswa English 1 (Normal) - Rp 125.000';
    } else {
      activeCard = branchNonstudentGroup1;
      currentCalculatedBranch = isEarlyBird
        ? 'Non-Siswa English 1 (Early Bird) - Rp 200.000'
        : 'Non-Siswa English 1 (Normal) - Rp 250.000';
    }

    if (activeCard) {
      const detailsEl = activeCard.querySelector('.payment-details');
      const bankAccount = 'BCA 0113100777 PT. Eduka Bahasa Utama';

      if (detailsEl) {
        if (isEarlyBird) {
          const fee = isStudentBool ? 'Rp 100.000' : 'Rp 200.000';
          detailsEl.innerHTML = `Early Bird Period (s.d tgl 25 September 2026): <strong>${fee}</strong> | Transfer to bank account <strong>${bankAccount}</strong>`;
        } else {
          const fee = isStudentBool ? 'Rp 125.000' : 'Rp 250.000';
          detailsEl.innerHTML = `Normal Registration Period: <strong>${fee}</strong> | Transfer to bank account <strong>${bankAccount}</strong>`;
        }
      }

      activeCard.style.display = 'block';
      if (shouldScroll) {
        activeCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }

  isStudentRadios.forEach(radio => {
    radio.addEventListener('change', () => updateBranchCard(true));
  });

  if (english1CenterSelect) {
    english1CenterSelect.addEventListener('change', () => updateBranchCard(false));
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

        // 4. Checkbox groups
        const checkboxes = card.querySelectorAll('input[type="checkbox"]');
        if (checkboxes.length > 0) {
          const checked = Array.from(checkboxes).some(cb => cb.checked);
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

  // Helper to compress image files before Base64 encoding (prevents payload limit timeouts)
  function compressAndBase64(file) {
    return new Promise((resolve) => {
      if (!file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result.split(',')[1]);
        reader.onerror = () => resolve('');
        reader.readAsDataURL(file);
        return;
      }

      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e) => {
        img.onload = () => {
          const maxDim = 1200;
          let width = img.width;
          let height = img.height;

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          const dataUrl = canvas.toDataURL('image/jpeg', 0.75);
          resolve(dataUrl.split(',')[1]);
        };
        img.onerror = () => resolve(e.target.result.split(',')[1]);
        img.src = e.target.result;
      };

      reader.onerror = () => resolve('');
      reader.readAsDataURL(file);
    });
  }

  let isSubmitting = false;

  // Final Form Submission Validation & Handler (Identical to Lombok structure)
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // If section 1 is currently active (e.g. user pressed Enter key in Section 1 text input)
    if (section1.style.display !== 'none') {
      goToSection2();
      return;
    }

    // Prevent double submission
    if (isSubmitting) return;

    // Validate Section 2 inputs (file upload receipt)
    if (!validateCardSection(section2)) return;

    isSubmitting = true;

    const btnSubmit = document.getElementById('btnSubmit');
    if (btnSubmit) {
      btnSubmit.disabled = true;
      btnSubmit.textContent = 'Memproses Pendaftaran...';
    }

    const formData = new FormData(form);
    const receiptFile = document.getElementById('paymentReceipt');
    let receiptFileName = receiptFile && receiptFile.files.length > 0 ? receiptFile.files[0].name : 'Tidak ada file';

    const submission = {
      id: Date.now(),
      timestamp: new Date().toLocaleString('id-ID'),
      targetSheet: 'Individu',
      fullName: formData.get('fullName'),
      birthDetails: formData.get('birthDetails'),
      schoolName: formData.get('schoolName'),
      grade: formData.get('grade'),
      groupCategory: formData.get('groupCategory'),
      parentName: formData.get('parentName') || '-',
      parentPhone: formData.get('parentPhone'),
      address: formData.get('address') || '-',
      email: formData.get('email'),
      infoSource: formData.get('infoSource'),
      isEnglish1Student: formData.get('isEnglish1Student'),
      english1Center: formData.get('english1Center') || 'Malang 1 Ijen',
      branchCategory: currentCalculatedBranch,
      paymentReceipt: receiptFileName
    };

    // Function to execute sending to Google Sheets and then emails (Lombok Architecture)
    function processSubmission(finalPayload) {
      sendDataToGoogleSheets(finalPayload)
        .then(gasResult => {
          if (gasResult && gasResult.fileUrl) {
            submission.paymentReceipt = gasResult.fileUrl;
          }
          saveSubmission(submission);
          updateResponseCount();

          // Send Response Receipt Email & Confirmation Email sequentially
          return sendResponseReceiptEmail(submission);
        })
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
        .catch(err => {
          console.error('Error pengiriman data/email:', err);
          saveSubmission(submission);
          updateResponseCount();
        })
        .finally(() => {
          isSubmitting = false;
          if (btnSubmit) {
            btnSubmit.disabled = false;
            btnSubmit.textContent = 'Submit';
          }
        });

      // Show Success View immediately
      form.style.display = 'none';
      successView.style.display = 'block';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Convert file with compression if uploaded, then process submission
    const receiptInput = document.getElementById('paymentReceipt');
    if (receiptInput && receiptInput.files.length > 0) {
      const file = receiptInput.files[0];
      compressAndBase64(file).then(fileBase64 => {
        processSubmission({
          ...submission,
          fileName: file.name,
          fileType: file.type.startsWith('image/') ? 'image/jpeg' : file.type,
          fileData: fileBase64
        });
      });
    } else {
      processSubmission(submission);
    }
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
  // Web App URL Google Apps Script Regional Malang
  const GOOGLE_SCRIPT_URL_MALANG = 'https://script.google.com/macros/s/AKfycbzK9L8seGojo5rYZQ8EjDarFGf4f1_gW2Ct8OIEe1nke_XelmrBE_zWeQ2-HCQwqnM/exec';

  function sendDataToGoogleSheets(payload) {
    if (!GOOGLE_SCRIPT_URL_MALANG) return Promise.resolve(null);

    return fetch(GOOGLE_SCRIPT_URL_MALANG, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(data => {
        console.log('Data pendaftaran berhasil dikirim ke Google Sheets Malang:', data);
        return data;
      })
      .catch(err => {
        console.warn('Gagal membaca response JSON dari Google Sheets Malang, mencoba fallback Text/No-CORS:', err);
        return fetch(GOOGLE_SCRIPT_URL_MALANG, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }).then(() => null).catch(() => null);
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
        <td>${escapeHtml(item.schoolName)}</td>
        <td>${escapeHtml(item.grade)}</td>
        <td>${escapeHtml(item.groupCategory)}</td>
        <td>${escapeHtml(item.parentName || '-')}</td>
        <td>${escapeHtml(item.email)}</td>
        <td>${escapeHtml(item.parentPhone)}</td>
        <td>${escapeHtml(item.address || '-')}</td>
        <td>${escapeHtml(item.infoSource)}</td>
        <td>${escapeHtml(item.isEnglish1Student)}</td>
        <td>${escapeHtml(item.english1Center || '-')}</td>
        <td><span style="background:#fceef4; color:#e00078; padding:2px 6px; border-radius:4px; font-weight:500;">${escapeHtml(item.branchCategory || '-')}</span></td>
        <td>${item.paymentReceipt && item.paymentReceipt.startsWith('http') ? `<a href="${escapeHtml(item.paymentReceipt)}" target="_blank" rel="noopener noreferrer" style="color:#e00078; font-weight:600; text-decoration:underline;">Lihat Bukti (Drive) 🔗</a>` : escapeHtml(item.paymentReceipt || '-')}</td>
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
      doExportCSV(getSubmissions());
    });
  }

  function doExportCSV(list) {
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
      'Nama Orang Tua',
      'Email Orang Tua',
      'No Telpon Ortu',
      'Alamat Lengkap Peserta',
      'Sumber Informasi',
      'Siswa English 1',
      'English 1 Center',
      'Kategori Branch',
      'Bukti Transfer'
    ];

    const rows = list.map(item => [
      `"${item.timestamp}"`,
      `"${(item.fullName || '').replace(/"/g, '""')}"`,
      `"${(item.birthDetails || '').replace(/"/g, '""')}"`,
      `"${(item.schoolName || '').replace(/"/g, '""')}"`,
      `"${item.grade || ''}"`,
      `"${item.groupCategory || ''}"`,
      `"${(item.parentName || '-').replace(/"/g, '""')}"`,
      `"${(item.email || '').replace(/"/g, '""')}"`,
      `"${item.parentPhone || ''}"`,
      `"${(item.address || '-').replace(/"/g, '""')}"`,
      `"${item.infoSource || ''}"`,
      `"${item.isEnglish1Student || ''}"`,
      `"${item.english1Center || ''}"`,
      `"${item.branchCategory || ''}"`,
      `"${(item.paymentReceipt || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' 
      + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Spelling_Bee_2026_Malang_Registration_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
