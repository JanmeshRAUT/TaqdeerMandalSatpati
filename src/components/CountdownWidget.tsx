import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Sparkles, Calendar, Heart } from 'lucide-react';

export const CountdownWidget: React.FC = () => {
  const { t } = useLanguage();

  // Target Date for Shree Ganesh Chaturthi 2026 (September 14, 2026)
  const targetDate = new Date('2026-09-14T00:00:00').getTime();

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="bg-[#FAF8F5] border border-[#C89B3C]/30 rounded-3xl p-6 sm:p-8 shadow-sm max-w-5xl mx-auto my-8 font-marathi relative overflow-hidden">
      {/* Decorative Subtle Background Aura */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#FF9933]/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-[#C89B3C]/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">

        {/* Left Title Box */}
        <div className="text-center md:text-left space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#C89B3C]/30 text-xs font-bold text-[#FF9933] shadow-2xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t('श्री गणेशोत्सव २०२६ आगमन', 'Shree Ganeshotsav 2026 Arrival')}</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight">
            {t('गणेश चतुर्थी काउंटडाउन', 'Ganesh Chaturthi down')}
          </h3>

          <p className="text-xs sm:text-sm text-gray-600 flex items-center justify-center md:justify-start gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#C89B3C]" />
            <span>{t('१४ सप्टेंबर २०२६ • बाप्पाच्या आगमनाचे दिवस!', 'September 14, 2026 • Days Left for Bappa!')}</span>
          </p>
        </div>

        {/* Right Timer Units Grid */}
        <div className="grid grid-cols-4 gap-3 sm:gap-4 w-full md:w-auto">

          {/* Days */}
          <div className="bg-white border border-gray-200/90 rounded-2xl p-3 sm:p-4 text-center shadow-2xs min-w-[70px] sm:min-w-[85px]">
            <div className="text-2xl sm:text-4xl font-extrabold text-[#111111] font-mono leading-none">
              {String(timeLeft.days).padStart(2, '0')}
            </div>
            <div className="text-[10px] sm:text-xs font-bold text-[#FF9933] uppercase tracking-wider mt-1.5 font-marathi">
              {t('दिवस', 'Days')}
            </div>
          </div>

          {/* Hours */}
          <div className="bg-white border border-gray-200/90 rounded-2xl p-3 sm:p-4 text-center shadow-2xs min-w-[70px] sm:min-w-[85px]">
            <div className="text-2xl sm:text-4xl font-extrabold text-[#111111] font-mono leading-none">
              {String(timeLeft.hours).padStart(2, '0')}
            </div>
            <div className="text-[10px] sm:text-xs font-bold text-[#FF9933] uppercase tracking-wider mt-1.5 font-marathi">
              {t('तास', 'Hours')}
            </div>
          </div>

          {/* Minutes */}
          <div className="bg-white border border-gray-200/90 rounded-2xl p-3 sm:p-4 text-center shadow-2xs min-w-[70px] sm:min-w-[85px]">
            <div className="text-2xl sm:text-4xl font-extrabold text-[#111111] font-mono leading-none">
              {String(timeLeft.minutes).padStart(2, '0')}
            </div>
            <div className="text-[10px] sm:text-xs font-bold text-[#FF9933] uppercase tracking-wider mt-1.5 font-marathi">
              {t('मिनिटे', 'Mins')}
            </div>
          </div>

          {/* Seconds */}
          <div className="bg-white border border-gray-200/90 rounded-2xl p-3 sm:p-4 text-center shadow-2xs min-w-[70px] sm:min-w-[85px]">
            <div className="text-2xl sm:text-4xl font-extrabold text-[#C89B3C] font-mono leading-none animate-pulse">
              {String(timeLeft.seconds).padStart(2, '0')}
            </div>
            <div className="text-[10px] sm:text-xs font-bold text-[#C89B3C] uppercase tracking-wider mt-1.5 font-marathi">
              {t('सेकंद', 'Secs')}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
