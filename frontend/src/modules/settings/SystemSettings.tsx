import React, { useState } from 'react';
import './Settings.css';

const SystemSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('identitas');

  return (
    <div className="dashboard-content">
      <div className="dashboard-header">
        <h2>Pengaturan SiLAP</h2>
      </div>

      <div className="settings-layout">
        <div className="settings-sidebar">
          <div 
            className={`settings-nav-item ${activeTab === 'identitas' ? 'active' : ''}`}
            onClick={() => setActiveTab('identitas')}
          >
            Identitas OPD
          </div>
          <div 
            className={`settings-nav-item ${activeTab === 'kop' ? 'active' : ''}`}
            onClick={() => setActiveTab('kop')}
          >
            Kop & Format Dokumen
          </div>
          <div 
            className={`settings-nav-item ${activeTab === 'pengguna' ? 'active' : ''}`}
            onClick={() => setActiveTab('pengguna')}
          >
            Pengguna & Hak Akses
          </div>
          <div 
            className={`settings-nav-item ${activeTab === 'instalasi' ? 'active' : ''}`}
            onClick={() => setActiveTab('instalasi')}
          >
            Instalasi
          </div>
          <div 
            className={`settings-nav-item ${activeTab === 'backup' ? 'active' : ''}`}
            onClick={() => setActiveTab('backup')}
          >
            Backup & Restore
          </div>
          <div 
            className={`settings-nav-item ${activeTab === 'tampilan' ? 'active' : ''}`}
            onClick={() => setActiveTab('tampilan')}
          >
            Tampilan
          </div>
          <div 
            className={`settings-nav-item ${activeTab === 'sistem' ? 'active' : ''}`}
            onClick={() => setActiveTab('sistem')}
          >
            Sistem
          </div>
        </div>

        <div className="settings-content">
          {activeTab === 'identitas' && (
            <div>
              <h3 className="settings-section-title">Identitas OPD</h3>
              <p className="settings-section-subtitle">Data yang digunakan sebagai identitas aplikasi dan dokumen.</p>
              
              <div className="form-group">
                <label>Nama Pemerintah Daerah *</label>
                <input type="text" defaultValue="Pemerintah Kota Sabang" />
              </div>
              <div className="form-group">
                <label>Nama OPD *</label>
                <input type="text" defaultValue="Badan Kepegawaian dan Pengembangan Sumber Daya Manusia" />
              </div>
              <div className="form-group">
                <label>Alamat *</label>
                <textarea rows={3} placeholder="........................................"></textarea>
              </div>
              <div className="form-group">
                <label>Telepon</label>
                <input type="text" placeholder="........................................" />
              </div>
              <div className="form-group">
                <label>Email Instansi</label>
                <input type="email" placeholder="........................................" />
              </div>
              <div className="form-group">
                <label>Logo Pemerintah</label>
                <button className="btn-secondary">Upload Logo</button>
              </div>
              
              <button className="btn-primary mt-4">Simpan</button>
            </div>
          )}

          {activeTab === 'kop' && (
            <div>
              <h3 className="settings-section-title">Kop Surat</h3>
              <p className="settings-section-subtitle">Untuk mengatur dokumen yang dihasilkan SiLAP.</p>
              
              <div className="form-group">
                <label>Logo Pemerintah</label>
                <button className="btn-secondary">Preview</button>
              </div>
              <div className="form-group">
                <label>Nama Pemerintah Daerah</label>
                <input type="text" value="[ otomatis dari Identitas OPD ]" disabled />
              </div>
              <div className="form-group">
                <label>Nama OPD</label>
                <input type="text" value="[ otomatis dari Identitas OPD ]" disabled />
              </div>
              <div className="form-group">
                <label>Alamat</label>
                <input type="text" value="[ otomatis dari Identitas OPD ]" disabled />
              </div>
              <div className="form-group">
                <label>Telepon / Kontak</label>
                <input type="text" value="[ otomatis dari Identitas OPD ]" disabled />
              </div>
              
              <div className="flex gap-4 mt-4">
                <button className="btn-secondary">Preview Kop</button>
                <button className="btn-primary">Simpan</button>
              </div>

              <div className="settings-divider"></div>
              
              <h3 className="settings-section-title">Format Dokumen</h3>
              <div className="form-group" style={{ maxWidth: '300px' }}>
                <label>Ukuran Kertas</label>
                <select className="form-group select" defaultValue="A4">
                  <option value="A4">A4</option>
                  <option value="F4">F4</option>
                  <option value="Letter">Letter</option>
                  <option value="Custom">Custom</option>
                </select>
              </div>
              
              <div className="form-group" style={{ maxWidth: '300px' }}>
                <label>Orientasi</label>
                <select className="form-group select" defaultValue="Portrait">
                  <option value="Portrait">Portrait</option>
                  <option value="Landscape">Landscape</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Margin:</label>
                <div className="margin-grid">
                  <div className="margin-input-group">
                    <span style={{width: '50px'}}>Atas</span>
                    <input type="number" defaultValue={3.00} step={0.1} /> cm
                  </div>
                  <div className="margin-input-group">
                    <span style={{width: '50px'}}>Bawah</span>
                    <input type="number" defaultValue={3.00} step={0.1} /> cm
                  </div>
                  <div className="margin-input-group">
                    <span style={{width: '50px'}}>Kiri</span>
                    <input type="number" defaultValue={4.00} step={0.1} /> cm
                  </div>
                  <div className="margin-input-group">
                    <span style={{width: '50px'}}>Kanan</span>
                    <input type="number" defaultValue={3.00} step={0.1} /> cm
                  </div>
                </div>
              </div>
              
              <button className="btn-primary mt-4">Simpan</button>
            </div>
          )}

          {activeTab === 'pengguna' && (
            <div>
              <h3 className="settings-section-title">Pengguna</h3>
              <p className="settings-section-subtitle">Untuk mengelola siapa yang dapat menggunakan SiLAP.</p>
              
              <button className="btn-primary mb-4">+ Tambah Pengguna</button>
              
              <div className="settings-table-container">
                <table className="settings-table">
                  <thead>
                    <tr>
                      <th>Nama</th>
                      <th>Email / Username</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Terakhir Login</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Admin Utama</td>
                      <td>admin@local.silap</td>
                      <td>OWNER</td>
                      <td><span className="status-badge active">Aktif</span></td>
                      <td>12-08-2026</td>
                    </tr>
                    <tr>
                      <td>Operator Satu</td>
                      <td>op1@local.silap</td>
                      <td>OPERATOR</td>
                      <td><span className="status-badge active">Aktif</span></td>
                      <td>11-08-2026</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'instalasi' && (
            <div>
              <h3 className="settings-section-title">Instalasi</h3>
              <p className="settings-section-subtitle">Untuk sistem local/offline.</p>
              
              <div className="setting-row">
                <div className="setting-info">
                  <h4>Status</h4>
                  <p><span style={{color: '#16a34a'}}>● ACTIVE</span></p>
                </div>
              </div>
              <div className="setting-row">
                <div className="setting-info">
                  <h4>Installation ID</h4>
                  <p>SILAP-XXXXXXXX</p>
                </div>
              </div>
              <div className="setting-row">
                <div className="setting-info">
                  <h4>Nama Instalasi</h4>
                  <input type="text" defaultValue="BKPSDM Kota Sabang" style={{ marginTop: '0.5rem', padding: '0.5rem' }} />
                </div>
              </div>
              <div className="setting-row">
                <div className="setting-info">
                  <h4>Tanggal Aktivasi</h4>
                  <p>12-08-2026</p>
                </div>
              </div>
              <div className="setting-row">
                <div className="setting-info">
                  <h4>Perangkat</h4>
                  <p>PC-ADMIN-01</p>
                </div>
              </div>
              <div className="setting-row">
                <div className="setting-info">
                  <h4>Database</h4>
                  <p><span style={{color: '#16a34a'}}>● Connected</span></p>
                </div>
              </div>
              
              <button className="btn-secondary mt-4">Aktivasi / Setup Ulang</button>
            </div>
          )}

          {activeTab === 'backup' && (
            <div>
              <h3 className="settings-section-title">Backup & Restore</h3>
              
              <div style={{ background: 'rgba(0,0,0,0.02)', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
                <h4 style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>BACKUP TERAKHIR</h4>
                <p style={{ fontSize: '1.2rem', fontWeight: 600 }}>12 Agustus 2026</p>
                <p>08:15</p>
                
                <div style={{ marginTop: '1rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}><span>✓</span> Database</div>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}><span>✓</span> Dokumen</div>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}><span>✓</span> Konfigurasi</div>
                </div>
              </div>
              
              <button className="btn-primary mb-4">Backup Sekarang</button>
              
              <div className="settings-divider"></div>
              
              <button className="btn-secondary">Restore Backup</button>
            </div>
          )}

          {activeTab === 'tampilan' && (
            <div>
              <h3 className="settings-section-title">Tampilan</h3>
              
              <div className="form-group mb-4">
                <label>Tema</label>
                <div className="radio-group flex-col">
                  <label className="radio-option">
                    <input type="radio" name="theme" value="system" /> Mengikuti Sistem
                  </label>
                  <label className="radio-option">
                    <input type="radio" name="theme" value="light" defaultChecked /> Light
                  </label>
                  <label className="radio-option">
                    <input type="radio" name="theme" value="dark" /> Dark
                  </label>
                </div>
              </div>
              
              <div className="form-group mb-4">
                <label>Ukuran Tampilan</label>
                <div className="radio-group flex-col">
                  <label className="radio-option">
                    <input type="radio" name="size" value="compact" defaultChecked /> Compact
                  </label>
                  <label className="radio-option">
                    <input type="radio" name="size" value="normal" /> Normal
                  </label>
                  <label className="radio-option">
                    <input type="radio" name="size" value="large" /> Large
                  </label>
                </div>
              </div>

              <div className="form-group mb-4">
                <label>Sidebar</label>
                <div className="radio-group flex-col">
                  <label className="radio-option">
                    <input type="radio" name="sidebar" value="open" defaultChecked /> Terbuka
                  </label>
                  <label className="radio-option">
                    <input type="radio" name="sidebar" value="closed" /> Tertutup
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label>Format Waktu</label>
                <div className="radio-group flex-col">
                  <label className="radio-option">
                    <input type="radio" name="time" value="24" defaultChecked /> 24 Jam
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'sistem' && (
            <div>
              <h3 className="settings-section-title">Informasi Sistem</h3>
              
              <div className="settings-table-container">
                <table className="settings-table" style={{ width: 'auto', minWidth: '400px' }}>
                  <tbody>
                    <tr>
                      <td style={{ fontWeight: 500, color: 'var(--text-muted)' }}>Nama Aplikasi</td>
                      <td>SiLAP</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 500, color: 'var(--text-muted)' }}>Versi</td>
                      <td>1.0.0</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 500, color: 'var(--text-muted)' }}>Database</td>
                      <td>SQLite</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 500, color: 'var(--text-muted)' }}>Status Database</td>
                      <td><span style={{color: '#16a34a'}}>● Connected</span></td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 500, color: 'var(--text-muted)' }}>Mode</td>
                      <td>Offline</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 500, color: 'var(--text-muted)' }}>Tanggal Sistem</td>
                      <td>12 Agustus 2026</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 500, color: 'var(--text-muted)' }}>Jam Sistem</td>
                      <td>15:27:00</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 500, color: 'var(--text-muted)' }}>Zona Waktu</td>
                      <td>Asia/Jakarta</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 500, color: 'var(--text-muted)' }}>Penyimpanan</td>
                      <td>2.4 GB / 50 GB</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 500, color: 'var(--text-muted)' }}>Backup Terakhir</td>
                      <td>12 Agustus 2026</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 500, color: 'var(--text-muted)' }}>Dokumen</td>
                      <td>1.248 file</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="flex gap-4 mt-6">
                <button className="btn-secondary">Cek Integritas Database</button>
                <button className="btn-secondary">Cek Penyimpanan</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;
