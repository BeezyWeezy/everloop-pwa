import React from 'react';
import { useTranslation } from 'react-i18next';
import { usePWAStore } from '@/store/usePWAStore';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronDown, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

interface SortDropdownProps {
  className?: string;
}

const SortDropdown: React.FC<SortDropdownProps> = ({ className = '' }) => {
  const { t } = useTranslation();
  const { filters, setSortBy, setSortOrder } = usePWAStore();

  const sortOptions = [
    { value: 'created_at', label: t('ui.sortByDate') },
    { value: 'name', label: t('ui.sortByName') },
    { value: 'status', label: t('ui.sortByStatus') },
  ];

  const getSortIcon = () => {
    if (filters.sortOrder === 'asc') {
      return <ArrowUp className="h-4 w-4" />;
    }
    return <ArrowDown className="h-4 w-4" />;
  };

  const getCurrentSortLabel = () => {
    const option = sortOptions.find(opt => opt.value === filters.sortBy);
    return option ? option.label : t('ui.sortByDate');
  };

  const handleSortChange = (sortBy: string) => {
    setSortBy(sortBy);
  };

  const toggleSortOrder = () => {
    setSortOrder(filters.sortOrder === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4" />
            {getCurrentSortLabel()}
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {sortOptions.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onClick={() => handleSortChange(option.value)}
              className={filters.sortBy === option.value ? 'bg-accent' : ''}
            >
              {option.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Button
        variant="outline"
        size="icon"
        onClick={toggleSortOrder}
        className="flex items-center justify-center"
      >
        {getSortIcon()}
      </Button>
    </div>
  );
};

export default SortDropdown;
