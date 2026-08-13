document.addEventListener("DOMContentLoaded", function () {
  const welcomeScreen = document.getElementById("welcomeScreen");
  const form = document.getElementById("spellingBeeForm");
  const section1 = document.getElementById("section1");
  const section2 = document.getElementById("section2");
  const successView = document.getElementById("successView");

  const btnStartRegistration = document.getElementById("btnStartRegistration");
  const btnNext = document.getElementById("btnNext");
  const btnBack = document.getElementById("btnBack");
  const btnSubmit = document.getElementById("btnSubmit");
  const btnSubmitAnother = document.getElementById("btnSubmitAnother");
  const btnClearAll = document.querySelectorAll(".btn-clear-all");

  const fileInput = document.getElementById("paymentReceipt");
  const btnGalleryUpload = document.getElementById("btnGalleryUpload");
  const fileStatusBox = document.getElementById("fileStatusBox");
  const fileNameDisplay = document.getElementById("fileNameDisplay");
  const btnRemoveFile = document.getElementById("btnRemoveFile");

  const responsesModal = document.getElementById("responsesModal");
  const btnOpenResponses = document.getElementById("btnOpenResponses");
  const btnCloseModal = document.getElementById("btnCloseModal");
  const responsesTableBody = document.getElementById("responsesTableBody");
  const responseCountText = document.getElementById("responseCountText");
  const btnExportCSV = document.getElementById("btnExportCSV");
  const btnClearData = document.getElementById("btnClearData");

  // Dynamic Payment Branches
  const isEnglish1StudentRadios = document.getElementsByName("isEnglish1Student");
  const centerSelect = document.getElementById("english1Center");

  const branchCards = {
    studentGroup1: document.getElementById("branch-student-group1"),
    studentGroup2: document.getElementById("branch-student-group2"),
    nonstudentGroup1: document.getElementById("branch-nonstudent-group1"),
    nonstudentGroup2: document.getElementById("branch-nonstudent-group2")
  };

  // Group 2 centers list (Bukit Mas, Pakuwon Mall)
  const group2Centers = ["English 1 Bukit Mas", "English 1 Pakuwon Mall"];

  function updatePaymentBranch() {
    // Hide all payment cards first
    Object.values(branchCards).forEach(card => {
      if (card) card.style.display = "none";
    });

    const selectedStudent = Array.from(isEnglish1StudentRadios).find(r => r.checked)?.value;
    const selectedCenter = centerSelect ? centerSelect.value : "";

    if (!selectedStudent || !selectedCenter) return;

    const isStudent = selectedStudent === "Ya";
    const isGroup2 = group2Centers.includes(selectedCenter);

    if (isStudent && !isGroup2) {
      if (branchCards.studentGroup1) branchCards.studentGroup1.style.display = "block";
    } else if (isStudent && isGroup2) {
      if (branchCards.studentGroup2) branchCards.studentGroup2.style.display = "block";
    } else if (!isStudent && !isGroup2) {
      if (branchCards.nonstudentGroup1) branchCards.nonstudentGroup1.style.display = "block";
    } else if (!isStudent && isGroup2) {
      if (branchCards.nonstudentGroup2) branchCards.nonstudentGroup2.style.display = "block";
    }
  }

  // Add change listeners for dynamic branch calculation
  Array.from(isEnglish1StudentRadios).forEach(radio => radio.addEventListener("change", updatePaymentBranch));
  if (centerSelect) centerSelect.addEventListener("change", updatePaymentBranch);

  // File Upload Handlers
  if (btnGalleryUpload && fileInput) {
    btnGalleryUpload.addEventListener("click", () => fileInput.click());
  }

  if (fileInput) {
    fileInput.addEventListener("change", function () {
      if (this.files && this.files[0]) {
        const file = this.files[0];
        if (fileNameDisplay) fileNameDisplay.textContent = file.name;
        if (fileStatusBox) fileStatusBox.style.display = "flex";
        // Clear error if file selected
        const card = fileInput.closest("[data-card]");
        if (card) card.classList.remove("invalid");
      }
    });
  }

  if (btnRemoveFile && fileInput) {
    btnRemoveFile.addEventListener("click", function () {
      fileInput.value = "";
      if (fileNameDisplay) fileNameDisplay.textContent = "";
      if (fileStatusBox) fileStatusBox.style.display = "none";
    });
  }

  // Card validation helper
  function validateSection(sectionEl) {
    let isValid = true;
    let firstInvalidCard = null;

    const cards = sectionEl.querySelectorAll("[data-card][data-required='true']");
    cards.forEach(card => {
      let cardValid = true;
      const inputs = card.querySelectorAll("input, select, textarea");

      inputs.forEach(input => {
        if (input.type === "radio") {
          const groupName = input.name;
          const radioGroup = card.querySelectorAll(`input[name="${groupName}"]`);
          const isChecked = Array.from(radioGroup).some(r => r.checked);
          if (!isChecked) cardValid = false;
        } else if (input.type === "file") {
          if (!input.files || input.files.length === 0) cardValid = false;
        } else {
          if (!input.value.trim()) cardValid = false;
        }
      });

      if (!cardValid) {
        card.classList.add("invalid");
        isValid = false;
        if (!firstInvalidCard) firstInvalidCard = card;
      } else {
        card.classList.remove("invalid");
      }
    });

    if (firstInvalidCard) {
      firstInvalidCard.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    return isValid;
  }

  // Remove invalid state on user interaction
  form.querySelectorAll("input, select, textarea").forEach(input => {
    input.addEventListener("input", function () {
      const card = this.closest("[data-card]");
      if (card) card.classList.remove("invalid");
    });
    input.addEventListener("change", function () {
      const card = this.closest("[data-card]");
      if (card) card.classList.remove("invalid");
    });
  });

  // Next Button Click
  if (btnNext) {
    btnNext.addEventListener("click", function () {
      if (validateSection(section1)) {
        section1.style.display = "none";
        section2.style.display = "block";
        updatePaymentBranch();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  }

  // Back Button Click
  if (btnBack) {
    btnBack.addEventListener("click", function () {
      section2.style.display = "none";
      section1.style.display = "block";
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // Clear Form Buttons
  btnClearAll.forEach(btn => {
    btn.addEventListener("click", function () {
      form.reset();
      if (fileInput) fileInput.value = "";
      if (fileStatusBox) fileStatusBox.style.display = "none";
      form.querySelectorAll(".invalid").forEach(el => el.classList.remove("invalid"));
      Object.values(branchCards).forEach(card => {
        if (card) card.style.display = "none";
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

  // Form Submit Handler
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    if (!validateSection(section2)) return;

    const formData = new FormData(form);
    const responseObj = {
      timestamp: new Date().toLocaleString("id-ID"),
      fullName: formData.get("fullName") || "-",
      email: formData.get("email") || "-",
      birthDetails: formData.get("birthDetails") || "-",
      schoolName: formData.get("schoolName") || "-",
      grade: formData.get("grade") || "-",
      groupCategory: formData.get("groupCategory") || "-",
      parentPhone: formData.get("parentPhone") || "-",
      infoSource: formData.get("infoSource") || "-",
      isEnglish1Student: formData.get("isEnglish1Student") || "-",
      english1Center: formData.get("english1Center") || "-",
      fileName: fileInput && fileInput.files[0] ? fileInput.files[0].name : "-"
    };

    // Store in localStorage
    saveResponseLocally(responseObj);

    // Send copy response receipt email via API backend
    try {
      const payload = {
        email: formData.get("email") || "",
        fullName: formData.get("fullName") || "",
        birthDetails: formData.get("birthDetails") || "",
        schoolName: formData.get("schoolName") || "",
        grade: formData.get("grade") || "",
        groupCategory: formData.get("groupCategory") || "",
        parentPhone: formData.get("parentPhone") || "",
        isEnglish1Student: formData.get("isEnglish1Student") || "",
        english1Center: formData.get("english1Center") || "",
        paymentReceipt: fileInput && fileInput.files[0] ? fileInput.files[0].name : "Terlampir"
      };

      fetch("./api/send-email.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      }).catch(err => console.warn("Email API notice:", err));
    } catch (err) {
      console.warn("Email API notice:", err);
    }

    // Show Success Screen
    section2.style.display = "none";
    form.style.display = "none";
    if (welcomeScreen) welcomeScreen.style.display = "none";
    if (successView) successView.style.display = "block";
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // Submit Another Response
  if (btnSubmitAnother) {
    btnSubmitAnother.addEventListener("click", function (e) {
      e.preventDefault();
      form.reset();
      if (fileInput) fileInput.value = "";
      if (fileStatusBox) fileStatusBox.style.display = "none";
      if (successView) successView.style.display = "none";
      if (welcomeScreen) welcomeScreen.style.display = "block";
      section1.style.display = "block";
      section2.style.display = "none";
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // Local Storage Data Handling
  function getStoredResponses() {
    try {
      return JSON.parse(localStorage.getItem("spellingBeeResponses") || "[]");
    } catch (e) {
      return [];
    }
  }

  function saveResponseLocally(data) {
    const current = getStoredResponses();
    current.push(data);
    localStorage.setItem("spellingBeeResponses", JSON.stringify(current));
    updateResponseCount();
  }

  function updateResponseCount() {
    const list = getStoredResponses();
    if (responseCountText) {
      responseCountText.textContent = `${list.length} Jawaban tersimpan secara lokal`;
    }
  }

  function renderResponsesTable() {
    const list = getStoredResponses();
    if (!responsesTableBody) return;

    if (list.length === 0) {
      responsesTableBody.innerHTML = `<tr><td colspan="11" style="text-align:center; padding: 20px; color: #70757a;">Belum ada pendaftaran.</td></tr>`;
      return;
    }

    responsesTableBody.innerHTML = list.map(item => `
      <tr>
        <td>${item.timestamp}</td>
        <td><strong>${item.fullName}</strong></td>
        <td>${item.birthDetails}</td>
        <td>${item.schoolName}</td>
        <td>${item.grade}</td>
        <td>${item.groupCategory}</td>
        <td>${item.parentPhone}</td>
        <td>${item.isEnglish1Student}</td>
        <td>${item.english1Center}</td>
        <td>${item.infoSource}</td>
        <td>${item.fileName}</td>
      </tr>
    `).join("");
  }

  // Modal Dialog Handlers
  if (btnOpenResponses) {
    btnOpenResponses.addEventListener("click", function () {
      renderResponsesTable();
      if (responsesModal) responsesModal.style.display = "flex";
    });
  }

  if (btnCloseModal) {
    btnCloseModal.addEventListener("click", function () {
      if (responsesModal) responsesModal.style.display = "none";
    });
  }

  if (btnClearData) {
    btnClearData.addEventListener("click", function () {
      if (confirm("Apakah Anda yakin ingin menghapus seluruh data pendaftaran yang tersimpan secara lokal?")) {
        localStorage.removeItem("spellingBeeResponses");
        renderResponsesTable();
        updateResponseCount();
      }
    });
  }

  if (btnExportCSV) {
    btnExportCSV.addEventListener("click", function () {
      const list = getStoredResponses();
      if (list.length === 0) {
        alert("Belum ada data untuk diexport!");
        return;
      }

      const headers = ["Waktu", "Nama Peserta", "Email", "Tempat Tgl Lahir", "Sekolah", "Kelas", "Group", "No Telp Ortu", "Siswa E1", "Center", "Info Source", "File"];
      const rows = list.map(item => [
        `"${item.timestamp}"`,
        `"${item.fullName}"`,
        `"${item.email}"`,
        `"${item.birthDetails}"`,
        `"${item.schoolName}"`,
        `"${item.grade}"`,
        `"${item.groupCategory}"`,
        `"${item.parentPhone}"`,
        `"${item.isEnglish1Student}"`,
        `"${item.english1Center}"`,
        `"${item.infoSource}"`,
        `"${item.fileName}"`
      ]);

      const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `spelling_bee_responses_malang_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }

  // Initialize response count display on load
  updateResponseCount();
});
