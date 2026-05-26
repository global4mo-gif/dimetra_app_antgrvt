import React from 'react';
import { Activity, Camera, Dna, CalendarDays, User } from 'lucide-react';
import { ru } from '../i18n/ru';

export type TabType = 'dashboard' | 'calendar' | 'stack' | 'labs' | 'twin';

interface BottomNavProps {
  currentTab: TabType;
  setTab: (tab: TabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, setTab }) => {
  const navItems = [
    { id: 'dashboard' as TabType, label: ru.nav.dashboard, icon: Activity },
    { id: 'calendar' as TabType, label: ru.nav.calendar, icon: CalendarDays },
    { id: 'stack' as TabType, label: ru.nav.stack, icon: Camera, isCenter: true },
    { id: 'labs' as TabType, label: ru.nav.labs, icon: Dna },
    { id: 'twin' as TabType, label: ru.nav.twin, icon: User },
  ];

  return (
    <div className="bottom-nav">
      {navItems.map((item) => {
        const IconComponent = item.icon;
        const isActive = currentTab === item.id;
        
        if (item.isCenter) {
          return (
            <button
              key={item.id}
              className="nav-item center-fab"
              onClick={() => setTab(item.id)}
              aria-label={item.label}
            >
              <div className="fab-inner">
                <IconComponent size={24} strokeWidth={2} color="white" />
              </div>
              <span className="nav-label" style={{ marginTop: '30px' }}>{item.label}</span>
            </button>
          );
        }

        return (
          <button
            key={item.id}
            className={`nav-item ${isActive ? 'active' : ''}`}
            onClick={() => setTab(item.id)}
            aria-label={item.label}
          >
            <IconComponent size={20} strokeWidth={isActive ? 2 : 1.5} />
            <span className="nav-label">{item.label}</span>
          </button>
        );
      })}

      <style>{`
        .bottom-nav {
          display: flex;
          justify-content: space-around;
          align-items: center;
          background: var(--mykora-surface);
          border-top: 1px solid var(--mykora-border);
          padding: 8px 8px calc(8px + env(safe-area-inset-bottom)) 8px;
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          z-index: 100;
        }

        .nav-item {
          background: none;
          border: none;
          color: var(--mykora-muted);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          cursor: pointer;
          flex: 1;
          padding: 6px 0;
          transition: all 0.2s ease;
          position: relative;
        }

        .nav-item:hover {
          color: var(--mykora-ink);
        }

        .nav-item.active {
          color: var(--mykora-orange);
        }

        .center-fab {
          position: relative;
          top: -12px;
        }

        .fab-inner {
          position: absolute;
          top: -24px;
          background: var(--mykora-orange);
          width: 48px;
          height: 48px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(247, 110, 0, 0.3);
          transition: transform 0.2s ease;
        }

        .center-fab:active .fab-inner {
          transform: scale(0.95);
        }

        .nav-label {
          font-family: "Bounded", system-ui, sans-serif;
          font-size: 9px;
          font-weight: 500;
          letter-spacing: 0.02em;
          text-transform: uppercase;
        }

        @media (min-width: 450px) {
          .bottom-nav {
            border-bottom-left-radius: 4px;
            border-bottom-right-radius: 4px;
            padding-bottom: 12px;
          }
        }
      `}</style>
    </div>
  );
};
