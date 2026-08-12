import React from 'react';
import '../../leave/Leave.css';

const PeriodicSalaryDashboard: React.FC = () => {
  return (
    <div className="leave-dashboard">
      <div className="page-header">
        <h2>Dashboard Gaji Berkala (KGB)</h2>
        <div className="header-actions">
          <button className="btn-secondary">Export Laporan</button>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card text-center" style={{ borderTop: "4px solid #b91c1c" }}>
          <h2 style={{ color: "#b91c1c" }}>1</h2>
          <p className="text-muted">Jatuh Tempo Hari Ini</p>
        </div>
        <div className="dashboard-card text-center" style={{ borderTop: "4px solid #f59e0b" }}>
          <h2 style={{ color: "#f59e0b" }}>8</h2>
          <p className="text-muted">Jatuh Tempo ≤ 30 Hari</p>
        </div>
        <div className="dashboard-card text-center" style={{ borderTop: "4px solid #0ea5e9" }}>
          <h2>12</h2>
          <p className="text-muted">Jatuh Tempo 31-60 Hari</p>
        </div>
        <div className="dashboard-card text-center" style={{ borderTop: "4px solid var(--text-main)" }}>
          <h2>43</h2>
          <p className="text-muted">{'> 90 Hari'}</p>
        </div>
      </div>

      <div className="dashboard-card mt-4">
        <h3>Daftar Pegawai Memasuki Periode KGB</h3>
        <table className="table mt-3">
          <thead>
            <tr>
              <th>NIP</th>
              <th>Nama Pegawai</th>
              <th>KGB Terakhir</th>
              <th>Proyeksi KGB Berikutnya</th>
              <th>Status Administrasi</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>198501012010011001</td>
              <td>Ahmad Budi</td>
              <td>01/04/2025</td>
              <td><strong>01/04/2027</strong></td>
              <td><span className="badge warning">PROCESSING</span></td>
              <td><button className="btn-text">Detail</button></td>
            </tr>
            <tr>
              <td>199002022015022002</td>
              <td>Siti Aminah</td>
              <td>01/10/2025</td>
              <td><strong>01/10/2027</strong></td>
              <td><span className="badge default">DRAFT</span></td>
              <td><button className="btn-text">Detail</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PeriodicSalaryDashboard;
