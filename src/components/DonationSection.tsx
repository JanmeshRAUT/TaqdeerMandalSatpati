import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { HeartHandshake, Building, IndianRupee, QrCode, Send, CheckCircle2 } from 'lucide-react';
import API_BASE_URL from '../config/api';

export const DonationSection: React.FC = () => {
  const { t } = useLanguage();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [donationForm, setDonationForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    details: 'देणगी',
    amount: '',
    transactionId: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/donations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(donationForm)
      });
      
      if (response.ok) {
        setFormSubmitted(true);
          setTimeout(() => {
            setFormSubmitted(false);
            setDonationForm({ name: '', email: '', phone: '', address: '', details: 'देणगी', amount: '', transactionId: '' });
          }, 5000);
      } else {
        alert(t('काहीतरी चूक झाली, कृपया पुन्हा प्रयत्न करा.', 'Something went wrong, please try again.'));
      }
    } catch (error) {
      console.error(error);
      alert(t('काहीतरी चूक झाली, कृपया पुन्हा प्रयत्न करा.', 'Something went wrong, please try again.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF8F5] border border-[#C89B3C]/30 text-xs font-semibold text-gray-800 shadow-2xs">
          <HeartHandshake className="w-3.5 h-3.5 text-[#FF9933]" />
          <span className="font-marathi">{t('देणगी', 'Donation')}</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111111] font-marathi tracking-tight">
          {t('सढळ हाताने देणगी द्या', 'Support with your Donation')}
        </h2>

        <p className="text-base text-gray-600 leading-relaxed font-marathi">
          {t(
            'आपल्या मदतीने मंडळाचे सामाजिक व धार्मिक कार्य अधिक जोमाने पुढे नेण्यास मदत होईल.',
            'Your generous contribution helps the Mandal in organizing religious and social activities more effectively.'
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start w-full">
        
        {/* Left Column: Unified Payment Details Card */}
        <div className="bg-white p-8 rounded-2xl border border-gray-200/90 shadow-2xs space-y-8 h-full">
          <div className="text-center pb-6 border-b border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 font-marathi">
              {t('पेमेंट तपशील', 'Payment Details')}
            </h3>
            <p className="text-sm text-gray-500 font-marathi mt-2">
              {t('खालील क्यूआर कोड स्कॅन करून किंवा बँक खात्यात थेट ट्रान्सफर करून देणगी देऊ शकता.', 'Scan the QR code below or transfer directly to the bank account.')}
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
            
            {/* QR Code Section */}
            <div className="flex flex-col items-center text-center space-y-4 w-full md:w-1/2">
              <div className="w-56 h-56 bg-gray-50 rounded-2xl flex items-center justify-center border-2 border-dashed border-gray-300 relative overflow-hidden">
                <QrCode className="w-24 h-24 text-gray-300" />
                <div className="absolute inset-0 flex items-center justify-center font-bold text-gray-400 bg-white/60">
                  {t('QR Code', 'QR Code')}
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-gray-500 font-semibold text-xs font-marathi uppercase tracking-wider">{t('यूपीआय आयडी (UPI ID)', 'UPI ID')}</span>
                <div className="font-bold text-gray-900 text-lg bg-gray-100 px-4 py-2 rounded-lg">taqdeermandal@upi</div>
              </div>
              <p className="text-xs text-green-600 font-bold mt-2 bg-green-50 px-4 py-2 rounded-lg w-full">
                {t('GPay, PhonePe, Paytm वरून स्कॅन करा', 'Scan from GPay, PhonePe, Paytm')}
              </p>
            </div>

            {/* Bank Details Section */}
            <div className="w-full md:w-1/2 space-y-5 text-sm text-gray-700 font-marathi bg-[#FAF8F5] p-6 rounded-2xl border border-[#C89B3C]/20 shadow-inner">
              <div className="flex items-center gap-2 mb-2 pb-3 border-b border-gray-200">
                <Building className="w-5 h-5 text-[#FF9933]" />
                <span className="font-bold text-gray-900 text-base">{t('बँक खाते', 'Bank Account')}</span>
              </div>
              
              <div className="flex flex-col gap-1">
                <span className="text-gray-500 font-semibold text-xs uppercase">{t('बँकेचे नाव (Bank)', 'Bank Name')}</span>
                <span className="font-bold text-gray-900 text-base">{t('बँक ऑफ बडोदा', 'Bank of Baroda')}</span>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-gray-500 font-semibold text-xs uppercase">{t('खातेधारक (Account Name)', 'Account Name')}</span>
                <span className="font-bold text-gray-900 text-base">{t('तकदीर मित्र मंडळ', 'Taqdeer Mitra Mandal')}</span>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-gray-500 font-semibold text-xs uppercase">{t('खाते क्रमांक (A/C No)', 'Account Number')}</span>
                <span className="font-bold text-gray-900 text-base font-mono bg-white px-2 py-1 rounded border border-gray-200 mt-1">XXXX XXXX XXXX XXX</span>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-gray-500 font-semibold text-xs uppercase">{t('आयएफएससी (IFSC)', 'IFSC Code')}</span>
                <span className="font-bold text-gray-900 text-base font-mono bg-white px-2 py-1 rounded border border-gray-200 mt-1">BARB0XXXXXX</span>
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: Report Donation Form */}
        <div className="bg-white p-8 md:p-10 rounded-2xl border border-gray-200/90 shadow-2xs space-y-6 h-full flex flex-col justify-center">
          <div className="border-b border-gray-100 pb-5 text-center">
            <h3 className="text-2xl font-bold text-gray-900 font-marathi">
              {t('देणगी नोंदवा', 'Report Your Donation')}
            </h3>
            <p className="text-sm text-gray-500 font-marathi mt-2">
              {t('पेमेंट केल्यानंतर खालील फॉर्म भरा. पडताळणीनंतर तुम्हाला ईमेलवर पावती मिळेल.', 'Fill this form after making your payment. You will receive an official receipt via email.')}
            </p>
          </div>

          {formSubmitted ? (
            <div className="py-12 text-center space-y-4 font-marathi flex-1 flex flex-col justify-center">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold text-gray-900">
                {t('माहिती यशस्वीरीत्या नोंदवली!', 'Details submitted successfully!')}
              </h4>
              <p className="text-sm text-gray-600 max-w-sm mx-auto">
                {t('मंडळाकडून पडताळणी झाल्यानंतर पावती तुमच्या ईमेलवर पाठवली जाईल. धन्यवाद!', 'Once verified by the Mandal, the official receipt will be sent to your email. Thank you!')}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 text-sm font-marathi">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-bold mb-1.5">
                    {t('पूर्ण नाव (Full Name)*', 'Full Name*')}
                  </label>
                  <input
                    type="text"
                    required
                    value={donationForm.name}
                    onChange={(e) => setDonationForm({...donationForm, name: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#FF9933] focus:ring-1 focus:ring-[#FF9933] transition-all bg-gray-50/50"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-1.5">
                    {t('फोन नंबर (Phone)*', 'Phone Number*')}
                  </label>
                  <input
                    type="tel"
                    required
                    value={donationForm.phone}
                    onChange={(e) => setDonationForm({...donationForm, phone: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#FF9933] focus:ring-1 focus:ring-[#FF9933] transition-all bg-gray-50/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-bold mb-1.5">
                    {t('ईमेल (Email Address)*', 'Email Address*')}
                  </label>
                  <input
                    type="email"
                    required
                    value={donationForm.email}
                    onChange={(e) => setDonationForm({...donationForm, email: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#FF9933] focus:ring-1 focus:ring-[#FF9933] transition-all bg-gray-50/50"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-1.5">
                    {t('देणगी रक्कम (Amount in ₹)*', 'Donation Amount (₹)*')}
                  </label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="number"
                      required
                      min="1"
                      value={donationForm.amount}
                      onChange={(e) => setDonationForm({...donationForm, amount: e.target.value})}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#FF9933] focus:ring-1 focus:ring-[#FF9933] transition-all bg-gray-50/50 font-bold"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-bold mb-1.5">
                    {t('पत्ता (Address)', 'Address')}
                  </label>
                  <input
                    type="text"
                    value={donationForm.address}
                    onChange={(e) => setDonationForm({...donationForm, address: e.target.value})}
                    placeholder={t('उदा. सातपाटी, पालघर', 'e.g. Satpati, Palghar')}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#FF9933] focus:ring-1 focus:ring-[#FF9933] transition-all bg-gray-50/50"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-1.5">
                    {t('देणगीचा तपशील (Details)', 'Donation Details')}
                  </label>
                  <input
                    type="text"
                    value={donationForm.details}
                    onChange={(e) => setDonationForm({...donationForm, details: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#FF9933] focus:ring-1 focus:ring-[#FF9933] transition-all bg-gray-50/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1.5">
                  {t('ट्रान्झॅक्शन आयडी / UTR (Transaction ID)*', 'Transaction ID / UTR*')}
                </label>
                <input
                  type="text"
                  required
                  value={donationForm.transactionId}
                  onChange={(e) => setDonationForm({...donationForm, transactionId: e.target.value})}
                  placeholder={t('उदा. 320145698712', 'e.g. 320145698712')}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#FF9933] focus:ring-1 focus:ring-[#FF9933] transition-all bg-gray-50/50 font-mono"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 rounded-xl text-white font-bold text-base shadow-lg transition-all flex items-center justify-center gap-2 mt-4 ${
                  isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#FF9933] hover:bg-[#e68a2e] hover:shadow-xl hover:-translate-y-0.5'
                }`}
              >
                <Send className="w-5 h-5" />
                <span>{isSubmitting ? t('प्रतीक्षा करा...', 'Submitting...') : t('माहिती पाठवा (Submit Details)', 'Submit Details')}</span>
              </button>

            </form>
          )}
        </div>

      </div>

    </div>
  );
};
