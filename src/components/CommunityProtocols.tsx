import React from 'react';
import { ru } from '../i18n/ru';
import type { Supplement } from '../hooks/useAppStore';

interface CommunityProtocolsProps {
  addSupplement: (supp: Omit<Supplement, 'id'>) => void;
}

export const CommunityProtocols: React.FC<CommunityProtocolsProps> = ({ addSupplement }) => {
  const protocols = [
    {
      id: 'proto-sleep',
      title: 'Протокол Глубокого Сна',
      author: 'Эндрю Хуберман',
      description: 'Система из 3 компонентов для максимального восстановления во время сна.',
      items: [
        {
          name: 'Магний Треонат',
          brand: 'Life Extension',
          type: 'supplement' as const,
          dosage: '145 мг',
          frequency: 'daily' as const,
          times: ['bedtime'],
          instructions: 'За 30-60 минут до сна'
        },
        {
          name: 'L-Теанин',
          brand: 'Sports Research',
          type: 'supplement' as const,
          dosage: '200 мг',
          frequency: 'daily' as const,
          times: ['bedtime'],
          instructions: 'Вместе с магнием'
        },
        {
          name: 'Апигенин',
          brand: 'Swanson',
          type: 'supplement' as const,
          dosage: '50 мг',
          frequency: 'daily' as const,
          times: ['bedtime'],
          instructions: 'Вместе с магнием'
        }
      ]
    },
    {
      id: 'proto-skin',
      title: 'Косметологический Биохакинг',
      author: 'MYKORA Research',
      description: 'Стек для восстановления кожного барьера и антиоксидантной защиты.',
      items: [
        {
          name: 'Сыворотка Клеточной Регенерации',
          brand: 'MYKORA',
          type: 'cosmetic' as const,
          dosage: '3 капли',
          frequency: 'daily' as const,
          times: ['evening'],
          instructions: 'Нанести на чистую кожу'
        },
        {
          name: 'Липосомальный Витамин C',
          brand: 'MYKORA',
          type: 'supplement' as const,
          dosage: '1000 мг',
          frequency: 'daily' as const,
          times: ['morning'],
          instructions: 'Утром натощак'
        }
      ]
    }
  ];

  const handleCopyProtocol = (protocol: typeof protocols[0]) => {
    protocol.items.forEach(item => {
      addSupplement(item);
    });
    alert(ru.community.addedMsg);
  };

  return (
    <div style={{ padding: '24px 16px', paddingBottom: '100px' }}>
      <h2 className="web-section-title" style={{ marginBottom: '8px', textAlign: 'center' }}>
        {ru.community.title}
      </h2>
      <p style={{ textAlign: 'center', color: 'var(--mykora-muted)', marginBottom: '32px' }}>
        {ru.community.subtitle}
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {protocols.map(proto => (
          <div key={proto.id} className="web-card" style={{ padding: '20px' }}>
            <div style={{ marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', marginBottom: '4px' }}>{proto.title}</h3>
              <div style={{ fontSize: '14px', color: 'var(--mykora-muted)', marginBottom: '8px' }}>
                {ru.community.author} <strong>{proto.author}</strong>
              </div>
              <p style={{ fontSize: '14px', lineHeight: '1.4' }}>{proto.description}</p>
            </div>

            <div style={{ background: 'var(--mykora-surface-muted)', padding: '12px', borderRadius: '4px', marginBottom: '16px' }}>
              <strong style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--mykora-forest-soft)' }}>
                {ru.community.items}
              </strong>
              <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px', fontSize: '14px' }}>
                {proto.items.map((item, idx) => (
                  <li key={idx} style={{ marginBottom: '4px' }}>{item.name} ({item.dosage})</li>
                ))}
              </ul>
            </div>

            <button
              className="web-button-secondary"
              style={{ width: '100%' }}
              onClick={() => handleCopyProtocol(proto)}
            >
              {ru.community.addToStackBtn}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
