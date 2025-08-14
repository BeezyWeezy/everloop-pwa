const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Маппинг хардкодных текстов на ключи переводов
const textMappings = {
    // Auth texts
    'Пароли не совпадают': 'notifications.auth.passwordMismatch',
    'Неверные данные для входа': 'notifications.auth.loginError',
    'Проверьте email для подтверждения аккаунта': 'notifications.auth.registrationSuccess',
    'Проверьте email для подтверждения регистрации': 'notifications.auth.registrationError',
    'Если email существует, инструкция отправлена на ваш email': 'notifications.auth.passwordResetSuccess',
    'Произошла ошибка. Попробуйте еще раз': 'notifications.auth.passwordResetError',
    'Пароль успешно изменен': 'notifications.auth.passwordChangeSuccess',
    'Не удалось изменить пароль. Попробуйте еще раз': 'notifications.auth.passwordChangeError',
    'Успешная авторизация через Google': 'notifications.auth.oauthSuccess',
    'Ошибка при входе через Google': 'notifications.auth.oauthError',
    'Произошла ошибка при авторизации': 'notifications.auth.oauthGeneralError',
    'Подтвердите email перед входом': 'notifications.auth.emailNotConfirmed',
    'Слишком много попыток входа. Попробуйте позже': 'notifications.auth.tooManyAttempts',
    'Пароль должен содержать минимум 6 символов': 'notifications.auth.passwordMinLength',
    'Проверьте правильность email адреса': 'notifications.auth.invalidEmail',
    'Произошла ошибка. Попробуйте еще раз': 'notifications.auth.generalError',
    
    // PWA texts
    'Не удалось загрузить данные приложения': 'notifications.pwa.loadError',
    'Не удалось загрузить список приложений': 'notifications.pwa.loadListError',
    'Не удалось создать PWA': 'notifications.pwa.createError',
    'Не удалось обновить PWA': 'notifications.pwa.updateError',
    'Не удалось удалить приложение': 'notifications.pwa.deleteError',
    'Не удалось изменить статус приложения': 'notifications.pwa.statusChangeError',
    'Не удалось загрузить логотип': 'notifications.pwa.logoUploadError',
    'Не удалось удалить логотип': 'notifications.pwa.logoDeleteError',
    'Не удалось загрузить скриншоты': 'notifications.pwa.screenshotUploadError',
    'Не удалось удалить скриншот': 'notifications.pwa.screenshotDeleteError',
    'Не удалось сохранить новый порядок скриншотов': 'notifications.pwa.screenshotOrderError',
    'Не удалось загрузить файлы': 'notifications.pwa.mediaUploadError',
    'Не удалось удалить файл': 'notifications.pwa.mediaDeleteError',
    'Пожалуйста, заполните все обязательные поля: название, домен и URL казино': 'notifications.pwa.requiredFields',
    'Casino PWA создано! PWA успешно создано и готово к использованию': 'notifications.pwa.createSuccess',
    
    // Domain texts
    'Ошибка поиска доменов. Попробуйте еще раз.': 'notifications.domain.searchError',
    'Домены с названием': 'notifications.domain.noDomainsFound',
    'Попробуйте более уникальное название или другие варианты доменов.': 'notifications.domain.searchTips',
    'Не удалось приобрести домен': 'notifications.domain.purchaseError',
    'Домен успешно приобретен': 'notifications.domain.purchaseSuccess',
    
    // UI texts
    'Назад': 'ui.back',
    'Далее': 'ui.next',
    'Отмена': 'ui.cancel',
    'Сохранить': 'ui.save',
    'Удалить': 'ui.delete',
    'Редактировать': 'ui.edit',
    'Добавить': 'ui.add',
    'Подтвердить': 'ui.confirm',
    'Закрыть': 'ui.close',
    'Загрузка...': 'ui.loading',
    'Ошибка': 'ui.error',
    'Успех': 'ui.success',
    'Предупреждение': 'ui.warning',
    
    // Form labels
    'Имя': 'ui.name',
    'Email': 'ui.email',
    'Пароль': 'ui.password',
    'Подтвердите пароль': 'ui.confirmPassword',
    'Описание': 'ui.description',
    'Категория': 'ui.category',
    'Язык': 'ui.language',
    'Версия': 'ui.version',
    'Размер': 'ui.size',
    'Рейтинг': 'ui.rating',
    'Отзывы': 'ui.reviews',
    'Скачивания': 'ui.downloads',
    'Возрастной рейтинг': 'ui.ageRating',
    'Разработчик': 'ui.developer',
    'Последнее обновление': 'ui.lastUpdated',
    
    // Status
    'Активен': 'ui.active',
    'Неактивен': 'ui.inactive',
    'Черновик': 'ui.draft',
    'Опубликовано': 'ui.published',
    'В ожидании': 'ui.pending',
    'Завершено': 'ui.completed',
    'Ошибка': 'ui.failed'
};

// Функция для замены текста в файле
function replaceTextInFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let hasChanges = false;
    
    // Заменяем хардкодные тексты на переводы
    for (const [hardcodedText, translationKey] of Object.entries(textMappings)) {
        const regex = new RegExp(`['"]${hardcodedText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"]`, 'g');
        if (regex.test(content)) {
            content = content.replace(regex, `t('${translationKey}')`);
            hasChanges = true;
        }
    }
    
    // Добавляем импорт useTranslation если его нет
    if (hasChanges && !content.includes('useTranslation')) {
        const importRegex = /import.*from.*['"]react['"]/;
        if (importRegex.test(content)) {
            content = content.replace(
                /import.*from.*['"]react['"]/,
                `import React, { useState, useEffect } from 'react';\nimport { useTranslation } from 'react-i18next';`
            );
        } else {
            content = content.replace(
                /import React.*from ['"]react['"]/,
                `import React, { useState, useEffect } from 'react';\nimport { useTranslation } from 'react-i18next';`
            );
        }
        
        // Добавляем const { t } = useTranslation(); в начало компонента
        const componentRegex = /export default function (\w+)/;
        if (componentRegex.test(content)) {
            content = content.replace(
                /export default function (\w+)/,
                `export default function $1() {\n    const { t } = useTranslation();`
            );
        }
    }
    
    if (hasChanges) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Updated: ${filePath}`);
    }
}

// Находим все TSX файлы
const tsxFiles = glob.sync('src/**/*.tsx', { ignore: ['src/i18n/**'] });

console.log('🔄 Starting replacement of hardcoded texts...');

tsxFiles.forEach(file => {
    try {
        replaceTextInFile(file);
    } catch (error) {
        console.error(`❌ Error processing ${file}:`, error.message);
    }
});

console.log('✅ Finished replacing hardcoded texts!');
