import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import { usePWAStore } from '@/store/usePWAStore';

interface FavoriteButtonProps {
  pwaId: string;
  isFavorite: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ 
  pwaId, 
  isFavorite, 
  size = 'sm',
  className = '' 
}) => {
  const { t } = useTranslation();
  const { toggleFavorite } = usePWAStore();

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(pwaId);
  };

  return (
    <Button
      variant="ghost"
      size={size}
      onClick={handleToggleFavorite}
      className={`
        p-1 h-auto w-auto
        ${isFavorite 
          ? 'text-yellow-500 hover:text-yellow-600' 
          : 'text-slate-400 hover:text-yellow-500'
        }
        transition-colors duration-200
        ${className}
      `}
      title={isFavorite ? t('removeFromFavorites') : t('addToFavorites')}
    >
      <Star 
        className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} 
      />
    </Button>
  );
};

export default FavoriteButton;
