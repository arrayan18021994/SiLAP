import React from 'react';
import Timeline from '../../../components/Timeline';

const LifeEventsTimeline: React.FC = () => {
  const timelineData = [
    {
      year: '2026',
      events: [
        { id: 1, date: '15 Agustus 2026', title: 'Kelahiran Anak (Tunjangan Anak)', icon: '👶', statusColor: 'var(--status-info)' },
        { id: 2, date: '01 April 2026', title: 'Kenaikan Gaji Berkala', icon: '💰', statusColor: 'var(--status-normal)' }
      ]
    },
    {
      year: '2025',
      events: [
        { id: 3, date: '01 April 2025', title: 'Kenaikan Gaji Berkala', icon: '💰', statusColor: 'var(--status-normal)' },
        { id: 4, date: '01 Januari 2025', title: 'Mutasi Jabatan & Unit Kerja', icon: '📋', statusColor: 'var(--status-attention)' }
      ]
    },
    {
      year: '2024',
      events: [
        { id: 5, date: '01 April 2024', title: 'Kenaikan Gaji Berkala', icon: '💰', statusColor: 'var(--status-normal)' }
      ]
    }
  ];

  return (
    <div className="card" style={{ padding: '1rem 1.25rem', fontSize: '0.85rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.4rem' }}>
        <h3 style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-main)', fontWeight: 600 }}>
          RIWAYAT PERISTIWA PEGAWAI
        </h3>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Kronologis Peristiwa Penting</span>
      </div>
      <Timeline groups={timelineData} />
    </div>
  );
};

export default LifeEventsTimeline;
