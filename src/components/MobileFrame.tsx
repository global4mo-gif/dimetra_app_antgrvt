import React, { useEffect, useState } from 'react';

interface MobileFrameProps {
  children: React.ReactNode;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({ children }) => {
  const [time, setTime] = useState('12:00');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours().toString().padStart(2, '0');
      let minutes = now.getMinutes().toString().padStart(2, '0');
      setTime(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="app-container">
      <div className="mobile-header-status">
        <span className="time">{time}</span>
        <div className="status-icons">
          <svg className="icon" viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
            <path d="M12 3c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61L4.35 19.4c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0l1.9-1.9C9.22 19.58 10.57 20 12 20c4.97 0 9-4.03 9-9s-4.03-9-9-9zm0 15c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"/>
          </svg>
          <svg className="icon" viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
            <path d="M2 22h20V2z"/>
          </svg>
          <svg className="icon" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M17 5H3a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2zm4 4v6h1.5a.5.5 0 00.5-.5v-5a.5.5 0 00-.5-.5H21z"/>
          </svg>
        </div>
      </div>

      <div className="app-content-wrapper">
        {children}
      </div>
      
      <style>{`
        .app-container {
          background-color: var(--mykora-canvas);
          min-height: 100vh;
          position: relative;
        }

        .app-content-wrapper {
          height: 100vh;
          overflow-y: auto;
          position: relative;
        }

        .mobile-header-status {
          display: none;
          justify-content: space-between;
          align-items: center;
          padding: 14px 24px 4px 24px;
          font-size: 13px;
          font-weight: 500;
          font-family: system-ui, -apple-system, sans-serif;
          color: var(--mykora-ink);
          z-index: 999;
          position: absolute;
          width: 100%;
          left: 0;
          top: 0;
          pointer-events: none;
        }

        .mobile-header-status .status-icons {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .mobile-header-status .icon {
          opacity: 0.9;
        }

        @media (min-width: 450px) {
          .app-container {
            width: 390px;
            height: 844px;
            min-height: auto;
            margin: 40px auto;
            border-radius: 4px;
            box-shadow: 0 0 0 1px var(--mykora-border), 0 20px 40px rgba(0,0,0,0.05);
            overflow: hidden;
            background: var(--mykora-canvas);
          }

          .app-content-wrapper {
            height: 100%;
            padding-top: 40px;
          }

          .mobile-header-status {
            display: flex;
            top: 2px;
          }
        }
      `}</style>
    </div>
  );
};
