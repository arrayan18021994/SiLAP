import React from 'react';

const EmployeeKGBTab: React.FC = () => {
  return (
    <div className="employee-kgb-tab" style={{ fontSize: '0.85rem' }}>
      <div className="sp-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.05rem', color: 'var(--text-main)', fontWeight: 600 }}>Kenaikan Gaji Berkala</h3>
          <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Informasi hak penetapan kenaikan gaji berkala resmi dan proyeksi periode berikutnya.
          </p>
        </div>
        <div className="sp-actions" style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', fontWeight: 500 }}>Koreksi Data</button>
          <button className="btn-primary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', fontWeight: 500 }}>+ Input Kenaikan Gaji Berkala Baru</button>
        </div>
      </div>

      <div className="dashboard-grid mb-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.6rem', marginBottom: '0.65rem' }}>
        {/* KENAIKAN GAJI BERKALA TERAKHIR */}
        <div className="card" style={{ padding: '0.65rem 0.85rem', borderLeft: '4px solid var(--text-main)' }}>
          <h4 style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: 600 }}>KENAIKAN GAJI BERKALA TERAKHIR (RESMI)</h4>
          <div className="mt-2" style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.78rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="text-muted">TMT Kenaikan Gaji Berkala</span>
              <strong style={{ fontWeight: 500 }}>01/04/2025</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="text-muted">Golongan</span>
              <strong style={{ fontWeight: 500 }}>III/c</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="text-muted">Masa Kerja Golongan</span>
              <strong style={{ fontWeight: 500 }}>08 Tahun 00 Bulan</strong>
            </div>
            <hr style={{ margin: '0.25rem 0', borderColor: 'var(--border-color)' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>GAJI POKOK RESMI</span>
              <strong style={{ fontSize: '1.1rem', color: '#2563eb', fontWeight: 700 }}>Rp 3.500.000</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2px' }}>
              <span className="text-muted" style={{ fontSize: '0.75rem' }}>Dasar SK</span>
              <span style={{ fontSize: '0.75rem', fontWeight: 400 }}>822.3/123/BKPSDM/2025</span>
            </div>
          </div>
        </div>
        
        {/* KENAIKAN GAJI BERKALA BERIKUTNYA */}
        <div className="card" style={{ padding: '0.65rem 0.85rem', borderLeft: '4px solid #0ea5e9' }}>
          <h4 style={{ margin: 0, fontSize: '0.85rem', color: '#0369a1', fontWeight: 600 }}>KENAIKAN GAJI BERKALA BERIKUTNYA (PROYEKSI)</h4>
          <div className="mt-2" style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.78rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="text-muted">Perkiraan TMT</span>
              <strong style={{ fontWeight: 500 }}>01/04/2027</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="text-muted">Proyeksi Golongan</span>
              <strong style={{ fontWeight: 500 }}>III/c</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="text-muted">Proyeksi Masa Kerja</span>
              <strong style={{ fontWeight: 500 }}>10 Tahun 00 Bulan</strong>
            </div>
            <hr style={{ margin: '0.25rem 0', borderColor: 'var(--border-color)' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>PROYEKSI GAJI</span>
              <strong style={{ fontSize: '1.1rem', color: '#10b981', fontWeight: 700 }}>Rp 3.750.000</strong>
            </div>
            <div style={{ marginTop: '4px' }}>
              <span className="badge warning" style={{ background: '#fef3c7', color: '#b45309', padding: '2px 6px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 500 }}>
                STATUS: PROSES VERIFIKASI
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '0.5rem 0.85rem', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-surface-hover)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h4 style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-main)', fontWeight: 600 }}>Riwayat Kenaikan Gaji Berkala & Perubahan Gaji</h4>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total: 3 Riwayat</span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="table" style={{ width: '100%', fontSize: '0.78rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', textAlign: 'center' }}>
                <th style={{ padding: '0.35rem 0.6rem', textAlign: 'center' }}>TMT</th>
                <th style={{ padding: '0.35rem 0.6rem', textAlign: 'center' }}>GOLONGAN</th>
                <th style={{ padding: '0.35rem 0.6rem', textAlign: 'center' }}>MASA KERJA</th>
                <th style={{ padding: '0.35rem 0.6rem', textAlign: 'center' }}>GAJI POKOK</th>
                <th style={{ padding: '0.35rem 0.6rem', textAlign: 'center' }}>NOMOR SK</th>
                <th style={{ padding: '0.35rem 0.6rem', textAlign: 'center' }}>STATUS</th>
                <th style={{ padding: '0.35rem 0.6rem', textAlign: 'center' }}>AKSI</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.35rem 0.6rem', textAlign: 'center', fontWeight: 400 }}>01/04/2027</td>
                <td style={{ padding: '0.35rem 0.6rem', textAlign: 'center', fontWeight: 400 }}>III/c</td>
                <td style={{ padding: '0.35rem 0.6rem', textAlign: 'center', fontWeight: 400 }}>10 Thn 00 Bln</td>
                <td style={{ padding: '0.35rem 0.6rem', textAlign: 'center', fontWeight: 400 }}>Rp 3.750.000</td>
                <td style={{ padding: '0.35rem 0.6rem', textAlign: 'center', fontWeight: 400 }}>- (Proyeksi)</td>
                <td style={{ padding: '0.35rem 0.6rem', textAlign: 'center' }}>
                  <span className="badge warning" style={{ background: '#fef3c7', color: '#b45309', padding: '2px 6px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 500 }}>
                    PROSES
                  </span>
                </td>
                <td style={{ padding: '0.35rem 0.6rem', textAlign: 'center' }}>
                  <div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'center' }}>
                    <button className="btn-action-icon edit" title="Edit Kenaikan Gaji Berkala" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem' }}>✏️</button>
                    <button className="btn-action-icon delete" title="Hapus Kenaikan Gaji Berkala" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem' }}>🗑️</button>
                  </div>
                </td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.35rem 0.6rem', textAlign: 'center', fontWeight: 400 }}>01/04/2025</td>
                <td style={{ padding: '0.35rem 0.6rem', textAlign: 'center', fontWeight: 400 }}>III/c</td>
                <td style={{ padding: '0.35rem 0.6rem', textAlign: 'center', fontWeight: 400 }}>08 Thn 00 Bln</td>
                <td style={{ padding: '0.35rem 0.6rem', textAlign: 'center', fontWeight: 400 }}>Rp 3.500.000</td>
                <td style={{ padding: '0.35rem 0.6rem', textAlign: 'center', fontWeight: 400 }}>822.3/123/BKPSDM/2025</td>
                <td style={{ padding: '0.35rem 0.6rem', textAlign: 'center' }}>
                  <span className="badge success" style={{ background: '#dcfce7', color: '#166534', padding: '2px 6px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 500 }}>
                    SELESAI
                  </span>
                </td>
                <td style={{ padding: '0.35rem 0.6rem', textAlign: 'center' }}>
                  <div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'center' }}>
                    <button className="btn-action-icon edit" title="Edit Kenaikan Gaji Berkala" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem' }}>✏️</button>
                    <button className="btn-action-icon delete" title="Hapus Kenaikan Gaji Berkala" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem' }}>🗑️</button>
                  </div>
                </td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.35rem 0.6rem', textAlign: 'center', fontWeight: 400 }}>01/04/2023</td>
                <td style={{ padding: '0.35rem 0.6rem', textAlign: 'center', fontWeight: 400 }}>III/c</td>
                <td style={{ padding: '0.35rem 0.6rem', textAlign: 'center', fontWeight: 400 }}>06 Thn 00 Bln</td>
                <td style={{ padding: '0.35rem 0.6rem', textAlign: 'center', fontWeight: 400 }}>Rp 3.250.000</td>
                <td style={{ padding: '0.35rem 0.6rem', textAlign: 'center', fontWeight: 400 }}>822.3/045/BKPSDM/2023</td>
                <td style={{ padding: '0.35rem 0.6rem', textAlign: 'center' }}>
                  <span className="badge success" style={{ background: '#dcfce7', color: '#166534', padding: '2px 6px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 500 }}>
                    SELESAI
                  </span>
                </td>
                <td style={{ padding: '0.35rem 0.6rem', textAlign: 'center' }}>
                  <div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'center' }}>
                    <button className="btn-action-icon edit" title="Edit Kenaikan Gaji Berkala" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem' }}>✏️</button>
                    <button className="btn-action-icon delete" title="Hapus Kenaikan Gaji Berkala" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem' }}>🗑️</button>
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

export default EmployeeKGBTab;
