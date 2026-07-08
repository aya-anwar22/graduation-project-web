import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
    ar: {
        translation: {
            appName: "مشروعي",
            home: "الرئيسية",
            myProject: "مشروعي",
            team: "فريقي",
            aiAssistant: "المساعد الذكي",
            chat: "شات الفريق والدكتور",
            requestSupervision: "طلب إشراف",
            notifications: "الإشعارات",
            previousProjects: "المشاريع السابقة",
            logout: "تسجيل الخروج",
            userName: "أحمد علي",
            userEmail: "a.ali@university.edu",
            userImage: "صورة المستخدم",
            openMenu: "فتح القائمة",
            closeMenu: "إغلاق القائمة",
        }
    },
    en: {
        translation: {
            appName: "My Project",
            home: "Home",
            myProject: "My Project",
            team: "My Team",
            aiAssistant: "AI Assistant",
            chat: "Team & Doctor Chat",
            requestSupervision: "Request Supervision",
            notifications: "Notifications",
            previousProjects: "Previous Projects",
            logout: "Logout",
            userName: "Ahmed Ali",
            userEmail: "a.ali@university.edu",
            userImage: "User Image",
            openMenu: "Open Menu",
            closeMenu: "Close Menu",
        }
    }
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'ar',
        interpolation: {
            escapeValue: false
        },
        detection: {
            order: ['localStorage', 'navigator'],
            caches: ['localStorage']
        }
    });

export default i18n;