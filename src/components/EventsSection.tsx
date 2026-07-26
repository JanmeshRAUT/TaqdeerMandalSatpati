import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { EventScheduleItem } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, MapPin, Sparkles, Printer, AlertCircle, CheckCircle } from 'lucide-react';

interface EventsSectionProps {
  events: EventScheduleItem[];
}

export const EventsSection: React.FC<EventsSectionProps> = ({ events }) => {
  const { t } = useLanguage();
  const [filterCategory, setFilterCategory] = useState('all');

  const categories = Array.from(new Set(events.map(e => e.categoryMr)));

  const filteredEvents = events.filter(e => {
    if (filterCategory === 'all') return true;
    return e.categoryMr === filterCategory;
  });

  const handlePrint = () => {
    window.print();
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } },
    exit: { opacity: 0, x: 20, transition: { duration: 0.2 } }
  };

  return (
    <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center max-w-3xl mx-auto space-y-4"
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF8F5] border border-[#C89B3C]/30 text-xs font-semibold text-gray-800 shadow-2xs">
          <Calendar className="w-3.5 h-3.5 text-[#FF9933]" />
          <span className="font-marathi">{t('उत्सव कार्यक्रम पत्रिका', 'Event Schedule')}</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111111] font-marathi tracking-tight">
          {t('श्री गणेशोत्सव २०२६ संपूर्ण कार्यक्रम', 'Shree Ganeshotsav 2026 Schedule')}
        </h2>

        <p className="text-base text-gray-600 leading-relaxed font-marathi">
          {t(
            'सकाळची आरती, संध्याकाळची आरती, भजनी मंडळ, मोदक व रांगोळी स्पर्धा, महाप्रसाद आणि विसर्जन मिरवणूक.',
            'Detailed schedule for Morning & Evening Aarti, Bhajan, cultural contests, Mahaprasad, and Visarjan.'
          )}
        </p>
      </motion.div>

      {/* Top Controls & Print Schedule */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-[#FAF8F5] p-4 sm:p-6 rounded-2xl border border-gray-200/80 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm"
      >
        
        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setFilterCategory('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 font-marathi relative overflow-hidden cursor-pointer ${
              filterCategory === 'all'
                ? 'text-white shadow-2xs'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
            }`}
          >
            {filterCategory === 'all' && (
              <motion.div 
                layoutId="activeEventTab"
                className="absolute inset-0 bg-[#FF9933] z-0"
                initial={false}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            <span className="relative z-10">{t('सर्व कार्यक्रम (All)', 'All Events')}</span>
          </motion.button>
          {categories.map(cat => (
            <motion.button
              key={cat}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 font-marathi relative overflow-hidden cursor-pointer ${
                filterCategory === cat
                  ? 'text-white shadow-2xs'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              {filterCategory === cat && (
                <motion.div 
                  layoutId="activeEventTab"
                  className="absolute inset-0 bg-[#FF9933] z-0"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative z-10">{cat}</span>
            </motion.button>
          ))}
        </div>

        {/* Print / Download Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePrint}
          id="events-print-btn"
          className="px-4 py-2 rounded-xl bg-white border border-gray-300 text-xs font-bold text-gray-800 hover:bg-gray-50 transition-colors shadow-2xs flex items-center gap-2 font-marathi shrink-0 cursor-pointer"
        >
          <Printer className="w-4 h-4 text-[#FF9933]" />
          <span>{t('पत्रिका प्रिंट करा / प्रिंट', 'Print Schedule')}</span>
        </motion.button>

      </motion.div>

      {/* Schedule List Cards */}
      <motion.div layout className="space-y-4 min-h-[400px]">
        <AnimatePresence mode="popLayout">
          {filteredEvents.length === 0 ? (
            <motion.div 
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12 text-gray-500 font-marathi"
            >
              {t('या श्रेणीमध्ये कोणतेही कार्यक्रम नाहीत.', 'No events found in this category.')}
            </motion.div>
          ) : (
            <motion.div 
              key="list"
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="space-y-4"
            >
              {filteredEvents.map((evt) => (
                <motion.div
                  layout
                  variants={itemVariants}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                  key={evt.id}
                  className={`p-6 rounded-2xl bg-white border transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md group ${
                    evt.isImportant 
                      ? 'border-[#FF9933] bg-[#FAF8F5]/50 shadow-xs ring-1 ring-[#FF9933]/20 hover:ring-2 hover:ring-[#FF9933]/40' 
                      : 'border-gray-200 shadow-2xs hover:border-gray-300'
                  }`}
                >
                  
                  {/* Date & Category Pill */}
                  <div className="flex items-start md:items-center gap-4 shrink-0">
                    <div className="w-16 h-16 rounded-2xl bg-[#FAF8F5] border border-[#C89B3C]/30 flex flex-col items-center justify-center text-center p-2 shrink-0 group-hover:scale-105 transition-transform group-hover:border-[#FF9933]/50 group-hover:bg-[#FF9933]/5">
                      <span className="text-xs font-bold text-[#FF9933] uppercase">
                        {new Date(evt.date).toLocaleString('en-US', { month: 'short' })}
                      </span>
                      <span className="text-xl font-extrabold text-gray-900 font-marathi">
                        {new Date(evt.date).getDate()}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-md bg-gray-100 text-gray-800 text-[11px] font-bold font-marathi">
                          {t(evt.categoryMr, evt.categoryEn)}
                        </span>
                        {evt.isImportant && (
                          <span className="px-2 py-0.5 rounded-md bg-[#FF9933] text-white text-[10px] font-bold font-marathi flex items-center gap-1 shadow-sm">
                            <Sparkles className="w-3 h-3" />
                            {t('महत्त्वाचा सोहळा', 'Major Event')}
                          </span>
                        )}
                      </div>

                      <h3 className="text-lg font-bold text-gray-900 font-marathi group-hover:text-[#FF9933] transition-colors">
                        {t(evt.titleMr, evt.titleEn)}
                      </h3>
                    </div>
                  </div>

                  {/* Event Time & Location Details */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-xs text-gray-600 font-marathi md:text-right">
                    
                    <div className="flex items-center gap-1.5 bg-[#FAF8F5] px-3 py-1.5 rounded-lg border border-gray-200 group-hover:border-gray-300 transition-colors">
                      <Clock className="w-4 h-4 text-[#FF9933] shrink-0" />
                      <span>{t(evt.timeMr, evt.timeEn)}</span>
                    </div>

                    <div className="flex items-center gap-1.5 bg-[#FAF8F5] px-3 py-1.5 rounded-lg border border-gray-200 group-hover:border-gray-300 transition-colors">
                      <MapPin className="w-4 h-4 text-[#FF9933] shrink-0" />
                      <span>{t(evt.locationMr, evt.locationEn)}</span>
                    </div>

                  </div>

                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

    </div>
  );
};
