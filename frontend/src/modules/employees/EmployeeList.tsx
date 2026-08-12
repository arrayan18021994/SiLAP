import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import DateInput from '../../components/DateInput';
import ConfirmModal from '../../components/ConfirmModal';
import './Employees.css';

const initialFormState = {
  nip: '',
  name: '',
  full_name: '',
  nik: '',
  birth_place: '',
  birth_date: '',
  gender: 'L',
  status: 'PNS',
  asn_status: 'PNS',
  tmt_cpns: '',
  mkg_years: '0',
  mkg_months: '0',
  tmt_mkg: '',
  marital_status: 'KAWIN',
  rank: '',
  position: '',
  opd: '',
  unit_kerja: '',
  address: '',
  notes: ''
};

const initialSpouseState = {
  name: '',
  nik: '',
  birth_place: '',
  birth_date: '',
  marriage_date: '',
  job: ''
};

const initialChildItem = {
  name: '',
  nik: '',
  birth_place: '',
  birth_date: '',
  gender: 'L',
  document_number: '',
  child_status: 'Anak Kandung',
  education: ''
};

const EmployeeList: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '');
  const [employees, setEmployees] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(initialFormState);
  const [spouseData, setSpouseData] = useState(initialSpouseState);
  const [childrenData, setChildrenData] = useState<any[]>([]);

  useEffect(() => {
    const s = searchParams.get('search');
    const st = searchParams.get('status');
    if (s !== null) setSearchTerm(s);
    if (st !== null) setStatusFilter(st);
  }, [searchParams]);
  
  // Confirmation modals state
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const fetchEmployees = async () => {
    try {
      const res = await fetch('/api/v1/employees/');
      if (res.ok) {
        const data = await res.json();
        setEmployees(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const resetModalState = () => {
    setFormData(initialFormState);
    setSpouseData(initialSpouseState);
    setChildrenData([]);
    setCurrentStep(1);
  };

  const isFormDirty = () => {
    const isEmpDirty = JSON.stringify(formData) !== JSON.stringify(initialFormState);
    const isSpouseDirty = JSON.stringify(spouseData) !== JSON.stringify(initialSpouseState);
    const isChildDirty = childrenData.length > 0;
    return isEmpDirty || isSpouseDirty || isChildDirty;
  };

  const handleInputChange = (e: { target: { name: string; value: string } } | React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'name' ? { full_name: value } : {}),
      ...(name === 'status' ? { asn_status: value } : {})
    }));
  };

  const handleSpouseChange = (e: { target: { name: string; value: string } } | React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSpouseData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddChild = () => {
    setChildrenData(prev => [...prev, { ...initialChildItem }]);
  };

  const handleRemoveChild = (index: number) => {
    setChildrenData(prev => prev.filter((_, i) => i !== index));
  };

  const handleChildChange = (index: number, name: string, value: string) => {
    setChildrenData(prev => prev.map((item, i) => i === index ? { ...item, [name]: value } : item));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSaveConfirm(true);
  };

  const handleConfirmSave = async () => {
    setShowSaveConfirm(false);
    try {
      const payload = {
        ...formData,
        full_name: formData.name || formData.full_name,
        asn_status: formData.status || formData.asn_status
      };
      
      // 1. Save Employee Data
      const res = await fetch('/api/v1/employees/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const error = await res.json();
        alert(error.detail || "Gagal menambah pegawai");
        return;
      }

      const createdEmp = await res.json();
      const employeeId = createdEmp.id;

      // 2. Save Spouse Data if filled
      if (spouseData.name && spouseData.name.trim() !== '') {
        try {
          await fetch(`/api/v1/family/${employeeId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              relationship_type: 'PASANGAN',
              name: spouseData.name,
              nik: spouseData.nik,
              birth_place: spouseData.birth_place,
              birth_date: spouseData.birth_date,
              marriage_date: spouseData.marriage_date,
              job: spouseData.job
            })
          });
        } catch (err) {
          console.error("Gagal menyimpan data pasangan:", err);
        }
      }

      // 3. Save Children Data if added
      for (const child of childrenData) {
        if (child.name && child.name.trim() !== '') {
          try {
            await fetch(`/api/v1/family/${employeeId}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                relationship_type: 'ANAK',
                name: child.name,
                nik: child.nik,
                birth_place: child.birth_place,
                birth_date: child.birth_date,
                gender: child.gender,
                document_number: child.document_number,
                child_status: child.child_status,
                education: child.education
              })
            });
          } catch (err) {
            console.error("Gagal menyimpan data anak:", err);
          }
        }
      }

      setShowModal(false);
      resetModalState();
      fetchEmployees();
      alert("Pegawai beserta data keluarga berhasil ditambahkan!");
    } catch (e) {
      alert("Error: " + e);
    }
  };

  const handleRequestClose = () => {
    if (isFormDirty()) {
      setShowCancelConfirm(true);
    } else {
      setShowModal(false);
      resetModalState();
    }
  };

  const handleConfirmCancel = () => {
    setShowCancelConfirm(false);
    setShowModal(false);
    resetModalState();
  };

  const getRankScore = (rankStr?: string): number => {
    if (!rankStr || rankStr === '-') return 0;
    const r = String(rankStr).trim().toUpperCase();
    const scores: Record<string, number> = {
      'IV/E': 45, 'IV/D': 44, 'IV/C': 43, 'IV/B': 42, 'IV/A': 41,
      'III/D': 34, 'III/C': 33, 'III/B': 32, 'III/A': 31,
      'II/D': 24, 'II/C': 23, 'II/B': 22, 'II/A': 21,
      'I/D': 14, 'I/C': 13, 'I/B': 12, 'I/A': 11,
    };
    if (scores[r]) return scores[r];
    const romanScores: Record<string, number> = {
      'XVII': 17, 'XVI': 16, 'XV': 15, 'XIV': 14, 'XIII': 13, 'XII': 12, 'XI': 11,
      'X': 10, 'IX': 9, 'VIII': 8, 'VII': 7, 'VI': 6, 'V': 5, 'IV': 4, 'III': 3, 'II': 2, 'I': 1
    };
    for (const [k, v] of Object.entries(romanScores)) {
      if (r.includes(k)) return v;
    }
    return 0;
  };

  const getAsnStatusScore = (statusStr?: string): number => {
    if (!statusStr) return 99;
    const st = String(statusStr).trim().toUpperCase();
    if (st.includes('PARUH') || st.includes('PART')) return 3;
    if (st.includes('PENUH') || st.includes('FULL') || st.includes('PPPK')) return 2;
    if (st.includes('PNS')) return 1;
    return 4;
  };

  const filteredEmployees = employees
    .filter(emp => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = !searchTerm ||
        (emp.nip && emp.nip.toLowerCase().includes(searchLower)) ||
        (emp.name && emp.name.toLowerCase().includes(searchLower)) ||
        (emp.full_name && emp.full_name.toLowerCase().includes(searchLower)) ||
        (emp.position && emp.position.toLowerCase().includes(searchLower)) ||
        (emp.opd && emp.opd.toLowerCase().includes(searchLower));

      const matchesStatus = !statusFilter ||
        (emp.status && emp.status.toUpperCase().includes(statusFilter.toUpperCase())) ||
        (emp.asn_status && emp.asn_status.toUpperCase().includes(statusFilter.toUpperCase()));

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      // 1. Status ASN: PNS -> PPPK Penuh Waktu -> PPPK Paruh Waktu
      const asnA = getAsnStatusScore(a.status || a.asn_status);
      const asnB = getAsnStatusScore(b.status || b.asn_status);
      if (asnA !== asnB) return asnA - asnB;

      // 2. Golongan: IV highest down to I
      const rankA = getRankScore(a.rank);
      const rankB = getRankScore(b.rank);
      if (rankA !== rankB) return rankB - rankA;

      // 3. MKG: Largest total months first
      const mkgA = (Number(a.mkg_years || 0) * 12) + Number(a.mkg_months || 0);
      const mkgB = (Number(b.mkg_years || 0) * 12) + Number(b.mkg_months || 0);
      if (mkgA !== mkgB) return mkgB - mkgA;

      // 4. NIP: Oldest birth year first (ascending)
      const nipA = String(a.nip || '');
      const nipB = String(b.nip || '');
      return nipA.localeCompare(nipB);
    });

  return (
    <div className="employee-list-container">
      <div className="page-header">
        <h2>Data Pegawai</h2>
        <div className="header-actions">
          <Link to="/dashboard/employees/import" className="btn-secondary">Import Excel</Link>
          <button className="btn-primary" onClick={() => { resetModalState(); setShowModal(true); }}>+ Tambah Pegawai Manual</button>
        </div>
      </div>

      <div className="filters-bar">
        <input
          type="text"
          placeholder="Cari NIP atau Nama Pegawai..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select
          className="filter-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">Semua Status ASN</option>
          <option value="PNS">PNS</option>
          <option value="PPPK Penuh Waktu">PPPK Penuh Waktu</option>
          <option value="PPPK Paruh Waktu">PPPK Paruh Waktu</option>
        </select>
      </div>

      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>NIP</th>
              <th>NAMA</th>
              <th>STATUS ASN</th>
              <th>GOLONGAN</th>
              <th>JABATAN</th>
              <th>MKG</th>
              <th>STATUS PERKAWINAN</th>
              <th>JUMLAH ANAK</th>
              <th>AKSI</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map(emp => (
              <tr key={emp.id}>
                <td style={{ fontWeight: 600 }}>{emp.nip}</td>
                <td style={{ fontWeight: 600 }}>{emp.name || emp.full_name}</td>
                <td>
                  <span className={`badge ${emp.status && emp.status.toLowerCase().includes('pns') ? 'badge-normal' : 'badge-attention'}`}>
                    {emp.status || emp.asn_status}
                  </span>
                </td>
                <td>{emp.rank || '-'}</td>
                <td>{emp.position || '-'}</td>
                <td>
                  <strong>{emp.mkg_years || 0} Thn {emp.mkg_months || 0} Bln</strong>
                </td>
                <td>{emp.marital_status || 'KAWIN'}</td>
                <td>
                  {emp.children_count !== undefined ? `${emp.children_count} Anak` : (emp.children ? `${emp.children.length} Anak` : '0 Anak')}
                </td>
                <td>
                  <Link to={`/dashboard/employees/${emp.id}`} className="btn-text">Detail</Link>
                </td>
              </tr>
            ))}
            {filteredEmployees.length === 0 && (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                  Tidak ada data pegawai yang ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <span>Menampilkan 1-{filteredEmployees.length} dari {filteredEmployees.length} data</span>
        <div className="page-controls">
          <button disabled>&lt; Prev</button>
          <button disabled>Next &gt;</button>
        </div>
      </div>

      {/* Add Employee Multi-Step Modal */}
      {showModal && (
        <div className="modal-backdrop" style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(2px)'
        }}>
          <div className="card compact-modal-card" style={{
            width: '920px', maxWidth: '96vw', maxHeight: '96vh', overflowY: 'auto',
            padding: '1rem 1.25rem', background: '#ffffff', borderRadius: '10px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
          }}>
            <div className="compact-modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.35rem' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-main)' }}>Tambah Pegawai Baru (Manual)</h3>
                <span style={{ fontSize: '0.76rem', color: '#64748b' }}>Isi formulir data pegawai dan keluarga secara bertahap</span>
              </div>
              <button
                type="button"
                onClick={handleRequestClose}
                style={{ background: 'none', border: 'none', fontSize: '1.3rem', cursor: 'pointer', color: '#64748b' }}
              >
                &times;
              </button>
            </div>

            {/* Step Wizard Indicator */}
            <div className="compact-wizard-bar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', background: '#f8fafc', padding: '0.3rem 0.75rem', borderRadius: '6px', marginBottom: '0.45rem', border: '1px solid #e2e8f0' }}>
              <div 
                onClick={() => setCurrentStep(1)}
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', opacity: currentStep === 1 ? 1 : 0.6 }}
              >
                <div className="compact-wizard-circle" style={{ width: '22px', height: '22px', borderRadius: '50%', background: currentStep === 1 ? '#2563eb' : '#94a3b8', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.75rem' }}>1</div>
                <span className="compact-wizard-text" style={{ fontSize: '0.78rem', fontWeight: currentStep === 1 ? 700 : 500, color: currentStep === 1 ? '#1e293b' : '#64748b' }}>Data Pegawai</span>
              </div>

              <div style={{ flex: 1, height: '2px', background: '#cbd5e1', margin: '0 0.5rem' }}></div>

              <div 
                onClick={() => {
                  if (!formData.nip || !formData.name) {
                    alert("Mohon lengkapi NIP dan Nama Pegawai pada Langkah 1 terlebih dahulu.");
                    return;
                  }
                  setCurrentStep(2);
                }}
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', opacity: currentStep === 2 ? 1 : 0.6 }}
              >
                <div className="compact-wizard-circle" style={{ width: '22px', height: '22px', borderRadius: '50%', background: currentStep === 2 ? '#2563eb' : '#94a3b8', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.75rem' }}>2</div>
                <span className="compact-wizard-text" style={{ fontSize: '0.78rem', fontWeight: currentStep === 2 ? 700 : 500, color: currentStep === 2 ? '#1e293b' : '#64748b' }}>Data Pasangan</span>
              </div>

              <div style={{ flex: 1, height: '2px', background: '#cbd5e1', margin: '0 0.5rem' }}></div>

              <div 
                onClick={() => {
                  if (!formData.nip || !formData.name) {
                    alert("Mohon lengkapi NIP dan Nama Pegawai pada Langkah 1 terlebih dahulu.");
                    return;
                  }
                  setCurrentStep(3);
                }}
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', opacity: currentStep === 3 ? 1 : 0.6 }}
              >
                <div className="compact-wizard-circle" style={{ width: '22px', height: '22px', borderRadius: '50%', background: currentStep === 3 ? '#2563eb' : '#94a3b8', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.75rem' }}>3</div>
                <span className="compact-wizard-text" style={{ fontSize: '0.78rem', fontWeight: currentStep === 3 ? 700 : 500, color: currentStep === 3 ? '#1e293b' : '#64748b' }}>Data Anak</span>
              </div>
            </div>

            <form onSubmit={handleFormSubmit}>
              {/* STEP 1: DATA PEGAWAI */}
              {currentStep === 1 && (
                <div>
                  <div className="compact-section-wrapper" style={{ marginBottom: '0.45rem' }}>
                    <h4 className="compact-section-title" style={{ fontSize: '0.82rem', color: '#1e3a8a', marginBottom: '0.2rem', borderLeft: '3px solid #2563eb', paddingLeft: '0.4rem', fontWeight: 700 }}>
                      1. Data Utama Pegawai
                    </h4>
                    <div className="compact-grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.2rem 0.6rem' }}>
                      <div className="form-group">
                        <label style={{ fontSize: '0.76rem', fontWeight: 600 }}>NIP *</label>
                        <input type="text" name="nip" value={formData.nip} onChange={handleInputChange} placeholder="18 digit NIP" required />
                      </div>
                      <div className="form-group">
                        <label style={{ fontSize: '0.76rem', fontWeight: 600 }}>Nama & Gelar *</label>
                        <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Contoh: Ahmad Budi, S.E." required />
                      </div>
                      <div className="form-group">
                        <label style={{ fontSize: '0.76rem', fontWeight: 600 }}>NIK</label>
                        <input type="text" name="nik" value={formData.nik} onChange={handleInputChange} placeholder="16 digit NIK" />
                      </div>
                      <div className="form-group">
                        <label style={{ fontSize: '0.76rem', fontWeight: 600 }}>Jenis Kelamin *</label>
                        <select name="gender" value={formData.gender} onChange={handleInputChange}>
                          <option value="L">Laki-laki (L)</option>
                          <option value="P">Perempuan (P)</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label style={{ fontSize: '0.76rem', fontWeight: 600 }}>Tempat Lahir *</label>
                        <input type="text" name="birth_place" value={formData.birth_place} onChange={handleInputChange} placeholder="Kota/Kabupaten" />
                      </div>
                      <div className="form-group">
                        <label style={{ fontSize: '0.76rem', fontWeight: 600 }}>Tanggal Lahir *</label>
                        <DateInput name="birth_date" value={formData.birth_date} onChange={handleInputChange} placeholder="dd/mm/yyyy" />
                      </div>
                    </div>
                  </div>

                  <div className="compact-section-wrapper" style={{ marginBottom: '0.45rem' }}>
                    <h4 className="compact-section-title" style={{ fontSize: '0.82rem', color: '#1e3a8a', marginBottom: '0.2rem', borderLeft: '3px solid #2563eb', paddingLeft: '0.4rem', fontWeight: 700 }}>
                      2. Status Kepegawaian & Masa Kerja Golongan
                    </h4>
                    <div className="compact-grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.2rem 0.6rem' }}>
                      <div className="form-group">
                        <label style={{ fontSize: '0.76rem', fontWeight: 600 }}>Status ASN *</label>
                        <select name="status" value={formData.status} onChange={handleInputChange}>
                          <option value="PNS">PNS</option>
                          <option value="PPPK Penuh Waktu">PPPK Penuh Waktu</option>
                          <option value="PPPK Paruh Waktu">PPPK Paruh Waktu</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label style={{ fontSize: '0.76rem', fontWeight: 600 }}>TMT ASN / CPNS</label>
                        <DateInput name="tmt_cpns" value={formData.tmt_cpns} onChange={handleInputChange} placeholder="dd/mm/yyyy" />
                      </div>
                      <div className="form-group">
                        <label style={{ fontSize: '0.76rem', fontWeight: 600 }}>Status Perkawinan *</label>
                        <select name="marital_status" value={formData.marital_status} onChange={handleInputChange}>
                          <option value="KAWIN">KAWIN</option>
                          <option value="BELUM KAWIN">BELUM KAWIN</option>
                          <option value="CERAI HIDUP">CERAI HIDUP</option>
                          <option value="CERAI MATI">CERAI MATI</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label style={{ fontSize: '0.76rem', fontWeight: 600 }}>Masa Kerja Golongan (Tahun)</label>
                        <input type="number" name="mkg_years" min="0" value={formData.mkg_years} onChange={handleInputChange} placeholder="0" />
                      </div>
                      <div className="form-group">
                        <label style={{ fontSize: '0.76rem', fontWeight: 600 }}>Masa Kerja Golongan (Bulan)</label>
                        <input type="number" name="mkg_months" min="0" max="11" value={formData.mkg_months} onChange={handleInputChange} placeholder="0" />
                      </div>
                      <div className="form-group">
                        <label style={{ fontSize: '0.76rem', fontWeight: 600 }}>Tanggal MKG (TMT MKG)</label>
                        <DateInput name="tmt_mkg" value={formData.tmt_mkg} onChange={handleInputChange} placeholder="dd/mm/yyyy" />
                      </div>
                    </div>
                  </div>

                  <div className="compact-section-wrapper" style={{ marginBottom: '0.45rem' }}>
                    <h4 className="compact-section-title" style={{ fontSize: '0.82rem', color: '#1e3a8a', marginBottom: '0.2rem', borderLeft: '3px solid #2563eb', paddingLeft: '0.4rem', fontWeight: 700 }}>
                      3. Pangkat, Jabatan & Unit Kerja
                    </h4>
                    <div className="compact-grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.2rem 0.6rem' }}>
                      <div className="form-group">
                        <label style={{ fontSize: '0.76rem', fontWeight: 600 }}>Pangkat / Golongan</label>
                        <input type="text" name="rank" value={formData.rank} onChange={handleInputChange} placeholder="Contoh: III/a atau IX" />
                      </div>
                      <div className="form-group">
                        <label style={{ fontSize: '0.76rem', fontWeight: 600 }}>Jabatan</label>
                        <input type="text" name="position" value={formData.position} onChange={handleInputChange} placeholder="Contoh: Analis Kepegawaian" />
                      </div>
                      <div className="form-group">
                        <label style={{ fontSize: '0.76rem', fontWeight: 600 }}>Unit Kerja</label>
                        <input type="text" name="unit_kerja" value={formData.unit_kerja} onChange={handleInputChange} placeholder="Contoh: Bidang Mutasi" />
                      </div>
                    </div>
                  </div>

                  <div className="compact-section-wrapper" style={{ marginBottom: '0.45rem' }}>
                    <h4 className="compact-section-title" style={{ fontSize: '0.82rem', color: '#1e3a8a', marginBottom: '0.2rem', borderLeft: '3px solid #2563eb', paddingLeft: '0.4rem', fontWeight: 700 }}>
                      4. Alamat
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.2rem 0.6rem' }}>
                      <div className="form-group">
                        <label style={{ fontSize: '0.76rem', fontWeight: 600 }}>Alamat Lengkap</label>
                        <input type="text" name="address" value={formData.address} onChange={handleInputChange} placeholder="Jl. Contoh No. X..." />
                      </div>
                    </div>
                  </div>

                  <div className="compact-modal-footer flex gap-4" style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.4rem', marginTop: '0.4rem' }}>
                    <button type="button" className="btn-secondary" onClick={handleRequestClose}>Batal</button>
                    <button 
                      type="button" 
                      className="btn-primary" 
                      onClick={() => {
                        if (!formData.nip || !formData.name) {
                          alert("Mohon isi NIP dan Nama Pegawai terlebih dahulu.");
                          return;
                        }
                        setCurrentStep(2);
                      }}
                    >
                      Lanjut: Data Pasangan &gt;
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: DATA PASANGAN */}
              {currentStep === 2 && (
                <div>
                  <div style={{ marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <h4 style={{ fontSize: '0.95rem', color: '#1e3a8a', margin: 0, borderLeft: '3px solid #2563eb', paddingLeft: '0.5rem' }}>
                        Data Pasangan (Suami / Istri)
                      </h4>
                      {formData.marital_status !== 'KAWIN' && (
                        <span style={{ fontSize: '0.8rem', background: '#fef3c7', color: '#92400e', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                          Status: {formData.marital_status} (Opsional / Dapat dilewati)
                        </span>
                      )}
                    </div>

                    <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1rem' }}>
                      Isi data pasangan jika pegawai telah menikah, atau klik <strong>Lanjut: Data Anak</strong> untuk melewati tahap ini.
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
                      <div className="form-group">
                        <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Nama Pasangan</label>
                        <input 
                          type="text" 
                          name="name" 
                          value={spouseData.name} 
                          onChange={handleSpouseChange} 
                          placeholder="Nama lengkap suami/istri" 
                        />
                      </div>
                      <div className="form-group">
                        <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>NIK Pasangan</label>
                        <input 
                          type="text" 
                          name="nik" 
                          value={spouseData.nik} 
                          onChange={handleSpouseChange} 
                          placeholder="16 digit NIK" 
                        />
                      </div>
                      <div className="form-group">
                        <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Tempat Lahir</label>
                        <input 
                          type="text" 
                          name="birth_place" 
                          value={spouseData.birth_place} 
                          onChange={handleSpouseChange} 
                          placeholder="Kota/Kabupaten" 
                        />
                      </div>
                      <div className="form-group">
                        <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Tanggal Lahir</label>
                        <DateInput 
                          name="birth_date" 
                          value={spouseData.birth_date} 
                          onChange={handleSpouseChange} 
                          placeholder="dd/mm/yyyy" 
                        />
                      </div>
                      <div className="form-group">
                        <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Tanggal Perkawinan</label>
                        <DateInput 
                          name="marriage_date" 
                          value={spouseData.marriage_date} 
                          onChange={handleSpouseChange} 
                          placeholder="dd/mm/yyyy" 
                        />
                      </div>
                      <div className="form-group">
                        <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Pekerjaan</label>
                        <input 
                          type="text" 
                          name="job" 
                          value={spouseData.job} 
                          onChange={handleSpouseChange} 
                          placeholder="Contoh: PNS / Swasta / Wiraswasta" 
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 mt-4" style={{ justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                    <button type="button" className="btn-secondary" onClick={() => setCurrentStep(1)}>&lt; Kembali ke Data Pegawai</button>
                    <button type="button" className="btn-primary" onClick={() => setCurrentStep(3)}>Lanjut: Data Anak &gt;</button>
                  </div>
                </div>
              )}

              {/* STEP 3: DATA ANAK */}
              {currentStep === 3 && (
                <div>
                  <div style={{ marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <h4 style={{ fontSize: '0.95rem', color: '#1e3a8a', margin: 0, borderLeft: '3px solid #2563eb', paddingLeft: '0.5rem' }}>
                        Data Anak ({childrenData.length} Anak)
                      </h4>
                      <button 
                        type="button" 
                        className="btn-secondary" 
                        onClick={handleAddChild} 
                        style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
                      >
                        + Tambah Anak
                      </button>
                    </div>

                    <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1rem' }}>
                      Tambahkan data anak untuk tunjangan keluarga (jika ada). Anda dapat menambah lebih dari 1 anak.
                    </p>

                    {childrenData.length === 0 ? (
                      <div style={{ background: '#f8fafc', padding: '2rem', textAlign: 'center', borderRadius: '8px', border: '1px dashed #cbd5e1', color: '#64748b' }}>
                        <p style={{ margin: 0, fontSize: '0.9rem' }}>Belum ada data anak yang ditambahkan.</p>
                        <button 
                          type="button" 
                          className="btn-primary mt-3" 
                          onClick={handleAddChild}
                          style={{ fontSize: '0.85rem' }}
                        >
                          + Tambah Data Anak
                        </button>
                      </div>
                    ) : (
                      childrenData.map((child, idx) => (
                        <div key={idx} style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '1rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                            <strong style={{ fontSize: '0.85rem', color: '#1e293b' }}>Anak ke-{idx + 1}</strong>
                            <button 
                              type="button" 
                              onClick={() => handleRemoveChild(idx)}
                              style={{ background: '#fee2e2', color: '#991b1b', border: 'none', borderRadius: '4px', padding: '0.2rem 0.5rem', fontSize: '0.75rem', cursor: 'pointer' }}
                            >
                              Hapus
                            </button>
                          </div>
                          
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
                            <div className="form-group">
                              <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Nama Anak *</label>
                              <input 
                                type="text" 
                                value={child.name} 
                                onChange={(e) => handleChildChange(idx, 'name', e.target.value)} 
                                placeholder="Nama lengkap anak" 
                                required
                              />
                            </div>
                            <div className="form-group">
                              <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>NIK Anak</label>
                              <input 
                                type="text" 
                                value={child.nik} 
                                onChange={(e) => handleChildChange(idx, 'nik', e.target.value)} 
                                placeholder="16 digit NIK" 
                              />
                            </div>
                            <div className="form-group">
                              <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Tempat Lahir</label>
                              <input 
                                type="text" 
                                value={child.birth_place} 
                                onChange={(e) => handleChildChange(idx, 'birth_place', e.target.value)} 
                                placeholder="Kota/Kabupaten" 
                              />
                            </div>
                            <div className="form-group">
                              <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Tanggal Lahir</label>
                              <DateInput 
                                name={`child_birth_${idx}`}
                                value={child.birth_date} 
                                onChange={(e) => handleChildChange(idx, 'birth_date', e.target.value)} 
                                placeholder="dd/mm/yyyy" 
                              />
                            </div>
                            <div className="form-group">
                              <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Jenis Kelamin</label>
                              <select 
                                value={child.gender} 
                                onChange={(e) => handleChildChange(idx, 'gender', e.target.value)}
                              >
                                <option value="L">Laki-laki (L)</option>
                                <option value="P">Perempuan (P)</option>
                              </select>
                            </div>
                            <div className="form-group">
                              <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Nomor Akta Lahir</label>
                              <input 
                                type="text" 
                                value={child.document_number} 
                                onChange={(e) => handleChildChange(idx, 'document_number', e.target.value)} 
                                placeholder="No. Akta Kelahiran" 
                              />
                            </div>
                            <div className="form-group">
                              <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Status Anak</label>
                              <select 
                                value={child.child_status} 
                                onChange={(e) => handleChildChange(idx, 'child_status', e.target.value)}
                              >
                                <option value="Anak Kandung">Anak Kandung</option>
                                <option value="Anak Tiri">Anak Tiri</option>
                                <option value="Anak Angkat">Anak Angkat</option>
                              </select>
                            </div>
                            <div className="form-group">
                              <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Pendidikan</label>
                              <select 
                                value={child.education || ''} 
                                onChange={(e) => handleChildChange(idx, 'education', e.target.value)}
                              >
                                <option value="">-- Pilih Pendidikan --</option>
                                <option value="Belum Sekolah">Belum Sekolah</option>
                                <option value="PAUD / TK">PAUD / TK</option>
                                <option value="SD / Sederajat">SD / Sederajat</option>
                                <option value="SMP / Sederajat">SMP / Sederajat</option>
                                <option value="SMA / SMK / Sederajat">SMA / SMK / Sederajat</option>
                                <option value="D1 / D2 / D3">D1 / D2 / D3</option>
                                <option value="S1 / D4">S1 / D4</option>
                                <option value="S2">S2</option>
                                <option value="S3">S3</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="flex gap-4 mt-4" style={{ justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                    <button type="button" className="btn-secondary" onClick={() => setCurrentStep(2)}>&lt; Kembali ke Data Pasangan</button>
                    <button type="submit" className="btn-primary">Simpan Pegawai</button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modals */}
      <ConfirmModal
        isOpen={showSaveConfirm}
        title="Konfirmasi Simpan Data"
        message="Apakah Anda yakin ingin menyimpan seluruh data pegawai beserta data keluarga ini?"
        confirmText="Ya, Simpan"
        cancelText="Batal"
        variant="primary"
        onConfirm={handleConfirmSave}
        onCancel={() => setShowSaveConfirm(false)}
      />

      <ConfirmModal
        isOpen={showCancelConfirm}
        title="Konfirmasi Batal"
        message="Ada perubahan data yang belum disimpan. Apakah Anda yakin ingin membatalkan dan menutup form ini?"
        confirmText="Ya, Batalkan"
        cancelText="Kembali ke Form"
        variant="warning"
        onConfirm={handleConfirmCancel}
        onCancel={() => setShowCancelConfirm(false)}
      />
    </div>
  );
};

export default EmployeeList;
