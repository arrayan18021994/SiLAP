import React, { useState } from 'react';
import './Employees.css';

interface ServicePeriodTabProps {
  employeeId?: string;
}

const ServicePeriodTab: React.FC<ServicePeriodTabProps> = ({ employeeId }) => {
  const [showForm, setShowForm] = useState(false);

  // Mock data showing the absolute rule: Official vs Estimated
  const officialRecord = {
    total: "09 Tahun 06 Bulan",
    effectiveDate: "01/01/2026",
    source: "SK-001/2026",
    inputMethod: "Excel Import"
  };

  const history = [
    { year: "2024", value: "08 Tahun 00 Bulan", doc: "SK-Lama/2024" },
    { year: "2026", value: "09 Tahun 06 Bulan", doc: "SK-001/2026", notes: "+01 Tahun 06 Bulan" }
  ];

  return (
    <div className="service-period-container">
      {!showForm ? (
        <>
          <div className="sp-header">
            <h3>Data Masa Kerja</h3>
            <div className="sp-actions">
              <button className="btn-secondary">Import Excel</button>
              <button className="btn-primary" onClick={() => setShowForm(true)}>+ Tambah Manual</button>
            </div>
          </div>

          <div className="official-record-card">
            <div className="record-status">
              <span className="badge success">MASA KERJA RESMI</span>
            </div>
            <div className="record-value">{officialRecord.total}</div>
            <div className="record-meta">
              <p><strong>Tanggal Efektif:</strong> {officialRecord.effectiveDate}</p>
              <p><strong>Sumber Dokumen:</strong> {officialRecord.source}</p>
              <p><strong>Metode Input:</strong> {officialRecord.inputMethod}</p>
            </div>
          </div>

          {/* Example of how an estimated record would look if no official record existed */}
          {/* 
          <div className="official-record-card estimated">
            <div className="record-status">
              <span className="badge warning">ESTIMASI — BUKAN DATA RESMI</span>
            </div>
            <div className="record-value text-warning">08 Tahun 04 Bulan</div>
            <p className="text-muted mt-2">Berdasarkan TMT PNS: 01/04/2018</p>
          </div>
          */}

          <div className="sp-history">
            <h4>Riwayat Perubahan Masa Kerja</h4>
            <table className="data-table mt-3">
              <thead>
                <tr>
                  <th>Tahun</th>
                  <th>Masa Kerja Total</th>
                  <th>Keterangan / Koreksi</th>
                  <th>Sumber Dokumen</th>
                </tr>
              </thead>
              <tbody>
                {history.map((h, i) => (
                  <tr key={i}>
                    <td>{h.year}</td>
                    <td><strong>{h.value}</strong></td>
                    <td>{h.notes || '-'}</td>
                    <td><a href="#" className="text-link">{h.doc}</a></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="sp-form">
          <h3>Tambah / Koreksi Masa Kerja Manual</h3>
          <p className="text-muted mb-4">Input ini akan menjadi sumber data Masa Kerja resmi terbaru (tidak menimpa histori lama).</p>
          
          <div className="form-row">
            <div className="form-group half">
              <label>Masa Kerja Awal (Tahun)</label>
              <input type="number" min="0" placeholder="0" />
            </div>
            <div className="form-group half">
              <label>Masa Kerja Awal (Bulan)</label>
              <input type="number" min="0" max="11" placeholder="0" />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group half">
              <label>Penambahan / Koreksi (Tahun)</label>
              <input type="number" placeholder="0" />
            </div>
            <div className="form-group half">
              <label>Penambahan / Koreksi (Bulan)</label>
              <input type="number" placeholder="0" />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group half">
              <label>Tanggal Efektif</label>
              <input type="date" />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group half">
              <label>Nomor Dokumen (SK)</label>
              <input type="text" placeholder="Nomor SK" />
            </div>
            <div className="form-group half">
              <label>Tanggal Dokumen</label>
              <input type="date" />
            </div>
          </div>

          <div className="form-group">
            <label>Upload Dokumen Pendukung (PDF)</label>
            <input type="file" accept=".pdf" />
          </div>

          <div className="form-group">
            <label>Keterangan</label>
            <textarea rows={3} placeholder="Keterangan penambahan/koreksi..."></textarea>
          </div>

          <div className="button-group mt-4">
            <button className="btn-secondary" onClick={() => setShowForm(false)}>Batal</button>
            <button className="btn-primary" onClick={() => setShowForm(false)}>Simpan Masa Kerja</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicePeriodTab;
