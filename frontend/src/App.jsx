import { useState, useEffect, useRef } from 'react';
import HudHeader from './HudHeader';
import ServerHangarCanvas from './ServerHangarCanvas';
import OperatorProfile from './OperatorProfile';
import OriginiumSharing from './OriginiumSharing';
import ProjectDesk from './ProjectDesk';

// Text animations for Hero
import SplitText from './SplitText';
import RotatingText from './RotatingText';
import ElectricBorder from './ElectricBorder';
import TextType from './TextType';

import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const navItems = [
  { label: "01 INDEX", href: "#hero" },
  { label: "02 OPERATOR", href: "#operator" },
  { label: "03 WORLD", href: "#world" },
  { label: "04 PROJECTS", href: "#projects" },
];

export default function App() {
  const scrollBarRef = useRef(null);
  const canvasRef = useRef(null);
  const lenisRef = useRef(null);
  
  const [isHangarReady] = useState(true);
  const [activeNavIndex, setActiveNavIndex] = useState(0);

  // Initialize smooth scrolling and active index scroll sync
  useEffect(() => {

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: false,
    });
    lenisRef.current = lenis;

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // Sync active nav index based on vertical scroll triggers
    const triggers = navItems.map((item, index) => {
      return ScrollTrigger.create({
        trigger: item.href,
        start: 'top 50%',
        end: 'bottom 50%',
        onEnter: () => setActiveNavIndex(index),
        onEnterBack: () => setActiveNavIndex(index),
      });
    });

    return () => {
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
      triggers.forEach(t => t.kill());
    };
  }, []);

  // Update navigation active index and scroll to section smoothly
  const handleNavChange = (index) => {
    setActiveNavIndex(index);
    const targetItem = navItems[index];
    const element = document.querySelector(targetItem.href);
    if (element && lenisRef.current) {
      lenisRef.current.scrollTo(element, { duration: 1.3 });
    }
  };

  // Tactical Hero Canvas background network particles (mouse gravity)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const particles = [];
    const count = 40;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 1.2 + 0.8,
      });
    }

    let mouse = { x: -1000, y: -1000 };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      
      particles.forEach((p, index) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        const dxMouse = mouse.x - p.x;
        const dyMouse = mouse.y - p.y;
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
        if (distMouse < 140) {
          p.x += dxMouse * 0.008;
          p.y += dyMouse * 0.008;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = distMouse < 140 ? 'rgba(0, 240, 255, 0.6)' : 'rgba(255, 255, 255, 0.15)';
        ctx.fill();

        for (let j = index + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(0, 240, 255, ${0.1 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Update scrolling progress bar at top
  useEffect(() => {
    const handleScrollProgress = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        const progress = (window.pageYOffset / totalScroll) * 100;
        if (scrollBarRef.current) {
          scrollBarRef.current.style.width = `${progress}%`;
        }
      }
    };
    window.addEventListener('scroll', handleScrollProgress, { passive: true });
    return () => window.removeEventListener('scroll', handleScrollProgress);
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-white selection:bg-[#00f0ff] selection:text-black relative font-sans overflow-x-hidden ark-scanline">
      
      {/* 3D Server Hangar Background */}
      <ServerHangarCanvas isReady={isHangarReady} />

      {/* Top scroll progress indicator */}
      <div className="fixed top-0 left-0 right-0 h-[2px] bg-white/5 z-[99999]">
        <div 
          ref={scrollBarRef}
          className="h-full bg-ark-cyan shadow-[0_0_8px_#00f0ff] transition-all duration-100" 
          style={{ width: '0%' }}
        />
      </div>

      {/* Tactical HUD Header */}
      <HudHeader 
        activeIndex={activeNavIndex} 
        onActiveIndexChange={handleNavChange} 
        navItems={navItems} 
      />

      {/* Main Pages Container */}
      <div className="relative z-10">
        
        {/* ==================== 1. HERO INDEX PAGE ==================== */}
        <section id="hero" className="relative h-screen flex flex-col justify-start pt-36 overflow-hidden pb-16 px-6 md:px-12 border-b border-white/5">
          
          {/* Tactical grid background overlay */}
          <div className="absolute inset-0 pointer-events-none z-20 grid grid-cols-1 md:grid-cols-12 max-w-[1700px] mx-auto w-full">
            <div className="col-span-3 border-r border-white/5 h-full"></div>
            <div className="col-span-6 border-r border-white/5 h-full"></div>
            <div className="col-span-3 h-full"></div>
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0C]/80 via-transparent to-transparent pointer-events-none z-25" />

          {/* Interactive particles Canvas */}
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover z-30 opacity-60 pointer-events-auto" />

          {/* Coder Title and Slogans */}
          <div className="relative w-full flex-1 max-w-[1700px] mx-auto z-40 flex flex-col">
            
            <div className="max-w-4xl space-y-6 mt-12">
              <h1 className="font-display text-2xl sm:text-3xl md:text-[3.6rem] lg:text-[4.0rem] font-black leading-[0.95] tracking-tighter text-white uppercase drop-shadow-xl flex flex-col items-start gap-2">
                <SplitText
                  text="Here’s Digital Field of"
                  className="font-display text-2xl sm:text-3xl md:text-[3.6rem] lg:text-[4.0rem] font-black leading-[0.95] tracking-tighter text-white uppercase block"
                  delay={100}
                  duration={1.5}
                  ease="power4.out"
                  splitType="chars"
                  textAlign="left"
                  tag="span"
                />
                <SplitText
                  text="KAI"
                  className="font-display text-3xl sm:text-4xl md:text-[4.5rem] lg:text-[5.0rem] font-black leading-[0.95] tracking-tighter text-ark-cyan uppercase block glow-cyan"
                  delay={250}
                  duration={1.5}
                  ease="power4.out"
                  splitType="chars"
                  textAlign="left"
                  tag="span"
                />
                <div className="flex flex-wrap md:flex-nowrap items-baseline gap-x-3 md:gap-x-5 whitespace-nowrap">
                  <SplitText
                    text="For Sharing"
                    className="font-display text-2xl sm:text-3xl md:text-[3.6rem] lg:text-[4.0rem] font-black leading-[0.95] tracking-tighter text-white uppercase block"
                    delay={100}
                    duration={1.5}
                    ease="power4.out"
                    splitType="chars"
                    textAlign="left"
                    tag="span"
                  />
                  <RotatingText
                    texts={['coding', 'life', 'feeling', 'thinking']}
                    mainClassName="font-display text-2xl sm:text-3xl md:text-[3.6rem] lg:text-[4.0rem] font-black text-ark-cyan uppercase inline-flex overflow-hidden pb-1 glow-cyan"
                    staggerFrom="first"
                    initial={{ y: "100%", opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: "-120%", opacity: 0 }}
                    staggerDuration={0.025}
                    splitBy="characters"
                    transition={{ type: "spring", damping: 30, stiffness: 400 }}
                    rotationInterval={2000}
                    auto={true}
                    loop={true}
                  />
                </div>
              </h1>
            </div>

            {/* Tactical border typing banner at bottom */}
            <div className="mt-auto">
              <div className="inline-block relative">
                <ElectricBorder
                  color="#00f0ff"
                  speed={2}
                  chaos={0.008}
                  borderRadius={4}
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-3 px-5 py-3 font-mono text-xs md:text-sm tracking-wider text-white bg-black/60 backdrop-blur-sm border border-white/5 rounded-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-ark-green animate-pulse flex-shrink-0"></span>
                    <TextType 
                      text={['吉林大学 2027 届 软件工程本科在读', 'CORE_STACK: JAVA / SPRING BOOT', 'MIDDLEWARE: REDIS / KAFKA / MYSQL', 'ENGINEERING: AI VIBE CODING SPECIALIST']}
                      typingSpeed={60}
                      pauseDuration={1600}
                      showCursor={true}
                      cursorCharacter="_"
                      variableSpeed={{ min: 60, max: 120 }}
                      cursorBlinkDuration={0.5}
                    />
                  </div>
                </ElectricBorder>
              </div>
            </div>

          </div>
        </section>

        {/* ==================== 2. OPERATOR BIO PAGE ==================== */}
        <div id="operator">
          <OperatorProfile />
        </div>

        {/* ==================== 3. WORLD BLOG/SHARING PAGE ==================== */}
        <div id="world">
          <OriginiumSharing />
        </div>

        {/* ==================== 4. PROJECTS WORKSPACE PAGE ==================== */}
        <div id="projects">
          <ProjectDesk />
        </div>

      </div>
    </div>
  );
}