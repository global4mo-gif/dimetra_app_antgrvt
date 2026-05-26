import React, { useState, useRef } from 'react';
import { Camera, Upload, RefreshCw, CheckCircle, Info, Plus } from 'lucide-react';
import type { Supplement } from '../hooks/useAppStore';
import { ru } from '../i18n/ru';

interface ScannerProps {
  addSupplement: (supp: Omit<Supplement, 'id'>) => string;
}

interface MockPreset {
  name: string;
  brand: string;
  type: 'supplement' | 'peptide' | 'pharma' | 'cosmetic';
  dosage: string;
  times: string[];
  instructions: string;
  stock: number;
  totalStock: number;
  notes: string;
  imageLabel: string;
}

const PRESETS: MockPreset[] = [
  {
    name: 'Биоконцентрат Летипоруса',
    brand: 'MYKORA',
    type: 'supplement',
    dosage: '25 мл',
    times: ['morning'],
    instructions: 'Натощак',
    stock: 30,
    totalStock: 30,
    notes: 'Энергия и биодоступность',
    imageLabel: 'MYKORA Летипорус (Флакон)'
  },
  {
    name: 'Сыворотка Клеточной Регенерации',
    brand: 'MYKORA',
    type: 'cosmetic',
    dosage: '3 капли',
    times: ['evening'],
    instructions: 'Нанести на лицо',
    stock: 100,
    totalStock: 100,
    notes: 'Восстановление барьера',
    imageLabel: 'MYKORA Косметика (Сыворотка)'
  },
  {
    name: 'Пептид BPC-157',
    brand: 'BioPrime',
    type: 'peptide',
    dosage: '250 мкг',
    times: ['morning', 'bedtime'],
    instructions: 'Для суставов',
    stock: 30,
    totalStock: 30,
    notes: 'Регенерация тканей',
    imageLabel: 'BPC-157 (Пептид)'
  }
];

export const Scanner: React.FC<ScannerProps> = ({ addSupplement }) => {
  const [scanning, setScanning] = useState(false);
  const [scanStep, setScanStep] = useState<'idle' | 'analyzing' | 'complete'>('idle');
  const [scannedResult, setScannedResult] = useState<MockPreset | null>(null);
  const [showToast, setShowToast] = useState(false);

  const [formName, setFormName] = useState('');
  const [formBrand, setFormBrand] = useState('');
  const [formType, setFormType] = useState<'supplement' | 'peptide' | 'pharma' | 'cosmetic'>('supplement');
  const [formDosage, setFormDosage] = useState('');
  const [formTimes, setFormTimes] = useState<string[]>([]);
  const [formInstructions, setFormInstructions] = useState('');
  const [formStock, setFormStock] = useState(60);
  const [formNotes, setFormNotes] = useState('');
  
  const [fileName, setFileName] = useState('');
  const dialogRef = useRef<HTMLDialogElement>(null);

  const startScan = (preset: MockPreset) => {
    setScanning(true);
    setScanStep('analyzing');
    setScannedResult(preset);
    
    setTimeout(() => {
      setScanStep('complete');
      setTimeout(() => {
        setFormName(preset.name);
        setFormBrand(preset.brand);
        setFormType(preset.type);
        setFormDosage(preset.dosage);
        setFormTimes(preset.times);
        setFormInstructions(preset.instructions);
        setFormStock(preset.stock);
        setFormNotes(preset.notes);
        
        setScanning(false);
        setScanStep('idle');
        dialogRef.current?.showModal();
      }, 800);
    }, 2200);
  };

  const handleCustomUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const customPreset: MockPreset = {
        name: file.name.split('.')[0].replace(/[-_]/g, ' ') || 'Распознанный продукт',
        brand: 'Извлечено ИИ',
        type: 'supplement',
        dosage: 'Извлеченная порция',
        times: ['morning'],
        instructions: '',
        stock: 60,
        totalStock: 60,
        notes: '',
        imageLabel: 'Пользовательское фото'
      };
      startScan(customPreset);
    }
  };

  const handleTimeToggle = (time: string) => {
    if (formTimes.includes(time)) {
      setFormTimes(formTimes.filter(t => t !== time));
    } else {
      setFormTimes([...formTimes, time]);
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName) return;

    addSupplement({
      name: formName,
      brand: formBrand,
      type: formType,
      dosage: formDosage,
      times: formTimes.length > 0 ? formTimes : ['morning'],
      instructions: formInstructions,
      stock: formStock,
      totalStock: formStock,
      notes: formNotes,
      active: true,
      frequency: formType === 'peptide' ? 'cycle' : 'daily',
      cycleDaysOn: formType === 'peptide' ? 5 : undefined,
      cycleDaysOff: formType === 'peptide' ? 2 : undefined,
      cycleStartDate: formType === 'peptide' ? new Date().toISOString().split('T')[0] : undefined
    });

    dialogRef.current?.close();
    setFileName('');
    setScannedResult(null);
    
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="scanner-view scrollable app-content-wrapper">
      <div className="scanner-header" style={{ marginBottom: '24px' }}>
        <h2 className="web-title" style={{ fontSize: '32px', marginBottom: '8px' }}>{ru.scanner.title}</h2>
      </div>

      <div className="viewfinder-card web-card">
        {scanning ? (
          <div className="viewfinder-content active-scanning">
            <div className="scan-indicator">
              <RefreshCw size={24} className="spin-icon" style={{ color: 'var(--mykora-orange)' }} />
              <span style={{ color: 'var(--mykora-ink)' }}>{ru.scanner.scanning}</span>
            </div>
            {scannedResult && (
              <div className="scanned-preset-name">
                Сканируется: <strong>{scannedResult.imageLabel}</strong>
              </div>
            )}
          </div>
        ) : (
          <div className="viewfinder-content idle-state">
            <Camera size={44} style={{ color: 'var(--mykora-forest)' }} />
            <span className="viewfinder-prompt">Наведите камеру на этикетку</span>
            
            <label className="web-button-secondary custom-upload-btn" style={{ marginTop: '16px' }}>
              <Upload size={16} style={{ marginRight: '8px' }} />
              <span>{ru.scanner.uploadBtn}</span>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleCustomUpload} 
                style={{ display: 'none' }} 
              />
            </label>
            {fileName && <span className="file-indicator">Загружено: {fileName}</span>}
          </div>
        )}
      </div>

      <div className="warning-banner">
        <Info size={16} />
        <span>{ru.scanner.mockWarning}</span>
      </div>

      <h3 className="web-section-title" style={{ fontSize: '18px', marginTop: '32px', marginBottom: '16px' }}>
        Тестовые образцы (Симуляция)
      </h3>
      <div className="presets-grid">
        {PRESETS.map((preset, index) => (
          <button 
            key={index} 
            className="preset-pill web-card"
            onClick={() => startScan(preset)}
            disabled={scanning}
          >
            <div className="preset-pill-header">
              <span className={`badge`}>{preset.type === 'cosmetic' ? ru.stack.cosmetics : preset.type.toUpperCase()}</span>
            </div>
            <span className="preset-name">{preset.name}</span>
            <div className="preset-dose-summary">{preset.dosage.split('+')[0]}</div>
          </button>
        ))}
      </div>

      <dialog ref={dialogRef} className="modal-dialog">
        <div className="dialog-header">
          <h3 style={{ fontSize: '18px' }}>{ru.scanner.resultsTitle}</h3>
        </div>
        
        <form onSubmit={handleAddSubmit} method="dialog" className="confirm-form">
          <div className="form-group">
            <label>{ru.scanner.product}</label>
            <input 
              type="text" 
              className="input-field" 
              value={formName} 
              onChange={(e) => setFormName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>{ru.scanner.brand}</label>
            <input 
              type="text" 
              className="input-field" 
              value={formBrand} 
              onChange={(e) => setFormBrand(e.target.value)}
            />
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label>Категория</label>
              <select 
                className="input-field select-field" 
                value={formType}
                onChange={(e) => setFormType(e.target.value as any)}
              >
                <option value="supplement">БАД</option>
                <option value="peptide">Пептид</option>
                <option value="pharma">Фарма</option>
                <option value="cosmetic">Косметика</option>
              </select>
            </div>
            <div className="form-group">
              <label>Порций в упаковке</label>
              <input 
                type="number" 
                className="input-field" 
                value={formStock} 
                onChange={(e) => setFormStock(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="form-group">
            <label>{ru.scanner.ingredients}</label>
            <input 
              type="text" 
              className="input-field" 
              value={formDosage} 
              onChange={(e) => setFormDosage(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Расписание приема</label>
            <div className="timing-checkboxes" style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
              {['morning', 'afternoon', 'evening', 'bedtime'].map(t => (
                <button
                  key={t}
                  type="button"
                  className={`timing-pill ${formTimes.includes(t) ? 'active' : ''}`}
                  onClick={() => handleTimeToggle(t)}
                >
                  {t.toUpperCase()}
                </button>
              ))}
            </div>
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
              {ru.scanner.addToStack}
            </button>
          </div>
        </form>
      </dialog>

      {showToast && (
        <div className="success-toast">
          <CheckCircle size={18} />
          <span>Успешно добавлено в стек!</span>
        </div>
      )}

      <style>{`
        .scanner-view {
          padding: 20px;
          padding-bottom: 80px;
        }

        .viewfinder-card {
          margin-bottom: 16px;
          padding: 0;
          overflow: hidden;
          background: var(--mykora-surface-muted);
        }

        .viewfinder-content {
          height: 220px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .idle-state {
          gap: 10px;
        }

        .viewfinder-prompt {
          font-size: 15px;
          font-weight: 600;
          color: var(--mykora-ink);
        }

        .warning-banner {
          background: var(--mykora-surface-muted);
          color: var(--mykora-muted);
          padding: 12px;
          border-radius: 4px;
          font-size: 12px;
          display: flex;
          align-items: flex-start;
          gap: 8px;
          line-height: 1.4;
        }

        .active-scanning {
          background: var(--mykora-canvas);
        }

        .scan-indicator {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
          font-weight: 600;
        }

        .spin-icon {
          animation: spin 1s linear infinite;
        }

        .scanned-preset-name {
          font-size: 12px;
          color: var(--mykora-muted);
          margin-top: 12px;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .presets-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .preset-pill {
          text-align: left;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          padding: 12px;
          gap: 4px;
          height: 100%;
          border: 1px solid var(--mykora-border);
        }

        .preset-pill:disabled {
          opacity: 0.5;
          pointer-events: none;
        }

        .preset-pill-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .badge {
          display: inline-block;
          font-family: "Bounded", system-ui, sans-serif;
          font-size: 9px;
          text-transform: uppercase;
          padding: 2px 6px;
          border-radius: 2px;
          background: var(--mykora-surface-muted);
          color: var(--mykora-muted);
        }

        .preset-name {
          font-size: 13.5px;
          font-weight: 600;
          color: var(--mykora-ink);
          line-height: 1.25;
        }

        .preset-dose-summary {
          font-size: 11px;
          color: var(--mykora-muted);
          margin-top: auto;
        }

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

        .success-toast {
          position: absolute;
          bottom: 74px;
          left: 50%;
          transform: translateX(-50%);
          background: var(--mykora-orange);
          color: #fff;
          border-radius: 4px;
          padding: 10px 16px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 600;
          z-index: 999;
          animation: slide-up-fade 0.3s ease;
        }

        @keyframes slide-up-fade {
          from {
            transform: translate(-50%, 15px);
            opacity: 0;
          }
          to {
            transform: translate(-50%, 0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};
