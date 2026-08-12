import React from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import EmployeeList from '../employees/EmployeeList';
import EmployeeProfile from '../employees/EmployeeProfile';
import ImportWizard from '../imports/ImportWizard';
import LeaveDashboard from '../leave/LeaveDashboard';
import KGBDashboard from '../kgb/KGBDashboard';
import RegulationDashboard from '../regulation/RegulationDashboard';
import ReminderDashboard from '../personnel/reminders/ReminderDashboard';
import PeriodicSalaryDashboard from '../personnel/salary/PeriodicSalaryDashboard';
import SystemSettings from '../settings/SystemSettings';
import './Dashboard.css';

const DashboardHome = () => (
  <div className="dashboard-content">
    <div className="dashboard-header">
      <h2>Selamat Datang</h2>
      <p>Administrasi Kepegawaian</p>
    </div>
    
    <div className="dashboard-stats">
      <div className="stat-card">
        <div className="stat-icon">👥</div>
        <div className="stat-info">
          <h3>Pegawai</h3>
          <p className="stat-value">438</p>
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-icon">💰</div>
        <div className="stat-info">
          <h3>KGB Mendatang</h3>
          <p className="stat-value">12</p>
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-icon">📅</div>
        <div className="stat-info">
          <h3>Cuti Aktif</h3>
          <p className="stat-value">27</p>
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-icon">🔔</div>
        <div className="stat-info">
          <h3>Reminder Aktif</h3>
          <p className="stat-value">18</p>
        </div>
      </div>
    </div>

    <div className="dashboard-header mt-4">
      <h3 style={{ fontSize: '14px', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Pegawai yang perlu ditindaklanjuti</h3>
    </div>
    
    <div className="attention-section">
      <div className="attention-list">
        <div className="attention-item">
          <div className="attention-indicator indicator-red"></div>
          <div className="attention-text">
            <span className="attention-count">4</span> Gaji Berkala sudah jatuh tempo
          </div>
          <button className="btn-text">Lihat</button>
        </div>
        <div className="attention-item">
          <div className="attention-indicator indicator-orange"></div>
          <div className="attention-text">
            <span className="attention-count">7</span> KGB ≤ 30 hari
          </div>
          <button className="btn-text">Lihat</button>
        </div>
        <div className="attention-item">
          <div className="attention-indicator indicator-yellow"></div>
          <div className="attention-text">
            <span className="attention-count">8</span> Dokumen administrasi perlu diperbarui
          </div>
          <button className="btn-text">Lihat</button>
        </div>
        <div className="attention-item">
          <div className="attention-indicator indicator-blue"></div>
          <div className="attention-text">
            <span className="attention-count">3</span> Perubahan data keluarga belum ditindaklanjuti
          </div>
          <button className="btn-text">Lihat</button>
        </div>
      </div>
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarCollapsed, setSidebarCollapsed] = React.useState(false);

  const toggleTheme = () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    document.documentElement.setAttribute('data-theme', currentTheme === 'dark' ? 'light' : 'dark');
  };

  // Set default theme to dark when component mounts
  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
  }, []);

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="dashboard-layout">
      {/* Top Navigation Bar */}
      <header className="topbar">
        <div className="topbar-left">
          <div className="topbar-brand">
            <div className="topbar-brand-logo">
              <img src="/assets/silap_logo.png" alt="Logo" style={{ height: '24px', filter: 'brightness(0) invert(0)' }} />
            </div>
            <span>GOVERNMENT</span>
          </div>
          <button className="sidebar-toggle" onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}>
            ☰
          </button>
          <div className="topbar-search">
            <span className="search-icon">🔍</span>
            <input type="text" placeholder="Cari pegawai, NIP, dokumen..." />
            <span className="search-shortcut">Ctrl+K</span>
          </div>
        </div>
        <div className="topbar-right">
          <span className="topbar-icon" title="Toggle Theme" onClick={toggleTheme}>🌓</span>
          <span className="topbar-icon" title="Notifications">🔔</span>
          <div className="topbar-profile" onClick={handleLogout} title="Logout">
            <div className="profile-avatar">A</div>
            <span>Admin</span>
          </div>
        </div>
      </header>

      <div className="dashboard-body">
        {/* Collapsible Sidebar */}
        <aside className={`sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
          <nav className="sidebar-nav">
            <Link to="/dashboard" className={`nav-item ${location.pathname === '/dashboard' ? 'active' : ''}`}>
              <span className="nav-icon">📊</span>
              <span>Dashboard</span>
            </Link>
            
            <div className="nav-section">Pegawai</div>
            <Link to="/dashboard/employees" className={`nav-item ${location.pathname.includes('/employees') ? 'active' : ''}`}>
              <span className="nav-icon">👥</span>
              <span>Pegawai</span>
            </Link>
            <Link to="/dashboard/kgb" className={`nav-item ${location.pathname.includes('/kgb') ? 'active' : ''}`}>
              <span className="nav-icon">💰</span>
              <span>KGB</span>
            </Link>
            <Link to="/dashboard/leave" className={`nav-item ${location.pathname.includes('/leave') ? 'active' : ''}`}>
              <span className="nav-icon">📅</span>
              <span>Cuti</span>
            </Link>
            <Link to="/dashboard/gaji-berkala" className={`nav-item ${location.pathname.includes('/gaji-berkala') ? 'active' : ''}`}>
              <span className="nav-icon">💵</span>
              <span>Gaji Berkala</span>
            </Link>
            <Link to="/dashboard/reminders" className={`nav-item ${location.pathname.includes('/reminders') ? 'active' : ''}`}>
              <span className="nav-icon">🔔</span>
              <span>Reminder</span>
            </Link>
            
            <div className="nav-section">Sistem</div>
            <Link to="/dashboard/regulations" className={`nav-item ${location.pathname.includes('/regulations') ? 'active' : ''}`}>
              <span className="nav-icon">⚖</span>
              <span>Regulasi</span>
            </Link>
            <Link to="/dashboard/settings" className={`nav-item ${location.pathname.includes('/settings') ? 'active' : ''}`}>
              <span className="nav-icon">⚙</span>
              <span>Pengaturan</span>
            </Link>
          </nav>
        </aside>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<DashboardHome />} />
            <Route path="/employees" element={<EmployeeList />} />
            <Route path="/employees/import" element={<ImportWizard />} />
            <Route path="/employees/:id" element={<EmployeeProfile />} />
            <Route path="/leave" element={<LeaveDashboard />} />
            <Route path="/kgb" element={<KGBDashboard />} />
            <Route path="/gaji-berkala" element={<PeriodicSalaryDashboard />} />
            <Route path="/reminders" element={<ReminderDashboard />} />
            <Route path="/regulations" element={<RegulationDashboard />} />
            <Route path="/settings" element={<SystemSettings />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
