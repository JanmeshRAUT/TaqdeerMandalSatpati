import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { HistoryMilestone } from '../types';
import { History, Target, Compass, Sparkles, Award, CheckCircle2, Calendar } from 'lucide-react';

interface HistorySectionProps {
  milestones: HistoryMilestone[];
}

export const HistorySection: React.FC<HistorySectionProps> = ({ milestones }) => {
  const { t } = useLanguage();

  return (
    <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF8F5] border border-[#C89B3C]/30 text-xs font-semibold text-gray-800 shadow-2xs">
          <History className="w-3.5 h-3.5 text-[#FF9933]" />
          <span className="font-marathi">{t('इतिहास व गौरवशाली वारसा', 'History & Glorious Legacy')}</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111111] font-marathi tracking-tight">
          {t('मंडळाचा इतिहास व वाटचाल', 'History & Journey of Taqdeer Mitra Mandal')}
        </h2>

        <p className="text-base text-gray-600 leading-relaxed font-marathi">
          {t(
            'स्थापनेचे वर्ष १९८१ ते आजतागायत: सातपाटी गावातील सामाजिक ऐक्य, धार्मिक संस्कार आणि जनकल्याणाचा समृद्ध ४५ वर्षांचा इतिहास.',
            'From establishment in 1981 to present: A rich 45-year legacy of social unity, cultural values, and community service in Satpati.'
          )}
        </p>
      </div>

      {/* Main Narrative Card */}
      <div className="bg-[#FAF8F5] p-8 sm:p-12 rounded-2xl border border-gray-200/80 shadow-2xs space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-gray-200 pb-6">
          <div>
            <span className="text-xs font-bold text-[#FF9933] uppercase tracking-wider font-marathi">
              {t('स्थापना वर्ष', 'Establishment Year')}
            </span>
            <h3 className="text-3xl font-extrabold text-[#111111] font-marathi">
              {t('सन १९८१ (Est. 1981)', 'Year 1981')}
            </h3>
          </div>
          <div className="px-4 py-2 rounded-xl bg-white border border-[#C89B3C]/30 text-xs font-bold text-gray-800 shadow-2xs font-marathi">
            {t('📍 सातपाटी, पालघर, महाराष्ट्र', '📍 Satpati, Palghar, Maharashtra')}
          </div>
        </div>

        <div className="prose prose-lg text-gray-700 leading-relaxed font-marathi space-y-4">
          <p>
            {t(
              'सातपाटी हे पालघर जिल्ह्यातील मच्छीमार आणि धार्मिक संस्कृतीसाठी प्रसिद्ध असलेले भव्य गाव आहे. १९८१ साली गावातील काही उत्साही आणि सामाजिक भान असणाऱ्या तरुणांनी एकत्र येऊन "तकदीर मित्र मंडळ" ची स्थापना केली.',
              'Satpati is a famous coastal village in Palghar district known for its rich fishing tradition and devout culture. In 1981, energetic and socially conscious village youth came together to establish "Taqdeer Mitra Mandal".'
            )}
          </p>
          <p>
            {t(
              'सुरुवातीच्या काळात अत्यंत साध्या पद्धतीने सुरू झालेला हा गणेशोत्सव कालांतराने सातपाटी परिसरातील सर्वाधिक लोकप्रिय आणि शिस्तबद्ध उत्सव बनला. मंडळाने केवळ धार्मिक पूजाविधीपुरते मर्यादित न राहता वर्षभर आरोग्य शिबिरे, रक्तदान, शिक्षण सहाय्य आणि पर्यावरण संवर्धनाचे उपक्रम हाती घेतले.',
              'What started as a simple traditional celebration grew over decades into Satpati’s most disciplined and cherished community festival. Moving beyond religious festivities, the Mandal conducts year-round medical camps, blood donation drives, educational support, and coastal environmental preservation.'
            )}
          </p>
          <p>
            {t(
              'आज ४५ वर्षांनंतरही, मंडळाच्या ज्येष्ठ मार्गदर्शकांचा अनुभव आणि नव्या युवा पिढीचा उत्साह यांच्या मिलाफातून "श्रद्धा • सेवा • संस्कृती" हे ब्रीदवाक्य सातत्याने सार्थ ठरत आहे.',
              'Today, after 45 glorious years, combining senior mentorship with vibrant youth energy, the motto "Faith • Service • Culture" continues to guide every step.'
            )}
          </p>
        </div>
      </div>

      {/* Vision & Mission Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Vision Card */}
        <div className="p-8 rounded-2xl bg-white border border-gray-200 shadow-2xs space-y-4">
          <div className="w-12 h-12 rounded-xl bg-[#FAF8F5] border border-[#C89B3C]/30 flex items-center justify-center text-[#FF9933]">
            <Compass className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 font-marathi">
            {t('आमचा दृष्टीकोन (Our Vision)', 'Our Vision')}
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed font-marathi">
            {t(
              'सातपाटी गावातील सर्व धर्मीय व सर्व धर्मीय बांधवांमध्ये बंधुभाव वाढवणे, पारंपारिक सांस्कृतिक मूल्यांची जपणूक करणे आणि समाजोपयोगी कार्यांतून समृद्ध समाज निर्माण करणे.',
              'To foster brotherhood among all residents of Satpati, safeguard traditional cultural heritage, and build an empowered, compassionate society through sustained community service.'
            )}
          </p>
        </div>

        {/* Mission Card */}
        <div className="p-8 rounded-2xl bg-white border border-gray-200 shadow-2xs space-y-4">
          <div className="w-12 h-12 rounded-xl bg-[#FAF8F5] border border-[#C89B3C]/30 flex items-center justify-center text-[#C89B3C]">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 font-marathi">
            {t('आमचे ध्येय (Our Mission)', 'Our Mission')}
          </h3>
          <ul className="text-sm text-gray-600 space-y-2.5 font-marathi">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#FF9933] shrink-0 mt-0.5" />
              <span>{t('पर्यावरणपूरक व शिस्तबद्ध गणेशोत्सवाचे आयोजन करणे.', 'Organizing eco-friendly and highly disciplined Ganesha festivals.')}</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#FF9933] shrink-0 mt-0.5" />
              <span>{t('दरवर्षी १००% मोफत रक्तदान व आरोग्य सेवा पुरवणे.', 'Providing 100% free annual blood donation and medical care.')}</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#FF9933] shrink-0 mt-0.5" />
              <span>{t('गरजू विद्यार्थ्यांना शैक्षणिक मदत व शिष्यवृत्ती देणे.', 'Supporting needy students with free educational supplies and scholarships.')}</span>
            </li>
          </ul>
        </div>

      </div>

      {/* ELEGANT VERTICAL TIMELINE */}
      <div className="space-y-8 pt-6">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-[#FF9933] font-marathi">
            {t('महत्त्वाचे टप्पे', 'Major Milestones')}
          </span>
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 font-marathi mt-1">
            {t('मंडळाची यशस्वी वाटचाल (Vertical Timeline)', 'Milestones Timeline')}
          </h3>
        </div>

        <div className="relative border-l-2 border-[#C89B3C]/30 ml-4 sm:ml-32 space-y-12 py-4">
          {milestones.map((item) => (
            <div key={item.id} className="relative pl-6 sm:pl-10 group">
              
              {/* Timeline Dot */}
              <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-white border-4 border-[#FF9933] group-hover:scale-125 transition-transform" />

              {/* Year Badge on the Left (Desktop) */}
              <div className="sm:absolute sm:-left-32 sm:top-1 text-sm font-extrabold text-[#FF9933] font-marathi bg-[#FAF8F5] px-3 py-1 rounded-lg border border-[#C89B3C]/20 inline-block mb-2 sm:mb-0">
                {item.year}
              </div>

              {/* Milestone Card Content */}
              <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-2xs hover:shadow-md transition-all space-y-2">
                <h4 className="text-lg font-bold text-gray-900 font-marathi">
                  {t(item.titleMr, item.titleEn)}
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed font-marathi">
                  {t(item.descriptionMr, item.descriptionEn)}
                </p>
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
