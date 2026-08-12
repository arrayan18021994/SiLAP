import React from 'react';

const EmployeeKGBTab: React.FC = () => {
  return (
    <div className="employee-kgb-tab">
      <div className="sp-header">
        <h3>Kenaikan Gaji Berkala (KGB)</h3>
        <div className="sp-actions">
          <button className="btn-secondary">Koreksi Data</button>
          <button className="btn-primary">+ Input KGB Baru</button>
        </div>
      </div>

      <div className="dashboard-grid mb-4">
        {/* KGB TERAKHIR */}
        <div className="dashboard-card" style={{ borderTop: "4px solid var(--text-main)" }}>
          <h3>KGB TERAKHIR (RESMI)</h3>
          <div className="mt-3">
            <div className="balance-row">
              <span className="text-muted">TMT KGB</span>
              <strong>01/04/2025</strong>
            </div>
            <div className="balance-row">
              <span className="text-muted">Golongan</span>
              <strong>III/c</strong>
            </div>
            <div className="balance-row">
              <span className="text-muted">Masa Kerja Golongan</span>
              <strong>08 Tahun 00 Bulan</strong>
            </div>
            <hr className="my-2" />
            <div className="balance-row highlight">
              <span>GAJI POKOK</span>
              <strong className="text-primary">Rp 3.500.000</strong>
            </div>
            <div className="balance-row mt-2">
              <span className="text-muted text-sm">Dasar SK</span>
              <span className="text-sm">822.3/123/BKPSDM/2025</span>
            </div>
          </div>
        </div>
        
        {/* KGB BERIKUTNYA PROYEKSI */}
        <div className="dashboard-card" style={{ borderTop: "4px solid #0ea5e9" }}>
          <h3>KGB BERIKUTNYA (PROYEKSI)</h3>
          <div className="mt-3">
            <div className="balance-row">
              <span className="text-muted">Perkiraan TMT</span>
              <strong>01/04/2027</strong>
            </div>
            <div className="balance-row">
              <span className="text-muted">Proyeksi Golongan</span>
              <strong>III/c</strong>
            </div>
            <div className="balance-row">
              <span className="text-muted">Proyeksi Masa Kerja</span>
              <strong>10 Tahun 00 Bulan</strong>
            </div>
            <hr className="my-2" />
            <div className="balance-row highlight">
              <span>PROYEKSI GAJI</span>
              <strong className="text-success">Rp 3.750.000</strong>
            </div>
            <div className="badge warning mt-3">STATUS: PENDING VERIFICATION</div>
          </div>
        </div>
      </div>

      <div className="sp-history mt-4">
        <h4>Riwayat Transaksi KGB & Perubahan Gaji</h4>
        <div className="timeline-container mt-4" style={{ paddingLeft: "1rem", borderLeft: "2px solid var(--border-color)" }}>
          
          <div className="timeline-item mb-4" style={{ position: "relative" }}>
            <div style={{ position: "absolute", left: "-1.4rem", top: 0, width: "12px", height: "12px", borderRadius: "50%", background: "#0ea5e9" }}></div>
            <div className="badge default mb-1">PROYEKSI</div>
            <h5>01/04/2027</h5>
            <p className="text-sm text-muted">III/c - 10 Tahun - Rp 3.750.000</p>
          </div>

          <div className="timeline-item mb-4" style={{ position: "relative" }}>
            <div style={{ position: "absolute", left: "-1.4rem", top: 0, width: "12px", height: "12px", borderRadius: "50%", background: "var(--text-main)" }}></div>
            <div className="badge success mb-1">RESMI</div>
            <h5>01/04/2025</h5>
            <p className="text-sm text-muted">III/c - 08 Tahun - Rp 3.500.000</p>
            <p className="text-xs text-muted mt-1">SK: 822.3/123/BKPSDM/2025</p>
          </div>

          <div className="timeline-item mb-4" style={{ position: "relative" }}>
            <div style={{ position: "absolute", left: "-1.4rem", top: 0, width: "12px", height: "12px", borderRadius: "50%", background: "var(--text-muted)" }}></div>
            <div className="badge success mb-1">RESMI</div>
            <h5>01/04/2023</h5>
            <p className="text-sm text-muted">III/c - 06 Tahun - Rp 3.250.000</p>
            <p className="text-xs text-muted mt-1">SK: 822.3/045/BKPSDM/2023</p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default EmployeeKGBTab;
