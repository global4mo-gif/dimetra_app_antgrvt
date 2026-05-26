import React, { useState, useRef } from 'react';
import { Layers, Plus, Trash2, ShieldAlert, Play, Pause, Camera } from 'lucide-react';
import type { Supplement } from '../hooks/useAppStore';
import { ru } from '../i18n/ru';

interface StackManagerProps {
  supplements: Supplement[];
  addSupplement: (supp: Omit<Supplement, 'id'>) => void;
  deleteSupplement: (id: string) => void;
  toggleSupplementActive: (id: string) => void;
  onOpenScanner?: () => void;
}

export const StackManager: React.FC<StackManagerProps> = ({
  supplements,
  addSupplement,
  deleteSupplement,
  toggleSupplementActive,
  onOpenScanner
}) => {
  const [filterType, setFilterType] = useState<'all' | 'supplement' | 'peptide' | 'pharma' | 'cosmetic'>('all');

  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [type, setType] = useState<'supplement' | 'peptide' | 'pharma' | 'cosmetic'>('supplement');
  const [dosage, setDosage] = useState('');
  const [times, setTimes] = useState<string[]>(['morning']);
  const [instructions, setInstructions] = useState('');
  const [stock, setStock] = useState<number | undefined>(60);
  const [notes, setNotes] = useState('');

  const [cycleDaysOn, setCycleDaysOn] = useState(5);
  const [cycleDaysOff, setCycleDaysOff] = useState(2);

  const dialogRef = useRef<HTMLDialogElement>(null);

  const filteredSupplements = supplements.filter(s => {
    if (filterType === 'all') return true;
    return s.type === filterType;
  });

  const handleTimeToggle = (t: string) => {
    if (times.includes(t)) {
      setTimes(times.filter(item => item !== t));
    } else {
      setTimes([...times, t]);
    }
  };

  const openManualModal = () => {
    setName('');
    setBrand('');
    setType('supplement');
    setDosage('');
    setTimes(['morning']);
    setInstructions('');
    setStock(60);
    setNotes('');
    setCycleDaysOn(5);
    setCycleDaysOff(2);
    dialogRef.current?.showModal();
  };

  const handleManualAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !dosage) return;

    addSupplement({
      name,
      brand,
      type,
      dosage,
      times,
      instructions,
      stock,
      totalStock: stock,
      notes,
      active: true,
      frequency: type === 'peptide' ? 'cycle' : 'daily',
      cycleDaysOn: type === 'peptide' ? cycleDaysOn : undefined,
      cycleDaysOff: type === 'peptide' ? cycleDaysOff : undefined,
      cycleStartDate: type === 'peptide' ? new Date().toISOString().split('T')[0] : undefined
    });

    dialogRef.current?.close();
  };

  const getCycleProgress = (supp: Supplement) => {
    if (supp.frequency !== 'cycle' || !supp.cycleDaysOn || !supp.cycleDaysOff || !supp.cycleStartDate) return null;
    
    const start = new Date(supp.cycleStartDate);
    const today = new Date();
    const diffTime = today.getTime() - start.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Цикл скоро начнется';
    
    const cycleLength = supp.cycleDaysOn + supp.cycleDaysOff;
    const dayInCycle = diffDays % cycleLength;
    const activeCycleNum = Math.floor(diffDays / cycleLength) + 1;
    
    if (dayInCycle < supp.cycleDaysOn) {
      return `Цикл ${activeCycleNum} • День ${dayInCycle + 1} из ${supp.cycleDaysOn} (ON)`;
    } else {
      const offDay = dayInCycle - supp.cycleDaysOn + 1;
      return `Цикл ${activeCycleNum} • Отдых ${offDay} из ${supp.cycleDaysOff} (OFF)`;
    }
  };

  return (
    <div className="stack-view scrollable app-content-wrapper">
      <div className="stack-header">
        <h2 className="web-title" style={{ fontSize: '32px', marginBottom: '8px' }}>{ru.stack.title}</h2>
      </div>

      <button className="web-button-primary" style={{ padding: '8px 16px', fontSize: '13px' }} onClick={() => onOpenScanner && onOpenScanner()}>
        <Camera size={16} style={{ marginRight: '6px' }} />
        {ru.stack.addBtn}
      </button>

      <div className="filter-tabs">
        {(['all', 'supplement', 'peptide', 'pharma', 'cosmetic'] as const).map((t) => {
          let label = 'Все';
          if (t === 'supplement') label = ru.stack.supplements;
          if (t === 'peptide') label = ru.stack.peptides;
          if (t === 'pharma') label = ru.stack.pharma;
          if (t === 'cosmetic') label = ru.stack.cosmetics;

          return (
            <button
              key={t}
              className={`filter-pill ${filterType === t ? 'active' : ''}`}
              onClick={() => setFilterType(t)}
            >
              {label}
            </button>
          );
        })}
      </div>

      <div className="supplements-list">
        {filteredSupplements.map((supp) => {
          const isLowStock = supp.stock !== undefined && supp.stock <= 10;
          const cycleDetail = getCycleProgress(supp);

          return (
            <div key={supp.id} className={`web-card stack-card ${!supp.active ? 'paused' : ''}`}>
              <div className="card-top">
                <div className="title-block">
                  <span className={`badge badge-${supp.type}`}>{supp.type === 'cosmetic' ? ru.stack.cosmetics : supp.type}</span>
                  <h4>{supp.name}</h4>
                  <span className="brand-text">{supp.brand}</span>
                </div>
                <div className="card-actions">
                  <button 
                    className="action-btn" 
                    onClick={() => toggleSupplementActive(supp.id)}
                  >
                    {supp.active ? <Pause size={15} /> : <Play size={15} />}
                  </button>
                  <button 
                    className="action-btn delete-btn" 
                    onClick={() => deleteSupplement(supp.id)}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              <div className="card-body">
                <div className="detail-row">
                  <span className="label">{ru.stack.dosage}</span>
                  <span className="value font-semi">{supp.dosage}</span>
                </div>
                {supp.instructions && (
                  <div className="detail-row">
                    <span className="label">Правила:</span>
                    <span className="value text-instructions">{supp.instructions}</span>
                  </div>
                )}
                <div className="detail-row">
                  <span className="label">{ru.stack.schedule}</span>
                  <div className="timings-badges">
                    {supp.times.map(time => {
                      let tLabel = time;
                      if (time === 'morning') tLabel = ru.dashboard.morning;
                      if (time === 'afternoon') tLabel = ru.dashboard.afternoon;
                      if (time === 'evening') tLabel = ru.dashboard.evening;
                      if (time === 'bedtime') tLabel = ru.dashboard.bedtime;
                      return (
                        <span key={time} className={`timing-badge`}>{tLabel.toUpperCase()}</span>
                      );
                    })}
                  </div>
                </div>

                {supp.stock !== undefined && (
                  <div className={`detail-row stock-row ${isLowStock ? 'low-stock' : ''}`}>
                    <span className="label">{ru.stack.stock}</span>
                    <span className="value">
                      {supp.stock} / {supp.totalStock} {ru.stack.days}
                      {isLowStock && (
                        <span className="stock-warning">
                          <ShieldAlert size={12} />
                        </span>
                      )}
                    </span>
                  </div>
                )}

                {cycleDetail && (
                  <div className="detail-row cycle-row">
                    <span className="label">Цикл:</span>
                    <span className="value cycle-val">{cycleDetail}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {filteredSupplements.length === 0 && (
          <div className="empty-stack-state web-card">
            <Layers size={36} style={{ color: 'var(--mykora-muted)' }} />
            <p>{ru.stack.empty}</p>
          </div>
        )}
      </div>

      <dialog ref={dialogRef} className="modal-dialog manual-add-dialog">
        <div className="dialog-header">
          <h3>Ручное добавление</h3>
        </div>

        <form onSubmit={handleManualAddSubmit} method="dialog" className="confirm-form">
          <div className="form-group">
            <label>Название</label>
            <input 
              type="text" 
              className="input-field" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Бренд</label>
            <input 
              type="text" 
              className="input-field" 
              value={brand} 
              onChange={(e) => setBrand(e.target.value)}
            />
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label>Категория</label>
              <select 
                className="input-field select-field" 
                value={type}
                onChange={(e) => setType(e.target.value as any)}
              >
                <option value="supplement">БАД</option>
                <option value="peptide">Пептид</option>
                <option value="pharma">Фарма</option>
                <option value="cosmetic">Косметика</option>
              </select>
            </div>
            <div className="form-group">
              <label>Остаток</label>
              <input 
                type="number" 
                className="input-field" 
                value={stock} 
                onChange={(e) => setStock(Number(e.target.value))}
              />
            </div>
          </div>

          {type === 'peptide' && (
            <div className="form-row-2">
              <div className="form-group">
                <label>Дней ON</label>
                <input 
                  type="number" 
                  className="input-field" 
                  value={cycleDaysOn} 
                  onChange={(e) => setCycleDaysOn(Number(e.target.value))}
                />
              </div>
              <div className="form-group">
                <label>Дней OFF</label>
                <input 
                  type="number" 
                  className="input-field" 
                  value={cycleDaysOff} 
                  onChange={(e) => setCycleDaysOff(Number(e.target.value))}
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label>Дозировка</label>
            <input 
              type="text" 
              className="input-field" 
              value={dosage} 
              onChange={(e) => setDosage(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Время приема</label>
            <div className="timing-checkboxes" style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
              {['morning', 'afternoon', 'evening', 'bedtime'].map(t => (
                <button
                  key={t}
                  type="button"
                  className={`timing-pill ${times.includes(t) ? 'active' : ''}`}
                  onClick={() => handleTimeToggle(t)}
                >
                  {t.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Инструкции</label>
            <input 
              type="text" 
              className="input-field" 
              value={instructions} 
              onChange={(e) => setInstructions(e.target.value)}
            />
          </div>

          <div className="dialog-actions" style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
            <button 
              type="button" 
              className="web-button-secondary" 
              onClick={() => dialogRef.current?.close()}
              style={{ flex: 1 }}
            >
              Отмена
            </button>
            <button type="submit" className="web-button-primary" style={{ flex: 1 }}>
              Сохранить
            </button>
          </div>
        </form>
      </dialog>

      <style>{`
        .stack-view {
          padding: 20px;
          padding-bottom: 80px;
        }

        .stack-header {
          margin-bottom: 24px;
        }

        .add-manual-btn {
          width: 100%;
          margin-bottom: 24px;
        }

        .filter-tabs {
          display: flex;
          gap: 8px;
          margin-bottom: 24px;
          overflow-x: auto;
          scrollbar-width: none;
        }

        .filter-tabs::-webkit-scrollbar {
          display: none;
        }

        .filter-pill {
          background: var(--mykora-surface-muted);
          border: 1px solid var(--mykora-border);
          color: var(--mykora-ink);
          padding: 8px 16px;
          border-radius: 4px;
          font-family: "Bounded", system-ui, sans-serif;
          font-size: 11px;
          text-transform: uppercase;
          cursor: pointer;
          flex-shrink: 0;
          transition: all 0.2s ease;
        }

        .filter-pill.active {
          background: var(--mykora-orange);
          border-color: var(--mykora-orange);
          color: #fff;
        }

        .supplements-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .stack-card {
          padding: 16px;
          background: var(--mykora-surface);
        }

        .stack-card.paused {
          opacity: 0.6;
          background: var(--mykora-canvas);
        }

        .card-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
          border-bottom: 1px solid var(--mykora-border);
          padding-bottom: 12px;
        }

        .title-block {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .badge {
          display: inline-block;
          font-family: "Bounded", system-ui, sans-serif;
          font-size: 9px;
          text-transform: uppercase;
          padding: 2px 6px;
          border-radius: 2px;
          background: var(--mykora-surface-muted);
          width: max-content;
          color: var(--mykora-muted);
        }

        .badge-peptide { background: var(--mykora-forest-soft); color: #fff; }
        .badge-cosmetic { background: var(--mykora-orange); color: #fff; }
        .badge-pharma { background: var(--mykora-ink); color: #fff; }

        .title-block h4 {
          font-size: 16px;
          font-weight: 600;
          color: var(--mykora-ink);
          line-height: 1.2;
        }

        .brand-text {
          font-size: 12px;
          color: var(--mykora-muted);
        }

        .card-actions {
          display: flex;
          gap: 8px;
        }

        .action-btn {
          background: var(--mykora-surface-muted);
          border: 1px solid var(--mykora-border);
          color: var(--mykora-ink);
          width: 32px;
          height: 32px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .action-btn:hover {
          background: var(--mykora-border);
        }

        .delete-btn:hover {
          color: #fff;
          background: #d32f2f;
          border-color: #d32f2f;
        }

        .card-body {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          font-size: 13px;
          align-items: center;
        }

        .detail-row .label {
          color: var(--mykora-muted);
          font-size: 12px;
        }

        .detail-row .value {
          color: var(--mykora-ink);
        }

        .detail-row .value.font-semi {
          font-weight: 600;
        }

        .text-instructions {
          color: var(--mykora-forest-soft);
        }

        .timings-badges {
          display: flex;
          gap: 4px;
        }

        .timing-badge {
          font-family: "Bounded", system-ui, sans-serif;
          font-size: 9px;
          padding: 2px 6px;
          border-radius: 2px;
          background: var(--mykora-surface-muted);
          color: var(--mykora-ink);
        }

        .empty-stack-state {
          padding: 40px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        /* Modal specific */
        .modal-dialog {
          border: 1px solid var(--mykora-border);
          border-radius: 8px;
          padding: 24px;
          background: var(--mykora-surface);
          width: 90%;
          max-width: 400px;
        }
        .modal-dialog::backdrop {
          background: rgba(0,0,0,0.5);
        }
        .form-group {
          margin-bottom: 12px;
        }
        .form-group label {
          display: block;
          font-size: 12px;
          margin-bottom: 4px;
          color: var(--mykora-muted);
        }
        .input-field {
          width: 100%;
          padding: 10px;
          border: 1px solid var(--mykora-border);
          border-radius: 4px;
          font-family: inherit;
          background: var(--mykora-canvas);
        }
        .timing-pill {
          padding: 6px 12px;
          border: 1px solid var(--mykora-border);
          background: var(--mykora-surface);
          border-radius: 4px;
          font-size: 10px;
          font-family: "Bounded", system-ui, sans-serif;
          cursor: pointer;
        }
        .timing-pill.active {
          background: var(--mykora-orange);
          color: white;
          border-color: var(--mykora-orange);
        }
      `}</style>
    </div>
  );
};
