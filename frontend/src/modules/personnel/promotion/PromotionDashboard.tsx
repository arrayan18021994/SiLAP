import React, { useState } from 'react';
import MonthFilter from '../../../components/MonthFilter';
import '../../leave/Leave.css';

const MONTHS = ['JANUARI', 'FEBRUARI', 'MARET', 'APRIL', 'MEI', 'JUNI', 'JULI', 'AGUSTUS', 'SEPTEMBER', 'OKTOBER', 'NOVEMBER', 'DESEMBER'];

const PromotionDashboard: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  return (
    <div className="leave-dashboard">
      <div className="page-header" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h2>KENAIKAN PANGKAT</h2>
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
              <th style={{ textAlign: 'left', padding: '1rem' }}>Pangkat Saat Ini</th>
              <th style={{ textAlign: 'left', padding: '1rem' }}>TMT Pangkat</th>
              <th style={{ textAlign: 'left', padding: '1rem' }}>Masa Kerja</th>
              <th style={{ textAlign: 'left', padding: '1rem' }}>Status</th>
              <th style={{ textAlign: 'center', padding: '1rem' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <td style={{ padding: '1rem' }}>1</td>
              <td style={{ padding: '1rem', fontWeight: 'bold' }}>Dina Marlina, S.T.</td>
              <td style={{ padding: '1rem' }}>198705052012052005</td>
              <td style={{ padding: '1rem' }}>Penata Muda Tk. I (III/b)</td>
              <td style={{ padding: '1rem' }}>01/{String(currentDate.getMonth()+1).padStart(2, '0')}/{currentDate.getFullYear() - 4}</td>
              <td style={{ padding: '1rem' }}>4 Tahun</td>
              <td style={{ padding: '1rem' }}><span style={{ padding: '4px 8px', background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' }}>READY</span></td>
              <td style={{ padding: '1rem', textAlign: 'center' }}><button className="btn-text">Detail</button></td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <td style={{ padding: '1rem' }}>2</td>
              <td style={{ padding: '1rem', fontWeight: 'bold' }}>Eko Prasetyo, S.Kom.</td>
              <td style={{ padding: '1rem' }}>199106062016061006</td>
              <td style={{ padding: '1rem' }}>Penata Muda (III/a)</td>
              <td style={{ padding: '1rem' }}>01/{String(currentDate.getMonth()+1).padStart(2, '0')}/{currentDate.getFullYear() - 4}</td>
              <td style={{ padding: '1rem' }}>4 Tahun</td>
              <td style={{ padding: '1rem' }}><span style={{ padding: '4px 8px', background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' }}>DOCUMENT_INCOMPLETE</span></td>
              <td style={{ padding: '1rem', textAlign: 'center' }}><button className="btn-text">Detail</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PromotionDashboard;
