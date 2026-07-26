import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Shirt, CheckCircle, Loader2, List, Search, ArrowUpDown } from 'lucide-react';
import { JerseyBooking } from '../types';

interface JerseyBookingPanelProps {
  bookings?: JerseyBooking[];
}

export const JerseyBookingPanel: React.FC<JerseyBookingPanelProps> = ({ bookings = [] }) => {
  const { t } = useLanguage();
  const [mode, setMode] = useState<'book' | 'view'>('book');

  React.useEffect(() => {
    const handleOpenView = () => setMode('view');
    const handleOpenBook = () => setMode('book');
    window.addEventListener('openJerseyView', handleOpenView);
    window.addEventListener('openJerseyBook', handleOpenBook);
    return () => {
      window.removeEventListener('openJerseyView', handleOpenView);
      window.removeEventListener('openJerseyBook', handleOpenBook);
    };
  }, []);
  
  // Booking Form State
  const [formData, setFormData] = useState({
    name: '',
    size: 10,
    sleeveType: 'Half'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  // View Mode State
  const [searchQuery, setSearchQuery] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const sizes = Array.from({ length: 21 }, (_, i) => 10 + i * 2);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError(t('कृपया तुमचे नाव टाका.', 'Please enter your name.'));
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
          size: formData.size,
          sleeveType: formData.sleeveType,
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

  const filteredAndSortedBookings = bookings
    .filter(b => b.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortDirection === 'asc') return a.size - b.size;
      return b.size - a.size;
    });

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
        
        {/* Toggle Mode */}
        <div className="flex bg-gray-200/50 p-1 rounded-xl shadow-inner">
          <button
            onClick={() => setMode('book')}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg font-bold text-sm transition-all ${
              mode === 'book' ? 'bg-white text-[#111111] shadow-sm' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <Shirt className="w-4 h-4" />
            <span>{t('बुक करा', 'Book')}</span>
          </button>
          <button
            onClick={() => setMode('view')}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg font-bold text-sm transition-all ${
              mode === 'view' ? 'bg-white text-[#111111] shadow-sm' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <List className="w-4 h-4" />
            <span>{t('बुकिंग पहा', 'View Bookings')}</span>
          </button>
        </div>
      </div>

      <div className="relative z-10">
        <AnimatePresence mode="wait">
          {mode === 'book' ? (
            <motion.div
              key="book"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
            >
              {/* Left Side: Info */}
              <div className="space-y-6 text-center md:text-left">
                <p className="text-gray-600 font-medium text-lg leading-relaxed">
                  {t('आगामी गणेशोत्सवासाठी तकदीर मित्र मंडळाची खास डिझाइन केलेली जर्सी आजच बुक करा.', 'Pre-book our exclusively designed Taqdeer Mitra Mandal jersey for the upcoming festival.')}
                </p>

                <div className="flex justify-center md:justify-start">
                  <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs rotate-[-2deg] hover:rotate-0 transition-transform">
                    <div className="w-40 h-40 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
                      <Shirt className="w-20 h-20 opacity-50" />
                      <span className="sr-only">Jersey Placeholder</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side: Form */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-100 relative">
                {isSuccess ? (
                  <motion.div
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
                        setFormData({ name: '', size: 10, sleeveType: 'Half' });
                      }}
                      className="mt-4 px-6 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-200 transition-colors cursor-pointer"
                    >
                      {t('आणखी एक बुक करा', 'Book Another')}
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
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

                    <div className="grid grid-cols-2 gap-4">
                      {/* Size */}
                      <div className="space-y-1.5">
                        <label className="block text-sm font-bold text-gray-700">
                          {t('साईझ', 'Size')} <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={formData.size}
                          onChange={(e) => setFormData({ ...formData, size: Number(e.target.value) })}
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#FF9933]/50 focus:border-[#FF9933] transition-all bg-gray-50/50 appearance-none cursor-pointer"
                        >
                          {sizes.map(size => (
                            <option key={size} value={size}>{size}</option>
                          ))}
                        </select>
                      </div>

                      {/* Sleeve Type */}
                      <div className="space-y-1.5">
                        <label className="block text-sm font-bold text-gray-700">
                          {t('स्लीव्ह प्रकार', 'Sleeve Type')} <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={formData.sleeveType}
                          onChange={(e) => setFormData({ ...formData, sleeveType: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#FF9933]/50 focus:border-[#FF9933] transition-all bg-gray-50/50 appearance-none cursor-pointer"
                        >
                          <option value="Half">{t('हाफ (Half)', 'Half Sleeve')}</option>
                          <option value="Full">{t('फुल (Full)', 'Full Sleeve')}</option>
                        </select>
                      </div>
                    </div>

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
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6"
            >
              <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder={t('नावाने शोधा...', 'Search by name...')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF9933]/50 focus:bg-white transition-all"
                  />
                </div>
                
                <button
                  onClick={() => setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-semibold hover:bg-gray-100 transition-colors"
                >
                  <ArrowUpDown className="w-4 h-4" />
                  <span>{t('साईझ', 'Size')} ({sortDirection === 'asc' ? '↑' : '↓'})</span>
                </button>
              </div>

              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50/50">
                      <th className="p-4 text-sm font-bold text-gray-700">{t('नाव', 'Name')}</th>
                      <th className="p-4 text-sm font-bold text-gray-700 w-24">{t('साईझ', 'Size')}</th>
                      <th className="p-4 text-sm font-bold text-gray-700 w-32">{t('स्लीव्ह', 'Sleeve')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAndSortedBookings.length > 0 ? (
                      filteredAndSortedBookings.map((booking) => (
                        <tr key={booking.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                          <td className="p-4 font-medium text-gray-900">{booking.name}</td>
                          <td className="p-4 font-bold text-[#FF9933]">{booking.size}</td>
                          <td className="p-4 text-gray-600">{booking.sleeveType === 'Half' ? t('हाफ', 'Half') : t('फुल', 'Full')}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className="p-8 text-center text-gray-500 font-medium">
                          {t('कोणतेही बुकिंग आढळले नाही.', 'No bookings found.')}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 text-xs font-bold text-gray-400 text-right">
                {t('एकूण बुकिंग:', 'Total Bookings:')} <span className="text-gray-700">{filteredAndSortedBookings.length}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
