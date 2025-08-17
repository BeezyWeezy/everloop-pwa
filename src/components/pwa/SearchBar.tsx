import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { usePWAStore } from '@/store/usePWAStore';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SearchBarProps {
  className?: string;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  className = '',
  placeholder
}) => {
  const { t } = useTranslation();
  const { filters, setSearchFilter } = usePWAStore();
  const [localSearch, setLocalSearch] = useState(filters.search);

  // Debounce поиска
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchFilter(localSearch);
    }, 300);

    return () => clearTimeout(timer);
  }, [localSearch, setSearchFilter]);

  const handleClear = () => {
    setLocalSearch('');
    setSearchFilter('');
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          type="text"
          placeholder={placeholder || t('ui.searchPwa')}
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          className="pl-10 pr-10"
        />
        {localSearch && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
