import React from 'react';
import { useTranslation } from 'react-i18next';
import { usePWAStore } from '@/store/usePWAStore';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';

interface FilterTabsProps {
  className?: string;
}

const FilterTabs: React.FC<FilterTabsProps> = ({ className = '' }) => {
  const { t } = useTranslation();
  const { filters, setStatusFilter, pwas } = usePWAStore();

  // Подсчет количества PWA по статусам
  const getStatusCount = (status: string) => {
    if (status === 'all') return pwas.length;
    if (status === 'favorites') return pwas.filter(pwa => pwa.favorite).length;
    return pwas.filter(pwa => pwa.status === status).length;
  };

  const filterOptions = [
    { value: 'favorites', label: t('favorites'), color: 'warning' },
    { value: 'all', label: t('all'), color: 'default' },
    { value: 'active', label: t('active'), color: 'success' },
    { value: 'paused', label: t('paused'), color: 'destructive' },
    { value: 'draft', label: t('draft'), color: 'outline' },
  ];

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {filterOptions.map((option) => {
        const isActive = filters.status === option.value;
        const count = getStatusCount(option.value);
        
        return (
          <button
            key={option.value}
            onClick={() => setStatusFilter(option.value)}
            className={`
              group relative inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium 
              transition-all duration-200 ease-out transform hover:scale-105 active:scale-95
              ${isActive 
                ? option.value === 'favorites'
                  ? 'bg-yellow-500 text-black shadow-sm hover:!bg-yellow-600' 
                  : 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-sm hover:!bg-brand-yellow hover:!text-black' 
                : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:!bg-brand-yellow hover:!text-black hover:!border-brand-yellow/50'
              }
            `}
          >
            <span className="transition-all duration-200 flex items-center">
              {option.value === 'favorites' && (
                <Star className="w-4 h-4 mr-1" />
              )}
              {option.label}
            </span>
            <Badge 
              variant={isActive ? 'secondary' : 'outline'} 
              className={`
                text-xs px-2 py-0.5 min-w-[20px] h-5 flex items-center justify-center
                transition-all duration-200
                ${isActive 
                  ? option.value === 'favorites'
                    ? 'bg-black/20 text-black border-black/30' 
                    : 'bg-white/20 text-white border-white/30 group-hover:!bg-black/20 group-hover:!text-black group-hover:!border-black/30'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-600 group-hover:!bg-black/20 group-hover:!text-black group-hover:!border-black/30'
                }
              `}
            >
              {count}
            </Badge>
          </button>
        );
      })}
    </div>
  );
};

export default FilterTabs;
