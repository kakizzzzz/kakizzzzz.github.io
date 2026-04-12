import React, { useEffect, useState } from 'react';
import { motion, Variants } from 'framer-motion';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';

interface ContactProps {
  onBack: () => void;
}

const Contact: React.FC<ContactProps> = ({ onBack }) => {
  const emailAddress = 'wangxiao010207@gmail.com';
  const xiaohongshuUrl =
    'https://www.xiaohongshu.com/user/profile/615919ee00000000020206bb?xsec_token=YBKsftN-66eyIEt4Np03D6470qJFy84I9F9ZiwxzuoHBQ=&xsec_source=app_share&xhsshare=CopyLink&shareRedId=ODc3OTQ-SU42NzUyOTgwNjY1OTk0O0hL&apptime=1773757631&share_id=b06497c2925847ca92deea919f1edd9a';
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, []);

  useEffect(() => {
    if (copyStatus !== 'copied') return;

    const timeoutId = window.setTimeout(() => {
      setCopyStatus('idle');
    }, 1800);

    return () => window.clearTimeout(timeoutId);
  }, [copyStatus]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  const handleCopyEmail = async () => {
    if (typeof window === 'undefined') return;

    try {
      await navigator.clipboard.writeText(emailAddress);
      setCopyStatus('copied');
    } catch {
      const tempInput = document.createElement('textarea');
      tempInput.value = emailAddress;
      tempInput.style.position = 'fixed';
      tempInput.style.opacity = '0';
      document.body.appendChild(tempInput);
      tempInput.focus();
      tempInput.select();
      document.execCommand('copy');
      document.body.removeChild(tempInput);
      setCopyStatus('copied');
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-black px-6 pb-[calc(env(safe-area-inset-bottom)+6rem)] pt-[calc(env(safe-area-inset-top)+12rem)] text-white md:px-16 md:pb-16 md:pt-16">
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-[#3b82f6]/10 blur-[120px] rounded-full pointer-events-none" />
      
      {/* Back Button */}
      <button 
        onClick={onBack}
        aria-label="Return"
        title="Return"
        className="fixed z-40 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white backdrop-blur-md transition-colors hover:bg-white hover:text-black"
        style={{
          top: 'calc(env(safe-area-inset-top) + 5.25rem)',
          left: 'calc(env(safe-area-inset-left) + 1.5rem)',
        }}
      >
        <ArrowLeft size={16} />
      </button>

      {/* Main Content */}
      <div className="relative z-10 flex flex-1 items-start justify-center pt-4 md:items-center md:pt-0">
        <motion.div 
          className="mx-auto grid w-full max-w-6xl grid-cols-1 items-start gap-14 md:grid-cols-[minmax(0,27rem)_minmax(0,30rem)] md:items-center md:justify-center md:gap-20"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Left: Heading */}
          <div className="w-full max-w-[27rem] justify-self-center space-y-6 pl-[4.75rem] md:space-y-8 md:pl-0">
            <motion.h1 
              variants={itemVariants}
              className="text-[clamp(3.25rem,14vw,4.75rem)] font-serif font-light leading-[0.92] tracking-tight md:text-8xl md:leading-none"
            >
              Let's<br/>
              <span className="text-[#3b82f6]">Connect.</span>
            </motion.h1>
            <motion.p 
              variants={itemVariants}
              className="max-w-[17rem] text-base font-light leading-relaxed text-white/60 md:max-w-sm md:text-xl"
            >
              Always interested in discussing new projects, creative collaborations, or just sharing design stories.
            </motion.p>
          </div>

          {/* Right: Links */}
          <div className="w-full max-w-[30rem] justify-self-center space-y-10 md:space-y-12">
             <motion.div variants={itemVariants} className="space-y-2">
                <h3 className="text-xs font-mono uppercase tracking-widest text-white/40 mb-4">Email</h3>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="block w-full break-all border-b border-white/10 pb-4 text-left text-2xl transition-colors hover:border-[#3b82f6] hover:text-[#3b82f6] md:text-4xl"
                  aria-label="Copy email address"
                  title="Copy email address"
                >
                  {emailAddress}
                </button>
                <p className="pt-2 text-xs font-mono uppercase tracking-[0.22em] text-white/35">
                  {copyStatus === 'copied' ? 'Copied to clipboard' : 'Click to copy'}
                </p>
             </motion.div>

             <motion.div variants={itemVariants} className="space-y-2">
                <h3 className="text-xs font-mono uppercase tracking-widest text-white/40 mb-4">Xiaohongshu</h3>
                <a
                  href={xiaohongshuUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex w-full items-center justify-between border-b border-white/10 pb-4 text-left text-xl transition-colors hover:border-[#3b82f6] hover:text-[#3b82f6] md:text-3xl"
                >
                  <span>@Kaki</span>
                  <ArrowUpRight size={18} />
                </a>
                <p className="pt-2 text-xs font-mono uppercase tracking-[0.22em] text-white/35">
                  Open profile in a new tab
                </p>
             </motion.div>

             <motion.div variants={itemVariants} className="pt-4">
                <div className="inline-block px-4 py-2 bg-[#111] rounded border border-white/10">
                   <span className="w-2 h-2 bg-green-500 rounded-full inline-block mr-2 animate-pulse"></span>
                   <span className="text-xs text-white/70">Available for freelance</span>
                </div>
             </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.div 
        variants={itemVariants}
        className="relative z-10 pt-12 text-center text-xs font-mono text-white/20 md:text-left"
      >
        Kaki Design Console © {new Date().getFullYear()}
      </motion.div>

    </div>
  );
};

export default Contact;
