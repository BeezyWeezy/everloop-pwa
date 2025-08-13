import { create } from 'zustand';
import { PWAProject, PWAListItem } from '@/types/pwa';

interface PWAStore {
  // Состояние
  pwas: PWAListItem[];
  currentPWA: PWAProject | null;
  loading: boolean;
  error: string | null;

  // Действия
  setPWAs: (pwas: PWAListItem[]) => void;
  setCurrentPWA: (pwa: PWAProject | null) => void;
  addPWA: (pwa: PWAListItem) => void;
  updatePWAInStore: (id: string, updates: Partial<PWAListItem>) => void;
  removePWA: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const usePWAStore = create<PWAStore>((set, get) => ({
  // Начальное состояние
  pwas: [],
  currentPWA: null,
  loading: false,
  error: null,

  // Действия
  setPWAs: (pwas) => set({ pwas }),
  
  setCurrentPWA: (pwa) => set({ currentPWA: pwa }),
  
  addPWA: (pwa) => set((state) => ({ 
    pwas: [pwa, ...state.pwas] 
  })),
  
  updatePWAInStore: (id, updates) => set((state) => ({
    pwas: state.pwas.map(pwa => 
      pwa.id === id ? { ...pwa, ...updates } : pwa
    ),
    currentPWA: state.currentPWA?.id === id 
      ? { ...state.currentPWA, ...updates } 
      : state.currentPWA
  })),
  
  removePWA: (id) => set((state) => ({
    pwas: state.pwas.filter(pwa => pwa.id !== id),
    currentPWA: state.currentPWA?.id === id ? null : state.currentPWA
  })),
  
  setLoading: (loading) => set({ loading }),
  
  setError: (error) => set({ error }),
  
  clearError: () => set({ error: null })
}));
