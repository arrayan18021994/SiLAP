import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ServicePeriodTab from './ServicePeriodTab';
import EmployeeLeaveTab from '../leave/EmployeeLeaveTab';
import EmployeeKGBTab from '../kgb/EmployeeKGBTab';
import EmployeeFamilyTab from '../personnel/family/EmployeeFamilyTab';
import LifeEventsTimeline from '../personnel/events/LifeEventsTimeline';
import AdministrativeList from '../personnel/administration/AdministrativeList';
import DateInput, { toDisplayFormat } from '../../components/DateInput';
import ConfirmModal from '../../components/ConfirmModal';
import './Employees.css';

const EmployeeProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('dasar');
  const [employee, setEmployee] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [initialData, setInitialData] = useState<any>({});

  // Confirmation modals state
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const fetchEmployee = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/v1/employees/${id}`);
      if (res.ok) {
        const data = await res.json();
        setEmployee(data);
        setFormData(data);
        setInitialData(data);
      } else {
        // Fallback mock if employee not found
        const mock = {
          id: id,
          nip: '198001012005011001',
          name: 'Ahmad Budi, S.E.',
          full_name: 'Ahmad Budi, S.E.',
          nik: '1172011005800001',
          birth_place: 'Sabang',
          birth_date_formatted: '10/05/1985',
          gender: 'L',
          status: 'PNS',
          asn_status: 'PNS',
          tmt_cpns_formatted: '01/04/2008',
          mkg_years: 5,
          mkg_months: 2,
          tmt_mkg_formatted: '01/04/2018',
          marital_status: 'KAWIN',
          rank: 'III/c',
          position: 'Analis Kepegawaian',
          opd: 'BKPSDM',
          address: 'Jl. Yos Sudarso No. 12',
          notes: '-'
        };
        setEmployee(mock);
        setFormData(mock);
        setInitialData(mock);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployee();
  }, [id]);

  const isFormDirty = () => {
    return JSON.stringify(formData) !== JSON.stringify(initialData);
  };

  const handleInputChange = (e: { target: { name: string; value: string } } | React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
      ...(name === 'name' ? { full_name: value } : {}),
      ...(name === 'status' ? { asn_status: value } : {})
    }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSaveConfirm(true);
  };

  const handleConfirmSave = async () => {
    setShowSaveConfirm(false);
    try {
      const res = await fetch(`/api/v1/employees/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setShowEditModal(false);
        fetchEmployee();
        alert("Data profil pegawai berhasil diperbarui!");
      } else {
        const err = await res.json();
        alert(err.detail || "Gagal memperbarui profil pegawai");
      }
    } catch (e) {
      alert("Error: " + e);
    }
  };

  const handleRequestClose = () => {
    if (isFormDirty()) {
      setShowCancelConfirm(true);
    } else {
      setShowEditModal(false);
      setFormData(initialData);
    }
  };

  const handleConfirmCancel = () => {
    setShowCancelConfirm(false);
    setShowEditModal(false);
    setFormData(initialData);
  };

  const emp = employee || {
    nip: '198001012005011001',
    name: 'Ahmad Budi',
    status: 'PNS',
    rank: 'III/c',
    position: 'Analis Kepegawaian',
    opd: 'BKPSDM'
  };

  return (
    <div className="profile-container">
      <div className="mb-4">
        <Link to="/dashboard/employees" className="btn-text" style={{ paddingLeft: 0 }}>← Kembali ke Daftar Pegawai</Link>
      </div>
      {loading && <div style={{ marginBottom: '1rem', color: '#64748b' }}>Memuat data pegawai...</div>}
      
      <div className="card profile-header-card flex items-center gap-4 mb-4" style={{ padding: '2rem' }}>
        <div className="profile-photo" style={{ width: '80px', height: '80px', borderRadius: '8px', background: 'var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', color: 'var(--text-muted)' }}>
          👤
        </div>
        <div className="profile-info flex-1">
          <h2 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{emp.full_name || emp.name}</h2>
          <div className="flex gap-4 text-muted" style={{ fontSize: '12px', marginBottom: '1rem' }}>
            <span>NIP. {emp.nip}</span>
            <span>•</span>
            <span>{emp.rank || '-'}</span>
            <span>•</span>
            <span>{emp.position || '-'}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="badge badge-normal">● Aktif</span>
            <span className="text-muted" style={{ fontSize: '12px' }}>
              Masa Kerja Golongan: <strong>{emp.mkg_years || 0} Thn {emp.mkg_months || 0} Bln</strong> (TMT: {emp.tmt_mkg_formatted || toDisplayFormat(emp.tmt_mkg) || '-'})
            </span>
          </div>
        </div>
        <div className="profile-actions">
          <button className="btn-secondary" onClick={() => { setFormData(employee || emp); setShowEditModal(true); }}>Edit Profil</button>
        </div>
      </div>

      <div className="tabs-container">
        <div className="tabs-header">
          <button className={`tab-btn ${activeTab === 'dasar' ? 'active' : ''}`} onClick={() => setActiveTab('dasar')}>Data Dasar</button>
          <button className={`tab-btn ${activeTab === 'pangkat' ? 'active' : ''}`} onClick={() => setActiveTab('pangkat')}>Pangkat</button>
          <button className={`tab-btn ${activeTab === 'jabatan' ? 'active' : ''}`} onClick={() => setActiveTab('jabatan')}>Jabatan</button>
          <button className={`tab-btn ${activeTab === 'masa-kerja' ? 'active' : ''}`} onClick={() => setActiveTab('masa-kerja')}>Masa Kerja</button>
          <button className={`tab-btn ${activeTab === 'keluarga' ? 'active' : ''}`} onClick={() => setActiveTab('keluarga')}>Keluarga</button>
          <button className={`tab-btn ${activeTab === 'peristiwa' ? 'active' : ''}`} onClick={() => setActiveTab('peristiwa')}>Peristiwa</button>
          <button className={`tab-btn ${activeTab === 'cuti' ? 'active' : ''}`} onClick={() => setActiveTab('cuti')}>Cuti</button>
          <button className={`tab-btn ${activeTab === 'kgb' ? 'active' : ''}`} onClick={() => setActiveTab('kgb')}>KGB</button>
          <button className={`tab-btn ${activeTab === 'administrasi' ? 'active' : ''}`} onClick={() => setActiveTab('administrasi')}>Administrasi</button>
        </div>
        
        <div className="tab-content">
          {activeTab === 'dasar' && (
            <div className="card" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', color: '#1e3a8a', marginBottom: '1.25rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
                Informasi Biodata Pegawai
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#64748b', display: 'block' }}>NIP</label>
                  <strong style={{ fontSize: '0.95rem', color: '#1e293b' }}>{emp.nip || '-'}</strong>
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#64748b', display: 'block' }}>Nama Lengkap & Gelar</label>
                  <strong style={{ fontSize: '0.95rem', color: '#1e293b' }}>{emp.full_name || emp.name || '-'}</strong>
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#64748b', display: 'block' }}>NIK</label>
                  <strong style={{ fontSize: '0.95rem', color: '#1e293b' }}>{emp.nik || '-'}</strong>
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#64748b', display: 'block' }}>Tempat / Tanggal Lahir</label>
                  <strong style={{ fontSize: '0.95rem', color: '#1e293b' }}>
                    {emp.birth_place || '-'}, {emp.birth_date_formatted || toDisplayFormat(emp.birth_date) || '-'}
                  </strong>
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#64748b', display: 'block' }}>Jenis Kelamin</label>
                  <strong style={{ fontSize: '0.95rem', color: '#1e293b' }}>{emp.gender === 'L' ? 'Laki-laki (L)' : emp.gender === 'P' ? 'Perempuan (P)' : '-'}</strong>
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#64748b', display: 'block' }}>Status ASN</label>
                  <strong style={{ fontSize: '0.95rem', color: '#1e293b' }}>{emp.status || emp.asn_status || '-'}</strong>
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#64748b', display: 'block' }}>TMT ASN / CPNS</label>
                  <strong style={{ fontSize: '0.95rem', color: '#1e293b' }}>{emp.tmt_cpns_formatted || toDisplayFormat(emp.tmt_cpns) || '-'}</strong>
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#64748b', display: 'block' }}>Masa Kerja Golongan (MKG)</label>
                  <strong style={{ fontSize: '0.95rem', color: '#2563eb' }}>{emp.mkg_years || 0} Tahun {emp.mkg_months || 0} Bulan</strong>
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#64748b', display: 'block' }}>Tanggal MKG (TMT MKG)</label>
                  <strong style={{ fontSize: '0.95rem', color: '#2563eb' }}>{emp.tmt_mkg_formatted || toDisplayFormat(emp.tmt_mkg) || '-'}</strong>
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#64748b', display: 'block' }}>Status Perkawinan</label>
                  <strong style={{ fontSize: '0.95rem', color: '#1e293b' }}>{emp.marital_status || '-'}</strong>
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#64748b', display: 'block' }}>Pangkat / Golongan</label>
                  <strong style={{ fontSize: '0.95rem', color: '#1e293b' }}>{emp.rank || '-'}</strong>
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#64748b', display: 'block' }}>Jabatan</label>
                  <strong style={{ fontSize: '0.95rem', color: '#1e293b' }}>{emp.position || '-'}</strong>
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ fontSize: '0.8rem', color: '#64748b', display: 'block' }}>Alamat</label>
                  <strong style={{ fontSize: '0.95rem', color: '#1e293b' }}>{emp.address || '-'}</strong>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'masa-kerja' && <ServicePeriodTab employeeId={id} />}
          {activeTab === 'keluarga' && <EmployeeFamilyTab employeeId={id} />}
          {activeTab === 'peristiwa' && <LifeEventsTimeline />}
          {activeTab === 'cuti' && <EmployeeLeaveTab />}
          {activeTab === 'kgb' && <EmployeeKGBTab />}
          {activeTab === 'administrasi' && <AdministrativeList />}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
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
              <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-main)' }}>Edit Profil Pegawai</h3>
              <button
                type="button"
                onClick={handleRequestClose}
                style={{ background: 'none', border: 'none', fontSize: '1.3rem', cursor: 'pointer', color: '#64748b' }}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleFormSubmit}>
              <div className="compact-section-wrapper" style={{ marginBottom: '0.45rem' }}>
                <h4 className="compact-section-title" style={{ fontSize: '0.82rem', color: '#1e3a8a', marginBottom: '0.2rem', borderLeft: '3px solid #2563eb', paddingLeft: '0.4rem', fontWeight: 700 }}>
                  1. Data Utama Pegawai
                </h4>
                <div className="compact-grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.2rem 0.6rem' }}>
                  <div className="form-group">
                    <label style={{ fontSize: '0.76rem', fontWeight: 600 }}>NIP *</label>
                    <input type="text" name="nip" value={formData.nip || ''} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <label style={{ fontSize: '0.76rem', fontWeight: 600 }}>Nama & Gelar *</label>
                    <input type="text" name="full_name" value={formData.full_name || formData.name || ''} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <label style={{ fontSize: '0.76rem', fontWeight: 600 }}>NIK</label>
                    <input type="text" name="nik" value={formData.nik || ''} onChange={handleInputChange} />
                  </div>
                  <div className="form-group">
                    <label style={{ fontSize: '0.76rem', fontWeight: 600 }}>Jenis Kelamin *</label>
                    <select name="gender" value={formData.gender || 'L'} onChange={handleInputChange}>
                      <option value="L">Laki-laki (L)</option>
                      <option value="P">Perempuan (P)</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label style={{ fontSize: '0.76rem', fontWeight: 600 }}>Tempat Lahir *</label>
                    <input type="text" name="birth_place" value={formData.birth_place || ''} onChange={handleInputChange} />
                  </div>
                  <div className="form-group">
                    <label style={{ fontSize: '0.76rem', fontWeight: 600 }}>Tanggal Lahir *</label>
                    <DateInput name="birth_date" value={formData.birth_date || formData.birth_date_formatted} onChange={handleInputChange} placeholder="dd/mm/yyyy" />
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
                    <select name="asn_status" value={formData.asn_status || formData.status || 'PNS'} onChange={handleInputChange}>
                      <option value="PNS">PNS</option>
                      <option value="PPPK Penuh Waktu">PPPK Penuh Waktu</option>
                      <option value="PPPK Paruh Waktu">PPPK Paruh Waktu</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label style={{ fontSize: '0.76rem', fontWeight: 600 }}>TMT ASN / CPNS</label>
                    <DateInput name="tmt_cpns" value={formData.tmt_cpns || formData.tmt_cpns_formatted} onChange={handleInputChange} placeholder="dd/mm/yyyy" />
                  </div>
                  <div className="form-group">
                    <label style={{ fontSize: '0.76rem', fontWeight: 600 }}>Status Perkawinan *</label>
                    <select name="marital_status" value={formData.marital_status || 'KAWIN'} onChange={handleInputChange}>
                      <option value="KAWIN">KAWIN</option>
                      <option value="BELUM KAWIN">BELUM KAWIN</option>
                      <option value="CERAI HIDUP">CERAI HIDUP</option>
                      <option value="CERAI MATI">CERAI MATI</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label style={{ fontSize: '0.76rem', fontWeight: 600 }}>Masa Kerja Golongan (Tahun)</label>
                    <input type="number" name="mkg_years" min="0" value={formData.mkg_years ?? 0} onChange={handleInputChange} />
                  </div>
                  <div className="form-group">
                    <label style={{ fontSize: '0.76rem', fontWeight: 600 }}>Masa Kerja Golongan (Bulan)</label>
                    <input type="number" name="mkg_months" min="0" max="11" value={formData.mkg_months ?? 0} onChange={handleInputChange} />
                  </div>
                  <div className="form-group">
                    <label style={{ fontSize: '0.76rem', fontWeight: 600 }}>Tanggal MKG (TMT MKG)</label>
                    <DateInput name="tmt_mkg" value={formData.tmt_mkg || formData.tmt_mkg_formatted} onChange={handleInputChange} placeholder="dd/mm/yyyy" />
                  </div>
                </div>
              </div>

              <div className="compact-section-wrapper" style={{ marginBottom: '0.45rem' }}>
                <h4 className="compact-section-title" style={{ fontSize: '0.82rem', color: '#1e3a8a', marginBottom: '0.2rem', borderLeft: '3px solid #2563eb', paddingLeft: '0.4rem', fontWeight: 700 }}>
                  3. Pangkat & Jabatan
                </h4>
                <div className="compact-grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.2rem 0.6rem' }}>
                  <div className="form-group">
                    <label style={{ fontSize: '0.76rem', fontWeight: 600 }}>Pangkat / Golongan</label>
                    <input type="text" name="rank" value={formData.rank || ''} onChange={handleInputChange} />
                  </div>
                  <div className="form-group">
                    <label style={{ fontSize: '0.76rem', fontWeight: 600 }}>Jabatan</label>
                    <input type="text" name="position" value={formData.position || ''} onChange={handleInputChange} />
                  </div>
                  <div className="form-group">
                    <label style={{ fontSize: '0.76rem', fontWeight: 600 }}>Unit Kerja</label>
                    <input type="text" name="opd" value={formData.opd || ''} onChange={handleInputChange} />
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
                    <input type="text" name="address" value={formData.address || ''} onChange={handleInputChange} />
                  </div>
                </div>
              </div>

              <div className="compact-modal-footer flex gap-4" style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.4rem', marginTop: '0.4rem' }}>
                <button type="button" className="btn-secondary" onClick={handleRequestClose}>Batal</button>
                <button type="submit" className="btn-primary">Simpan Perubahan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modals */}
      <ConfirmModal
        isOpen={showSaveConfirm}
        title="Konfirmasi Simpan Data"
        message="Apakah Anda yakin ingin menyimpan perubahan data profil pegawai ini?"
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

export default EmployeeProfile;
