import React, { useState } from 'react';
import MonthFilter from '../../components/MonthFilter';
import './Leave.css';

const MONTHS = ['JANUARI', 'FEBRUARI', 'MARET', 'APRIL', 'MEI', 'JUNI', 'JULI', 'AGUSTUS', 'SEPTEMBER', 'OKTOBER', 'NOVEMBER', 'DESEMBER'];

const LeaveDashboard: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  return (
    <div className="leave-dashboard">
      <div className="page-header" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h2>CUTI</h2>
          <p>Periode: {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}</p>
        </div>
      </div>

      <MonthFilter currentDate={currentDate} onChange={setCurrentDate} />

      <div className="dashboard-grid" style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem' }}>
        <div className="dashboard-card" style={{ flex: 1, padding: '1.5rem', textAlign: 'center' }}>
          <h3 style={{ fontSize: '2rem', color: 'var(--text-main)', margin: '0' }}>7</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: '0' }}>Pengajuan/Catatan Cuti</p>
        </div>
        <div className="dashboard-card" style={{ flex: 1, padding: '1.5rem', textAlign: 'center' }}>
          <h3 style={{ fontSize: '2rem', color: '#3b82f6', margin: '0' }}>3</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: '0' }}>Sedang Berlangsung</p>
        </div>
        <div className="dashboard-card" style={{ flex: 1, padding: '1.5rem', textAlign: 'center' }}>
          <h3 style={{ fontSize: '2rem', color: '#10b981', margin: '0' }}>4</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: '0' }}>Selesai</p>
        </div>
      </div>

      <div className="dashboard-card">
        <table className="table" style={{ width: '100%', fontSize: '13px' }}>
          <thead>
            <tr style={{ color: 'var(--text-muted)' }}>
              <th style={{ textAlign: 'left', padding: '1rem' }}>No</th>
              <th style={{ textAlign: 'left', padding: '1rem' }}>Nama</th>
              <th style={{ textAlign: 'left', padding: '1rem' }}>NIP</th>
              <th style={{ textAlign: 'left', padding: '1rem' }}>Jenis Cuti</th>
              <th style={{ textAlign: 'left', padding: '1rem' }}>Tanggal Mulai</th>
              <th style={{ textAlign: 'left', padding: '1rem' }}>Tanggal Selesai</th>
              <th style={{ textAlign: 'left', padding: '1rem' }}>Jumlah Hari</th>
              <th style={{ textAlign: 'left', padding: '1rem' }}>Sisa Cuti</th>
              <th style={{ textAlign: 'left', padding: '1rem' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <td style={{ padding: '1rem' }}>1</td>
              <td style={{ padding: '1rem', fontWeight: 'bold' }}>Joko Anwar, M.Si.</td>
              <td style={{ padding: '1rem' }}>197801012002011001</td>
              <td style={{ padding: '1rem' }}>Cuti Tahunan</td>
              <td style={{ padding: '1rem' }}>05/{String(currentDate.getMonth()+1).padStart(2, '0')}/{currentDate.getFullYear()}</td>
              <td style={{ padding: '1rem' }}>08/{String(currentDate.getMonth()+1).padStart(2, '0')}/{currentDate.getFullYear()}</td>
              <td style={{ padding: '1rem' }}>3 Hari</td>
              <td style={{ padding: '1rem' }}>9 Hari</td>
              <td style={{ padding: '1rem' }}><span style={{ padding: '4px 8px', background: 'rgba(59, 130, 246, 0.2)', color: '#3b82f6', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' }}>SEDANG BERLANGSUNG</span></td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <td style={{ padding: '1rem' }}>2</td>
              <td style={{ padding: '1rem', fontWeight: 'bold' }}>Rini Susanti, S.E.</td>
              <td style={{ padding: '1rem' }}>199012122015122002</td>
              <td style={{ padding: '1rem' }}>Cuti Melahirkan</td>
              <td style={{ padding: '1rem' }}>10/{String(currentDate.getMonth()+1).padStart(2, '0')}/{currentDate.getFullYear()}</td>
              <td style={{ padding: '1rem' }}>10/{String((currentDate.getMonth()+4)%12).padStart(2, '0')}/{currentDate.getFullYear()}</td>
              <td style={{ padding: '1rem' }}>90 Hari</td>
              <td style={{ padding: '1rem' }}>-</td>
              <td style={{ padding: '1rem' }}><span style={{ padding: '4px 8px', background: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' }}>NEEDS_REVIEW</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaveDashboard;
