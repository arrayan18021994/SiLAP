import React from 'react';
import './Leave.css';

const LeaveDashboard: React.FC = () => {
  return (
    <div className="leave-dashboard">
      <div className="page-header">
        <h2>Dashboard Cuti</h2>
        <div className="header-actions">
          <button className="btn-secondary">Konfigurasi Aturan</button>
          <button className="btn-primary">+ Pengajuan Cuti</button>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Status Pipeline */}
        <div className="dashboard-card full-width">
          <h3>Status Pengajuan</h3>
          <div className="status-pipeline mt-3">
            <div className="pipeline-step">
              <span className="count">8</span>
              <span className="label">Draft</span>
            </div>
            <div className="pipeline-step">
              <span className="count text-warning">5</span>
              <span className="label">Diajukan (Menunggu)</span>
            </div>
            <div className="pipeline-step">
              <span className="count text-success">12</span>
              <span className="label">Disetujui</span>
            </div>
            <div className="pipeline-step">
              <span className="count">25</span>
              <span className="label">Selesai</span>
            </div>
          </div>
        </div>

        {/* Monitoring Cards */}
        <div className="dashboard-card">
          <h3>Cuti Sedang Berlangsung</h3>
          <ul className="info-list mt-3">
            <li>
              <div>
                <strong>Ahmad Budi</strong>
                <p className="text-muted text-sm">Cuti Tahunan (3 Hari)</p>
              </div>
              <span className="badge default">12 - 14 Ags</span>
            </li>
            <li>
              <div>
                <strong>Siti Aminah</strong>
                <p className="text-muted text-sm">Cuti Melahirkan (90 Hari)</p>
              </div>
              <span className="badge default">01 Jul - 30 Sep</span>
            </li>
          </ul>
        </div>

        <div className="dashboard-card">
          <h3>Cuti Mendatang</h3>
          <p className="text-muted text-sm mt-3">Tidak ada cuti yang dijadwalkan dalam 7 hari ke depan.</p>
        </div>

        <div className="dashboard-card">
          <h3>Saldo Cuti Rendah</h3>
          <ul className="info-list mt-3">
            <li>
              <div>
                <strong>Budi Santoso</strong>
                <p className="text-muted text-sm">Cuti Tahunan</p>
              </div>
              <span className="badge danger">Sisa: 1 Hari</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LeaveDashboard;
