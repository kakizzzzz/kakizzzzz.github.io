import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PreloaderProps {
  onComplete: () => void;
}

const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const timeoutIdsRef = useRef<number[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          const completeTimeout = window.setTimeout(() => {
            setIsComplete(true);
            const onCompleteTimeout = window.setTimeout(onComplete, 800);
            timeoutIdsRef.current.push(onCompleteTimeout);
          }, 500);
          timeoutIdsRef.current.push(completeTimeout);
          return 100;
        }
        // Slightly random increment for organic feel
        const increment = Math.random() * 10 + 2;
        return Math.min(prev + increment, 100);
      });
    }, 100);

    return () => {
      clearInterval(interval);
      timeoutIdsRef.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
      timeoutIdsRef.current = [];
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black"
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="w-full max-w-md px-8">
            <div className="flex justify-between items-end mb-4">
                <motion.div
                  className="text-6xl md:text-8xl font-serif text-white font-bold tracking-tighter leading-none"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  KAKI
                </motion.div>
                <motion.div 
                    className="text-4xl font-mono text-white/50"
                    key={Math.floor(progress)}
                >
                    {Math.floor(progress)}%
                </motion.div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-[2px] bg-white/10 rounded-full overflow-hidden relative">
              <motion.div
                className="absolute top-0 left-0 h-full bg-white"
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ ease: "linear", duration: 0.1 }}
              />
            </div>

            <motion.div
              className="mt-4 flex justify-between text-xs font-mono text-white/40 uppercase tracking-widest"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <span>Design Console</span>
              <span>v2.0.24</span>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Preloader;
