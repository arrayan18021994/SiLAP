import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../../components/Logo';
import './Auth.css';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Password requirements state
  const [passwordCheck, setPasswordCheck] = useState({
    isValid: false,
    details: { length: false, upper: false, lower: false, num: false, special: false, match: false }
  });

  const checkPasswordStrength = (pwd: string, confirm: string) => {
    const details = {
      length: pwd.length >= 8 && pwd.length <= 12,
      upper: /[A-Z]/.test(pwd),
      lower: /[a-z]/.test(pwd),
      num: /[0-9]/.test(pwd),
      special: /[^A-Za-z0-9]/.test(pwd),
      match: pwd === confirm && pwd.length > 0
    };
    const isValid = Object.values(details).every(Boolean);
    setPasswordCheck({ isValid, details });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
    checkPasswordStrength(e.target.value, confirmPassword);
  };

  const handleConfirmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
    checkPasswordStrength(newPassword, e.target.value);
  };

  const requestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:8000/api/v1/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      if (res.status === 429) {
        throw new Error("Tunggu 60 detik sebelum meminta OTP baru.");
      }
      // Regardless of success/fail (to prevent enumeration), we move to step 2
      setStep(2);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:8000/api/v1/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Verifikasi gagal.");
      
      setResetToken(data.reset_token);
      setStep(3);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordCheck.isValid) return;
    
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:8000/api/v1/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reset_token: resetToken, new_password: newPassword })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Gagal mengubah sandi.");
      
      alert("Sandi berhasil diubah! Silakan login.");
      navigate('/login');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <Logo className="auth-logo" style={{ height: '72px', width: 'auto', display: 'block', margin: '0 auto 1rem auto' }} />
          <p>Pemulihan Akun SiLAP</p>
        </div>

        {error && <div className="auth-error" style={{ color: '#ef4444', marginBottom: '1rem', textAlign: 'center', fontSize: '12px', background: 'rgba(239, 68, 68, 0.1)', padding: '8px', borderRadius: '4px' }}>{error}</div>}

        {step === 1 && (
          <form onSubmit={requestOTP}>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '1rem', textAlign: 'center' }}>
              Masukkan email Anda. Kami akan mengirimkan kode OTP untuk memulihkan akun. <br/><br/>
              <b>Koneksi internet diperlukan.</b>
            </p>
            <div className="form-group">
              <label>Email Terdaftar</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@instansi.go.id" />
            </div>
            <button type="submit" className="btn-primary" style={{ width: '100%', marginBottom: '1rem' }} disabled={loading}>
              {loading ? 'Mengirim...' : 'Kirim Kode OTP'}
            </button>
            <div style={{ textAlign: 'center' }}>
              <button type="button" className="btn-text" onClick={() => navigate('/login')}>Kembali ke Login</button>
            </div>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={verifyOTP}>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '1rem', textAlign: 'center' }}>
              Kode OTP telah dikirim ke <b>{email}</b>.<br/>Masukkan 6 digit kode di bawah ini.
            </p>
            <div className="form-group">
              <label>Kode OTP</label>
              <input type="text" required maxLength={6} value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="123456" style={{ letterSpacing: '8px', textAlign: 'center', fontSize: '18px' }} />
            </div>
            <button type="submit" className="btn-primary" style={{ width: '100%', marginBottom: '1rem' }} disabled={loading || otp.length < 6}>
              {loading ? 'Memverifikasi...' : 'Verifikasi OTP'}
            </button>
            <div style={{ textAlign: 'center' }}>
              <button type="button" className="btn-text" onClick={() => setStep(1)}>Ganti Email</button>
            </div>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={resetPassword}>
            <div className="form-group">
              <label>Sandi Baru</label>
              <input type="password" required value={newPassword} onChange={handlePasswordChange} />
            </div>
            <div className="form-group">
              <label>Konfirmasi Sandi Baru</label>
              <input type="password" required value={confirmPassword} onChange={handleConfirmChange} />
            </div>

            {/* Password Strength Requirements */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '1rem', fontSize: '11px' }}>
              <div style={{ color: passwordCheck.details.length ? '#10b981' : '#64748b' }}>
                {passwordCheck.details.length ? '✓' : '○'} 8-12 karakter
              </div>
              <div style={{ color: passwordCheck.details.upper ? '#10b981' : '#64748b' }}>
                {passwordCheck.details.upper ? '✓' : '○'} 1 Huruf Besar
              </div>
              <div style={{ color: passwordCheck.details.lower ? '#10b981' : '#64748b' }}>
                {passwordCheck.details.lower ? '✓' : '○'} 1 Huruf Kecil
              </div>
              <div style={{ color: passwordCheck.details.num ? '#10b981' : '#64748b' }}>
                {passwordCheck.details.num ? '✓' : '○'} 1 Angka
              </div>
              <div style={{ color: passwordCheck.details.special ? '#10b981' : '#64748b' }}>
                {passwordCheck.details.special ? '✓' : '○'} 1 Simbol
              </div>
              <div style={{ color: passwordCheck.details.match ? '#10b981' : '#ef4444' }}>
                {passwordCheck.details.match ? '✓' : '○'} Sandi Cocok
              </div>
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={loading || !passwordCheck.isValid}>
              {loading ? 'Menyimpan...' : 'Simpan Sandi Baru'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
