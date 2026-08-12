import React, { useState } from 'react';
import './Installation.css';

const RebindWizard: React.FC = () => {
  const [credential, setCredential] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRebind = () => {
    setLoading(true);
    // Mock API call
    setTimeout(() => {
      alert("Database berhasil di-rebind ke perangkat ini!");
      window.location.reload();
    }, 1000);
  };

  return (
    <div className="wizard-container">
      <div className="wizard-card">
        <h1>Instalasi Baru Terdeteksi</h1>
        <p className="subtitle">Database SiLAP ditemukan, namun belum terikat pada perangkat ini.</p>
        
        <div className="step-content">
          <p className="warning-text">
            Akun dan data Anda aman. Untuk melanjutkan penggunaan SiLAP di perangkat ini, 
            silakan masukkan <strong>Local Activation Credential</strong> yang Anda buat saat instalasi pertama.
          </p>
          
          <div className="form-group">
            <label>Kunci Aktivasi Lokal</label>
            <input 
              type="password" 
              placeholder="Masukkan kunci aktivasi..." 
              value={credential}
              onChange={(e) => setCredential(e.target.value)}
            />
          </div>
          
          <div className="button-group">
            <button onClick={handleRebind} className="btn-primary" disabled={loading || !credential}>
              {loading ? "Memverifikasi..." : "Rebind & Aktifkan"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RebindWizard;
