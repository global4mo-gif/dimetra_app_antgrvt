import React from 'react';
import { Activity, Camera, Dna, Layers, Users } from 'lucide-react';
import { ru } from '../i18n/ru';

export type TabType = 'dashboard' | 'scanner' | 'labs' | 'stack' | 'community';

interface BottomNavProps {
  currentTab: TabType;
  setTab: (tab: TabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, setTab }) => {
  const navItems = [
    { id: 'dashboard' as TabType, label: ru.nav.dashboard, icon: Activity },
    { id: 'scanner' as TabType, label: ru.nav.scanner, icon: Camera },
    { id: 'stack' as TabType, label: ru.nav.stack, icon: Layers },
    { id: 'labs' as TabType, label: ru.nav.labs, icon: Dna },
    { id: 'community' as TabType, label: ru.nav.community, icon: Users },
  ];

  return (
    <div className="bottom-nav">
      {navItems.map((item) => {
        const IconComponent = item.icon;
        const isActive = currentTab === item.id;
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
        }

        .nav-item:hover {
          color: var(--mykora-ink);
        }

        .nav-item.active {
          color: var(--mykora-orange);
        }

        .nav-label {
          font-family: "Bounded", system-ui, sans-serif;
          font-size: 10px;
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
