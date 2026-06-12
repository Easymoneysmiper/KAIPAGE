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
  const hangarContainerRef = useRef(null);
  
  const [isHangarReady] = useState(true);
  const [activeNavIndex, setActiveNavIndex] = useState(0);
  const [isCanvasActive, setIsCanvasActive] = useState(true);

  const isScrollingRef = useRef(false);
  const currentPageStateRef = useRef(0);
  const lastDirectionRef = useRef(0);
  const lastTransitionTimeRef = useRef(0);
  const wheelEndTimeoutRef = useRef(null);

  // Initialize smooth scrolling
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

    return () => {
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
    };
  }, []);

  // GSAP Horizontal scroll timeline mapping vertical scroll depth to horizontal offset
  useGSAP(() => {
    const horizontalTween = gsap.timeline({
      scrollTrigger: {
        trigger: '.horizontal-scroll-container',
        pin: true,
        scrub: 0.15,
        start: 'top top',
        end: () => `+=${window.innerWidth * 4}`, // Total scroll distance is 4 viewports wide
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const progress = self.progress;

          // Fade out hangar canvas as soon as we slide past the Hero page (progress > 0.01)
          if (hangarContainerRef.current) {
            if (progress <= 0.01) {
              hangarContainerRef.current.style.opacity = '1';
              hangarContainerRef.current.style.visibility = 'visible';
            } else if (progress >= 0.11) {
              hangarContainerRef.current.style.opacity = '0';
              hangarContainerRef.current.style.visibility = 'hidden';
            } else {
              const ratio = (progress - 0.01) / 0.1;
              hangarContainerRef.current.style.opacity = String(1 - ratio);
              hangarContainerRef.current.style.visibility = 'visible';
            }
          }

          // Toggle Canvas rendering loop active state (only active when visible, i.e., progress < 0.11)
          const active = progress < 0.11;
          setIsCanvasActive((prev) => (prev !== active ? active : prev));

          // Calculate current page state index:
          // state 0: Hero Zoomed Out [0, 0.005)
          // state 1: Hero Zoomed In [0.005, 0.175)
          // state 2: Operator [0.175, 0.505)
          // state 3: World [0.505, 0.835)
          // state 4: Projects [0.835, 1.0]
          let stateIdx;
          if (progress < 0.005) {
            stateIdx = 0;
          } else if (progress < 0.175) {
            stateIdx = 1;
          } else if (progress < 0.505) {
            stateIdx = 2;
          } else if (progress < 0.835) {
            stateIdx = 3;
          } else {
            stateIdx = 4;
          }
          currentPageStateRef.current = stateIdx;

          // Map stateIdx to activeNavIndex (0, 1, 2, 3)
          let index = 0;
          if (stateIdx === 0 || stateIdx === 1) index = 0;
          else if (stateIdx === 2) index = 1;
          else if (stateIdx === 3) index = 2;
          else if (stateIdx === 4) index = 3;
          setActiveNavIndex(index);
        }
      }
    });

    // Set initial positions: stacked centered but fully clipped to the right with tilted polygons
    gsap.set('.operator-section', { clipPath: 'polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)', x: 0, opacity: 1 });
    gsap.set('.world-section', { clipPath: 'polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)', x: 0, opacity: 1 });
    gsap.set('.projects-section', { clipPath: 'polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)', x: 0, opacity: 1 });
    
    // Set initial positions for dual-swipe lines:
    gsap.set('#wipe-line-main', { x: '100vw', opacity: 0 });
    gsap.set('#wipe-line-accent', { x: '100vw', opacity: 0 });

    // Set initial layout states for page sub-elements (offset and transparent)
    gsap.set('.animate-profile-card', { x: -60, opacity: 0 });
    gsap.set('.animate-profile-artwork', { x: 60, opacity: 0 });
    
    gsap.set('.animate-world-left', { x: -60, opacity: 0 });
    gsap.set('.animate-world-right', { y: 60, opacity: 0 });
    gsap.set('.animate-world-index', { x: 40, opacity: 0 });
    
    gsap.set('.animate-project-left', { x: -60, opacity: 0 });
    gsap.set('.animate-project-right', { x: 60, opacity: 0 });

    // Phase 1: Camera zoom-in phase (Progress 0.0 to 0.01).
    horizontalTween.to({}, { duration: 0.03 });

    // Phase 2: Operator page covers Hero page
    horizontalTween.addLabel('operator')
                  .to(['#wipe-line-main', '#wipe-line-accent'], { opacity: 1, duration: 0.05 }, 'operator')
                  .to('.operator-section', { clipPath: 'polygon(-20% 0%, 100% 0%, 100% 100%, 0% 100%)', ease: 'none', duration: 0.99 }, 'operator')
                  .to('#wipe-line-main', { x: 0, ease: 'none', duration: 0.99 }, 'operator')
                  .to('#wipe-line-accent', { x: '-3vw', ease: 'none', duration: 0.99 }, 'operator')
                  .to('.hero-section', { opacity: 0, scale: 0.92, x: '-20vw', ease: 'none', duration: 0.99 }, 'operator')
                  .to(['#wipe-line-main', '#wipe-line-accent'], { opacity: 0, duration: 0.05 }, 'operator+=0.94')
                  // Slide-in child elements as Operator page enters
                  .to('.animate-profile-card', { x: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }, 'operator+=0.4')
                  .to('.animate-profile-artwork', { x: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }, 'operator+=0.4');

    // Phase 3: World page covers Operator page
    horizontalTween.addLabel('world', 'operator+=0.99')
                  .set('#wipe-line-main', { x: '100vw', opacity: 0 }, 'world')
                  .set('#wipe-line-accent', { x: '100vw', opacity: 0 }, 'world')
                  .to(['#wipe-line-main', '#wipe-line-accent'], { opacity: 1, duration: 0.05 }, 'world+=0.01')
                  .to('.world-section', { clipPath: 'polygon(-20% 0%, 100% 0%, 100% 100%, 0% 100%)', ease: 'none', duration: 0.99 }, 'world')
                  .to('#wipe-line-main', { x: 0, ease: 'none', duration: 0.99 }, 'world')
                  .to('#wipe-line-accent', { x: '-3vw', ease: 'none', duration: 0.99 }, 'world')
                  .to('.operator-section', { opacity: 0, scale: 0.92, x: '-20vw', ease: 'none', duration: 0.99 }, 'world')
                  .to(['#wipe-line-main', '#wipe-line-accent'], { opacity: 0, duration: 0.05 }, 'world+=0.94')
                  // Slide-in child elements as World page enters
                  .to('.animate-world-left', { x: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }, 'world+=0.4')
                  .to('.animate-world-right', { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }, 'world+=0.4')
                  .to('.animate-world-index', { x: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }, 'world+=0.4');

    // Phase 4: Projects page covers World page
    horizontalTween.addLabel('projects', 'world+=0.99')
                  .set('#wipe-line-main', { x: '100vw', opacity: 0 }, 'projects')
                  .set('#wipe-line-accent', { x: '100vw', opacity: 0 }, 'projects')
                  .to(['#wipe-line-main', '#wipe-line-accent'], { opacity: 1, duration: 0.05 }, 'projects+=0.01')
                  .to('.projects-section', { clipPath: 'polygon(-20% 0%, 100% 0%, 100% 100%, 0% 100%)', ease: 'none', duration: 0.99 }, 'projects')
                  .to('#wipe-line-main', { x: 0, ease: 'none', duration: 0.99 }, 'projects')
                  .to('#wipe-line-accent', { x: '-3vw', ease: 'none', duration: 0.99 }, 'projects')
                  .to('.world-section', { opacity: 0, scale: 0.92, x: '-20vw', ease: 'none', duration: 0.99 }, 'projects')
                  .to(['#wipe-line-main', '#wipe-line-accent'], { opacity: 0, duration: 0.05 }, 'projects+=0.94')
                  // Slide-in child elements as Projects page enters
                  .to('.animate-project-left', { x: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }, 'projects+=0.4')
                  .to('.animate-project-right', { x: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }, 'projects+=0.4');

  }, []);

  const handleStateChange = (stateIdx) => {
    if (lenisRef.current) {
      const H = window.innerWidth * 4;
      let targetProgress = 0;
      if (stateIdx === 0) targetProgress = 0.0;
      else if (stateIdx === 1) targetProgress = 0.01;
      else if (stateIdx === 2) targetProgress = 0.34; // End of zoom + centered Operator
      else if (stateIdx === 3) targetProgress = 0.67; // Centered World
      else if (stateIdx === 4) targetProgress = 1.0;  // Centered Projects
      
      // Map stateIdx to activeNavIndex
      let index = 0;
      if (stateIdx === 0 || stateIdx === 1) index = 0;
      else if (stateIdx === 2) index = 1;
      else if (stateIdx === 3) index = 2;
      else if (stateIdx === 4) index = 3;
      setActiveNavIndex(index);

      isScrollingRef.current = true;
      lastTransitionTimeRef.current = Date.now();
      lenisRef.current.scrollTo(targetProgress * H, { 
        duration: 0.85,
        easing: (t) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
      });
      
      clearTimeout(wheelEndTimeoutRef.current);
      wheelEndTimeoutRef.current = setTimeout(() => {
        isScrollingRef.current = false;
        lastDirectionRef.current = 0;
      }, 900);
    }
  };

  // Update navigation active index and scroll to corresponding vertical depth
  const handleNavChange = (index) => {
    let targetState = 0;
    if (index === 0) targetState = 0; // Go to zoomed out
    else if (index === 1) targetState = 2; // Go to Operator
    else if (index === 2) targetState = 3; // Go to World
    else if (index === 3) targetState = 4; // Go to Projects
    
    handleStateChange(targetState);
  };

  // Handle discrete mousewheel page-by-page transitions (filtering out continuous ticks)
  useEffect(() => {
    const isInsideScrollable = (element) => {
      let el = element;
      while (el && el !== document.body) {
        if (el.parentElement) {
          const style = window.getComputedStyle(el);
          const overflowY = style.overflowY;
          const isScrollable = overflowY === 'auto' || overflowY === 'scroll';
          if (isScrollable && el.scrollHeight > el.clientHeight) {
            return true;
          }
        }
        el = el.parentElement;
      }
      return false;
    };

    const handleWheel = (e) => {
      // Allow standard scrolling inside active list items or details modal
      if (isInsideScrollable(e.target)) {
        return;
      }

      e.preventDefault();
      e.stopPropagation();
      if (e.stopImmediatePropagation) {
        e.stopImmediatePropagation();
      }

      const delta = e.deltaY;
      if (Math.abs(delta) < 15) return; // filter minor noise

      const direction = delta > 0 ? 1 : -1;
      const dirChanged = lastDirectionRef.current !== 0 && direction !== lastDirectionRef.current;

      // 1. If currently in transition animation
      if (isScrollingRef.current) {
        if (!dirChanged) {
          // If scrolling in the same direction, extend the lock dynamically
          lastDirectionRef.current = direction;
          clearTimeout(wheelEndTimeoutRef.current);
          const timeSinceTransition = Date.now() - lastTransitionTimeRef.current;
          const extendDelay = Math.max(900 - timeSinceTransition, 300); // Minimum lock of 900ms, or 300ms since last event
          wheelEndTimeoutRef.current = setTimeout(() => {
            isScrollingRef.current = false;
            lastDirectionRef.current = 0;
          }, extendDelay);
        } else {
          // If direction changed, immediately trigger transition in the opposite direction
          isScrollingRef.current = false;
          lastDirectionRef.current = direction;
          
          const currentState = currentPageStateRef.current;
          let nextState = currentState;

          if (direction > 0) {
            if (currentState < 4) nextState = currentState + 1;
          } else {
            if (currentState > 0) nextState = currentState - 1;
          }

          if (nextState !== currentState) {
            handleStateChange(nextState);
          }
        }
        return;
      }

      // 2. If not scrolling, trigger the transition
      lastDirectionRef.current = direction;

      const currentState = currentPageStateRef.current;
      let nextState = currentState;

      if (delta > 0) {
        if (currentState < 4) nextState = currentState + 1;
      } else {
        if (currentState > 0) nextState = currentState - 1;
      }

      if (nextState !== currentState) {
        handleStateChange(nextState);
      }
    };

    const handleKeyDown = (e) => {
      const activeElement = document.activeElement;
      if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
        return;
      }

      const blockedKeys = ['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Space', ' ', 'Home', 'End'];
      if (blockedKeys.includes(e.key)) {
        e.preventDefault();
        
        if (isScrollingRef.current) return;

        const currentState = currentPageStateRef.current;
        let nextState = currentState;

        if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ' || e.key === 'Space') {
          if (currentState < 4) nextState = currentState + 1;
        } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
          if (currentState > 0) nextState = currentState - 1;
        } else if (e.key === 'Home') {
          nextState = 0;
        } else if (e.key === 'End') {
          nextState = 4;
        }

        if (nextState !== currentState) {
          handleStateChange(nextState);
        }
      }
    };

    // Use capture: true for wheel to execute BEFORE Lenis's bubbling wheel listener
    window.addEventListener('wheel', handleWheel, { passive: false, capture: true });
    window.addEventListener('keydown', handleKeyDown, { passive: false });
    
    return () => {
      window.removeEventListener('wheel', handleWheel, { capture: true });
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(wheelEndTimeoutRef.current);
    };
  }, []);

  // Tactical Hero Canvas background network particles (mouse gravity)
  useEffect(() => {
    // Only run particle loop when Hero page is active (index 0) to save CPU
    if (activeNavIndex !== 0) return;

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
  }, [activeNavIndex]);

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
      <div 
        ref={hangarContainerRef}
        className="fixed inset-0 w-full h-full z-0 pointer-events-none transition-opacity duration-300"
      >
        <ServerHangarCanvas isReady={isHangarReady} isActive={isCanvasActive} />
      </div>

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

      {/* Main Pages Container (Stacked Absolute Layout) */}
      <div className="horizontal-scroll-container relative z-10 w-full h-screen overflow-hidden">
        
        {/* Wipe dividing line boundary - Dual Accent Lines */}
        {/* Main Cyan Glowing Line */}
        <div 
          id="wipe-line-main"
          className="absolute top-0 bottom-0 w-[4px] bg-ark-cyan shadow-[0_0_25px_rgba(0,240,255,0.85),_0_0_10px_#00f0ff] z-[99] pointer-events-none"
          style={{ transform: 'translateX(100vw) skewX(-18deg)', transformOrigin: 'bottom left', opacity: 0 }}
        />
        {/* Secondary Green Accent Line */}
        <div 
          id="wipe-line-accent"
          className="absolute top-0 bottom-0 w-[1.5px] bg-ark-green shadow-[0_0_15px_rgba(166,246,38,0.85)] z-[99] pointer-events-none"
          style={{ transform: 'translateX(100vw) skewX(-18deg)', transformOrigin: 'bottom left', opacity: 0 }}
        />
        
        {/* ==================== 1. HERO INDEX PAGE ==================== */}
        <section id="hero" className="hero-section absolute inset-0 w-full h-screen overflow-y-auto flex flex-col justify-start pt-36 pb-16 px-6 md:px-12 z-10">
          
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
        <section id="operator" className="operator-section absolute inset-0 w-full h-screen overflow-y-auto z-20 bg-[#0A0A0C]">
          <OperatorProfile />
        </section>

        {/* ==================== 3. WORLD BLOG/SHARING PAGE ==================== */}
        <section id="world" className="world-section absolute inset-0 w-full h-screen overflow-y-auto z-30 bg-[#0A0A0C]">
          <OriginiumSharing isActive={activeNavIndex === 2} />
        </section>

        {/* ==================== 4. PROJECTS WORKSPACE PAGE ==================== */}
        <section id="projects" className="projects-section absolute inset-0 w-full h-screen overflow-y-auto z-40 bg-[#0A0A0C]">
          <ProjectDesk />
        </section>

      </div>
    </div>
  );
}