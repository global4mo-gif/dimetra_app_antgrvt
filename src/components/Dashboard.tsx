import React from 'react';
import { CheckCircle2, Circle, AlertCircle, Sparkles, TrendingUp } from 'lucide-react';
import { getTodayStr } from '../hooks/useAppStore';
import type { Supplement, LabMarker } from '../hooks/useAppStore';
import { ru } from '../i18n/ru';

interface DashboardProps {
  supplements: Supplement[];
  labs: any[];
  profile: any;
  adherence: any;
  completeDose: (dateStr: string, supplementId: string, time: string) => void;
  uncompleteDose: (dateStr: string, supplementId: string, time: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  supplements,
  labs,
  profile,
  adherence,
  completeDose,
  uncompleteDose
}) => {
  const todayStr = getTodayStr();
  const todayAdherence = adherence[todayStr] || {};

  const timings = ['morning', 'afternoon', 'evening', 'bedtime'] as const;
  const timingLabels: Record<string, string> = {
    morning: ru.dashboard.morning,
    afternoon: ru.dashboard.afternoon,
    evening: ru.dashboard.evening,
    bedtime: ru.dashboard.bedtime
  };

  const isScheduledForToday = (supp: Supplement) => {
    if (!supp.active) return false;
    if (supp.frequency !== 'cycle' || !supp.cycleDaysOn || !supp.cycleDaysOff || !supp.cycleStartDate) {
      return true;
    }
    const start = new Date(supp.cycleStartDate);
    const today = new Date(todayStr);
    const diffTime = today.getTime() - start.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return false;
    const cycleLength = supp.cycleDaysOn + supp.cycleDaysOff;
    const dayInCycle = diffDays % cycleLength;
    return dayInCycle < supp.cycleDaysOn;
  };

  const scheduledSupplements = supplements.filter(isScheduledForToday);

  let totalDosesToday = 0;
  let takenDosesToday = 0;

  scheduledSupplements.forEach(supp => {
    totalDosesToday += supp.times.length;
    takenDosesToday += todayAdherence[supp.id]?.length || 0;
  });

  const dailyCompliance = totalDosesToday > 0 ? Math.round((takenDosesToday / totalDosesToday) * 100) : 100;

  const getBioInsight = () => {
    if (labs.length === 0) return null;
    const latestTest = labs[0];
    const lowMarkers = latestTest.markers.filter((m: LabMarker) => m.status === 'low');
    
    if (lowMarkers.length > 0) {
      const marker = lowMarkers[0];
      return {
        title: ru.dashboard.insightTitle,
        text: `Ваш уровень ${marker.name} снижен (${marker.value} ${marker.unit}). Ознакомьтесь с рекомендациями в разделе Анализы.`,
        marker: marker.name
      };
    }
    return {
      title: ru.dashboard.insightTitle,
      text: 'Все биомаркеры в оптимальной норме. Продолжайте текущий протокол.',
      marker: 'Все маркеры'
    };
  };

  const bioInsight = getBioInsight();

  return (
    <div className="dashboard scrollable app-content-wrapper">
      <div className="header-section">
        <div>
          <h1 className="web-title" style={{ fontSize: '32px', marginBottom: '4px' }}>
            {ru.dashboard.title}
          </h1>
          <span style={{ fontSize: '12px', color: 'var(--mykora-muted)', textTransform: 'uppercase' }}>
            {ru.dashboard.subtitle}
          </span>
        </div>
      </div>

      <div className="web-dark-card compliance-card">
        <div style={{ padding: '20px' }}>
          <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
            {ru.dashboard.scoreTitle}
          </div>
          <div style={{ fontSize: '42px', fontFamily: '"Bounded", sans-serif', lineHeight: '1' }}>
            {profile.biohackingScore}%
          </div>
          <div style={{ fontSize: '12px', opacity: '0.7', marginTop: '8px' }}>
            {ru.dashboard.scoreSubtitle}
          </div>
        </div>
        <div style={{ background: 'var(--mykora-orange)', color: '#fff', padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', fontWeight: '500', textTransform: 'uppercase' }}>Сегодня: {takenDosesToday} из {totalDosesToday}</span>
          <TrendingUp size={16} />
        </div>
      </div>

      {bioInsight && (
        <div className="web-card insight-card">
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <Sparkles size={18} style={{ color: 'var(--mykora-orange)', flexShrink: 0, marginTop: '2px' }} />
            <div>
              <h4 style={{ fontSize: '13px', fontWeight: '600', marginBottom: '4px', textTransform: 'uppercase' }}>{bioInsight.title}</h4>
              <p style={{ fontSize: '14px', color: 'var(--mykora-ink)', lineHeight: '1.4' }}>{bioInsight.text}</p>
            </div>
          </div>
        </div>
      )}

      <h3 className="web-section-title" style={{ fontSize: '18px', marginTop: '32px', marginBottom: '16px' }}>Протокол на сегодня</h3>
      
      <div className="timeline-container">
        {timings.map((timeOfDay) => {
          const suppsForTime = scheduledSupplements.filter(s => s.times.includes(timeOfDay));
          if (suppsForTime.length === 0) return null;

          return (
            <div key={timeOfDay} className="timeline-block">
              <div className="timeline-time-label">
                <span className="time-text">{timingLabels[timeOfDay]}</span>
                <div className="time-line"></div>
              </div>
              
              <div className="timeline-items">
                {suppsForTime.map(supp => {
                  const isTaken = todayAdherence[supp.id]?.includes(timeOfDay);
                  
                  return (
                    <div 
                      key={`${supp.id}-${timeOfDay}`}
                      className={`web-card timeline-item-card ${isTaken ? 'checked-card' : ''}`}
                      onClick={() => {
                        if (isTaken) {
                          uncompleteDose(todayStr, supp.id, timeOfDay);
                        } else {
                          completeDose(todayStr, supp.id, timeOfDay);
                        }
                      }}
                    >
                      <div className="item-checkbox">
                        {isTaken ? (
                          <CheckCircle2 size={24} style={{ color: 'var(--mykora-orange)' }} />
                        ) : (
                          <Circle size={24} style={{ color: 'var(--mykora-border)' }} />
                        )}
                      </div>
                      <div className="item-details">
                        <div className="item-name-row">
                          <span className="item-name">{supp.name}</span>
                        </div>
                        <span className="item-dose">{supp.dosage}</span>
                        {supp.instructions && (
                          <span className="item-instructions">{supp.instructions}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
        {totalDosesToday === 0 && (
          <div className="empty-protocol-state">
            <AlertCircle size={24} style={{ color: 'var(--mykora-muted)' }} />
            <p>{ru.dashboard.empty}</p>
          </div>
        )}
      </div>

      <style>{`
        .dashboard {
          padding: 20px;
          padding-bottom: 80px;
        }

        .header-section {
          margin-bottom: 24px;
          text-align: center;
        }

        .compliance-card {
          margin-bottom: 20px;
        }

        .insight-card {
          padding: 16px;
          background: var(--mykora-canvas);
          border-left: 3px solid var(--mykora-orange);
          margin-bottom: 24px;
        }

        .timeline-container {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .timeline-time-label {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
        }

        .time-text {
          font-family: "Bounded", system-ui, sans-serif;
          font-size: 11px;
          font-weight: 500;
          color: var(--mykora-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .time-line {
          flex: 1;
          height: 1px;
          background: var(--mykora-border);
        }

        .timeline-items {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .timeline-item-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .timeline-item-card:hover {
          border-color: var(--mykora-ink);
        }

        .checked-card {
          background: var(--mykora-surface-muted);
          border-color: var(--mykora-orange);
        }

        .item-details {
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .item-name {
          font-size: 15px;
          font-weight: 600;
          color: var(--mykora-ink);
          margin-bottom: 4px;
        }

        .item-dose {
          font-size: 13px;
          color: var(--mykora-muted);
          margin-bottom: 2px;
        }

        .item-instructions {
          font-size: 12px;
          color: var(--mykora-forest-soft);
        }

        .empty-protocol-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          text-align: center;
          color: var(--mykora-muted);
          font-size: 14px;
          gap: 12px;
        }
      `}</style>
    </div>
  );
};
