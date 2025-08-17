import { create } from 'zustand';
import { PWAProject, PWAListItem } from '@/types/pwa';

interface PWAStore {
  // Состояние
  pwas: PWAListItem[];
  currentPWA: PWAProject | null;
  loading: boolean;
  error: string | null;

  // Фильтры и сортировка
  filters: {
    status: string;
    search: string;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
  };

  // Вид отображения
  viewMode: 'grid' | 'list';

  // Действия
  setPWAs: (pwas: PWAListItem[]) => void;
  setCurrentPWA: (pwa: PWAProject | null) => void;
  addPWA: (pwa: PWAListItem) => void;
  updatePWAInStore: (id: string, updates: Partial<PWAListItem>) => void;
  removePWA: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  
  // Действия для фильтров
  setStatusFilter: (status: string) => void;
  setSearchFilter: (search: string) => void;
  setSortBy: (sortBy: string) => void;
  setSortOrder: (order: 'asc' | 'desc') => void;
  clearFilters: () => void;
  
  // Действия для вида отображения
  setViewMode: (mode: 'grid' | 'list') => void;
  
  // Геттеры для отфильтрованных данных
  getFilteredPWAs: () => PWAListItem[];
}

export const usePWAStore = create<PWAStore>((set, get) => ({
  // Начальное состояние
  pwas: [],
  currentPWA: null,
  loading: false,
  error: null,
  filters: {
    status: 'all',
    search: '',
    sortBy: 'created_at',
    sortOrder: 'desc'
  },
  viewMode: 'grid',

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
  
  clearError: () => set({ error: null }),

  // Действия для фильтров
  setStatusFilter: (status) => set((state) => ({
    filters: { ...state.filters, status }
  })),

  setSearchFilter: (search) => set((state) => ({
    filters: { ...state.filters, search }
  })),

  setSortBy: (sortBy) => set((state) => ({
    filters: { ...state.filters, sortBy }
  })),

  setSortOrder: (sortOrder) => set((state) => ({
    filters: { ...state.filters, sortOrder }
  })),

  clearFilters: () => set((state) => ({
    filters: {
      status: 'all',
      search: '',
      sortBy: 'created_at',
      sortOrder: 'desc'
    }
  })),

  setViewMode: (viewMode) => set({ viewMode }),

  // Геттер для отфильтрованных данных
  getFilteredPWAs: () => {
    const { pwas, filters } = get();
    
    let filtered = [...pwas];

    // Фильтр по статусу
    if (filters.status !== 'all') {
      filtered = filtered.filter(pwa => pwa.status === filters.status);
    }

    // Фильтр по поиску
    if (filters.search.trim()) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(pwa => 
        pwa.name.toLowerCase().includes(searchLower) ||
        pwa.domain?.toLowerCase().includes(searchLower) ||
        pwa.title?.toLowerCase().includes(searchLower)
      );
    }

    // Сортировка
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (filters.sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'created_at':
        default:
          aValue = new Date(a.created_at).getTime();
          bValue = new Date(b.created_at).getTime();
          break;
      }

      if (filters.sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }
}));
