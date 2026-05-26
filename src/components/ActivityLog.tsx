import React, { useState } from 'react';
import { Calendar, Smile, Moon, Brain, Zap, CheckCircle2 } from 'lucide-react';
import type { Supplement, AdherenceHistory } from '../hooks/useAppStore';
import { ru } from '../i18n/ru';

interface ActivityLogProps {
  supplements: Supplement[];
  adherence: AdherenceHistory;
}

interface BiometricLog {
  date: string;
  mood: number;
  sleep: number;
  focus: number;
  energy: number;
}

export const ActivityLog: React.FC<ActivityLogProps> = ({ supplements, adherence }) => {
  const [mood, setMood] = useState(7);
  const [sleep, setSleep] = useState(8);
  const [focus, setFocus] = useState(7);
  const [energy, setEnergy] = useState(8);
  const [isLogged, setIsLogged] = useState(false);
  
  const [bioLogs, setBioLogs] = useState<BiometricLog[]>([
    { date: '2026-05-24', mood: 8, sleep: 7, focus: 9, energy: 8 },
    { date: '2026-05-23', mood: 7, sleep: 8, focus: 7, energy: 7 },
    { date: '2026-05-22', mood: 6, sleep: 5, focus: 8, energy: 6 }
  ]);

  const handleLogBiometrics = (e: React.FormEvent) => {
    e.preventDefault();
    const newLog: BiometricLog = {
      date: new Date().toISOString().split('T')[0],
      mood,
      sleep,
      focus,
      energy
    };
    
    setBioLogs([newLog, ...bioLogs]);
    setIsLogged(true);
    setTimeout(() => setIsLogged(false), 3000);
  };

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().split('T')[0];
  }).reverse();

  const getComplianceForDay = (dateStr: string) => {
    let required = 0;
    let taken = 0;

    supplements.forEach(supp => {
      if (!supp.active) return;
      
      if (supp.frequency === 'cycle' && supp.cycleDaysOn && supp.cycleDaysOff && supp.cycleStartDate) {
        const start = new Date(supp.cycleStartDate);
        const current = new Date(dateStr);
        const diffTime = current.getTime() - start.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays >= 0) {
          const cycleLength = supp.cycleDaysOn + supp.cycleDaysOff;
          const dayInCycle = diffDays % cycleLength;
          if (dayInCycle >= supp.cycleDaysOn) return;
        }
      }

      required += supp.times.length;
      taken += adherence[dateStr]?.[supp.id]?.length || 0;
    });

    return required > 0 ? Math.round((taken / required) * 100) : 100;
  };

  const weeklyAverage = Math.round(
    last7Days.reduce((acc, date) => acc + getComplianceForDay(date), 0) / 7
  );

  const getDayLetter = (dateStr: string) => {
    const d = new Date(dateStr);
    const options = { weekday: 'narrow' as const };
    return new Intl.DateTimeFormat('ru-RU', options).format(d);
  };

  return (
    <div className="activity-view scrollable app-content-wrapper">
      <div className="activity-header" style={{ marginBottom: '24px' }}>
        <h2 className="web-title" style={{ fontSize: '32px', marginBottom: '8px' }}>{ru.activity.title}</h2>
      </div>

      <div className="analytics-grid">
        <div className="web-card stat-card">
          <span className="stat-label">В среднем за неделю</span>
          <span className="stat-val">{weeklyAverage}%</span>
          <span className="stat-desc">Процент выполнения</span>
        </div>
        <div className="web-card stat-card">
          <span className="stat-label">Подряд</span>
          <span className="stat-val" style={{ color: 'var(--mykora-orange)' }}>6 Дней</span>
          <span className="stat-desc">Безупречный протокол</span>
        </div>
      </div>

      <h3 className="web-section-title" style={{ fontSize: '18px', marginTop: '32px', marginBottom: '16px' }}>
        Соблюдение (7 дней)
      </h3>
      <div className="web-card chart-card">
        <div className="chart-container">
          {last7Days.map(date => {
            const comp = getComplianceForDay(date);
            return (
              <div key={date} className="chart-bar-column">
                <span className="bar-val">{comp}%</span>
                <div className="bar-track">
                  <div 
                    className="bar-fill" 
                    style={{ 
                      height: `${comp}%`,
                      background: comp > 80 ? '#4CAF50' : comp > 40 ? 'var(--mykora-orange)' : '#F44336'
                    }}
                  ></div>
                </div>
                <span className="bar-label">{getDayLetter(date).toUpperCase()}</span>
              </div>
            );
          })}
        </div>
      </div>

      <h3 className="web-section-title" style={{ fontSize: '18px', marginTop: '32px', marginBottom: '16px' }}>
        {ru.activity.logBtn}
      </h3>
      <div className="web-card logger-card">
        <form onSubmit={handleLogBiometrics} className="biometrics-form">
          <div className="slider-group">
            <div className="slider-label-row">
              <span className="label-icon-block">
                <Smile size={15} style={{ color: 'var(--mykora-forest)' }} />
                <span>Настроение</span>
              </span>
              <span className="slider-val">{mood}/10</span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="10" 
              value={mood} 
              onChange={e => setMood(Number(e.target.value))} 
              className="range-slider"
            />
          </div>

          <div className="slider-group">
            <div className="slider-label-row">
              <span className="label-icon-block">
                <Moon size={15} style={{ color: 'var(--mykora-ink)' }} />
                <span>Сон</span>
              </span>
              <span className="slider-val">{sleep}/10</span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="10" 
              value={sleep} 
              onChange={e => setSleep(Number(e.target.value))} 
              className="range-slider"
            />
          </div>

          <div className="slider-group">
            <div className="slider-label-row">
              <span className="label-icon-block">
                <Brain size={15} style={{ color: 'var(--mykora-orange)' }} />
                <span>Фокус</span>
              </span>
              <span className="slider-val">{focus}/10</span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="10" 
              value={focus} 
              onChange={e => setFocus(Number(e.target.value))} 
              className="range-slider"
            />
          </div>

          <div className="slider-group">
            <div className="slider-label-row">
              <span className="label-icon-block">
                <Zap size={15} style={{ color: '#E91E63' }} />
                <span>Энергия</span>
              </span>
              <span className="slider-val">{energy}/10</span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="10" 
              value={energy} 
              onChange={e => setEnergy(Number(e.target.value))} 
              className="range-slider"
            />
          </div>

          <button type="submit" className="web-button-primary log-btn" disabled={isLogged}>
            {isLogged ? (
              <>
                <CheckCircle2 size={16} style={{ marginRight: '6px' }} />
                <span>Сохранено!</span>
              </>
            ) : (
              <span>Записать состояние</span>
            )}
          </button>
        </form>
      </div>

      <h3 className="web-section-title" style={{ fontSize: '18px', marginTop: '32px', marginBottom: '16px' }}>
        История состояний
      </h3>
      <div className="historical-logs">
        {bioLogs.map((log, idx) => (
          <div key={idx} className="web-card log-history-card">
            <div className="log-history-header">
              <span className="log-date"><Calendar size={12} /> {log.date}</span>
              <span className="compliance-percentage-meta">Выполнение: {getComplianceForDay(log.date)}%</span>
            </div>
            <div className="scores-grid">
              <div className="small-score">
                <span className="score-lbl">Настроение</span>
                <span className="score-num">{log.mood}</span>
              </div>
              <div className="small-score">
                <span className="score-lbl">Сон</span>
                <span className="score-num">{log.sleep}</span>
              </div>
              <div className="small-score">
                <span className="score-lbl">Фокус</span>
                <span className="score-num">{log.focus}</span>
              </div>
              <div className="small-score">
                <span className="score-lbl">Энергия</span>
                <span className="score-num">{log.energy}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .activity-view {
          padding: 20px;
          padding-bottom: 80px;
        }

        .analytics-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          margin-bottom: 24px;
        }

        .stat-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 16px;
          gap: 4px;
        }

        .stat-label {
          font-family: "Bounded", system-ui, sans-serif;
          font-size: 9px;
          text-transform: uppercase;
          color: var(--mykora-muted);
          letter-spacing: 0.5px;
        }

        .stat-val {
          font-family: "Bounded", system-ui, sans-serif;
          font-size: 24px;
          color: var(--mykora-ink);
        }

        .stat-desc {
          font-size: 10px;
          color: var(--mykora-muted);
        }

        .chart-card {
          padding: 20px 14px 12px 14px;
          margin-bottom: 24px;
        }

        .chart-container {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          height: 120px;
          padding-top: 10px;
        }

        .chart-bar-column {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          flex: 1;
        }

        .bar-val {
          font-family: "Bounded", system-ui, sans-serif;
          font-size: 9px;
          color: var(--mykora-muted);
        }

        .bar-track {
          width: 14px;
          height: 80px;
          background: var(--mykora-surface-muted);
          border-radius: 4px;
          overflow: hidden;
          position: relative;
          display: flex;
          align-items: flex-end;
        }

        .bar-fill {
          width: 100%;
          border-radius: 4px;
          transition: height 0.5s ease;
        }

        .bar-label {
          font-family: "Bounded", system-ui, sans-serif;
          font-size: 10px;
          color: var(--mykora-ink);
        }

        .logger-card {
          margin-bottom: 24px;
        }

        .biometrics-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .slider-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .slider-label-row {
          display: flex;
          justify-content: space-between;
          font-size: 13px;
          font-weight: 600;
          color: var(--mykora-ink);
        }

        .label-icon-block {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .slider-val {
          color: var(--mykora-orange);
          font-family: "Bounded", system-ui, sans-serif;
        }

        .range-slider {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 6px;
          background: var(--mykora-surface-muted);
          border-radius: 3px;
          outline: none;
        }

        .range-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: var(--mykora-orange);
          cursor: pointer;
        }

        .range-slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: var(--mykora-orange);
          cursor: pointer;
        }

        .log-btn {
          width: 100%;
          margin-top: 8px;
        }

        .historical-logs {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .log-history-card {
          padding: 16px;
        }

        .log-history-header {
          display: flex;
          justify-content: space-between;
          font-size: 11px;
          color: var(--mykora-muted);
          margin-bottom: 12px;
          border-bottom: 1px solid var(--mykora-border);
          padding-bottom: 8px;
        }

        .log-date {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .scores-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          text-align: center;
        }

        .small-score {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .score-lbl {
          font-size: 10px;
          color: var(--mykora-muted);
        }

        .score-num {
          font-family: "Bounded", system-ui, sans-serif;
          font-size: 14px;
          color: var(--mykora-ink);
        }
      `}</style>
    </div>
  );
};
