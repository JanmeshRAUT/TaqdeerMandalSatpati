import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language } from '../types';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (mrText: string, enText: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Check URL pathname for /en or /mr, default to 'mr'
  const [language, setLanguageState] = useState<Language>(() => {
    const path = window.location.pathname;
    if (path.startsWith('/en')) return 'en';
    const saved = localStorage.getItem('tmm_lang');
    if (saved === 'en' || saved === 'mr') return saved;
    return 'mr'; // Default Marathi
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('tmm_lang', lang);
    
    // Update document title and lang attribute
    document.documentElement.lang = lang;
    
    // Update URL hash/history without full reload
    const newPath = lang === 'en' ? '/en' : '/mr';
    window.history.replaceState(null, '', newPath + window.location.hash);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'mr' ? 'en' : 'mr');
  };

  const t = (mrText: string, enText: string): string => {
    if (language === 'en') {
      return enText || mrText; // fallback to mr if en empty
    }
    return mrText;
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
