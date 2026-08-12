import React from 'react';
import '../leave/Leave.css'; // Reusing dashboard CSS styles

const RegulationDashboard: React.FC = () => {
  return (
    <div className="leave-dashboard">
      <div className="page-header">
        <h2>Pusat Regulasi & Mass Update</h2>
        <div className="header-actions">
          <button className="btn-secondary">Riwayat Mass Update</button>
          <button className="btn-primary">+ Import Aturan Baru</button>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card full-width">
          <h3>Status Regulasi</h3>
          <div className="status-pipeline mt-3">
            <div className="pipeline-step">
              <span className="count">12</span>
              <span className="label">Regulasi Aktif</span>
            </div>
            <div className="pipeline-step">
              <span className="count">2</span>
              <span className="label">Update Pending Approval</span>
            </div>
            <div className="pipeline-step">
              <span className="count text-success">1</span>
              <span className="label">Rollback Available</span>
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <h3>Pembaruan Menunggu Persetujuan</h3>
          <ul className="info-list mt-3">
            <li>
              <div>
                <strong>Tabel Gaji PP 5/2024</strong>
                <p className="text-muted text-sm">Status: PREVIEW_READY</p>
              </div>
              <button className="btn-text">Review</button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RegulationDashboard;
