import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { CommitteeMember } from '../types';
import { ShieldCheck, Phone, MessageCircle, Clock, Users } from 'lucide-react';

interface CommitteeSectionProps {
  committeeMembers: CommitteeMember[];
}

export const CommitteeSection: React.FC<CommitteeSectionProps> = ({ committeeMembers }) => {
  const { t } = useLanguage();

  return (
    <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-12 py-12 space-y-16 font-marathi">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF8F5] border border-[#C89B3C]/30 text-xs font-semibold text-[#FF9933] shadow-2xs">
          <ShieldCheck className="w-4 h-4 text-[#FF9933]" />
          <span>{t('पदाधिकारी व कार्यसमिती', 'Office Bearers & Executive Body')}</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-extrabold text-[#111111] tracking-tight">
          {t('कार्यकारिणी मंडळ २०२६-२०२७', 'Executive Committee 2026-2027')}
        </h2>

        <p className="text-sm sm:text-base text-gray-500 leading-relaxed">
          {t(
            'तकदीर मित्र मंडळ, सातपाटीचे मुख्य पदाधिकारी व प्रशासकीय नेतृत्व.',
            'Executive Office Bearers leading Taqdeer Mitra Mandal, Satpati.'
          )}
        </p>
      </div>

      {/* Office Bearers Grid (1 Col Mobile, 2 Col Tablet, 3 Col Desktop) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
        {committeeMembers.map((member) => (
          <div
            key={member.id}
            className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col items-center text-center space-y-4 group relative overflow-hidden"
          >
            {/* Soft subtle glow accent on top */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#FF9933] via-[#C89B3C] to-[#FF9933] opacity-0 group-hover:opacity-100 transition-opacity" />

            {/* Circular Profile Photo */}
            <div className="relative mt-2">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-[#FAF8F5] shadow-md group-hover:scale-105 transition-transform duration-300 bg-gray-100">
                <img
                  src={member.photoUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80'}
                  alt={member.nameEn}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white shadow-2xs" title="Active Office Bearer" />
            </div>

            {/* Name Details */}
            <div className="space-y-1 pt-1">
              {/* Primary Name in Marathi */}
              <h3 className="text-xl sm:text-2xl font-bold text-[#111111] tracking-tight">
                {t(member.nameMr, member.nameEn)}
              </h3>
              {/* Secondary Name in English */}
              <p className="text-xs text-gray-400 font-sans font-medium tracking-wide">
                {member.nameEn}
              </p>
            </div>

            {/* Designation Badge */}
            <div className="pt-1">
              <span className="inline-block px-4 py-1.5 rounded-full text-xs font-extrabold bg-[#FAF8F5] text-[#FF9933] border border-[#C89B3C]/30 shadow-2xs">
                {t(member.roleMr, member.roleEn)}
              </span>
            </div>

            {/* Short Description */}
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed max-w-xs pt-1">
              {t(member.bioMr, member.bioEn || member.bioMr)}
            </p>

            {/* Quick Contact Action Buttons */}
            {member.phone && (
              <div className="pt-3 w-full flex items-center justify-center gap-3 border-t border-gray-100">
                <a
                  href={`tel:${member.phone}`}
                  className="px-4 py-2 rounded-xl bg-[#FAF8F5] hover:bg-gray-100 text-gray-700 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-gray-200"
                >
                  <Phone className="w-3.5 h-3.5 text-[#FF9933]" />
                  <span>{t('संपर्क', 'Call')}</span>
                </a>

                <a
                  href={`https://wa.me/${member.phone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-emerald-200"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>WhatsApp</span>
                </a>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* COMING SOON / PLACEHOLDER FOR OTHER COMMITTEE DIVISIONS */}
      <div className="pt-10">
        <div className="bg-[#FAF8F5] border border-dashed border-[#C89B3C]/40 rounded-3xl p-8 sm:p-12 text-center max-w-4xl mx-auto space-y-4">
          <div className="w-14 h-14 rounded-full bg-white border border-[#C89B3C]/30 flex items-center justify-center text-[#FF9933] mx-auto shadow-2xs">
            <Clock className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <h3 className="text-xl sm:text-2xl font-bold text-[#111111]">
              {t('इतर कार्यकारिणी व सल्लागार समिती - लवकरच प्रसिद्ध होणार', 'Other Committee Members & Advisory Board - Coming Soon')}
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 max-w-2xl mx-auto leading-relaxed">
              {t(
                'श्री गणेशोत्सव २०२६ च्या नियोजनासाठी उपसमित्या, महिला मंडळ व स्वयंसेवक सदस्यांची पूर्ण यादी लवकरच अद्ययावत केली जाईल.',
                'The full directory of sub-committees, advisory mentors, and volunteers for Ganeshotsav 2026 is currently under compilation and will be published soon.'
              )}
            </p>
          </div>

          <div className="pt-2 flex items-center justify-center gap-2 text-xs font-semibold text-[#FF9933]">
            <Users className="w-4 h-4" />
            <span>{t('सातपाटी ग्रामस्थ व कार्यकर्ते सहभाग', 'Satpati Volunteers & Community Participation')}</span>
          </div>
        </div>
      </div>

    </div>
  );
};
