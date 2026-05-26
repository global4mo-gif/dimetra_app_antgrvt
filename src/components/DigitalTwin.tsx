import React from 'react';
import { Shield, Brain, Heart, Activity } from 'lucide-react';
import type { UserProfile, LabTest } from '../hooks/useAppStore';

interface DigitalTwinProps {
  profile: UserProfile;
  labs: LabTest[];
}

export const DigitalTwin: React.FC<DigitalTwinProps> = ({ profile }) => {
  return (
    <div className="twin-view scrollable app-content-wrapper">
      <div className="twin-header">
        <h2 className="web-title" style={{ fontSize: '28px', marginBottom: '8px' }}>Цифровая копия</h2>
        <p style={{ color: 'var(--mykora-muted)', fontSize: '13px' }}>Ваш биологический возраст и статус систем</p>
      </div>

      <div className="web-card bio-age-card">
        <div className="age-circles">
          <div className="chronological">
            <span className="age-label">Паспортный</span>
            <span className="age-value">{profile.age}</span>
          </div>
          <div className="biological">
            <span className="age-label" style={{ color: 'var(--mykora-orange)' }}>Биологический</span>
            <span className="age-value">{Math.max(20, profile.age - 4)}</span>
          </div>
        </div>
        <p className="age-insight">
          Вы на 4 года моложе своего хронологического возраста. Продолжайте поддерживать протоколы метилирования.
        </p>
      </div>

      <h3 className="web-section-title" style={{ marginTop: '32px', marginBottom: '16px', fontSize: '18px' }}>
        Системы организма
      </h3>

      <div className="systems-grid">
        <div className="web-card system-card">
          <Heart size={24} style={{ color: '#E91E63', marginBottom: '8px' }} />
          <span className="system-name">Сердечно-сосудистая</span>
          <div className="system-score optimal">Оптимально (92%)</div>
        </div>
        <div className="web-card system-card">
          <Brain size={24} style={{ color: 'var(--mykora-orange)', marginBottom: '8px' }} />
          <span className="system-name">Нервная система</span>
          <div className="system-score optimal">Оптимально (88%)</div>
        </div>
        <div className="web-card system-card">
          <Activity size={24} style={{ color: '#F44336', marginBottom: '8px' }} />
          <span className="system-name">Метаболизм</span>
          <div className="system-score warning">Внимание (64%)</div>
        </div>
        <div className="web-card system-card">
          <Shield size={24} style={{ color: '#4CAF50', marginBottom: '8px' }} />
          <span className="system-name">Иммунитет</span>
          <div className="system-score optimal">Оптимально (95%)</div>
        </div>
      </div>

      <style>{`
        .twin-view {
          padding: 20px;
          padding-bottom: 90px;
        }

        .bio-age-card {
          padding: 24px;
          text-align: center;
          margin-top: 16px;
        }

        .age-circles {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 32px;
          margin-bottom: 24px;
        }

        .chronological, .biological {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .age-label {
          font-family: "Bounded", system-ui, sans-serif;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: var(--mykora-muted);
          margin-bottom: 8px;
        }

        .age-value {
          font-family: "Bounded", system-ui, sans-serif;
          font-size: 48px;
          color: var(--mykora-ink);
          line-height: 1;
        }

        .biological .age-value {
          color: var(--mykora-orange);
        }

        .age-insight {
          font-size: 13px;
          color: var(--mykora-ink);
          line-height: 1.5;
          padding-top: 16px;
          border-top: 1px solid var(--mykora-border);
        }

        .systems-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .system-card {
          padding: 16px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .system-name {
          font-family: "Bounded", system-ui, sans-serif;
          font-size: 13px;
          font-weight: 500;
          margin-bottom: 4px;
        }

        .system-score {
          font-size: 11px;
          font-weight: 600;
        }

        .system-score.optimal { color: #2E7D32; }
        .system-score.warning { color: #E65100; }
        .system-score.danger { color: #C62828; }
      `}</style>
    </div>
  );
};
