import React, { useState } from 'react';
import MonthFilter from '../../../components/MonthFilter';
import '../../leave/Leave.css';

const MONTHS = ['JANUARI', 'FEBRUARI', 'MARET', 'APRIL', 'MEI', 'JUNI', 'JULI', 'AGUSTUS', 'SEPTEMBER', 'OKTOBER', 'NOVEMBER', 'DESEMBER'];

const FamilyAllowanceDashboard: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  return (
    <div className="leave-dashboard">
      <div className="page-header" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h2>TUNJANGAN KELUARGA</h2>
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
              <th style={{ textAlign: 'left', padding: '1rem' }}>Perubahan Keluarga</th>
              <th style={{ textAlign: 'left', padding: '1rem' }}>Jenis Perubahan</th>
              <th style={{ textAlign: 'left', padding: '1rem' }}>Tanggal Perubahan</th>
              <th style={{ textAlign: 'left', padding: '1rem' }}>Status</th>
              <th style={{ textAlign: 'center', padding: '1rem' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <td style={{ padding: '1rem' }}>1</td>
              <td style={{ padding: '1rem', fontWeight: 'bold' }}>Fahri Hamzah, S.H.</td>
              <td style={{ padding: '1rem' }}>198007072008071007</td>
              <td style={{ padding: '1rem' }}>Kelahiran Anak Ke-2</td>
              <td style={{ padding: '1rem' }}>Penambahan Tunjangan</td>
              <td style={{ padding: '1rem' }}>10/{String(currentDate.getMonth()+1).padStart(2, '0')}/{currentDate.getFullYear()}</td>
              <td style={{ padding: '1rem' }}><span style={{ padding: '4px 8px', background: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' }}>NEEDS_REVIEW</span></td>
              <td style={{ padding: '1rem', textAlign: 'center' }}><button className="btn-text">Detail</button></td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <td style={{ padding: '1rem' }}>2</td>
              <td style={{ padding: '1rem', fontWeight: 'bold' }}>Gita Wirjawan, M.M.</td>
              <td style={{ padding: '1rem' }}>197508082001081008</td>
              <td style={{ padding: '1rem' }}>Anak Ke-1 Berusia 21 Thn</td>
              <td style={{ padding: '1rem' }}>Penghentian Tunjangan</td>
              <td style={{ padding: '1rem' }}>25/{String(currentDate.getMonth()+1).padStart(2, '0')}/{currentDate.getFullYear()}</td>
              <td style={{ padding: '1rem' }}><span style={{ padding: '4px 8px', background: 'rgba(107, 114, 128, 0.2)', color: 'var(--text-muted)', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' }}>NOT_ELIGIBLE</span></td>
              <td style={{ padding: '1rem', textAlign: 'center' }}><button className="btn-text">Detail</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FamilyAllowanceDashboard;
