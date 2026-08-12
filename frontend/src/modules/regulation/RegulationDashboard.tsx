import React, { useState } from 'react';
import '../leave/Leave.css'; // Reusing dashboard CSS styles

const RegulationDashboard: React.FC = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [regType, setRegType] = useState('GAJI BERKALA');

  const handleAddRegulation = () => {
    setShowAddModal(true);
  };

  const closeModal = () => {
    setShowAddModal(false);
  };

  return (
    <div className="dashboard-content">
      <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>REGULASI</h2>
          <p>Pusat Regulasi & Calculation Engine Parameter</p>
        </div>
      </div>

      {/* Search Bar & Action */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-surface)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
          <span style={{ color: 'var(--text-muted)' }}>🔍</span>
          <input type="text" placeholder="Cari regulasi..." style={{ background: 'transparent', border: 'none', color: 'var(--text-main)', width: '100%', outline: 'none' }} />
        </div>
        <button className="btn-primary" onClick={handleAddRegulation}>+ Tambah Regulasi</button>
      </div>

      {/* Active Regulations Grid */}
      <div className="dashboard-grid">
        <div className="stat-card" style={{ flexDirection: 'column', alignItems: 'flex-start', padding: '1.5rem', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '1.2rem' }}>📈</span>
            <h3 style={{ fontSize: '13px', color: 'var(--text-main)', fontWeight: 'bold' }}>KEPANGKATAN</h3>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Regulasi aktif: <strong style={{ color: 'var(--primary-color)' }}>PP No. 12 Tahun 2002</strong></p>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Berlaku mulai: <strong>01 Jan 2025</strong></p>
        </div>

        <div className="stat-card" style={{ flexDirection: 'column', alignItems: 'flex-start', padding: '1.5rem', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '1.2rem' }}>💰</span>
            <h3 style={{ fontSize: '13px', color: 'var(--text-main)', fontWeight: 'bold' }}>GAJI BERKALA</h3>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Regulasi aktif: <strong style={{ color: 'var(--primary-color)' }}>PP No. 5 Tahun 2024</strong></p>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Berlaku mulai: <strong>01 Jan 2024</strong></p>
        </div>

        <div className="stat-card" style={{ flexDirection: 'column', alignItems: 'flex-start', padding: '1.5rem', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '1.2rem' }}>👪</span>
            <h3 style={{ fontSize: '13px', color: 'var(--text-main)', fontWeight: 'bold' }}>TUNJANGAN KELUARGA</h3>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Regulasi aktif: <strong style={{ color: 'var(--primary-color)' }}>Perpres No. 10 2023</strong></p>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Berlaku mulai: <strong>01 Jun 2023</strong></p>
        </div>

        <div className="stat-card" style={{ flexDirection: 'column', alignItems: 'flex-start', padding: '1.5rem', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '1.2rem' }}>📅</span>
            <h3 style={{ fontSize: '13px', color: 'var(--text-main)', fontWeight: 'bold' }}>CUTI</h3>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Regulasi aktif: <strong style={{ color: 'var(--primary-color)' }}>Perbup No. 22 2024</strong></p>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Berlaku mulai: <strong>01 Jan 2024</strong></p>
        </div>
      </div>

      {/* Regulation List Table */}
      <div className="dashboard-header mt-4" style={{ marginTop: '3rem' }}>
        <h3 style={{ fontSize: '14px', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', color: 'var(--text-main)' }}>DAFTAR REGULASI HISTORIS & DRAFT</h3>
      </div>
      
      <div style={{ overflowX: 'auto', background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left', color: 'var(--text-muted)' }}>
              <th style={{ padding: '1rem' }}>Jenis</th>
              <th style={{ padding: '1rem' }}>Nomor / Tentang</th>
              <th style={{ padding: '1rem' }}>Versi</th>
              <th style={{ padding: '1rem' }}>Berlaku Mulai</th>
              <th style={{ padding: '1rem' }}>Status</th>
              <th style={{ padding: '1rem' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <td style={{ padding: '1rem', color: 'var(--text-main)' }}>GAJI BERKALA</td>
              <td style={{ padding: '1rem', color: 'var(--text-main)' }}>
                <div><strong>PP No. 5 Tahun 2024</strong></div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Perubahan Tabel Gaji Pokok PNS</div>
              </td>
              <td style={{ padding: '1rem', color: 'var(--text-main)' }}>v2</td>
              <td style={{ padding: '1rem', color: 'var(--text-main)' }}>01 Jan 2024</td>
              <td style={{ padding: '1rem' }}><span style={{ padding: '4px 8px', background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' }}>AKTIF</span></td>
              <td style={{ padding: '1rem' }}><button className="btn-text" style={{ fontSize: '12px' }}>Lihat</button></td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <td style={{ padding: '1rem', color: 'var(--text-main)' }}>GAJI BERKALA</td>
              <td style={{ padding: '1rem', color: 'var(--text-main)' }}>
                <div><strong>PP No. 15 Tahun 2019</strong></div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Perubahan Kedelapan Belas Atas PP No 7/1977</div>
              </td>
              <td style={{ padding: '1rem', color: 'var(--text-main)' }}>v1</td>
              <td style={{ padding: '1rem', color: 'var(--text-main)' }}>01 Jan 2019</td>
              <td style={{ padding: '1rem' }}><span style={{ padding: '4px 8px', background: 'rgba(107, 114, 128, 0.2)', color: 'var(--text-muted)', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' }}>HISTORIS</span></td>
              <td style={{ padding: '1rem' }}><button className="btn-text" style={{ fontSize: '12px' }}>Lihat</button></td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <td style={{ padding: '1rem', color: 'var(--text-main)' }}>CUTI</td>
              <td style={{ padding: '1rem', color: 'var(--text-main)' }}>
                <div><strong>Perbup No. 22 2025 Draft</strong></div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Perubahan Cuti Tahunan dan Melahirkan</div>
              </td>
              <td style={{ padding: '1rem', color: 'var(--text-main)' }}>v3</td>
              <td style={{ padding: '1rem', color: 'var(--text-main)' }}>01 Jan 2025</td>
              <td style={{ padding: '1rem' }}><span style={{ padding: '4px 8px', background: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' }}>DRAFT</span></td>
              <td style={{ padding: '1rem' }}><button className="btn-text" style={{ fontSize: '12px' }}>Edit</button></td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Add Regulation Modal */}
      {showAddModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: 'var(--bg-app)', padding: '2rem', borderRadius: '8px', width: '600px', maxWidth: '90%', border: '1px solid var(--border-color)', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-main)', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>Tambah Regulasi Baru</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Jenis Regulasi</label>
                <select 
                  style={{ padding: '0.5rem', background: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: 'var(--text-main)', borderRadius: '4px' }}
                  value={regType}
                  onChange={(e) => setRegType(e.target.value)}
                >
                  <option value="KEPANGKATAN">KEPANGKATAN</option>
                  <option value="GAJI BERKALA">GAJI BERKALA</option>
                  <option value="TUNJANGAN KELUARGA">TUNJANGAN KELUARGA</option>
                  <option value="CUTI">CUTI</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Nomor</label>
                  <input type="text" placeholder="Contoh: PP No. 5 Tahun 2024" style={{ padding: '0.5rem', background: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: 'var(--text-main)', borderRadius: '4px' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Tanggal Berlaku</label>
                  <input type="date" style={{ padding: '0.5rem', background: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: 'var(--text-main)', borderRadius: '4px' }} />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Tentang</label>
                <textarea rows={2} placeholder="Penjelasan regulasi..." style={{ padding: '0.5rem', background: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: 'var(--text-main)', borderRadius: '4px' }}></textarea>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Dokumen Referensi (PDF)</label>
                <div style={{ padding: '1rem', border: '1px dashed var(--border-color)', borderRadius: '4px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px', background: 'var(--bg-surface)' }}>
                  📄 Klik atau seret file PDF ke sini
                </div>
              </div>

              {/* Dynamic Parameters based on Reg Type */}
              <div style={{ background: 'var(--bg-surface)', padding: '1rem', borderRadius: '4px', border: '1px solid var(--border-color)', marginTop: '0.5rem' }}>
                <h4 style={{ fontSize: '13px', color: 'var(--text-main)', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                  Parameter ({regType})
                </h4>
                
                {regType === 'GAJI BERKALA' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Interval KGB (Tahun)</span>
                      <input type="number" defaultValue="2" style={{ width: '80px', padding: '0.5rem', background: 'var(--bg-app)', border: '1px solid var(--border-color)', color: 'var(--text-main)', borderRadius: '4px' }} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Tabel Gaji Pokok (JSON Format)</span>
                      <button className="btn-secondary" style={{ fontSize: '12px', padding: '0.2rem 0.5rem' }}>Edit Data JSON</button>
                    </div>
                  </div>
                )}
                
                {regType === 'CUTI' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Hak Cuti Tahunan (Hari)</span>
                      <input type="number" defaultValue="12" style={{ width: '80px', padding: '0.5rem', background: 'var(--bg-app)', border: '1px solid var(--border-color)', color: 'var(--text-main)', borderRadius: '4px' }} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Maksimal Carry Forward (Hari)</span>
                      <input type="number" defaultValue="6" style={{ width: '80px', padding: '0.5rem', background: 'var(--bg-app)', border: '1px solid var(--border-color)', color: 'var(--text-main)', borderRadius: '4px' }} />
                    </div>
                  </div>
                )}
                
                {(regType === 'KEPANGKATAN' || regType === 'TUNJANGAN KELUARGA') && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Masukkan parameter dinamis (Key-Value):</p>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <input type="text" placeholder="Key (contoh: batas_usia_anak)" style={{ flex: 1, padding: '0.5rem', background: 'var(--bg-app)', border: '1px solid var(--border-color)', color: 'var(--text-main)', borderRadius: '4px' }} />
                      <input type="text" placeholder="Value (contoh: 21)" style={{ flex: 1, padding: '0.5rem', background: 'var(--bg-app)', border: '1px solid var(--border-color)', color: 'var(--text-main)', borderRadius: '4px' }} />
                      <button className="btn-secondary" style={{ padding: '0 0.5rem' }}>+</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
              <button className="btn-secondary" onClick={closeModal}>Batal</button>
              <button className="btn-primary" onClick={closeModal}>Simpan sebagai DRAFT</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegulationDashboard;
