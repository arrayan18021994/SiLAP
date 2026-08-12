import React from 'react';

const AdministrativeList: React.FC = () => {
  return (
    <div className="employee-family-tab">
      <div className="sp-header">
        <h3>Rekam Jejak Administrasi Pegawai</h3>
        <button className="btn-primary">+ Usulan Baru</button>
      </div>

      <div className="mt-4">
        <table className="table">
          <thead>
            <tr>
              <th>Nomor Usulan / SK</th>
              <th>Jenis Layanan</th>
              <th>Tanggal</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>800/123/2026</td>
              <td><span className="badge warning">GAJI BERKALA</span></td>
              <td>15/02/2026</td>
              <td><span className="badge success">COMPLETED</span></td>
              <td><button className="btn-text">Lihat Dokumen</button></td>
            </tr>
            <tr>
              <td>800/456/2026</td>
              <td><span className="badge default">MUTASI</span></td>
              <td>20/05/2026</td>
              <td><span className="badge warning">PROCESSING</span></td>
              <td><button className="btn-text">Lihat Dokumen</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdministrativeList;
