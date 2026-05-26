import React, { useState } from 'react';
import { FileText, BrainCircuit, Check, Plus, ChevronDown, RefreshCw } from 'lucide-react';
import type { LabTest, LabMarker, Supplement } from '../hooks/useAppStore';
import { ru } from '../i18n/ru';

interface LabAnalyzerProps {
  labs: LabTest[];
  addLabTest: (lab: Omit<LabTest, 'id'>) => void;
  addSupplement: (supp: Omit<Supplement, 'id'>) => string;
}

export const LabAnalyzer: React.FC<LabAnalyzerProps> = ({ labs, addLabTest, addSupplement }) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [selectedLabId, setSelectedLabId] = useState<string>(labs[0]?.id || '');
  const [addedSupps, setAddedSupps] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState('');

  const activeLab = labs.find(l => l.id === selectedLabId) || labs[0];

  const handleMockUpload = (panelType: 'inflammation' | 'hormonal') => {
    setAnalyzing(true);
    setUploadProgress(ru.labs.analyzing);

    setTimeout(() => {
      setUploadProgress(ru.labs.analyzingAi);
      
      setTimeout(() => {
        if (panelType === 'inflammation') {
          addLabTest({
            name: 'Панель воспалений и липидов',
            date: new Date().toISOString().split('T')[0],
            markers: [
              {
                id: 'crp',
                name: 'C-реактивный белок (СРБ)',
                value: 0.6,
                unit: 'мг/л',
                minOptimal: 0.1,
                maxOptimal: 0.9,
                status: 'optimal',
                category: 'inflammation',
                description: 'Системное воспаление находится на оптимальном уровне, снижая окислительный стресс.'
              },
              {
                id: 'ldl',
                name: 'ЛПНП Холестерин',
                value: 128,
                unit: 'мг/дл',
                minOptimal: 50,
                maxOptimal: 99,
                status: 'high',
                category: 'metabolic',
                description: 'Субоптимальный уровень ЛПНП. Высокие показатели могут вести к образованию бляшек.'
              },
              {
                id: 'homocysteine',
                name: 'Гомоцистеин',
                value: 14.2,
                unit: 'мкмоль/л',
                minOptimal: 5.0,
                maxOptimal: 9.0,
                status: 'high',
                category: 'metabolic',
                description: 'Повышенный гомоцистеин указывает на дефицит метилирования.'
              }
            ],
            recommendations: [
              {
                title: 'Добавить Триметилглицин (TMG)',
                description: 'Ваш гомоцистеин повышен (14.2). Ежедневный прием TMG (1г) поможет снизить его.',
                supplementSuggested: {
                  name: 'TMG (Триметилглицин)',
                  brand: 'Life Extension',
                  type: 'supplement',
                  dosage: '1000 мг',
                  times: ['morning'],
                  instructions: 'Во время завтрака'
                }
              },
              {
                title: 'Цитрусовый Бергамот для ЛПНП',
                description: 'Ваш ЛПНП (128) повышен. Цитрусовый бергамот помогает естественным образом ингибировать ГМГ-КоА редуктазу.',
                supplementSuggested: {
                  name: 'Цитрусовый Бергамот',
                  brand: 'Double Wood',
                  type: 'supplement',
                  dosage: '500 мг',
                  times: ['evening'],
                  instructions: 'Перед сном'
                }
              }
            ]
          });
        } else {
          addLabTest({
            name: 'Гормональная панель',
            date: new Date().toISOString().split('T')[0],
            markers: [
              {
                id: 'free-t',
                name: 'Свободный тестостерон',
                value: 18.4,
                unit: 'пг/мл',
                minOptimal: 15.0,
                maxOptimal: 25.0,
                status: 'optimal',
                category: 'hormones',
                description: 'Оптимальный уровень свободного тестостерона поддерживает мышечную массу и фокус.'
              },
              {
                id: 'dhea',
                name: 'DHEA-S',
                value: 168,
                unit: 'мкг/дл',
                minOptimal: 250,
                maxOptimal: 450,
                status: 'low',
                category: 'hormones',
                description: 'DHEA — предшественник гормонов. Низкие уровни связаны с усталостью.'
              },
              {
                id: 'cortisol',
                name: 'Утренний Кортизол',
                value: 22.1,
                unit: 'мкг/дл',
                minOptimal: 8.0,
                maxOptimal: 18.0,
                status: 'high',
                category: 'hormones',
                description: 'Повышенный утренний кортизол указывает на высокую адреналиновую нагрузку.'
              }
            ],
            recommendations: [
              {
                title: 'Ашваганда KSM-66',
                description: 'Ваш Кортизол повышен (22.1). Ашваганда (600мг) снижает сывороточный кортизол.',
                supplementSuggested: {
                  name: 'Ашваганда KSM-66',
                  brand: 'Nootropics Depot',
                  type: 'supplement',
                  dosage: '600 мг',
                  times: ['evening'],
                  instructions: 'За 1 час до сна'
                }
              },
              {
                title: 'Поддержка DHEA',
                description: 'Ваш DHEA-S понижен (168). Рекомендуется микродозинг DHEA (25мг) ежедневно.',
                supplementSuggested: {
                  name: 'Микронизированный DHEA',
                  brand: 'MRM Nutrition',
                  type: 'supplement',
                  dosage: '25 мг',
                  times: ['morning'],
                  instructions: 'Натощак'
                }
              }
            ]
          });
        }
        
        setAnalyzing(false);
        setUploadProgress('');
        if (labs.length > 0) {
          setSelectedLabId(labs[0].id);
        }
      }, 1200);
    }, 1500);
  };

  const handleAddRecommended = (recIndex: number, supp: Partial<Supplement>) => {
    if (!supp.name) return;

    addSupplement({
      name: supp.name,
      brand: supp.brand || 'Bio-Recommended',
      type: supp.type || 'supplement',
      dosage: supp.dosage || '1 unit',
      times: supp.times || ['morning'],
      frequency: supp.frequency || 'daily',
      instructions: supp.instructions || '',
      stock: 60,
      totalStock: 60,
      active: true,
      notes: 'Добавлено из рекомендаций ИИ на основе анализов.'
    });

    setAddedSupps(prev => [...prev, `${activeLab.id}-${recIndex}`]);
  };

  const getRangePercent = (marker: LabMarker) => {
    const min = marker.minOptimal * 0.5;
    const max = marker.maxOptimal * 1.5;
    const val = marker.value;
    const percent = ((val - min) / (max - min)) * 100;
    return Math.min(100, Math.max(0, percent));
  };

  return (
    <div className="labs-view scrollable app-content-wrapper">
      <div className="labs-header" style={{ marginBottom: '24px' }}>
        <h2 className="web-title" style={{ fontSize: '32px', marginBottom: '8px' }}>{ru.labs.title}</h2>
      </div>

      <div className="upload-section web-card" style={{ marginBottom: '24px' }}>
        {analyzing ? (
          <div className="analyzing-state">
            <RefreshCw className="spin-icon" size={32} style={{ color: 'var(--mykora-orange)' }} />
            <span className="analysis-status" style={{ color: 'var(--mykora-ink)' }}>{uploadProgress}</span>
            <div className="progress-bar-container">
              <div className="progress-bar-fill"></div>
            </div>
          </div>
        ) : (
          <div className="upload-actions">
            <div className="upload-desc">
              <FileText className="doc-icon" size={28} style={{ color: 'var(--mykora-forest)' }} />
              <div>
                <h5 style={{ fontSize: '15px', fontWeight: '600' }}>{ru.labs.uploadBtn}</h5>
                <span className="file-desc">{ru.labs.uploadDesc}</span>
              </div>
            </div>
            
            <div className="upload-buttons" style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
              <button 
                className="web-button-secondary mock-btn"
                onClick={() => handleMockUpload('inflammation')}
              >
                + Тест Липиды
              </button>
              <button 
                className="web-button-secondary mock-btn"
                onClick={() => handleMockUpload('hormonal')}
              >
                + Тест Гормоны
              </button>
            </div>
          </div>
        )}
      </div>

      {labs.length > 1 && (
        <div className="lab-selector-dropdown">
          <label htmlFor="lab-select" style={{ fontSize: '12px', color: 'var(--mykora-muted)', textTransform: 'uppercase' }}>
            Выбранная панель:
          </label>
          <select 
            id="lab-select" 
            className="input-field select-field"
            value={selectedLabId}
            onChange={(e) => setSelectedLabId(e.target.value)}
          >
            {labs.map(l => (
              <option key={l.id} value={l.id}>{l.name} ({l.date})</option>
            ))}
          </select>
        </div>
      )}

      {activeLab ? (
        <div className="lab-results-details">
          <div className="lab-title-row">
            <h4 style={{ fontSize: '18px', fontWeight: '600' }}>{activeLab.name}</h4>
            <span className="lab-date">{activeLab.date}</span>
          </div>

          <h5 className="sub-section-title" style={{ fontSize: '14px', marginTop: '24px', marginBottom: '12px', textTransform: 'uppercase' }}>
            Биомаркеры
          </h5>
          <div className="biomarkers-list">
            {activeLab.markers.map((marker) => {
              const rangePercent = getRangePercent(marker);
              const optMinPercent = ((marker.minOptimal - (marker.minOptimal * 0.5)) / ((marker.maxOptimal * 1.5) - (marker.minOptimal * 0.5))) * 100;
              const optMaxPercent = ((marker.maxOptimal - (marker.minOptimal * 0.5)) / ((marker.maxOptimal * 1.5) - (marker.minOptimal * 0.5))) * 100;
              
              const statusColor = marker.status === 'optimal' ? '#4CAF50' : (marker.status === 'low' ? '#F44336' : '#FF9800');

              return (
                <details key={marker.id} className="marker-accordion web-card">
                  <summary className="marker-summary">
                    <div className="marker-name-block">
                      <span className={`status-dot`} style={{ backgroundColor: statusColor, width: '8px', height: '8px', borderRadius: '50%', display: 'inline-block' }}></span>
                      <span className="marker-name">{marker.name}</span>
                    </div>
                    <div className="marker-value-block">
                      <span className={`marker-val`} style={{ color: statusColor }}>{marker.value}</span>
                      <span className="marker-unit">{marker.unit}</span>
                      <ChevronDown size={14} className="accordion-arrow" />
                    </div>
                  </summary>

                  <div className="marker-details-content">
                    <p className="marker-desc">{marker.description}</p>
                    
                    <div className="range-bar-wrapper">
                      <div className="range-labels">
                        <span>Low</span>
                        <span className="optimal-label">Оптимально: {marker.minOptimal} - {marker.maxOptimal}</span>
                        <span>High</span>
                      </div>
                      
                      <div className="range-bar-track">
                        <div 
                          className="optimal-zone-highlight"
                          style={{
                            left: `${optMinPercent}%`,
                            width: `${optMaxPercent - optMinPercent}%`
                          }}
                        ></div>
                        <div 
                          className={`value-pin`}
                          style={{ left: `${rangePercent}%`, backgroundColor: statusColor }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </details>
              );
            })}
          </div>

          <div className="recommendations-section">
            <div className="rec-section-header">
              <BrainCircuit className="brain-icon" size={20} style={{ color: 'var(--mykora-orange)' }} />
              <h5 style={{ fontSize: '15px', fontWeight: '600' }}>{ru.labs.aiRecs}</h5>
            </div>
            
            <div className="recs-list">
              {activeLab.recommendations.map((rec, idx) => {
                const isAdded = addedSupps.includes(`${activeLab.id}-${idx}`);
                
                return (
                  <div key={idx} className="rec-card web-card">
                    <div className="rec-text-block">
                      <h6>{rec.title}</h6>
                      <p>{rec.description}</p>
                    </div>
                    
                    {rec.supplementSuggested && (
                      <button
                        className={`rec-add-btn ${isAdded ? 'added' : ''}`}
                        onClick={() => handleAddRecommended(idx, rec.supplementSuggested!)}
                        disabled={isAdded}
                      >
                        {isAdded ? (
                          <>
                            <Check size={14} />
                            <span>Добавлено</span>
                          </>
                        ) : (
                          <>
                            <Plus size={14} />
                            <span>Добавить</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="empty-labs-state web-card">
          <FileText size={40} style={{ color: 'var(--mykora-muted)' }} />
          <p>{ru.labs.empty}</p>
        </div>
      )}

      <style>{`
        .labs-view {
          padding: 20px;
          padding-bottom: 80px;
        }

        .upload-section {
          padding: 16px;
        }

        .analyzing-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 12px 0;
          gap: 10px;
        }

        .analysis-status {
          font-size: 13.5px;
          font-weight: 600;
        }

        .progress-bar-container {
          width: 80%;
          height: 4px;
          background: var(--mykora-surface-muted);
          border-radius: 2px;
          overflow: hidden;
        }

        .progress-bar-fill {
          height: 100%;
          background: var(--mykora-orange);
          width: 100%;
          animation: load-progress 1.5s infinite ease-in-out;
        }

        @keyframes load-progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        .upload-desc {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .file-desc {
          font-size: 11px;
          color: var(--mykora-muted);
        }

        .mock-btn {
          flex: 1;
        }

        .lab-selector-dropdown {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 24px;
        }

        .input-field {
          width: 100%;
          padding: 10px;
          border: 1px solid var(--mykora-border);
          border-radius: 4px;
          font-family: inherit;
          background: var(--mykora-surface);
        }

        .lab-title-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
          border-bottom: 1px solid var(--mykora-border);
          padding-bottom: 12px;
        }

        .lab-date {
          font-size: 12px;
          color: var(--mykora-muted);
        }

        .biomarkers-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 32px;
        }

        .marker-accordion {
          padding: 0;
        }

        .marker-summary {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 16px;
          cursor: pointer;
          user-select: none;
          list-style: none;
        }

        .marker-summary::-webkit-details-marker {
          display: none;
        }

        .marker-name-block {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .marker-name {
          font-size: 14px;
          font-weight: 600;
          color: var(--mykora-ink);
        }

        .marker-value-block {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .marker-val {
          font-weight: 700;
          font-size: 15px;
        }

        .marker-unit {
          font-size: 11px;
          color: var(--mykora-muted);
          margin-right: 6px;
        }

        .accordion-arrow {
          transition: transform 0.2s ease;
          opacity: 0.5;
          color: var(--mykora-ink);
        }

        .marker-accordion[open] .accordion-arrow {
          transform: rotate(180deg);
        }

        .marker-details-content {
          padding: 0 16px 16px 16px;
          border-top: 1px solid var(--mykora-border);
          margin-top: 2px;
          background: var(--mykora-canvas);
        }

        .marker-desc {
          font-size: 12px;
          color: var(--mykora-ink);
          line-height: 1.5;
          margin-bottom: 16px;
          margin-top: 12px;
        }

        .range-bar-wrapper {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .range-labels {
          display: flex;
          justify-content: space-between;
          font-size: 9px;
          color: var(--mykora-muted);
          font-family: "Bounded", system-ui, sans-serif;
          text-transform: uppercase;
        }

        .optimal-label {
          color: #4CAF50;
        }

        .range-bar-track {
          height: 6px;
          background: var(--mykora-surface-muted);
          border-radius: 3px;
          position: relative;
        }

        .optimal-zone-highlight {
          position: absolute;
          height: 100%;
          background: rgba(76, 175, 80, 0.2);
          border-left: 1px solid rgba(76, 175, 80, 0.4);
          border-right: 1px solid rgba(76, 175, 80, 0.4);
        }

        .value-pin {
          position: absolute;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          border: 1px solid #fff;
          box-shadow: 0 1px 3px rgba(0,0,0,0.2);
        }

        .recommendations-section {
          margin-top: 24px;
        }

        .rec-section-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 16px;
        }

        .recs-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .rec-card {
          display: flex;
          flex-direction: column;
          gap: 12px;
          border-left: 3px solid var(--mykora-orange);
        }

        .rec-text-block h6 {
          font-size: 14px;
          font-weight: 600;
          color: var(--mykora-ink);
          margin-bottom: 4px;
        }

        .rec-text-block p {
          font-size: 12px;
          color: var(--mykora-muted);
          line-height: 1.45;
        }

        .rec-add-btn {
          background: var(--mykora-surface);
          color: var(--mykora-orange);
          border: 1px solid var(--mykora-orange);
          border-radius: 4px;
          padding: 8px 12px;
          font-size: 11px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          transition: all 0.2s ease;
          text-transform: uppercase;
        }

        .rec-add-btn:hover {
          background: var(--mykora-orange);
          color: #fff;
        }

        .rec-add-btn.added {
          background: rgba(76, 175, 80, 0.1);
          color: #4CAF50;
          border-color: rgba(76, 175, 80, 0.3);
          pointer-events: none;
        }

        .empty-labs-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          text-align: center;
          gap: 12px;
        }
      `}</style>
    </div>
  );
};
