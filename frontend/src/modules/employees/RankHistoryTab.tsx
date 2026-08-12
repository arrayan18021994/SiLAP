import React from 'react';

interface RankRecord {
  id: number;
  rank: string;
  tmt_rank: string;
  sk_number: string;
  sk_date: string;
  status: string;
  notes?: string;
}

interface RankHistoryTabProps {
  employeeId?: string;
  employeeData?: any;
}

const RankHistoryTab: React.FC<RankHistoryTabProps> = ({ employeeData }) => {
  const currentRank = employeeData?.rank || 'IV/d';

  const rankHistory: RankRecord[] = [
    {
      id: 1,
      rank: 'Pembina Utama Muda (IV/d)',
      tmt_rank: '01/04/2022',
      sk_number: '821.2/089/BKPSDM/2022',
      sk_date: '25/03/2022',
      status: 'DISETUJUI',
      notes: 'Kenaikan Pangkat Pilihan'
    },
    {
      id: 2,
      rank: 'Pembina Tingkat I (IV/c)',
      tmt_rank: '01/04/2018',
      sk_number: '821.2/045/BKPSDM/2018',
      sk_date: '20/03/2018',
      status: 'SELESAI',
      notes: 'Kenaikan Pangkat Reguler'
    },
    {
      id: 3,
      rank: 'Pembina (IV/a)',
      tmt_rank: '01/04/2014',
      sk_number: '821.2/012/BKPSDM/2014',
      sk_date: '18/03/2014',
      status: 'SELESAI',
      notes: 'Kenaikan Pangkat Reguler'
    },
    {
      id: 4,
      rank: 'Penata Tingkat I (III/d) - Pangkat Pertama (CPNS)',
      tmt_rank: '01/03/1996',
      sk_number: '813.2/001/BKD/1996',
      sk_date: '15/02/1996',
      status: 'SELESAI',
      notes: 'Pengangkatan Pertama CPNS'
    }
  ];

  return (
    <div className="rank-history-tab" style={{ fontSize: '0.85rem' }}>
      <div className="sp-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.05rem', color: 'var(--text-main)', fontWeight: 600 }}>Riwayat Pangkat & Golongan</h3>
          <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Catatan kronologis kenaikan pangkat dan golongan pegawai sejak pendaftaran pertama.
          </p>
        </div>
        <button className="btn-primary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', fontWeight: 500 }}>
          + Tambah Riwayat Pangkat
        </button>
      </div>

      <div className="card mb-3" style={{ padding: '0.65rem 0.85rem', background: '#f8fafc', borderLeft: '4px solid #2563eb', marginBottom: '0.65rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Pangkat / Golongan Saat Ini</span>
            <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)', marginTop: '2px' }}>{currentRank}</div>
          </div>
          <span className="badge success" style={{ background: '#dcfce7', color: '#166534', padding: '3px 8px', fontSize: '0.75rem', fontWeight: 500 }}>
            DISETUJUI
          </span>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '0.5rem 0.85rem', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-surface-hover)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h4 style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-main)', fontWeight: 600 }}>Daftar Perubahan Pangkat</h4>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total: {rankHistory.length} Riwayat</span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="table" style={{ width: '100%', fontSize: '0.78rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', textAlign: 'center' }}>
                <th style={{ padding: '0.35rem 0.6rem', textAlign: 'center' }}>NO</th>
                <th style={{ padding: '0.35rem 0.6rem', textAlign: 'left' }}>PANGKAT / GOLONGAN</th>
                <th style={{ padding: '0.35rem 0.6rem', textAlign: 'center' }}>TMT PANGKAT</th>
                <th style={{ padding: '0.35rem 0.6rem', textAlign: 'center' }}>NOMOR SK</th>
                <th style={{ padding: '0.35rem 0.6rem', textAlign: 'center' }}>TANGGAL SK</th>
                <th style={{ padding: '0.35rem 0.6rem', textAlign: 'center' }}>STATUS</th>
                <th style={{ padding: '0.35rem 0.6rem', textAlign: 'center' }}>AKSI</th>
              </tr>
            </thead>
            <tbody>
              {rankHistory.map((r, idx) => (
                <tr key={r.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.35rem 0.6rem', textAlign: 'center' }}>{idx + 1}</td>
                  <td style={{ padding: '0.35rem 0.6rem', fontWeight: 400, textAlign: 'left' }}>
                    {r.rank}
                    {r.notes && <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)' }}>{r.notes}</span>}
                  </td>
                  <td style={{ padding: '0.35rem 0.6rem', textAlign: 'center', fontWeight: 400 }}>{r.tmt_rank}</td>
                  <td style={{ padding: '0.35rem 0.6rem', textAlign: 'center', fontWeight: 400 }}>{r.sk_number}</td>
                  <td style={{ padding: '0.35rem 0.6rem', textAlign: 'center', fontWeight: 400 }}>{r.sk_date}</td>
                  <td style={{ padding: '0.35rem 0.6rem', textAlign: 'center' }}>
                    <span className="badge success" style={{ background: r.status === 'DISETUJUI' ? '#dcfce7' : '#e0f2fe', color: r.status === 'DISETUJUI' ? '#166534' : '#0369a1', padding: '2px 6px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 500 }}>
                      {r.status}
                    </span>
                  </td>
                  <td style={{ padding: '0.35rem 0.6rem', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'center' }}>
                      <button className="btn-action-icon edit" title="Edit Riwayat Pangkat" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem' }}>✏️</button>
                      <button className="btn-action-icon delete" title="Hapus Riwayat Pangkat" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem' }}>🗑️</button>
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

export default RankHistoryTab;
