import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader } from '@/components/ui/loader';
import { Settings, Globe, Play, Pause, Trash2, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { PWAListItem } from '@/types/pwa';
import { usePWAStore } from '@/store/usePWAStore';
import { useLogger } from '@/lib/utils/logger';

interface PwaListViewProps {
  pwas: PWAListItem[];
}

const PwaListView: React.FC<PwaListViewProps> = ({ pwas }) => {
  const { t } = useTranslation();
  const logger = useLogger('PwaListView');
  const { updatePWAInStore, removePWA } = usePWAStore();
  const [loadingStates, setLoadingStates] = useState<Record<string, string | null>>({});

  const getStatusColor = (status: PWAListItem['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'paused': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
      case 'draft': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getStatusText = (status: PWAListItem['status']) => {
    switch (status) {
      case 'active': return t('ui.active');
      case 'paused': return t('ui.paused');
      case 'draft': return t('ui.draft');
      default: return status;
    }
  };

  const handleStatusChange = async (pwaId: string, newStatus: 'active' | 'paused') => {
    setLoadingStates(prev => ({ ...prev, [pwaId]: newStatus }));
    try {
      const { updatePWAStatus } = await import('@/lib/api/pwa');
      const { data, error } = await updatePWAStatus(pwaId, newStatus);
      
      if (error) {
        logger.error(t('notifications.pwa.statusChangeError'), error.message || t('notifications.general.unknownError'));
        return;
      }

      if (data) {
        updatePWAInStore(pwaId, { status: data.status, published_at: data.published_at });
      }
    } catch (error) {
      logger.error(t('notifications.pwa.statusChangeError'), t('notifications.general.unknownError'));
    } finally {
      setLoadingStates(prev => ({ ...prev, [pwaId]: null }));
    }
  };

  const handleDelete = async (pwaId: string) => {
    if (!confirm(t('confirmDeletePwa'))) {
      return;
    }

    setLoadingStates(prev => ({ ...prev, [pwaId]: 'delete' }));
    try {
      const { deletePWA } = await import('@/lib/api/pwa');
      const { error } = await deletePWA(pwaId);
      
      if (error) {
        logger.error(t('notifications.pwa.deleteError'), error.message || t('notifications.general.unknownError'));
        return;
      }

      removePWA(pwaId);
    } catch (error) {
      logger.error(t('notifications.pwa.deleteError'), t('notifications.general.unknownError'));
    } finally {
      setLoadingStates(prev => ({ ...prev, [pwaId]: null }));
    }
  };

  return (
    <div className="space-y-2">
      {pwas.map((pwa) => {
        const isLoading = loadingStates[pwa.id];
        
        return (
          <Card key={pwa.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                {/* Основная информация */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  {/* Логотип */}
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-semibold bg-gradient-to-br from-blue-500 to-purple-600 overflow-hidden flex-shrink-0">
                    {pwa.logo_url ? (
                      <img 
                        src={pwa.logo_url} 
                        alt={`${pwa.name} логотип`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      pwa.name.charAt(0).toUpperCase()
                    )}
                  </div>

                  {/* Название и домен */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                      {pwa.name}
                    </h3>
                    {pwa.domain && (
                      <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
                        🌐 {pwa.domain}
                      </p>
                    )}
                    <p className="text-xs text-slate-400 dark:text-slate-500">
                      {t('created')}: {new Date(pwa.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Статус */}
                  <Badge className={`${getStatusColor(pwa.status)} flex-shrink-0`}>
                    {getStatusText(pwa.status)}
                  </Badge>

                  {/* Метрики */}
                  <div className="hidden md:flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400 flex-shrink-0">
                    <div className="text-center">
                      <p className="font-semibold">{pwa.installs?.toLocaleString() || 0}</p>
                      <p className="text-xs">{t('ui.installs')}</p>
                    </div>
                  </div>
                </div>

                {/* Действия */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {/* Настройки */}
                  <Link href={`/pwa/${pwa.id}`}>
                    <Button variant="outline" size="sm">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </Link>

                  {/* Активировать/Приостановить */}
                  {pwa.status === 'active' ? (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleStatusChange(pwa.id, 'paused')}
                      disabled={!!isLoading}
                    >
                      {isLoading === 'paused' ? (
                        <Loader size="sm" variant="spinner" color="primary" />
                      ) : (
                        <Pause className="w-4 h-4" />
                      )}
                    </Button>
                  ) : pwa.status === 'paused' || pwa.status === 'draft' ? (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleStatusChange(pwa.id, 'active')}
                      disabled={!!isLoading}
                    >
                      {isLoading === 'active' ? (
                        <Loader size="sm" variant="spinner" color="primary" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                    </Button>
                  ) : null}

                  {/* Просмотр (если развернуто) */}
                  {pwa.status === 'active' && pwa.domain && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={`https://${pwa.domain}`} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </Button>
                  )}

                  {/* Удалить */}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleDelete(pwa.id)}
                    disabled={!!isLoading}
                    className="text-red-600 hover:text-red-700 hover:border-red-300"
                  >
                    {isLoading === 'delete' ? (
                      <Loader size="sm" variant="spinner" color="error" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default PwaListView;
