import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import GooglePlayStorePage from '@/components/pwa/GooglePlayStorePage';

interface PwaData {
  appName: string;
  developer: string;
  rating: number;
  reviewsCount: number;
  downloadsCount: string;
  ageRating: string;
  hasAds: boolean;
  hasInAppPurchases: boolean;
  isVerified: boolean;
  isEditorsChoice: boolean;
  descriptionTitle: string;
  description: string;
  version: string;
  lastUpdated: string;
  appIcon?: string;
  screenshots?: string[];
  category: string;
  size?: string;
  whatIsNew?: string;
  dataAndPrivacy?: string;
  developerContact?: string;
  casinoUrl: string;
}

export default function PwaPlayStorePage() {
  const router = useRouter();
  const { id } = router.query;
  const [pwaData, setPwaData] = useState<PwaData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      // Здесь будет загрузка данных PWA по ID
      // Пока используем mock данные
      const mockData: PwaData = {
        appName: "Plinko Space - Плинко x100",
        developer: "Joker Game",
        rating: 4.5,
        reviewsCount: 250000,
        downloadsCount: "10 млн+",
        ageRating: "3+",
        hasAds: true,
        hasInAppPurchases: false,
        isVerified: true,
        isEditorsChoice: false,
        descriptionTitle: "🎰 Лучшее казино с огромными бонусами!",
        description: "Добро пожаловать в мир захватывающих казино игр! Наше приложение предлагает:\n\n🎲 Сотни слотов и игр\n💰 Ежедневные бонусы до 1000$\n🏆 Турниры с крупными призами\n🎁 Приветственный бонус 200%\n\nИграйте в любимые игры казино прямо сейчас!",
        version: "1.0.0",
        lastUpdated: "2024-12-13",
        category: "Casino",
        size: "45 МБ",
        whatIsNew: "• Новые слоты и игры\n• Улучшенная графика\n• Исправление ошибок\n• Повышение стабильности",
        dataAndPrivacy: "Разработчик указал, что приложение не собирает и не передает персональные данные третьим лицам.",
        casinoUrl: "https://example-casino.com", // Это URL куда будет редирект
        appIcon: "/pwa-icon.png",
        screenshots: [
          "/screenshot1.jpg",
          "/screenshot2.jpg", 
          "/screenshot3.jpg",
          "/screenshot4.jpg",
          "/screenshot5.jpg"
        ]
      };

      setPwaData(mockData);
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Загрузка...</div>
      </div>
    );
  }

  if (!pwaData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">PWA не найдено</div>
      </div>
    );
  }

  return <GooglePlayStorePage data={pwaData} />;
}
