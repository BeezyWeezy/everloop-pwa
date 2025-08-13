import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Globe, CreditCard, Check, X } from 'lucide-react';

interface DomainConfirmModalProps {
  domain: string;
  price: number;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userBalance: number;
}

export default function DomainConfirmModal({
  domain,
  price,
  isOpen,
  onClose,
  onConfirm,
  userBalance
}: DomainConfirmModalProps) {
  if (!isOpen) return null;

  const canAfford = userBalance >= price;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in-0 duration-200">
      <Card className="w-full max-w-md mx-auto animate-in zoom-in-95 duration-200">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-4 animate-in zoom-in-50 duration-300 delay-150">
            <Globe className="w-6 h-6 text-purple-600" />
          </div>
          <CardTitle className="text-xl">Подтверждение покупки</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Информация о домене */}
          <div className="text-center space-y-3">
            <div className="text-2xl font-bold text-purple-600 bg-purple-50 dark:bg-purple-900/20 rounded-lg px-4 py-2">
              {domain}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Купить и привязать к PWA домен
            </p>
            <div className="inline-flex items-center gap-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-sm font-medium">
              <Check className="w-4 h-4" />
              Домен доступен для покупки
            </div>
          </div>

          {/* Детали покупки */}
          <div className="space-y-3 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Домен:</span>
              <span className="font-medium">{domain}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Цена:</span>
              <span className="font-semibold text-lg">${price}/год</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Ваш баланс:</span>
              <span className={`font-medium ${canAfford ? 'text-green-600' : 'text-red-500'}`}>
                ${userBalance}
              </span>
            </div>
            {canAfford && (
              <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-600">
                <span className="text-sm text-gray-600 dark:text-gray-400">После покупки:</span>
                <span className="font-medium">${(userBalance - price).toFixed(2)}</span>
              </div>
            )}
          </div>

          {/* Что произойдет */}
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Что произойдет:</h4>
            <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                <span>Домен будет зарегистрирован на ваше имя</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                <span>Автоматически привяжется к вашему PWA</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                <span>DNS будет настроен автоматически</span>
              </div>
            </div>
          </div>

          {/* Кнопки */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              <X className="w-4 h-4 mr-2" />
              Отмена
            </Button>
            <Button
              onClick={onConfirm}
              disabled={!canAfford}
              className="flex-1 bg-purple-600 hover:bg-purple-700"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              {canAfford ? 'Купить' : 'Недостаточно средств'}
            </Button>
          </div>

          {!canAfford && (
            <div className="text-center">
              <Badge variant="destructive" className="text-xs">
                Пополните баланс на ${(price - userBalance).toFixed(2)}
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
