import React from 'react';
import { Home, Shirt, Heart, Shield } from 'lucide-react';
import { NavTab } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface MobileBottomNavProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ activeTab, setActiveTab }) => {
  const { t } = useLanguage();

  const navItems = [
    { id: 'home', label: t('होम', 'Home'), icon: Home },
    { id: 'jersey-shop', label: t('जर्सी', 'Jersey'), icon: Shirt },
    { id: 'donation', label: t('देणगी', 'Donate'), icon: Heart },
    { id: 'admin', label: t('अॅडमिन', 'Admin'), icon: Shield },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#ffffff] border-t border-[#E5E7EB] shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-[100] px-2 pb-safe pt-2">
      <div className="flex justify-between items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as NavTab)}
              className={`flex flex-col items-center justify-center w-full py-2 transition-all duration-200 ${
                isActive ? 'text-[#FF9933]' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <div className={`p-1.5 rounded-full transition-all duration-300 ${isActive ? 'bg-orange-50 scale-110' : 'bg-transparent'}`}>
                <Icon className={`w-6 h-6 ${isActive ? 'fill-orange-50' : ''}`} />
              </div>
              <span className={`text-[10px] font-bold mt-1 tracking-wider ${isActive ? 'text-[#FF9933]' : 'text-gray-500'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
