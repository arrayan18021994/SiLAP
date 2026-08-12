import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Employees.css';

const EmployeeList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [employees, setEmployees] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    nip: '', name: '', status: 'PNS', rank: '', position: '', opd: ''
  });

  const fetchEmployees = async () => {
    try {
      const res = await fetch('/api/v1/employees/');
      if (res.ok) {
        const data = await res.json();
        setEmployees(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  React.useEffect(() => {
    fetchEmployees();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/v1/employees/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setShowModal(false);
        fetchEmployees();
        setFormData({ nip: '', name: '', status: 'PNS', rank: '', position: '', opd: '' });
      } else {
        const error = await res.json();
        alert(error.detail || "Gagal menambah pegawai");
      }
    } catch (e) {
      alert("Error: " + e);
    }
  };

  return (
    <div className="employee-list-container">
      <div className="page-header">
        <h2>Data Pegawai</h2>
        <div className="header-actions">
          <Link to="/dashboard/employees/import" className="btn-secondary">Import Excel</Link>
          <button className="btn-primary" onClick={() => setShowModal(true)}>+ Tambah Pegawai</button>
        </div>
      </div>
      
      <div className="filters-bar">
        <input 
          type="text" 
          placeholder="Cari NIP, Nama, OPD..." 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select className="filter-select">
          <option value="">Semua Status ASN</option>
          <option value="PNS">PNS</option>
          <option value="PPPK">PPPK</option>
        </select>
        <button className="btn-secondary">Filter Lanjutan</button>
      </div>

      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>NIP</th>
              <th>Nama</th>
              <th>Status ASN</th>
              <th>Golongan</th>
              <th>Jabatan</th>
              <th>OPD</th>
              <th>Masa Kerja Resmi</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {employees.map(emp => (
              <tr key={emp.id}>
                <td>{emp.nip}</td>
                <td>{emp.name}</td>
                <td><span className={`badge ${emp.status && emp.status.toLowerCase() === 'pns' ? 'badge-normal' : 'badge-attention'}`}>{emp.status}</span></td>
                <td>{emp.rank}</td>
                <td>{emp.position}</td>
                <td>{emp.opd}</td>
                <td>
                  <span className="text-warning">Belum dihitung</span>
                </td>
                <td>
                  <Link to={`/dashboard/employees/${emp.id}`} className="btn-text">Detail</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="pagination">
        <span>Menampilkan 1-{employees.length} dari {employees.length} data</span>
        <div className="page-controls">
          <button disabled>&lt; Prev</button>
          <button disabled>Next &gt;</button>
        </div>
      </div>

      {/* Add Employee Modal */}
      {showModal && (
        <div className="modal-backdrop" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div className="card" style={{ width: '400px', padding: '1.5rem', background: 'var(--bg-surface)' }}>
            <h3 style={{ marginBottom: '1rem' }}>Tambah Pegawai Baru</h3>
            <form onSubmit={handleAddEmployee}>
              <div className="form-group">
                <label>NIP</label>
                <input type="text" name="nip" value={formData.nip} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Nama Lengkap</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Status ASN</label>
                <select name="status" value={formData.status} onChange={handleInputChange}>
                  <option value="PNS">PNS</option>
                  <option value="PPPK">PPPK</option>
                </select>
              </div>
              <div className="form-group">
                <label>Pangkat / Golongan</label>
                <input type="text" name="rank" value={formData.rank} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label>Jabatan</label>
                <input type="text" name="position" value={formData.position} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label>OPD</label>
                <input type="text" name="opd" value={formData.opd} onChange={handleInputChange} />
              </div>
              <div className="flex gap-4 mt-4" style={{ justifyContent: 'flex-end' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Batal</button>
                <button type="submit" className="btn-primary">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeList;
