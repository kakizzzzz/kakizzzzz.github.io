import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import clsx from 'clsx';
import { ProjectCategory } from '../types';

interface ConsoleRoomProps {
  onSelectCategory: (category: ProjectCategory) => void;
  interactionLocked?: boolean;
}

const CATEGORY_ITEMS: { cat: ProjectCategory; label: string; accent: string }[] = [
  { cat: ProjectCategory.GRAPHIC, label: 'PATTERN', accent: '#ef5f5f' },
  { cat: ProjectCategory.FULL_BRANDING, label: 'BRANDING', accent: '#1dc7bd' },
  { cat: ProjectCategory.UI, label: 'UI', accent: '#e9be50' },
  { cat: ProjectCategory.AMAZON, label: 'AMAZON', accent: '#4d8ef5' },
  { cat: ProjectCategory.ADDITIONAL, label: 'ADDITIONAL', accent: '#d891ff' },
];
const PRIMARY_TAPE_ITEMS = CATEGORY_ITEMS.slice(0, 4);
const EXTRA_TAPE_ITEM = CATEGORY_ITEMS[4];

const IDLE_LINES = ['DIGITAL ART SHOWCASE', 'READY FOR INPUT', 'SELECT A TAPE TO START'];

const TapeButton: React.FC<{
  label: string;
  accent: string;
  index: number;
  disabled: boolean;
  onClick: () => void;
}> = ({ label, accent, index, disabled, onClick }) => {
  const tilt = [0, -1.2, 1.2, 0][index] ?? 0;
  return (
      <motion.button
        type="button"
        disabled={disabled}
        onClick={onClick}
        className={clsx(
        'group relative h-[34px] w-[68px] touch-manipulation md:h-[38px] md:w-[92px] rounded-[7px] border border-[#425b85] bg-[#223455] shadow-[0_7px_12px_rgba(5,12,26,0.42)]',
        disabled ? 'opacity-45 cursor-default' : 'cursor-pointer'
      )}
      style={{ rotate: tilt }}
      initial={{ y: 18, opacity: 0 }}
      animate={{
        y: 0,
        opacity: 1,
        transition: { delay: 0.45 + index * 0.07, type: 'spring', stiffness: 160, damping: 16 },
      }}
      whileHover={disabled ? undefined : { y: -4, rotate: tilt * 0.5 }}
      whileTap={disabled ? undefined : { scale: 0.98 }}
    >
      <div className="absolute inset-[4px] rounded-[4px] border border-white/14 bg-[#2c4368]" />
      <div className="absolute left-[7px] top-[8px] h-[6px] w-[11px] rounded-[2px] md:left-[9px] md:top-[8px] md:h-[7px] md:w-[14px]" style={{ backgroundColor: accent }} />
      <div className="absolute inset-y-[9px] left-[23px] right-[7px] rounded-[2px] bg-[#f0f4fa] md:inset-y-[9px] md:left-[28px] md:right-[7px]" />
      <div className="absolute inset-x-[8px] bottom-[4px] h-[3px] rounded-[2px] bg-[#1a273c]/75" />
      <span className="absolute -bottom-[15px] left-1/2 min-w-[48px] -translate-x-1/2 whitespace-nowrap rounded-full border border-[#4d648a] bg-[#19283f]/95 px-[6px] py-[2px] text-center text-[8px] leading-none font-mono tracking-[0.05em] text-[#e6eefc] md:-bottom-[18px] md:min-w-0 md:px-[8px] md:py-[1px] md:text-[9px] md:tracking-[0.1em]">
        {label}
      </span>
    </motion.button>
  );
};

const SideShelf: React.FC<{ side: 'left' | 'right' }> = ({ side }) => {
  const isLeft = side === 'left';
  return (
    <div
      className={clsx(
        'absolute top-[22%] h-[58%] w-[236px] rounded-[10px] border border-[#3e557b] bg-[linear-gradient(180deg,#2b4163_0%,#233754_100%)] shadow-[inset_-8px_0_0_rgba(0,0,0,0.14)]',
        isLeft ? 'left-[-96px]' : 'right-[-96px]'
      )}
    >
      <div className="absolute inset-[14px]">
        {[0, 1, 2, 3].map((row) => (
          <div key={row} className="absolute left-0 right-0" style={{ top: `${6 + row * 24}%` }}>
            <div className="h-[6px] rounded bg-[#152741]" />
            <div className="mt-[5px] flex h-[34px] items-end gap-[4px] rounded-[2px] bg-[#2f4568] p-[3px]">
              {[0, 1, 2, 3, 4, 5, 6].map((book) => {
                const widths = [12, 14, 11, 13, 15, 10, 14];
                const shades = ['#cad5e8', '#435f8c', '#e9eff8', '#6a85ad', '#d7e2f4', '#2e476f', '#f3f7fd'];
                return (
                  <div
                    key={book}
                    className="rounded-[1px]"
                    style={{
                      width: widths[(book + row) % widths.length],
                      height: `${20 + ((book * 5 + row * 9) % 9)}px`,
                      backgroundColor: shades[(book + row) % shades.length],
                    }}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Projector = () => (
  <div
    className={clsx(
      'absolute z-30 left-[-1.5%] top-[2%] h-[52%] w-[160px] sm:left-[7%] sm:top-[1%] sm:h-[54%] sm:w-[170px] md:left-[10%] md:top-[-4%] md:h-[58%] md:w-[260px]',
    )}
  >
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="h-full w-full drop-shadow-[0_4px_6px_rgba(8,18,34,0.2)] md:drop-shadow-[0_8px_8px_rgba(8,18,34,0.28)]">
      <path d="M140 90 L190 60 L190 120 L140 90" fill="#f59e0b" opacity="0.14" />
      <circle cx="60" cy="60" r="25" fill="none" stroke="#224377" strokeWidth="4" />
      <circle cx="60" cy="60" r="8" fill="#f59e0b" />
      <path d="M60 35 L60 85 M35 60 L85 60" stroke="#224377" strokeWidth="2" />
      <circle cx="110" cy="60" r="25" fill="none" stroke="#224377" strokeWidth="4" />
      <circle cx="110" cy="60" r="8" fill="#f59e0b" />
      <path d="M110 35 L110 85 M85 60 L135 60" stroke="#224377" strokeWidth="2" />
      <rect x="40" y="80" width="90" height="60" rx="4" fill="#224377" />
      <path d="M130 80 L140 85 L140 95 L130 100 Z" fill="#f59e0b" />
      <rect x="50" y="140" width="70" height="10" fill="#f59e0b" />
      <path d="M60 140 L50 160 H120 L110 140" fill="#f59e0b" opacity="0.8" />
    </svg>
  </div>
);

const buildTypingTimeline = (lines: string[], baseDelay = 0.02) => {
  const text = lines.join('\n');
  const chars = text.split('');
  const firstWordLength = text.split(' ')[0]?.length ?? 0;
  const delayStart = baseDelay;
  const charDelay = 0.05;
  const firstWordPause = 0.5;
  const endHold = 0.5;
  let typedIndex = -1;
  let maxDelay = delayStart;

  const tokens = chars.map((char, index) => {
    if (char === '\n') {
      return { key: `break-${index}`, char, delay: maxDelay, isBreak: true };
    }

    typedIndex += 1;
    const delay = delayStart + typedIndex * charDelay + (typedIndex >= firstWordLength ? firstWordPause : 0);
    maxDelay = delay;

    return { key: `char-${index}-${char}`, char, delay, isBreak: false };
  });

  return { tokens, totalDuration: maxDelay + endHold };
};

const TextRevealBlock: React.FC<{ lines: string[]; className?: string; delay?: number; showCursor?: boolean }> = ({
  lines,
  className,
  delay = 0.02,
  showCursor = false,
}) => {
  const { tokens, totalDuration } = buildTypingTimeline(lines, delay);

  return (
    <motion.div className={clsx(className)} initial={{ opacity: 1 }} animate={{ opacity: 1 }} exit={{ opacity: 1 }}>
      {tokens.map((token) => {
        if (token.isBreak) {
          return <span key={token.key} className="block h-[2px] sm:h-[6px]" />;
        }

        return (
          <motion.span
            key={token.key}
            className="inline-block overflow-hidden align-bottom whitespace-pre"
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            transition={{ delay: token.delay, duration: 0, ease: 'linear' }}
          >
            {token.char}
          </motion.span>
        );
      })}

      {showCursor && (
        <motion.span
          className="ml-[2px] inline-block h-[1.05em] w-[1.5px] align-[-0.15em] bg-[#6780a7]"
          initial={{ opacity: 0 }}
          animate={{ opacity: [1, 0] }}
          transition={{
            delay: Math.max(0, totalDuration - 0.38),
            duration: 0.78,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      )}
    </motion.div>
  );
};

const getRevealDuration = (lines: string[], baseDelay = 0.02) => buildTypingTimeline(lines, baseDelay).totalDuration;

const ConsoleRoom: React.FC<ConsoleRoomProps> = ({ onSelectCategory, interactionLocked = false }) => {
  const [selected, setSelected] = useState<ProjectCategory | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [typingReady, setTypingReady] = useState(false);
  const [typingCycle, setTypingCycle] = useState(0);
  const selectedLabel = selected ? CATEGORY_ITEMS.find((item) => item.cat === selected)?.label ?? 'MODULE' : null;
  const screenStatus = interactionLocked ? 'LOCKED UNTIL 95% ZOOM' : isLoading ? 'LOADING PROJECT REEL' : 'READY FOR INPUT';

  useEffect(() => {
    if (interactionLocked || isLoading) {
      setTypingReady(false);
      return;
    }

    const startTimer = window.setTimeout(() => {
      setTypingReady(true);
      setTypingCycle((prev) => prev + 1);
    }, 420);

    return () => window.clearTimeout(startTimer);
  }, [interactionLocked, isLoading]);

  useEffect(() => {
    if (!typingReady || interactionLocked || isLoading) return;

    const cycleDurationMs = getRevealDuration(IDLE_LINES) * 1000;
    const loopTimer = window.setInterval(() => {
      setTypingCycle((prev) => prev + 1);
    }, cycleDurationMs);

    return () => window.clearInterval(loopTimer);
  }, [typingReady, interactionLocked, isLoading]);

  const handleSelect = (category: ProjectCategory) => {
    if (interactionLocked || selected) return;
    setSelected(category);
    setIsLoading(true);

    window.setTimeout(() => onSelectCategory(category), 120);
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#0c1930]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-12%,rgba(107,154,230,0.22),transparent_48%),linear-gradient(180deg,#152a4a_0%,#10213e_54%,#0b172c_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-[31%] bg-[linear-gradient(180deg,#0f1f39_0%,#0a1629_100%)]" />
      <div className="absolute inset-x-0 bottom-[31%] h-[2px] bg-[#2b3f63]" />

      <div className="absolute inset-0 translate-y-[calc(env(safe-area-inset-top)+8px)] sm:translate-y-0">
        <SideShelf side="left" />
        <SideShelf side="right" />

        <div className="absolute left-1/2 top-[8%] h-[45%] w-[min(76vw,1060px)] -translate-x-1/2">
          <div className="absolute inset-x-[2%] top-0 h-[24px] rounded-[6px] bg-[#4a5d7d] shadow-[0_8px_0_rgba(0,0,0,0.14)]" />
          <div className="absolute left-[5%] right-[5%] top-[20px] bottom-[8%] border-x-[8px] border-b-[8px] border-[#5f7394] bg-[#f7f9fc]" />
          <div className="absolute inset-x-[7%] top-[34px] bottom-[12%] rounded-[4px] border border-[#ced9ea] bg-[#f6f8fb]" />
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="screen-loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-x-[10%] top-[37%] space-y-3 pointer-events-none text-center text-[#5a6f91] sm:inset-x-[18%] sm:top-[40%] sm:space-y-4"
              >
                <TextRevealBlock
                  lines={['LOADING PORTFOLIO']}
                  delay={0.02}
                  className="font-serif font-semibold tracking-[0.03em] text-[clamp(9px,2.7vw,14px)] whitespace-nowrap sm:tracking-[0.14em]"
                />
                <TextRevealBlock
                  lines={[`MODULE: ${selectedLabel ?? 'INITIALIZING'}`]}
                  delay={0.12}
                  className="font-serif tracking-[0.02em] text-[clamp(8px,2.2vw,11px)] whitespace-nowrap sm:tracking-[0.1em]"
                />
                <div className="h-[4px] rounded-full bg-[#d9e2f0] overflow-hidden">
                  <motion.div
                    className="h-full bg-[#4d8ef5]"
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 0.6, ease: 'easeInOut' }}
                  />
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={`screen-idle-${screenStatus}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-x-[7%] top-[30.5%] pointer-events-none text-center text-[#5a6f91] sm:inset-x-[14%] sm:top-[36%]"
              >
                {typingReady && (
                  <div className="relative h-[clamp(64px,20vw,90px)] overflow-hidden">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={`typing-cycle-${typingCycle}`}
                        className="absolute inset-0"
                        initial={{ opacity: 1 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 1 }}
                        transition={{ duration: 0 }}
                      >
                        <TextRevealBlock
                          lines={IDLE_LINES}
                          delay={0.2}
                          className="font-serif tracking-[0.01em] leading-[1.18] text-[clamp(8px,3vw,16px)] sm:tracking-[0.08em] sm:leading-[1.5]"
                        />
                      </motion.div>
                    </AnimatePresence>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="absolute left-1/2 bottom-[8%] h-[34%] w-[min(82vw,1120px)] -translate-x-1/2">
          <div className="absolute inset-x-[6%] top-[68%] h-[22%] rounded-[10px] bg-black/24 blur-[6px] md:blur-[9px]" />

          <div className="absolute left-[4%] top-[54%] h-[40%] w-[3.5%] rounded-b-[4px] bg-[#7d6958] z-0" />
          <div className="absolute left-[14%] top-[54%] h-[38%] w-[3.2%] rounded-b-[4px] bg-[#654f42] z-0" />
          <div className="absolute right-[14%] top-[54%] h-[38%] w-[3.2%] rounded-b-[4px] bg-[#654f42] z-0" />
          <div className="absolute right-[4%] top-[54%] h-[40%] w-[3.5%] rounded-b-[4px] bg-[#7d6958] z-0" />

          <div className="absolute inset-x-0 top-[18%] h-[34%] rounded-[8px] border border-[#716252] bg-[linear-gradient(180deg,#8f7a66_0%,#7b6757_100%)] shadow-[0_8px_14px_rgba(37,31,26,0.34)] z-20" />
          <Projector />

          {interactionLocked && (
            <div className="absolute left-[40%] right-[5%] top-[10%] z-30 text-center md:left-[55%] md:right-[6%] md:top-[14%]">
              <span className="inline-block rounded-full border border-[#4d648a]/75 bg-[#19283f]/88 px-2 py-[2px] text-[8px] font-mono tracking-[0.09em] text-[#d7e4f7] md:text-[9px]">
                ZOOM TO 95% TO UNLOCK
              </span>
            </div>
          )}

          <div className="absolute left-[28%] right-[3%] top-[13.5%] z-30 md:hidden">
            <div className="grid grid-cols-2 justify-items-center gap-x-1.5 gap-y-3">
              {PRIMARY_TAPE_ITEMS.map((item, index) => (
                <div key={item.cat} className={index % 2 === 1 ? '-translate-x-[3.3rem]' : ''}>
                  <TapeButton
                    label={item.label}
                    accent={item.accent}
                    index={index}
                    disabled={selected !== null || interactionLocked}
                    onClick={() => handleSelect(item.cat)}
                  />
                </div>
              ))}
            </div>

            {EXTRA_TAPE_ITEM && (
              <div className="absolute right-[-6px] top-[57%]">
                <TapeButton
                  key={EXTRA_TAPE_ITEM.cat}
                  label={EXTRA_TAPE_ITEM.label}
                  accent={EXTRA_TAPE_ITEM.accent}
                  index={4}
                  disabled={selected !== null || interactionLocked}
                  onClick={() => handleSelect(EXTRA_TAPE_ITEM.cat)}
                />
              </div>
            )}
          </div>

          <div className="absolute hidden left-[55%] right-[6%] top-[22%] z-30 md:flex md:items-start md:justify-between lg:left-[46%] lg:right-[5%] lg:justify-start lg:gap-5 xl:left-[42%] xl:gap-7 2xl:left-[40%] 2xl:gap-8">
            {CATEGORY_ITEMS.map((item, index) => (
              <TapeButton
                key={item.cat}
                label={item.label}
                accent={item.accent}
                index={index}
                disabled={selected !== null || interactionLocked}
                onClick={() => handleSelect(item.cat)}
              />
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};

export default ConsoleRoom;
