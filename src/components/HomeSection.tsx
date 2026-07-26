import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { NavTab, Announcement } from '../types';
import { CountdownWidget } from './CountdownWidget';
import { 
  History, Image as ImageIcon, Sparkles, HeartHandshake, 
  Calendar, ChevronRight, Award, Megaphone, Users, ShieldAlert, ArrowRight 
} from 'lucide-react';

interface HomeSectionProps {
  setActiveTab: (tab: NavTab) => void;
  announcements: Announcement[];
}

export const HomeSection: React.FC<HomeSectionProps> = ({ setActiveTab, announcements }) => {
  const { t } = useLanguage();

  const heroImages = [
    '/images/img1.jpeg',
    '/images/img5.jpeg',
    '/images/img6.jpeg',
    '/images/img7.jpeg',
  ];
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const activeAnnouncements = announcements.filter(a => a.isActive);

  return (
    <div className="space-y-16 py-6 sm:py-10">

      {/* Live Announcement Marquee Banner (If any) */}
      {activeAnnouncements.length > 0 && (
        <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-3 sm:p-4 rounded-2xl bg-[#FAF8F5] border border-[#C89B3C]/30 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-[#FF9933] text-white text-xs font-bold shrink-0 shadow-2xs">
              <Megaphone className="w-3.5 h-3.5 animate-bounce" />
              <span>{t('महत्त्वाची सूचना', 'Announcement')}</span>
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="text-sm font-medium text-gray-900 font-marathi">
                {t(activeAnnouncements[0].textMr, activeAnnouncements[0].textEn)}
              </div>
            </div>
            <button
              onClick={() => setActiveTab('events')}
              className="text-xs font-semibold text-[#FF9933] hover:text-[#C89B3C] flex items-center gap-1 shrink-0 font-marathi"
            >
              <span>{t('वेळापत्रक पहा', 'View Schedule')}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* HERO SECTION */}
      <section className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Heritage Badge */}
            <div className="inline-block py-1 px-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-[#D4AF37]/30 rounded-full text-[#D4AF37] text-[12px] font-bold uppercase tracking-widest mb-4 font-marathi shadow-sm">
              {t('स्थापना १९८१ • सातपाटी', 'ESTABLISHED 1981 • SATPATI')}
            </div>

            {/* Main Title */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight font-marathi">
                <span className="text-[#111111] drop-shadow-sm">{t('तकदीर मित्र मंडळ,', 'Taqdeer Mitra Mandal,')}</span><br />
                <span className="text-gradient-saffron">{t('सातपाटी', 'Satpati')}</span>
              </h1>
              <p className="text-2xl font-semibold text-gray-400 italic mb-6 font-marathi tracking-wide">
                {t('श्रद्धा • सेवा • संस्कृती', 'Faith • Service • Culture')}
              </p>
            </div>

            {/* Introduction Paragraph */}
            <p className="text-gray-600 max-w-md leading-relaxed mx-auto lg:mx-0 font-marathi text-sm sm:text-base font-medium">
              {t(
                'सातपाटी गावाच्या सांस्कृतिक आणि सामाजिक वारशाचे जतन करणारे एक प्रतिष्ठित मंडळ. गेली अनेक दशके आम्ही समाजहित आणि धार्मिक परंपरा जोपासत आहोत.',
                'A prestigious organization preserving the cultural and social heritage of Satpati village. Dedicated to community welfare and sacred traditions for decades.'
              )}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-6">
              <button
                onClick={() => setActiveTab('history')}
                id="hero-btn-history"
                className="px-8 py-4 bg-gradient-premium text-white rounded-xl font-bold hover:shadow-[0_0_20px_rgba(255,106,0,0.4)] hover:-translate-y-1 transition-all flex items-center gap-2.5 font-marathi text-sm shadow-xl"
              >
                <History className="w-4 h-4 text-[#FF6A00]" />
                <span>{t('मंडळाचा इतिहास', 'Mandal History')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveTab('gallery')}
                id="hero-btn-gallery"
                className="px-8 py-4 glass-panel rounded-xl font-bold hover:-translate-y-1 transition-all flex items-center gap-2.5 font-marathi text-sm text-[#111111]"
              >
                <ImageIcon className="w-4 h-4 text-[#D4AF37]" />
                <span>{t('फोटो गॅलरी', 'Photo Gallery')}</span>
              </button>
            </div>

            {/* Prominent Hero Countdown Widget */}
            <div className="pt-2">
              <CountdownWidget />
            </div>

            {/* Quick Badges */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-gray-500 font-medium">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>{t('स्थापना: १९८१ (४५+ वर्षे)', 'Est. 1981 (45+ Years)')}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>{t('पालघर जिल्हा, महाराष्ट्र', 'Palghar District, Maharashtra')}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#FF9933]" />
                <span>{t('पर्यावरणपूरक उत्सव', 'Eco-Friendly Celebrations')}</span>
              </div>
            </div>

          </div>

          {/* Right Hero Image Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative z-10 w-full h-[460px] sm:h-[500px] bg-black rounded-3xl shadow-2xl overflow-hidden border border-[#FAF8F5] group">
              {heroImages.map((src, index) => (
                <img
                  key={src}
                  src={src}
                  alt="Lord Ganesha Idol Satpati"
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 group-hover:scale-105 ease-in-out ${
                    index === currentHeroIndex ? 'opacity-100' : 'opacity-0'
                  }`}
                  referrerPolicy="no-referrer"
                />
              ))}
              
              {/* Divine Overlay Tag */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/90 via-[#111111]/30 to-transparent flex flex-col justify-end p-8 text-white">
                <p className="text-xs font-bold uppercase tracking-widest text-[#FF6A00] mb-1 drop-shadow-md">
                  {t('मुख्य आकर्षण • श्री गणेशोत्सव', 'MAIN ATTRACTION • SHREE GANESHOTSAV')}
                </p>
                <p className="text-2xl sm:text-3xl font-semibold font-marathi">
                  {t('श्री गणेश दर्शन २०२६', 'Shree Ganesh Darshan 2026')}
                </p>
                <p className="text-xs text-gray-300 mt-1 font-marathi">
                  {t('📍 सातपाटी बंदर, पालघर', '📍 Satpati Bandar, Palghar')}
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* STATS METRICS FEATURE BAR */}
      <section className="bg-[#FAF8F5] border-t border-b border-gray-100 py-10 px-4 sm:px-12 lg:px-20">
        <div className="w-full max-w-[1920px] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12 w-full">
            
            <div className="flex flex-col gap-1">
              <span className="text-[#C89B3C] font-bold text-2xl sm:text-3xl italic font-marathi">१९८१</span>
              <span className="text-[11px] uppercase tracking-widest font-semibold text-gray-400 font-marathi">
                {t('स्थापना वर्ष', 'ESTABLISHMENT YEAR')}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[#111111] font-bold text-2xl sm:text-3xl font-marathi">५००+</span>
              <span className="text-[11px] uppercase tracking-widest font-semibold text-gray-400 font-marathi">
                {t('सक्रिय सदस्य', 'ACTIVE MEMBERS')}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[#111111] font-bold text-2xl sm:text-3xl font-marathi">२५+</span>
              <span className="text-[11px] uppercase tracking-widest font-semibold text-gray-400 font-marathi">
                {t('सामाजिक उपक्रम', 'SOCIAL INITIATIVES')}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[#111111] font-bold text-2xl sm:text-3xl italic font-marathi">सातपाटी</span>
              <span className="text-[11px] uppercase tracking-widest font-semibold text-gray-400 font-marathi">
                {t('मुख्यालय', 'HEADQUARTERS')}
              </span>
            </div>

          </div>
        </div>
      </section>

      {/* CORE HIGHLIGHT CARDS */}
      <section className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#111111] font-marathi drop-shadow-sm">
            {t('मंडळाचे प्रमुख स्तंभ व वैशिष्ट्ये', 'Core Pillars of Taqdeer Mitra Mandal')}
          </h2>
          <p className="text-base text-gray-500 font-medium">
            {t(
              'श्रद्धा, सामाजिक बांधिलकी आणि संस्कृतीच्या माध्यमातून सातपाटी गावातील जनतेची सेवा.',
              'Serving the Satpati community through devotion, social welfare, and rich traditions.'
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          
          {/* Pillar 1: Religious Sanctity */}
          <div className="p-8 rounded-2xl glass-card space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-[#D4AF37]/30 flex items-center justify-center text-[#FF6A00] shadow-sm">
              <Sparkles className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 font-marathi">
              {t('श्रद्धा व पारंपारिक पूजा', 'Faith & Religious Sanctity')}
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed font-marathi font-medium">
              {t(
                'शास्त्रोक्त पद्धतीने श्रींची स्थापना, नित्य महाआरती, भजनाचे कार्यक्रम आणि सातपाटी गावातील सर्व धर्मीय भाविकांचे मंगलमय वातावरण.',
                'Vedic rituals, daily Maha Aarti, devotional bhajans, and harmonious spiritual celebrations.'
              )}
            </p>
            <button
              onClick={() => setActiveTab('events')}
              className="text-xs font-bold text-[#FF6A00] hover:text-[#D4AF37] flex items-center gap-1 font-marathi pt-2 transition-colors"
            >
              <span>{t('उत्सव कार्यक्रम पहा', 'View Event Schedule')}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Pillar 2: Social Service */}
          <div className="p-8 rounded-2xl glass-card space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200/50 flex items-center justify-center text-emerald-600 shadow-sm">
              <HeartHandshake className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 font-marathi">
              {t('समाजसेवा व जनकल्याण', 'Social Welfare & Community')}
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed font-marathi font-medium">
              {t(
                'महारक्तदान शिबिर, मोफत आरोग्य तपासणी, विद्यार्थी शैक्षणिक मदत, धान्य वाटप आणि सातपाटी समुद्रकिनारा स्वच्छता मोहीम.',
                'Blood donation drives, free medical checkups, student scholarships, grain kits, and beach cleanup drives.'
              )}
            </p>
            <button
              onClick={() => setActiveTab('social')}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-500 flex items-center gap-1 font-marathi pt-2 transition-colors"
            >
              <span>{t('सामाजिक उपक्रम पहा', 'View Social Initiatives')}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Pillar 3: Cultural Legacy */}
          <div className="p-8 rounded-2xl glass-card space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200/50 flex items-center justify-center text-[#D4AF37] shadow-sm">
              <Award className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 font-marathi">
              {t('संस्कृती व युवा संघटन', 'Culture & Youth Leadership')}
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed font-marathi font-medium">
              {t(
                'स्थानिक कलावंतांना वाव, पारंपारिक खेळ, महिलांसाठी मंगळागौरी स्पर्धा व तरुण पिढीमध्ये संस्कृतीचे संस्कार रुजविण्याचे कार्य.',
                'Empowering local folk artists, traditional sports, women’s cultural contests, and youth leadership development.'
              )}
            </p>
            <button
              onClick={() => setActiveTab('committee')}
              className="text-xs font-bold text-[#D4AF37] hover:text-[#B38B22] flex items-center gap-1 font-marathi pt-2 transition-colors"
            >
              <span>{t('कार्यकारिणी भेटा', 'Meet Committee')}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </section>

      {/* QUICK FEATURED GALLERY TEASER */}
      <section className="bg-[#FAF8F5] py-12 border-t border-gray-200/80">
        <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF9933] font-marathi">
                {t('स्मरणिका', 'Visual Legacy')}
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 font-marathi mt-1">
                {t('फोटो गॅलरीची झलक', 'Gallery Highlights')}
              </h2>
            </div>

            <button
              onClick={() => setActiveTab('gallery')}
              className="px-4 py-2 rounded-xl bg-white border border-gray-300 text-xs font-bold text-gray-800 hover:bg-gray-50 transition-colors shadow-2xs flex items-center gap-2 font-marathi"
            >
              <span>{t('संपूर्ण गॅलरी पहा', 'View Full Gallery')}</span>
              <ChevronRight className="w-4 h-4 text-[#FF9933]" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <div className="rounded-xl overflow-hidden bg-white border border-gray-200 shadow-2xs group">
              <div className="aspect-16/10 overflow-hidden relative">
                <img
                  src="/images/img2.jpeg"
                  alt="Decorations"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-4">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#FAF8F5] text-[#C89B3C] border border-[#C89B3C]/20">
                  {t('पारंपारिक देखावा', 'Heritage Decoration')}
                </span>
                <h4 className="text-sm font-bold text-gray-900 font-marathi mt-2">
                  {t('स्थानिक कारागिरांचा शाश्वत लाकडी मखर', 'Sustainable Handcrafted Wooden Mandap')}
                </h4>
              </div>
            </div>

            <div className="rounded-xl overflow-hidden bg-white border border-gray-200 shadow-2xs group">
              <div className="aspect-16/10 overflow-hidden relative">
                <img
                  src="/images/img3.jpeg"
                  alt="Aarti"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-4">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#FAF8F5] text-[#FF9933] border border-[#FF9933]/20">
                  {t('महाआरती', 'Maha Aarti')}
                </span>
                <h4 className="text-sm font-bold text-gray-900 font-marathi mt-2">
                  {t('सायंकाळची भव्य आरती व दीपप्रज्वलन', 'Evening Grand Aarti & Lamp Lighting')}
                </h4>
              </div>
            </div>

            <div className="rounded-xl overflow-hidden bg-white border border-gray-200 shadow-2xs group sm:col-span-2 lg:col-span-1">
              <div className="aspect-16/10 overflow-hidden relative">
                <img
                  src="/images/img4.jpeg"
                  alt="Visarjan"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-4">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#FAF8F5] text-blue-600 border border-blue-200">
                  {t('विसर्जन सोहळा', 'Visarjan Procession')}
                </span>
                <h4 className="text-sm font-bold text-gray-900 font-marathi mt-2">
                  {t('सातपाटी समुद्रकिनाऱ्यावर भावपूर्ण विसर्जन', 'Oceanic Immersion at Satpati Beach')}
                </h4>
              </div>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
};
