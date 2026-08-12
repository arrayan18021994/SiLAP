import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MonthFilter from '../../../components/MonthFilter';
import '../../leave/Leave.css';

const MONTHS = ['JANUARI', 'FEBRUARI', 'MARET', 'APRIL', 'MEI', 'JUNI', 'JULI', 'AGUSTUS', 'SEPTEMBER', 'OKTOBER', 'NOVEMBER', 'DESEMBER'];

const FamilyAllowanceDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());

  const allowanceRecords = [
    {
      id: 1,
      empId: '1',
      nama: 'Ahmad Budi, S.E.',
      nip: '198501012010011001',
      perubahan: 'Anak (Rizky Ramadhan) Berusia 21 Thn',
      jenis: 'Perlu Surat Aktif Kuliah',
      tanggal: `10/${String(currentDate.getMonth()+1).padStart(2, '0')}/${currentDate.getFullYear()}`,
      status: 'PERLU_SURAT_KULIAH',
      statusLabel: 'PERLU SURAT KULIAH'
    },
    {
      id: 2,
      empId: '2',
      nama: 'Fahri Hamzah, S.H.',
      nip: '198007072008071007',
      perubahan: 'Kelahiran Anak Ke-2',
      jenis: 'Penambahan Tunjangan',
      tanggal: `15/${String(currentDate.getMonth()+1).padStart(2, '0')}/${currentDate.getFullYear()}`,
      status: 'NEEDS_REVIEW',
      statusLabel: 'PERLU REVIEW'
    },
    {
      id: 3,
      empId: '3',
      nama: 'Gita Wirjawan, M.M.',
      nip: '197508082001081008',
      perubahan: 'Anak Ke-1 Berusia 21 Thn (Surat Aktif Kuliah Disetujui)',
      jenis: 'Perpanjangan Tunjangan Anak',
      tanggal: `22/${String(currentDate.getMonth()+1).padStart(2, '0')}/${currentDate.getFullYear()}`,
      status: 'AKTIF_KULIAH',
      statusLabel: 'AKTIF (KULIAH)'
    }
  ];

  return (
    <div className="leave-dashboard">
      <div className="page-header" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h2>TUNJANGAN KELUARGA</h2>
          <p>Periode: {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}</p>
        </div>
      </div>

      <MonthFilter currentDate={currentDate} onChange={setCurrentDate} />

      <div style={{
        background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
        border: '1px solid #93c5fd',
        borderRadius: '10px',
        padding: '1.25rem',
        marginTop: '1.5rem',
        marginBottom: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '1.5rem' }}>ℹ️</span>
          <div>
            <strong style={{ color: '#1e40af', fontSize: '0.95rem' }}>Ketentuan Pengingat Anak Usia 21 Tahun:</strong>
            <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#1e3a8a' }}>
              Anak pegawai yang telah mencapai usia 21 tahun secara otomatis dinonaktifkan dari tunjangan keluarga oleh sistem. Untuk mengaktifkan kembali, klik <strong>"Upload Surat Kuliah"</strong> pada data pegawai terkait untuk mengunggah <strong>Surat Keterangan Aktif Kuliah</strong>.
            </p>
          </div>
        </div>
      </div>

      <div className="dashboard-card" style={{ marginTop: '1rem' }}>
        <table className="table" style={{ width: '100%', fontSize: '13px' }}>
          <thead>
            <tr style={{ color: 'var(--text-muted)' }}>
              <th style={{ textAlign: 'left', padding: '1rem' }}>No</th>
              <th style={{ textAlign: 'left', padding: '1rem' }}>Nama Pegawai</th>
              <th style={{ textAlign: 'left', padding: '1rem' }}>NIP</th>
              <th style={{ textAlign: 'left', padding: '1rem' }}>Perubahan Keluarga</th>
              <th style={{ textAlign: 'left', padding: '1rem' }}>Jenis Perubahan</th>
              <th style={{ textAlign: 'left', padding: '1rem' }}>Tanggal Perubahan</th>
              <th style={{ textAlign: 'left', padding: '1rem' }}>Status</th>
              <th style={{ textAlign: 'center', padding: '1rem' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {allowanceRecords.map((item, index) => (
              <tr key={item.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '1rem' }}>{index + 1}</td>
                <td style={{ padding: '1rem', fontWeight: 'bold' }}>{item.nama}</td>
                <td style={{ padding: '1rem' }}>{item.nip}</td>
                <td style={{ padding: '1rem' }}>{item.perubahan}</td>
                <td style={{ padding: '1rem' }}>{item.jenis}</td>
                <td style={{ padding: '1rem' }}>{item.tanggal}</td>
                <td style={{ padding: '1rem' }}>
                  {item.status === 'PERLU_SURAT_KULIAH' ? (
                    <span style={{ padding: '4px 8px', background: '#fee2e2', color: '#b91c1c', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' }}>
                      ⚠️ PERLU SURAT KULIAH
                    </span>
                  ) : item.status === 'AKTIF_KULIAH' ? (
                    <span style={{ padding: '4px 8px', background: '#dcfce7', color: '#15803d', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' }}>
                      ✓ AKTIF (KULIAH)
                    </span>
                  ) : (
                    <span style={{ padding: '4px 8px', background: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' }}>
                      NEEDS_REVIEW
                    </span>
                  )}
                </td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>
                  <button
                    className="btn-primary"
                    onClick={() => navigate(`/dashboard/employees/${item.empId}`)}
                    style={{ padding: '4px 10px', fontSize: '11px', fontWeight: 600 }}
                  >
                    {item.status === 'PERLU_SURAT_KULIAH' ? 'Upload Surat Kuliah' : 'Detail Pegawai'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FamilyAllowanceDashboard;
