import React from 'react';
import '../../leave/Leave.css';

const ReminderDashboard: React.FC = () => {
  return (
    <div className="leave-dashboard">
      <div className="page-header">
        <h2>Pusat Reminder Administrasi</h2>
        <div className="header-actions">
          <button className="btn-secondary">Konfigurasi Reminder</button>
          <button className="btn-primary">Refresh Notifikasi</button>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card text-center" style={{ borderTop: "4px solid #b91c1c" }}>
          <h2 style={{ color: "#b91c1c" }}>3</h2>
          <p className="text-muted">Overdue (Terlambat)</p>
        </div>
        <div className="dashboard-card text-center" style={{ borderTop: "4px solid #f59e0b" }}>
          <h2 style={{ color: "#f59e0b" }}>8</h2>
          <p className="text-muted">Jatuh Tempo ≤ 30 Hari</p>
        </div>
        <div className="dashboard-card text-center" style={{ borderTop: "4px solid #0ea5e9" }}>
          <h2>15</h2>
          <p className="text-muted">Akan Datang (31-90 Hari)</p>
        </div>
      </div>

      <div className="dashboard-card mt-4">
        <h3>Daftar Tugas Administratif</h3>
        <ul className="info-list mt-3">
          <li>
            <div>
              <strong><span className="badge danger">GAJI BERKALA</span> Budi Santoso</strong>
              <p className="text-muted text-sm">Terlambat 12 Hari - Segera buat usulan SK KGB</p>
            </div>
            <button className="btn-text">Selesaikan</button>
          </li>
          <li>
            <div>
              <strong><span className="badge warning">TUNJANGAN</span> Ahmad Budi</strong>
              <p className="text-muted text-sm">Peristiwa Kelahiran Anak belum ditindaklanjuti pada gaji</p>
            </div>
            <button className="btn-text">Selesaikan</button>
          </li>
          <li>
            <div>
              <strong><span className="badge default">DOKUMEN</span> Siti Aminah</strong>
              <p className="text-muted text-sm">Dokumen SK Pangkat terakhir belum diunggah</p>
            </div>
            <button className="btn-text">Selesaikan</button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ReminderDashboard;
