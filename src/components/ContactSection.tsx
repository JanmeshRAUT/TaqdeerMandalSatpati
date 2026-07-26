import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { MapPin, Phone, Mail, MessageCircle, Instagram, Facebook, Send, CheckCircle2 } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const { t } = useLanguage();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setContactForm({ name: '', phone: '', email: '', subject: '', message: '' });
    }, 3500);
  };

  return (
    <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF8F5] border border-[#C89B3C]/30 text-xs font-semibold text-gray-800 shadow-2xs">
          <MapPin className="w-3.5 h-3.5 text-[#FF9933]" />
          <span className="font-marathi">{t('संपर्क व अभिप्राय', 'Contact Us')}</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111111] font-marathi tracking-tight">
          {t('मंडळाशी संपर्क साधा', 'Connect with Taqdeer Mitra Mandal')}
        </h2>

        <p className="text-base text-gray-600 leading-relaxed font-marathi">
          {t(
            'सातपाटी गावातील मंडळाचे कार्यालय, पत्ते, फोन नंबर आणि ऑनलाइन संदेश फॉर्म.',
            'Visit our office at Satpati Beach Road, call us, or send your devotional inquiries & feedback online.'
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Address, Phone & Map */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-[#FAF8F5] p-8 rounded-2xl border border-gray-200 space-y-6">
            <h3 className="text-xl font-bold text-gray-900 font-marathi border-b border-gray-200 pb-3">
              {t('अधिकृत संपर्क माहिती', 'Official Contact Info')}
            </h3>

            <div className="space-y-4 text-sm text-gray-700 font-marathi">
              
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-white border border-[#C89B3C]/30 text-[#FF9933] flex items-center justify-center shrink-0 shadow-2xs">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{t('पत्ता (Address)', 'Office Address')}</h4>
                  <p className="text-xs text-gray-600 leading-relaxed mt-0.5">
                    {t(
                      'तकदीर मित्र मंडळ, सातपाटी बीच रोड, सातपाटी, तालुका व जिल्हा पालघर, महाराष्ट्र - ४०१४०५',
                      'Taqdeer Mitra Mandal, Satpati Beach Road, Satpati, Taluka & District Palghar, Maharashtra - 401405'
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-white border border-[#C89B3C]/30 text-[#FF9933] flex items-center justify-center shrink-0 shadow-2xs">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{t('फोन नंबर (Phone)', 'Telephone')}</h4>
                  <p className="text-xs text-gray-600 leading-relaxed mt-0.5">
                    {t('लवकरच उपलब्ध', 'Coming Soon')}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-white border border-[#C89B3C]/30 text-[#FF9933] flex items-center justify-center shrink-0 shadow-2xs">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{t('ईमेल (Email)', 'Official Email')}</h4>
                  <p className="text-xs text-gray-600 leading-relaxed mt-0.5">
                    {t('लवकरच उपलब्ध', 'Coming Soon')}
                  </p>
                </div>
              </div>

            </div>

            {/* Direct WhatsApp CTA */}
            <div className="pt-2">
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors shadow-md font-marathi"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{t('व्हॉट्सॲपवर थेट संदेश पाठवा', 'Direct WhatsApp Message')}</span>
              </a>
            </div>

          </div>

          {/* Interactive Google Map Box for Satpati Beach */}
          <div className="rounded-2xl overflow-hidden border border-gray-200 bg-[#FAF8F5] p-3 shadow-2xs space-y-2">
            <div className="aspect-16/9 rounded-xl overflow-hidden relative border border-gray-200">
              <iframe
                title="Satpati Location Map"
                src="https://maps.google.com/maps?q=Satpati,Palghar,Maharashtra&t=&z=14&ie=UTF8&iwloc=&output=embed"
                className="w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <div className="text-[11px] text-gray-500 font-marathi text-center pt-1">
              {t('📍 सातपाटी समुद्रकिनारा व सातपाटी बाजारपेठ, पालघर', '📍 Satpati Beach & Market Area, Palghar')}
            </div>
          </div>

        </div>

        {/* Right Column: Contact & Devotee Feedback Form */}
        <div className="lg:col-span-7 bg-white p-8 rounded-2xl border border-gray-200/90 shadow-2xs space-y-6">
          <div className="border-b border-gray-100 pb-4">
            <h3 className="text-xl font-bold text-gray-900 font-marathi">
              {t('संदेश व अभिप्राय नोंदवा', 'Send Inquiry or Feedback')}
            </h3>
            <p className="text-xs text-gray-500 font-marathi mt-1">
              {t('आपले मत, देणगी चौकशी किंवा सूचना मंडळाकडे थेट पाठवा.', 'Send your suggestions, donation inquiries, or queries directly to the Mandal.')}
            </p>
          </div>

          {formSubmitted ? (
            <div className="py-12 text-center space-y-3 font-marathi">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-gray-900">
                {t('आपला संदेश यशस्वीरीत्या मिळाला!', 'Your message has been received!')}
              </h4>
              <p className="text-xs text-gray-600">
                {t('तकदीर मित्र मंडळाची समिती आपल्या संदेशाची दखल घेईल. धन्यवाद!', 'Taqdeer Mitra Mandal executive committee will get back to you soon. Thank you!')}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-marathi">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">
                    {t('आपले नाव (Full Name)*', 'Full Name*')}
                  </label>
                  <input
                    type="text"
                    required
                    value={contactForm.name}
                    onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                    placeholder={t('उदा. विजय मेहेर', 'e.g. Vijay Meher')}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-[#FF9933] text-sm"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">
                    {t('फोन नंबर (Phone)*', 'Phone Number*')}
                  </label>
                  <input
                    type="tel"
                    required
                    value={contactForm.phone}
                    onChange={(e) => setContactForm({...contactForm, phone: e.target.value})}
                    placeholder="+91 98230 XXXXX"
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-[#FF9933] text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  {t('ईमेल पत्ता (Email)', 'Email Address')}
                </label>
                <input
                  type="email"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                  placeholder="name@example.com"
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-[#FF9933] text-sm"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  {t('विषय (Subject)', 'Subject')}
                </label>
                <select
                  value={contactForm.subject}
                  onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-[#FF9933] text-sm"
                >
                  <option value="">{t('विषय निवडा (Select Subject)', 'Select Subject')}</option>
                  <option value="donation">{t('देणगी व प्रायोजकत्व चौकशी (Donation / Sponsorship)', 'Donation / Sponsorship')}</option>
                  <option value="volunteer">{t('स्वयंसेवक सहभाग (Volunteering)', 'Volunteering')}</option>
                  <option value="feedback">{t('अभिप्राय व सूचना (General Feedback)', 'General Feedback')}</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  {t('आपला संदेश (Message)*', 'Your Message*')}
                </label>
                <textarea
                  required
                  rows={4}
                  value={contactForm.message}
                  onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                  placeholder={t('येथे संदेश लिहा...', 'Type your message here...')}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-[#FF9933] text-sm"
                />
              </div>

              <button
                type="submit"
                id="contact-submit-btn"
                className="w-full py-3.5 rounded-xl bg-gray-900 hover:bg-black text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 pt-2"
              >
                <Send className="w-4 h-4 text-[#FF9933]" />
                <span>{t('संदेश पाठवा (Send Message)', 'Send Message')}</span>
              </button>

            </form>
          )}

        </div>

      </div>

    </div>
  );
};
