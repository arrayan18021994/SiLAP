import React, { useState } from 'react';
import './Imports.css';

const ImportWizard: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string>('');
  const [previewData, setPreviewData] = useState<any>(null);

  const handleDownloadTemplate = async () => {
    try {
      let response = await fetch('/api/v1/employees/template');
      let contentType = response.headers.get('content-type') || '';
      
      if (!response.ok || contentType.includes('text/html')) {
        // Fallback directly to backend port 8000 if proxy fails or returns HTML fallback
        response = await fetch('http://localhost:8000/api/v1/employees/template');
        contentType = response.headers.get('content-type') || '';
      }

      if (!response.ok || contentType.includes('text/html')) {
        throw new Error("Gagal mengunduh file template dari server. Pastikan backend aktif.");
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = "SiLAP_Template_Pegawai.xlsx";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      alert(error.message || error);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFileName(file.name);
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

  const handleReset = () => {
    setPreviewData(null);
    setSelectedFileName('');
  };

  return (
    <div className="import-wizard-container">
      <div className="page-header">
        <h2>Import Data Pegawai Massal</h2>
        <button className="btn-secondary" onClick={() => window.history.back()}>Kembali</button>
      </div>

      <div className="wizard-card">
        {/* Steps 1 & 2 Side-by-Side Equal & Balanced */}
        <div className="steps-container">
          <div className="step-col">
            <div className="step-header">
              <h3>Langkah 1: Download & Isi Template</h3>
              <p className="text-muted">Gunakan template resmi untuk memastikan struktur data terbaca sistem.</p>
            </div>
            <div className="step-action-box" onClick={handleDownloadTemplate}>
              <span className="step-icon">📥</span>
              <span className="action-text">Download SiLAP_Template_Pegawai.xlsx</span>
            </div>
          </div>

          <div className="vertical-dotted-line"></div>

          <div className="step-col">
            <div className="step-header">
              <h3>Langkah 2: Upload Excel</h3>
              <p className="text-muted">Unggah file Excel yang telah diisi sesuai format template.</p>
            </div>
            <div className="upload-box">
              <input type="file" accept=".xlsx" onChange={handleFileUpload} id="file-upload-input" />
              <label htmlFor="file-upload-input" className="file-upload-label">
                <span className="upload-icon">📄</span>
                <span>{selectedFileName ? selectedFileName : 'Pilih / Drop File Excel (.xlsx)'}</span>
              </label>
              {loading && <p className="mt-2 text-muted">Memproses data file...</p>}
            </div>
          </div>
        </div>

        {/* Validation Section (Appears when file is uploaded & parsed) */}
        {previewData && (
          <div className="validation-section mt-5">
            <hr className="divider mb-4" />
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3>Daftar Data untuk Divalidasi</h3>
              <button className="btn-secondary btn-sm" onClick={handleReset}>Reset / Upload File Lain</button>
            </div>
            
            <div className="summary-boxes mb-4">
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

            <p className="warning-text mb-3">
              Silakan periksa data di bawah ini. Hanya data berstatus <strong>VALID</strong> yang akan dimasukkan ke database saat Anda klik "Import Data Valid".
            </p>

            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Baris</th>
                    <th>NIP</th>
                    <th>Nama</th>
                    <th>MKG (Thn/Bln)</th>
                    <th>TMT MKG</th>
                    <th>Status Validasi</th>
                    <th>Keterangan</th>
                  </tr>
                </thead>
                <tbody>
                  {previewData.preview_data.map((r: any, idx: number) => (
                    <tr key={idx} className={r.import_status === 'ERROR' ? 'row-error' : ''}>
                      <td>{r.row}</td>
                      <td>{r.nip}</td>
                      <td>{r.name || r.full_name || '-'}</td>
                      <td>{r.mkg_years !== undefined ? `${r.mkg_years} Thn ${r.mkg_months || 0} Bln` : '-'}</td>
                      <td>{r.tmt_mkg || '-'}</td>
                      <td>
                        <span className={`badge ${r.import_status === 'VALID' ? 'badge-normal' : 'badge-overdue'}`}>
                          {r.import_status}
                        </span>
                      </td>
                      <td className={r.import_status === 'ERROR' ? 'text-danger' : ''}>
                        {r.messages && r.messages.length > 0 ? r.messages.join(", ") : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="button-group mt-4">
              <button className="btn-secondary" onClick={handleReset}>Batal / Upload Ulang</button>
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
