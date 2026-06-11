import { useState, useEffect } from 'react';

export default function HudHeader({ activeIndex, onActiveIndexChange, navItems }) {
  const [timeStr, setTimeStr] = useState('');
  const [soundMuted, setSoundMuted] = useState(false);

  // Simple clock display matching HUD telemetry
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const format = (num) => String(num).padStart(2, '0');
      setTimeStr(`${format(now.getHours())}:${format(now.getMinutes())}:${format(now.getSeconds())}`);
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-[9999] h-16 border-b border-white/5 bg-[#0A0A0C]/80 backdrop-blur-md px-6 md:px-12 flex items-center justify-between font-mono select-none">
      {/* HUD Background Scanline effect inside header */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,240,255,0.02)_0,transparent_100%)] pointer-events-none" />
      
      {/* Left: Brand logo & Status */}
      <div className="flex items-center gap-6 z-10">
        <div className="flex items-center gap-2">
          {/* Tactical crosshair element */}
          <div className="relative w-5 h-5 flex items-center justify-center border border-white/20 rounded-sm">
            <span className="absolute w-2 h-[1px] bg-ark-cyan" />
            <span className="absolute h-2 w-[1px] bg-ark-cyan" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-wider text-white hover:text-ark-cyan transition-colors duration-300 cursor-pointer">
              PENGKAI.DEV
            </span>
            <span className="text-[9px] text-neutral-500 tracking-widest uppercase -mt-0.5">
              SYS.VER.2026.06
            </span>
          </div>
        </div>
        
        {/* Status block */}
        <div className="hidden lg:flex items-center gap-2.5 px-3 py-1 border-l border-r border-white/10 text-[10px] text-ark-cyan bg-ark-cyan/5">
          <span className="w-1.5 h-1.5 rounded-full bg-ark-cyan animate-pulse" />
          <span className="tracking-widest uppercase">RHODES_ARCH_SECURE</span>
        </div>
      </div>

      {/* Center: Navigation tabs */}
      <nav className="flex items-center h-full z-10">
        {navItems.map((item, idx) => {
          const isActive = idx === activeIndex;
          const displayLabel = item.label.split(' ').slice(1).join(' '); // Extract the name (e.g. "HOME" from "01 HOME")
          const indexPrefix = item.label.split(' ')[0]; // Extract the number (e.g. "01")
          
          return (
            <button
              key={item.href}
              onClick={() => onActiveIndexChange(idx)}
              className={`relative h-16 px-6 md:px-8 flex flex-col justify-center items-center group cursor-pointer transition-all duration-300`}
            >
              {/* Active neon highlight bar at top */}
              <div 
                className={`absolute top-0 left-0 right-0 h-[2px] transition-all duration-300 ${
                  isActive ? 'bg-ark-cyan opacity-100 shadow-[0_0_10px_#00f0ff]' : 'bg-transparent opacity-0 group-hover:bg-white/20 group-hover:opacity-100'
                }`}
              />

              <div className="flex flex-col items-center">
                <span className={`text-[9px] font-mono tracking-wider transition-colors duration-300 ${
                  isActive ? 'text-ark-cyan' : 'text-neutral-500 group-hover:text-neutral-400'
                }`}>
                  {indexPrefix}
                </span>
                <span className={`text-xs md:text-sm font-bold tracking-widest uppercase transition-all duration-300 ${
                  isActive ? 'text-white scale-105 glow-cyan' : 'text-neutral-400 group-hover:text-white'
                }`}>
                  {displayLabel}
                </span>
              </div>

              {/* Active corner accent indicator */}
              {isActive && (
                <>
                  <span className="absolute bottom-1 left-2 w-1.5 h-1.5 border-b border-l border-ark-cyan" />
                  <span className="absolute bottom-1 right-2 w-1.5 h-1.5 border-b border-r border-ark-cyan" />
                </>
              )}
            </button>
          );
        })}
      </nav>

      {/* Right: Clock & Audio Telemetry */}
      <div className="flex items-center gap-6 z-10 text-[11px] font-mono text-neutral-400">
        {/* Coordinate details */}
        <div className="hidden md:flex flex-col items-end text-[9px] leading-tight text-neutral-500 tracking-wider">
          <span>LAT: 39.9042° N</span>
          <span>LNG: 116.4074° E</span>
        </div>

        {/* Digital System Clock */}
        <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-sm">
          <span className="text-ark-cyan font-bold tracking-widest">{timeStr || '00:00:00'}</span>
        </div>

        {/* Sound Toggle */}
        <button 
          onClick={() => setSoundMuted(!soundMuted)}
          className="p-2 border border-white/10 hover:border-ark-cyan/40 hover:text-ark-cyan transition-colors duration-300 rounded-sm cursor-pointer"
          aria-label="Toggle mute"
        >
          {soundMuted ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
          )}
        </button>
      </div>
    </header>
  );
}
