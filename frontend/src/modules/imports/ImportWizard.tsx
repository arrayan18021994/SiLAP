import React, { useState } from 'react';
import './Imports.css';

const ImportWizard: React.FC = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [previewData, setPreviewData] = useState<any>(null);

  const handleNext = () => setStep(step + 1);
  const handlePrev = () => setStep(step - 1);

  const handleDownloadTemplate = async () => {
    try {
      const response = await fetch('/api/v1/employees/template');
      if (!response.ok) throw new Error("Gagal mengunduh template");
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = "Template_Import_Pegawai.xlsx";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert(error);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/v1/employees/preview', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || data.error || "Gagal preview data");
      
      setPreviewData(data);
      handleNext();
    } catch (error: any) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCommit = async () => {
    if (!previewData) return;
    setLoading(true);
    try {
      const response = await fetch('/api/v1/employees/commit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ preview_data: previewData.preview_data }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Gagal import");

      alert(`${data.imported_rows} baris data berhasil di-import!`);
      window.location.href = "/dashboard/employees";
    } catch (error: any) {
      alert("Error: " + error.message);
      setLoading(false);
    }
  };

  return (
    <div className="import-wizard-container">
      <div className="page-header">
        <h2>Import Data Pegawai Massal</h2>
        <button className="btn-secondary" onClick={() => window.history.back()}>Kembali</button>
      </div>

      <div className="wizard-card">
        {step === 1 && (
          <div className="step-content text-center">
            <h3>Langkah 1: Download & Isi Template</h3>
            <p className="text-muted mb-4">Gunakan template resmi untuk memastikan struktur data terbaca sistem.</p>
            <button className="btn-secondary mb-4" onClick={handleDownloadTemplate}>Download SiLAP_Template_Pegawai.xlsx</button>
            
            <hr className="divider" />
            
            <h3>Langkah 2: Upload Excel</h3>
            <div className="upload-box mt-3">
              <input type="file" accept=".xlsx" onChange={handleFileUpload} />
              {loading && <p className="mt-2 text-muted">Memproses file...</p>}
            </div>
          </div>
        )}

        {step === 2 && previewData && (
          <div className="step-content">
            <h3>Pratinjau Hasil Import</h3>
            
            <div className="summary-boxes mt-3 mb-4">
              <div className="summary-box">
                <h4>Total Baris</h4>
                <div className="val">{previewData.total_rows}</div>
              </div>
              <div className="summary-box success">
                <h4>Data Valid</h4>
                <div className="val">{previewData.valid_rows}</div>
              </div>
              <div className="summary-box danger">
                <h4>Data Error</h4>
                <div className="val">{previewData.error_rows}</div>
              </div>
            </div>

            <p className="warning-text mb-3">Hanya data berstatus VALID yang akan dimasukkan ke database saat Anda klik "Import Data Valid".</p>

            <table className="data-table">
              <thead>
                <tr>
                  <th>Baris</th>
                  <th>NIP</th>
                  <th>Status</th>
                  <th>Keterangan</th>
                </tr>
              </thead>
              <tbody>
                {previewData.preview_data.map((r: any, idx: number) => (
                  <tr key={idx}>
                    <td>{r.row}</td>
                    <td>{r.nip}</td>
                    <td>
                      <span className={`badge ${r.import_status === 'VALID' ? 'badge-normal' : 'badge-overdue'}`}>
                        {r.import_status}
                      </span>
                    </td>
                    <td className={r.import_status === 'ERROR' ? 'text-danger' : ''}>
                      {r.messages.length > 0 ? r.messages.join(", ") : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="button-group mt-4">
              <button className="btn-secondary" onClick={handlePrev}>Batal / Upload Ulang</button>
              <button className="btn-primary" onClick={handleCommit} disabled={loading || previewData.valid_rows === 0}>
                {loading ? "Menyimpan..." : `Import ${previewData.valid_rows} Data Valid`}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImportWizard;
