import React, { useState } from 'react';
import DateInput from '../../components/DateInput';
import ConfirmModal from '../../components/ConfirmModal';
import './Employees.css';

interface ServicePeriodTabProps {
  employeeId?: string;
}

const initialForm = {
  baseYears: '0',
  baseMonths: '0',
  adjYears: '0',
  adjMonths: '0',
  effectiveDate: '',
  skNumber: '',
  skDate: '',
  notes: ''
};

const ServicePeriodTab: React.FC<ServicePeriodTabProps> = ({ employeeId: _employeeId }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(initialForm);

  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

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

  const isFormDirty = () => {
    return JSON.stringify(formData) !== JSON.stringify(initialForm);
  };

  const handleInputChange = (e: { target: { name: string; value: string } } | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSaveConfirm(true);
  };

  const handleConfirmSave = () => {
    setShowSaveConfirm(false);
    setShowForm(false);
    setFormData(initialForm);
    alert("Data masa kerja berhasil disimpan!");
  };

  const handleRequestCancel = () => {
    if (isFormDirty()) {
      setShowCancelConfirm(true);
    } else {
      setShowForm(false);
      setFormData(initialForm);
    }
  };

  const handleConfirmCancel = () => {
    setShowCancelConfirm(false);
    setShowForm(false);
    setFormData(initialForm);
  };

  return (
    <div className="service-period-container">
      {!showForm ? (
        <>
          <div className="sp-header">
            <h3>Data Masa Kerja</h3>
            <div className="sp-actions">
              <button className="btn-secondary">Import Excel</button>
              <button className="btn-primary" onClick={() => { setFormData(initialForm); setShowForm(true); }}>+ Tambah Manual</button>
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
          
          <form onSubmit={handleSubmit}>
            <div className="form-row" style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
              <div className="form-group half" style={{ flex: 1 }}>
                <label>Masa Kerja Awal (Tahun)</label>
                <input type="number" name="baseYears" min="0" value={formData.baseYears} onChange={handleInputChange} placeholder="0" />
              </div>
              <div className="form-group half" style={{ flex: 1 }}>
                <label>Masa Kerja Awal (Bulan)</label>
                <input type="number" name="baseMonths" min="0" max="11" value={formData.baseMonths} onChange={handleInputChange} placeholder="0" />
              </div>
            </div>

            <div className="form-row" style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
              <div className="form-group half" style={{ flex: 1 }}>
                <label>Penambahan / Koreksi (Tahun)</label>
                <input type="number" name="adjYears" value={formData.adjYears} onChange={handleInputChange} placeholder="0" />
              </div>
              <div className="form-group half" style={{ flex: 1 }}>
                <label>Penambahan / Koreksi (Bulan)</label>
                <input type="number" name="adjMonths" value={formData.adjMonths} onChange={handleInputChange} placeholder="0" />
              </div>
            </div>

            <div className="form-row" style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
              <div className="form-group half" style={{ flex: 1 }}>
                <label>Tanggal Efektif</label>
                <DateInput name="effectiveDate" value={formData.effectiveDate} onChange={handleInputChange} placeholder="dd/mm/yyyy" />
              </div>
            </div>

            <div className="form-row" style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
              <div className="form-group half" style={{ flex: 1 }}>
                <label>Nomor Dokumen (SK)</label>
                <input type="text" name="skNumber" value={formData.skNumber} onChange={handleInputChange} placeholder="Nomor SK" />
              </div>
              <div className="form-group half" style={{ flex: 1 }}>
                <label>Tanggal Dokumen</label>
                <DateInput name="skDate" value={formData.skDate} onChange={handleInputChange} placeholder="dd/mm/yyyy" />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label>Upload Dokumen Pendukung (PDF)</label>
              <input type="file" accept=".pdf" />
            </div>

            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label>Keterangan</label>
              <textarea rows={3} name="notes" value={formData.notes} onChange={handleInputChange} placeholder="Keterangan penambahan/koreksi..."></textarea>
            </div>

            <div className="button-group mt-4" style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button type="button" className="btn-secondary" onClick={handleRequestCancel}>Batal</button>
              <button type="submit" className="btn-primary">Simpan Masa Kerja</button>
            </div>
          </form>
        </div>
      )}

      {/* Confirmation Modals */}
      <ConfirmModal
        isOpen={showSaveConfirm}
        title="Konfirmasi Simpan Data"
        message="Apakah Anda yakin ingin menyimpan perubahan data masa kerja ini?"
        confirmText="Ya, Simpan"
        cancelText="Batal"
        variant="primary"
        onConfirm={handleConfirmSave}
        onCancel={() => setShowSaveConfirm(false)}
      />

      <ConfirmModal
        isOpen={showCancelConfirm}
        title="Konfirmasi Batal"
        message="Ada perubahan data yang belum disimpan. Apakah Anda yakin ingin membatalkan?"
        confirmText="Ya, Batalkan"
        cancelText="Kembali ke Form"
        variant="warning"
        onConfirm={handleConfirmCancel}
        onCancel={() => setShowCancelConfirm(false)}
      />
    </div>
  );
};

export default ServicePeriodTab;
