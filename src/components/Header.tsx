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
    <header className="sticky top-0 z-40 glass-panel transition-all">
      {/* Top Thin Heritage Accent Bar */}
      <div className="h-1.5 bg-gradient-to-r from-amber-500 via-yellow-300 to-amber-500 shadow-sm" />

      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Mandal Title */}
          <button 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 text-left focus:outline-none group"
            id="header-logo-btn"
          >
            {/* Custom Logo */}
            <div className="w-12 h-12 rounded-full overflow-hidden shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all bg-white border border-[#D4AF37]/40">
              <img src="/Logo.png" alt="Taqdeer Mitra Mandal Logo" className="w-full h-full object-cover" />
            </div>
            
            <div>
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-gradient-saffron leading-tight font-marathi drop-shadow-sm">
                {t('तकदीर मित्र मंडळ, सातपाटी', 'Taqdeer Mitra Mandal, Satpati')}
              </h1>
              <p className="text-xs text-gray-600 flex items-center gap-2 mt-0.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#D4AF37] shadow-[0_0_8px_rgba(212,175,55,0.8)]" />
                <span className="font-semibold">{t('स्थापना १९८१ • सातपाटी', 'Est. 1981 • Satpati')}</span>
                <span className="hidden sm:inline-block text-[#D4AF37] font-semibold italic font-marathi">
                  | {t('श्रद्धा • सेवा • संस्कृती', 'Faith • Service • Culture')}
                </span>
              </p>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-[13px] font-semibold">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  id={`nav-btn-${item.id}`}
                  className={`transition-all flex items-center gap-1.5 px-3 py-2 rounded-xl ${
                    isActive 
                      ? 'bg-gradient-to-br from-amber-50 to-orange-50 text-[#FF6A00] shadow-sm border border-amber-100/50' 
                      : 'text-gray-700 hover:text-[#D4AF37] hover:bg-gray-50/50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#FF6A00]' : 'text-gray-400'}`} />
                  <span className="font-marathi tracking-wide">{t(item.mr, item.en)}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Actions: Admin Button + Language Toggle */}
          <div className="hidden lg:flex items-center gap-4">

            {/* Language Switcher Pill */}
            <div className="flex items-center gap-2 text-[12px] font-bold border border-gray-200/50 rounded-full px-3 py-1.5 glass-panel shadow-sm hover:shadow-md transition-shadow">
              <button
                onClick={() => setLanguage('mr')}
                id="lang-btn-mr"
                className={`transition-colors ${
                  language === 'mr' ? 'text-[#FF6A00]' : 'text-gray-500 hover:text-black'
                }`}
              >
                MR
              </button>
              <span className="text-gray-300">|</span>
              <button
                onClick={() => setLanguage('en')}
                id="lang-btn-en"
                className={`transition-colors ${
                  language === 'en' ? 'text-[#FF6A00]' : 'text-gray-500 hover:text-black'
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
              className="px-2.5 py-1 rounded-full text-xs font-bold glass-panel text-gray-800 border border-amber-200/50 flex items-center gap-1 shadow-sm"
              id="mobile-lang-toggle"
            >
              <Globe className="w-3.5 h-3.5 text-[#FF6A00]" />
              <span>{language === 'mr' ? 'मराठी' : 'EN'}</span>
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              id="mobile-menu-toggle-btn"
              className="p-2 rounded-xl text-gray-700 hover:bg-gray-100/50 focus:outline-none transition-colors"
              aria-label="Toggle Navigation"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden glass-panel border-b border-gray-200/50 px-4 pt-2 pb-6 shadow-xl animate-in slide-in-from-top duration-300">
          <div className="space-y-1 py-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  id={`mobile-nav-btn-${item.id}`}
                  className={`w-full text-left px-4 py-3 rounded-xl text-base font-bold flex items-center justify-between transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-50 to-orange-50 text-[#FF6A00] border border-[#D4AF37]/30 shadow-sm'
                      : 'text-gray-700 hover:bg-white/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${isActive ? 'text-[#FF6A00]' : 'text-gray-400'}`} />
                    <span className="font-marathi tracking-wide">{t(item.mr, item.en)}</span>
                  </div>
                  {isActive && <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#FF6A00] to-[#D4AF37] shadow-sm" />}
                </button>
              );
            })}

          </div>
        </div>
      )}
    </header>
  );
};
