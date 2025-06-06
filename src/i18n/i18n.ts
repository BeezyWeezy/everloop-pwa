import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import LanguageDetector from "i18next-browser-languagedetector"

// Локальные переводы
const resources = {
    en: {
        translation: {
            welcome: "Welcome",
            description: "This is your profile page",
            changeLanguage: "Change Language",
            edit: "Edit",
            profileInfo: "Profile Information",
            mainProfileInfo: "Basic information about your account",
            name: "Name",
            email: "Email",
            password: "Password",
            changePassword: "Change Password",
            confirmPassword: "Confirm Password",
            saveChanges: "Save Changes",
            cancel: "Cancel",
        },
    },
    ru: {
        translation: {
            welcome: "Добро пожаловать",
            description: "Это ваша страница профиля",
            changeLanguage: "Сменить язык",
            edit: "Редактировать",
            profileInfo: "Информация профиля",
            mainProfileInfo: "Основная информация о вашем аккаунте",
            name: "Имя",
            email: "Email",
            password: "Пароль",
            changePassword: "Сменить пароль",
            confirmPassword: "Подтвердите пароль",
            saveChanges: "Сохранить изменения",
            cancel: "Отмена",
        },
    },
    ua: {
        translation: {
            welcome: "Ласкаво просимо",
            description: "Це ваша сторінка профілю",
            changeLanguage: "Змінити мову",
            edit: "Редагувати",
            profileInfo: "Інформація профілю",
            mainProfileInfo: "Основна інформація про ваш обліковий запис",
            name: "Ім'я",
            email: "Email",
            password: "Пароль",
            changePassword: "Змінити пароль",
            confirmPassword: "Підтвердіть пароль",
            saveChanges: "Зберегти зміни",
            cancel: "Скасувати",
        },
    },
}

i18n
    .use(initReactI18next) // Подключаем i18next в React
    .use(LanguageDetector) // Определение языка пользователя
    .init({
        resources, // Передаём переводы прямо в коде
        fallbackLng: "en", // Язык по умолчанию
        interpolation: {
            escapeValue: false, // Для React не нужно экранирование
        },
    })

export default i18n
