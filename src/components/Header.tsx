import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { NavTab } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, Globe, ShieldCheck, HeartHandshake, Calendar, 
  Image as ImageIcon, Users, UserCheck, History, Home, PhoneCall, Shirt 
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
    { id: 'jersey-shop', mr: 'जर्सी शॉप', en: 'Jersey Shop', icon: Shirt },
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
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="sticky top-0 z-40 glass-panel transition-all"
    >
      {/* Top Thin Heritage Accent Bar */}
      <div className="h-1.5 bg-gradient-to-r from-amber-500 via-yellow-300 to-amber-500 shadow-sm" />

      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Mandal Title */}
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 text-left focus:outline-none group cursor-pointer"
            id="header-logo-btn"
          >
            {/* Custom Logo */}
            <div className="w-12 h-12 rounded-full overflow-hidden shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all bg-white border border-[#D4AF37]/40">
              <img src="/Logo.png" alt="Taqdeer Mitra Mandal Logo" className="w-full h-full object-cover" />
            </div>
            
            <div>
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-gradient-saffron leading-tight font-marathi drop-shadow-sm group-hover:text-[#FF9933] transition-colors">
                {t('तकदीर मित्र मंडळ, सातपाटी', 'Taqdeer Mitra Mandal, Satpati')}
              </h1>
              <p className="text-xs text-gray-600 flex items-center gap-2 mt-0.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#D4AF37] shadow-[0_0_8px_rgba(212,175,55,0.8)] animate-pulse" />
                <span className="font-semibold">{t('स्थापना १९८१ • सातपाटी', 'Est. 1981 • Satpati')}</span>
                <span className="hidden sm:inline-block text-[#D4AF37] font-semibold italic font-marathi">
                  | {t('श्रद्धा • सेवा • संस्कृती', 'Faith • Service • Culture')}
                </span>
              </p>
            </div>
          </motion.button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-[13px] font-semibold relative">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <motion.button
                  key={item.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleNavClick(item.id)}
                  id={`nav-btn-${item.id}`}
                  className={`transition-all flex items-center gap-1.5 px-3 py-2 rounded-xl relative cursor-pointer ${
                    isActive 
                      ? 'text-[#FF6A00]' 
                      : 'text-gray-700 hover:text-[#D4AF37]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 relative z-10 ${isActive ? 'text-[#FF6A00]' : 'text-gray-400'}`} />
                  <span className="font-marathi tracking-wide relative z-10">{t(item.mr, item.en)}</span>
                  
                  {isActive && (
                    <motion.div 
                      layoutId="desktopNavIndicator"
                      className="absolute inset-0 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100/50 rounded-xl shadow-sm z-0"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </nav>

          {/* Right Actions: Language Toggle */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Language Switcher Pill */}
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 text-[12px] font-bold border border-gray-200/50 rounded-full px-3 py-1.5 glass-panel shadow-sm hover:shadow-md transition-shadow"
            >
              <button
                onClick={() => setLanguage('mr')}
                id="lang-btn-mr"
                className={`transition-colors cursor-pointer ${
                  language === 'mr' ? 'text-[#FF6A00]' : 'text-gray-500 hover:text-black'
                }`}
              >
                MR
              </button>
              <span className="text-gray-300">|</span>
              <button
                onClick={() => setLanguage('en')}
                id="lang-btn-en"
                className={`transition-colors cursor-pointer ${
                  language === 'en' ? 'text-[#FF6A00]' : 'text-gray-500 hover:text-black'
                }`}
              >
                EN
              </button>
            </motion.div>
          </div>

          {/* Mobile Menu & Language Toggle */}
          <div className="flex items-center gap-2 lg:hidden">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={toggleLanguage}
              className="px-2.5 py-1 rounded-full text-xs font-bold glass-panel text-gray-800 border border-amber-200/50 flex items-center gap-1 shadow-sm cursor-pointer"
              id="mobile-lang-toggle"
            >
              <Globe className="w-3.5 h-3.5 text-[#FF6A00]" />
              <span>{language === 'mr' ? 'मराठी' : 'EN'}</span>
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              id="mobile-menu-toggle-btn"
              className="p-2 rounded-xl text-gray-700 hover:bg-gray-100/50 focus:outline-none transition-colors cursor-pointer"
              aria-label="Toggle Navigation"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="lg:hidden glass-panel border-b border-gray-200/50 px-4 pt-2 shadow-xl overflow-hidden"
          >
            <div className="space-y-1 py-2 mb-6">
              {navItems.map((item, i) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <motion.button
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    id={`mobile-nav-btn-${item.id}`}
                    className={`w-full text-left px-4 py-3 rounded-xl text-base font-bold flex items-center justify-between transition-all cursor-pointer ${
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
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
