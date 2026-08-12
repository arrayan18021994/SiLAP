import React from 'react';
import Timeline from '../../../components/Timeline';

const LifeEventsTimeline: React.FC = () => {
  // Mock data representing the timeline structure requested by the user
  const timelineData = [
    {
      year: '2026',
      events: [
        { id: 1, date: '15 Agustus 2026', title: 'Kelahiran Anak', icon: '👶', statusColor: 'var(--status-info)' },
        { id: 2, date: '01 April 2026', title: 'KGB', icon: '💰', statusColor: 'var(--status-normal)' }
      ]
    },
    {
      year: '2025',
      events: [
        { id: 3, date: '01 April 2025', title: 'KGB', icon: '💰', statusColor: 'var(--status-normal)' },
        { id: 4, date: '01 Januari 2025', title: 'Mutasi', icon: '📋', statusColor: 'var(--status-attention)' }
      ]
    },
    {
      year: '2024',
      events: [
        { id: 5, date: '01 April 2024', title: 'KGB', icon: '💰', statusColor: 'var(--status-normal)' }
      ]
    }
  ];

  return (
    <div className="card" style={{ padding: '2rem' }}>
      <h3 style={{ marginBottom: '1.5rem', fontSize: '14px', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
        RIWAYAT PEGAWAI
      </h3>
      <Timeline groups={timelineData} />
    </div>
  );
};

export default LifeEventsTimeline;
