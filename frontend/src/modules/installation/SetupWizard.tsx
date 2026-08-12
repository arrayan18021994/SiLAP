import React, { useState } from 'react';
import './Installation.css';
import '../auth/Auth.css';
import Logo from '../../components/Logo';

const SetupWizard: React.FC = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleNext = () => setStep(step + 1);
  const handlePrev = () => setStep(step - 1);

  const [showConfirm, setShowConfirm] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const confirmSetup = () => {
    setShowConfirm(true);
  };

  const finishSetup = async () => {
    setShowConfirm(false);
    setLoading(true);
    
    try {
      // Real API call to register owner and prepare system
      await fetch('http://localhost:8000/api/v1/setup/owner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'admin@silap.local',
          password: 'admin',
          full_name: 'Administrator',
          activation_credential: 'rebindpassword'
        })
      });
      // Activate the installation
      await fetch('http://localhost:8000/api/v1/setup/activate', { method: 'POST' });
    } catch (e) {
      console.error(e);
    }
    
    setShowToast(true);
    setTimeout(() => {
      window.location.href = '/login';
    }, 2000);
  };

  return (
    <div className="auth-layout">
      {/* SUCCESS TOAST */}
      {showToast && (
        <div style={{
          position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)',
          backgroundColor: '#0f172a', border: '1px solid #facc15', borderRadius: '8px',
          padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem',
          boxShadow: '0 10px 25px rgba(0,0,0,0.5)', zIndex: 9999, animation: 'slideDown 0.3s ease-out'
        }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'rgba(250, 204, 21, 0.1)',
            border: '2px solid #facc15', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#facc15', fontWeight: 'bold'
          }}>✓</div>
          <div>
            <h4 style={{ margin: 0, color: 'white', fontSize: '1rem' }}>Instalasi Berhasil!</h4>
            <p style={{ margin: '0.25rem 0 0 0', color: '#cbd5e1', fontSize: '0.85rem' }}>Sistem SiLAP siap digunakan.</p>
          </div>
        </div>
      )}

      {/* CONFIRMATION MODAL */}
      {showConfirm && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(2, 6, 23, 0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 9998, backdropFilter: 'blur(4px)'
        }}>
          <div style={{
            backgroundColor: '#0f172a', border: '1px solid rgba(255, 255, 255, 0.1)', borderTop: '4px solid #facc15',
            borderRadius: '12px', padding: '2rem', maxWidth: '400px', width: '90%',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)', textAlign: 'center'
          }}>
            <h3 style={{ color: 'white', margin: '0 0 1rem 0', fontSize: '1.25rem' }}>Konfirmasi Instalasi</h3>
            <p style={{ color: '#cbd5e1', fontSize: '0.95rem', marginBottom: '2rem', lineHeight: '1.5' }}>
              Apakah Anda yakin data konfigurasi sudah benar? Anda tidak dapat kembali ke halaman instalasi setelah ini.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
              <button 
                onClick={() => setShowConfirm(false)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                  padding: '0.75rem 1.5rem', borderRadius: '8px', border: '1px solid #ef4444',
                  backgroundColor: 'transparent', color: '#ef4444', fontWeight: 'bold', cursor: 'pointer',
                  transition: 'all 0.2s', flex: 1
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <span style={{ fontSize: '1.2rem' }}>✖</span> Tidak
              </button>
              <button 
                onClick={finishSetup}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                  padding: '0.75rem 1.5rem', borderRadius: '8px', border: 'none',
                  backgroundColor: '#facc15', color: '#0f172a', fontWeight: 'bold', cursor: 'pointer',
                  transition: 'all 0.2s', flex: 1
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'none'}
              >
                <span style={{ fontSize: '1.2rem' }}>✔</span> Ya, Instal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LEFT SIDE: Brand & Logo */}
      <div className="auth-left">
        {/* DECORATIONS */}
        <div className="auth-decorations">
          <div className="decor-circle-1"></div>
          <div className="decor-circle-2"></div>
          <div className="decor-ring-yellow top-left"></div>
          <div className="decor-ring-yellow bottom-right"></div>
          <div className="decor-line-navy"></div>
          <div className="decor-line-gold"></div>
          <div className="decor-dots"></div>
        </div>

        <div className="auth-brand-container">
          <Logo hideText={true} className="auth-logo" style={{ width: '240px', height: 'auto', display: 'block', margin: '0 auto 0.5rem auto' }} />
          
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <p style={{ 
              fontFamily: "'Montserrat', 'Inter', sans-serif", 
              fontSize: '0.9rem', 
              fontWeight: 700, 
              color: '#FACC15', 
              letterSpacing: '4px', 
              lineHeight: '1.6',
              margin: '0',
              textShadow: '0 2px 4px rgba(0,0,0,0.5)'
            }}>
              SISTEM LAYANAN<br/>ADMINISTRASI PEGAWAI
            </p>
          </div>

          <div className="auth-quote" style={{ marginTop: '1.5rem' }}>
            Data Akurat, Layanan Cepat,<br/>Administrasi Kepegawaian Modern
          </div>
        </div>
        <div className="auth-footer">
          © 2026 SiLAP - Sistem Layanan Administrasi Pegawai<br/>Semua hak dilindungi.
        </div>
      </div>
      
      {/* RIGHT SIDE: Setup Form */}
      <div className="auth-right">
        <div className="auth-card" style={{ maxWidth: '500px' }}>
          <div className="auth-header" style={{ marginBottom: '1.5rem' }}>
            <div className="auth-icon-badge">⚙️</div>
            <h2>Setup Instalasi Lokal</h2>
            <p>Konfigurasi awal sistem SiLAP</p>
          </div>
        
        {step === 1 && (
          <div className="step-content">
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#facc15' }}>Langkah 1: Identitas Instansi</h3>
            <div className="form-group input-with-icon">
              <span className="input-icon">🏛️</span>
              <input type="text" placeholder="Nama Pemerintah (Misal: Provinsi Jawa Barat)" style={{ paddingLeft: '3rem' }} />
            </div>
            <div className="form-group input-with-icon">
              <span className="input-icon">🏢</span>
              <input type="text" placeholder="Nama Instansi/OPD (Misal: BKD)" style={{ paddingLeft: '3rem' }} />
            </div>
            <div className="auth-options" style={{ justifyContent: 'flex-end', marginTop: '2rem', marginBottom: '0' }}>
              <button onClick={handleNext} className="btn-primary" style={{ padding: '0.8rem 2rem' }}>Selanjutnya</button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="step-content" style={{ zIndex: 1, position: 'relative' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#facc15' }}>Langkah 2: Kop Surat & Logo</h3>
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1' }}>Logo Instansi (Untuk Cetak Surat)</label>
              <input type="file" accept="image/png, image/jpeg, image/svg+xml" style={{ padding: '0.8rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: 'white', width: '100%', boxSizing: 'border-box' }} />
              <p style={{ fontSize: '11px', color: '#64748b', marginTop: '0.5rem' }}>* Format PNG/JPG transparan direkomendasikan</p>
            </div>
            <div className="form-group">
              <textarea placeholder="Teks Header Kop Surat&#10;(Misal: PEMERINTAH PROVINSI JAWA BARAT)" rows={3} style={{ width: '100%', padding: '1rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: 'white', boxSizing: 'border-box', fontFamily: 'inherit', resize: 'vertical' }}></textarea>
            </div>
            <div className="auth-options" style={{ justifyContent: 'space-between', marginTop: '2rem', marginBottom: '0' }}>
              <button onClick={handlePrev} className="btn-outline-yellow" style={{ padding: '0.8rem 1.5rem', borderRadius: '8px', cursor: 'pointer' }}>Kembali</button>
              <button onClick={handleNext} className="btn-primary" style={{ padding: '0.8rem 2rem' }}>Selanjutnya</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="step-content">
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#facc15' }}>Langkah 3: Pemilik Sistem (Owner)</h3>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '1.5rem' }}>Akun ini memiliki hak akses penuh ke seluruh pengaturan instalasi.</p>
            <div className="form-group input-with-icon">
              <span className="input-icon">👤</span>
              <input type="text" placeholder="Nama Lengkap" />
            </div>
            <div className="form-group input-with-icon">
              <span className="input-icon">✉️</span>
              <input type="email" placeholder="Email (Username)" />
            </div>
            <div className="form-group input-with-icon">
              <span className="input-icon">🔒</span>
              <input type="password" placeholder="Password Akun" />
            </div>
            <div className="auth-options" style={{ justifyContent: 'space-between', marginTop: '2rem', marginBottom: '0' }}>
              <button onClick={handlePrev} className="btn-outline-yellow" style={{ padding: '0.8rem 1.5rem', borderRadius: '8px', cursor: 'pointer' }}>Kembali</button>
              <button onClick={handleNext} className="btn-primary" style={{ padding: '0.8rem 2rem' }}>Selanjutnya</button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="step-content">
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#facc15' }}>Langkah 4: Kunci Aktivasi Lokal</h3>
            <div style={{ backgroundColor: 'rgba(250, 204, 21, 0.1)', borderLeft: '4px solid #facc15', padding: '1rem', borderRadius: '4px', marginBottom: '1.5rem' }}>
               <p style={{ fontSize: '0.85rem', color: '#facc15', margin: 0 }}>Simpan kunci ini baik-baik. Kunci aktivasi diperlukan jika server dipindahkan ke komputer lain (Rebind Database).</p>
            </div>
            <div className="form-group input-with-icon">
              <span className="input-icon">🔑</span>
              <input type="password" placeholder="Buat password khusus untuk rebind" />
            </div>
            <div className="auth-options" style={{ justifyContent: 'space-between', marginTop: '2rem', marginBottom: '0' }}>
              <button onClick={handlePrev} className="btn-outline-yellow" style={{ padding: '0.8rem 1.5rem', borderRadius: '8px', cursor: 'pointer' }}>Kembali</button>
              <button onClick={confirmSetup} className="btn-primary" disabled={loading} style={{ padding: '0.8rem 2rem' }}>
                {loading ? "Memproses..." : "Selesaikan Instalasi"}
              </button>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default SetupWizard;
