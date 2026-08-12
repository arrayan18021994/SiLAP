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
    // In a real app, you would fetch from the API.
    // fetch('http://localhost:8000/api/v1/system/status')
    //   .then(res => res.json())
    //   .then(data => { setSystemStatus(data.status); setLoading(false); })
    
    // For Phase 0 mock, we will just simulate a fetch
    setTimeout(() => {
      setSystemStatus("ACTIVE"); // Mock ACTIVE for UI preview
      setLoading(false);
    }, 500);
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
      </Routes>
    </Router>
  );
}

export default App;
