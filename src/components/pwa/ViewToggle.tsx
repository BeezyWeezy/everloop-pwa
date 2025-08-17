import React from 'react';
import { useTranslation } from 'react-i18next';
import { usePWAStore } from '@/store/usePWAStore';
import { Button } from '@/components/ui/button';
import { Grid3X3, List } from 'lucide-react';

interface ViewToggleProps {
  className?: string;
}

const ViewToggle: React.FC<ViewToggleProps> = ({ className = '' }) => {
  const { t } = useTranslation();
  const { viewMode, setViewMode } = usePWAStore();

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <Button
        variant={viewMode === 'grid' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setViewMode('grid')}
        className="flex items-center gap-2"
        title={t('ui.gridView')}
      >
        <Grid3X3 className="h-4 w-4" />
      </Button>
      
      <Button
        variant={viewMode === 'list' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setViewMode('list')}
        className="flex items-center gap-2"
        title={t('ui.listView')}
      >
        <List className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ViewToggle;
