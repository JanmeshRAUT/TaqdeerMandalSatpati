import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Shirt, CheckCircle, Loader2, Plus, Trash2, Users, ShieldCheck } from 'lucide-react';
import { JerseyBooking, JerseyBookingItem, NavTab } from '../types';

// Add Razorpay to window object types
declare global {
  interface Window {
    Razorpay: any;
  }
}

const loadScript = (src: string) => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

interface JerseyShopPageProps {
  bookings?: JerseyBooking[];
  setActiveTab: (tab: NavTab) => void;
}

export const JerseyShopPage: React.FC<JerseyShopPageProps> = ({ bookings = [], setActiveTab }) => {
  const { t } = useLanguage();
  
  const [formData, setFormData] = useState({
    name: '',
    address: ''
  });
  const [items, setItems] = useState<{ id: string, size: number, sleeveType: string, quantity: number }[]>([]);
  const [currentItem, setCurrentItem] = useState({ size: 10, sleeveType: 'Half', quantity: 1 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'product' | 'checkout'>('product');
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
    if (currentItem.quantity > 0) {
      setItems([...items, { ...currentItem, id: Date.now().toString() }]);
      
      // Reset current item selections
      setCurrentItem({ size: 10, sleeveType: 'Half', quantity: 1 });

      // Provide better UX on mobile by showing a toast or updating instantly
      // We no longer scroll because we use a multi-step layout.
    }
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
      // 1. Load Razorpay Script
      const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
      if (!res) {
        throw new Error('Razorpay SDK failed to load. Are you online?');
      }

      // 2. Create Order on Backend
      const orderResponse = await fetch('/api/create-razorpay-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 10 }), // 10 Rupees Registration Fee
      });

      if (!orderResponse.ok) {
        throw new Error('Failed to create payment order');
      }

      const orderData = await orderResponse.json();

      // 3. Initialize Razorpay options
      const options = {
        key: 'rzp_test_dummykeyid123', // In production, this should come from env or backend
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Taqdeer Mitra Mandal',
        description: 'Jersey Registration Fee',
        order_id: orderData.id,
        handler: async function (response: any) {
          try {
            // 4. On successful payment, save booking to database
            const bookingResponse = await fetch('/api/jersey-bookings', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                id: Date.now().toString(),
                name: formData.name.trim(),
                address: formData.address.trim(),
                items: items,
                bookingDate: new Date().toISOString(),
                paymentId: response.razorpay_payment_id,
                paymentStatus: 'Success'
              })
            });

            if (!bookingResponse.ok) throw new Error('Failed to submit booking after payment');
            
            setIsSuccess(true);
          } catch (err) {
            setError(t('बुकिंग करण्यात त्रुटी आली. कृपया पुन्हा प्रयत्न करा.', 'Error in saving booking after payment.'));
          } finally {
            setIsSubmitting(false);
          }
        },
        prefill: {
          name: formData.name,
        },
        theme: {
          color: '#FF9933'
        },
        modal: {
          ondismiss: function() {
            setIsSubmitting(false);
          }
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (err: any) {
      setError(err.message || t('बुकिंग करण्यात त्रुटी आली. कृपया पुन्हा प्रयत्न करा.', 'Error in booking. Please try again.'));
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
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-100 text-[#FF9933] font-bold text-sm mb-4">
            <Shirt className="w-4 h-4" />
            <span>{t('२०२६ उत्सव विशेष', '2026 Festival Special')}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#111111] tracking-tight mb-4">
            {t('मंडळाची अधिकृत जर्सी', 'Mandal Official Jersey')}
          </h2>
          <button 
            onClick={() => setActiveTab('jersey-bookings')}
            className="mt-4 px-6 py-2.5 rounded-xl bg-white border border-gray-200 shadow-sm text-gray-800 font-bold hover:bg-gray-50 hover:border-gray-300 transition-colors inline-flex items-center gap-2"
          >
            <Users className="w-5 h-5 text-[#FF9933]" />
            {t('बुक केलेल्या जर्सी पहा', 'View Booked Jerseys')}
          </button>
        </div>
      </div>

      <div className="relative z-10">
        <AnimatePresence mode="wait">
          {isSuccess ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center text-center space-y-4 py-16 bg-white rounded-3xl shadow-xl border border-gray-100"
            >
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center text-green-500 mb-4">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900">
                {t('बुकिंग यशस्वी!', 'Booking Successful!')}
              </h3>
              <p className="text-gray-600 text-lg">
                {t('तुमची जर्सी यशस्वीरित्या बुक झाली आहे.', 'Your jersey has been booked.')}
              </p>
              <button
                onClick={() => {
                  setIsSuccess(false);
                  setFormData({ name: '', address: '' });
                  setItems([]);
                  setCheckoutStep('product');
                }}
                className="mt-6 px-8 py-3 bg-gray-100 text-gray-700 rounded-xl text-lg font-bold hover:bg-gray-200 transition-colors cursor-pointer"
              >
                {t('आणखी एक बुक करा', 'Book Another')}
              </button>
            </motion.div>
          ) : checkoutStep === 'product' ? (
            <motion.div 
              key="product"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
            >
              {/* Left Side: Info */}
              <div className="space-y-6 text-center md:text-left">
                <p className="text-gray-600 font-medium text-lg leading-relaxed">
                  {t('आगामी गणेशोत्सवासाठी तकदीर मित्र मंडळाची खास डिझाइन केलेली जर्सी आजच बुक करा.', 'Pre-book our exclusively designed Taqdeer Mitra Mandal jersey for the upcoming festival.')}
                </p>

                <div className="flex justify-center md:justify-start w-full">
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
                <div className="space-y-5">
                  <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
                    <h3 className="text-lg font-bold text-gray-900 border-b pb-2 flex justify-between">
                      <span>{t('१. जर्सी निवडा', '1. Select Jersey')}</span>
                      {items.length > 0 && (
                        <span className="text-[#FF9933] text-sm">
                          {items.length} {t('आयटम जोडले', 'items added')}
                        </span>
                      )}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* Size */}
                      <div className="space-y-1.5 col-span-1">
                        <label className="block text-xs font-bold text-gray-700">
                          {t('साईझ', 'Size')}
                        </label>
                        <select
                          value={currentItem.size}
                          onChange={(e) => setCurrentItem({ ...currentItem, size: Number(e.target.value) })}
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#FF9933]/50 focus:border-[#FF9933] transition-all bg-gray-50/50 appearance-none cursor-pointer text-sm font-medium"
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
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#FF9933]/50 focus:border-[#FF9933] transition-all bg-gray-50/50 appearance-none cursor-pointer text-sm font-medium"
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
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#FF9933]/50 focus:border-[#FF9933] transition-all bg-gray-50/50 text-sm font-medium"
                        />
                      </div>
                    </div>
                    
                    <button
                      type="button"
                      onClick={handleAddItem}
                      className="w-full py-3 rounded-xl bg-orange-50 text-[#FF9933] font-bold hover:bg-[#FF9933] hover:text-white transition-colors flex items-center justify-center gap-2 border border-orange-200 hover:border-[#FF9933]"
                    >
                      <Plus className="w-5 h-5" />
                      {t('ऑर्डरमध्ये जोडा', 'Add to Order')}
                    </button>
                  </div>

                  {items.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="pt-4 border-t border-gray-100"
                    >
                      <button
                        type="button"
                        onClick={() => setCheckoutStep('checkout')}
                        className="w-full py-4 bg-gradient-to-r from-[#111111] to-[#333333] text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer text-lg"
                      >
                        {t('चेकआउट करा', 'Proceed to Checkout')} ({items.reduce((sum, item) => sum + item.quantity, 0)} items)
                      </button>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="checkout"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="max-w-3xl mx-auto"
            >
              <button 
                onClick={() => setCheckoutStep('product')}
                className="mb-6 text-gray-500 hover:text-gray-800 font-bold flex items-center gap-2 text-sm"
              >
                ← {t('मागे जा', 'Back to Shop')}
              </button>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-100 space-y-6">
                  {/* Cart Summary */}
                  <div className="bg-orange-50/50 p-5 rounded-xl border border-orange-100 space-y-3">
                    <h3 className="text-sm font-bold text-gray-800 border-b border-orange-200 pb-2 flex justify-between items-center">
                      <span>{t('तुमची ऑर्डर', 'Your Order')}</span>
                      <span className="bg-orange-100 text-orange-800 px-2.5 py-1 rounded-md text-xs">
                        {items.reduce((sum, item) => sum + item.quantity, 0)} {t('जर्सी', 'Jerseys')}
                      </span>
                    </h3>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {items.map((item, index) => (
                        <div key={item.id} className="flex items-center justify-between bg-white px-4 py-3 rounded-xl shadow-2xs border border-orange-50">
                          <div className="flex items-center gap-3">
                            <span className="font-extrabold text-gray-400 text-sm">{index + 1}.</span>
                            <div className="text-sm">
                              <span className="font-bold text-[#FF9933]">Size {item.size}</span> 
                              <span className="text-gray-300 mx-2">|</span>
                              <span className="font-semibold text-gray-700">{item.sleeveType === 'Half' ? t('हाफ', 'Half') : t('फुल', 'Full')}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-sm font-bold bg-gray-50 text-gray-700 px-3 py-1 rounded-lg border border-gray-100">Qty: {item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(item.id)}
                              className="text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition-colors"
                              title="Remove"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Registration Fee */}
                    <div className="flex justify-between items-center border-t border-orange-200 pt-3 mt-2 text-sm font-bold text-gray-800">
                      <span>{t('नोंदणी शुल्क', 'Registration Fee')}</span>
                      <span className="text-[#FF9933]">₹10</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-gray-900 border-b pb-2">
                      {t('२. तुमचे तपशील', '2. Your Details')}
                    </h3>
                    
                    <div className="space-y-1.5">
                      <label className="block text-sm font-bold text-gray-700">
                        {t('पूर्ण नाव', 'Full Name')} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#FF9933]/50 focus:border-[#FF9933] transition-all bg-gray-50/50 font-medium"
                        placeholder={t('तुमचे नाव एंटर करा', 'Enter your name')}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-sm font-bold text-gray-700">
                        {t('पत्ता', 'Address')} <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        required
                        rows={2}
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#FF9933]/50 focus:border-[#FF9933] transition-all bg-gray-50/50 resize-none font-medium"
                        placeholder={t('तुमचा संपूर्ण पत्ता एंटर करा', 'Enter your full address')}
                      />
                    </div>
                  </div>

                  {error && (
                    <p className="text-red-500 text-sm font-bold text-center bg-red-50 p-3 rounded-xl border border-red-100">{error}</p>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isSubmitting || items.length === 0}
                    className="w-full py-4 bg-gradient-to-r from-[#111111] to-[#333333] text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed text-lg"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      <>
                        <ShieldCheck className="w-6 h-6 text-[#FF9933]" />
                        <span>{t('₹10 सुरक्षित पेमेंट करा', 'Pay ₹10 Securely')}</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
