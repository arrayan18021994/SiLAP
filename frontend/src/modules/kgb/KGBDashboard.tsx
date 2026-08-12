import React from 'react';
import '../leave/Leave.css'; // Reusing dashboard CSS styles

const KGBDashboard: React.FC = () => {
  return (
    <div className="leave-dashboard">
      <div className="page-header">
        <h2>Dashboard Kenaikan Gaji Berkala (KGB)</h2>
        <div className="header-actions">
          <button className="btn-secondary">Konfigurasi Aturan & Gaji</button>
          <button className="btn-primary">Import KGB</button>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Monitoring Metrics */}
        <div className="dashboard-card full-width">
          <h3>Monitoring KGB</h3>
          <div className="status-pipeline mt-3">
            <div className="pipeline-step">
              <span className="count">42</span>
              <span className="label">KGB 0-30 Hari</span>
            </div>
            <div className="pipeline-step">
              <span className="count">56</span>
              <span className="label">KGB 31-60 Hari</span>
            </div>
            <div className="pipeline-step">
              <span className="count text-warning">8</span>
              <span className="label">Pending Verification</span>
            </div>
            <div className="pipeline-step">
              <span className="count text-danger" style={{ color: "#b91c1c" }}>3</span>
              <span className="label">Jatuh Tempo (Overdue)</span>
            </div>
          </div>
        </div>

        {/* Actionable Lists */}
        <div className="dashboard-card">
          <h3>Akan Jatuh Tempo (Bulan Ini)</h3>
          <ul className="info-list mt-3">
            <li>
              <div>
                <strong>Ahmad Budi</strong>
                <p className="text-muted text-sm">Proyeksi: 01 Apr 2026</p>
              </div>
              <button className="btn-text">Proses</button>
            </li>
            <li>
              <div>
                <strong>Siti Aminah</strong>
                <p className="text-muted text-sm">Proyeksi: 05 Apr 2026</p>
              </div>
              <button className="btn-text">Proses</button>
            </li>
          </ul>
        </div>

        <div className="dashboard-card">
          <h3>KGB Jatuh Tempo</h3>
          <ul className="info-list mt-3">
            <li>
              <div>
                <strong>Budi Santoso</strong>
                <p className="text-muted text-sm">Jatuh Tempo: 01 Feb 2026</p>
              </div>
              <span className="badge danger">Overdue</span>
            </li>
          </ul>
        </div>

        <div className="dashboard-card">
          <h3>Alerts & Peringatan</h3>
          <ul className="info-list mt-3">
            <li>
              <div>
                <strong>Tabel Gaji 2024</strong>
                <p className="text-muted text-sm">Membutuhkan peninjauan ulang terkait PP No 5/2024</p>
              </div>
            </li>
            <li>
              <div>
                <strong>Data Masa Kerja</strong>
                <p className="text-muted text-sm">12 Pegawai memiliki data MKG tidak sinkron</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default KGBDashboard;
