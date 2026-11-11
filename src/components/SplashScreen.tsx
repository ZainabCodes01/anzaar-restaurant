import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UtensilsCrossed, Sparkles } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 500);
    }, 2200);

    return () => clearTimeout(timer);
  }, [onComplete]);

  const handleSkip = () => {
    setIsVisible(false);
    setTimeout(onComplete, 300);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          id="splash-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-stone-950 text-stone-100 overflow-hidden"
          style={{
            backgroundImage:
              'radial-gradient(circle at center, rgba(197, 160, 89, 0.15) 0%, rgba(18, 20, 23, 0.95) 70%, #0d0f12 100%)',
          }}
        >
          {/* Subtle decorative gold border frame */}
          <div className="absolute inset-6 border border-[#C5A059]/20 rounded-3xl pointer-events-none" />

          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="flex flex-col items-center text-center px-6"
          >
            {/* Crest Emblem */}
            <div className="relative mb-6 flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-b from-[#C5A059]/20 to-[#C5A059]/5 border border-[#C5A059]/40 shadow-2xl shadow-black">
              <UtensilsCrossed className="w-10 h-10 text-[#D4AF37]" />
              <div className="absolute -top-1 -right-1">
                <Sparkles className="w-4 h-4 text-[#C5A059] animate-pulse" />
              </div>
            </div>

            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-4xl md:text-5xl font-extrabold tracking-widest text-stone-100 font-serif uppercase"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              ANZAAR
            </motion.h1>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="h-0.5 w-32 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent my-3"
            />

            <motion.p
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.7 }}
              className="text-stone-300 text-sm md:text-base font-light tracking-wide italic"
            >
              Good Food. Great Moments.
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="mt-3 text-xs tracking-widest text-[#C5A059] uppercase font-semibold"
            >
              Daska, Pakistan
            </motion.p>
          </motion.div>

          <button
            id="btn-skip-splash"
            onClick={handleSkip}
            className="absolute bottom-10 text-xs tracking-widest text-stone-400 hover:text-[#C5A059] transition-colors py-2 px-4 border border-stone-800 hover:border-[#C5A059]/40 rounded-full"
          >
            SKIP
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
