function initApp() {
  const form = document.getElementById('spellingBeeForm');
  const cards = document.querySelectorAll('.form-card');
  const section1 = document.getElementById('section1');
  const btnNext = document.getElementById('btnNext');
  const btnClearForm = document.getElementById('btnClearForm');

  const welcomeScreen = document.getElementById('welcomeScreen');
  const btnStartRegistration = document.getElementById('btnStartRegistration');

  if (btnStartRegistration && welcomeScreen && form) {
    btnStartRegistration.addEventListener('click', () => {
      welcomeScreen.style.display = 'none';
      form.style.display = 'block';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Restore saved Section 1 draft from sessionStorage if available
  restoreSection1Draft();

  function restoreSection1Draft() {
    const draftRaw = sessionStorage.getItem('spelling_bee_temp_section1');
    if (!draftRaw || !form) return;

    try {
      const draft = JSON.parse(draftRaw);
      if (welcomeScreen && form) {
        welcomeScreen.style.display = 'none';
        form.style.display = 'block';
      }

      if (draft.fullName) document.getElementById('fullName').value = draft.fullName;
      if (draft.email) document.getElementById('email').value = draft.email;
      if (draft.birthPlace && document.getElementById('birthPlace')) document.getElementById('birthPlace').value = draft.birthPlace;
      if (draft.birthDate && document.getElementById('birthDate')) document.getElementById('birthDate').value = draft.birthDate;
      if (draft.schoolName) document.getElementById('schoolName').value = draft.schoolName;
      if (draft.grade) document.getElementById('grade').value = draft.grade;
      if (draft.groupCategory) document.getElementById('groupCategory').value = draft.groupCategory;
      if (draft.parentPhone) document.getElementById('parentPhone').value = draft.parentPhone;
      if (draft.english1Center) document.getElementById('english1Center').value = draft.english1Center;

      if (draft.infoSource) {
        const radio = form.querySelector(`input[name="infoSource"][value="${draft.infoSource}"]`);
        if (radio) radio.checked = true;
      }
      if (draft.isEnglish1Student) {
        const radio = form.querySelector(`input[name="isEnglish1Student"][value="${draft.isEnglish1Student}"]`);
        if (radio) radio.checked = true;
      }
    } catch (e) {
      console.error('Failed to restore draft:', e);
    }
  }

  // Active card highlight & error removal logic
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

  // Clear Form handler
  if (btnClearForm) {
    btnClearForm.addEventListener('click', () => {
      if (confirm('Are you sure you want to clear all fields in this form?')) {
        form.reset();
        sessionStorage.removeItem('spelling_bee_temp_section1');
        cards.forEach(c => {
          c.classList.remove('error-state');
          c.classList.remove('active');
        });
        const titleCard = section1.querySelector('.title-card');
        if (titleCard) titleCard.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  // Section 1 Validation helper
  function validateCardSection(section) {
    const secCards = section.querySelectorAll('.form-card');
    let isValid = true;
    let firstErrorCard = null;

    secCards.forEach(card => {
      if (card.dataset.required === 'true') {
        let fieldValid = true;

        // 1. Text, Tel, Email inputs
        const inputs = card.querySelectorAll('input:not([type="radio"]):not([type="checkbox"])');
        inputs.forEach(input => {
          if (!input.value.trim()) fieldValid = false;
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

  // Form Submit Handler (Next button)
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!validateCardSection(section1)) return;

    const formData = new FormData(form);

    const rawBirthPlace = formData.get('birthPlace') || '';
    const rawBirthDate = formData.get('birthDate') || '';

    // Format date nicely (e.g. "2018-05-22" -> "22 Mei 2018")
    let formattedBirthDate = rawBirthDate;
    if (rawBirthDate) {
      const parts = rawBirthDate.split('-');
      if (parts.length === 3) {
        const year = parts[0];
        const monthNames = [
          'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
          'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
        ];
        const monthIndex = parseInt(parts[1], 10) - 1;
        const day = parseInt(parts[2], 10);
        if (monthIndex >= 0 && monthIndex < 12) {
          formattedBirthDate = `${day} ${monthNames[monthIndex]} ${year}`;
        }
      }
    }

    const combinedBirthDetails = rawBirthPlace && formattedBirthDate 
      ? `${rawBirthPlace}, ${formattedBirthDate}` 
      : (rawBirthPlace || formattedBirthDate || '');

    const sec1Data = {
      fullName: formData.get('fullName'),
      email: formData.get('email'),
      birthPlace: rawBirthPlace,
      birthDate: rawBirthDate,
      birthDetails: combinedBirthDetails,
      schoolName: formData.get('schoolName'),
      grade: formData.get('grade'),
      groupCategory: formData.get('groupCategory'),
      parentPhone: formData.get('parentPhone'),
      infoSource: formData.get('infoSource'),
      isEnglish1Student: formData.get('isEnglish1Student'),
      english1Center: formData.get('english1Center')
    };

    // Save Section 1 data to sessionStorage
    sessionStorage.setItem('spelling_bee_temp_section1', JSON.stringify(sec1Data));

    // Navigate to Section 2 (payment.html)
    window.location.href = 'payment.html';
  });

  // Responses Modal Elements & Handlers
  const responseCountText = document.getElementById('responseCountText');
  const btnOpenResponses = document.getElementById('btnOpenResponses');
  const responsesModal = document.getElementById('responsesModal');
  const btnCloseModal = document.getElementById('btnCloseModal');
  const responsesTableBody = document.getElementById('responsesTableBody');
  const btnExportCSV = document.getElementById('btnExportCSV');
  const btnClearData = document.getElementById('btnClearData');

  function getSubmissions() {
    const data = localStorage.getItem('spelling_bee_submissions');
    return data ? JSON.parse(data) : [];
  }

  function updateResponseCount() {
    const list = getSubmissions();
    if (responseCountText) {
      responseCountText.textContent = `${list.length} Jawaban tersimpan secara lokal`;
    }
  }

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

  if (btnClearData) {
    btnClearData.addEventListener('click', () => {
      if (confirm('Apakah Anda yakin ingin menghapus SELURUH data pendaftaran yang tersimpan di browser ini?')) {
        localStorage.removeItem('spelling_bee_submissions');
        renderResponsesTable();
        updateResponseCount();
      }
    });
  }

  updateResponseCount();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
