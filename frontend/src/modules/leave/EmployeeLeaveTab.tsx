import React from 'react';

const EmployeeLeaveTab: React.FC = () => {
  return (
    <div className="employee-leave-tab">
      <div className="sp-header">
        <h3>Saldo Cuti</h3>
        <div className="sp-actions">
          <button className="btn-secondary">Riwayat Kalkulasi</button>
          <button className="btn-primary">+ Pengajuan Cuti</button>
        </div>
      </div>

      <div className="dashboard-grid mb-4">
        <div className="dashboard-card">
          <h3>CUTI TAHUNAN (2026)</h3>
          <div className="balance-grid mt-3">
            <div className="balance-row">
              <span className="text-muted">Hak Tahun Berjalan</span>
              <strong>12</strong>
            </div>
            <div className="balance-row">
              <span className="text-muted">Carry Forward</span>
              <strong>5</strong>
            </div>
            <hr className="my-2" />
            <div className="balance-row">
              <span className="text-muted">Total Tersedia</span>
              <strong className="text-success">17</strong>
            </div>
            <div className="balance-row">
              <span className="text-muted">Telah Digunakan</span>
              <strong>3</strong>
            </div>
            <div className="balance-row">
              <span className="text-muted">Penyesuaian (Adj)</span>
              <strong>0</strong>
            </div>
            <hr className="my-2" />
            <div className="balance-row highlight">
              <span>SISA CUTI</span>
              <span className="val-large text-primary">14</span>
            </div>
          </div>
        </div>
        
        <div className="dashboard-card">
          <h3>CUTI BESAR (2026)</h3>
          <div className="mt-3">
            <p className="text-muted">Status Aturan:</p>
            <div className="badge warning mt-1">BELUM MEMENUHI SYARAT MASA KERJA</div>
            <p className="text-sm mt-3 text-muted">Syarat: 5 Tahun. Masa Kerja Resmi: 4 Tahun 2 Bulan.</p>
          </div>
        </div>

        <div className="dashboard-card">
          <h3>CUTI SAKIT</h3>
          <div className="mt-3">
            <p className="text-muted">Data hak belum dihitung karena rule tidak membutuhkan saldo pra-alokasi tahunan (Fixed by transaction).</p>
          </div>
        </div>
      </div>

      <div className="sp-history mt-4">
        <h4>Riwayat Transaksi Cuti</h4>
        <table className="data-table mt-3">
          <thead>
            <tr>
              <th>Nomor Pengajuan</th>
              <th>Jenis Cuti</th>
              <th>Tanggal</th>
              <th>Jumlah Hari</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><a href="#" className="text-link">CT-2026-001</a></td>
              <td>Cuti Tahunan</td>
              <td>01/02/2026 - 03/02/2026</td>
              <td>3 Hari</td>
              <td><span className="badge success">COMPLETED</span></td>
              <td><button className="btn-text">Detail</button></td>
            </tr>
            <tr>
              <td><a href="#" className="text-link">CT-2026-045</a></td>
              <td>Cuti Tahunan</td>
              <td>12/08/2026 - 14/08/2026</td>
              <td>3 Hari</td>
              <td><span className="badge warning">SUBMITTED</span></td>
              <td><button className="btn-text">Detail</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeLeaveTab;
