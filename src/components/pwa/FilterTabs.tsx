import React from 'react';
import { useTranslation } from 'react-i18next';
import { usePWAStore } from '@/store/usePWAStore';
import { Badge } from '@/components/ui/badge';

interface FilterTabsProps {
  className?: string;
}

const FilterTabs: React.FC<FilterTabsProps> = ({ className = '' }) => {
  const { t } = useTranslation();
  const { filters, setStatusFilter, pwas } = usePWAStore();

  // Подсчет количества PWA по статусам
  const getStatusCount = (status: string) => {
    if (status === 'all') return pwas.length;
    return pwas.filter(pwa => pwa.status === status).length;
  };

  const filterOptions = [
    { value: 'all', label: t('ui.all'), color: 'default' },
    { value: 'active', label: t('ui.active'), color: 'success' },
    { value: 'paused', label: t('ui.paused'), color: 'destructive' },
    { value: 'draft', label: t('ui.draft'), color: 'outline' },
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
              inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all
              ${isActive 
                ? 'bg-primary text-primary-foreground shadow-sm' 
                : 'bg-background border border-border hover:bg-accent hover:text-accent-foreground'
              }
            `}
          >
            <span>{option.label}</span>
            <Badge 
              variant={isActive ? 'secondary' : 'outline'} 
              className="text-xs"
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
