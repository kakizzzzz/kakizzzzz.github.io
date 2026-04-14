
import React, { useEffect, useId, useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent, AnimatePresence, MotionValue, MotionStyle } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown } from "lucide-react";
import { ProjectCategory } from "../types";
import ConsoleRoom from "./ConsoleRoom";
import { asset } from "../imageAsset";
import { ImageWithFallback } from "./figma/ImageWithFallback";

gsap.registerPlugin(ScrollTrigger);

interface JourneyProps {
  onSelectCategory: (category: ProjectCategory) => void;
}

const toNumericMotionValue = (value: unknown) => {
  if (typeof value === "number") return value;
  if (typeof value === "string") return Number.parseFloat(value) || 0;
  return 0;
};

const getViewportHeight = () => {
  if (typeof window === "undefined") return 0;
  return Math.max(1, Math.round(window.visualViewport?.height ?? window.innerHeight));
};

// --- DRONE COMPONENT (Refactored) ---
const Drone = ({ 
    positionStyle, 
    rotate,
    className 
}: { 
    positionStyle?: MotionStyle; 
    rotate?: MotionValue<number>;
    className?: string 
}) => {
  const [messageIndex, setMessageIndex] = useState<number>(-1); // -1 means hidden
  const [isInteracting, setIsInteracting] = useState(false);
  const interactionTimeoutRef = useRef<number | null>(null);

  const messages = [
    "HELLO WORLD",
    "SYSTEM ONLINE",
    "FOLLOW ME",
    "RECORDING...",
    "NICE VIEW",
    "TARGET LOCKED"
  ];

  const handleClick = () => {
    if (isInteracting) return;
    
    setIsInteracting(true);
    // Pick a random message
    const nextIndex = Math.floor(Math.random() * messages.length);
    setMessageIndex(nextIndex);
    
    // Hide after 2 seconds
    if (interactionTimeoutRef.current) {
      window.clearTimeout(interactionTimeoutRef.current);
    }

    interactionTimeoutRef.current = window.setTimeout(() => {
      setMessageIndex(-1);
      setIsInteracting(false);
    }, 2000);
  };

  useEffect(() => {
    return () => {
      if (interactionTimeoutRef.current) {
        window.clearTimeout(interactionTimeoutRef.current);
      }
    };
  }, []);

  return (
    <motion.div 
      style={positionStyle} 
      className={`absolute z-30 cursor-pointer group flex flex-col items-center ${className}`}
      onClick={handleClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Speech Bubble / Hologram - INDEPENDENT OF ROTATION */}
      <div className="absolute bottom-[115%] left-1/2 -translate-x-1/2 z-40 w-[200px] flex justify-center pointer-events-none">
        <AnimatePresence mode="wait">
          {isInteracting && messageIndex !== -1 && (
            <motion.div
              key="active"
              initial={{ opacity: 0, y: 10, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="bg-black/90 backdrop-blur-md border border-[#3b82f6]/50 text-[#3b82f6] px-3 py-1.5 rounded-sm text-[10px] font-mono font-bold whitespace-nowrap shadow-[0_0_15px_rgba(59,130,246,0.6)] relative"
            >
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#3b82f6] rounded-full animate-ping"/>
                {messages[messageIndex]}
              </span>
              
              {/* Triangle pointer (Centered bottom) */}
              <div className="absolute -bottom-[5px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[5px] border-t-[#3b82f6]/50"></div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Drone Visual Wrapper - HANDLES BANKING ROTATION */}
      <motion.div 
        style={{ rotate }} 
        className="relative w-24 h-24 md:w-32 md:h-32"
      >
        {/* Front-View Drone SVG */}
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-2xl">
          
          {/* 1. Landing Gear (High-Tech Skids) */}
          <g transform="translate(0, 10)">
            {/* Left Skid */}
            <path d="M 25 68 L 45 68" stroke="#334155" strokeWidth="4" strokeLinecap="round" />
            <path d="M 35 68 L 40 55" stroke="#475569" strokeWidth="3" strokeLinecap="round" />
            
            {/* Right Skid */}
            <path d="M 55 68 L 75 68" stroke="#334155" strokeWidth="4" strokeLinecap="round" />
            <path d="M 65 68 L 60 55" stroke="#475569" strokeWidth="3" strokeLinecap="round" />
          </g>

          {/* 2. Arms (Reinforced) */}
          <path d="M 15 45 L 85 45" stroke="#1e293b" strokeWidth="6" strokeLinecap="round" />
          <path d="M 15 45 L 85 45" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
          
          {/* 3. Motors (Turbine style) */}
          <rect x="8" y="38" width="12" height="14" rx="2" fill="#475569" stroke="#1e293b" strokeWidth="1" />
          <rect x="80" y="38" width="12" height="14" rx="2" fill="#475569" stroke="#1e293b" strokeWidth="1" />

          {/* 4. Propellers (cleaner style to match the sky palette) */}
          <g className="origin-[14px_38px] animate-[spin_0.16s_linear_infinite]">
             <ellipse cx="14" cy="38" rx="15" ry="3" fill="#60a5fa" opacity="0.12" />
             <rect x="1" y="37.2" width="26" height="1.6" rx="0.8" fill="#e2e8f0" opacity="0.85" />
             <rect x="1" y="37.2" width="26" height="1.6" rx="0.8" fill="#bfdbfe" opacity="0.6" transform="rotate(90 14 38)" />
          </g>
          <circle cx="14" cy="38" r="2.4" fill="#60a5fa" stroke="#1e3a8a" strokeWidth="1" />

          <g className="origin-[86px_38px] animate-[spin_0.16s_linear_infinite_reverse]">
             <ellipse cx="86" cy="38" rx="15" ry="3" fill="#60a5fa" opacity="0.12" />
             <rect x="73" y="37.2" width="26" height="1.6" rx="0.8" fill="#e2e8f0" opacity="0.85" />
             <rect x="73" y="37.2" width="26" height="1.6" rx="0.8" fill="#bfdbfe" opacity="0.6" transform="rotate(90 86 38)" />
          </g>
          <circle cx="86" cy="38" r="2.4" fill="#60a5fa" stroke="#1e3a8a" strokeWidth="1" />

          {/* 5. Main Body (Sphere) */}
          <circle cx="50" cy="50" r="18" fill="#0f172a" />
          <circle cx="50" cy="50" r="18" stroke="#334155" strokeWidth="2" strokeOpacity="0.5" />
          
          {/* 6. Lens (Cyber Eye) */}
          <circle cx="50" cy="50" r="8" fill="#1d4ed8" stroke="#1e3a8a" strokeWidth="2" />
          <circle cx="50" cy="50" r="4" fill="#60a5fa" className="animate-pulse" />
          <circle cx="53" cy="47" r="2" fill="white" opacity="0.9" />

          {/* 7. Status Lights */}
          <circle cx="25" cy="45" r="1.5" fill={isInteracting ? "#ef4444" : "#10b981"} className="animate-ping" />
          <circle cx="75" cy="45" r="1.5" fill={isInteracting ? "#ef4444" : "#10b981"} className="animate-ping" style={{ animationDelay: "0.5s" }} />
          
        </svg>
        
        {/* Hover Glow */}
        <div className="absolute inset-0 bg-[#3b82f6]/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      </motion.div>
    </motion.div>
  );
};

// --- HOT AIR BALLOON COMPONENT ---
const HotAirBalloon = ({ className, color1 = "#fca5a5", color2 = "#fecaca", scale = 1, delay = 0 }: { className?: string, color1?: string, color2?: string, scale?: number, delay?: number }) => (
  <motion.div 
    className={`absolute pointer-events-none ${className}`}
    style={{ transform: `scale(${scale})` }}
    animate={{ y: [-8, 8, -8] }}
    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: delay }}
  >
     <svg width="60" height="80" viewBox="0 0 60 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-90 drop-shadow-lg">
        {/* Basket */}
        <rect x="22" y="60" width="16" height="12" rx="2" fill="#5D4037" />
        {/* Ropes */}
        <line x1="15" y1="45" x2="24" y2="60" stroke="#5D4037" strokeWidth="0.5" />
        <line x1="45" y1="45" x2="36" y2="60" stroke="#5D4037" strokeWidth="0.5" />
        
        {/* Balloon Body */}
        <path d="M 30 0 C 10 0 0 15 0 30 C 0 45 15 55 30 55 C 45 55 60 45 60 30 C 60 15 50 0 30 0 Z" fill={color1} />
        {/* Stripes */}
        <path d="M 30 0 C 35 0 40 15 40 30 C 40 45 35 55 30 55 C 25 55 20 45 20 30 C 20 15 25 0 30 0 Z" fill={color2} />
        <path d="M 30 0 C 31 0 32 15 32 30 C 32 45 31 55 30 55 C 29 55 28 45 28 30 C 28 15 29 0 30 0 Z" fill={color1} opacity="0.3" />
     </svg>
  </motion.div>
);

// Cloud Component
const Cloud: React.FC<{
  className?: string;
  delay?: number;
  duration?: number;
  scale?: number;
}> = ({ className, delay = 0, duration = 20, scale = 1 }) => {
  const baseId = useId().replace(/:/g, "");
  const maskId = `cloud-mask-${baseId}`;
  const fillId = `cloud-fill-${baseId}`;
  const shadeId = `cloud-shade-${baseId}`;

  return (
    <motion.div
      className={`absolute pointer-events-none ${className}`}
      initial={{ x: -36, y: 2 }}
      animate={{ x: [0, 72, 0], y: [2, -7, 2] }}
      transition={{
        duration,
        repeat: Infinity,
        repeatType: "loop",
        ease: "easeInOut",
        delay,
      }}
      style={{ scale }}
    >
      <svg
        width="300"
        height="150"
        viewBox="0 0 300 150"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id={`cloud-shadow-${baseId}`} x="22" y="108" width="236" height="36" filterUnits="userSpaceOnUse">
            <feGaussianBlur stdDeviation="4" />
          </filter>

          <mask id={maskId}>
            <rect width="300" height="150" fill="black" />
            <g fill="white">
              <circle cx="88" cy="78" r="38" />
              <circle cx="136" cy="62" r="50" />
              <circle cx="190" cy="80" r="42" />
              <circle cx="60" cy="90" r="28" />
              <rect x="44" y="82" width="178" height="52" rx="26" />
            </g>
          </mask>

          <linearGradient id={fillId} x1="150" y1="22" x2="150" y2="138" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="62%" stopColor="#f7faff" />
            <stop offset="100%" stopColor="#eef5ff" />
          </linearGradient>

          <linearGradient id={shadeId} x1="150" y1="38" x2="150" y2="134" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="72%" stopColor="#dfeeff" stopOpacity="0.34" />
            <stop offset="100%" stopColor="#cfe2f9" stopOpacity="0.45" />
          </linearGradient>
        </defs>

        <ellipse
          cx="140"
          cy="126"
          rx="86"
          ry="10"
          fill="#bdd0e6"
          opacity="0.18"
          filter={`url(#cloud-shadow-${baseId})`}
        />

        <g mask={`url(#${maskId})`}>
          <rect x="16" y="12" width="240" height="130" fill={`url(#${fillId})`} />
          <rect x="16" y="12" width="240" height="130" fill={`url(#${shadeId})`} opacity="0.38" />
          <ellipse cx="130" cy="54" rx="88" ry="24" fill="white" opacity="0.1" />
        </g>
      </svg>
    </motion.div>
  );
};

const Wind: React.FC<{
  className?: string;
  delay?: number;
  duration?: number;
  opacity?: number;
}> = ({ className, delay = 0, duration = 14, opacity = 0.35 }) => (
  <motion.div
    className={`absolute pointer-events-none ${className}`}
    initial={{ x: "-14vw", opacity: 0 }}
    animate={{ x: ["-14vw", "14vw"], opacity: [0, opacity, 0] }}
    transition={{
      duration,
      repeat: Infinity,
      ease: "easeInOut",
      delay,
    }}
  >
    <div className="w-[240px] h-[3px] rounded-full bg-gradient-to-r from-transparent via-white/50 to-transparent blur-[0.5px]" />
    <div className="mt-2 ml-8 w-[180px] h-[2px] rounded-full bg-gradient-to-r from-transparent via-[#dbeafe]/70 to-transparent" />
    <div className="mt-2 ml-20 w-[120px] h-[1.5px] rounded-full bg-gradient-to-r from-transparent via-[#e2e8f0]/75 to-transparent" />
  </motion.div>
);

// Stylized Geometric Tree
const Tree = ({ className, delay = 0, scale = 1 }: { className?: string; delay?: number; scale?: number }) => (
    <motion.div 
        className={`absolute bottom-0 flex flex-col items-center origin-bottom z-10 ${className}`}
        style={{ transform: `scale(${scale})` }}
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        transition={{ delay, duration: 0.8, type: "spring" }}
    >
        {/* Tree Top */}
        <div className="w-16 h-20 md:w-24 md:h-32 bg-[linear-gradient(160deg,#1aa14f_0%,#158a45_100%)] rounded-full" />
        {/* Trunk */}
        <div className="w-3 h-4 md:w-4 md:h-8 bg-[#4a3323] -mt-2 relative z-0 rounded-b-sm"></div>
        {/* Shadow */}
        <div className="w-12 h-[3px] bg-[#1a2438]/30 blur-[1.2px] rounded-full absolute bottom-0"></div>
    </motion.div>
);

const WoodenDoor = ({ openProgress }: { openProgress: MotionValue<number> }) => {
    const leftRotate = useTransform(openProgress, [0, 1], [0, -102]);
    const rightRotate = useTransform(openProgress, [0, 1], [0, 102]);
    const leftShift = useTransform(openProgress, [0, 1], [0, -5]);
    const rightShift = useTransform(openProgress, [0, 1], [0, 5]);
    const handleOpacity = useTransform(openProgress, [0, 0.86, 1], [1, 1, 0.3]);
    const interiorGlowOpacity = useTransform(openProgress, [0.45, 0.75, 1], [0, 0.4, 0.72]);
    const spark1Opacity = useTransform(openProgress, [0.58, 0.78, 1], [0, 0.28, 0.82]);
    const spark2Opacity = useTransform(openProgress, [0.66, 0.86, 1], [0, 0.22, 0.68]);
    const spark3Opacity = useTransform(openProgress, [0.74, 0.94, 1], [0, 0.16, 0.52]);

    return (
        <div className="absolute inset-0 overflow-hidden [perspective:1200px]">
            <div className="absolute inset-0 bg-[#02060d]" />
            <motion.div
                className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_20%,rgba(103,153,226,0.45)_0%,rgba(13,27,48,0.45)_30%,rgba(4,9,18,0)_72%)]"
                style={{ opacity: interiorGlowOpacity }}
            />
            <motion.div
                className="absolute left-1/2 top-[22%] -translate-x-1/2 w-[42%] h-[30%] rounded-full bg-[#a9d5ff]/55 blur-[16px]"
                style={{ opacity: interiorGlowOpacity }}
            />
            <motion.div className="absolute left-[44%] top-[34%] w-[3px] h-[3px] rounded-full bg-[#e6f3ff]" style={{ opacity: spark1Opacity }} />
            <motion.div className="absolute left-[60%] top-[42%] w-[2px] h-[2px] rounded-full bg-[#d8ecff]" style={{ opacity: spark2Opacity }} />
            <motion.div className="absolute left-[37%] top-[50%] w-[2px] h-[2px] rounded-full bg-[#dcefff]" style={{ opacity: spark3Opacity }} />

            <motion.div
                className="absolute inset-y-0 left-0 w-1/2 border-r border-[#253850] bg-[linear-gradient(180deg,#4a678f_0%,#3a5479_52%,#314967_100%)]"
                style={{ rotateY: leftRotate, x: leftShift, transformOrigin: "left center", transformStyle: "preserve-3d" }}
            >
                <div className="absolute inset-y-0 right-0 w-[10%] bg-[#2b415e]/28" />
                <motion.div
                    className="absolute right-[14%] top-1/2 -translate-y-1/2 w-[8px] h-[8px] rounded-full bg-[#c9a66b] shadow-[0_0_0_1px_rgba(24,34,52,0.45)]"
                    style={{ opacity: handleOpacity }}
                />
            </motion.div>

            <motion.div
                className="absolute inset-y-0 right-0 w-1/2 border-l border-[#253850] bg-[linear-gradient(180deg,#4a678f_0%,#3a5479_52%,#314967_100%)]"
                style={{ rotateY: rightRotate, x: rightShift, transformOrigin: "right center", transformStyle: "preserve-3d" }}
            >
                <div className="absolute inset-y-0 left-0 w-[10%] bg-[#2b415e]/28" />
                <motion.div
                    className="absolute left-[14%] top-1/2 -translate-y-1/2 w-[8px] h-[8px] rounded-full bg-[#c9a66b] shadow-[0_0_0_1px_rgba(24,34,52,0.45)]"
                    style={{ opacity: handleOpacity }}
                />
            </motion.div>
        </div>
    );
};

const ImageStoreScene = ({
    doorOpenProgress,
    viewportHeight,
}: {
    doorOpenProgress: MotionValue<number>;
    viewportHeight?: number;
}) => {
    const roadHeight = viewportHeight ? `${Math.round(viewportHeight * 0.18)}px` : undefined;
    const sidewalkHeight = viewportHeight ? `${Math.round(viewportHeight * 0.04)}px` : undefined;
    const sidewalkTop = viewportHeight ? `${Math.round(viewportHeight * -0.04)}px` : undefined;
    const treeLineBottom = viewportHeight ? `${Math.round(viewportHeight * 0.2)}px` : undefined;
    const houseMarginBottom = viewportHeight ? `${Math.round(viewportHeight * 0.2)}px` : undefined;
    const houseShadowBottom = viewportHeight ? `${Math.round(viewportHeight * 0.178)}px` : undefined;

    return (
        <div className="relative w-full h-full flex flex-col items-center justify-end">
            
            {/* --- ENVIRONMENT LAYER --- */}
            
            {/* 1. The Road (Full Width Horizontal) */}
            <div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[210vw] h-[18vh] bg-[#3f526d] border-t-[4px] border-[#aab8c9] z-0"
                style={{ height: roadHeight }}
            >
                {/* Road Markings */}
                <div className="absolute top-[56%] left-0 w-full h-0 border-t-[1.5px] border-dashed border-yellow-300/34"></div>
                
                {/* Sidewalk Area */}
                <div
                    className="absolute top-[-4vh] left-0 w-full h-[4vh] bg-[#e6edf5] border-b border-[#d4dde8]"
                    style={{ top: sidewalkTop, height: sidewalkHeight }}
                ></div>
            </div>

            {/* 2. Trees Background (On Sidewalk) */}
            <div
                className="absolute bottom-[20vh] left-1/2 -translate-x-1/2 w-[116vw] flex justify-between px-[4vw] pointer-events-none z-10"
                style={{ bottom: treeLineBottom }}
            >
                <Tree scale={0.9} delay={0.1} className="left-[10%]" />
                <Tree scale={1.04} delay={0.2} className="left-[28%] hidden md:flex" />
                <Tree scale={1.08} delay={0.3} className="right-[28%] hidden md:flex" />
                <Tree scale={0.85} delay={0.4} className="right-[10%]" />
            </div>

            {/* House Contact Shadow */}
            <div
                className="absolute bottom-[17.8vh] left-1/2 -translate-x-1/2 w-[360px] md:w-[480px] h-[18px] rounded-full bg-[#1b2c47]/22 blur-[8px] z-10"
                style={{ bottom: houseShadowBottom }}
            />

            {/* --- HOUSE LAYER --- */}
            {/* Centered on top of sidewalk */}
            <div
                className="relative z-20 mb-[20vh] w-[280px] h-[280px] md:w-[400px] md:h-[400px] origin-bottom"
                style={{ marginBottom: houseMarginBottom }}
            >
                 {/* Main Building Block */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[70%] bg-[linear-gradient(165deg,#f9fbfe_0%,#eef3fa_66%,#e7eef7_100%)] rounded-sm overflow-hidden border border-[#dbe3ef] shadow-[0_10px_22px_rgba(41,62,94,0.15)]">
                    <div className="absolute inset-y-0 right-0 w-[12%] bg-[#e6edf7]/45" />
                    <div className="absolute inset-x-0 bottom-0 h-[10%] bg-[#e3ebf5]/42" />
                    {/* Window Display */}
                    <div className="absolute top-4 left-4 right-4 h-[55%] bg-[#c7ddfa] border-[5px] border-white relative overflow-hidden group">
                        <div className="absolute inset-y-0 right-0 w-[24%] bg-[#b8d1f2]/42"></div>
                        {/* Books on sill */}
                        <div className="absolute bottom-[8px] left-1/2 -translate-x-1/2 flex gap-[6px] items-end opacity-85 group-hover:opacity-100 transition-opacity">
                             <div className="w-[10px] h-[24px] bg-[#f8fbff] rounded-[1px]" />
                             <div className="w-[12px] h-[30px] bg-[#eaf1fb] rounded-[1px]" />
                             <div className="w-[9px] h-[20px] bg-[#f8fbff] rounded-[1px]" />
                             <div className="w-[11px] h-[26px] bg-[#e8f0fa] rounded-[1px]" />
                        </div>
                        {/* Glass Reflection */}
                        <div className="absolute -top-10 -right-10 w-40 h-60 bg-white/24 rotate-45 pointer-events-none"></div>
                    </div>
                </div>

                {/* Entrance Area (Wood Door) */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[30%] h-[24%] bg-[#d5dfec] flex items-end justify-center overflow-hidden">
                    <WoodenDoor openProgress={doorOpenProgress} />
                </div>

                {/* Awning */}
                <div className="absolute bottom-[68%] left-1/2 -translate-x-1/2 w-[105%] h-[15%] z-30 flex shadow-[0_8px_12px_rgba(40,61,90,0.15)]">
                     {[...Array(7)].map((_, i) => (
                        <div key={i} className={`flex-1 ${i % 2 === 0 ? 'bg-[#ef4444]' : 'bg-white'} rounded-b-lg`}></div>
                    ))}
                </div>

                {/* Roof */}
                <div className="absolute bottom-[72%] left-1/2 -translate-x-1/2 w-[95%] h-[10%] bg-[#42556f] rounded-t-md shadow-[0_7px_10px_rgba(34,50,75,0.16)]"></div>
                <div className="absolute bottom-[68%] left-1/2 -translate-x-1/2 w-[95%] h-[4%] bg-[#334760] rounded-b-md"></div>

                {/* Signage */}
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-[80%] h-14 bg-[#0f172a] rounded-lg border-2 border-[#fbbf24] shadow-[0_5px_15px_rgba(0,0,0,0.3)] flex items-center justify-center z-40">
                    <span className="text-[#fbbf24] font-bold tracking-[0.2em] text-sm uppercase drop-shadow-[0_0_5px_rgba(251,191,36,0.5)] animate-pulse">
                        Image Store
                    </span>
                    {/* Neon Tube Effect */}
                    <div className="absolute inset-0 rounded-lg border border-[#fbbf24]/20 pointer-events-none"></div>
                </div>
            </div>

        </div>
    )
}

const Journey: React.FC<JourneyProps> = ({ onSelectCategory }) => {
  const profileImageSrc = asset('/assets/profile/kaki-avatar-2.jpg');
  const containerRef = useRef<HTMLDivElement>(null);
  const stageSnapTimeoutRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const touchLastYRef = useRef<number | null>(null);
  const [cardsUnlocked, setCardsUnlocked] = useState(false);
  const [viewportHeight, setViewportHeight] = useState(getViewportHeight);
  const [isMobileViewport, setIsMobileViewport] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < 768 : false,
  );
  
  // Scroll sequence: title -> bio -> house / console
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Background Parallax & Opacity (Clouds)
  const cloudYFront = useTransform(scrollYProgress, [0, 0.35, 0.7, 1], [0, -560, -1080, -1720]);
  const cloudYMid = useTransform(scrollYProgress, [0, 0.35, 0.7, 1], [0, -320, -740, -1140]);
  const cloudYBack = useTransform(scrollYProgress, [0, 0.35, 0.7, 1], [0, -160, -360, -600]);
  const cloudXFront = useTransform(scrollYProgress, [0, 1], [0, -180]);
  const cloudXMid = useTransform(scrollYProgress, [0, 1], [0, 110]);
  const cloudXBack = useTransform(scrollYProgress, [0, 1], [0, 70]);
  const cloudScaleFront = useTransform(scrollYProgress, [0, 1], [1, 1.35]);
  const cloudScaleMid = useTransform(scrollYProgress, [0, 1], [1, 1.18]);
  const cloudScaleBack = useTransform(scrollYProgress, [0, 1], [0.95, 1.08]);
  const windOpacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0.12, 0.4, 0.3, 0]);
  const windY = useTransform(scrollYProgress, [0, 1], [0, -260]);
  
  // --- Balloon Logic (Fixed within Viewport coordinates 0-100vh) ---
  const balloonsY = useTransform(scrollYProgress, [0, 1], [0, -100]); // Gentle parallax

  // 1. Removed Yellow Balloon (Top Right)
  
  // 2. Blue (Mid Left): Fades in for Bio section, then clears before the storefront
  const b2Opacity = useTransform(scrollYProgress, [0.16, 0.24, 0.42, 0.5], [0, 1, 1, 0]); 
  
  // 3. Red (Low Right): briefly joins the transition, then exits before the house dominates
  const b3Opacity = useTransform(scrollYProgress, [0.42, 0.5, 0.6, 0.7], [0, 0.78, 0.78, 0]);
  
  // 4. Teal (Far Distance): Subtle presence that fades earlier with the rest of the sky details
  const b4Opacity = useTransform(scrollYProgress, [0.08, 0.2, 0.46, 0.58], [0, 0.55, 0.55, 0]);
  const balloonLayerFade = useTransform(scrollYProgress, [0.44, 0.56, 0.66], [1, 0.58, 0]);

  const skyOpacity = useTransform(scrollYProgress, [0, 1], [1, 1]);
  const atmosphereFade = useTransform(scrollYProgress, [0.56, 0.8, 1], [1, 0.22, 0]);
  const atmosphereOpacity = useTransform([skyOpacity, atmosphereFade], ([sky, fade]) => {
    return toNumericMotionValue(sky) * toNumericMotionValue(fade);
  });
  const windLayerOpacity = useTransform([windOpacity, atmosphereOpacity], ([wind, atmosphere]) => {
    return toNumericMotionValue(wind) * toNumericMotionValue(atmosphere);
  });
  const balloonLayerOpacity = useTransform([atmosphereOpacity, balloonLayerFade], ([atmosphere, fade]) => {
    return toNumericMotionValue(atmosphere) * toNumericMotionValue(fade);
  });
  
  // --- Content Animation Ranges ---
  const titleY = useTransform(scrollYProgress, [0, 0.22], [0, -220]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.13], [1, 0]);
  const bioY = useTransform(scrollYProgress, [0.14, 0.49], [90, -72]);
  const bioOpacity = useTransform(scrollYProgress, [0.14, 0.2, 0.47, 0.53], [0, 1, 1, 0]);

  // Stage 3 timeline:
  // continuous descent -> continuous push to door (no static pause)
  const stage3OverlayOpacity = useTransform(scrollYProgress, [0.5, 0.6, 1], [0, 1, 1]);
  const stage3Progress = useTransform(scrollYProgress, [0.52, 1], [0, 1]);
  const zoomProgress = useTransform(stage3Progress, [0.22, 1], [0, 1]);

  const houseSceneScale = useTransform(stage3Progress, [0, 0.3, 0.62, 0.82, 1], [0.5, 1, 1.28, 1.72, 2.28]);
  const houseSceneY = useTransform(stage3Progress, [0, 0.16, 0.3, 0.62, 0.82, 1], [640, 260, 0, -8, -18, -30]);
  const houseOpacityStops = isMobileViewport ? [0, 0.95, 0.972, 0.99, 1] : [0, 0.88, 0.94, 0.98, 1];
  const houseOpacityValues = isMobileViewport ? [1, 1, 0.28, 0.04, 0] : [1, 1, 0.55, 0.12, 0];
  const houseSceneOpacity = useTransform(zoomProgress, houseOpacityStops, houseOpacityValues);
  const sceneDarkenOpacity = useTransform(
    zoomProgress,
    isMobileViewport ? [0.95, 0.974, 1] : [0.88, 0.95, 1],
    isMobileViewport ? [0, 0.18, 0.03] : [0, 0.08, 0.02],
  );
  const doorOpenProgress = useTransform(zoomProgress, (latest) => {
    const p = (latest - 0.5) / 0.3;
    return Math.max(0, Math.min(1, p));
  });
  const consoleRevealStart = isMobileViewport ? 0.958 : 0.9;
  const consoleRevealEnd = isMobileViewport ? 0.988 : 1;
  const consoleUnlockThreshold = isMobileViewport ? 0.984 : 0.95;
  const consoleRevealOpacity = useTransform(zoomProgress, (latest) => {
    const p = (latest - consoleRevealStart) / (consoleRevealEnd - consoleRevealStart);
    return Math.max(0, Math.min(1, p));
  });
  const consoleRevealScale = useTransform(
    zoomProgress,
    [consoleRevealStart, consoleRevealEnd],
    [isMobileViewport ? 1.03 : 1.06, 1],
  );
  const consoleRevealY = useTransform(
    zoomProgress,
    [consoleRevealStart, consoleRevealEnd],
    [isMobileViewport ? 14 : 22, 0],
  );
  const consoleRevealBlur = useTransform(
    zoomProgress,
    [consoleRevealStart, consoleRevealEnd],
    [isMobileViewport ? "2px" : "3px", "0px"],
  );

  useMotionValueEvent(zoomProgress, "change", (latest) => {
    setCardsUnlocked(latest >= consoleUnlockThreshold);
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    let rafId = 0;
    const visualViewport = window.visualViewport;

    const syncViewportHeight = () => {
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }

      rafId = window.requestAnimationFrame(() => {
        const nextHeight = getViewportHeight();
        const nextIsMobile = window.innerWidth < 768;
        setViewportHeight((currentHeight) =>
          Math.abs(currentHeight - nextHeight) > 1 ? nextHeight : currentHeight,
        );
        setIsMobileViewport((currentValue) =>
          currentValue !== nextIsMobile ? nextIsMobile : currentValue,
        );
      });
    };

    syncViewportHeight();
    window.addEventListener("resize", syncViewportHeight, { passive: true });
    window.addEventListener("orientationchange", syncViewportHeight);
    visualViewport?.addEventListener("resize", syncViewportHeight);
    visualViewport?.addEventListener("scroll", syncViewportHeight);

    return () => {
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
      window.removeEventListener("resize", syncViewportHeight);
      window.removeEventListener("orientationchange", syncViewportHeight);
      visualViewport?.removeEventListener("resize", syncViewportHeight);
      visualViewport?.removeEventListener("scroll", syncViewportHeight);
    };
  }, []);

  const stableViewportHeight = viewportHeight || getViewportHeight();
  const rootHeightStyle = stableViewportHeight
    ? { height: `${stableViewportHeight * 4}px` }
    : undefined;
  const stageHeightStyle = stableViewportHeight
    ? { height: `${stableViewportHeight}px` }
    : undefined;
  const stageTwoStyle = stableViewportHeight
    ? { top: `${stableViewportHeight}px`, height: `${stableViewportHeight}px` }
    : undefined;

  useEffect(() => {
    ScrollTrigger.refresh();
  }, [viewportHeight]);

  useEffect(() => {
    if (typeof window === "undefined" || !isMobileViewport || !stableViewportHeight) return;

    const clearSnapLock = () => {
      if (stageSnapTimeoutRef.current) {
        window.clearTimeout(stageSnapTimeoutRef.current);
        stageSnapTimeoutRef.current = null;
      }
    };

    const lockSnap = () => {
      clearSnapLock();
      stageSnapTimeoutRef.current = window.setTimeout(() => {
        stageSnapTimeoutRef.current = null;
      }, 320);
    };

    const resetTouchGesture = () => {
      touchStartYRef.current = null;
      touchLastYRef.current = null;
    };

    const handleTouchStart = (event: TouchEvent) => {
      const touchY = event.touches[0]?.clientY;
      if (typeof touchY !== "number") return;

      touchStartYRef.current = touchY;
      touchLastYRef.current = touchY;
    };

    const handleTouchMove = (event: TouchEvent) => {
      const touchY = event.touches[0]?.clientY;
      if (typeof touchY !== "number") return;

      touchLastYRef.current = touchY;
    };

    const snapToSecondStage = () => {
      if (stageSnapTimeoutRef.current) return;

      const currentScroll = window.scrollY || document.documentElement.scrollTop || 0;
      const swipeDistance =
        touchStartYRef.current !== null && touchLastYRef.current !== null
          ? touchLastYRef.current - touchStartYRef.current
          : 0;
      const isUpwardSwipe = swipeDistance <= -14;
      const firstStageLowerBound = stableViewportHeight * 0.8;
      const firstStageUpperBound = stableViewportHeight * 1.08;

      resetTouchGesture();

      if (!isUpwardSwipe) {
        return;
      }

      if (currentScroll < firstStageLowerBound || currentScroll > firstStageUpperBound) {
        return;
      }

      lockSnap();
      window.scrollTo({
        top: stableViewportHeight,
        left: 0,
        behavior: 'smooth',
      });
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", snapToSecondStage, { passive: true });
    window.addEventListener("touchcancel", resetTouchGesture, { passive: true });

    return () => {
      clearSnapLock();
      resetTouchGesture();
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", snapToSecondStage);
      window.removeEventListener("touchcancel", resetTouchGesture);
    };
  }, [isMobileViewport, stableViewportHeight]);

  return (
    <div ref={containerRef} className="relative h-[400vh] w-full" style={rootHeightStyle}>
      
      {/* --- FIXED BACKGROUND LAYER (Sky & Clouds & Balloons) --- */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
          {/* Gradient Sky: Rich Blue to White */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-b from-[#3b82f6] via-[#93c5fd] to-white"
            style={{ opacity: skyOpacity }}
          />

          {/* Top blue veil to keep the sky clean while lifting title contrast */}
          <motion.div
            className="absolute inset-x-0 top-0 h-[52vh] bg-gradient-to-b from-[#2563eb]/32 via-[#3b82f6]/14 to-transparent"
            style={{ opacity: skyOpacity }}
          />
          
          {/* Sun */}
          <motion.div 
            className="absolute top-[-5%] right-[-5%] w-[60vw] h-[60vw] bg-white/40 blur-[70px] md:blur-[100px] rounded-full mix-blend-overlay"
            style={{ opacity: skyOpacity }}
          />

          {/* Wind layer */}
          <motion.div className="absolute inset-0 w-full h-full" style={{ y: windY, opacity: windLayerOpacity }}>
            <Wind className="top-[8%] left-[10%]" duration={18} delay={0.3} opacity={0.22} />
            <Wind className="top-[15%] right-[8%]" duration={22} delay={1.4} opacity={0.2} />
            <Wind className="top-[24%] left-[35%]" duration={24} delay={2.1} opacity={0.16} />
          </motion.div>

          {/* --- CLOUD LAYERS --- */}
          {/* Back Clouds */}
          <motion.div className="absolute inset-0 w-full h-full" style={{ x: cloudXBack, y: cloudYBack, opacity: atmosphereOpacity, scale: cloudScaleBack }}>
             <Cloud className="top-[15%] left-[15%]" scale={0.72} duration={58} />
             <Cloud className="top-[30%] right-[20%]" scale={0.56} delay={5} duration={66} />
          </motion.div>

          {/* Mid Clouds */}
          <motion.div className="absolute inset-0 w-full h-full" style={{ x: cloudXMid, y: cloudYMid, opacity: atmosphereOpacity, scale: cloudScaleMid }}>
             <Cloud className="top-[8%] left-[5%]" scale={1.05} duration={46} />
             <Cloud className="top-[40%] right-[5%]" scale={0.92} delay={2} duration={52} />
             <Cloud className="bottom-[30%] left-[30%]" scale={0.82} delay={8} duration={49} />
          </motion.div>

           {/* Front Clouds */}
           <motion.div className="absolute inset-0 w-full h-full" style={{ x: cloudXFront, y: cloudYFront, opacity: atmosphereOpacity, scale: cloudScaleFront }}>
             <Cloud className="top-[25%] -right-[5%]" scale={1.52} delay={1} duration={36} />
             <Cloud className="bottom-[20%] -left-[5%]" scale={1.38} delay={3} duration={42} />
          </motion.div>
          
          {/* --- BALLOONS LAYER --- */}
          {/* Fixed Container coordinates must be within 0-100vh to be visible */}
          <motion.div className="absolute inset-0 w-full h-full" style={{ y: balloonsY, opacity: balloonLayerOpacity }}>
              
              {/* Balloon 2: Blue (Mid Left) */}
              <motion.div className="absolute top-[45vh] left-[5vw]" style={{ opacity: b2Opacity }}>
                  <HotAirBalloon scale={0.8} color1="#bae6fd" color2="#7dd3fc" delay={0} />
              </motion.div>

               {/* Balloon 4: Teal (Distant/Small) - Moved further right to balance without the yellow one */}
               <motion.div className="absolute top-[30vh] left-[60vw]" style={{ opacity: b4Opacity }}>
                  <HotAirBalloon scale={0.4} color1="#99f6e4" color2="#5eead4" delay={5} />
              </motion.div>

              {/* Balloon 3: Red (Low Right) */}
              <motion.div className="absolute top-[65vh] right-[20vw]" style={{ opacity: b3Opacity }}>
                  <HotAirBalloon scale={0.6} color1="#fca5a5" color2="#f87171" delay={3} />
              </motion.div>
          </motion.div>

      </div>

      {/* --- SCROLLABLE CONTENT STAGES --- */}
      
      {/* Stage 1: Title */}
      <div
        className="absolute top-0 left-0 w-full h-screen flex items-center justify-center z-10 pointer-events-none"
        style={stageHeightStyle}
      >
        <motion.div style={{ y: titleY, opacity: titleOpacity }} className="text-center px-4">
          <h1 className="text-[12vw] md:text-[14vw] font-serif font-bold text-[#f8fbff] tracking-tighter leading-none [-webkit-text-stroke:0.8px_#93c5fd] [paint-order:stroke_fill] [text-shadow:0_2px_10px_rgba(30,58,138,0.14)] select-none">
            PORTFOLIO
          </h1>
          <motion.div 
            className="flex flex-col items-center mt-12 gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
             <p className="text-white/95 font-bold uppercase text-xs tracking-[0.3em] mb-2 [text-shadow:0_2px_6px_rgba(15,23,42,0.45)]">Scroll Down</p>
             <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
             >
                 <ArrowDown size={24} className="text-white/95 [filter:drop-shadow(0_2px_6px_rgba(15,23,42,0.45))]" />
             </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Stage 2: Bio */}
      <div
        className="absolute top-[100vh] left-0 w-full h-screen flex items-center justify-center z-10 pointer-events-none"
        style={stageTwoStyle}
      >
         <motion.div 
            style={{ y: bioY, opacity: bioOpacity }} 
            className="max-w-5xl px-6 text-center translate-y-[1vh] md:translate-y-[2vh]"
         >
             <div className="relative inline-block mb-10">
                <div className="h-36 w-36 overflow-hidden rounded-full border-[4px] border-white shadow-xl mx-auto relative z-10 bg-white md:h-40 md:w-40">
                    <ImageWithFallback
                      src={profileImageSrc}
                      alt="Portrait"
                      className="h-full w-full object-cover object-[center_62%]"
                      loading="lazy"
                      decoding="async"
                      loadingEffect="none"
                    />
                </div>
             </div>
            
            <div className="mx-auto max-w-[560px] space-y-5">
                <div className="text-[10px] md:text-xs font-mono tracking-[0.12em] text-[#27486f]">
                    Welcome to explore my digital portfolio.
                </div>

                <div className="space-y-3">
                    <p className="mx-auto max-w-[500px] text-[2rem] md:text-[3rem] font-serif font-normal leading-[1.08] tracking-[-0.03em] text-[#14233d]">
                        <span className="block">Hello, I'm Wangxiao.</span>
                        <span className="block">
                            <span className="text-[#3b82f6]">Kaki</span>, a visual designer.
                        </span>
                    </p>
                </div>

                <div className="space-y-6">
                    <p className="mx-auto max-w-[530px] text-base md:text-[1.08rem] font-medium leading-[2.02] text-[#475569]">
                        I have extensive experience in commercial design and have been deeply involved in the visual
                        communication and detail page design of e-commerce platforms such as Amazon. I am not confined
                        to a single medium, but am passionate about finding a balance between 2D graphic design and 3D
                        modeling (Blender), and actively integrate the latest AI tools, dedicated to creating a
                        complete full-case design experience.
                    </p>

                    <p className="mx-auto max-w-[500px] text-sm md:text-[1rem] font-semibold leading-[1.95] text-[#334155]">
                        For me, design is not merely about visual beautification; it is a problem-solving process based
                        on a rigorous logical framework.
                    </p>
                </div>

                <motion.div
                    className="flex flex-col items-center gap-3 pt-3"
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 1.7, repeat: Infinity, ease: "easeInOut" }}
                >
                    <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.34em] text-white/88 [text-shadow:0_2px_8px_rgba(15,23,42,0.18)]">
                        Scroll Down
                    </p>
                    <ArrowDown size={28} className="text-white/90 [filter:drop-shadow(0_2px_8px_rgba(15,23,42,0.16))]" />
                </motion.div>
            </div>
         </motion.div>
      </div>
      {/* Stage 3: Door Zoom -> Console Reveal */}
      <motion.div
        className="fixed inset-0 z-40 overflow-hidden pointer-events-none"
        style={{ opacity: stage3OverlayOpacity }}
      >
        <motion.div
          style={{ scale: houseSceneScale, y: houseSceneY, opacity: houseSceneOpacity, transformOrigin: "50% 79%", willChange: "transform, opacity" }}
          className="w-full h-full relative"
        >
          <ImageStoreScene doorOpenProgress={doorOpenProgress} viewportHeight={stableViewportHeight} />
        </motion.div>

        <motion.div
          className="absolute inset-0 bg-black z-[55] pointer-events-none"
          style={{ opacity: sceneDarkenOpacity }}
        />

        <motion.div
          className="absolute inset-0 z-[60]"
          style={{
            opacity: consoleRevealOpacity,
            scale: consoleRevealScale,
            y: consoleRevealY,
            filter: consoleRevealBlur,
            pointerEvents: cardsUnlocked ? "auto" : "none",
          }}
        >
          <ConsoleRoom
            onSelectCategory={onSelectCategory}
            interactionLocked={!cardsUnlocked}
          />
        </motion.div>
      </motion.div>

    </div>
  );
};

export default Journey;
