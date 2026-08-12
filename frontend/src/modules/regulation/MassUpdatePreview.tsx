import React from 'react';
import '../leave/Leave.css';

const MassUpdatePreview: React.FC = () => {
  return (
    <div className="leave-dashboard">
      <div className="page-header">
        <h2>PREVIEW: REGULATION UPDATE</h2>
        <div className="header-actions">
          <button className="btn-secondary">Kembali</button>
          <button className="btn-primary" style={{ background: "var(--text-main)", color: "white" }}>Approve & Execute</button>
        </div>
      </div>

      <div className="dashboard-card mb-4" style={{ borderLeft: "4px solid #0ea5e9" }}>
        <h3>Informasi Pembaruan</h3>
        <div className="mt-3">
          <div className="balance-row"><span className="text-muted">Modul</span><strong>SALARY</strong></div>
          <div className="balance-row"><span className="text-muted">Regulasi</span><strong>PP No. 5 Tahun 2024</strong></div>
          <div className="balance-row"><span className="text-muted">Berlaku (Effective)</span><strong>01/01/2024</strong></div>
        </div>
      </div>

      <div className="dashboard-grid mb-4">
        <div className="dashboard-card text-center">
          <h2>17</h2>
          <p className="text-muted">Pegawai Terdampak</p>
        </div>
        <div className="dashboard-card text-center">
          <h2>17</h2>
          <p className="text-muted">Proyeksi KGB Disesuaikan</p>
        </div>
        <div className="dashboard-card text-center" style={{ borderTop: "4px solid var(--text-main)" }}>
          <h2>0</h2>
          <p className="text-muted">Riwayat KGB Berubah (Historical Protection)</p>
        </div>
      </div>

      <div className="dashboard-card">
        <h3>Detail Perubahan (Diff)</h3>
        <table className="table mt-3">
          <thead>
            <tr>
              <th>Entitas</th>
              <th>Nama</th>
              <th>Nilai Lama</th>
              <th>Nilai Baru</th>
              <th>Dampak</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Proyeksi KGB</td>
              <td>Ahmad Budi</td>
              <td>Rp 3.500.000</td>
              <td className="text-success">Rp 3.750.000</td>
              <td><span className="badge warning">RECALCULATE</span></td>
            </tr>
            <tr>
              <td>Proyeksi KGB</td>
              <td>Siti Aminah</td>
              <td>Rp 2.900.000</td>
              <td className="text-success">Rp 3.100.000</td>
              <td><span className="badge warning">RECALCULATE</span></td>
            </tr>
            <tr>
              <td>KGB Resmi 2023</td>
              <td>Ahmad Budi</td>
              <td>Rp 3.250.000</td>
              <td className="text-muted">Rp 3.250.000</td>
              <td><span className="badge default">NO CHANGE</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MassUpdatePreview;
