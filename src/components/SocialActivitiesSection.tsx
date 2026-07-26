import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { SocialActivity } from '../types';
import { HeartHandshake, Award, Calendar, CheckCircle, UserPlus, X } from 'lucide-react';

interface SocialActivitiesProps {
  activities: SocialActivity[];
}

export const SocialActivitiesSection: React.FC<SocialActivitiesProps> = ({ activities }) => {
  const { t } = useLanguage();
  const [isVolunteerModalOpen, setIsVolunteerModalOpen] = useState(false);
  const [volunteerSubmitted, setVolunteerSubmitted] = useState(false);
  const [volunteerForm, setVolunteerForm] = useState({
    name: '',
    phone: '',
    activity: 'all',
    notes: ''
  });

  const handleVolunteerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setVolunteerSubmitted(true);
    setTimeout(() => {
      setVolunteerSubmitted(false);
      setIsVolunteerModalOpen(false);
      setVolunteerForm({ name: '', phone: '', activity: 'all', notes: '' });
    }, 2500);
  };

  return (
    <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF8F5] border border-[#C89B3C]/30 text-xs font-semibold text-gray-800 shadow-2xs">
          <HeartHandshake className="w-3.5 h-3.5 text-emerald-600" />
          <span className="font-marathi">{t('सामाजिक बांधिलकी व जनकल्याण', 'Social Welfare Services')}</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111111] font-marathi tracking-tight">
          {t('मंडळाचे सामाजिक उपक्रम', 'Social Activities & Philanthropy')}
        </h2>

        <p className="text-base text-gray-600 leading-relaxed font-marathi">
          {t(
            'उत्सवाच्या आनंदासोबतच सातपाटी गावातील आरोग्य, शिक्षण, पर्यावरण आणि गरिबांच्या कल्याणासाठी नियमित उपक्रम.',
            'Beyond festive joy: Sustained year-round community health, education, environmental protection, and food security drives.'
          )}
        </p>

        <div className="pt-2">
          <button
            onClick={() => setIsVolunteerModalOpen(true)}
            id="volunteer-signup-btn"
            className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 mx-auto font-marathi"
          >
            <UserPlus className="w-4 h-4" />
            <span>{t('स्वयंसेवक म्हणून सहभागी व्हा (Become Volunteer)', 'Become a Volunteer')}</span>
          </button>
        </div>
      </div>

      {/* Activity Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {activities.map((act) => (
          <div
            key={act.id}
            className="bg-white rounded-2xl border border-gray-200/90 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col group"
          >
            
            {/* Image */}
            <div className="aspect-16/10 overflow-hidden relative bg-gray-100">
              <img
                src={act.imageUrl}
                alt={act.titleEn}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-3 left-3 bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-md shadow-2xs font-marathi">
                {t(act.impactStatMr, act.impactStatEn)}
              </div>
            </div>

            {/* Content */}
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-gray-900 font-marathi">
                  {t(act.titleMr, act.titleEn)}
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed font-marathi">
                  {t(act.descriptionMr, act.descriptionEn)}
                </p>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 font-marathi">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{t(act.dateMr, act.dateEn)}</span>
                </span>
                <span className="text-emerald-700 font-bold">
                  {t('सक्रिय उपक्रम', 'Active Project')}
                </span>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* Volunteer Registration Modal */}
      {isVolunteerModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-gray-200 max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative animate-in zoom-in-95 duration-150 font-marathi">
            
            <button
              onClick={() => setIsVolunteerModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            {volunteerSubmitted ? (
              <div className="text-center py-8 space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  {t('आपली नोंदणी यशस्वी झाली!', 'Volunteer Registration Successful!')}
                </h3>
                <p className="text-xs text-gray-600">
                  {t('मंडळाचे कार्यकर्ते लवकरच आपल्याशी संपर्क साधतील. धन्यवाद!', 'Mandal team will reach out to you shortly. Thank you!')}
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-gray-900">
                    {t('स्वयंसेवक नोंदणी अर्ज', 'Volunteer Registration')}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {t('सातपाटीच्या सामाजिक आणि गणेशोत्सव उपक्रमांत सहभागासाठी आपले नाव नोंदवा.', 'Register to participate in Satpati social & festive volunteer teams.')}
                  </p>
                </div>

                <form onSubmit={handleVolunteerSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">
                      {t('संपूर्ण नाव (Full Name)*', 'Full Name*')}
                    </label>
                    <input
                      type="text"
                      required
                      value={volunteerForm.name}
                      onChange={(e) => setVolunteerForm({...volunteerForm, name: e.target.value})}
                      placeholder={t('उदा. अमोल शांताराम तरे', 'e.g. Amol Shantaram Tare')}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-emerald-600 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">
                      {t('फोन / व्हॉट्सॲप नंबर (Phone)*', 'Phone / WhatsApp*')}
                    </label>
                    <input
                      type="tel"
                      required
                      value={volunteerForm.phone}
                      onChange={(e) => setVolunteerForm({...volunteerForm, phone: e.target.value})}
                      placeholder="+91 98230 XXXXX"
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-emerald-600 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">
                      {t('इच्छुक उपक्रम (Interested Drive)', 'Interested Drive')}
                    </label>
                    <select
                      value={volunteerForm.activity}
                      onChange={(e) => setVolunteerForm({...volunteerForm, activity: e.target.value})}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-emerald-600 text-sm"
                    >
                      <option value="all">{t('सर्व उपक्रम व गणेशोत्सव (All Drives)', 'All Drives & Festival')}</option>
                      <option value="blood">{t('रक्तदान शिबिर (Blood Donation)', 'Blood Donation')}</option>
                      <option value="beach">{t('समुद्रकिनारा स्वच्छता (Beach Cleanliness)', 'Beach Cleanup')}</option>
                      <option value="prasad">{t('महाप्रसाद व्यवस्थापन (Mahaprasad)', 'Mahaprasad Management')}</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-colors pt-2"
                  >
                    {t('नोंदणी सादर करा (Submit)', 'Submit Volunteer Application')}
                  </button>
                </form>
              </>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
