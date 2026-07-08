
import React, { createContext, useState, useContext, type ReactNode, useEffect } from 'react';

interface LanguageContextType {
    lang: string;
    changeLanguage: (lang: string) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within LanguageProvider');
    }
    return context;
};

interface LanguageProviderProps {
    children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
    const [lang, setLang] = useState<string>(() => {
        // جلب اللغة من localStorage أو استخدام العربية كافتراضي
        return localStorage.getItem('language') || 'ar';
    });

    useEffect(() => {
        // حفظ اللغة في localStorage عند التغيير
        localStorage.setItem('language', lang);
        
        // تغيير اتجاه الصفحة
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = lang;
    }, [lang]);

    const changeLanguage = (newLang: string) => {
        setLang(newLang);
    };

    return (
        <LanguageContext.Provider value={{ lang, changeLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};