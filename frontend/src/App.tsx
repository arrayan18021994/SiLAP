import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SetupWizard from './modules/installation/SetupWizard';
import RebindWizard from './modules/installation/RebindWizard';
import Login from './modules/auth/Login';
import Dashboard from './modules/dashboard/Dashboard';

import './App.css';

function App() {
  const [systemStatus, setSystemStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8000/api/v1/system/status')
      .then(res => res.json())
      .then(data => { 
        setSystemStatus(data.status); 
        setLoading(false); 
      })
      .catch(err => {
        console.error("Failed to fetch system status:", err);
        setSystemStatus("ERROR");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="loading-screen">Memuat SiLAP...</div>;
  }

  return (
    <Router>
      <Routes>
        {/* Installation Routes */}
        {systemStatus === "NEW" && <Route path="*" element={<SetupWizard />} />}
        {systemStatus === "SETUP_REQUIRED" && <Route path="*" element={<RebindWizard />} />}
        {systemStatus === "INSTALLATION_MISMATCH" && <Route path="*" element={<RebindWizard />} />}
        
        {/* Active Routes */}
        {systemStatus === "ACTIVE" && (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard/*" element={<Dashboard />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </>
        )}

        {/* Error Route */}
        {(!systemStatus || systemStatus === "ERROR") && (
          <Route path="*" element={
            <div style={{ padding: '2rem', textAlign: 'center', color: '#1e293b', marginTop: '20vh' }}>
              <h1 style={{ marginBottom: '1rem' }}>Sistem Tidak Dapat Diakses</h1>
              <p style={{ color: '#475569', maxWidth: '500px', margin: '0 auto' }}>
                Gagal terhubung ke server backend. Aplikasi ini membutuhkan server backend untuk berjalan.<br/><br/>
                Pastikan Anda telah <b>menginstal Python</b> dan menjalankan server backend di port 8000.
              </p>
              <button className="btn-primary" onClick={() => window.location.reload()} style={{marginTop: '2rem'}}>Coba Lagi</button>
            </div>
          } />
        )}
      </Routes>
    </Router>
  );
}

export default App;
