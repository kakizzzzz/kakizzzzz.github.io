
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LayoutGrid, ArrowRight } from 'lucide-react';
import { ProjectCategory } from '../types';

interface NavigationProps {
  onNavigate: (view: 'journey' | 'console' | 'project' | 'contact', category?: ProjectCategory) => void;
  onOpenChange?: (isOpen: boolean) => void;
}

const Navigation: React.FC<NavigationProps> = ({ onNavigate, onOpenChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const drawerId = 'global-navigation-drawer';

  // Scroll Locking Effect
  useEffect(() => {
    onOpenChange?.(isOpen);

    if (isOpen) {
      // Stop Lenis-managed scrolling while drawer is open
      document.documentElement.classList.add('lenis-stopped');
    } else {
      document.documentElement.classList.remove('lenis-stopped');
    }

    return () => {
      document.documentElement.classList.remove('lenis-stopped');
    };
  }, [isOpen, onOpenChange]);

  useEffect(() => {
    return () => {
      onOpenChange?.(false);
    };
  }, [onOpenChange]);

  const toggleMenu = () => setIsOpen((prev) => !prev);

  const handleNav = (view: 'journey' | 'console' | 'contact') => {
    onNavigate(view);
    setIsOpen(false);
  };

  const handleModuleNav = (category: ProjectCategory) => {
    onNavigate('project', category);
    setIsOpen(false);
  };

  return (
    <>
      {/* Trigger Button - Always visible, higher z-index than drawer */}
      <motion.button
        className="fixed top-[calc(env(safe-area-inset-top)+1.5rem)] right-[calc(env(safe-area-inset-right)+2rem)] z-[60] w-12 h-12 flex items-center justify-center bg-black/50 backdrop-blur-md rounded-full border border-white/20 text-white hover:bg-white hover:text-black transition-colors"
        onClick={toggleMenu}
        aria-expanded={isOpen}
        aria-controls={drawerId}
        aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* 1. Backdrop (Click to close) */}
            <motion.div
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* 2. Sidebar Drawer */}
            <motion.div
              id={drawerId}
              role="dialog"
              aria-modal="true"
              className="fixed top-0 right-0 bottom-0 z-50 w-full md:w-[480px] bg-[#0f0f0f] border-l border-white/10 shadow-2xl overflow-y-auto touch-pan-y"
              data-lenis-prevent
              initial={{ x: "100%" }}
              animate={{ x: "0%" }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
            >
               {/* Wireframe BG inside drawer */}
               <div className="absolute inset-0 opacity-5 pointer-events-none">
                  <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <pattern id="nav-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="0.5"/>
                    </pattern>
                    <rect width="100%" height="100%" fill="url(#nav-grid)" />
                  </svg>
               </div>

               <div className="relative p-8 md:p-12 h-full flex flex-col">
                  
                  {/* Header */}
                  <div className="mb-12 pt-4 pr-12">
                    <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-2">Navigation System</div>
                    <div className="h-px w-full bg-white/10"></div>
                  </div>

                  {/* Main Links */}
                  <nav className="flex flex-col gap-6 mb-12">
                     <button
                        onClick={() => handleNav('journey')}
                        className="text-4xl font-serif text-white hover:text-[#3b82f6] text-left transition-colors flex items-center group"
                      >
                        <span className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 mr-2 text-sm">●</span>
                        Journey
                      </button>
                      
                      <button
                        onClick={() => handleNav('console')}
                        className="text-4xl font-serif text-white hover:text-[#3b82f6] text-left transition-colors flex items-center group"
                      >
                         <span className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 mr-2 text-sm">●</span>
                        Console
                      </button>

                      <button
                        onClick={() => handleNav('contact')}
                        className="text-4xl font-serif text-white hover:text-[#3b82f6] text-left transition-colors flex items-center group"
                      >
                         <span className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 mr-2 text-sm">●</span>
                        Contact
                      </button>
                  </nav>

                  {/* Vertical Modules Stack */}
                  <div className="mb-12">
                    <div className="flex items-center gap-2 mb-6 text-white/50 text-xs uppercase tracking-widest">
                      <LayoutGrid size={14} />
                      <span>Project Modules</span>
                    </div>

                    <div className="flex flex-col gap-3">
                       {[
                         { cat: ProjectCategory.GRAPHIC, label: "Pattern Design", id: "01" },
                         { cat: ProjectCategory.FULL_BRANDING, label: "Full Branding", id: "02" },
                         { cat: ProjectCategory.UI, label: "User Interface", id: "03" },
                         { cat: ProjectCategory.AMAZON, label: "Amazon Content", id: "04" },
                         { cat: ProjectCategory.ADDITIONAL, label: "Additional Works", id: "05" },
                       ].map((item) => (
                          <motion.button
                            key={item.cat}
                            onClick={() => handleModuleNav(item.cat)}
                            className="w-full group relative overflow-hidden p-4 border border-white/10 bg-white/5 hover:bg-white/10 transition-all rounded text-left flex items-center justify-between"
                            whileHover={{ scale: 1.01, x: 5 }}
                            whileTap={{ scale: 0.99 }}
                          >
                             <div className="flex flex-col">
                                <span className="text-[10px] text-white/30 font-mono mb-1">MOD_{item.id}</span>
                                <span className="text-white text-sm font-medium tracking-wide group-hover:text-[#3b82f6] transition-colors">
                                  {item.label}
                                </span>
                             </div>
                             <ArrowRight size={16} className="text-white/20 group-hover:text-white group-hover:translate-x-1 transition-all" />
                          </motion.button>
                       ))}
                    </div>
                  </div>
                  
                  <div className="mt-auto pb-4 pt-6 text-center md:pb-6">
                    <div className="text-[10px] font-mono tracking-[0.18em] text-white/20">
                      Console v2.0 // Kaki Design
                    </div>
                  </div>

               </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;
