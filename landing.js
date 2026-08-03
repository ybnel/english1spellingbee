function initLandingApp() {
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
  document.addEventListener('DOMContentLoaded', initLandingApp);
} else {
  initLandingApp();
}
