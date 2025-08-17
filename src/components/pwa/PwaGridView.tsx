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

interface PwaGridViewProps {
  pwas: PWAListItem[];
}

const PwaGridView: React.FC<PwaGridViewProps> = ({ pwas }) => {
  const { t } = useTranslation();
  const logger = useLogger('PwaGridView');
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
      {pwas.map((pwa) => {
        const isLoading = loadingStates[pwa.id];
        
        // Моковые данные метрик (в реальности будут приходить с сервера)
        const metrics = {
          clicks: 0,
          click2inst: 0,
          installs: pwa.installs || 0,
          ftds: 0,
          cr: 0,
          last_updated: new Date().toISOString()
        };

        return (
          <Card key={pwa.id} className="hover:shadow-lg transition-shadow group">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-semibold bg-gradient-to-br from-blue-500 to-purple-600 overflow-hidden">
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
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {pwa.name}
                    </h3>
                  </div>
                </div>
                <Badge className={getStatusColor(pwa.status)}>
                  {getStatusText(pwa.status)}
                </Badge>
              </div>
              
              {/* Метрики производительности */}
              <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3 mb-3">
                <div className="grid grid-cols-5 gap-2 text-center">
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Clicks</p>
                    <p className="font-semibold text-sm">{metrics.clicks.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Click2Inst</p>
                    <p className="font-semibold text-sm">{metrics.click2inst}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Installs</p>
                    <p className="font-semibold text-sm">{metrics.installs.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">FTDs</p>
                    <p className="font-semibold text-sm">{metrics.ftds.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">CR</p>
                    <p className="font-semibold text-sm">{metrics.cr}%</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-4">
                <span>{t('created')}: {new Date(pwa.created_at).toLocaleDateString()}</span>
                {pwa.domain && <span>🌐 {pwa.domain}</span>}
              </div>
              
              {/* Действия */}
              <div className="flex gap-2">
                <Link href={`/pwa/${pwa.id}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">
                    <Settings className="w-4 h-4 mr-2" />
                    {t('ui.settings')}
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
                
                {/* Просмотр (если развернуто) */}
                {pwa.status === 'active' && pwa.domain && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={`https://${pwa.domain}`} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default PwaGridView;
