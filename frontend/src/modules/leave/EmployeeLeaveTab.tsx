import React, { useState } from 'react';

interface LeaveBalance {
  annualCurrentYear: number;
  carryForward: number;
  usedDays: number;
  adjustment: number;
  notes: string;
}

const EmployeeLeaveTab: React.FC = () => {
  const [balance, setBalance] = useState<LeaveBalance>({
    annualCurrentYear: 12,
    carryForward: 5,
    usedDays: 3,
    adjustment: 0,
    notes: 'Saldo cuti awal saat aktivasi sistem'
  });

  const [showBalanceModal, setShowBalanceModal] = useState<boolean>(false);
  const [modalForm, setModalForm] = useState<LeaveBalance>(balance);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const totalAvailable = modalForm.annualCurrentYear + modalForm.carryForward + modalForm.adjustment;
  const computedActiveRemaining = (balance.annualCurrentYear + balance.carryForward + balance.adjustment) - balance.usedDays;

  const handleOpenModal = () => {
    setModalForm(balance);
    setShowBalanceModal(true);
  };

  const handleSaveBalance = (e: React.FormEvent) => {
    e.preventDefault();
    setBalance(modalForm);
    setShowBalanceModal(false);
    setSuccessMessage('Saldo cuti awal pegawai berhasil diperbarui!');
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  return (
    <div className="employee-leave-tab" style={{ fontSize: '0.85rem' }}>
      <div className="sp-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.05rem', color: 'var(--text-main)', fontWeight: 600 }}>Hak Saldo & Riwayat Cuti Pegawai</h3>
          <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Informasi jatah cuti tahunan, pengalihan sisa cuti, dan penyesuaian saldo cuti awal per ASN.
          </p>
        </div>
        <div className="sp-actions" style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            className="btn-secondary" 
            onClick={handleOpenModal}
            style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: '4px' }}
            title="Set Hak Cuti Awal Manual Per ASN"
          >
            ⚙️ Set Saldo Cuti Awal
          </button>
          <button className="btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', fontWeight: 500 }}>Riwayat Kalkulasi</button>
          <button className="btn-primary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', fontWeight: 500 }}>+ Pengajuan Cuti</button>
        </div>
      </div>

      {successMessage && (
        <div className="alert alert-success mb-3" style={{
          padding: '0.5rem 0.75rem',
          borderRadius: '6px',
          fontSize: '0.8rem',
          background: '#dcfce7',
          color: '#15803d',
          border: '1px solid #86efac',
          marginBottom: '0.65rem'
        }}>
          ✓ {successMessage}
        </div>
      )}

      <div className="dashboard-grid mb-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.6rem', marginBottom: '0.65rem' }}>
        {/* CUTI TAHUNAN */}
        <div className="card" style={{ padding: '0.65rem 0.85rem', borderLeft: '4px solid #2563eb' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
            <h4 style={{ margin: 0, fontSize: '0.85rem', color: '#1e3a8a', fontWeight: 600 }}>CUTI TAHUNAN (2026)</h4>
            <button 
              onClick={handleOpenModal}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.78rem', color: '#2563eb', textDecoration: 'underline', padding: 0 }}
            >
              [Edit Saldo Awal]
            </button>
          </div>
          <div className="balance-grid mt-2" style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.78rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="text-muted">Hak Tahun Berjalan</span>
              <strong style={{ fontWeight: 500 }}>{balance.annualCurrentYear} Hari</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="text-muted">Pengalihan Sisa Cuti Tahun Lalu</span>
              <strong style={{ fontWeight: 500 }}>{balance.carryForward} Hari</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="text-muted">Penyesuaian Hak Cuti (Adjustment)</span>
              <strong style={{ fontWeight: 500 }}>{balance.adjustment >= 0 ? `+${balance.adjustment}` : balance.adjustment} Hari</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="text-muted">Telah Digunakan</span>
              <strong style={{ fontWeight: 500, color: '#dc2626' }}>{balance.usedDays} Hari</strong>
            </div>
            <hr style={{ margin: '0.25rem 0', borderColor: 'var(--border-color)' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>SISA CUTI AKTIF</span>
              <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#2563eb' }}>{computedActiveRemaining} Hari</span>
            </div>
          </div>
        </div>
        
        {/* CUTI BESAR */}
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

        {/* CUTI SAKIT */}
        <div className="card" style={{ padding: '0.65rem 0.85rem', borderLeft: '4px solid #10b981' }}>
          <h4 style={{ margin: 0, fontSize: '0.85rem', color: '#065f46', fontWeight: 600 }}>CUTI SAKIT & ALASAN PENTING</h4>
          <div className="mt-2" style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Data hak cuti dihitung berdasarkan transaksi pengajuan resmi dengan melampirkan surat keterangan medis / dokumen pendukung.
          </div>
        </div>
      </div>

      {/* Riwayat Pengajuan Cuti */}
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

      {/* Modal Input Saldo Cuti Awal Manual */}
      {showBalanceModal && (
        <div className="modal-backdrop" style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(2px)'
        }}>
          <div className="card compact-modal-card" style={{
            width: '480px', maxWidth: '96vw', padding: '1rem 1.25rem', background: '#ffffff', borderRadius: '10px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.4rem' }}>
              <h3 style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-main)', fontWeight: 600 }}>Set Saldo Cuti Awal Manual (Per ASN)</h3>
              <button onClick={() => setShowBalanceModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}>&times;</button>
            </div>
            <form onSubmit={handleSaveBalance}>
              <p style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '0.75rem', lineHeight: 1.4 }}>
                Atur saldo hak cuti awal untuk pegawai ini saat implementasi aplikasi agar sesuai dengan catatan riwayat fisik ASN.
              </p>

              <div className="form-group" style={{ marginBottom: '0.45rem' }}>
                <label style={{ fontSize: '0.76rem', fontWeight: 600 }}>Hak Cuti Tahunan Berjalan (Hari)</label>
                <input
                  type="number"
                  min="0"
                  max="30"
                  required
                  value={modalForm.annualCurrentYear}
                  onChange={(e) => setModalForm(prev => ({ ...prev, annualCurrentYear: parseInt(e.target.value) || 0 }))}
                  style={{ fontSize: '0.8rem', padding: '0.35rem 0.5rem' }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '0.45rem' }}>
                <label style={{ fontSize: '0.76rem', fontWeight: 600 }}>Pengalihan Sisa Cuti Tahun Lalu (Hari)</label>
                <input
                  type="number"
                  min="0"
                  max="30"
                  value={modalForm.carryForward}
                  onChange={(e) => setModalForm(prev => ({ ...prev, carryForward: parseInt(e.target.value) || 0 }))}
                  style={{ fontSize: '0.8rem', padding: '0.35rem 0.5rem' }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '0.45rem' }}>
                <label style={{ fontSize: '0.76rem', fontWeight: 600 }}>Penyesuaian Hak Cuti (Adjustment)</label>
                <input
                  type="number"
                  value={modalForm.adjustment}
                  onChange={(e) => setModalForm(prev => ({ ...prev, adjustment: parseInt(e.target.value) || 0 }))}
                  placeholder="0 (bisa positif/negatif)"
                  style={{ fontSize: '0.8rem', padding: '0.35rem 0.5rem' }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '0.45rem' }}>
                <label style={{ fontSize: '0.76rem', fontWeight: 600 }}>Telah Digunakan (Hari)</label>
                <input
                  type="number"
                  min="0"
                  value={modalForm.usedDays}
                  onChange={(e) => setModalForm(prev => ({ ...prev, usedDays: parseInt(e.target.value) || 0 }))}
                  style={{ fontSize: '0.8rem', padding: '0.35rem 0.5rem' }}
                />
              </div>

              <div style={{ background: '#f8fafc', padding: '0.5rem 0.65rem', borderRadius: '6px', marginBottom: '0.75rem', border: '1px solid #e2e8f0', fontSize: '0.78rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                  <span>Total Tersedia:</span>
                  <strong>{totalAvailable} Hari</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#1e3a8a', marginTop: '2px', fontWeight: 600 }}>
                  <span>Proyeksi Sisa Cuti Aktif:</span>
                  <strong>{totalAvailable - modalForm.usedDays} Hari</strong>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                <label style={{ fontSize: '0.76rem', fontWeight: 600 }}>Catatan Saldo Awal</label>
                <textarea
                  rows={2}
                  value={modalForm.notes}
                  onChange={(e) => setModalForm(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Catatan dasar penetapan saldo cuti fisik..."
                  style={{ fontSize: '0.8rem', padding: '0.35rem 0.5rem' }}
                ></textarea>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.5rem' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowBalanceModal(false)} style={{ fontSize: '0.78rem', padding: '0.3rem 0.6rem' }}>Batal</button>
                <button type="submit" className="btn-primary" style={{ fontSize: '0.78rem', padding: '0.3rem 0.6rem' }}>Simpan Saldo Awal</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeLeaveTab;
