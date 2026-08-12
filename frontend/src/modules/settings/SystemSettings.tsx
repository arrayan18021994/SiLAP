import React, { useState } from 'react';
import './Settings.css';

const SystemSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');

  return (
    <div className="dashboard-content">
      <div className="dashboard-header">
        <h2>Pengaturan Sistem</h2>
      </div>

      <div className="settings-layout">
        <div className="settings-sidebar">
          <div 
            className={`settings-nav-item ${activeTab === 'general' ? 'active' : ''}`}
            onClick={() => setActiveTab('general')}
          >
            General & Theme
          </div>
          <div 
            className={`settings-nav-item ${activeTab === 'organization' ? 'active' : ''}`}
            onClick={() => setActiveTab('organization')}
          >
            Organisasi & Kop Surat
          </div>
          <div 
            className={`settings-nav-item ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            Keamanan & Akses
          </div>
          <div 
            className={`settings-nav-item ${activeTab === 'advanced' ? 'active' : ''}`}
            onClick={() => setActiveTab('advanced')}
          >
            Sistem Lanjutan
          </div>
        </div>

        <div className="settings-content">
          {activeTab === 'general' && (
            <div>
              <h3 className="settings-section-title">General Preferences</h3>
              <p className="settings-section-subtitle">Manage your overall workspace appearance and basic settings.</p>
              
              <div className="setting-row">
                <div className="setting-info">
                  <h4>Tema Premium (Govera AI Style)</h4>
                  <p>Gunakan antarmuka modern dengan glassmorphism dan tata letak minimalis.</p>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" defaultChecked />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              
              <div className="setting-row">
                <div className="setting-info">
                  <h4>Animasi Antarmuka</h4>
                  <p>Aktifkan transisi mikro saat berinteraksi dengan elemen UI.</p>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" defaultChecked />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="settings-divider"></div>

              <div className="form-group" style={{ maxWidth: '400px' }}>
                <label>Bahasa Sistem</label>
                <select className="form-group select">
                  <option>Bahasa Indonesia</option>
                  <option>English (US)</option>
                </select>
              </div>
              
              <button className="btn-primary mt-4">Simpan Perubahan</button>
            </div>
          )}

          {activeTab === 'organization' && (
            <div>
              <h3 className="settings-section-title">Profil Organisasi</h3>
              <p className="settings-section-subtitle">Atur identitas instansi untuk keperluan administrasi dan pencetakan dokumen.</p>
              
              <div className="form-group">
                <label>Nama Instansi Induk</label>
                <input type="text" defaultValue="Pemerintah Provinsi Jawa Barat" />
              </div>
              <div className="form-group">
                <label>Unit Kerja / OPD</label>
                <input type="text" defaultValue="Dinas Komunikasi dan Informatika" />
              </div>
              
              <div className="form-group">
                <label>Alamat Lengkap</label>
                <textarea rows={3} defaultValue="Jl. Tamansari No. 55, Bandung, Jawa Barat"></textarea>
              </div>

              <div className="settings-divider"></div>
              <h3 className="settings-section-title" style={{ fontSize: '1.2rem' }}>Kop Surat & Logo</h3>
              
              <div className="setting-row">
                <div className="setting-info">
                  <h4>Tampilkan Logo di Dokumen</h4>
                  <p>Gunakan silap_logo.png yang sudah dikonfigurasi.</p>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" defaultChecked />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <button className="btn-primary mt-4">Simpan Organisasi</button>
            </div>
          )}

          {activeTab === 'security' && (
            <div>
              <h3 className="settings-section-title">Security Settings</h3>
              <p className="settings-section-subtitle">Kelola pengaturan keamanan akun dan pembatasan akses data.</p>
              
              <div className="setting-row">
                <div className="setting-info">
                  <h4>Autentikasi Dua Faktor (2FA)</h4>
                  <p>Wajibkan PIN tambahan saat mengakses menu pengaturan.</p>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              
              <div className="setting-row">
                <div className="setting-info">
                  <h4>Proteksi Data Sensitif</h4>
                  <p>Sembunyikan data keluarga dan riwayat pada dasbor utama (Khusus role HR Admin).</p>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" defaultChecked />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <button className="btn-primary mt-4">Update Security</button>
            </div>
          )}
          
          {activeTab === 'advanced' && (
            <div>
              <h3 className="settings-section-title">System & Database</h3>
              <p className="settings-section-subtitle">Pengaturan engine utama SiLAP (Cuti, KGB, Mass Update).</p>
              
              <div className="setting-row">
                <div className="setting-info">
                  <h4>Offline Mode Override</h4>
                  <p>Matikan peringatan koneksi cloud, biarkan berjalan 100% luring (SQLite Local).</p>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" defaultChecked />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              
              <div className="setting-row">
                <div className="setting-info">
                  <h4 className="text-danger">Factory Reset</h4>
                  <p>Hapus seluruh data transaksi. Data master akan dipertahankan.</p>
                </div>
                <button className="btn-secondary" style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }}>Reset Data</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;
