import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ServicePeriodTab from './ServicePeriodTab';
import EmployeeLeaveTab from '../leave/EmployeeLeaveTab';
import EmployeeKGBTab from '../kgb/EmployeeKGBTab';
import EmployeeFamilyTab from '../personnel/family/EmployeeFamilyTab';
import LifeEventsTimeline from '../personnel/events/LifeEventsTimeline';
import AdministrativeList from '../personnel/administration/AdministrativeList';
import './Employees.css';

const EmployeeProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('masa-kerja');

  // Mock employee data
  const emp = {
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
      
      <div className="card profile-header-card flex items-center gap-4 mb-4" style={{ padding: '2rem' }}>
        <div className="profile-photo" style={{ width: '80px', height: '80px', borderRadius: '8px', background: 'var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', color: 'var(--text-muted)' }}>
          👤
        </div>
        <div className="profile-info flex-1">
          <h2 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{emp.name}</h2>
          <div className="flex gap-4 text-muted" style={{ fontSize: '12px', marginBottom: '1rem' }}>
            <span>NIP. {emp.nip}</span>
            <span>•</span>
            <span>{emp.rank}</span>
            <span>•</span>
            <span>{emp.position}</span>
            <span>•</span>
            <span>{emp.opd}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="badge badge-normal">● Aktif</span>
            <span className="text-muted" style={{ fontSize: '12px' }}>KGB Berikutnya: 01-04-2027</span>
          </div>
        </div>
        <div className="profile-actions">
          <button className="btn-secondary">Edit Profil</button>
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
          <button className={`tab-btn ${activeTab === 'dokumen' ? 'active' : ''}`} onClick={() => setActiveTab('dokumen')}>Dokumen</button>
        </div>
        
        <div className="tab-content">
          {activeTab === 'masa-kerja' && <ServicePeriodTab employeeId={id} />}
          {activeTab === 'keluarga' && <EmployeeFamilyTab />}
          {activeTab === 'peristiwa' && <LifeEventsTimeline />}
          {activeTab === 'cuti' && <EmployeeLeaveTab />}
          {activeTab === 'kgb' && <EmployeeKGBTab />}
          {activeTab === 'administrasi' && <AdministrativeList />}
          {activeTab !== 'masa-kerja' && activeTab !== 'keluarga' && activeTab !== 'peristiwa' && activeTab !== 'cuti' && activeTab !== 'kgb' && activeTab !== 'administrasi' && (
             <div className="placeholder-content">
                <p>Modul {activeTab} akan diimplementasikan pada langkah berikutnya.</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfile;
