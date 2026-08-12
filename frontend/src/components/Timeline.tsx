import React from 'react';
import './Timeline.css';

interface TimelineEvent {
  id: string | number;
  date: string;
  title: string;
  description?: string;
  icon?: string;
  statusColor?: string;
}

interface TimelineGroup {
  year: string;
  events: TimelineEvent[];
}

interface TimelineProps {
  groups: TimelineGroup[];
}

const Timeline: React.FC<TimelineProps> = ({ groups }) => {
  return (
    <div className="timeline-container">
      {groups.map((group, groupIndex) => (
        <div key={`group-${groupIndex}`} className="timeline-group">
          <div className="timeline-year">{group.year}</div>
          <div className="timeline-events">
            {group.events.map((event, eventIndex) => (
              <div key={event.id} className="timeline-event">
                <div className="timeline-line"></div>
                <div 
                  className="timeline-marker" 
                  style={{ borderColor: event.statusColor || 'var(--primary-color)' }}
                >
                  {event.icon}
                </div>
                <div className="timeline-content">
                  <div className="timeline-date">{event.date}</div>
                  <div className="timeline-title">{event.title}</div>
                  {event.description && <div className="timeline-desc">{event.description}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Timeline;
