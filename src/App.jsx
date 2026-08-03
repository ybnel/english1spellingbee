import React, { useState, useEffect, useRef } from 'react';
import bannerImg from './assets/banner.png';

const GOOGLE_SCRIPT_URL_SURABAYA = 'https://script.google.com/macros/s/AKfycbyQym6DmlPm2hxeT3ELSu9BqHff-qL_BIHEA6fJmc4UTCMZKcJHA1VZxlisC6jq_30ScA/exec';

const GROUP_1_CENTERS = [
  'English 1 Plaza Surabaya',
  'English 1 Jemursari',
  'English 1 Galaxy Mall',
  'English 1 Purimas'
];

export default function App() {
  const [screen, setScreen] = useState('welcome'); // 'welcome' | 'form' | 'success'
  const [section, setSection] = useState(1); // 1 | 2
  const [activeCard, setActiveCard] = useState('title');
  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [submissions, setSubmissions] = useState([]);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    birthDetails: '',
    schoolName: '',
    grade: '',
    groupCategory: '',
    parentPhone: '',
    infoSource: '',
    isEnglish1Student: '',
    english1Center: '',
    paymentReceipt: null,
    paymentReceiptName: ''
  });

  // Element Refs for scrolling & Enter key navigation
  const cardRefs = {
    title1: useRef(null),
    fullName: useRef(null),
    email: useRef(null),
    birthDetails: useRef(null),
    schoolName: useRef(null),
    grade: useRef(null),
    groupCategory: useRef(null),
    parentPhone: useRef(null),
    infoSource: useRef(null),
    isEnglish1Student: useRef(null),
    english1Center: useRef(null),
    title2: useRef(null),
    paymentReceipt: useRef(null)
  };

  const inputRefs = {
    fullName: useRef(null),
    email: useRef(null),
    birthDetails: useRef(null),
    schoolName: useRef(null),
    grade: useRef(null),
    groupCategory: useRef(null),
    parentPhone: useRef(null),
    infoSource: useRef(null),
    isEnglish1Student: useRef(null),
    english1Center: useRef(null),
    paymentReceipt: useRef(null)
  };

  // Load submissions from LocalStorage
  useEffect(() => {
    try {
      const data = localStorage.getItem('spelling_bee_submissions');
      if (data) {
        setSubmissions(JSON.parse(data));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const saveSubmissions = (newSubmissions) => {
    setSubmissions(newSubmissions);
    localStorage.setItem('spelling_bee_submissions', JSON.stringify(newSubmissions));
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: false }));
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFormData(prev => ({
        ...prev,
        paymentReceipt: file,
        paymentReceiptName: file.name
      }));
      if (errors.paymentReceipt) {
        setErrors(prev => ({ ...prev, paymentReceipt: false }));
      }
    }
  };

  const handleRemoveFile = () => {
    setFormData(prev => ({
      ...prev,
      paymentReceipt: null,
      paymentReceiptName: ''
    }));
    if (inputRefs.paymentReceipt.current) {
      inputRefs.paymentReceipt.current.value = '';
    }
  };

  // Calculate Dynamic Branch Payment Details
  const getBranchDetails = () => {
    const { isEnglish1Student, english1Center } = formData;
    if (!english1Center) return null;

    const isGroup1 = GROUP_1_CENTERS.includes(english1Center);
    const isStudent = isEnglish1Student === 'Ya';

    if (isStudent && isGroup1) {
      return {
        category: 'Student - Plaza/JS/GM/Purimas',
        title: 'Registration fee for English 1 students',
        amount: 'Rp200.000',
        account: 'BCA 3842-0288-81 PT. Eduka Pratama'
      };
    } else if (isStudent && !isGroup1) {
      return {
        category: 'Student - BM/Pakuwon',
        title: 'Registration fee for English 1 students',
        amount: 'Rp200.000',
        account: 'BCA 0182-6173-32 PT. Eduka Efindo'
      };
    } else if (!isStudent && isGroup1) {
      return {
        category: 'Non-Student - Plaza/JS/GM/Purimas',
        title: 'Registration fee for non-English 1 students',
        amount: 'Rp250.000',
        account: 'BCA 3842-0288-81 PT. Eduka Pratama'
      };
    } else {
      return {
        category: 'Non-Student - BM/Pakuwon',
        title: 'Registration fee for non-English 1 students',
        amount: 'Rp250.000',
        account: 'BCA 0182-6173-32 PT. Eduka Efindo'
      };
    }
  };

  // Section 1 Validation
  const validateSection1 = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.fullName.trim()) newErrors.fullName = true;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) newErrors.email = true;
    if (!formData.birthDetails.trim()) newErrors.birthDetails = true;
    if (!formData.schoolName.trim()) newErrors.schoolName = true;
    if (!formData.grade) newErrors.grade = true;
    if (!formData.groupCategory) newErrors.groupCategory = true;
    if (!formData.parentPhone.trim()) newErrors.parentPhone = true;
    if (!formData.infoSource) newErrors.infoSource = true;
    if (!formData.isEnglish1Student) newErrors.isEnglish1Student = true;
    if (!formData.english1Center) newErrors.english1Center = true;

    setErrors(newErrors);

    const firstErrorKey = Object.keys(newErrors).find(key => newErrors[key]);
    if (firstErrorKey && cardRefs[firstErrorKey]?.current) {
      setActiveCard(firstErrorKey);
      cardRefs[firstErrorKey].current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return false;
    }

    return Object.keys(newErrors).length === 0;
  };

  // Section 2 Validation
  const validateSection2 = () => {
    const newErrors = {};
    if (!formData.paymentReceipt) newErrors.paymentReceipt = true;

    setErrors(newErrors);

    if (newErrors.paymentReceipt && cardRefs.paymentReceipt?.current) {
      setActiveCard('paymentReceipt');
      cardRefs.paymentReceipt.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return false;
    }

    return Object.keys(newErrors).length === 0;
  };

  const handleNextSection = () => {
    if (validateSection1()) {
      setSection(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBackSection = () => {
    setSection(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Enter Key Field-to-Field Navigation
  const fieldOrderSection1 = [
    'fullName',
    'email',
    'birthDetails',
    'schoolName',
    'grade',
    'groupCategory',
    'parentPhone',
    'infoSource',
    'isEnglish1Student',
    'english1Center'
  ];

  const handleKeyDown = (e, currentField) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const currentIndex = fieldOrderSection1.indexOf(currentField);
      if (currentIndex !== -1 && currentIndex < fieldOrderSection1.length - 1) {
        const nextField = fieldOrderSection1[currentIndex + 1];
        const nextRef = inputRefs[nextField]?.current;
        if (nextRef) {
          nextRef.focus();
          setActiveCard(nextField);
          if (cardRefs[nextField]?.current) {
            cardRefs[nextField].current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        }
      } else if (currentField === 'english1Center') {
        handleNextSection();
      }
    }
  };

  // Reset Form
  const resetForm = () => {
    setFormData({
      fullName: '',
      email: '',
      birthDetails: '',
      schoolName: '',
      grade: '',
      groupCategory: '',
      parentPhone: '',
      infoSource: '',
      isEnglish1Student: '',
      english1Center: '',
      paymentReceipt: null,
      paymentReceiptName: ''
    });
    setErrors({});
    setSection(1);
    setActiveCard('title');
    if (inputRefs.paymentReceipt.current) {
      inputRefs.paymentReceipt.current.value = '';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle Submit
  const handleSubmit = (e) => {
    e.preventDefault();

    if (section === 1) {
      handleNextSection();
      return;
    }

    if (!validateSection2()) return;

    const branch = getBranchDetails();
    const submission = {
      id: Date.now(),
      timestamp: new Date().toLocaleString('id-ID'),
      fullName: formData.fullName,
      email: formData.email,
      birthDetails: formData.birthDetails,
      schoolName: formData.schoolName,
      grade: formData.grade,
      groupCategory: formData.groupCategory,
      parentPhone: formData.parentPhone,
      infoSource: formData.infoSource,
      isEnglish1Student: formData.isEnglish1Student,
      english1Center: formData.english1Center,
      branchCategory: branch ? branch.category : '',
      paymentReceipt: formData.paymentReceiptName || 'Tidak ada file'
    };

    saveSubmissions([...submissions, submission]);

    // Send payload to Google Sheets Webhook
    if (formData.paymentReceipt) {
      const reader = new FileReader();
      reader.onload = function(evt) {
        const fileBase64 = evt.target.result.split(',')[1];
        sendToGoogleSheets({
          ...submission,
          fileName: formData.paymentReceipt.name,
          fileType: formData.paymentReceipt.type,
          fileData: fileBase64
        });
      };
      reader.readAsDataURL(formData.paymentReceipt);
    } else {
      sendToGoogleSheets(submission);
    }

    setScreen('success');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const sendToGoogleSheets = (payload) => {
    if (!GOOGLE_SCRIPT_URL_SURABAYA) return;
    fetch(GOOGLE_SCRIPT_URL_SURABAYA, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    }).catch(err => console.error('Failed sending to Google Sheets:', err));
  };

  // Export CSV
  const handleExportCSV = () => {
    if (submissions.length === 0) {
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

    const rows = submissions.map(item => [
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

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Spelling_Bee_2026_Registration_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClearAllData = () => {
    if (confirm('Apakah Anda yakin ingin menghapus SELURUH data pendaftaran yang tersimpan di browser ini?')) {
      saveSubmissions([]);
    }
  };

  const branchDetails = getBranchDetails();

  return (
    <main className="form-container">

      {/* WELCOME / LANDING SCREEN */}
      {screen === 'welcome' && (
        <section id="welcomeScreen" className="welcome-card">
          <div className="welcome-banner-wrap">
            <img src={bannerImg} alt="English 1 Spelling Bee Banner" className="welcome-banner-img" />
          </div>
          <div className="welcome-content">
            <div className="welcome-badge">🏆 Regional Competition 2026</div>
            <h1 className="welcome-title">English 1 Spelling Bee Regional Competition 2026</h1>
            <p className="welcome-desc">
              Welcome to the official registration portal for the <strong>19th Annual Spelling Bee Regional Competition</strong>. 
              Please prepare your participant details and click the button below to start registration.
            </p>

            <div className="event-highlights">
              <div className="highlight-item">
                <span className="highlight-icon">📅</span>
                <div>
                  <strong>Event Date</strong>
                  <p>October 25, 2026</p>
                </div>
              </div>
              <div className="highlight-item">
                <span className="highlight-icon">🎓</span>
                <div>
                  <strong>Categories</strong>
                  <p>Groups A - D (Grades 1 - 9)</p>
                </div>
              </div>
            </div>

            <button
              type="button"
              className="btn-start-registration"
              onClick={() => {
                setScreen('form');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <span>Start Registration</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </div>
        </section>
      )}

      {/* FORM REGISTRATION SCREEN */}
      {screen === 'form' && (
        <form id="spellingBeeForm" onSubmit={handleSubmit} noValidate>

          {/* SECTION 1: DATA PESERTA */}
          {section === 1 && (
            <div id="section1" className="form-section">

              {/* Title Card */}
              <section
                ref={cardRefs.title1}
                className={`form-card title-card ${activeCard === 'title' ? 'active' : ''}`}
                onClick={() => setActiveCard('title')}
              >
                <div className="title-header-wrap">
                  <div className="title-icon-badge">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                      <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                  </div>
                  <div>
                    <h1 className="form-title">Online Registration Form Spelling Bee Regional Competition 2026</h1>
                    <p className="form-description">To participate in the competition, please fill in the details below accurately and completely.</p>
                  </div>
                </div>
                <div className="required-notice">* Indicates required question</div>
              </section>

              {/* Question 1: Participant Full Name */}
              <section
                ref={cardRefs.fullName}
                className={`form-card ${activeCard === 'fullName' ? 'active' : ''} ${errors.fullName ? 'error-state' : ''}`}
                onClick={() => setActiveCard('fullName')}
              >
                <h2 className="question-title">
                  Nama Lengkap Peserta / <em>Participant Full Name</em> <span className="required-star">*</span>
                </h2>
                <p className="question-subtext">Pastikan ejaan nama anak Anda BENAR untuk penerbitan sertifikat. / <em>Please make sure your child's name spelling is CORRECT for certificate issuing.</em></p>
                <div className="text-input-wrap">
                  <input
                    ref={inputRefs.fullName}
                    type="text"
                    className="text-input"
                    placeholder="Your answer"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    onFocus={() => setActiveCard('fullName')}
                    onKeyDown={(e) => handleKeyDown(e, 'fullName')}
                    required
                  />
                </div>
                <div className="error-msg">
                  <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                  <span>This question is required</span>
                </div>
              </section>

              {/* Question 2: Email */}
              <section
                ref={cardRefs.email}
                className={`form-card ${activeCard === 'email' ? 'active' : ''} ${errors.email ? 'error-state' : ''}`}
                onClick={() => setActiveCard('email')}
              >
                <h2 className="question-title">
                  Email <span className="required-star">*</span>
                </h2>
                <div className="text-input-wrap">
                  <input
                    ref={inputRefs.email}
                    type="email"
                    className="text-input"
                    placeholder="Your answer (e.g. name@email.com)"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    onFocus={() => setActiveCard('email')}
                    onKeyDown={(e) => handleKeyDown(e, 'email')}
                    required
                  />
                </div>
                <div className="error-msg">
                  <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                  <span>Please provide a valid email address</span>
                </div>
              </section>

              {/* Question 3: Place and Date of Birth */}
              <section
                ref={cardRefs.birthDetails}
                className={`form-card ${activeCard === 'birthDetails' ? 'active' : ''} ${errors.birthDetails ? 'error-state' : ''}`}
                onClick={() => setActiveCard('birthDetails')}
              >
                <h2 className="question-title">
                  Tempat dan tanggal lahir anak Anda / <em>Place and Date of Birth</em> <span className="required-star">*</span>
                </h2>
                <p className="question-subtext">Contoh pengisian: Surabaya, 1 Januari 2018 / <em>Example: Surabaya, 1 January 2018</em></p>
                <div className="text-input-wrap">
                  <input
                    ref={inputRefs.birthDetails}
                    type="text"
                    className="text-input"
                    placeholder="Your answer (e.g. Surabaya, 1 Januari 2018)"
                    value={formData.birthDetails}
                    onChange={(e) => handleInputChange('birthDetails', e.target.value)}
                    onFocus={() => setActiveCard('birthDetails')}
                    onKeyDown={(e) => handleKeyDown(e, 'birthDetails')}
                    required
                  />
                </div>
                <div className="error-msg">
                  <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                  <span>This question is required</span>
                </div>
              </section>

              {/* Question 4: School Name */}
              <section
                ref={cardRefs.schoolName}
                className={`form-card ${activeCard === 'schoolName' ? 'active' : ''} ${errors.schoolName ? 'error-state' : ''}`}
                onClick={() => setActiveCard('schoolName')}
              >
                <h2 className="question-title">
                  Asal sekolah anak Anda / <em>School Name</em> <span className="required-star">*</span>
                </h2>
                <p className="question-subtext">Gunakan nama sekolah yang sesuai. / <em>Please use the official school name.</em></p>
                <div className="text-input-wrap">
                  <input
                    ref={inputRefs.schoolName}
                    type="text"
                    className="text-input"
                    placeholder="Your answer"
                    value={formData.schoolName}
                    onChange={(e) => handleInputChange('schoolName', e.target.value)}
                    onFocus={() => setActiveCard('schoolName')}
                    onKeyDown={(e) => handleKeyDown(e, 'schoolName')}
                    required
                  />
                </div>
                <div className="error-msg">
                  <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                  <span>This question is required</span>
                </div>
              </section>

              {/* Question 5: Grade */}
              <section
                ref={cardRefs.grade}
                className={`form-card ${activeCard === 'grade' ? 'active' : ''} ${errors.grade ? 'error-state' : ''}`}
                onClick={() => setActiveCard('grade')}
              >
                <h2 className="question-title">
                  Kelas / <em>Grade</em> <span className="required-star">*</span>
                </h2>
                <div className="dropdown-wrap">
                  <select
                    ref={inputRefs.grade}
                    className="select-input"
                    value={formData.grade}
                    onChange={(e) => handleInputChange('grade', e.target.value)}
                    onFocus={() => setActiveCard('grade')}
                    onKeyDown={(e) => handleKeyDown(e, 'grade')}
                    required
                  >
                    <option value="" disabled>Select</option>
                    <option value="1 SD">1 SD</option>
                    <option value="2 SD">2 SD</option>
                    <option value="3 SD">3 SD</option>
                    <option value="4 SD">4 SD</option>
                    <option value="5 SD">5 SD</option>
                    <option value="6 SD">6 SD</option>
                    <option value="7 SMP">7 SMP</option>
                    <option value="8 SMP">8 SMP</option>
                    <option value="9 SMP">9 SMP</option>
                  </select>
                  <div className="dropdown-icon">
                    <svg width="12" height="8" viewBox="0 0 12 8" fill="currentColor">
                      <path d="M1.41 0L6 4.58L10.59 0L12 1.41L6 7.41L0 1.41L1.41 0Z"/>
                    </svg>
                  </div>
                </div>
                <div className="error-msg">
                  <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                  <span>This question is required</span>
                </div>
              </section>

              {/* Question 6: Group Category */}
              <section
                ref={cardRefs.groupCategory}
                className={`form-card ${activeCard === 'groupCategory' ? 'active' : ''} ${errors.groupCategory ? 'error-state' : ''}`}
                onClick={() => setActiveCard('groupCategory')}
              >
                <h2 className="question-title">
                  Pilih kategori group kompetisi / <em>Choose your group category</em> <span className="required-star">*</span>
                </h2>
                <div className="dropdown-wrap">
                  <select
                    ref={inputRefs.groupCategory}
                    className="select-input"
                    value={formData.groupCategory}
                    onChange={(e) => handleInputChange('groupCategory', e.target.value)}
                    onFocus={() => setActiveCard('groupCategory')}
                    onKeyDown={(e) => handleKeyDown(e, 'groupCategory')}
                    required
                  >
                    <option value="" disabled>Select</option>
                    <option value="GROUP A : Kelas 1 - 2 SD">GROUP A : Kelas 1 - 2 SD</option>
                    <option value="GROUP B : Kelas 3 - 4 SD">GROUP B : Kelas 3 - 4 SD</option>
                    <option value="GROUP C : Kelas 5 - 6 SD">GROUP C : Kelas 5 - 6 SD</option>
                    <option value="GROUP D : Kelas 7 - 9 SMP">GROUP D : Kelas 7 - 9 SMP</option>
                  </select>
                  <div className="dropdown-icon">
                    <svg width="12" height="8" viewBox="0 0 12 8" fill="currentColor">
                      <path d="M1.41 0L6 4.58L10.59 0L12 1.41L6 7.41L0 1.41L1.41 0Z"/>
                    </svg>
                  </div>
                </div>
                <div className="error-msg">
                  <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                  <span>This question is required</span>
                </div>
              </section>

              {/* Question 7: Parents Phone Number */}
              <section
                ref={cardRefs.parentPhone}
                className={`form-card ${activeCard === 'parentPhone' ? 'active' : ''} ${errors.parentPhone ? 'error-state' : ''}`}
                onClick={() => setActiveCard('parentPhone')}
              >
                <h2 className="question-title">
                  Nomor telpon orang tua / <em>Parents Phone Number</em> <span className="required-star">*</span>
                </h2>
                <div className="text-input-wrap">
                  <input
                    ref={inputRefs.parentPhone}
                    type="tel"
                    className="text-input"
                    placeholder="Your answer"
                    value={formData.parentPhone}
                    onChange={(e) => handleInputChange('parentPhone', e.target.value)}
                    onFocus={() => setActiveCard('parentPhone')}
                    onKeyDown={(e) => handleKeyDown(e, 'parentPhone')}
                    required
                  />
                </div>
                <div className="error-msg">
                  <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                  <span>This question is required</span>
                </div>
              </section>

              {/* Question 8: Info Source */}
              <section
                ref={cardRefs.infoSource}
                className={`form-card ${activeCard === 'infoSource' ? 'active' : ''} ${errors.infoSource ? 'error-state' : ''}`}
                onClick={() => setActiveCard('infoSource')}
              >
                <h2 className="question-title">
                  Dari mana Anda mendapatkan informasi kompetisi ini? / <em>Where did you hear about this competition?</em> <span className="required-star">*</span>
                </h2>
                <div className="radio-group">
                  {['Staff English 1 Center', 'Iklan', 'Instagram'].map(option => (
                    <label key={option} className="radio-option">
                      <input
                        ref={option === 'Staff English 1 Center' ? inputRefs.infoSource : null}
                        type="radio"
                        name="infoSource"
                        value={option}
                        checked={formData.infoSource === option}
                        onChange={(e) => handleInputChange('infoSource', e.target.value)}
                        onFocus={() => setActiveCard('infoSource')}
                        onKeyDown={(e) => handleKeyDown(e, 'infoSource')}
                        required
                      />
                      <span className="custom-radio"></span>
                      <span>{option === 'Iklan' ? 'Iklan / Advertisement' : option}</span>
                    </label>
                  ))}
                </div>
                <div className="error-msg">
                  <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                  <span>This question is required</span>
                </div>
              </section>

              {/* Question 9: Is English 1 Student */}
              <section
                ref={cardRefs.isEnglish1Student}
                className={`form-card ${activeCard === 'isEnglish1Student' ? 'active' : ''} ${errors.isEnglish1Student ? 'error-state' : ''}`}
                onClick={() => setActiveCard('isEnglish1Student')}
              >
                <h2 className="question-title">
                  Apakah anak Anda siswa English 1? / <em>Are you currently an English 1 student?</em> <span className="required-star">*</span>
                </h2>
                <div className="radio-group">
                  {[
                    { label: 'Ya / Yes', value: 'Ya' },
                    { label: 'Tidak / No', value: 'Tidak' }
                  ].map(item => (
                    <label key={item.value} className="radio-option">
                      <input
                        ref={item.value === 'Ya' ? inputRefs.isEnglish1Student : null}
                        type="radio"
                        name="isEnglish1Student"
                        value={item.value}
                        checked={formData.isEnglish1Student === item.value}
                        onChange={(e) => handleInputChange('isEnglish1Student', e.target.value)}
                        onFocus={() => setActiveCard('isEnglish1Student')}
                        onKeyDown={(e) => handleKeyDown(e, 'isEnglish1Student')}
                        required
                      />
                      <span className="custom-radio"></span>
                      <span>{item.label}</span>
                    </label>
                  ))}
                </div>
                <div className="error-msg">
                  <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                  <span>This question is required</span>
                </div>
              </section>

              {/* Question 10: English 1 Center */}
              <section
                ref={cardRefs.english1Center}
                className={`form-card ${activeCard === 'english1Center' ? 'active' : ''} ${errors.english1Center ? 'error-state' : ''}`}
                onClick={() => setActiveCard('english1Center')}
              >
                <h2 className="question-title">
                  English 1 Center <span className="required-star">*</span>
                </h2>
                <p className="question-subtext">Select the nearest English 1 Center or where your child currently studies.</p>
                <div className="dropdown-wrap">
                  <select
                    ref={inputRefs.english1Center}
                    className="select-input"
                    value={formData.english1Center}
                    onChange={(e) => handleInputChange('english1Center', e.target.value)}
                    onFocus={() => setActiveCard('english1Center')}
                    onKeyDown={(e) => handleKeyDown(e, 'english1Center')}
                    required
                  >
                    <option value="" disabled>Select</option>
                    <option value="English 1 Plaza Surabaya">English 1 Plaza Surabaya</option>
                    <option value="English 1 Galaxy Mall">English 1 Galaxy Mall</option>
                    <option value="English 1 Pakuwon Mall">English 1 Pakuwon Mall</option>
                    <option value="English 1 Bukit Mas">English 1 Bukit Mas</option>
                    <option value="English 1 Jemursari">English 1 Jemursari</option>
                    <option value="English 1 Purimas">English 1 Purimas</option>
                  </select>
                  <div className="dropdown-icon">
                    <svg width="12" height="8" viewBox="0 0 12 8" fill="currentColor">
                      <path d="M1.41 0L6 4.58L10.59 0L12 1.41L6 7.41L0 1.41L1.41 0Z"/>
                    </svg>
                  </div>
                </div>
                <div className="error-msg">
                  <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                  <span>This question is required</span>
                </div>
              </section>

              {/* Section 1 Actions */}
              <div className="form-actions-bar">
                <button type="button" className="btn-next" onClick={handleNextSection}>Next</button>
                <button type="button" className="btn-clear-form btn-clear-all" onClick={() => confirm('Clear all fields?') && resetForm()}>Clear form</button>
              </div>

            </div>
          )}

          {/* SECTION 2: PEMBAYARAN & KONFIRMASI */}
          {section === 2 && (
            <div id="section2" className="form-section">

              {/* Title Card */}
              <section className="form-card title-card">
                <div className="title-header-wrap">
                  <div className="title-icon-badge">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                      <line x1="1" y1="10" x2="23" y2="10"></line>
                    </svg>
                  </div>
                  <div>
                    <h1 className="form-title" style={{ fontSize: '24px' }}>Payment & Registration Confirmation</h1>
                    <p className="form-description">Please complete the registration fee payment and upload your transfer receipt below.</p>
                  </div>
                </div>
              </section>

              {/* Dynamic Branch Card */}
              {branchDetails && (
                <section className="form-card payment-info-card" style={{ display: 'block' }}>
                  <div className="payment-header-bar">Registration Fee Payment Process</div>
                  <div className="payment-card-body">
                    <p className="payment-subtitle">{branchDetails.title}</p>
                    <p className="payment-details">
                      Early Bird Period: <strong>{branchDetails.amount}</strong> | Transfer to bank account <strong>{branchDetails.account}</strong>
                    </p>
                  </div>
                </section>
              )}

              {/* Payment Receipt Upload Card */}
              <section
                ref={cardRefs.paymentReceipt}
                className={`form-card ${activeCard === 'paymentReceipt' ? 'active' : ''} ${errors.paymentReceipt ? 'error-state' : ''}`}
                onClick={() => setActiveCard('paymentReceipt')}
              >
                <div className="card-section-header">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                  <h2 className="card-section-title">Upload Payment Receipt <span className="required-star">*</span></h2>
                </div>

                <p className="question-subtext">Upload 1 supported payment receipt (PDF, Image, max 1 MB).</p>

                <input
                  ref={inputRefs.paymentReceipt}
                  type="file"
                  className="hidden-file-input"
                  accept="image/*,.pdf,.doc,.docx"
                  onChange={handleFileChange}
                  required
                />

                <div className="upload-single-tile-wrap">
                  <button
                    type="button"
                    className="upload-tile full-width-tile"
                    onClick={() => inputRefs.paymentReceipt.current && inputRefs.paymentReceipt.current.click()}
                  >
                    <div className="upload-tile-icon">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <circle cx="8.5" cy="8.5" r="1.5"></circle>
                        <polyline points="21 15 16 10 5 21"></polyline>
                      </svg>
                    </div>
                    <span className="upload-tile-title">Upload File / Select Image</span>
                  </button>
                </div>

                {formData.paymentReceiptName && (
                  <div className="file-status-box" style={{ display: 'flex' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    <span className="file-name-display">{formData.paymentReceiptName}</span>
                    <button type="button" className="btn-remove-file" title="Remove file" onClick={handleRemoveFile}>&times;</button>
                  </div>
                )}

                <div className="error-msg">
                  <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                  <span>This question is required</span>
                </div>
              </section>

              {/* Section 2 Actions */}
              <div className="form-actions-bar">
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <button type="button" className="btn-secondary" onClick={handleBackSection}>Back</button>
                  <button type="button" className="btn-clear-form btn-clear-all" onClick={() => confirm('Clear all fields?') && resetForm()}>Clear form</button>
                </div>
                <button type="submit" className="btn-submit">Submit</button>
              </div>

            </div>
          )}

        </form>
      )}

      {/* SUCCESS CONFIRMATION VIEW */}
      {screen === 'success' && (
        <div id="successView" className="success-card" style={{ display: 'block' }}>
          <h1 className="success-title">Online Registration Form Spelling Bee Regional Competition 2026</h1>
          <p className="success-message">Your response has been recorded.</p>
          <a
            href="#"
            className="submit-another-link"
            onClick={(e) => {
              e.preventDefault();
              resetForm();
              setScreen('form');
            }}
          >
            Submit another response
          </a>
        </div>
      )}

      {/* ADMIN DATA DRAWER / MODAL BUTTON */}
      <div className="view-responses-bar">
        <span>{submissions.length} Jawaban tersimpan secara lokal</span>
        <button type="button" className="btn-small" onClick={() => setShowModal(true)}>Lihat Data Response</button>
      </div>

      {/* RESPONSES MODAL */}
      {showModal && (
        <div className="modal-overlay" style={{ display: 'flex' }} onClick={() => setShowModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Daftar Pendaftaran (Local Data)</h3>
              <button type="button" className="close-modal" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="table-responsive">
                <table className="responses-table">
                  <thead>
                    <tr>
                      <th>Waktu</th>
                      <th>Nama Peserta</th>
                      <th>Tempat & Tgl Lahir</th>
                      <th>Sekolah</th>
                      <th>Kelas</th>
                      <th>Group</th>
                      <th>No Telp Ortu</th>
                      <th>Siswa E1</th>
                      <th>Center</th>
                      <th>Sumber Info</th>
                      <th>Kategori / Branch</th>
                    </tr>
                  </thead>
                  <tbody>
                    {submissions.length === 0 ? (
                      <tr>
                        <td colSpan="11" style={{ textAlign: 'center', padding: '20px', color: '#70757a' }}>Belum ada pendaftaran.</td>
                      </tr>
                    ) : (
                      submissions.map(item => (
                        <tr key={item.id}>
                          <td>{item.timestamp}</td>
                          <td><strong>{item.fullName}</strong></td>
                          <td>{item.birthDetails}</td>
                          <td>{item.schoolName}</td>
                          <td>{item.grade}</td>
                          <td>{item.groupCategory}</td>
                          <td>{item.parentPhone}</td>
                          <td>{item.isEnglish1Student}</td>
                          <td>{item.english1Center}</td>
                          <td>{item.infoSource}</td>
                          <td>
                            <span style={{ background: '#fceef4', color: '#e00078', padding: '2px 6px', borderRadius: '4px', fontWeight: 500 }}>
                              {item.branchCategory || '-'}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn-small" style={{ background: '#e00078', color: 'white', border: 'none' }} onClick={handleExportCSV}>Export CSV</button>
              <button type="button" className="btn-small" style={{ color: '#d93025' }} onClick={handleClearAllData}>Hapus Semua Data</button>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}
