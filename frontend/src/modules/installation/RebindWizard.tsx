import React, { useState } from 'react';
import './Installation.css';
import Logo from '../../components/Logo';

const RebindWizard: React.FC = () => {
  const [credential, setCredential] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRebind = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/v1/setup/rebind', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activation_credential: credential })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Rebind gagal');
      }
      
      alert("Database berhasil di-rebind ke perangkat ini!");
      window.location.reload();
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wizard-container">
      <div className="wizard-card">
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
          <Logo style={{ height: '80px' }} />
        </div>
        <p className="subtitle" style={{ textAlign: 'center', marginBottom: '2rem' }}>Sistem Layanan Administrasi Pegawai</p>
        
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
