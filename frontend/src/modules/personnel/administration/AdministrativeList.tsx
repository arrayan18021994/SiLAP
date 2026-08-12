import React from 'react';

const AdministrativeList: React.FC = () => {
  return (
    <div className="administrative-list-tab" style={{ fontSize: '0.85rem' }}>
      <div className="sp-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.05rem', color: 'var(--text-main)', fontWeight: 600 }}>Rekam Jejak Administrasi Pegawai</h3>
          <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Daftar pengajuan usulan administrasi kepegawaian dan nomor SK resmi.
          </p>
        </div>
        <button className="btn-primary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', fontWeight: 500 }}>+ Usulan Baru</button>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '0.5rem 0.85rem', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-surface-hover)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h4 style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-main)', fontWeight: 600 }}>Daftar Administrasi</h4>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total: 2 Usulan</span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="table" style={{ width: '100%', fontSize: '0.78rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', textAlign: 'center' }}>
                <th style={{ padding: '0.35rem 0.6rem', textAlign: 'center' }}>NOMOR USULAN / SK</th>
                <th style={{ padding: '0.35rem 0.6rem', textAlign: 'center' }}>JENIS LAYANAN</th>
                <th style={{ padding: '0.35rem 0.6rem', textAlign: 'center' }}>TANGGAL</th>
                <th style={{ padding: '0.35rem 0.6rem', textAlign: 'center' }}>STATUS</th>
                <th style={{ padding: '0.35rem 0.6rem', textAlign: 'center' }}>AKSI</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.35rem 0.6rem', textAlign: 'center', fontWeight: 400 }}>800/123/2026</td>
                <td style={{ padding: '0.35rem 0.6rem', textAlign: 'center' }}>
                  <span className="badge warning" style={{ background: '#e0f2fe', color: '#0369a1', padding: '2px 6px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 500 }}>
                    KENAIKAN GAJI BERKALA
                  </span>
                </td>
                <td style={{ padding: '0.35rem 0.6rem', textAlign: 'center', fontWeight: 400 }}>15/02/2026</td>
                <td style={{ padding: '0.35rem 0.6rem', textAlign: 'center' }}>
                  <span className="badge success" style={{ background: '#dcfce7', color: '#166534', padding: '2px 6px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 500 }}>
                    SELESAI
                  </span>
                </td>
                <td style={{ padding: '0.35rem 0.6rem', textAlign: 'center' }}>
                  <div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'center' }}>
                    <button className="btn-action-icon edit" title="Edit Dokumen Administrasi" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem' }}>✏️</button>
                    <button className="btn-action-icon delete" title="Hapus Dokumen Administrasi" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem' }}>🗑️</button>
                  </div>
                </td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.35rem 0.6rem', textAlign: 'center', fontWeight: 400 }}>800/456/2026</td>
                <td style={{ padding: '0.35rem 0.6rem', textAlign: 'center' }}>
                  <span className="badge default" style={{ background: '#f1f5f9', color: '#475569', padding: '2px 6px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 500 }}>
                    MUTASI & PROMOSI
                  </span>
                </td>
                <td style={{ padding: '0.35rem 0.6rem', textAlign: 'center', fontWeight: 400 }}>20/05/2026</td>
                <td style={{ padding: '0.35rem 0.6rem', textAlign: 'center' }}>
                  <span className="badge warning" style={{ background: '#fef3c7', color: '#b45309', padding: '2px 6px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 500 }}>
                    PROSES
                  </span>
                </td>
                <td style={{ padding: '0.35rem 0.6rem', textAlign: 'center' }}>
                  <div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'center' }}>
                    <button className="btn-action-icon edit" title="Edit Dokumen Administrasi" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem' }}>✏️</button>
                    <button className="btn-action-icon delete" title="Hapus Dokumen Administrasi" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem' }}>🗑️</button>
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

export default AdministrativeList;
