import React, { useState } from 'react';
import './Installation.css';

const SetupWizard: React.FC = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleNext = () => setStep(step + 1);
  const handlePrev = () => setStep(step - 1);

  const finishSetup = () => {
    setLoading(true);
    // Mock API call
    setTimeout(() => {
      alert("Instalasi berhasil diaktifkan!");
      window.location.reload();
    }, 1000);
  };

  return (
    <div className="wizard-container">
      <div className="wizard-card">
        <h1>SiLAP</h1>
        <p className="subtitle">Sistem Layanan Administrasi Pegawai</p>
        
        {step === 1 && (
          <div className="step-content">
            <h2>Langkah 1: Identitas Instansi</h2>
            <div className="form-group">
              <label>Nama Pemerintah</label>
              <input type="text" placeholder="Misal: Pemerintah Provinsi Jawa Barat" />
            </div>
            <div className="form-group">
              <label>Nama Instansi / OPD</label>
              <input type="text" placeholder="Misal: Badan Kepegawaian Daerah" />
            </div>
            <div className="button-group">
              <button onClick={handleNext} className="btn-primary">Selanjutnya</button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="step-content">
            <h2>Langkah 2: Kop Surat & Logo</h2>
            <div className="form-group">
              <label>Teks Header Kop Surat</label>
              <textarea placeholder="PEMERINTAH PROVINSI JAWA BARAT&#10;BADAN KEPEGAWAIAN DAERAH" rows={3}></textarea>
            </div>
            <div className="button-group">
              <button onClick={handlePrev} className="btn-secondary">Kembali</button>
              <button onClick={handleNext} className="btn-primary">Selanjutnya</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="step-content">
            <h2>Langkah 3: Pemilik Sistem (Owner)</h2>
            <p>Akun ini memiliki hak akses penuh ke seluruh pengaturan instalasi.</p>
            <div className="form-group">
              <label>Nama Lengkap</label>
              <input type="text" placeholder="Nama Admin" />
            </div>
            <div className="form-group">
              <label>Email (Username)</label>
              <input type="email" placeholder="admin@email.go.id" />
            </div>
            <div className="form-group">
              <label>Password Akun</label>
              <input type="password" />
            </div>
            <div className="button-group">
              <button onClick={handlePrev} className="btn-secondary">Kembali</button>
              <button onClick={handleNext} className="btn-primary">Selanjutnya</button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="step-content">
            <h2>Langkah 4: Kunci Aktivasi Lokal</h2>
            <p className="warning-text">Simpan kunci ini baik-baik. Kunci aktivasi diperlukan jika server dipindahkan ke komputer lain (Rebind Database).</p>
            <div className="form-group">
              <label>Local Activation Credential</label>
              <input type="password" placeholder="Buat password khusus untuk rebind" />
            </div>
            <div className="button-group">
              <button onClick={handlePrev} className="btn-secondary">Kembali</button>
              <button onClick={finishSetup} className="btn-primary" disabled={loading}>
                {loading ? "Memproses..." : "Selesaikan Instalasi"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SetupWizard;
