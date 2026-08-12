import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../../components/Logo';
import './Auth.css';

const generateMathCaptcha = () => {
  const num1 = Math.floor(Math.random() * 10) + 1;
  const num2 = Math.floor(Math.random() * 10) + 1;
  const operators = ['+', '-', '*'];
  const operator = operators[Math.floor(Math.random() * operators.length)];
  let answer = 0;
  if (operator === '+') answer = num1 + num2;
  if (operator === '-') {
    answer = Math.max(num1, num2) - Math.min(num1, num2);
    return { text: `${Math.max(num1, num2)} ${operator} ${Math.min(num1, num2)} = ?`, answer: answer.toString() };
  }
  if (operator === '*') answer = num1 * num2;
  return { text: `${num1} ${operator} ${num2} = ?`, answer: answer.toString() };
};

const validatePassword = (pwd: string) => {
  const defaultDetails = { length: false, upper: false, lower: false, number: false, symbol: false };
  if (!pwd) return { valid: false, strength: '', details: defaultDetails };
  
  const minLength = 8;
  const maxLength = 12;
  const hasSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(pwd);
  const hasNumber = /\d/.test(pwd);
  const hasUpper = /[A-Z]/.test(pwd);
  const hasLower = /[a-z]/.test(pwd);
  const hasLength = pwd.length >= minLength && pwd.length <= maxLength;
  
  const details = { length: hasLength, upper: hasUpper, lower: hasLower, number: hasNumber, symbol: hasSymbol };
  
  if (!hasLength) return { valid: false, strength: 'Sangat Lemah', details };
  
  let score = 0;
  if (hasSymbol) score++;
  if (hasNumber) score++;
  if (hasUpper) score++;
  if (hasLower) score++;
  
  if (score < 3) return { valid: false, strength: 'Lemah', details };
  if (score === 3) return { valid: false, strength: 'Sedang', details };
  return { valid: true, strength: 'Kuat', details };
};

const Login: React.FC = () => {
  const [view, setView] = useState<'login' | 'forgot' | 'otp' | 'reset' | 'force_reset'>('login');
  
  // Login State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [captchaData, setCaptchaData] = useState({ text: '', answer: '' });
  const [captchaInput, setCaptchaInput] = useState('');
  
  // Forgot Password State
  const [resetEmail, setResetEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const refreshCaptcha = useCallback(() => {
    setCaptchaData(generateMathCaptcha());
    setCaptchaInput('');
  }, []);

  useEffect(() => {
    refreshCaptcha();
    const savedUsername = localStorage.getItem('silap_remember_username');
    if (savedUsername) {
      setUsername(savedUsername);
      setRememberMe(true);
    }
  }, [refreshCaptcha]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    
    if (captchaInput !== captchaData.answer) {
      setErrorMsg('Jawaban Captcha tidak sesuai, silakan coba lagi.');
      refreshCaptcha();
      return;
    }

    setLoading(true);
    
    setTimeout(() => {
      if (username !== 'admin' && username !== 'admin@silap.local') {
        setErrorMsg('Username atau password salah.');
        refreshCaptcha();
        setLoading(false);
        return;
      }
      
      if (password === 'admin' || password === '123456' || password === 'password') {
        setLoading(false);
        setErrorMsg('Demi keamanan, Anda diwajibkan untuk mengubah sandi standar sebelum mengakses sistem.');
        setView('force_reset');
        return;
      }
      
      if (rememberMe) {
        localStorage.setItem('silap_remember_username', username);
      } else {
        localStorage.removeItem('silap_remember_username');
      }

      navigate('/dashboard');
    }, 800);
  };



  const [resetToken, setResetToken] = useState('');

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);
    
    // Simulated OTP Request
    setTimeout(() => {
      setSuccessMsg('Kode OTP telah dikirimkan ke email/No. HP Anda.');
      setView('otp');
      setLoading(false);
    }, 1000);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);
    
    // Simulated OTP Verification
    setTimeout(() => {
      if (otp !== '123456') {
        setErrorMsg('Kode OTP tidak valid atau telah kadaluarsa.');
        setLoading(false);
        return;
      }
      setResetToken('mock-token-123');
      setSuccessMsg('OTP terverifikasi. Silakan buat sandi baru.');
      setView('reset');
      setLoading(false);
    }, 1000);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!resetToken) {
      setErrorMsg('Token reset tidak valid');
      return;
    }
    
    const pwdValidation = validatePassword(newPassword);
    if (!pwdValidation.valid) {
      setErrorMsg('Sandi baru belum memenuhi syarat.');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setErrorMsg('Konfirmasi sandi tidak cocok.');
      return;
    }
    
    setLoading(true);
    
    // Simulated Password Reset
    setTimeout(() => {
      setSuccessMsg('Sandi berhasil diubah. Silakan login dengan sandi baru.');
      setView('login');
      setPassword('');
      setCaptchaInput('');
      refreshCaptcha();
      setLoading(false);
    }, 1000);
  };

  const handleForceResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    
    const pwdValidation = validatePassword(newPassword);
    if (!pwdValidation.valid) {
      setErrorMsg('Sandi baru belum memenuhi syarat.');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setErrorMsg('Konfirmasi sandi tidak cocok.');
      return;
    }
    
    setLoading(true);
    setTimeout(() => {
      setSuccessMsg('Sandi berhasil diperbarui.');
      setTimeout(() => navigate('/dashboard'), 1000);
    }, 1000);
  };

  const passwordCheck = validatePassword(newPassword);
  
  const getStrengthColor = (strength: string) => {
    if (strength === 'Sangat Lemah' || strength === 'Lemah') return '#ef4444';
    if (strength === 'Sedang') return '#eab308';
    if (strength === 'Kuat') return '#10b981';
    return 'transparent';
  };

  const pwdRequirements = [
    { label: '8-12 karakter', met: passwordCheck.details?.length },
    { label: 'Huruf Besar', met: passwordCheck.details?.upper },
    { label: 'Huruf Kecil', met: passwordCheck.details?.lower },
    { label: 'Angka', met: passwordCheck.details?.number },
    { label: 'Simbol', met: passwordCheck.details?.symbol },
    { label: 'Sandi Cocok', met: Boolean(newPassword && confirmPassword && confirmPassword === newPassword) }
  ];

  return (
    <div className="auth-layout">
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
      
      {/* RIGHT SIDE: Login Form */}
      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-icon-badge">🔒</div>
            <h2>Selamat Datang</h2>
            <p>Silakan masuk untuk melanjutkan</p>
          </div>
        
        {errorMsg && <div className="auth-alert">{errorMsg}</div>}
        {successMsg && <div className="auth-alert" style={{backgroundColor: 'rgba(16, 185, 129, 0.1)', borderColor: 'rgba(16, 185, 129, 0.3)', color: '#10b981'}}>{successMsg}</div>}
        
        {view === 'login' && (
          <form onSubmit={handleLogin} className="auth-form">
            <div className="form-group input-with-icon">
              <span className="input-icon">✉️</span>
              <input 
                type="text" 
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Email / Username" 
              />
            </div>
            <div className="form-group input-with-icon">
              <span className="input-icon">🔒</span>
              <input 
                type={showPassword ? "text" : "password"} 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
              />
              <span className="input-icon-right" style={{cursor: 'pointer'}} onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? '👁️‍🗨️' : '👁️'}
              </span>
            </div>

            <div className="form-group captcha-group" style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div className="captcha-display" style={{ 
                background: 'rgba(250, 204, 21, 0.1)', 
                border: '1px solid rgba(250, 204, 21, 0.3)',
                color: '#facc15',
                padding: '0.8rem 1.2rem',
                borderRadius: '8px',
                fontWeight: 'bold',
                letterSpacing: '2px',
                minWidth: '110px',
                textAlign: 'center',
                userSelect: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer'
              }} onClick={refreshCaptcha} title="Klik untuk mengganti soal">
                <span>{captchaData.text}</span>
                <span style={{ fontSize: '14px', opacity: 0.8 }}>🔄</span>
              </div>
              <input 
                type="text" 
                required
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value)}
                placeholder="Jawaban Captcha"
                style={{ flex: 1, padding: '0.8rem 1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: 'white' }}
              />
            </div>
            
            <div className="auth-options" style={{ marginBottom: '0.5rem' }}>
              <label className="remember-me">
                <input 
                  type="checkbox" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span className="checkmark"></span>
                Ingat saya
              </label>
              <a href="#" className="forgot-password" onClick={(e) => { e.preventDefault(); setView('forgot'); setErrorMsg(''); setSuccessMsg(''); }}>
                Lupa password?
              </a>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '1.5rem' }}>
              <button type="submit" className="btn-primary" style={{ flex: 1, padding: '0.8rem', fontSize: '0.9rem' }} disabled={loading}>
                {loading ? "Memproses..." : "MASUK"}
              </button>
              
              <button type="button" className="btn-outline-yellow" style={{ flex: 1, padding: '0.8rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }} onClick={() => navigate('/setup')}>
                 ⚙️ Konfigurasi
              </button>
            </div>
          </form>
        )}

        {view === 'forgot' && (
          <form onSubmit={handleRequestOtp} className="auth-form">
            <h3 style={{marginBottom: '1rem', color: '#fff', fontSize: '1.2rem', textAlign: 'center'}}>Lupa Password</h3>
            <p style={{color: 'var(--text-muted)', fontSize: '12px', marginBottom: '1.5rem', textAlign: 'center'}}>Masukkan username/email Anda. Kami akan mengirimkan kode OTP untuk mereset sandi Anda.</p>
            <div className="form-group">
              <label>Username / Email</label>
              <input 
                type="text" 
                required
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder="Masukkan username atau email" 
              />
            </div>
            <button type="submit" className="btn-primary" style={{ display: 'block', width: '100%', textAlign: 'center' }} disabled={loading}>
              {loading ? "Memproses..." : "Kirim Kode OTP"}
            </button>
            <button type="button" className="btn-text" style={{width: '100%', marginTop: '1rem', color: '#cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'}} onClick={() => setView('login')}>
              <span>←</span> Kembali ke Login
            </button>
          </form>
        )}

        {view === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="auth-form">
            <h3 style={{marginBottom: '1rem', color: '#fff', fontSize: '1.2rem', textAlign: 'center'}}>Konfirmasi OTP</h3>
            <p style={{color: 'var(--text-muted)', fontSize: '12px', marginBottom: '1.5rem', textAlign: 'center'}}>Masukkan 6 digit kode OTP yang dikirimkan ke email Anda.</p>
            <div className="form-group">
              <label>Kode OTP</label>
              <input 
                type="text" 
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="123456" 
                maxLength={6}
                style={{textAlign: 'center', letterSpacing: '0.2em', fontSize: '1.2rem'}}
              />
            </div>
            <button type="submit" className="btn-primary" style={{ display: 'block', width: '100%', textAlign: 'center' }} disabled={loading}>
              {loading ? "Memverifikasi..." : "Verifikasi OTP"}
            </button>
            <button type="button" className="btn-text" style={{width: '100%', marginTop: '1rem', color: '#cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'}} onClick={() => setView('login')}>
              <span>←</span> Kembali ke Login
            </button>
          </form>
        )}

        {view === 'reset' && (
          <form onSubmit={handleResetPassword} className="auth-form">
            <h3 style={{marginBottom: '1rem', color: '#fff', fontSize: '1.2rem', textAlign: 'center'}}>Buat Sandi Baru</h3>
            
            <div className="form-group">
              <label>Sandi Baru</label>
              <input 
                type="password" 
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Masukkan sandi baru" 
              />
              {newPassword && (
                <div style={{marginTop: '0.5rem', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                  <div style={{flex: 1, height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden'}}>
                    <div style={{
                      height: '100%', 
                      width: passwordCheck.strength === 'Sangat Lemah' ? '25%' : passwordCheck.strength === 'Lemah' ? '50%' : passwordCheck.strength === 'Sedang' ? '75%' : '100%',
                      background: getStrengthColor(passwordCheck.strength),
                      transition: 'width 0.3s'
                    }}></div>
                  </div>
                  <span style={{color: getStrengthColor(passwordCheck.strength), fontWeight: 'bold'}}>{passwordCheck.strength}</span>
                </div>
              )}
            </div>
            
            <div className="form-group" style={{marginTop: '1rem'}}>
              <label>Konfirmasi Sandi Baru</label>
              <input 
                type="password" 
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ulangi sandi baru" 
              />
            </div>

            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '11px', marginTop: '1.5rem', marginBottom: '1.5rem'}}>
              {pwdRequirements.map((req, i) => (
                <span key={i} style={{ 
                  color: req.met ? '#10b981' : 'var(--text-muted)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '4px',
                  backgroundColor: req.met ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                  padding: '6px 8px',
                  borderRadius: '12px',
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {req.met ? '✓' : '○'} {req.label}
                </span>
              ))}
            </div>

            <button type="submit" className="btn-primary" style={{ display: 'block', width: '100%', textAlign: 'center' }} disabled={loading || !passwordCheck.valid || newPassword !== confirmPassword}>
              {loading ? "Menyimpan..." : "Simpan Sandi Baru"}
            </button>
          </form>
        )}

        {view === 'force_reset' && (
          <form onSubmit={handleForceResetSubmit} className="auth-form">
            <h3 style={{marginBottom: '1rem', color: '#fff', fontSize: '1.2rem', textAlign: 'center'}}>Ganti Sandi Standar</h3>
            <p style={{color: 'var(--text-muted)', fontSize: '12px', marginBottom: '1.5rem', textAlign: 'center'}}>Demi keamanan, harap ubah sandi standar Anda menjadi sandi yang lebih kuat.</p>
            
            <div className="form-group">
              <label>Sandi Baru</label>
              <input 
                type="password" 
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Masukkan sandi baru" 
              />
              {newPassword && (
                <div style={{marginTop: '0.5rem', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                  <div style={{flex: 1, height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden'}}>
                    <div style={{
                      height: '100%', 
                      width: passwordCheck.strength === 'Sangat Lemah' ? '25%' : passwordCheck.strength === 'Lemah' ? '50%' : passwordCheck.strength === 'Sedang' ? '75%' : '100%',
                      background: getStrengthColor(passwordCheck.strength),
                      transition: 'width 0.3s'
                    }}></div>
                  </div>
                  <span style={{color: getStrengthColor(passwordCheck.strength), fontWeight: 'bold'}}>{passwordCheck.strength}</span>
                </div>
              )}
            </div>
            
            <div className="form-group" style={{marginTop: '1rem'}}>
              <label>Konfirmasi Sandi Baru</label>
              <input 
                type="password" 
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ulangi sandi baru" 
              />
            </div>

            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '11px', marginTop: '1.5rem', marginBottom: '1.5rem'}}>
              {pwdRequirements.map((req, i) => (
                <span key={i} style={{ 
                  color: req.met ? '#10b981' : 'var(--text-muted)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '4px',
                  backgroundColor: req.met ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                  padding: '6px 8px',
                  borderRadius: '12px',
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {req.met ? '✓' : '○'} {req.label}
                </span>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" className="btn-primary" disabled={loading || !passwordCheck.valid || newPassword !== confirmPassword}>
                {loading ? "Memproses..." : "Ubah Sandi & Lanjut"}
              </button>
            </div>
          </form>
        )}
        </div>
      </div>
    </div>
  );
};

export default Login;
