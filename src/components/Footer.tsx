import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { NavTab } from '../types';
import { MapPin, Phone, Mail, Instagram, Facebook, MessageCircle, Heart, ArrowUp } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: NavTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  const { language, setLanguage, t } = useLanguage();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#FAF8F5] border-t border-gray-200 text-[#111111] pt-14 pb-8">
      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-gray-200/80">
          
          {/* Col 1: Mandal Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white border border-[#C89B3C]/40 flex items-center justify-center text-[#FF9933] shadow-2xs font-bold font-marathi">
                ॐ
              </div>
              <div>
                <h3 className="font-bold text-base font-marathi text-[#111111]">
                  {t('तकदीर मित्र मंडळ, सातपाटी', 'Taqdeer Mitra Mandal, Satpati')}
                </h3>
                <p className="text-xs text-[#FF9933] font-medium">
                  {t('श्रद्धा • सेवा • संस्कृती', 'Faith • Service • Culture')}
                </p>
              </div>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              {t(
                '१९८१ पासून सातपाटी गावातील सांस्कृतिक वारसा जपणारे, सामाजिक बांधीलकी जपणारे व गणेशोत्सवाचे नेटके आयोजन करणारे अग्रणी मंडळ.',
                'Preserving Satpati village’s cultural heritage, social commitment, and traditional Ganesha celebrations since 1981.'
              )}
            </p>
            <div className="flex items-center gap-2 pt-1">
              <span className="inline-block px-2.5 py-1 rounded-full bg-white text-xs font-semibold text-gray-700 border border-gray-200 shadow-2xs">
                {t('पालघर जिल्हा', 'Palghar District')}
              </span>
              <span className="inline-block px-2.5 py-1 rounded-full bg-white text-xs font-semibold text-[#FF9933] border border-[#C89B3C]/30 shadow-2xs">
                {t('स्थापना: १९८१', 'Est. 1981')}
              </span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-gray-900 uppercase tracking-wider font-marathi">
              {t('जलद दुवे', 'Quick Links')}
            </h4>
            <ul className="space-y-2 text-xs text-gray-600">
              <li>
                <button onClick={() => { setActiveTab('history'); scrollToTop(); }} className="hover:text-[#FF9933] transition-colors">
                  {t('मंडळाचा इतिहास (History)', 'Mandal History')}
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveTab('committee'); scrollToTop(); }} className="hover:text-[#FF9933] transition-colors">
                  {t('कार्यकारिणी समिती (Committee)', 'Executive Committee')}
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveTab('members'); scrollToTop(); }} className="hover:text-[#FF9933] transition-colors">
                  {t('सदस्य यादी (Members)', 'Members Directory')}
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveTab('gallery'); scrollToTop(); }} className="hover:text-[#FF9933] transition-colors">
                  {t('फोटो गॅलरी (Gallery)', 'Photo Gallery')}
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveTab('events'); scrollToTop(); }} className="hover:text-[#FF9933] transition-colors">
                  {t('उत्सव कार्यक्रम पत्रिका (Events)', 'Festival Events Schedule')}
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveTab('social'); scrollToTop(); }} className="hover:text-[#FF9933] transition-colors">
                  {t('सामाजिक उपक्रम (Social Work)', 'Social Activities')}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact & Address */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-gray-900 uppercase tracking-wider font-marathi">
              {t('संपर्क व पत्ता', 'Contact & Location')}
            </h4>
            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#FF9933] shrink-0 mt-0.5" />
                <span>
                  {t(
                    'तकदीर मित्र मंडळ, सातपाटी बीच रोड, सातपाटी, तालुका व जिल्हा पालघर, महाराष्ट्र - ४०१४०५',
                    'Taqdeer Mitra Mandal, Satpati Beach Road, Satpati, Taluka & District Palghar, Maharashtra - 401405'
                  )}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#FF9933] shrink-0" />
                <span>{t('लवकरच उपलब्ध', 'Coming Soon')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#FF9933] shrink-0" />
                <span>{t('लवकरच उपलब्ध', 'Coming Soon')}</span>
              </div>
            </div>
          </div>

          {/* Col 4: Connect & Languages */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-gray-900 uppercase tracking-wider font-marathi">
              {t('सोशल मीडिया व भाषा', 'Connect & Language')}
            </h4>
            <p className="text-xs text-gray-600">
              {t('मंडळाच्या ताज्या घडामोडींसाठी सोशल मीडियावर जोडले जा.', 'Connect with us on social media for live festival updates.')}
            </p>
            
            {/* Social Buttons */}
            <div className="flex items-center gap-2 pt-1">
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all shadow-2xs"
                title="WhatsApp Direct"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-pink-50 text-pink-600 border border-pink-200 flex items-center justify-center hover:bg-pink-600 hover:text-white transition-all shadow-2xs"
                title="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all shadow-2xs"
                title="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>

            {/* Language Selection inside footer */}
            <div className="pt-2">
              <label className="text-xs text-gray-500 block mb-1.5 font-medium">
                {t('भाषा निवडा (Select Language):', 'Select Language:')}
              </label>
              <div className="inline-flex p-0.5 rounded-lg bg-white border border-gray-300">
                <button
                  onClick={() => setLanguage('mr')}
                  className={`px-3 py-1 rounded-md text-xs font-semibold ${
                    language === 'mr' ? 'bg-[#FF9933] text-white' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  मराठी
                </button>
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-3 py-1 rounded-md text-xs font-semibold ${
                    language === 'en' ? 'bg-[#FF9933] text-white' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  English
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright & Scroll to Top */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p className="flex items-center gap-1 text-center sm:text-left">
            <span>Copyright © {new Date().getFullYear()} Taqdeer Mitra Mandal, Satpati. All Rights Reserved.</span>
          </p>
          
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-gray-500">
              {t('स्नेहाने निर्मित', 'Crafted with')} <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> {t('सातपाटी सांस्कृतिक वारसा', 'Satpati Heritage')}
            </span>

            <button
              onClick={scrollToTop}
              className="p-2 rounded-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors shadow-2xs"
              title="Back to Top"
              id="footer-scroll-top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
