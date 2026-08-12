import React from 'react';

const EmployeeLeaveTab: React.FC = () => {
  return (
    <div className="employee-leave-tab" style={{ fontSize: '0.85rem' }}>
      <div className="sp-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.05rem', color: 'var(--text-main)', fontWeight: 600 }}>Hak Saldo & Riwayat Cuti Pegawai</h3>
          <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Informasi jatah cuti tahunan, pengalihan sisa cuti, dan riwayat pengajuan cuti pegawai.
          </p>
        </div>
        <div className="sp-actions" style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', fontWeight: 500 }}>Riwayat Kalkulasi</button>
          <button className="btn-primary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', fontWeight: 500 }}>+ Pengajuan Cuti</button>
        </div>
      </div>

      <div className="dashboard-grid mb-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.6rem', marginBottom: '0.65rem' }}>
        <div className="card" style={{ padding: '0.65rem 0.85rem', borderLeft: '4px solid #2563eb' }}>
          <h4 style={{ margin: 0, fontSize: '0.85rem', color: '#1e3a8a', fontWeight: 600 }}>CUTI TAHUNAN (2026)</h4>
          <div className="balance-grid mt-2" style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.78rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="text-muted">Hak Tahun Berjalan</span>
              <strong style={{ fontWeight: 500 }}>12 Hari</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="text-muted">Pengalihan Sisa Cuti Tahun Lalu</span>
              <strong style={{ fontWeight: 500 }}>5 Hari</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="text-muted">Telah Digunakan</span>
              <strong style={{ fontWeight: 500 }}>3 Hari</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="text-muted">Penyesuaian Hak Cuti (Adjustment)</span>
              <strong style={{ fontWeight: 500 }}>0 Hari</strong>
            </div>
            <hr style={{ margin: '0.25rem 0', borderColor: 'var(--border-color)' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>SISA CUTI AKTIF</span>
              <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#2563eb' }}>14 Hari</span>
            </div>
          </div>
        </div>
        
        <div className="card" style={{ padding: '0.65rem 0.85rem', borderLeft: '4px solid #f59e0b' }}>
          <h4 style={{ margin: 0, fontSize: '0.85rem', color: '#92400e', fontWeight: 600 }}>CUTI BESAR (2026)</h4>
          <div className="mt-2" style={{ fontSize: '0.78rem' }}>
            <p className="text-muted" style={{ margin: 0 }}>Status Aturan Hak Cuti:</p>
            <div className="badge warning mt-1" style={{ background: '#fef3c7', color: '#b45309', padding: '3px 6px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 500, display: 'inline-block' }}>
              BELUM MEMENUHI SYARAT MASA KERJA
            </div>
            <p className="text-muted mt-2" style={{ fontSize: '0.75rem', margin: '6px 0 0' }}>Syarat: 5 Tahun. Masa Kerja Resmi: 4 Tahun 2 Bulan.</p>
          </div>
        </div>

        <div className="card" style={{ padding: '0.65rem 0.85rem', borderLeft: '4px solid #10b981' }}>
          <h4 style={{ margin: 0, fontSize: '0.85rem', color: '#065f46', fontWeight: 600 }}>CUTI SAKIT & ALASAN PENTING</h4>
          <div className="mt-2" style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Data hak cuti dihitung berdasarkan transaksi pengajuan resmi dengan melampirkan surat keterangan medis / dokumen pendukung.
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '0.5rem 0.85rem', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-surface-hover)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h4 style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-main)', fontWeight: 600 }}>Riwayat Pengajuan & Transaksi Cuti</h4>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total: 2 Transaksi</span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="table" style={{ width: '100%', fontSize: '0.78rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', textAlign: 'center' }}>
                <th style={{ padding: '0.35rem 0.6rem', textAlign: 'center' }}>NOMOR PENGAJUAN</th>
                <th style={{ padding: '0.35rem 0.6rem', textAlign: 'left' }}>JENIS CUTI</th>
                <th style={{ padding: '0.35rem 0.6rem', textAlign: 'center' }}>PERIODE TANGGAL</th>
                <th style={{ padding: '0.35rem 0.6rem', textAlign: 'center' }}>DURASI</th>
                <th style={{ padding: '0.35rem 0.6rem', textAlign: 'center' }}>STATUS</th>
                <th style={{ padding: '0.35rem 0.6rem', textAlign: 'center' }}>AKSI</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.35rem 0.6rem', textAlign: 'center', fontWeight: 400 }}>CT-2026-001</td>
                <td style={{ padding: '0.35rem 0.6rem', textAlign: 'left', fontWeight: 400 }}>Cuti Tahunan</td>
                <td style={{ padding: '0.35rem 0.6rem', textAlign: 'center', fontWeight: 400 }}>01/02/2026 - 03/02/2026</td>
                <td style={{ padding: '0.35rem 0.6rem', textAlign: 'center', fontWeight: 400 }}>3 Hari</td>
                <td style={{ padding: '0.35rem 0.6rem', textAlign: 'center' }}>
                  <span className="badge success" style={{ background: '#dcfce7', color: '#166534', padding: '2px 6px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 500 }}>
                    SELESAI
                  </span>
                </td>
                <td style={{ padding: '0.35rem 0.6rem', textAlign: 'center' }}>
                  <div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'center' }}>
                    <button className="btn-action-icon edit" title="Edit Pengajuan Cuti" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem' }}>✏️</button>
                    <button className="btn-action-icon delete" title="Batalkan Pengajuan Cuti" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem' }}>🗑️</button>
                  </div>
                </td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.35rem 0.6rem', textAlign: 'center', fontWeight: 400 }}>CT-2026-045</td>
                <td style={{ padding: '0.35rem 0.6rem', textAlign: 'left', fontWeight: 400 }}>Cuti Tahunan</td>
                <td style={{ padding: '0.35rem 0.6rem', textAlign: 'center', fontWeight: 400 }}>12/08/2026 - 14/08/2026</td>
                <td style={{ padding: '0.35rem 0.6rem', textAlign: 'center', fontWeight: 400 }}>3 Hari</td>
                <td style={{ padding: '0.35rem 0.6rem', textAlign: 'center' }}>
                  <span className="badge warning" style={{ background: '#fef3c7', color: '#b45309', padding: '2px 6px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 500 }}>
                    PROSES
                  </span>
                </td>
                <td style={{ padding: '0.35rem 0.6rem', textAlign: 'center' }}>
                  <div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'center' }}>
                    <button className="btn-action-icon edit" title="Edit Pengajuan Cuti" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem' }}>✏️</button>
                    <button className="btn-action-icon delete" title="Batalkan Pengajuan Cuti" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem' }}>🗑️</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EmployeeLeaveTab;
