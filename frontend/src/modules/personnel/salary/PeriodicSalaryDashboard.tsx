import React, { useState } from 'react';
import MonthFilter from '../../../components/MonthFilter';
import '../../leave/Leave.css';

const MONTHS = ['JANUARI', 'FEBRUARI', 'MARET', 'APRIL', 'MEI', 'JUNI', 'JULI', 'AGUSTUS', 'SEPTEMBER', 'OKTOBER', 'NOVEMBER', 'DESEMBER'];

const PeriodicSalaryDashboard: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  return (
    <div className="leave-dashboard">
      <div className="page-header" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h2>GAJI BERKALA</h2>
          <p>Periode: {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}</p>
        </div>
      </div>

      <MonthFilter currentDate={currentDate} onChange={setCurrentDate} />

      <div className="dashboard-card" style={{ marginTop: '1.5rem' }}>
        <table className="table" style={{ width: '100%', fontSize: '13px' }}>
          <thead>
            <tr style={{ color: 'var(--text-muted)' }}>
              <th style={{ textAlign: 'left', padding: '1rem' }}>No</th>
              <th style={{ textAlign: 'left', padding: '1rem' }}>Nama</th>
              <th style={{ textAlign: 'left', padding: '1rem' }}>NIP</th>
              <th style={{ textAlign: 'left', padding: '1rem' }}>Pangkat/Golongan</th>
              <th style={{ textAlign: 'left', padding: '1rem' }}>KGB Terakhir</th>
              <th style={{ textAlign: 'left', padding: '1rem' }}>TMT KGB Berikutnya</th>
              <th style={{ textAlign: 'left', padding: '1rem' }}>Status</th>
              <th style={{ textAlign: 'center', padding: '1rem' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <td style={{ padding: '1rem' }}>1</td>
              <td style={{ padding: '1rem', fontWeight: 'bold' }}>Ahmad Budi, S.E.</td>
              <td style={{ padding: '1rem' }}>198501012010011001</td>
              <td style={{ padding: '1rem' }}>Penata (III/c)</td>
              <td style={{ padding: '1rem' }}>01/08/2024</td>
              <td style={{ padding: '1rem', fontWeight: 'bold' }}>01/{String(currentDate.getMonth()+1).padStart(2, '0')}/{currentDate.getFullYear()}</td>
              <td style={{ padding: '1rem' }}><span style={{ padding: '4px 8px', background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' }}>READY</span></td>
              <td style={{ padding: '1rem', textAlign: 'center' }}><button className="btn-text">Detail</button></td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <td style={{ padding: '1rem' }}>2</td>
              <td style={{ padding: '1rem', fontWeight: 'bold' }}>Budi Santoso, S.Sos.</td>
              <td style={{ padding: '1rem' }}>197902022005022002</td>
              <td style={{ padding: '1rem' }}>Pembina (IV/a)</td>
              <td style={{ padding: '1rem' }}>01/08/2024</td>
              <td style={{ padding: '1rem', fontWeight: 'bold' }}>01/{String(currentDate.getMonth()+1).padStart(2, '0')}/{currentDate.getFullYear()}</td>
              <td style={{ padding: '1rem' }}><span style={{ padding: '4px 8px', background: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' }}>NEEDS_REVIEW</span></td>
              <td style={{ padding: '1rem', textAlign: 'center' }}><button className="btn-text">Detail</button></td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <td style={{ padding: '1rem' }}>3</td>
              <td style={{ padding: '1rem', fontWeight: 'bold' }}>Citra Lestari, S.E.</td>
              <td style={{ padding: '1rem' }}>199203032015032003</td>
              <td style={{ padding: '1rem' }}>Penata Muda (III/a)</td>
              <td style={{ padding: '1rem' }}>15/08/2024</td>
              <td style={{ padding: '1rem', fontWeight: 'bold' }}>15/{String(currentDate.getMonth()+1).padStart(2, '0')}/{currentDate.getFullYear()}</td>
              <td style={{ padding: '1rem' }}><span style={{ padding: '4px 8px', background: 'rgba(59, 130, 246, 0.2)', color: '#3b82f6', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' }}>PROPOSAL_CREATED</span></td>
              <td style={{ padding: '1rem', textAlign: 'center' }}><button className="btn-text">Detail</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PeriodicSalaryDashboard;
