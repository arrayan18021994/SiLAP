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

interface EmployeeListProps {
  searchQuery?: string;
}

const EmployeeList: React.FC<EmployeeListProps> = ({ searchQuery = '' }) => {
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '');
  const [employees, setEmployees] = useState<any[]>([]);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  // Multi-Step Modal States
  const [showModal, setShowModal] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<any>(initialFormState);
  const [spouseData, setSpouseData] = useState<any>(initialSpouseState);
  const [childrenData, setChildrenData] = useState<any[]>([]);

  // Confirmation Modals State
  const [showSaveConfirm, setShowSaveConfirm] = useState<boolean>(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState<boolean>(false);

  const highlightId = searchParams.get('highlight');

  useEffect(() => {
    const s = searchParams.get('search');
    const st = searchParams.get('status');
    if (s !== null) setSearchTerm(s);
    if (st !== null) setStatusFilter(st);
  }, [searchParams]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, searchQuery]);

  useEffect(() => {
    fetchEmployees();
  }, []);

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

  const handleInputChange = (e: { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
      ...(name === 'name' ? { full_name: value } : {}),
      ...(name === 'status' ? { asn_status: value } : {})
    }));
  };

  const handleSpouseChange = (e: { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    setSpouseData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleAddChild = () => {
    setChildrenData((prev: any[]) => [...prev, { ...initialChildItem }]);
  };

  const handleRemoveChild = (index: number) => {
    setChildrenData((prev: any[]) => prev.filter((_, i) => i !== index));
  };

  const handleChildChange = (index: number, name: string, value: string) => {
    setChildrenData((prev: any[]) => prev.map((item, i) => i === index ? { ...item, [name]: value } : item));
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

  const activeQuery = (searchQuery || searchTerm).trim().toLowerCase();

  const filteredEmployees = employees
    .filter(emp => {
      const matchesSearch = !activeQuery ||
        (emp.nip && emp.nip.toLowerCase().includes(activeQuery)) ||
        (emp.name && emp.name.toLowerCase().includes(activeQuery)) ||
        (emp.full_name && emp.full_name.toLowerCase().includes(activeQuery)) ||
        (emp.position && emp.position.toLowerCase().includes(activeQuery)) ||
        (emp.opd && emp.opd.toLowerCase().includes(activeQuery));

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

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEmployees = filteredEmployees.slice(startIndex, startIndex + itemsPerPage);

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
              <th style={{ textAlign: 'center' }}>NIP</th>
              <th style={{ textAlign: 'center' }}>NAMA</th>
              <th style={{ textAlign: 'center' }}>STATUS ASN</th>
              <th style={{ textAlign: 'center' }}>GOLONGAN</th>
              <th style={{ textAlign: 'center' }}>JABATAN</th>
              <th style={{ textAlign: 'center' }}>MKG</th>
              <th style={{ textAlign: 'center' }}>STATUS PERKAWINAN</th>
              <th style={{ textAlign: 'center' }}>JUMLAH ANAK</th>
              <th style={{ textAlign: 'center' }}>AKSI</th>
            </tr>
          </thead>
          <tbody>
            {paginatedEmployees.map(emp => (
              <tr key={emp.id} className={highlightId === String(emp.id) ? 'row-highlight' : ''}>
                <td style={{ fontWeight: 400, textAlign: 'center' }}>{emp.nip}</td>
                <td style={{ fontWeight: 400, textAlign: 'left' }}>{emp.name || emp.full_name}</td>
                <td style={{ textAlign: 'center' }}>
                  <span className={`badge ${emp.status && emp.status.toLowerCase().includes('pns') ? 'badge-normal' : 'badge-attention'}`}>
                    {emp.status || emp.asn_status}
                  </span>
                </td>
                <td style={{ textAlign: 'center' }}>{emp.rank || '-'}</td>
                <td style={{ textAlign: 'left' }}>{emp.position || '-'}</td>
                <td style={{ textAlign: 'center' }}>
                  {emp.mkg_years !== undefined ? `${emp.mkg_years} Thn ${emp.mkg_months || 0} Bln` : '-'}
                </td>
                <td style={{ textAlign: 'center' }}>{emp.marital_status || 'KAWIN'}</td>
                <td style={{ textAlign: 'center' }}>
                  {emp.children_count !== undefined ? `${emp.children_count} Anak` : (emp.children ? `${emp.children.length} Anak` : '0 Anak')}
                </td>
                <td style={{ textAlign: 'center' }}>
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

      <div className="pagination" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
        <span>
          Menampilkan {filteredEmployees.length > 0 ? startIndex + 1 : 0}-{Math.min(startIndex + itemsPerPage, filteredEmployees.length)} dari {filteredEmployees.length} data
        </span>
        <div className="page-controls" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button 
            disabled={currentPage <= 1} 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            className="btn-secondary"
            style={{ padding: '0.3rem 0.75rem', fontSize: '0.8rem', cursor: currentPage <= 1 ? 'not-allowed' : 'pointer', opacity: currentPage <= 1 ? 0.5 : 1 }}
          >
            &lt; Prev
          </button>
          <span style={{ fontSize: '0.85rem', fontWeight: 500, padding: '0 0.5rem', color: 'var(--text-main)' }}>
            Halaman {currentPage} dari {totalPages}
          </span>
          <button 
            disabled={currentPage >= totalPages} 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            className="btn-secondary"
            style={{ padding: '0.3rem 0.75rem', fontSize: '0.8rem', cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer', opacity: currentPage >= totalPages ? 0.5 : 1 }}
          >
            Next &gt;
          </button>
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
              <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-main)' }}>Tambah Pegawai Baru (Manual)</h3>
              <button
                type="button"
                onClick={handleRequestClose}
                style={{ background: 'none', border: 'none', fontSize: '1.3rem', cursor: 'pointer', color: '#64748b' }}
              >
                &times;
              </button>
            </div>

            {/* Step Wizard Bar */}
            <div className="compact-wizard-bar" style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '0.5rem', background: '#f8fafc', padding: '0.35rem 0.5rem', borderRadius: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: currentStep >= 1 ? '#2563eb' : '#94a3b8', fontWeight: currentStep === 1 ? 700 : 500, fontSize: '0.78rem' }}>
                <span className="compact-wizard-circle" style={{ width: '18px', height: '18px', borderRadius: '50%', background: currentStep >= 1 ? '#2563eb' : '#cbd5e1', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>1</span>
                1. Data Utama
              </div>
              <div style={{ color: '#cbd5e1' }}>&gt;</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: currentStep >= 2 ? '#2563eb' : '#94a3b8', fontWeight: currentStep === 2 ? 700 : 500, fontSize: '0.78rem' }}>
                <span className="compact-wizard-circle" style={{ width: '18px', height: '18px', borderRadius: '50%', background: currentStep >= 2 ? '#2563eb' : '#cbd5e1', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>2</span>
                2. Data Pasangan
              </div>
              <div style={{ color: '#cbd5e1' }}>&gt;</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: currentStep >= 3 ? '#2563eb' : '#94a3b8', fontWeight: currentStep === 3 ? 700 : 500, fontSize: '0.78rem' }}>
                <span className="compact-wizard-circle" style={{ width: '18px', height: '18px', borderRadius: '50%', background: currentStep >= 3 ? '#2563eb' : '#cbd5e1', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>3</span>
                3. Data Anak
              </div>
            </div>

            <form onSubmit={handleFormSubmit}>
              {/* STEP 1 */}
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
                        <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Nama lengkap pegawai" required />
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
                        <input type="text" name="birth_place" value={formData.birth_place} onChange={handleInputChange} placeholder="Kota lahir" required />
                      </div>
                      <div className="form-group">
                        <label style={{ fontSize: '0.76rem', fontWeight: 600 }}>Tanggal Lahir *</label>
                        <DateInput name="birth_date" value={formData.birth_date} onChange={handleInputChange} placeholder="dd/mm/yyyy" required />
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
                        <label style={{ fontSize: '0.76rem', fontWeight: 600 }}>MKG (Tahun)</label>
                        <input type="number" name="mkg_years" min="0" value={formData.mkg_years} onChange={handleInputChange} />
                      </div>
                      <div className="form-group">
                        <label style={{ fontSize: '0.76rem', fontWeight: 600 }}>MKG (Bulan)</label>
                        <input type="number" name="mkg_months" min="0" max="11" value={formData.mkg_months} onChange={handleInputChange} />
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
                        <input type="text" name="rank" value={formData.rank} onChange={handleInputChange} placeholder="Contoh: III/a" />
                      </div>
                      <div className="form-group">
                        <label style={{ fontSize: '0.76rem', fontWeight: 600 }}>Jabatan</label>
                        <input type="text" name="position" value={formData.position} onChange={handleInputChange} placeholder="Jabatan" />
                      </div>
                      <div className="form-group">
                        <label style={{ fontSize: '0.76rem', fontWeight: 600 }}>Unit Kerja (OPD)</label>
                        <input type="text" name="opd" value={formData.opd} onChange={handleInputChange} placeholder="Unit Kerja / OPD" />
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
                        <input type="text" name="address" value={formData.address} onChange={handleInputChange} placeholder="Alamat rumah" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2 */}
              {currentStep === 2 && (
                <div>
                  <h4 style={{ fontSize: '0.9rem', color: '#1e3a8a', marginBottom: '0.5rem', borderLeft: '3px solid #2563eb', paddingLeft: '0.5rem' }}>
                    2. Data Suami / Istri (Opsional)
                  </h4>
                  <div className="compact-grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.4rem 0.6rem' }}>
                    <div className="form-group">
                      <label style={{ fontSize: '0.76rem', fontWeight: 600 }}>Nama Suami / Istri</label>
                      <input type="text" name="name" value={spouseData.name} onChange={handleSpouseChange} placeholder="Nama Lengkap Pasangan" />
                    </div>
                    <div className="form-group">
                      <label style={{ fontSize: '0.76rem', fontWeight: 600 }}>NIK</label>
                      <input type="text" name="nik" value={spouseData.nik} onChange={handleSpouseChange} placeholder="16 digit NIK" />
                    </div>
                    <div className="form-group">
                      <label style={{ fontSize: '0.76rem', fontWeight: 600 }}>Pekerjaan</label>
                      <input type="text" name="job" value={spouseData.job} onChange={handleSpouseChange} placeholder="Pekerjaan saat ini" />
                    </div>
                    <div className="form-group">
                      <label style={{ fontSize: '0.76rem', fontWeight: 600 }}>Tempat Lahir</label>
                      <input type="text" name="birth_place" value={spouseData.birth_place} onChange={handleSpouseChange} placeholder="Kota lahir" />
                    </div>
                    <div className="form-group">
                      <label style={{ fontSize: '0.76rem', fontWeight: 600 }}>Tanggal Lahir</label>
                      <DateInput name="birth_date" value={spouseData.birth_date} onChange={handleSpouseChange} placeholder="dd/mm/yyyy" />
                    </div>
                    <div className="form-group">
                      <label style={{ fontSize: '0.76rem', fontWeight: 600 }}>Tanggal Pernikahan</label>
                      <DateInput name="marriage_date" value={spouseData.marriage_date} onChange={handleSpouseChange} placeholder="dd/mm/yyyy" />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3 */}
              {currentStep === 3 && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <h4 style={{ fontSize: '0.9rem', color: '#1e3a8a', margin: 0, borderLeft: '3px solid #2563eb', paddingLeft: '0.5rem' }}>
                      3. Data Anak (Opsional)
                    </h4>
                    <button type="button" className="btn-secondary" onClick={handleAddChild} style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}>
                      + Tambah Anak
                    </button>
                  </div>

                  {childrenData.length === 0 ? (
                    <div style={{ padding: '1rem', textAlign: 'center', background: '#f8fafc', borderRadius: '6px', border: '1px dashed #cbd5e1', fontSize: '0.8rem', color: '#64748b' }}>
                      Belum ada data anak ditambahkan. Klik "+ Tambah Anak" jika pegawai memiliki anak.
                    </div>
                  ) : (
                    childrenData.map((child, idx) => (
                      <div key={idx} style={{ background: '#f8fafc', padding: '0.5rem', borderRadius: '6px', border: '1px solid #e2e8f0', marginBottom: '0.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#1e293b' }}>Anak Ke-{idx + 1}</span>
                          <button type="button" onClick={() => handleRemoveChild(idx)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.75rem' }}>
                            Hapus
                          </button>
                        </div>
                        <div className="compact-grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.3rem 0.5rem' }}>
                          <div className="form-group">
                            <label style={{ fontSize: '0.72rem', fontWeight: 600 }}>Nama Anak</label>
                            <input type="text" value={child.name} onChange={(e) => handleChildChange(idx, 'name', e.target.value)} placeholder="Nama Lengkap" />
                          </div>
                          <div className="form-group">
                            <label style={{ fontSize: '0.72rem', fontWeight: 600 }}>NIK</label>
                            <input type="text" value={child.nik} onChange={(e) => handleChildChange(idx, 'nik', e.target.value)} placeholder="NIK Anak" />
                          </div>
                          <div className="form-group">
                            <label style={{ fontSize: '0.72rem', fontWeight: 600 }}>Jenis Kelamin</label>
                            <select value={child.gender} onChange={(e) => handleChildChange(idx, 'gender', e.target.value)}>
                              <option value="L">Laki-laki (L)</option>
                              <option value="P">Perempuan (P)</option>
                            </select>
                          </div>
                          <div className="form-group">
                            <label style={{ fontSize: '0.72rem', fontWeight: 600 }}>Tanggal Lahir</label>
                            <DateInput name="birth_date" value={child.birth_date} onChange={(e) => handleChildChange(idx, 'birth_date', e.target.value)} placeholder="dd/mm/yyyy" />
                          </div>
                          <div className="form-group">
                            <label style={{ fontSize: '0.72rem', fontWeight: 600 }}>Status Hubungan</label>
                            <select value={child.child_status} onChange={(e) => handleChildChange(idx, 'child_status', e.target.value)}>
                              <option value="Anak Kandung">Anak Kandung</option>
                              <option value="Anak Tiri">Anak Tiri</option>
                              <option value="Anak Angkat">Anak Angkat</option>
                            </select>
                          </div>
                          <div className="form-group">
                            <label style={{ fontSize: '0.72rem', fontWeight: 600 }}>Pendidikan</label>
                            <input type="text" value={child.education} onChange={(e) => handleChildChange(idx, 'education', e.target.value)} placeholder="Contoh: SD/SMP/Kuliah" />
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Wizard Footer Buttons */}
              <div className="compact-modal-footer" style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '0.4rem', marginTop: '0.4rem' }}>
                <button type="button" className="btn-secondary" onClick={handleRequestClose} style={{ fontSize: '0.8rem', padding: '0.3rem 0.75rem' }}>
                  Batal
                </button>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {currentStep > 1 && (
                    <button type="button" className="btn-secondary" onClick={() => setCurrentStep(prev => prev - 1)} style={{ fontSize: '0.8rem', padding: '0.3rem 0.75rem' }}>
                      &lt; Kembali
                    </button>
                  )}
                  {currentStep < 3 ? (
                    <button type="button" className="btn-primary" onClick={() => setCurrentStep(prev => prev + 1)} style={{ fontSize: '0.8rem', padding: '0.3rem 0.75rem' }}>
                      Lanjut &gt;
                    </button>
                  ) : (
                    <button type="submit" className="btn-primary" style={{ fontSize: '0.8rem', padding: '0.3rem 0.75rem' }}>
                      Simpan Seluruh Data
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Save Confirmation Modal */}
      <ConfirmModal
        isOpen={showSaveConfirm}
        title="Konfirmasi Simpan Data"
        message="Apakah Anda yakin data pegawai dan keluarga yang dimasukkan sudah benar?"
        confirmText="Ya, Simpan"
        cancelText="Periksa Lagi"
        onConfirm={handleConfirmSave}
        onCancel={() => setShowSaveConfirm(false)}
      />

      {/* Cancel Confirmation Modal */}
      <ConfirmModal
        isOpen={showCancelConfirm}
        title="Batalkan Pengisian Data?"
        message="Data yang sudah diisi dalam formulir akan hilang jika Anda membatalkan."
        confirmText="Ya, Batalkan"
        cancelText="Lanjutkan Pengisian"
        onConfirm={handleConfirmCancel}
        onCancel={() => setShowCancelConfirm(false)}
      />
    </div>
  );
};

export default EmployeeList;
