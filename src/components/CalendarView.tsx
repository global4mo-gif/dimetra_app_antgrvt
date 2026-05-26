import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import type { Supplement, AdherenceHistory } from '../hooks/useAppStore';

interface CalendarViewProps {
  supplements: Supplement[];
  adherence: AdherenceHistory;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ supplements, adherence }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 is Sunday
  
  // Adjust for Monday start
  const startingDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  const monthNames = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ];

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const renderCalendarDays = () => {
    const days = [];
    
    // Empty cells before the 1st
    for (let i = 0; i < startingDay; i++) {
      days.push(<div key={`empty-${i}`} className="cal-day empty"></div>);
    }

    // Days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      
      // Calculate how many items are scheduled for this day
      let scheduledCount = 0;
      let completedCount = 0;

      supplements.forEach(supp => {
        if (!supp.active) return;
        
        // Cycle logic
        if (supp.frequency === 'cycle' && supp.cycleDaysOn && supp.cycleDaysOff && supp.cycleStartDate) {
          const start = new Date(supp.cycleStartDate);
          const current = new Date(dateStr);
          const diffTime = current.getTime() - start.getTime();
          const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
          
          if (diffDays >= 0) {
            const cycleLength = supp.cycleDaysOn + supp.cycleDaysOff;
            const dayInCycle = diffDays % cycleLength;
            if (dayInCycle < supp.cycleDaysOn) {
              scheduledCount += supp.times.length;
              completedCount += adherence[dateStr]?.[supp.id]?.length || 0;
            }
          }
        } else {
          scheduledCount += supp.times.length;
          completedCount += adherence[dateStr]?.[supp.id]?.length || 0;
        }
      });

      let statusClass = 'status-none';
      if (scheduledCount > 0) {
        if (completedCount === 0) statusClass = 'status-pending';
        else if (completedCount < scheduledCount) statusClass = 'status-partial';
        else statusClass = 'status-complete';
      }

      // Is it today?
      const isToday = new Date().toISOString().split('T')[0] === dateStr;

      days.push(
        <div key={i} className={`cal-day ${isToday ? 'today' : ''} ${statusClass}`}>
          <span className="day-number">{i}</span>
          {scheduledCount > 0 && (
            <div className="day-dots">
              <div className="dot"></div>
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="calendar-view scrollable app-content-wrapper">
      <div className="calendar-header">
        <h2 className="web-title" style={{ fontSize: '28px', marginBottom: '8px' }}>Расписание</h2>
        <p style={{ color: 'var(--mykora-muted)', fontSize: '13px' }}>Ваши протоколы и процедуры</p>
      </div>

      <div className="web-card calendar-card">
        <div className="month-nav">
          <button onClick={prevMonth} className="nav-btn"><ChevronLeft size={20} /></button>
          <span className="month-name">{monthNames[month]} {year}</span>
          <button onClick={nextMonth} className="nav-btn"><ChevronRight size={20} /></button>
        </div>

        <div className="weekdays">
          <span>Пн</span><span>Вт</span><span>Ср</span><span>Чт</span><span>Пт</span><span>Сб</span><span>Вс</span>
        </div>

        <div className="days-grid">
          {renderCalendarDays()}
        </div>
      </div>

      <div className="upcoming-section">
        <h3 className="web-section-title" style={{ marginTop: '24px', marginBottom: '16px', fontSize: '18px' }}>План на сегодня</h3>
        <button className="web-button-secondary" style={{ width: '100%', marginBottom: '16px' }}>
          <Plus size={16} style={{ marginRight: '8px' }} /> Добавить процедуру
        </button>
        
        {/* Placeholder for today's specific timeline. In a real app we'd map over the scheduled supplements for today */}
        <div className="timeline-placeholder">
          <p style={{ color: 'var(--mykora-muted)', fontSize: '14px', textAlign: 'center', padding: '20px' }}>
            Здесь будет детальное расписание приемов и процедур на выбранный день.
          </p>
        </div>
      </div>

      <style>{`
        .calendar-view {
          padding: 20px;
          padding-bottom: 90px;
        }

        .calendar-card {
          padding: 16px;
        }

        .month-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .nav-btn {
          background: none;
          border: none;
          color: var(--mykora-ink);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 8px;
          border-radius: 50%;
          transition: background 0.2s ease;
        }

        .nav-btn:hover {
          background: var(--mykora-surface-muted);
        }

        .month-name {
          font-family: "Bounded", system-ui, sans-serif;
          font-size: 16px;
          font-weight: 500;
        }

        .weekdays {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          text-align: center;
          font-size: 10px;
          text-transform: uppercase;
          color: var(--mykora-muted);
          margin-bottom: 12px;
          font-weight: 600;
        }

        .days-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 6px;
        }

        .cal-day {
          aspect-ratio: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          font-size: 14px;
          position: relative;
          cursor: pointer;
          border: 1px solid transparent;
        }

        .cal-day.empty {
          background: transparent;
          cursor: default;
        }

        .cal-day.today {
          border-color: var(--mykora-orange);
          font-weight: bold;
        }

        .status-none {
          background: transparent;
        }

        .status-pending {
          background: var(--mykora-surface-muted);
        }

        .status-partial {
          background: #FFE0B2;
          color: #E65100;
        }

        .status-complete {
          background: #C8E6C9;
          color: #2E7D32;
        }

        .day-dots {
          position: absolute;
          bottom: 4px;
          display: flex;
          gap: 2px;
        }

        .dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: currentColor;
          opacity: 0.6;
        }

        .status-partial .dot { background: #E65100; }
        .status-complete .dot { background: #2E7D32; }
        .status-pending .dot { background: var(--mykora-muted); }
      `}</style>
    </div>
  );
};
