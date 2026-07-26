import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Shirt, CheckCircle, Loader2, Plus, Trash2 } from 'lucide-react';
import { JerseyBooking } from '../types';

interface JerseyBookingPanelProps {
  bookings?: JerseyBooking[];
}

export const JerseyBookingPanel: React.FC<JerseyBookingPanelProps> = ({ bookings = [] }) => {
  const { t } = useLanguage();
  
  const [formData, setFormData] = useState({
    name: '',
    address: ''
  });
  const [items, setItems] = useState<{ id: string, size: number, sleeveType: string, quantity: number }[]>([]);
  const [currentItem, setCurrentItem] = useState({ size: 10, sleeveType: 'Half', quantity: 1 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  // Image Slider State
  const jerseyImages = ['/images/Tshirt1.png', '/images/Tshirt2.png'];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % jerseyImages.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const sizes = Array.from({ length: 21 }, (_, i) => 10 + i * 2);

  const handleAddItem = () => {
    setItems([...items, { ...currentItem, id: Date.now().toString() }]);
    setCurrentItem({ size: 10, sleeveType: 'Half', quantity: 1 });
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError(t('कृपया तुमचे नाव टाका.', 'Please enter your name.'));
      return;
    }
    if (!formData.address.trim()) {
      setError(t('कृपया तुमचा पत्ता टाका.', 'Please enter your address.'));
      return;
    }
    if (items.length === 0) {
      setError(t('कृपया किमान एक जर्सी जोडा.', 'Please add at least one jersey.'));
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/jersey-bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: Date.now().toString(),
          name: formData.name.trim(),
          address: formData.address.trim(),
          items: items,
          bookingDate: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error('Failed to submit booking');
      }

      setIsSuccess(true);
    } catch (err) {
      setError(t('बुकिंग करण्यात त्रुटी आली. कृपया पुन्हा प्रयत्न करा.', 'Error in booking. Please try again.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#FAF8F5] border border-[#FF9933]/30 rounded-3xl p-6 sm:p-10 shadow-sm max-w-5xl mx-auto my-12 font-marathi relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF9933]/10 rounded-full blur-3xl pointer-events-none transform translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#C89B3C]/10 rounded-full blur-3xl pointer-events-none transform -translate-x-1/3 translate-y-1/3" />

      <div className="relative z-10 flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div className="text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#FF9933]/30 text-xs font-bold text-[#FF9933] shadow-2xs mb-2">
            <Shirt className="w-4 h-4" />
            <span>{t('२०२६ उत्सव विशेष', '2026 Festival Special')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111111] tracking-tight">
            {t('मंडळाची अधिकृत जर्सी', 'Mandal Official Jersey')}
          </h2>
        </div>
      </div>

      <div className="relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left Side: Info */}
          <div className="space-y-6 text-center md:text-left">
            <p className="text-gray-600 font-medium text-lg leading-relaxed">
              {t('आगामी गणेशोत्सवासाठी तकदीर मित्र मंडळाची खास डिझाइन केलेली जर्सी आजच बुक करा.', 'Pre-book our exclusively designed Taqdeer Mitra Mandal jersey for the upcoming festival.')}
            </p>

            <div className="flex justify-center md:justify-center w-full">
              <div className="bg-white p-2 sm:p-4 rounded-[2rem] border border-gray-100 shadow-2xl relative w-full max-w-[400px] xl:max-w-[480px] aspect-[4/5] overflow-hidden group transition-all hover:shadow-orange-500/10">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#FF9933]/5 to-transparent z-0"></div>
                
                {jerseyImages.map((src, index) => (
                  <img 
                    key={src}
                    src={src} 
                    alt="Taqdeer Mandal Jersey" 
                    className={`absolute inset-0 w-full h-full object-cover transition-all duration-[1500ms] ease-in-out z-10 ${
                      index === currentImageIndex 
                        ? 'opacity-100 translate-x-0 scale-100' 
                        : 'opacity-0 -translate-x-4 scale-[0.97]'
                    }`}
                  />
                ))}
                
                {/* Image indicators */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20">
                  {jerseyImages.map((_, idx) => (
                    <div 
                      key={idx} 
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        idx === currentImageIndex ? 'bg-[#FF9933] w-6' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-100 relative">
            <AnimatePresence mode="wait">
              {isSuccess ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center text-center space-y-4 py-8"
                >
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-green-500 mb-2">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {t('बुकिंग यशस्वी!', 'Booking Successful!')}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {t('तुमची जर्सी यशस्वीरित्या बुक झाली आहे.', 'Your jersey has been booked.')}
                  </p>
                  <button
                    onClick={() => {
                      setIsSuccess(false);
                      setFormData({ name: '', address: '' });
                      setItems([]);
                    }}
                    className="mt-4 px-6 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-200 transition-colors cursor-pointer"
                  >
                    {t('आणखी एक बुक करा', 'Book Another')}
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >
                  {/* Name */}
                  <div className="space-y-1.5">
                    <label className="block text-sm font-bold text-gray-700">
                      {t('पूर्ण नाव', 'Full Name')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#FF9933]/50 focus:border-[#FF9933] transition-all bg-gray-50/50"
                      placeholder={t('तुमचे नाव एंटर करा', 'Enter your name')}
                    />
                  </div>

                  {/* Address */}
                  <div className="space-y-1.5">
                    <label className="block text-sm font-bold text-gray-700">
                      {t('पत्ता', 'Address')} <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#FF9933]/50 focus:border-[#FF9933] transition-all bg-gray-50/50 resize-none"
                      placeholder={t('तुमचा संपूर्ण पत्ता एंटर करा', 'Enter your full address')}
                    />
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-gray-200 space-y-4">
                    <div className="font-bold text-gray-700 text-sm mb-2 border-b pb-2">
                      {t('जर्सी तपशील जोडा', 'Add Jersey Details')}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* Size */}
                      <div className="space-y-1.5 col-span-1">
                        <label className="block text-xs font-bold text-gray-700">
                          {t('साईझ', 'Size')}
                        </label>
                        <select
                          value={currentItem.size}
                          onChange={(e) => setCurrentItem({ ...currentItem, size: Number(e.target.value) })}
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#FF9933]/50 focus:border-[#FF9933] transition-all bg-gray-50/50 appearance-none cursor-pointer text-sm"
                        >
                          {sizes.map(size => (
                            <option key={size} value={size}>{size}</option>
                          ))}
                        </select>
                      </div>

                      {/* Sleeve Type */}
                      <div className="space-y-1.5 col-span-1">
                        <label className="block text-xs font-bold text-gray-700">
                          {t('स्लीव्ह', 'Sleeve')}
                        </label>
                        <select
                          value={currentItem.sleeveType}
                          onChange={(e) => setCurrentItem({ ...currentItem, sleeveType: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#FF9933]/50 focus:border-[#FF9933] transition-all bg-gray-50/50 appearance-none cursor-pointer text-sm"
                        >
                          <option value="Half">{t('हाफ', 'Half')}</option>
                          <option value="Full">{t('फुल', 'Full')}</option>
                        </select>
                      </div>

                      {/* Quantity */}
                      <div className="space-y-1.5 col-span-1">
                        <label className="block text-xs font-bold text-gray-700">
                          {t('प्रमाण', 'Qty')}
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="50"
                          value={currentItem.quantity}
                          onChange={(e) => setCurrentItem({ ...currentItem, quantity: Number(e.target.value) })}
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#FF9933]/50 focus:border-[#FF9933] transition-all bg-gray-50/50 text-sm"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddItem}
                      className="w-full py-2.5 rounded-lg border-2 border-dashed border-[#FF9933] text-[#FF9933] font-bold text-sm hover:bg-[#FF9933]/10 transition-colors flex items-center justify-center gap-2 mt-2"
                    >
                      <Plus className="w-4 h-4" />
                      {t('जर्सी कार्टमध्ये जोडा', 'Add Jersey to Order')}
                    </button>
                  </div>

                  {items.length > 0 && (
                    <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 space-y-3">
                      <div className="text-sm font-bold text-gray-800 border-b border-orange-200 pb-2">
                        {t('तुमची ऑर्डर', 'Your Order')} ({items.reduce((sum, item) => sum + item.quantity, 0)} {t('जर्सी', 'Jerseys')})
                      </div>
                      {items.map((item, index) => (
                        <div key={item.id} className="flex items-center justify-between bg-white px-3 py-2 rounded-lg shadow-2xs border border-orange-100">
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-gray-800 text-sm">{index + 1}.</span>
                            <div className="text-sm">
                              <span className="font-bold text-[#FF9933]">Size: {item.size}</span> 
                              <span className="text-gray-500 mx-1">|</span>
                              <span className="font-semibold text-gray-700">{item.sleeveType === 'Half' ? t('हाफ', 'Half') : t('फुल', 'Full')}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-bold bg-orange-100 text-orange-800 px-2 py-0.5 rounded-md">Qty: {item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(item.id)}
                              className="text-red-400 hover:text-red-600 p-1"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {error && (
                    <p className="text-red-500 text-sm font-medium">{error}</p>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 bg-[#111111] text-white rounded-xl font-bold hover:bg-[#222222] transition-colors shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Shirt className="w-5 h-5" />
                        <span>{t('बुक करा', 'Book Now')}</span>
                      </>
                    )}
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};
