import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { NavTab } from '../types';
import { 
  Menu, X, Globe, ShieldCheck, HeartHandshake, Calendar, 
  Image as ImageIcon, Users, UserCheck, History, Home, PhoneCall 
} from 'lucide-react';

interface HeaderProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  announcementsCount: number;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const { language, setLanguage, toggleLanguage, t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems: { id: NavTab; mr: string; en: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'home', mr: 'मुख्यपृष्ठ', en: 'Home', icon: Home },
    { id: 'history', mr: 'इतिहास', en: 'History', icon: History },
    { id: 'committee', mr: 'कार्यकारिणी', en: 'Committee', icon: ShieldCheck },
    { id: 'members', mr: 'सदस्य', en: 'Members', icon: UserCheck },
    { id: 'gallery', mr: 'गॅलरी', en: 'Gallery', icon: ImageIcon },
    { id: 'events', mr: 'कार्यक्रम', en: 'Events', icon: Calendar },
    { id: 'social', mr: 'सामाजिक उपक्रम', en: 'Social Work', icon: HeartHandshake },
    { id: 'contact', mr: 'संपर्क', en: 'Contact', icon: PhoneCall },
  ];

  const handleNavClick = (tab: NavTab) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#F0F0F0] transition-all">
      {/* Top Thin Heritage Accent Bar */}
      <div className="h-1 bg-gradient-to-r from-[#FF9933] via-[#C89B3C] to-[#FF9933]" />

      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Mandal Title */}
          <button 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 text-left focus:outline-none group"
            id="header-logo-btn"
          >
            {/* Custom Logo */}
            <div className="w-12 h-12 rounded-full overflow-hidden shadow-xs group-hover:scale-105 transition-transform bg-white border border-[#FF9933]/30">
              <img src="/Logo.png" alt="Taqdeer Mitra Mandal Logo" className="w-full h-full object-cover" />
            </div>
            
            <div>
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-[#111111] leading-tight font-marathi">
                {t('तकदीर मित्र मंडळ, सातपाटी', 'Taqdeer Mitra Mandal, Satpati')}
              </h1>
              <p className="text-xs text-gray-500 flex items-center gap-2 mt-0.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#C89B3C]" />
                {t('स्थापना १९८१ • सातपाटी', 'Est. 1981 • Satpati')}
                <span className="hidden sm:inline-block text-[#C89B3C] font-medium italic font-marathi">
                  | {t('श्रद्धा • सेवा • संस्कृती', 'Faith • Service • Culture')}
                </span>
              </p>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-[13px] font-medium">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  id={`nav-btn-${item.id}`}
                  className={`transition-colors flex items-center gap-1.5 ${
                    isActive 
                      ? 'text-[#FF9933] font-semibold' 
                      : 'text-[#111111] hover:text-[#C89B3C]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#FF9933]' : 'text-gray-400'}`} />
                  <span>{t(item.mr, item.en)}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Actions: Admin Button + Language Toggle */}
          <div className="hidden lg:flex items-center gap-4">

            {/* Language Switcher Pill */}
            <div className="flex items-center gap-2 text-[12px] font-bold border border-gray-200 rounded-full px-3 py-1.5 bg-white shadow-2xs">
              <button
                onClick={() => setLanguage('mr')}
                id="lang-btn-mr"
                className={`transition-colors ${
                  language === 'mr' ? 'text-[#FF9933]' : 'text-gray-400 hover:text-black'
                }`}
              >
                MR
              </button>
              <span className="text-gray-300">|</span>
              <button
                onClick={() => setLanguage('en')}
                id="lang-btn-en"
                className={`transition-colors ${
                  language === 'en' ? 'text-[#FF9933]' : 'text-gray-400 hover:text-black'
                }`}
              >
                EN
              </button>
            </div>
          </div>

          {/* Mobile Menu & Language Toggle */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={toggleLanguage}
              className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200 flex items-center gap-1"
              id="mobile-lang-toggle"
            >
              <Globe className="w-3.5 h-3.5 text-[#FF9933]" />
              <span>{language === 'mr' ? 'मराठी' : 'EN'}</span>
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              id="mobile-menu-toggle-btn"
              className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 focus:outline-none"
              aria-label="Toggle Navigation"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 pt-2 pb-6 shadow-xl animate-in slide-in-from-top duration-200">
          <div className="space-y-1 py-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  id={`mobile-nav-btn-${item.id}`}
                  className={`w-full text-left px-4 py-3 rounded-xl text-base font-medium flex items-center justify-between ${
                    isActive
                      ? 'bg-[#FAF8F5] text-[#FF9933] border border-[#C89B3C]/30 font-semibold'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${isActive ? 'text-[#FF9933]' : 'text-gray-400'}`} />
                    <span>{t(item.mr, item.en)}</span>
                  </div>
                  {isActive && <div className="w-2 h-2 rounded-full bg-[#FF9933]" />}
                </button>
              );
            })}

          </div>
        </div>
      )}
    </header>
  );
};
