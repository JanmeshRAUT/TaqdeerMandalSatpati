import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { NavTab, Announcement, JerseyBooking } from '../types';
import { CountdownWidget } from './CountdownWidget';
import { JerseyBookingPanel } from './JerseyBookingPanel';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  History, Image as ImageIcon, Sparkles, HeartHandshake, 
  Calendar, ChevronRight, Award, Megaphone, Users, ShieldAlert, ArrowRight, MousePointer2, Shirt, List 
} from 'lucide-react';

interface HomeSectionProps {
  setActiveTab: (tab: NavTab) => void;
  announcements: Announcement[];
  jerseyBookings: JerseyBooking[];
}

export const HomeSection: React.FC<HomeSectionProps> = ({ setActiveTab, announcements, jerseyBookings }) => {
  const { t } = useLanguage();
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 100]);
  const y2 = useTransform(scrollY, [0, 500], [0, -100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

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

  // Animation variants
  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const scaleUp = {
    hidden: { opacity: 0, scale: 0.95 },
    show: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <div className="space-y-16 py-6 sm:py-10 overflow-hidden relative">

      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-[800px] bg-gradient-to-b from-[#FF9933]/5 to-transparent pointer-events-none -z-10" />

      {/* Live Announcement Marquee Banner (If any) */}
      {activeAnnouncements.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="p-3 sm:p-4 rounded-2xl bg-[#FAF8F5] border border-[#C89B3C]/30 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center gap-3 hover-glow transition-all">
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
        </motion.div>
      )}

      {/* HERO SECTION */}
      <section className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-12 relative pt-[50px] pb-12 lg:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Hero Content */}
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            style={{ y: y1 }}
            className="lg:col-span-7 space-y-6 text-center lg:text-left relative z-10"
          >
            
            {/* Heritage Badge */}
            <motion.div variants={fadeInUp} className="inline-block py-1 px-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-[#D4AF37]/30 rounded-full text-[#D4AF37] text-[12px] font-bold uppercase tracking-widest mb-4 font-marathi shadow-sm animate-float">
              {t('स्थापना १९८१ • सातपाटी', 'ESTABLISHED 1981 • SATPATI')}
            </motion.div>

            {/* Main Title */}
            <motion.div variants={fadeInUp} className="space-y-4">
              <h1 className="text-5xl sm:text-7xl lg:text-8xl font-extrabold leading-[1.1] tracking-tight font-marathi">
                <span className="text-[#111111] drop-shadow-sm">{t('तकदीर मित्र मंडळ,', 'Taqdeer Mitra Mandal,')}</span><br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6A00] to-[#FF9933] drop-shadow-sm animate-gradient-shift">{t('सातपाटी', 'Satpati')}</span>
              </h1>
              <p className="text-2xl font-semibold text-gray-400 italic mb-6 font-marathi tracking-wide">
                {t('श्रद्धा • सेवा • संस्कृती', 'Faith • Service • Culture')}
              </p>
            </motion.div>

            {/* Introduction Paragraph */}
            <motion.p variants={fadeInUp} className="text-gray-600 max-w-md leading-relaxed mx-auto lg:mx-0 font-marathi text-sm sm:text-base font-medium">
              {t(
                'सातपाटी गावाच्या सांस्कृतिक आणि सामाजिक वारशाचे जतन करणारे एक प्रतिष्ठित मंडळ. गेली अनेक दशके आम्ही समाजहित आणि धार्मिक परंपरा जोपासत आहोत.',
                'A prestigious organization preserving the cultural and social heritage of Satpati village. Dedicated to community welfare and sacred traditions for decades.'
              )}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div variants={fadeInUp} className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab('history')}
                id="hero-btn-history"
                className="px-8 py-4 bg-gradient-premium text-white rounded-xl font-bold hover:shadow-[0_0_20px_rgba(255,106,0,0.4)] transition-shadow flex items-center gap-2.5 font-marathi text-sm shadow-xl cursor-pointer"
              >
                <History className="w-4 h-4 text-[#FF6A00]" />
                <span>{t('मंडळाचा इतिहास', 'Mandal History')}</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  document.getElementById('jersey-booking')?.scrollIntoView({ behavior: 'smooth' });
                }}
                id="hero-btn-jersey"
                className="px-8 py-4 glass-panel rounded-xl font-bold transition-all flex items-center gap-2.5 font-marathi text-sm text-[#111111] hover-glow cursor-pointer relative overflow-hidden group border border-[#FF9933]/30"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                <Shirt className="w-4 h-4 text-[#FF9933]" />
                <span>{t('जर्सी बुक करा', 'Book Jersey')}</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setActiveTab('jersey-bookings');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                id="hero-btn-jersey-view"
                className="px-8 py-4 bg-white/50 backdrop-blur-md rounded-xl font-bold transition-all flex items-center gap-2.5 font-marathi text-sm text-gray-700 hover:bg-white cursor-pointer relative overflow-hidden border border-gray-200 shadow-sm"
              >
                <List className="w-4 h-4 text-[#FF9933]" />
                <span>{t('बुकिंग पहा', 'View Bookings')}</span>
              </motion.button>
            </motion.div>

            {/* Quick Badges */}
            <motion.div variants={fadeInUp} className="pt-8 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-gray-500 font-medium">
              <div className="flex items-center gap-1.5 hover:text-[#D4AF37] transition-colors">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10B981]" />
                <span>{t('स्थापना: १९८१ (४५+ वर्षे)', 'Est. 1981 (45+ Years)')}</span>
              </div>
              <div className="flex items-center gap-1.5 hover:text-[#D4AF37] transition-colors">
                <span className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_#F59E0B]" />
                <span>{t('पालघर जिल्हा, महाराष्ट्र', 'Palghar District, Maharashtra')}</span>
              </div>
              <div className="flex items-center gap-1.5 hover:text-[#D4AF37] transition-colors">
                <span className="w-2 h-2 rounded-full bg-[#FF9933] shadow-[0_0_8px_#FF9933]" />
                <span>{t('पर्यावरणपूरक उत्सव', 'Eco-Friendly Celebrations')}</span>
              </div>
            </motion.div>

          </motion.div>

          {/* Right Hero Image Card */}
          <motion.div 
            variants={scaleUp}
            initial="hidden"
            animate="show"
            style={{ y: y2 }}
            className="lg:col-span-5 flex justify-center relative"
          >
            {/* Background Glow */}
            <div className="absolute inset-0 bg-[#FF6A00]/20 blur-[100px] rounded-full animate-float-delayed pointer-events-none" />
            
            <div className="relative z-10 w-full h-[380px] sm:h-[460px] bg-black rounded-[2.5rem] shadow-2xl overflow-hidden border-4 border-white group transform transition-transform hover:scale-[1.02] duration-500">
              {heroImages.map((src, index) => (
                <img
                  key={src}
                  src={src}
                  alt="Lord Ganesha Idol Satpati"
                  className={`absolute inset-0 w-full h-full object-cover transition-all duration-[2000ms] ease-in-out ${
                    index === currentHeroIndex ? 'opacity-100 scale-105' : 'opacity-0 scale-110'
                  }`}
                  referrerPolicy="no-referrer"
                />
              ))}
              
              {/* Divine Overlay Tag */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/95 via-[#111111]/40 to-transparent flex flex-col justify-end p-8 text-white">
                <motion.p 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-xs font-bold uppercase tracking-widest text-[#FF6A00] mb-1 drop-shadow-md flex items-center gap-2"
                >
                  <span className="w-2 h-2 rounded-full bg-[#FF6A00] animate-pulse" />
                  {t('मुख्य आकर्षण • श्री गणेशोत्सव', 'MAIN ATTRACTION • SHREE GANESHOTSAV')}
                </motion.p>
                <motion.p 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-3xl sm:text-4xl font-extrabold font-marathi drop-shadow-lg"
                >
                  {t('श्री गणेश दर्शन २०२६', 'Shree Ganesh Darshan 2026')}
                </motion.p>
                <motion.p 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="text-sm text-gray-300 mt-2 font-marathi"
                >
                  {t('📍 सातपाटी बंदर, पालघर', '📍 Satpati Bandar, Palghar')}
                </motion.p>
              </div>
            </div>
          </motion.div>

        </div>
        
        {/* Scroll Indicator */}
        <motion.div 
          style={{ opacity }}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-400"
        >
          <span className="text-[10px] uppercase tracking-widest font-bold font-marathi">{t('खाली स्क्रोल करा', 'SCROLL DOWN')}</span>
          <MousePointer2 className="w-5 h-5 animate-bounce text-[#FF9933]" />
        </motion.div>
      </section>

      {/* Prominent Hero Countdown Widget */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 relative z-20 -mt-10"
      >
        <CountdownWidget />
      </motion.div>

      {/* JERSEY BOOKING PANEL */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24"
        id="jersey-booking"
      >
        <JerseyBookingPanel bookings={jerseyBookings} />
      </motion.div>

      {/* STATS METRICS FEATURE BAR */}
      <motion.section 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.7 }}
        className="bg-[#FAF8F5] border-t border-b border-gray-100 py-10 px-4 sm:px-12 lg:px-20 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]" />
        
        <div className="w-full max-w-[1920px] mx-auto relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12 w-full">
            
            <motion.div whileHover={{ scale: 1.05 }} className="flex flex-col gap-1 cursor-default">
              <span className="text-[#C89B3C] font-bold text-2xl sm:text-3xl italic font-marathi">१९८१</span>
              <span className="text-[11px] uppercase tracking-widest font-semibold text-gray-400 font-marathi">
                {t('स्थापना वर्ष', 'ESTABLISHMENT YEAR')}
              </span>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} className="flex flex-col gap-1 cursor-default">
              <span className="text-[#111111] font-bold text-2xl sm:text-3xl font-marathi">५००+</span>
              <span className="text-[11px] uppercase tracking-widest font-semibold text-gray-400 font-marathi">
                {t('सक्रिय सदस्य', 'ACTIVE MEMBERS')}
              </span>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} className="flex flex-col gap-1 cursor-default">
              <span className="text-[#111111] font-bold text-2xl sm:text-3xl font-marathi">२५+</span>
              <span className="text-[11px] uppercase tracking-widest font-semibold text-gray-400 font-marathi">
                {t('सामाजिक उपक्रम', 'SOCIAL INITIATIVES')}
              </span>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} className="flex flex-col gap-1 cursor-default">
              <span className="text-[#111111] font-bold text-2xl sm:text-3xl italic font-marathi">सातपाटी</span>
              <span className="text-[11px] uppercase tracking-widest font-semibold text-gray-400 font-marathi">
                {t('मुख्यालय', 'HEADQUARTERS')}
              </span>
            </motion.div>

          </div>
        </div>
      </motion.section>

      {/* CORE HIGHLIGHT CARDS */}
      <section className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto space-y-2"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-[#111111] font-marathi drop-shadow-sm">
            {t('मंडळाचे प्रमुख स्तंभ व वैशिष्ट्ये', 'Core Pillars of Taqdeer Mitra Mandal')}
          </h2>
          <p className="text-base text-gray-500 font-medium">
            {t(
              'श्रद्धा, सामाजिक बांधिलकी आणि संस्कृतीच्या माध्यमातून सातपाटी गावातील जनतेची सेवा.',
              'Serving the Satpati community through devotion, social welfare, and rich traditions.'
            )}
          </p>
        </motion.div>

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8"
        >
          {/* Pillar 1: Religious Sanctity */}
          <motion.div variants={fadeInUp} whileHover={{ y: -8 }} className="p-8 rounded-2xl glass-card space-y-4 hover-glow cursor-default transition-all duration-300 border border-[#D4AF37]/20 relative group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-[#D4AF37]/30 flex items-center justify-center text-[#FF6A00] shadow-sm relative z-10">
              <Sparkles className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 font-marathi relative z-10">
              {t('श्रद्धा व पारंपारिक पूजा', 'Faith & Religious Sanctity')}
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed font-marathi font-medium relative z-10">
              {t(
                'शास्त्रोक्त पद्धतीने श्रींची स्थापना, नित्य महाआरती, भजनाचे कार्यक्रम आणि सातपाटी गावातील सर्व धर्मीय भाविकांचे मंगलमय वातावरण.',
                'Vedic rituals, daily Maha Aarti, devotional bhajans, and harmonious spiritual celebrations.'
              )}
            </p>
            <button
              onClick={() => setActiveTab('events')}
              className="text-xs font-bold text-[#FF6A00] hover:text-[#D4AF37] flex items-center gap-1 font-marathi pt-2 transition-colors cursor-pointer relative z-10"
            >
              <span>{t('उत्सव कार्यक्रम पहा', 'View Event Schedule')}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </motion.div>

          {/* Pillar 2: Social Service */}
          <motion.div variants={fadeInUp} whileHover={{ y: -8 }} className="p-8 rounded-2xl glass-card space-y-4 hover:shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all duration-300 border border-emerald-500/20 relative group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200/50 flex items-center justify-center text-emerald-600 shadow-sm relative z-10">
              <HeartHandshake className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 font-marathi relative z-10">
              {t('समाजसेवा व जनकल्याण', 'Social Welfare & Community')}
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed font-marathi font-medium relative z-10">
              {t(
                'महारक्तदान शिबिर, मोफत आरोग्य तपासणी, विद्यार्थी शैक्षणिक मदत, धान्य वाटप आणि सातपाटी समुद्रकिनारा स्वच्छता मोहीम.',
                'Blood donation drives, free medical checkups, student scholarships, grain kits, and beach cleanup drives.'
              )}
            </p>
            <button
              onClick={() => setActiveTab('social')}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-500 flex items-center gap-1 font-marathi pt-2 transition-colors cursor-pointer relative z-10"
            >
              <span>{t('सामाजिक उपक्रम पहा', 'View Social Initiatives')}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </motion.div>

          {/* Pillar 3: Cultural Legacy */}
          <motion.div variants={fadeInUp} whileHover={{ y: -8 }} className="p-8 rounded-2xl glass-card space-y-4 hover:shadow-[0_0_20px_rgba(212,175,55,0.2)] transition-all duration-300 border border-amber-500/20 relative group overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200/50 flex items-center justify-center text-[#D4AF37] shadow-sm relative z-10">
              <Award className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 font-marathi relative z-10">
              {t('संस्कृती व युवा संघटन', 'Culture & Youth Leadership')}
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed font-marathi font-medium relative z-10">
              {t(
                'स्थानिक कलावंतांना वाव, पारंपारिक खेळ, महिलांसाठी मंगळागौरी स्पर्धा व तरुण पिढीमध्ये संस्कृतीचे संस्कार रुजविण्याचे कार्य.',
                'Empowering local folk artists, traditional sports, women’s cultural contests, and youth leadership development.'
              )}
            </p>
            <button
              onClick={() => setActiveTab('committee')}
              className="text-xs font-bold text-[#D4AF37] hover:text-[#B38B22] flex items-center gap-1 font-marathi pt-2 transition-colors cursor-pointer relative z-10"
            >
              <span>{t('कार्यकारिणी भेटा', 'Meet Committee')}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </motion.div>

        </motion.div>

      </section>

      {/* QUICK FEATURED GALLERY TEASER */}
      <section className="bg-[#FAF8F5] py-12 border-t border-gray-200/80">
        <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4"
          >
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF9933] font-marathi">
                {t('स्मरणिका', 'Visual Legacy')}
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 font-marathi mt-1">
                {t('फोटो गॅलरीची झलक', 'Gallery Highlights')}
              </h2>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab('gallery')}
              className="px-4 py-2 rounded-xl bg-white border border-gray-300 text-xs font-bold text-gray-800 hover:bg-gray-50 transition-colors shadow-2xs flex items-center gap-2 font-marathi cursor-pointer"
            >
              <span>{t('संपूर्ण गॅलरी पहा', 'View Full Gallery')}</span>
              <ChevronRight className="w-4 h-4 text-[#FF9933]" />
            </motion.button>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            
            <motion.div variants={fadeInUp} whileHover={{ y: -5 }} className="rounded-xl overflow-hidden bg-white border border-gray-200 shadow-2xs group cursor-pointer hover:shadow-xl transition-all duration-300">
              <div className="aspect-16/10 overflow-hidden relative">
                <img
                  src="/images/img2.jpeg"
                  alt="Decorations"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
              </div>
              <div className="p-4">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#FAF8F5] text-[#C89B3C] border border-[#C89B3C]/20">
                  {t('पारंपारिक देखावा', 'Heritage Decoration')}
                </span>
                <h4 className="text-sm font-bold text-gray-900 font-marathi mt-2 group-hover:text-[#FF9933] transition-colors">
                  {t('स्थानिक कारागिरांचा शाश्वत लाकडी मखर', 'Sustainable Handcrafted Wooden Mandap')}
                </h4>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} whileHover={{ y: -5 }} className="rounded-xl overflow-hidden bg-white border border-gray-200 shadow-2xs group cursor-pointer hover:shadow-xl transition-all duration-300">
              <div className="aspect-16/10 overflow-hidden relative">
                <img
                  src="/images/img3.jpeg"
                  alt="Aarti"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
              </div>
              <div className="p-4">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#FAF8F5] text-[#FF9933] border border-[#FF9933]/20">
                  {t('महाआरती', 'Maha Aarti')}
                </span>
                <h4 className="text-sm font-bold text-gray-900 font-marathi mt-2 group-hover:text-[#FF9933] transition-colors">
                  {t('सायंकाळची भव्य आरती व दीपप्रज्वलन', 'Evening Grand Aarti & Lamp Lighting')}
                </h4>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} whileHover={{ y: -5 }} className="rounded-xl overflow-hidden bg-white border border-gray-200 shadow-2xs group cursor-pointer hover:shadow-xl transition-all duration-300 sm:col-span-2 lg:col-span-1">
              <div className="aspect-16/10 overflow-hidden relative">
                <img
                  src="/images/img4.jpeg"
                  alt="Visarjan"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
              </div>
              <div className="p-4">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#FAF8F5] text-blue-600 border border-blue-200">
                  {t('विसर्जन सोहळा', 'Visarjan Procession')}
                </span>
                <h4 className="text-sm font-bold text-gray-900 font-marathi mt-2 group-hover:text-[#FF9933] transition-colors">
                  {t('सातपाटी समुद्रकिनाऱ्यावर भावपूर्ण विसर्जन', 'Oceanic Immersion at Satpati Beach')}
                </h4>
              </div>
            </motion.div>

          </motion.div>

        </div>
      </section>

    </div>
  );
};

