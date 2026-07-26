import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { DirectoryMember } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { UserCheck, Search, Filter, Phone, MessageCircle, MapPin, Droplet, Calendar } from 'lucide-react';

interface MembersSectionProps {
  members: DirectoryMember[];
}

export const MembersSection: React.FC<MembersSectionProps> = ({ members }) => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [bloodFilter, setBloodFilter] = useState('all');
  const [lifetimeOnly, setLifetimeOnly] = useState(false);

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

  const filteredMembers = members.filter(m => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      m.nameMr.toLowerCase().includes(query) ||
      m.nameEn.toLowerCase().includes(query) ||
      (m.locationMr && m.locationMr.toLowerCase().includes(query)) ||
      (m.locationEn && m.locationEn.toLowerCase().includes(query));
    
    const matchesBlood = bloodFilter === 'all' || m.bloodGroup === bloodFilter;
    const matchesLifetime = !lifetimeOnly || m.isLifetimeMember;

    return matchesSearch && matchesBlood && matchesLifetime;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    show: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } },
    exit: { opacity: 0, scale: 0.95, y: -20, transition: { duration: 0.2 } }
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
          <UserCheck className="w-3.5 h-3.5 text-[#FF9933]" />
          <span className="font-marathi">{t('सदस्य नोंदणी व निर्देशिका', 'Member Directory')}</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111111] font-marathi tracking-tight">
          {t('मंडळाचे सदस्य व कार्यकर्ते', 'Mandal Members & Volunteers')}
        </h2>

        <p className="text-base text-gray-600 leading-relaxed font-marathi">
          {t(
            'सातपाटी गावातील निष्ठावंत कार्यकर्ते आणि आजीवन सभासदांची संपूर्ण यादी.',
            'Searchable directory of lifetime members and active volunteers of Satpati village.'
          )}
        </p>
      </motion.div>

      {/* Controls Bar */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-[#FAF8F5] p-5 rounded-2xl border border-gray-200/80 space-y-4 shadow-sm"
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          
          {/* Search Field */}
          <div className="md:col-span-6 relative group">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 group-focus-within:text-[#FF9933] transition-colors" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('नावाने किंवा ठिकाणाने शोधा...', 'Search members by name or location...')}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-gray-300 text-sm focus:outline-none focus:border-[#FF9933] focus:ring-2 focus:ring-[#FF9933]/20 font-marathi shadow-2xs transition-all"
            />
          </div>

          {/* Blood Group Filter */}
          <div className="md:col-span-3">
            <select
              value={bloodFilter}
              onChange={(e) => setBloodFilter(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-white border border-gray-300 text-sm text-gray-700 font-marathi focus:outline-none focus:border-[#FF9933] focus:ring-2 focus:ring-[#FF9933]/20 shadow-2xs transition-all"
            >
              <option value="all">{t('सर्व रक्तगट (All Blood Groups)', 'All Blood Groups')}</option>
              {bloodGroups.map(bg => (
                <option key={bg} value={bg}>{t(`रक्तगट: ${bg}`, `Blood Group: ${bg}`)}</option>
              ))}
            </select>
          </div>

          {/* Lifetime Filter Checkbox */}
          <div className="md:col-span-3 flex items-center gap-2 pt-1 md:pt-0">
            <input
              type="checkbox"
              id="lifetime-toggle"
              checked={lifetimeOnly}
              onChange={(e) => setLifetimeOnly(e.target.checked)}
              className="w-4 h-4 rounded text-[#FF9933] focus:ring-[#FF9933] cursor-pointer"
            />
            <label htmlFor="lifetime-toggle" className="text-xs font-bold text-gray-800 font-marathi cursor-pointer select-none">
              {t('केवळ आजीवन सभासद (Lifetime Only)', 'Lifetime Members Only')}
            </label>
          </div>

        </div>

        <div className="flex items-center justify-between text-xs text-gray-500 font-marathi pt-1 border-t border-gray-200">
          <motion.span 
            key={filteredMembers.length}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            {t(`एकूण आढळलेले सदस्य: ${filteredMembers.length}`, `Total members found: ${filteredMembers.length}`)}
          </motion.span>
          {(searchQuery || bloodFilter !== 'all' || lifetimeOnly) && (
            <button
              onClick={() => { setSearchQuery(''); setBloodFilter('all'); setLifetimeOnly(false); }}
              className="text-[#FF9933] hover:underline font-semibold"
            >
              {t('फिल्टर काढा (Reset)', 'Reset Filters')}
            </button>
          )}
        </div>
      </motion.div>

      {/* Directory Cards */}
      <motion.div layout className="min-h-[300px]">
        <AnimatePresence mode="popLayout">
          {members.length === 0 ? (
            <motion.div 
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12 text-gray-500 font-marathi"
            >
              <div className="text-xl font-bold text-gray-700">{t('लवकरच उपलब्ध', 'Coming Soon')}</div>
              <p className="mt-2 text-sm">{t('सभासदांची यादी लवकरच अद्ययावत केली जाईल.', 'Member directory will be updated soon.')}</p>
            </motion.div>
          ) : filteredMembers.length === 0 ? (
            <motion.div 
              key="no-results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12 text-gray-500 font-marathi"
            >
              {t('कोणताही सदस्य सापडला नाही.', 'No members found matching filters.')}
            </motion.div>
          ) : (
            <motion.div 
              key="grid"
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredMembers.map((m) => (
                <motion.div
                  layout
                  variants={itemVariants}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                  key={m.id}
                  className="bg-white rounded-2xl border border-gray-200/90 p-5 shadow-2xs hover:shadow-lg transition-shadow flex items-start gap-4 group"
                >
                  
                  {/* Avatar */}
                  <div className="w-16 h-16 rounded-2xl bg-[#FAF8F5] border border-gray-200 overflow-hidden shrink-0 flex items-center justify-center group-hover:scale-105 transition-transform">
                    {m.photoUrl ? (
                      <img src={m.photoUrl} alt={m.nameEn} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <span className="text-xl font-bold text-[#FF9933] font-marathi group-hover:scale-110 transition-transform">
                        {m.nameMr.charAt(0)}
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 space-y-2 min-w-0">
                    
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h3 className="text-base font-bold text-gray-900 font-marathi truncate group-hover:text-[#FF9933] transition-colors">
                          {t(m.nameMr, m.nameEn)}
                        </h3>
                        {m.isLifetimeMember && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-[#C89B3C] border border-amber-200 shadow-sm">
                            {t('आजीव', 'Lifetime')}
                          </span>
                        )}
                      </div>

                      {m.locationMr && (
                        <p className="text-xs text-gray-500 font-marathi flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-[#FF9933] shrink-0" />
                          <span className="truncate">{t(m.locationMr, m.locationEn || m.locationMr)}</span>
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-xs text-gray-600 font-marathi flex-wrap">
                      <span className="flex items-center gap-1 bg-[#FAF8F5] px-2 py-0.5 rounded-md border border-gray-200">
                        <Calendar className="w-3 h-3 text-gray-400" />
                        <span>{t(`प्रवेश: ${m.joinedYear}`, `Joined: ${m.joinedYear}`)}</span>
                      </span>

                      {m.bloodGroup && (
                        <span className="flex items-center gap-1 bg-red-50 text-red-700 px-2 py-0.5 rounded-md border border-red-200 font-bold shadow-sm hover:scale-105 transition-transform cursor-default">
                          <Droplet className="w-3 h-3 text-red-500 fill-red-500" />
                          <span>{m.bloodGroup}</span>
                        </span>
                      )}
                    </div>

                    {m.phone && (
                      <div className="pt-2 flex items-center gap-2">
                        <motion.a
                          whileHover={{ scale: 1.05, x: 5 }}
                          href={`tel:${m.phone}`}
                          className="text-xs text-gray-700 hover:text-[#FF9933] font-medium flex items-center gap-1 p-1 -ml-1 rounded-md"
                        >
                          <Phone className="w-3.5 h-3.5 text-[#FF9933]" />
                          <span>{m.phone}</span>
                        </motion.a>
                      </div>
                    )}

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
