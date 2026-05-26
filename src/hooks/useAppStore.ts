import { useState, useEffect } from 'react';

export interface Supplement {
  id: string;
  name: string;
  brand: string;
  type: 'supplement' | 'peptide' | 'pharma' | 'cosmetic';
  dosage: string;
  frequency: 'daily' | 'weekly' | 'cycle';
  cycleDaysOn?: number;
  cycleDaysOff?: number;
  cycleStartDate?: string;
  times: string[]; // e.g. ["morning", "afternoon", "evening", "bedtime"]
  instructions?: string;
  stock?: number;
  totalStock?: number;
  active: boolean;
  notes?: string;
}

export interface LabMarker {
  id: string;
  name: string;
  value: number;
  unit: string;
  minOptimal: number;
  maxOptimal: number;
  status: 'low' | 'optimal' | 'high';
  category: 'vitamins' | 'inflammation' | 'metabolic' | 'hormones' | 'organs';
  description: string;
}

export interface LabTest {
  id: string;
  date: string;
  name: string;
  markers: LabMarker[];
  recommendations: {
    title: string;
    description: string;
    supplementSuggested?: Partial<Supplement>;
  }[];
}

export interface UserProfile {
  name: string;
  age: number;
  weight: number;
  goals: string[];
  biohackingScore: number;
}

export interface AdherenceDay {
  [supplementId: string]: string[]; 
}

export interface AdherenceHistory {
  [dateStr: string]: AdherenceDay;
}

const DEFAULT_SUPPLEMENTS: Supplement[] = [
  {
    id: 'supp-mykora-leti',
    name: 'Биоконцентрат Летипоруса',
    brand: 'MYKORA',
    type: 'supplement',
    dosage: '25 мл',
    frequency: 'daily',
    times: ['morning'],
    instructions: 'Натощак, для энергии и ясности ума',
    stock: 21,
    totalStock: 30,
    active: true,
    notes: 'Живые формулы будущего. Высокая биодоступность.'
  },
  {
    id: 'supp-mykora-vit',
    name: 'Капсулы с витаминами (Липосомальный D3+K2)',
    brand: 'MYKORA',
    type: 'supplement',
    dosage: '1 капсула',
    frequency: 'daily',
    times: ['morning'],
    instructions: 'Принимать вместе с жирами',
    stock: 45,
    totalStock: 60,
    active: true,
    notes: 'Усиленная наукой формула для иммунитета.'
  },
  {
    id: 'supp-cosmetic-mykora',
    name: 'Сыворотка Клеточной Регенерации',
    brand: 'MYKORA',
    type: 'cosmetic',
    dosage: '3 капли',
    frequency: 'daily',
    times: ['evening'],
    instructions: 'Нанести на чистую кожу перед сном',
    stock: 80,
    totalStock: 100,
    active: true,
    notes: 'Уход как часть биохакинга. Восстановление барьера.'
  },
  {
    id: 'supp-bpc157',
    name: 'Пептид BPC-157',
    brand: 'BioPrime',
    type: 'peptide',
    dosage: '250 мкг',
    frequency: 'cycle',
    cycleDaysOn: 5,
    cycleDaysOff: 2,
    cycleStartDate: '2026-05-01',
    times: ['morning', 'bedtime'],
    instructions: 'Для восстановления после тренировок',
    stock: 12,
    totalStock: 30,
    active: true,
    notes: 'Цикл регенерации суставов и связок.'
  }
];

const DEFAULT_LABS: LabTest[] = [
  {
    id: 'lab-1',
    name: 'Комплексная Панель Долголетия',
    date: '2026-05-10',
    markers: [
      {
        id: 'vit-d',
        name: 'Витамин D (25-Hydroxy)',
        value: 26.4,
        unit: 'нг/мл',
        minOptimal: 40,
        maxOptimal: 80,
        status: 'low',
        category: 'vitamins',
        description: 'Критически важен для костей, иммунитета и гормонов. Ниже 30 — дефицит.'
      },
      {
        id: 'vit-b12',
        name: 'Витамин B12 (Кобаламин)',
        value: 342,
        unit: 'пг/мл',
        minOptimal: 500,
        maxOptimal: 950,
        status: 'low',
        category: 'vitamins',
        description: 'Отвечает за метилирование и работу нервной системы.'
      },
      {
        id: 'crp',
        name: 'hs-CRP (С-реактивный белок)',
        value: 2.1,
        unit: 'мг/л',
        minOptimal: 0.1,
        maxOptimal: 0.9,
        status: 'high',
        category: 'inflammation',
        description: 'Маркер системного воспаления. Выше 1.0 — риск для сердечно-сосудистой системы.'
      }
    ],
    recommendations: [
      {
        title: 'Увеличьте потребление Витамина D3',
        description: 'Ваш уровень (26.4 нг/мл) ниже оптимума. Рекомендовано добавить липосомальный Витамин D3 от MYKORA.',
        supplementSuggested: {
          name: 'Липосомальный Витамин D3+K2',
          brand: 'MYKORA',
          type: 'supplement',
          dosage: '5000 МЕ',
          frequency: 'daily',
          times: ['morning'],
          instructions: 'Принимать с пищей'
        }
      }
    ]
  }
];

const DEFAULT_PROFILE: UserProfile = {
  name: 'Алексей (Биохакер)',
  age: 32,
  weight: 78,
  goals: ['Энергия', 'Долголетие', 'Регенерация'],
  biohackingScore: 88
};

export const getTodayStr = () => {
  const date = new Date();
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - (offset * 60 * 1000));
  return localDate.toISOString().split('T')[0];
};

export const useAppStore = () => {
  const [supplements, setSupplements] = useState<Supplement[]>(() => {
    const saved = localStorage.getItem('bf_supplements_ru');
    return saved ? JSON.parse(saved) : DEFAULT_SUPPLEMENTS;
  });

  const [labs, setLabs] = useState<LabTest[]>(() => {
    const saved = localStorage.getItem('bf_labs_ru');
    return saved ? JSON.parse(saved) : DEFAULT_LABS;
  });

  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('bf_profile_ru');
    return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
  });

  const [adherence, setAdherence] = useState<AdherenceHistory>(() => {
    const saved = localStorage.getItem('bf_adherence_ru');
    if (saved) return JSON.parse(saved);
    
    const today = getTodayStr();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    const seeded: AdherenceHistory = {
      [yesterdayStr]: {
        'supp-mykora-leti': ['morning'],
        'supp-mykora-vit': ['morning'],
        'supp-bpc157': ['morning', 'bedtime'],
        'supp-cosmetic-mykora': ['evening']
      },
      [today]: {
        'supp-mykora-leti': ['morning'],
        'supp-bpc157': ['morning']
      }
    };
    return seeded;
  });

  useEffect(() => {
    localStorage.setItem('bf_supplements_ru', JSON.stringify(supplements));
  }, [supplements]);

  useEffect(() => {
    localStorage.setItem('bf_labs_ru', JSON.stringify(labs));
  }, [labs]);

  useEffect(() => {
    localStorage.setItem('bf_profile_ru', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('bf_adherence_ru', JSON.stringify(adherence));
  }, [adherence]);

  useEffect(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    });

    let totalDosesRequired = 0;
    let totalDosesTaken = 0;

    last7Days.forEach(dateStr => {
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

        const requiredTimes = supp.times.length;
        totalDosesRequired += requiredTimes;

        const takenTimes = adherence[dateStr]?.[supp.id]?.length || 0;
        totalDosesTaken += takenTimes;
      });
    });

    const rate = totalDosesRequired > 0 ? Math.round((totalDosesTaken / totalDosesRequired) * 100) : 100;
    if (rate !== profile.biohackingScore) {
      setProfile(prev => ({ ...prev, biohackingScore: Math.min(100, Math.max(20, rate)) }));
    }
  }, [adherence, supplements]);

  const addSupplement = (newSupp: Omit<Supplement, 'id'>) => {
    const id = `supp-${Date.now()}`;
    const supp: Supplement = { ...newSupp, id, active: true };
    setSupplements(prev => [...prev, supp]);
    return id;
  };

  const deleteSupplement = (id: string) => {
    setSupplements(prev => prev.filter(s => s.id !== id));
    setAdherence(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(date => {
        if (updated[date][id]) {
          delete updated[date][id];
        }
      });
      return updated;
    });
  };

  const toggleSupplementActive = (id: string) => {
    setSupplements(prev => prev.map(s => s.id === id ? { ...s, active: !s.active } : s));
  };

  const updateSupplement = (id: string, updatedFields: Partial<Supplement>) => {
    setSupplements(prev => prev.map(s => s.id === id ? { ...s, ...updatedFields } : s));
  };

  const completeDose = (dateStr: string, supplementId: string, time: string) => {
    setAdherence(prev => {
      const dayAdherence = prev[dateStr] || {};
      const supplementTimes = dayAdherence[supplementId] || [];
      if (!supplementTimes.includes(time)) {
        setSupplements(supps => supps.map(s => {
          if (s.id === supplementId && s.stock !== undefined && s.stock > 0) {
            return { ...s, stock: s.stock - 1 };
          }
          return s;
        }));

        return {
          ...prev,
          [dateStr]: {
            ...dayAdherence,
            [supplementId]: [...supplementTimes, time]
          }
        };
      }
      return prev;
    });
  };

  const uncompleteDose = (dateStr: string, supplementId: string, time: string) => {
    setAdherence(prev => {
      const dayAdherence = prev[dateStr];
      if (!dayAdherence || !dayAdherence[supplementId]) return prev;

      const supplementTimes = dayAdherence[supplementId].filter(t => t !== time);
      const updatedDay = { ...dayAdherence };
      
      if (supplementTimes.length === 0) {
        delete updatedDay[supplementId];
      } else {
        updatedDay[supplementId] = supplementTimes;
      }

      setSupplements(supps => supps.map(s => {
        if (s.id === supplementId && s.stock !== undefined && s.totalStock !== undefined && s.stock < s.totalStock) {
          return { ...s, stock: s.stock + 1 };
        }
        return s;
      }));

      return {
        ...prev,
        [dateStr]: updatedDay
      };
    });
  };

  const addLabTest = (newLab: Omit<LabTest, 'id'>) => {
    const id = `lab-${Date.now()}`;
    const lab: LabTest = { ...newLab, id };
    setLabs(prev => [lab, ...prev]); 
  };

  const updateProfile = (updatedFields: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updatedFields }));
  };

  return {
    supplements,
    labs,
    profile,
    adherence,
    addSupplement,
    deleteSupplement,
    toggleSupplementActive,
    updateSupplement,
    completeDose,
    uncompleteDose,
    addLabTest,
    updateProfile
  };
};
