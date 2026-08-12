import React from 'react';

const EmployeeFamilyTab: React.FC = () => {
  return (
    <div className="employee-family-tab">
      <div className="sp-header">
        <h3>Data Keluarga & Tunjangan</h3>
        <button className="btn-primary">+ Tambah Anggota Keluarga</button>
      </div>

      <div className="dashboard-card mt-4">
        <h4>Status Tunjangan Keluarga</h4>
        <div className="balance-row mt-3">
          <span className="text-muted">Pasangan Tertunjang</span>
          <strong>1 (Siti Aminah)</strong>
        </div>
        <div className="balance-row">
          <span className="text-muted">Anak Tertunjang</span>
          <strong>2 Anak</strong>
        </div>
        <div className="badge success mt-3">STATUS: SESUAI</div>
      </div>

      <div className="mt-4">
        <h4>Daftar Anggota Keluarga</h4>
        <table className="table mt-2">
          <thead>
            <tr>
              <th>Nama</th>
              <th>Hubungan</th>
              <th>Lahir</th>
              <th>Status</th>
              <th>Tunjangan</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Siti Aminah</td>
              <td>Istri</td>
              <td>12/04/1990</td>
              <td><span className="badge success">AKTIF</span></td>
              <td><span className="badge success">AKTIF</span></td>
            </tr>
            <tr>
              <td>Budi Junior</td>
              <td>Anak Kandung</td>
              <td>10/01/2018</td>
              <td><span className="badge success">AKTIF</span></td>
              <td><span className="badge success">AKTIF</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeFamilyTab;
