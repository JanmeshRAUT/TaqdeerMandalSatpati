import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'framer-motion';
import { Shirt, Search, ArrowUpDown, ArrowLeft } from 'lucide-react';
import { JerseyBooking, NavTab } from '../types';

interface JerseyBookingsViewProps {
  bookings: JerseyBooking[];
  setActiveTab: (tab: NavTab) => void;
}

export const JerseyBookingsView: React.FC<JerseyBookingsViewProps> = ({ bookings, setActiveTab }) => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [sizeFilter, setSizeFilter] = useState<string>('all');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const flattenedBookings = bookings.flatMap(booking => 
    (booking.items || []).map(item => ({
      ...item,
      bookingId: booking.id,
      name: booking.name,
      phone: booking.phone,
      address: booking.address,
      bookingDate: booking.bookingDate,
      status: booking.status || 'Pending'
    }))
  );

  const filteredAndSortedBookings = flattenedBookings
    .filter(b => b.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter(b => sizeFilter === 'all' || b.size === Number(sizeFilter))
    .sort((a, b) => {
      if (sortDirection === 'asc') return a.size - b.size;
      return b.size - a.size;
    });

  return (
    <div className="min-h-screen bg-[#FAF8F5] pt-24 md:pt-32 pb-20 px-3 sm:px-6 lg:px-8 font-marathi flex flex-col items-center">
      <div className="w-full max-w-[1920px] mx-auto flex-1 flex flex-col">
        <button
          onClick={() => {
            setActiveTab('home');
            setTimeout(() => {
               document.getElementById('jersey-booking')?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          }}
          className="flex items-center gap-2 text-gray-500 hover:text-[#FF9933] font-bold mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{t('मागे जा', 'Go Back')}</span>
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl border border-gray-100 p-4 sm:p-8 lg:p-10 flex-1 flex flex-col"
        >
          <div className="flex items-center gap-4 mb-8 border-b border-gray-100 pb-6">
            <div className="w-16 h-16 bg-[#FF9933]/10 rounded-2xl flex items-center justify-center text-[#FF9933]">
              <Shirt className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight">
                {t('जर्सी बुकिंग यादी', 'Jersey Bookings List')}
              </h2>
              <p className="text-gray-500 font-medium mt-1">
                {t('सर्व सदस्यांची जर्सी बुकिंग माहिती', 'All members jersey booking information')}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-8">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder={t('नावाने शोधा...', 'Search by name...')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF9933]/50 focus:bg-white transition-all font-medium"
              />
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <select
                value={sizeFilter}
                onChange={(e) => setSizeFilter(e.target.value)}
                className="w-full sm:w-auto px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#FF9933]/50 transition-colors cursor-pointer"
              >
                <option value="all">{t('सर्व साईझ', 'All Sizes')}</option>
                {Array.from({ length: 21 }, (_, i) => 10 + i * 2).map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>

              <button
                onClick={() => setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}
                className="flex items-center justify-center gap-2 px-4 sm:px-6 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors shrink-0"
              >
                <ArrowUpDown className="w-4 h-4" />
                <span className="hidden sm:inline">{t('साईझ', 'Size')}</span> ({sortDirection === 'asc' ? '↑' : '↓'})
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 shadow-sm flex-1 overflow-hidden bg-white">
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="p-4 sm:p-5 text-xs sm:text-sm font-extrabold text-gray-700 uppercase tracking-wider">{t('नाव', 'Name')}</th>
                    <th className="p-4 sm:p-5 text-xs sm:text-sm font-extrabold text-gray-700 uppercase tracking-wider">{t('पत्ता', 'Address')}</th>
                    <th className="p-4 sm:p-5 text-xs sm:text-sm font-extrabold text-gray-700 uppercase tracking-wider w-32 sm:w-40">{t('फोन', 'Phone')}</th>
                    <th className="p-4 sm:p-5 text-xs sm:text-sm font-extrabold text-gray-700 uppercase tracking-wider w-20 sm:w-24 text-center">{t('प्रमाण', 'Qty')}</th>
                    <th className="p-4 sm:p-5 text-xs sm:text-sm font-extrabold text-gray-700 uppercase tracking-wider w-24 sm:w-32">{t('साईझ', 'Size')}</th>
                    <th className="p-4 sm:p-5 text-xs sm:text-sm font-extrabold text-gray-700 uppercase tracking-wider w-32 sm:w-40">{t('स्लीव्ह', 'Sleeve')}</th>
                    <th className="p-4 sm:p-5 text-xs sm:text-sm font-extrabold text-gray-700 uppercase tracking-wider w-28 text-center">{t('स्थिती', 'Status')}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAndSortedBookings.length > 0 ? (
                    filteredAndSortedBookings.map((booking) => (
                      <tr key={`${booking.bookingId}-${booking.id}`} className="border-b border-gray-100 hover:bg-orange-50/30 transition-colors group">
                        <td className="p-4 sm:p-5 text-sm sm:text-base font-bold text-gray-900 group-hover:text-[#FF9933] transition-colors">{booking.name}</td>
                        <td className="p-4 sm:p-5 text-sm sm:text-base text-gray-600 font-medium max-w-[200px] truncate" title={booking.address}>{booking.address}</td>
                        <td className="p-4 sm:p-5 text-sm sm:text-base font-bold text-gray-800">{booking.phone}</td>
                        <td className="p-4 sm:p-5 text-sm sm:text-base font-bold text-gray-900 text-center">{booking.quantity}</td>
                        <td className="p-4 sm:p-5 text-sm sm:text-base font-bold text-[#FF9933]">{booking.size}</td>
                        <td className="p-4 sm:p-5 text-sm sm:text-base text-gray-600 font-medium">
                          <span className="inline-flex items-center px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold bg-gray-100 text-gray-600 whitespace-nowrap">
                            {booking.sleeveType === 'Half' ? t('हाफ', 'Half') : t('फुल', 'Full')}
                          </span>
                        </td>
                        <td className="p-4 sm:p-5 text-center">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
                              booking.status === 'Verified' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                            }`}
                          >
                            {booking.status === 'Verified' ? 'Verified ✓' : 'Pending'}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="p-12 text-center">
                        <div className="flex flex-col items-center justify-center text-gray-400">
                          <Shirt className="w-12 h-12 mb-4 opacity-20" />
                          <p className="font-bold text-lg text-gray-500">{t('कोणतेही बुकिंग आढळले नाही.', 'No bookings found.')}</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden flex flex-col bg-gray-50/50 p-2">
              {(() => {
                const groupedBookings = bookings
                  .filter(b => b.name.toLowerCase().includes(searchQuery.toLowerCase()))
                  .filter(b => sizeFilter === 'all' || (b.items && b.items.some(i => i.size === Number(sizeFilter))))
                  .sort((a, b) => {
                     const dateA = a.bookingDate ? new Date(a.bookingDate).getTime() : 0;
                     const dateB = b.bookingDate ? new Date(b.bookingDate).getTime() : 0;
                     return dateB - dateA;
                  });

                return groupedBookings.length > 0 ? (
                  groupedBookings.map((booking) => (
                    <div key={`${booking.id}-mobile`} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm mb-3 last:mb-0">
                      <div className="flex justify-between items-start gap-2 mb-3">
                        <div>
                          <h4 className="font-bold text-gray-900 text-lg">{booking.name}</h4>
                          <div className="text-sm font-bold text-gray-600 mt-0.5">{booking.phone}</div>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-bold shadow-sm shrink-0 whitespace-nowrap ${
                            booking.status === 'Verified' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                          }`}
                        >
                          {booking.status === 'Verified' ? 'Verified ✓' : 'Pending'}
                        </span>
                      </div>
                      
                      <div className="text-sm text-gray-600 font-medium bg-gray-50 p-2.5 rounded-lg border border-gray-100 mb-3">
                        <span className="block text-[10px] font-bold text-gray-400 uppercase mb-0.5">{t('पत्ता', 'Address')}</span>
                        {booking.address}
                      </div>

                      <div className="border border-orange-100 rounded-lg overflow-hidden">
                        <div className="bg-orange-50 px-3 py-2 border-b border-orange-100 text-[10px] font-bold text-gray-500 uppercase flex justify-between">
                          <span>{t('आयटम्स', 'Items')} ({(booking.items || []).reduce((s,i) => s + i.quantity, 0)})</span>
                        </div>
                        <div className="divide-y divide-orange-50 bg-white">
                          {(booking.items || []).map((item, idx) => (
                            <div key={idx} className="px-3 py-2 flex justify-between items-center text-sm">
                              <div className="font-bold text-[#FF9933]">Size {item.size}</div>
                              <div className="text-gray-600 text-xs font-semibold">{item.sleeveType === 'Half' ? t('हाफ', 'Half') : t('फुल', 'Full')} Sleeve</div>
                              <div className="font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded text-xs">Qty {item.quantity}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-12 text-center flex flex-col items-center justify-center text-gray-400 bg-white rounded-xl">
                    <Shirt className="w-12 h-12 mb-4 opacity-20" />
                    <p className="font-bold text-lg text-gray-500">{t('कोणतेही बुकिंग आढळले नाही.', 'No bookings found.')}</p>
                  </div>
                );
              })()}
            </div>
          </div>
          
          <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
            <div className="text-xs sm:text-sm font-bold text-gray-400">
              {t('तकदीर मित्र मंडळ, सातपाटी', 'Taqdeer Mitra Mandal, Satpati')}
            </div>
            <div className="flex flex-col sm:flex-row text-xs sm:text-sm font-bold text-gray-900 bg-orange-50 px-4 py-3 rounded-xl gap-2 sm:gap-4 items-center">
              <span>{t('एकूण ऑर्डर्स:', 'Total Orders:')} <span className="text-[#FF9933] ml-1 text-sm sm:text-base">{bookings.length}</span></span>
              <span>{t('एकूण जर्सी:', 'Total Jerseys:')} <span className="text-[#FF9933] ml-1 text-sm sm:text-base">{flattenedBookings.reduce((sum, b) => sum + (b.quantity || 1), 0)}</span></span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
