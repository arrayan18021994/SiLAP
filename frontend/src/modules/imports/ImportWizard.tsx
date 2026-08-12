import React, { useState } from 'react';
import DateInput from '../../components/DateInput';
import './Imports.css';

const ImportWizard: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string>('');
  const [previewData, setPreviewData] = useState<any>(null);

  // Edit Row Modal State
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingRow, setEditingRow] = useState<any>(null);

  const handleDownloadTemplate = async () => {
    try {
      let response = await fetch('/api/v1/employees/template');
      let contentType = response.headers.get('content-type') || '';
      
      if (!response.ok || contentType.includes('text/html')) {
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

  const getRankScore = (rankStr?: string): number => {
    if (!rankStr || rankStr === '-') return 0;
    const r = String(rankStr).trim().toUpperCase();
    const scores: Record<string, number> = {
      'IV/E': 45, 'IV/D': 44, 'IV/C': 43, 'IV/B': 42, 'IV/A': 41,
      'III/D': 34, 'III/C': 33, 'III/B': 32, 'III/A': 31,
      'II/D': 24, 'II/C': 23, 'II/B': 22, 'II/A': 21,
      'I/D': 14, 'I/C': 13, 'I/B': 12, 'I/A': 11,
    };
    if (scores[r]) return scores[r];
    const romanScores: Record<string, number> = {
      'XVII': 17, 'XVI': 16, 'XV': 15, 'XIV': 14, 'XIII': 13, 'XII': 12, 'XI': 11,
      'X': 10, 'IX': 9, 'VIII': 8, 'VII': 7, 'VI': 6, 'V': 5, 'IV': 4, 'III': 3, 'II': 2, 'I': 1
    };
    for (const [k, v] of Object.entries(romanScores)) {
      if (r.includes(k)) return v;
    }
    return 0;
  };

  const getAsnStatusScore = (statusStr?: string): number => {
    if (!statusStr) return 99;
    const st = String(statusStr).trim().toUpperCase();
    if (st.includes('PARUH') || st.includes('PART')) return 3;
    if (st.includes('PENUH') || st.includes('FULL') || st.includes('PPPK')) return 2;
    if (st.includes('PNS')) return 1;
    return 4;
  };

  const sortEmployeesList = (list: any[]): any[] => {
    return [...list].sort((a, b) => {
      // 1. Status ASN: PNS -> PPPK Penuh Waktu -> PPPK Paruh Waktu
      const asnA = getAsnStatusScore(a.status || a.asn_status);
      const asnB = getAsnStatusScore(b.status || b.asn_status);
      if (asnA !== asnB) return asnA - asnB;

      // 2. Golongan: IV highest down to I
      const rankA = getRankScore(a.rank);
      const rankB = getRankScore(b.rank);
      if (rankA !== rankB) return rankB - rankA;

      // 3. MKG: Largest total months first
      const mkgA = (Number(a.mkg_years || 0) * 12) + Number(a.mkg_months || 0);
      const mkgB = (Number(b.mkg_years || 0) * 12) + Number(b.mkg_months || 0);
      if (mkgA !== mkgB) return mkgB - mkgA;

      // 4. NIP: Oldest birth year first (ascending)
      const nipA = String(a.nip || '');
      const nipB = String(b.nip || '');
      return nipA.localeCompare(nipB);
    });
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
      
      if (data.preview_data && Array.isArray(data.preview_data)) {
        data.preview_data = sortEmployeesList(data.preview_data);
      }
      setPreviewData(data);
    } catch (error: any) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const recalculateSummary = (rows: any[]) => {
    const sortedRows = sortEmployeesList(rows);
    const total_rows = sortedRows.length;
    const valid_rows = sortedRows.filter(r => r.import_status === 'VALID').length;
    const error_rows = sortedRows.filter(r => r.import_status === 'ERROR').length;
    return {
      total_rows,
      valid_rows,
      error_rows,
      preview_data: sortedRows
    };
  };

  const handleOpenEditRow = (idx: number) => {
    setEditingIndex(idx);
    setEditingRow({ ...previewData.preview_data[idx] });
  };

  const handleSaveEditedRow = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingIndex === null || !editingRow) return;

    const updatedRows = [...previewData.preview_data];
    const isNipValid = Boolean(editingRow.nip && String(editingRow.nip).trim().length >= 5);
    const isNameValid = Boolean(editingRow.name || editingRow.full_name);

    if (isNipValid && isNameValid) {
      editingRow.import_status = 'VALID';
      editingRow.messages = [];
    } else {
      editingRow.import_status = 'ERROR';
      const msgs = [];
      if (!isNipValid) msgs.push('NIP wajib diisi');
      if (!isNameValid) msgs.push('Nama wajib diisi');
      editingRow.messages = msgs;
    }

    updatedRows[editingIndex] = editingRow;
    setPreviewData(recalculateSummary(updatedRows));
    setEditingIndex(null);
    setEditingRow(null);
  };

  const handleDeleteRow = (idx: number) => {
    const rowObj = previewData.preview_data[idx];
    if (!window.confirm(`Apakah Anda yakin ingin menghapus data baris ke-${rowObj.row} (${rowObj.name || rowObj.nip || 'Pegawai'})?`)) return;

    const updatedRows = previewData.preview_data.filter((_: any, index: number) => index !== idx);
    setPreviewData(recalculateSummary(updatedRows));
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
      <div className="page-header" style={{ marginBottom: '1rem' }}>
        <h2>Impor Data Pegawai Massal</h2>
        <button className="btn-secondary" onClick={() => window.history.back()}>Kembali</button>
      </div>

      <div className="wizard-card">
        {/* Steps 1 & 2 Side-by-Side Equal & Balanced */}
        <div className="steps-container">
          <div className="step-col">
            <div className="step-header">
              <h3>Langkah 1: Unduh & Isi Template</h3>
              <p className="text-muted">Gunakan template resmi untuk memastikan struktur data terbaca sistem.</p>
            </div>
            <div className="step-action-box" onClick={handleDownloadTemplate}>
              <span className="step-icon">📥</span>
              <span className="action-text">Unduh SiLAP_Template_Pegawai.xlsx</span>
            </div>
          </div>

          <div className="vertical-dotted-line"></div>

          <div className="step-col">
            <div className="step-header">
              <h3>Langkah 2: Unggah Excel</h3>
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
          <div className="validation-section mt-4">
            <div className="validation-header">
              <h3>Pratinjau & Validasi Data Pegawai</h3>
            </div>
            
            {/* Compact KPI Summary Cards */}
            <div className="summary-boxes mb-3">
              <div className="summary-box total">
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

            <p className="warning-text mb-3" style={{ fontSize: '0.83rem' }}>
              Silakan periksa data di bawah ini. Anda dapat mengedit data per baris langsung dengan menekan tombol <strong>Edit (✏️)</strong>. Hanya data berstatus <strong>VALID</strong> yang akan dimasukkan ke database saat Anda klik "Impor Data Valid".
            </p>

            <div className="table-responsive">
              <table className="data-table" style={{ fontSize: '0.85rem' }}>
                <thead>
                  <tr>
                    <th style={{ padding: '0.5rem 0.75rem', textAlign: 'center' }}>BARIS</th>
                    <th style={{ padding: '0.5rem 0.75rem', textAlign: 'center' }}>NIP</th>
                    <th style={{ padding: '0.5rem 0.75rem', textAlign: 'center' }}>NAMA</th>
                    <th style={{ padding: '0.5rem 0.75rem', textAlign: 'center' }}>STATUS ASN</th>
                    <th style={{ padding: '0.5rem 0.75rem', textAlign: 'center' }}>GOLONGAN</th>
                    <th style={{ padding: '0.5rem 0.75rem', textAlign: 'center' }}>MKG</th>
                    <th style={{ padding: '0.5rem 0.75rem', textAlign: 'center' }}>STATUS PERKAWINAN</th>
                    <th style={{ padding: '0.5rem 0.75rem', textAlign: 'center' }}>JUMLAH ANAK</th>
                    <th style={{ padding: '0.5rem 0.75rem', textAlign: 'center' }}>STATUS VALIDASI</th>
                    <th style={{ padding: '0.5rem 0.75rem', textAlign: 'center' }}>KETERANGAN</th>
                    <th style={{ padding: '0.5rem 0.75rem', textAlign: 'center' }}>AKSI</th>
                  </tr>
                </thead>
                <tbody>
                  {previewData.preview_data.map((r: any, idx: number) => {
                    const statusAsn = r.asn_status || r.status || 'PNS';
                    const rankVal = r.rank || '-';
                    const childrenCnt = r.children_count !== undefined ? r.children_count : (r.children ? r.children.length : 0);
                    return (
                      <tr key={idx} className={r.import_status === 'ERROR' ? 'row-error' : ''}>
                        <td style={{ padding: '0.5rem 0.75rem', textAlign: 'center' }}>{r.row}</td>
                        <td style={{ padding: '0.5rem 0.75rem', fontWeight: 400, textAlign: 'center' }}>{r.nip}</td>
                        <td style={{ padding: '0.5rem 0.75rem', fontWeight: 400, textAlign: 'left' }}>{r.name || r.full_name || '-'}</td>
                        <td style={{ padding: '0.5rem 0.75rem', textAlign: 'center' }}>
                          <span className={`badge ${statusAsn.toLowerCase().includes('pns') ? 'badge-normal' : 'badge-attention'}`}>
                            {statusAsn}
                          </span>
                        </td>
                        <td style={{ padding: '0.5rem 0.75rem', textAlign: 'center' }}>{rankVal}</td>
                        <td style={{ padding: '0.5rem 0.75rem', textAlign: 'center' }}>{r.mkg_years !== undefined ? `${r.mkg_years} Thn ${r.mkg_months || 0} Bln` : '-'}</td>
                        <td style={{ padding: '0.5rem 0.75rem', textAlign: 'center' }}>{r.marital_status || 'KAWIN'}</td>
                        <td style={{ padding: '0.5rem 0.75rem', textAlign: 'center' }}>{childrenCnt} Anak</td>
                        <td style={{ padding: '0.5rem 0.75rem', textAlign: 'center' }}>
                          <span className={`badge ${r.import_status === 'VALID' ? 'badge-normal' : 'badge-overdue'}`}>
                            {r.import_status}
                          </span>
                        </td>
                        <td className={r.import_status === 'ERROR' ? 'text-danger' : ''} style={{ padding: '0.5rem 0.75rem' }}>
                          {r.messages && r.messages.length > 0 ? r.messages.join(", ") : "-"}
                        </td>
                        <td style={{ padding: '0.5rem 0.75rem', textAlign: 'center' }}>
                          <div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'center' }}>
                            <button
                              type="button"
                              className="btn-action-icon edit"
                              title="Edit Data Baris Ini"
                              onClick={() => handleOpenEditRow(idx)}
                            >
                              ✏️
                            </button>
                            <button
                              type="button"
                              className="btn-action-icon delete"
                              title="Hapus Baris Ini"
                              onClick={() => handleDeleteRow(idx)}
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="button-group mt-4" style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button className="btn-secondary" onClick={handleReset}>Batal / Unggah Ulang</button>
              <button className="btn-primary" onClick={handleCommit} disabled={loading || previewData.valid_rows === 0}>
                {loading ? "Menyimpan..." : `Impor ${previewData.valid_rows} Data Valid`}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Edit Single Row Modal */}
      {editingIndex !== null && editingRow && (
        <div className="modal-backdrop" style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(2px)'
        }}>
          <div className="card compact-modal-card" style={{
            width: '920px', maxWidth: '96vw', maxHeight: '96vh', overflowY: 'auto',
            padding: '1rem 1.25rem', background: '#ffffff', borderRadius: '10px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
          }}>
            <div className="compact-modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.35rem' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-main)' }}>
                  Edit Data Pegawai - Baris Ke-{editingRow.row}
                </h3>
                <span style={{ fontSize: '0.76rem', color: '#64748b' }}>
                  Perbaiki data yang tidak valid agar status berubah menjadi VALID
                </span>
              </div>
              <button
                type="button"
                onClick={() => setEditingIndex(null)}
                style={{ background: 'none', border: 'none', fontSize: '1.3rem', cursor: 'pointer', color: '#64748b' }}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveEditedRow}>
              <div className="compact-section-wrapper" style={{ marginBottom: '0.45rem' }}>
                <h4 className="compact-section-title" style={{ fontSize: '0.82rem', color: '#1e3a8a', marginBottom: '0.2rem', borderLeft: '3px solid #2563eb', paddingLeft: '0.4rem', fontWeight: 700 }}>
                  1. Data Utama Pegawai
                </h4>
                <div className="compact-grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.2rem 0.6rem' }}>
                  <div className="form-group">
                    <label style={{ fontSize: '0.76rem', fontWeight: 600 }}>NIP *</label>
                    <input
                      type="text"
                      value={editingRow.nip || ''}
                      onChange={(e) => setEditingRow({ ...editingRow, nip: e.target.value })}
                      placeholder="18 digit NIP"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label style={{ fontSize: '0.76rem', fontWeight: 600 }}>Nama & Gelar *</label>
                    <input
                      type="text"
                      value={editingRow.name || editingRow.full_name || ''}
                      onChange={(e) => setEditingRow({ ...editingRow, name: e.target.value, full_name: e.target.value })}
                      placeholder="Nama lengkap pegawai"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label style={{ fontSize: '0.76rem', fontWeight: 600 }}>NIK</label>
                    <input
                      type="text"
                      value={editingRow.nik || ''}
                      onChange={(e) => setEditingRow({ ...editingRow, nik: e.target.value })}
                      placeholder="16 digit NIK"
                    />
                  </div>
                  <div className="form-group">
                    <label style={{ fontSize: '0.76rem', fontWeight: 600 }}>Jenis Kelamin</label>
                    <select
                      value={editingRow.gender || 'L'}
                      onChange={(e) => setEditingRow({ ...editingRow, gender: e.target.value })}
                    >
                      <option value="L">Laki-laki (L)</option>
                      <option value="P">Perempuan (P)</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label style={{ fontSize: '0.76rem', fontWeight: 600 }}>Tempat Lahir</label>
                    <input
                      type="text"
                      value={editingRow.birth_place || ''}
                      onChange={(e) => setEditingRow({ ...editingRow, birth_place: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label style={{ fontSize: '0.76rem', fontWeight: 600 }}>Tanggal Lahir</label>
                    <DateInput
                      name="birth_date"
                      value={editingRow.birth_date || ''}
                      onChange={(e) => setEditingRow({ ...editingRow, birth_date: e.target.value })}
                      placeholder="dd/mm/yyyy"
                    />
                  </div>
                </div>
              </div>

              <div className="compact-section-wrapper" style={{ marginBottom: '0.45rem' }}>
                <h4 className="compact-section-title" style={{ fontSize: '0.82rem', color: '#1e3a8a', marginBottom: '0.2rem', borderLeft: '3px solid #2563eb', paddingLeft: '0.4rem', fontWeight: 700 }}>
                  2. Status Kepegawaian & Masa Kerja Golongan
                </h4>
                <div className="compact-grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.2rem 0.6rem' }}>
                  <div className="form-group">
                    <label style={{ fontSize: '0.76rem', fontWeight: 600 }}>Status ASN *</label>
                    <select
                      value={editingRow.asn_status || editingRow.status || 'PNS'}
                      onChange={(e) => setEditingRow({ ...editingRow, asn_status: e.target.value, status: e.target.value })}
                    >
                      <option value="PNS">PNS</option>
                      <option value="PPPK Penuh Waktu">PPPK Penuh Waktu</option>
                      <option value="PPPK Paruh Waktu">PPPK Paruh Waktu</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label style={{ fontSize: '0.76rem', fontWeight: 600 }}>TMT ASN / CPNS</label>
                    <DateInput
                      name="tmt_cpns"
                      value={editingRow.tmt_cpns || editingRow.tmt_asn || ''}
                      onChange={(e) => setEditingRow({ ...editingRow, tmt_cpns: e.target.value, tmt_asn: e.target.value })}
                      placeholder="dd/mm/yyyy"
                    />
                  </div>
                  <div className="form-group">
                    <label style={{ fontSize: '0.76rem', fontWeight: 600 }}>Status Perkawinan</label>
                    <select
                      value={editingRow.marital_status || 'KAWIN'}
                      onChange={(e) => setEditingRow({ ...editingRow, marital_status: e.target.value })}
                    >
                      <option value="KAWIN">KAWIN</option>
                      <option value="BELUM KAWIN">BELUM KAWIN</option>
                      <option value="CERAI HIDUP">CERAI HIDUP</option>
                      <option value="CERAI MATI">CERAI MATI</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label style={{ fontSize: '0.76rem', fontWeight: 600 }}>MKG (Tahun)</label>
                    <input
                      type="number"
                      min="0"
                      value={editingRow.mkg_years ?? 0}
                      onChange={(e) => setEditingRow({ ...editingRow, mkg_years: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="form-group">
                    <label style={{ fontSize: '0.76rem', fontWeight: 600 }}>MKG (Bulan)</label>
                    <input
                      type="number"
                      min="0"
                      max="11"
                      value={editingRow.mkg_months ?? 0}
                      onChange={(e) => setEditingRow({ ...editingRow, mkg_months: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="form-group">
                    <label style={{ fontSize: '0.76rem', fontWeight: 600 }}>Tanggal MKG (TMT MKG)</label>
                    <DateInput
                      name="tmt_mkg"
                      value={editingRow.tmt_mkg || ''}
                      onChange={(e) => setEditingRow({ ...editingRow, tmt_mkg: e.target.value })}
                      placeholder="dd/mm/yyyy"
                    />
                  </div>
                </div>
              </div>

              <div className="compact-section-wrapper" style={{ marginBottom: '0.45rem' }}>
                <h4 className="compact-section-title" style={{ fontSize: '0.82rem', color: '#1e3a8a', marginBottom: '0.2rem', borderLeft: '3px solid #2563eb', paddingLeft: '0.4rem', fontWeight: 700 }}>
                  3. Pangkat, Jabatan & Unit Kerja
                </h4>
                <div className="compact-grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.2rem 0.6rem' }}>
                  <div className="form-group">
                    <label style={{ fontSize: '0.76rem', fontWeight: 600 }}>Pangkat / Golongan</label>
                    <input
                      type="text"
                      value={editingRow.rank || ''}
                      onChange={(e) => setEditingRow({ ...editingRow, rank: e.target.value })}
                      placeholder="Contoh: III/a"
                    />
                  </div>
                  <div className="form-group">
                    <label style={{ fontSize: '0.76rem', fontWeight: 600 }}>Jabatan</label>
                    <input
                      type="text"
                      value={editingRow.position || ''}
                      onChange={(e) => setEditingRow({ ...editingRow, position: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label style={{ fontSize: '0.76rem', fontWeight: 600 }}>Unit Kerja</label>
                    <input
                      type="text"
                      value={editingRow.opd || editingRow.unit_kerja || ''}
                      onChange={(e) => setEditingRow({ ...editingRow, opd: e.target.value, unit_kerja: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="compact-modal-footer flex gap-4" style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.4rem', marginTop: '0.4rem' }}>
                <button type="button" className="btn-secondary" onClick={() => setEditingIndex(null)}>Batal</button>
                <button type="submit" className="btn-primary">Simpan & Rekalkulasi Data</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImportWizard;
