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
    inputMethod: "Impor Excel"
  };

  const history = [
    { year: "2024", value: "08 Tahun 00 Bulan", doc: "SK-Lama/2024", notes: "Penetapan Awal", status: "SELESAI" },
    { year: "2026", value: "09 Tahun 06 Bulan", doc: "SK-001/2026", notes: "+01 Tahun 06 Bulan", status: "DISETUJUI" }
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
    <div className="service-period-container" style={{ fontSize: '0.85rem' }}>
      {!showForm ? (
        <>
          <div className="sp-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.05rem', color: 'var(--text-main)', fontWeight: 600 }}>Data Masa Kerja Pegawai</h3>
              <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Perhitungan resmi masa kerja akumulatif dan riwayat penyesuaian/koreksi.
              </p>
            </div>
            <div className="sp-actions" style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', fontWeight: 500 }}>Impor Excel</button>
              <button className="btn-primary" onClick={() => { setFormData(initialForm); setShowForm(true); }} style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', fontWeight: 500 }}>+ Tambah Manual</button>
            </div>
          </div>

          <div className="card mb-3" style={{ padding: '0.65rem 0.85rem', background: '#f8fafc', borderLeft: '4px solid #10b981', marginBottom: '0.65rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>MASA KERJA RESMI TERAKHIR</span>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#10b981', marginTop: '2px' }}>{officialRecord.total}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  TMT Efektif: {officialRecord.effectiveDate} • Sumber: {officialRecord.source} ({officialRecord.inputMethod})
                </div>
              </div>
              <span className="badge success" style={{ background: '#dcfce7', color: '#166534', padding: '3px 8px', fontSize: '0.75rem', fontWeight: 500 }}>
                DISETUJUI
              </span>
            </div>
          </div>

          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '0.5rem 0.85rem', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-surface-hover)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4 style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-main)', fontWeight: 600 }}>Riwayat Perubahan Masa Kerja</h4>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total: {history.length} Riwayat</span>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table className="table" style={{ width: '100%', fontSize: '0.78rem' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', textAlign: 'center' }}>
                    <th style={{ padding: '0.35rem 0.6rem', textAlign: 'center' }}>TAHUN</th>
                    <th style={{ padding: '0.35rem 0.6rem', textAlign: 'center' }}>MASA KERJA TOTAL</th>
                    <th style={{ padding: '0.35rem 0.6rem', textAlign: 'left' }}>KETERANGAN / KOREKSI</th>
                    <th style={{ padding: '0.35rem 0.6rem', textAlign: 'center' }}>SUMBER DOKUMEN</th>
                    <th style={{ padding: '0.35rem 0.6rem', textAlign: 'center' }}>STATUS</th>
                    <th style={{ padding: '0.35rem 0.6rem', textAlign: 'center' }}>AKSI</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((h, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '0.35rem 0.6rem', textAlign: 'center', fontWeight: 400 }}>{h.year}</td>
                      <td style={{ padding: '0.35rem 0.6rem', textAlign: 'center', fontWeight: 500, color: 'var(--text-main)' }}>{h.value}</td>
                      <td style={{ padding: '0.35rem 0.6rem', textAlign: 'left', fontWeight: 400 }}>{h.notes || '-'}</td>
                      <td style={{ padding: '0.35rem 0.6rem', textAlign: 'center', fontWeight: 400 }}>{h.doc}</td>
                      <td style={{ padding: '0.35rem 0.6rem', textAlign: 'center' }}>
                        <span className="badge success" style={{ background: '#dcfce7', color: '#166534', padding: '2px 6px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 500 }}>
                          {h.status}
                        </span>
                      </td>
                      <td style={{ padding: '0.35rem 0.6rem', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'center' }}>
                          <button className="btn-action-icon edit" title="Edit Masa Kerja" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem' }}>✏️</button>
                          <button className="btn-action-icon delete" title="Hapus Masa Kerja" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem' }}>🗑️</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div className="sp-form card" style={{ padding: '1.25rem' }}>
          <h3 style={{ fontSize: '1rem', color: '#1e3a8a', marginBottom: '0.4rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.4rem', fontWeight: 600 }}>
            Tambah / Koreksi Masa Kerja Manual
          </h3>
          <p className="text-muted mb-3" style={{ fontSize: '0.78rem' }}>Input ini akan menjadi sumber data Masa Kerja resmi terbaru (tidak menimpa histori lama).</p>
          
          <form onSubmit={handleSubmit}>
            <div className="form-row" style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.65rem' }}>
              <div className="form-group half" style={{ flex: 1 }}>
                <label style={{ fontSize: '0.76rem', fontWeight: 600 }}>Masa Kerja Awal (Tahun)</label>
                <input type="number" name="baseYears" min="0" value={formData.baseYears} onChange={handleInputChange} placeholder="0" style={{ fontSize: '0.8rem', padding: '0.35rem 0.5rem' }} />
              </div>
              <div className="form-group half" style={{ flex: 1 }}>
                <label style={{ fontSize: '0.76rem', fontWeight: 600 }}>Masa Kerja Awal (Bulan)</label>
                <input type="number" name="baseMonths" min="0" max="11" value={formData.baseMonths} onChange={handleInputChange} placeholder="0" style={{ fontSize: '0.8rem', padding: '0.35rem 0.5rem' }} />
              </div>
            </div>

            <div className="form-row" style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.65rem' }}>
              <div className="form-group half" style={{ flex: 1 }}>
                <label style={{ fontSize: '0.76rem', fontWeight: 600 }}>Penambahan / Koreksi (Tahun)</label>
                <input type="number" name="adjYears" value={formData.adjYears} onChange={handleInputChange} placeholder="0" style={{ fontSize: '0.8rem', padding: '0.35rem 0.5rem' }} />
              </div>
              <div className="form-group half" style={{ flex: 1 }}>
                <label style={{ fontSize: '0.76rem', fontWeight: 600 }}>Penambahan / Koreksi (Bulan)</label>
                <input type="number" name="adjMonths" value={formData.adjMonths} onChange={handleInputChange} placeholder="0" style={{ fontSize: '0.8rem', padding: '0.35rem 0.5rem' }} />
              </div>
            </div>

            <div className="form-row" style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.65rem' }}>
              <div className="form-group half" style={{ flex: 1 }}>
                <label style={{ fontSize: '0.76rem', fontWeight: 600 }}>Tanggal Efektif</label>
                <DateInput name="effectiveDate" value={formData.effectiveDate} onChange={handleInputChange} placeholder="dd/mm/yyyy" />
              </div>
            </div>

            <div className="form-row" style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.65rem' }}>
              <div className="form-group half" style={{ flex: 1 }}>
                <label style={{ fontSize: '0.76rem', fontWeight: 600 }}>Nomor Dokumen (SK)</label>
                <input type="text" name="skNumber" value={formData.skNumber} onChange={handleInputChange} placeholder="Nomor SK" style={{ fontSize: '0.8rem', padding: '0.35rem 0.5rem' }} />
              </div>
              <div className="form-group half" style={{ flex: 1 }}>
                <label style={{ fontSize: '0.76rem', fontWeight: 600 }}>Tanggal Dokumen</label>
                <DateInput name="skDate" value={formData.skDate} onChange={handleInputChange} placeholder="dd/mm/yyyy" />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '0.65rem' }}>
              <label style={{ fontSize: '0.76rem', fontWeight: 600 }}>Upload Dokumen Pendukung (PDF)</label>
              <input type="file" accept=".pdf" style={{ fontSize: '0.78rem' }} />
            </div>

            <div className="form-group" style={{ marginBottom: '0.65rem' }}>
              <label style={{ fontSize: '0.76rem', fontWeight: 600 }}>Keterangan</label>
              <textarea rows={2} name="notes" value={formData.notes} onChange={handleInputChange} placeholder="Keterangan penambahan/koreksi..." style={{ fontSize: '0.8rem', padding: '0.35rem 0.5rem' }}></textarea>
            </div>

            <div className="button-group mt-3" style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
              <button type="button" className="btn-secondary" onClick={handleRequestCancel} style={{ fontSize: '0.78rem', padding: '0.3rem 0.6rem' }}>Batal</button>
              <button type="submit" className="btn-primary" style={{ fontSize: '0.78rem', padding: '0.3rem 0.6rem' }}>Simpan Masa Kerja</button>
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
