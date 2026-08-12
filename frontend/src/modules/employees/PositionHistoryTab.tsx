import React from 'react';

interface PositionRecord {
  id: number;
  position: string;
  opd: string;
  tmt_position: string;
  sk_number: string;
  sk_date: string;
  status: string;
  notes?: string;
}

interface PositionHistoryTabProps {
  employeeId?: string;
  employeeData?: any;
}

const PositionHistoryTab: React.FC<PositionHistoryTabProps> = ({ employeeData }) => {
  const currentPosition = employeeData?.position || 'Kepala Badan Kepegawaian Daerah';

  const positionHistory: PositionRecord[] = [
    {
      id: 1,
      position: 'Kepala Badan Kepegawaian Daerah',
      opd: 'BKPSDM Kabupaten / Kota',
      tmt_position: '01/01/2021',
      sk_number: '821.2/110/BKPSDM/2021',
      sk_date: '28/12/2020',
      status: 'DISETUJUI',
      notes: 'Promosi Jabatan Pimpinan Tinggi Pratama'
    },
    {
      id: 2,
      position: 'Kepala Bidang Pengadaan & Informasi Kepegawaian',
      opd: 'BKPSDM Kabupaten / Kota',
      tmt_position: '01/04/2016',
      sk_number: '821.2/054/BKPSDM/2016',
      sk_date: '24/03/2016',
      status: 'SELESAI',
      notes: 'Mutasi & Promosi Administrator'
    },
    {
      id: 3,
      position: 'Kasubbid Pengadaan Kepegawaian',
      opd: 'BKD Kabupaten / Kota',
      tmt_position: '01/04/2011',
      sk_number: '821.2/022/BKD/2011',
      sk_date: '22/03/2011',
      status: 'SELESAI',
      notes: 'Pengangkatan Jabatan Pengawas'
    },
    {
      id: 4,
      position: 'Analis Kepegawaian Pertama - Jabatan Pertama (CPNS)',
      opd: 'BKD Kabupaten / Kota',
      tmt_position: '01/03/1996',
      sk_number: '813.2/001/BKD/1996',
      sk_date: '15/02/1996',
      status: 'SELESAI',
      notes: 'Pengangkatan Pertama CPNS'
    }
  ];

  return (
    <div className="position-history-tab" style={{ fontSize: '0.85rem' }}>
      <div className="sp-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.05rem', color: 'var(--text-main)', fontWeight: 600 }}>Riwayat Jabatan & Unit Kerja</h3>
          <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Catatan kronologis perubahan jabatan dan unit kerja pegawai sejak pendaftaran pertama.
          </p>
        </div>
        <button className="btn-primary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', fontWeight: 500 }}>
          + Tambah Riwayat Jabatan
        </button>
      </div>

      <div className="card mb-3" style={{ padding: '0.65rem 0.85rem', background: '#f8fafc', borderLeft: '4px solid #2563eb', marginBottom: '0.65rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Jabatan Saat Ini</span>
            <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)', marginTop: '2px' }}>{currentPosition}</div>
          </div>
          <span className="badge success" style={{ background: '#dcfce7', color: '#166534', padding: '3px 8px', fontSize: '0.75rem', fontWeight: 500 }}>
            DISETUJUI
          </span>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '0.5rem 0.85rem', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-surface-hover)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h4 style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-main)', fontWeight: 600 }}>Daftar Perubahan Jabatan</h4>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total: {positionHistory.length} Riwayat</span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="table" style={{ width: '100%', fontSize: '0.78rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', textAlign: 'center' }}>
                <th style={{ padding: '0.35rem 0.6rem', textAlign: 'center' }}>NO</th>
                <th style={{ padding: '0.35rem 0.6rem', textAlign: 'left' }}>NAMA JABATAN</th>
                <th style={{ padding: '0.35rem 0.6rem', textAlign: 'center' }}>UNIT KERJA / OPD</th>
                <th style={{ padding: '0.35rem 0.6rem', textAlign: 'center' }}>TMT JABATAN</th>
                <th style={{ padding: '0.35rem 0.6rem', textAlign: 'center' }}>NOMOR SK</th>
                <th style={{ padding: '0.35rem 0.6rem', textAlign: 'center' }}>STATUS</th>
                <th style={{ padding: '0.35rem 0.6rem', textAlign: 'center' }}>AKSI</th>
              </tr>
            </thead>
            <tbody>
              {positionHistory.map((p, idx) => (
                <tr key={p.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.35rem 0.6rem', textAlign: 'center' }}>{idx + 1}</td>
                  <td style={{ padding: '0.35rem 0.6rem', fontWeight: 400, textAlign: 'left' }}>
                    {p.position}
                    {p.notes && <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)' }}>{p.notes}</span>}
                  </td>
                  <td style={{ padding: '0.35rem 0.6rem', textAlign: 'center', fontWeight: 400 }}>{p.opd}</td>
                  <td style={{ padding: '0.35rem 0.6rem', textAlign: 'center', fontWeight: 400 }}>{p.tmt_position}</td>
                  <td style={{ padding: '0.35rem 0.6rem', textAlign: 'center', fontWeight: 400 }}>{p.sk_number}</td>
                  <td style={{ padding: '0.35rem 0.6rem', textAlign: 'center' }}>
                    <span className="badge success" style={{ background: p.status === 'DISETUJUI' ? '#dcfce7' : '#e0f2fe', color: p.status === 'DISETUJUI' ? '#166534' : '#0369a1', padding: '2px 6px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 500 }}>
                      {p.status}
                    </span>
                  </td>
                  <td style={{ padding: '0.35rem 0.6rem', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'center' }}>
                      <button className="btn-action-icon edit" title="Edit Riwayat Jabatan" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem' }}>✏️</button>
                      <button className="btn-action-icon delete" title="Hapus Riwayat Jabatan" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem' }}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PositionHistoryTab;
