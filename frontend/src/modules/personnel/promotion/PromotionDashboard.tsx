import React, { useState } from 'react';
import MonthFilter from '../../../components/MonthFilter';
import '../../leave/Leave.css';

const MONTHS = ['JANUARI', 'FEBRUARI', 'MARET', 'APRIL', 'MEI', 'JUNI', 'JULI', 'AGUSTUS', 'SEPTEMBER', 'OKTOBER', 'NOVEMBER', 'DESEMBER'];

interface PromotionDashboardProps {
  searchQuery?: string;
}

const PromotionDashboard: React.FC<PromotionDashboardProps> = ({ searchQuery = '' }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const promotionRecords = [
    { id: 1, nama: 'Drs. M. Ridwan Kusuma, M.Si.', nip: '197805102001032002', rank: 'Pembina Tingkat I (IV/b)', tmtPangkat: `01/${String(currentDate.getMonth()+1).padStart(2, '0')}/${currentDate.getFullYear() - 4}`, masaKerja: '4 Tahun', status: 'READY' },
    { id: 2, nama: 'Ir. Bambang Suryadi, S.T., M.T.', nip: '198509122009021004', rank: 'Penata Tingkat I (III/d)', tmtPangkat: `01/${String(currentDate.getMonth()+1).padStart(2, '0')}/${currentDate.getFullYear() - 4}`, masaKerja: '4 Tahun', status: 'DOCUMENT_INCOMPLETE' }
  ];

  const searchLower = searchQuery.trim().toLowerCase();
  const filtered = promotionRecords.filter(r =>
    !searchLower || r.nama.toLowerCase().includes(searchLower) || r.nip.toLowerCase().includes(searchLower)
  );

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
              <th style={{ textAlign: 'left', padding: '0.75rem 1rem' }}>NO</th>
              <th style={{ textAlign: 'left', padding: '0.75rem 1rem' }}>NAMA PEGAWAI</th>
              <th style={{ textAlign: 'left', padding: '0.75rem 1rem' }}>NIP</th>
              <th style={{ textAlign: 'left', padding: '0.75rem 1rem' }}>PANGKAT SAAT INI</th>
              <th style={{ textAlign: 'left', padding: '0.75rem 1rem' }}>TMT PANGKAT</th>
              <th style={{ textAlign: 'left', padding: '0.75rem 1rem' }}>MASA KERJA</th>
              <th style={{ textAlign: 'left', padding: '0.75rem 1rem' }}>STATUS</th>
              <th style={{ textAlign: 'center', padding: '0.75rem 1rem' }}>AKSI</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item, index) => (
              <tr key={item.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.75rem 1rem' }}>{index + 1}</td>
                <td style={{ padding: '0.75rem 1rem', fontWeight: 400 }}>{item.nama}</td>
                <td style={{ padding: '0.75rem 1rem', fontWeight: 400 }}>{item.nip}</td>
                <td style={{ padding: '0.75rem 1rem' }}>{item.rank}</td>
                <td style={{ padding: '0.75rem 1rem' }}>{item.tmtPangkat}</td>
                <td style={{ padding: '0.75rem 1rem' }}>{item.masaKerja}</td>
                <td style={{ padding: '0.75rem 1rem' }}>
                  <span style={{ padding: '4px 8px', background: item.status === 'READY' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)', color: item.status === 'READY' ? '#10b981' : '#ef4444', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>
                    {item.status}
                  </span>
                </td>
                <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>
                  <button className="btn-text" style={{ fontWeight: 500 }}>Detail</button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)' }}>
                  Tidak ada data kenaikan pangkat yang sesuai pencarian.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PromotionDashboard;
