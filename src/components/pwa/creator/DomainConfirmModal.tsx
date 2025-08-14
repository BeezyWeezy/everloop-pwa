import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Globe, CreditCard, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface DomainConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  domain: {
    domain: string;
    price: number;
    premiumPrice?: number;
    isPremium?: boolean;
  };
  userBalance: number;
  isLoading?: boolean;
}

export default function DomainConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  domain,
  userBalance,
  isLoading = false
}: DomainConfirmModalProps) {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const { t } = useTranslation();

  const handleConfirm = () => {
    setIsConfirmed(true);
    onConfirm();
  };

  const handleClose = () => {
    setIsConfirmed(false);
    onClose();
  };

  const price = domain.isPremium ? domain.premiumPrice || domain.price : domain.price;
  const canAfford = price && userBalance >= price;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-purple-600" />
            {t('domain.domainPurchase')}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Домен */}
          <div className="text-center">
            <h3 className="text-xl font-semibold text-purple-600">
              {domain.domain}
            </h3>
            {domain.isPremium && (
              <Badge variant="secondary" className="mt-2">
                {t('domain.premiumDomain')}
              </Badge>
            )}
          </div>

          {/* Цена */}
          <div className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <span className="text-sm text-slate-600 dark:text-slate-400">
              {t('domain.domainPrice')}
            </span>
            <span className="text-lg font-semibold">
              ${price ? price.toFixed(2) : 'N/A'}
            </span>
          </div>

          {/* Баланс */}
          <div className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <span className="text-sm text-slate-600 dark:text-slate-400">
              {t('domain.userBalance')}
            </span>
            <span className={`font-semibold ${canAfford ? 'text-green-600' : 'text-red-600'}`}>
              ${userBalance.toFixed(2)}
            </span>
          </div>

          {/* Что произойдет */}
          <div className="space-y-2">
            <h4 className="font-medium">{t('domain.purchaseWhatHappens')}</h4>
            <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
              <li>{t('domain.purchaseStep1')}</li>
              <li>{t('domain.purchaseStep2')}</li>
              <li>{t('domain.purchaseStep3')}</li>
              <li>{t('domain.purchaseStep4', { amount: price ? price.toFixed(2) : 'N/A' })}</li>
            </ul>
          </div>

          {/* Предупреждение о недостатке средств */}
          {!canAfford && (
            <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <span className="text-sm text-red-600">
                {t('domain.insufficientFunds')}
              </span>
            </div>
          )}

          {/* Кнопки */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1"
            >
              {t('domain.cancelButton')}
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={!canAfford || isLoading}
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t('domain.purchaseLoading')}
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4 mr-2" />
                  {t('domain.purchaseButton')}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
