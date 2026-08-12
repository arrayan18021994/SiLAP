import React, { useState } from 'react';
import MonthFilter from '../../../components/MonthFilter';
import '../../leave/Leave.css';

const MONTHS = ['JANUARI', 'FEBRUARI', 'MARET', 'APRIL', 'MEI', 'JUNI', 'JULI', 'AGUSTUS', 'SEPTEMBER', 'OKTOBER', 'NOVEMBER', 'DESEMBER'];

interface PeriodicSalaryDashboardProps {
  searchQuery?: string;
}

const PeriodicSalaryDashboard: React.FC<PeriodicSalaryDashboardProps> = ({ searchQuery = '' }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const salaryRecords = [
    { id: 1, nama: 'Dr. H. Ahmad Supriyadi, M.Si.', nip: '197203151996031001', rank: 'Pembina Utama Muda (IV/d)', kgbTerakhir: '01/04/2022', tmtBerikutnya: `01/${String(currentDate.getMonth()+1).padStart(2, '0')}/${currentDate.getFullYear()}`, status: 'READY' },
    { id: 2, nama: 'Drs. M. Ridwan Kusuma, M.Si.', nip: '197805102001032002', rank: 'Pembina Tingkat I (IV/b)', kgbTerakhir: '01/04/2023', tmtBerikutnya: `01/${String(currentDate.getMonth()+1).padStart(2, '0')}/${currentDate.getFullYear()}`, status: 'NEEDS_REVIEW' },
    { id: 3, nama: 'Dra. Ratna Sarumpaet, M.Pd.', nip: '198207192006042005', rank: 'Pembina (IV/a)', kgbTerakhir: '15/04/2023', tmtBerikutnya: `15/${String(currentDate.getMonth()+1).padStart(2, '0')}/${currentDate.getFullYear()}`, status: 'PROPOSAL_CREATED' }
  ];

  const searchLower = searchQuery.trim().toLowerCase();
  const filtered = salaryRecords.filter(r =>
    !searchLower || r.nama.toLowerCase().includes(searchLower) || r.nip.toLowerCase().includes(searchLower)
  );

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
              <th style={{ textAlign: 'left', padding: '0.75rem 1rem' }}>NO</th>
              <th style={{ textAlign: 'left', padding: '0.75rem 1rem' }}>NAMA PEGAWAI</th>
              <th style={{ textAlign: 'left', padding: '0.75rem 1rem' }}>NIP</th>
              <th style={{ textAlign: 'left', padding: '0.75rem 1rem' }}>PANGKAT / GOLONGAN</th>
              <th style={{ textAlign: 'left', padding: '0.75rem 1rem' }}>KGB TERAKHIR</th>
              <th style={{ textAlign: 'left', padding: '0.75rem 1rem' }}>TMT KGB BERIKUTNYA</th>
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
                <td style={{ padding: '0.75rem 1rem' }}>{item.kgbTerakhir}</td>
                <td style={{ padding: '0.75rem 1rem' }}>{item.tmtBerikutnya}</td>
                <td style={{ padding: '0.75rem 1rem' }}>
                  <span style={{ padding: '4px 8px', background: item.status === 'READY' ? 'rgba(16, 185, 129, 0.2)' : item.status === 'NEEDS_REVIEW' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(59, 130, 246, 0.2)', color: item.status === 'READY' ? '#10b981' : item.status === 'NEEDS_REVIEW' ? '#f59e0b' : '#3b82f6', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>
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
                  Tidak ada data gaji berkala yang sesuai pencarian.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PeriodicSalaryDashboard;
