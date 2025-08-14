import React from 'react';
import { Star, Share2, MoreVertical, Download, ShieldCheck, Menu, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

interface GooglePlayStorePageProps {
  data: {
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
    // Дополнительные поля
    whatIsNew?: string;
    dataAndPrivacy?: string;
    developerContact?: string;
    casinoUrl: string; // URL для редиректа
  };
}

export default function GooglePlayStorePage({ data }: GooglePlayStorePageProps) {
  const { t } = useTranslation();
  
  const handleInstallClick = () => {
    // Редирект на casino URL
    window.location.href = data.casinoUrl;
  };

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            className={`w-4 h-4 ${
              index < fullStars 
                ? 'fill-green-600 text-green-600' 
                : index === fullStars && hasHalfStar
                ? 'fill-green-600/50 text-green-600'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white google-play-page">
      {/* Header */}
      <header className="google-play-header px-4 py-3">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 rounded-sm flex items-center justify-center">
                <span className="text-white font-bold text-sm">▷</span>
              </div>
              <span className="text-xl font-normal text-gray-700">Google Play</span>
            </div>
            <nav className="hidden md:flex items-center gap-6 text-sm ml-8">
              <span className="text-green-700 font-medium border-b-2 border-green-700 pb-3">{t('googlePlay.games')}</span>
              <span className="text-gray-600 hover:text-gray-900 cursor-pointer pb-3">{t('googlePlay.apps')}</span>
              <span className="text-gray-600 hover:text-gray-900 cursor-pointer pb-3">{t('googlePlay.books')}</span>
              <span className="text-gray-600 hover:text-gray-900 cursor-pointer pb-3">{t('googlePlay.kids')}</span>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center bg-gray-50 rounded-full px-4 py-2 w-96">
              <Search className="w-5 h-5 text-gray-400 mr-3" />
              <input 
                type="text" 
                placeholder={t('googlePlay.searchPlaceholder')}
                className="bg-transparent outline-none flex-1 text-sm"
              />
            </div>
            <button className="p-2 rounded-full hover:bg-gray-100">
              <MoreVertical className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2">
            {/* App Header */}
            <div className="flex items-start gap-6 mb-8">
              <div className="w-32 h-32 app-icon bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-3xl shadow-lg">
                {data.appIcon ? (
                  <img src={data.appIcon} alt={data.appName} className="w-full h-full app-icon object-cover" />
                ) : (
                  data.appName.charAt(0)
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-normal text-gray-900">{data.appName}</h1>
                  {data.isVerified && (
                    <ShieldCheck className="w-6 h-6 text-blue-600" />
                  )}
                </div>
                
                <div className="flex items-center gap-3 mb-3">
                  <a href="#" className="text-green-700 text-base font-medium developer-link hover:underline">
                    {data.developer}
                  </a>
                  {data.isEditorsChoice && (
                    <span className="editors-choice-badge app-badge">
                      {t('googlePlay.editorsChoice')}
                    </span>
                  )}
                  <span className="app-badge">
                    {t('googlePlay.hasAds')}
                  </span>
                  <span className="app-badge">
                    {t('googlePlay.inAppPurchases')}
                  </span>
                </div>

                <div className="flex items-center gap-6 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-medium text-gray-900">{data.rating}</span>
                    <div className="stars-container">
                      {renderStars(data.rating)}
                    </div>
                  </div>
                  <span className="text-sm text-gray-600">
                    {data.reviewsCount.toLocaleString()} {t('googlePlay.reviews')}
                  </span>
                  <span className="text-sm text-gray-600">
                    {data.downloadsCount}
                  </span>
                  <span className="app-badge">
                    {data.ageRating}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <Button 
                    onClick={handleInstallClick}
                    className="install-button"
                  >
                    {t('googlePlay.install')}
                  </Button>
                  <button className="p-3 rounded-full hover:bg-gray-100 border border-gray-300">
                    <Share2 className="w-5 h-5 text-gray-700" />
                  </button>
                  <button className="p-3 rounded-full hover:bg-gray-100 border border-gray-300">
                    <svg className="w-5 h-5 text-gray-700" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                  </button>
                  <button className="p-3 rounded-full hover:bg-gray-100 border border-gray-300">
                    <MoreVertical className="w-5 h-5 text-gray-700" />
                  </button>
                </div>
              </div>
            </div>

            {/* Screenshots Carousel */}
            <div className="mb-8">
              <div className="flex gap-4 overflow-x-auto screenshot-container pb-4">
                {data.screenshots?.map((screenshot, index) => (
                  <img
                    key={index}
                    src={screenshot}
                    alt={`Screenshot ${index + 1}`}
                    className="w-56 h-auto rounded-lg shadow-lg flex-shrink-0 cursor-pointer hover:shadow-xl transition-shadow"
                  />
                )) || (
                  // Placeholder screenshots
                  [...Array(5)].map((_, index) => (
                    <div
                      key={index}
                      className="w-56 h-96 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg shadow-lg flex-shrink-0 flex items-center justify-center text-white font-bold cursor-pointer hover:shadow-xl transition-shadow"
                    >
                      <div className="text-center">
                        <div className="text-6xl mb-2">🎰</div>
                        <div>Screenshot {index + 1}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* About this game */}
            <div className="mb-8">
              <h2 className="text-xl font-medium mb-3">{t('googlePlay.aboutThisGame')}</h2>
              <h3 className="text-lg font-medium mb-2">{data.descriptionTitle}</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                {data.description}
              </p>
              
              {data.whatIsNew && (
                <div className="mb-6">
                  <h4 className="font-medium mb-2">{t('googlePlay.whatsNew')}</h4>
                  <p className="text-gray-700 text-sm">{data.whatIsNew}</p>
                </div>
              )}
            </div>

            {/* Ratings and reviews */}
            <div className="info-section">
              <h2 className="text-xl font-medium mb-6">Оценки и отзывы</h2>
              <div className="flex items-start gap-8 mb-8">
                <div className="text-center">
                  <div className="text-6xl font-light text-gray-900 mb-2">{data.rating}</div>
                  <div className="stars-container mb-2">
                    {renderStars(data.rating)}
                  </div>
                  <div className="text-sm text-gray-600">
                    {data.reviewsCount.toLocaleString()} отзывов
                  </div>
                </div>
                
                <div className="flex-1 max-w-md">
                  {[5, 4, 3, 2, 1].map((stars) => (
                    <div key={stars} className="flex items-center gap-3 mb-2">
                      <span className="text-sm w-2 text-gray-600">{stars}</span>
                      <div className="flex-1 rating-bar">
                        <div 
                          className="rating-bar-fill"
                          style={{ 
                            width: `${stars === 5 ? 75 : stars === 4 ? 18 : stars === 3 ? 4 : stars === 2 ? 2 : 1}%` 
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sample Reviews */}
              <div className="space-y-4">
                <div className="border-b border-gray-100 pb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      И
                    </div>
                    <div>
                      <div className="font-medium text-sm">Игорь М.</div>
                      <div className="flex items-center gap-2">
                        <div className="stars-container">
                          {renderStars(5)}
                        </div>
                        <span className="text-xs text-gray-500">2 дня назад</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700">
                    Отличная игра! Графика на высоте, бонусы хорошие. Рекомендую всем любителям казино.
                  </p>
                </div>

                <div className="border-b border-gray-100 pb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      А
                    </div>
                    <div>
                      <div className="font-medium text-sm">Анна К.</div>
                      <div className="flex items-center gap-2">
                        <div className="stars-container">
                          {renderStars(4)}
                        </div>
                        <span className="text-xs text-gray-500">неделю назад</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700">
                    Играю уже месяц, нравится разнообразие игр. Выплаты быстрые.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1">
            {/* Install Section */}
            <div className="sidebar-section">
              <Button 
                onClick={handleInstallClick}
                className="w-full install-button mb-4 py-3 text-base font-medium"
              >
                <Download className="w-5 h-5 mr-2" />
                Установить
              </Button>
              
              <div className="text-xs text-gray-500 text-center mb-4">
                Это приложение недоступно для вашего устройства.
              </div>

              <div className="space-y-2 text-sm">
                <div className="info-row">
                  <span className="info-label">Версия</span>
                  <span className="info-value">{data.version}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Обновлено</span>
                  <span className="info-value">{new Date(data.lastUpdated).toLocaleDateString('ru-RU')}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Размер</span>
                  <span className="info-value">{data.size || 'Зависит от устройства'}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Количество установок</span>
                  <span className="info-value">{data.downloadsCount}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Возрастные ограничения</span>
                  <span className="info-value">{data.ageRating}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Разработчик</span>
                  <a href="#" className="info-value developer-link">{data.developer}</a>
                </div>
                <div className="info-row">
                  <span className="info-label">Разрешения</span>
                  <a href="#" className="info-value developer-link">Подробнее</a>
                </div>
              </div>
            </div>

            {/* Data safety */}
            <div className="sidebar-section">
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-green-600" />
                Безопасность данных
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                {data.dataAndPrivacy || "Разработчик указал, что приложение не собирает и не передает персональные данные третьим лицам."}
              </p>
              <a href="#" className="text-sm developer-link">Подробнее</a>
            </div>

            {/* Developer info */}
            <div className="sidebar-section">
              <h3 className="font-medium mb-3">О разработчике</h3>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 font-medium">
                  {data.developer.charAt(0)}
                </div>
                <div>
                  <a href="#" className="developer-link font-medium">{data.developer}</a>
                  <div className="text-xs text-gray-500">Разработчик</div>
                </div>
              </div>
              <a href="#" className="text-sm developer-link">Связаться с разработчиком</a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
