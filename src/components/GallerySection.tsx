import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { GalleryItem } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { Image as ImageIcon, Maximize2, X, ChevronLeft, ChevronRight, Share2 } from 'lucide-react';

interface GallerySectionProps {
  galleryItems: GalleryItem[];
}

export const GallerySection: React.FC<GallerySectionProps> = ({ galleryItems }) => {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const categories = [
    { id: 'all', mr: 'सर्व फोटो', en: 'All Photos' },
    { id: 'idol', mr: 'श्रींची मूर्ती', en: 'Ganesh Idol' },
    { id: 'decoration', mr: 'पारंपारिक देखावा', en: 'Decoration' },
    { id: 'aarti', mr: 'महाआरती', en: 'Aarti' },
    { id: 'cultural', mr: 'सांस्कृतिक कार्यक्रम', en: 'Cultural Programs' },
    { id: 'social', mr: 'सामाजिक उपक्रम', en: 'Social Activities' },
    { id: 'visarjan', mr: 'विसर्जन सोहळा', en: 'Visarjan' },
    { id: 'memories', mr: 'जुन्या आठवणी', en: 'Old Memories' },
    { id: 'instagram', mr: 'इन्स्टाग्राम', en: 'Instagram' },
  ];

  const filteredItems = galleryItems.filter(item => {
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  });

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const prevLightbox = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + filteredItems.length) % filteredItems.length);
    }
  };

  const nextLightbox = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % filteredItems.length);
    }
  };

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    show: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } }
  };

  return (
    <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center max-w-3xl mx-auto space-y-4"
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF8F5] border border-[#C89B3C]/30 text-xs font-semibold text-gray-800 shadow-2xs">
          <ImageIcon className="w-3.5 h-3.5 text-[#FF9933]" />
          <span className="font-marathi">{t('चित्रमय स्मरणिका', 'Photo Gallery')}</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111111] font-marathi tracking-tight">
          {t('फोटो गॅलरी व छायाचित्रे', 'Festival Photo Gallery')}
        </h2>

        <p className="text-base text-gray-600 leading-relaxed font-marathi">
          {t(
            'गणेशोत्सव, आरती, सांस्कृतिक सोहळे, सामाजिक उपक्रम आणि जुन्या आठवणींचा संग्रह.',
            'Preserving festive memories: Ganesha idols, decorations, daily Aarti, cultural nights, and old archives.'
          )}
        </p>
      </motion.div>

      {/* Category Tabs */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="flex items-center justify-start md:justify-center gap-2 overflow-x-auto pb-2 scrollbar-none"
      >
        {categories.map((cat) => (
          <motion.button
            key={cat.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 font-marathi relative overflow-hidden ${
              selectedCategory === cat.id
                ? 'text-white shadow-xs'
                : 'bg-[#FAF8F5] text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {selectedCategory === cat.id && (
              <motion.div 
                layoutId="activeTabIndicator"
                className="absolute inset-0 bg-[#FF9933] z-0"
                initial={false}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            <span className="relative z-10">{t(cat.mr, cat.en)}</span>
          </motion.button>
        ))}
      </motion.div>

      {/* Gallery Grid */}
      <motion.div layout className="min-h-[400px]">
        <AnimatePresence mode="popLayout">
          {filteredItems.length === 0 ? (
            <motion.div 
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-16 text-gray-500 font-marathi"
            >
              {t('या वर्गवारीत कोणतेही फोटो उपलब्ध नाहीत.', 'No photos available in this category.')}
            </motion.div>
          ) : (
            <motion.div 
              key="grid"
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
            >
              {filteredItems.map((item, idx) => (
                <motion.div
                  layout
                  variants={itemVariants}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                  key={item.id}
                  onClick={() => openLightbox(idx)}
                  className="group relative rounded-2xl overflow-hidden bg-[#FAF8F5] border border-gray-200 shadow-2xs cursor-pointer hover:shadow-2xl transition-shadow"
                >
                  <div className="aspect-4/3 overflow-hidden relative">
                    {item.category === 'instagram' || item.imageUrl?.includes('instagram.com') ? (
                      <iframe 
                        src={`${item.imageUrl.split('?')[0].replace(/\/$/, '')}/embed`}
                        className="w-full h-full object-cover border-none pointer-events-none"
                        scrolling="no"
                        allowTransparency={true}
                        allow="encrypted-media"
                      />
                    ) : (
                      <motion.img
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                        src={item.imageUrl}
                        alt={item.titleEn}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                    )}

                    {/* Hover overlay with zoom icon */}
                    {item.category !== 'instagram' && (
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-white pointer-events-none">
                        <motion.div 
                          initial={{ scale: 0 }}
                          whileHover={{ scale: 1.2 }}
                          className="p-3 rounded-full bg-white/20 backdrop-blur-md"
                        >
                          <Maximize2 className="w-5 h-5 text-white" />
                        </motion.div>
                      </div>
                    )}

                    {/* Year tag */}
                    <div className="absolute top-3 right-3">
                      <span className="px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md text-white text-[10px] font-bold">
                        {item.year}
                      </span>
                    </div>
                  </div>

                  {/* Caption */}
                  <div className="p-4 bg-white border-t border-gray-100 relative z-10">
                    <h3 className="text-sm font-bold text-gray-900 font-marathi truncate group-hover:text-[#FF9933] transition-colors">
                      {t(item.titleMr, item.titleEn)}
                    </h3>
                    {item.descriptionMr && (
                      <p className="text-xs text-gray-500 font-marathi truncate mt-0.5">
                        {t(item.descriptionMr, item.descriptionEn || item.descriptionMr)}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* LIGHTBOX MODAL */}
      <AnimatePresence>
        {lightboxIndex !== null && filteredItems[lightboxIndex] && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-lg flex items-center justify-center p-4 sm:p-8"
          >
            
            {/* Close Button */}
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={closeLightbox}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-50 cursor-pointer"
              title="Close"
              id="lightbox-close-btn"
            >
              <X className="w-6 h-6" />
            </motion.button>

            {/* Prev Button */}
            <motion.button
              whileHover={{ scale: 1.1, x: -5 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => { e.stopPropagation(); prevLightbox(); }}
              className="absolute left-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-50 cursor-pointer"
              title="Previous"
              id="lightbox-prev-btn"
            >
              <ChevronLeft className="w-6 h-6" />
            </motion.button>

            {/* Next Button */}
            <motion.button
              whileHover={{ scale: 1.1, x: 5 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => { e.stopPropagation(); nextLightbox(); }}
              className="absolute right-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-50 cursor-pointer"
              title="Next"
              id="lightbox-next-btn"
            >
              <ChevronRight className="w-6 h-6" />
            </motion.button>

            {/* Lightbox Main Image & Details Container */}
            <motion.div 
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.9, x: 50 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9, x: -50 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="max-w-4xl w-full space-y-4 text-center"
            >
              <div className="max-h-[75vh] overflow-hidden rounded-2xl flex items-center justify-center">
                {filteredItems[lightboxIndex].category === 'instagram' || filteredItems[lightboxIndex].imageUrl?.includes('instagram.com') ? (
                  <iframe
                    src={`${filteredItems[lightboxIndex].imageUrl.split('?')[0].replace(/\/$/, '')}/embed?autoplay=1`}
                    className="max-h-[75vh] w-full max-w-[400px] h-[75vh] border-none rounded-2xl bg-white"
                    scrolling="no"
                    allowTransparency={true}
                    allow="encrypted-media"
                  />
                ) : (
                  <img
                    src={filteredItems[lightboxIndex].imageUrl}
                    alt="Enlarged gallery view"
                    className="max-h-[75vh] max-w-full object-contain rounded-2xl shadow-2xl"
                    referrerPolicy="no-referrer"
                  />
                )}
              </div>

              <div className="text-white space-y-1 font-marathi max-w-2xl mx-auto">
                <span className="text-xs font-bold text-[#FF9933]">
                  {filteredItems[lightboxIndex].year} • {t(filteredItems[lightboxIndex].titleMr, filteredItems[lightboxIndex].titleEn)}
                </span>
                <p className="text-xs text-gray-300">
                  {t(
                    filteredItems[lightboxIndex].descriptionMr || '',
                    filteredItems[lightboxIndex].descriptionEn || ''
                  )}
                </p>
              </div>
            </motion.div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
