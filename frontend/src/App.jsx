import React, { useState, useEffect, useRef } from 'react';
import GooeyNav from './GooeyNav';
import ElectricBorder from './ElectricBorder';
import SplitText from './SplitText';
import RotatingText from './RotatingText';
import ProfileCard from './ProfileCard';
import TextType from './TextType';
import CircularGallery from './CircularGallery';
import GlassIcons from './GlassIcons';
import ShinyText from './ShinyText';
import Shuffle from './Shuffle';
import ServerHangarCanvas from './ServerHangarCanvas';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

// ==================== Lanyard Card texture helpers removed ====================


// ==================== 极简高质感 SVG 图标组件 ====================
const CodeIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
  </svg>
);

const CpuIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
  </svg>
);

const DatabaseIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
  </svg>
);

const SparklesIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);



const navItems = [
  { label: "01 HOME", href: "#hero" },
  { label: "02 BIO & LIFE", href: "#experience" },
  { label: "03 CORE SKILLS", href: "#competencies" },
];

const filterIcons = [
  {
    value: 'all',
    label: '全部',
    color: 'blue',
    customClass: 'animate-filter-btn',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <rect x="3" y="3" width="7" height="7" rx="1"></rect>
        <rect x="14" y="3" width="7" height="7" rx="1"></rect>
        <rect x="14" y="14" width="7" height="7" rx="1"></rect>
        <rect x="3" y="14" width="7" height="7" rx="1"></rect>
      </svg>
    )
  },
  {
    value: 'life_style',
    label: '生活',
    color: 'orange',
    customClass: 'animate-filter-btn',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
        <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
        <line x1="6" y1="1" x2="6" y2="4"></line>
        <line x1="10" y1="1" x2="10" y2="4"></line>
        <line x1="14" y1="1" x2="14" y2="4"></line>
      </svg>
    )
  },
  {
    value: 'tech',
    label: '思考',
    color: 'purple',
    customClass: 'animate-filter-btn',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A5 5 0 0 0 8 8c0 1 .3 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"></path>
        <path d="M9 18h6"></path>
        <path d="M10 22h4"></path>
      </svg>
    )
  }
];

export default function App() {
  // 1. 滚动进度 (使用 ref + 直接 DOM 操作避免 re-render)
  const scrollProgressRef = useRef(0);
  const scrollBarRef = useRef(null);
  const [isHangarReady, setIsHangarReady] = useState(false);
  const [activeNavIndex, setActiveNavIndex] = useState(0);
  const isScrollingToSection = useRef(false);
  const scrollTimeoutRef = useRef(null);
  const [activeTab, setActiveTab] = useState('all');

  const experienceRef = useRef(null);

  useGSAP(() => {
    if (!experienceRef.current) return;

    // Define initial states (to prevent flash of unstyled/unanimated content, we can set them in GSAP immediately)
    gsap.set('.animate-profile-card', { x: -200, opacity: 0 });
    gsap.set('.animate-bio-title', { y: -80, opacity: 0 });
    gsap.set('.animate-bio-subtitle', { y: -80, opacity: 0 });
    gsap.set('.animate-filter-btn', { x: 150, y: -150, opacity: 0 });
    gsap.set('.animate-gallery-wrapper', { x: 300, opacity: 0 });

    // Create ScrollTrigger timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: experienceRef.current,
        start: 'top 75%', // trigger when top of section is 75% down the viewport
        once: true, // run only once
      }
    });

    // 1. Profile card enters from left
    tl.to('.animate-profile-card', {
      x: 0,
      opacity: 1,
      duration: 1.5,
      ease: 'power4.out'
    }, 0);

    // 2. Titles drop from the top
    tl.to('.animate-bio-subtitle', {
      y: 0,
      opacity: 1,
      duration: 1.2,
      ease: 'back.out(1.1)'
    }, 0.1);

    tl.to('.animate-bio-title', {
      y: 0,
      opacity: 1,
      duration: 1.2,
      ease: 'back.out(1.1)'
    }, 0.2);

    // 3. Filter buttons drop from top-right and sort
    tl.to('.animate-filter-btn', {
      x: 0,
      y: 0,
      opacity: 1,
      duration: 1.4,
      ease: 'back.out(1.3)',
      stagger: 0.12
    }, 0.15);

    // 4. Circular Gallery slides from right
    tl.to('.animate-gallery-wrapper', {
      x: 0,
      opacity: 1,
      duration: 1.6,
      ease: 'power4.out'
    }, 0.3);

    // 5. Background video scale & fade-in (Cinematic Reveal) linked to scroll scrub
    gsap.fromTo('.bio-bg-video', 
      { scale: 1.1, opacity: 0 },
      {
        scale: 1.0,
        opacity: 0.3,
        scrollTrigger: {
          trigger: experienceRef.current,
          start: 'top bottom', // starts when the top of the section enters the bottom of the viewport
          end: 'top 30%',     // ends when the top of the section is at 30% from the top of the viewport
          scrub: 1,           // smooth scrubbing, takes 1 second to catch up to scroll position
        }
      }
    );

  }, { scope: experienceRef });

  const galleryItems = React.useMemo(() => {
    return [
      {
        category: 'life_style',
        image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=800&q=80',
        text: '深夜咖啡与机械键盘的节律'
      },
      {
        category: 'tech',
        image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
        text: 'Vibe Coding 带来开发新范式吗？'
      }
    ].filter(item => activeTab === 'all' || item.category === activeTab);
  }, [activeTab]);

  useEffect(() => {
    setIsHangarReady(true);
  }, []);

  // Initialize Lenis Smooth Scrolling and link to GSAP ScrollTrigger
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1, // Silky smooth scroll duration
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponent ease out
      smoothWheel: true,
      syncTouch: false,
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // Smooth scroll for anchor hash links (nav items)
    const handleAnchorClick = (e) => {
      const targetLink = e.target.closest('a[href^="#"]');
      if (targetLink) {
        e.preventDefault();
        const id = targetLink.getAttribute('href');
        const targetElement = document.querySelector(id);
        if (targetElement) {
          lenis.scrollTo(targetElement, { offset: 0, duration: 1.2 });
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
      document.removeEventListener('click', handleAnchorClick);
    };
  }, []);

  // Canvas 背景引用
  const canvasRef = useRef(null);

  // 监听全局滚动 (使用直接 DOM 操作更新滚动条，避免 re-render)
  useEffect(() => {
    let lastNavIndex = 0;
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        const progress = (window.pageYOffset / totalScroll) * 100;
        scrollProgressRef.current = progress;
        // 直接操作 DOM 更新滚动条宽度，不触发 React re-render
        if (scrollBarRef.current) {
          scrollBarRef.current.style.width = `${progress}%`;
        }
      }

      // 避免由于点击导航触发平滑滚动而导致高亮块在中间选项和目标选项之间抖动
      if (isScrollingToSection.current) return;

      const sections = ['hero', 'experience', 'competencies'];
      const triggerY = window.innerHeight * 0.4; // 视口 40% 的黄金分割点作为激活线
      
      let currentActive = 0;
      for (let i = 0; i < sections.length; i++) {
        const el = document.getElementById(sections[i]);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= triggerY) {
            currentActive = i;
          }
        }
      }
      // 仅在导航索引变化时才触发 setState
      if (currentActive !== lastNavIndex) {
        lastNavIndex = currentActive;
        setActiveNavIndex(currentActive);
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // 首次加载同步当前所在区间
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  // 交互式 Canvas背景网络粒子 (带 IntersectionObserver 暂停机制)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let isVisible = true; // IntersectionObserver 控制

    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const particles = [];
    const count = 60;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 1.5 + 1,
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
      // 不可见时跳过绘制，节省 CPU/GPU
      if (!isVisible) {
        animationFrameId = requestAnimationFrame(draw);
        return;
      }

      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = 'rgba(255, 107, 0, 0.05)';
      
      // 绘制粒子并连线
      particles.forEach((p, index) => {
        p.x += p.vx;
        p.y += p.vy;

        // 边界碰撞
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // 鼠标引力
        const dxMouse = mouse.x - p.x;
        const dyMouse = mouse.y - p.y;
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
        if (distMouse < 160) {
          p.x += dxMouse * 0.01;
          p.y += dyMouse * 0.01;
        }

        // 画圆
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = distMouse < 160 ? 'rgba(255, 107, 0, 0.7)' : 'rgba(255, 255, 255, 0.25)';
        ctx.fill();

        // 连线
        for (let j = index + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(255, 107, 0, ${0.15 * (1 - dist / 110)})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    // IntersectionObserver: hero 区域不可见时暂停粒子绘制
    const heroSection = canvas.closest('section');
    let observer;
    if (heroSection) {
      observer = new IntersectionObserver(
        ([entry]) => { isVisible = entry.isIntersecting; },
        { threshold: 0 }
      );
      observer.observe(heroSection);
    }

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
      if (observer) observer.disconnect();
    };
  }, []);



  return (
    <div className="min-h-screen bg-[#0A0A0C] text-white selection:bg-[#FF6B00] selection:text-white relative font-sans overflow-x-hidden">
      

      {/* 顶部滚动条 */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-neutral-900 z-[70]">
        <div 
          ref={scrollBarRef}
          className="h-full bg-gradient-to-r from-[#FF6B00] to-amber-500 transition-all duration-100" 
          style={{ width: '0%' }}
        />
      </div>

      {/* ==================== 1. 极简网格导航栏 ==================== */}
      <div className="fixed top-6 left-0 right-0 z-[9999] flex justify-center px-4 md:px-12">
        <div className="relative w-full max-w-[1700px]">
          <nav className="relative z-20 bg-white/[0.04] backdrop-blur-2xl border border-white/10 rounded-2xl px-6 py-2.5 flex items-center justify-between w-full shadow-2xl">
            <div className="flex items-center gap-3">
              {/* 极简网格呼吸标志 */}
              <div className="relative flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF6B00] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#FF6B00]"></span>
              </div>
              <span className="text-sm tracking-wider font-mono font-bold text-white">PENGKAI.DEV</span>
            </div>

            <div className="hidden md:flex items-center text-xs font-mono tracking-wider">
              <GooeyNav
                items={navItems}
                particleCount={19}
                particleDistances={[90, 10]}
                particleR={200}
                activeIndex={activeNavIndex}
                onActiveIndexChange={(index) => {
                  setActiveNavIndex(index);
                  isScrollingToSection.current = true;
                  if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
                  scrollTimeoutRef.current = setTimeout(() => {
                    isScrollingToSection.current = false;
                  }, 1000);
                }}
                animationTime={600}
                timeVariance={1400}
                colors={[1, 2, 3, 1, 2, 3, 1, 4]}
              />
            </div>
          </nav>
        </div>
      </div>

      {/* ==================== 2. 全屏首页 HERO 区域 ==================== */}
      <section id="hero" className="relative h-screen flex flex-col justify-start pt-40 md:pt-52 overflow-hidden pb-24 md:pb-32 px-6 md:px-12 border-b border-neutral-900">
        
        {/* 3D 服务器机房背景，带开灯与拉近动效 */}
        <ServerHangarCanvas isReady={isHangarReady} />

        {/* 【科技网格背景线 - z-20】
          置于视频正上方，创造网格浮动在壮丽雪山上的极致科幻图纸视觉效果
        */}
        <div className="absolute inset-0 pointer-events-none z-20 grid grid-cols-1 md:grid-cols-12 max-w-[1700px] mx-auto w-full">
          <div className="col-span-3 border-r border-neutral-900/40 h-full"></div>
          <div className="col-span-6 border-r border-neutral-900/40 h-full"></div>
          <div className="col-span-3 h-full"></div>
        </div>

        {/* 【双重渐变调色遮罩 - z-25】
          让背景视频和网格保持恰当的克制亮度，确保文字呈现最高级、最锋利的阅读对比度
        */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0C]/75 via-[#0A0A0C]/15 to-transparent pointer-events-none z-25" />

        {/* 【互动 Canvas 粒子 - z-30】
          浮动于调色遮罩前方，跟随鼠标交互飞舞
        */}
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover z-30 opacity-70 pointer-events-auto" />

        {/* 【核心内容排版区 - z-40】
          使用 z-40 确保层级高于 Canvas，彻底解决因 Canvas 抢占焦点导致按钮与输入框无法点击的潜在隐患
        */}
        <div className="relative w-full flex-1 max-w-[1700px] mx-auto z-40 flex flex-col">
          
          {/* 大标题与技术信条 */}
          <div className="max-w-4xl space-y-6">
            {/* 核心标题：Outfit Black */}
            <h1 className="font-display text-2xl sm:text-3xl md:text-[3.8rem] lg:text-[4.2rem] font-black leading-[0.95] tracking-tighter text-white uppercase drop-shadow-xl flex flex-col items-start gap-2">
              <SplitText
                text="Here’s Digital Field of"
                className="font-display text-2xl sm:text-3xl md:text-[3.8rem] lg:text-[4.2rem] font-black leading-[0.95] tracking-tighter text-white uppercase block"
                delay={100}
                duration={2}
                ease="elastic.out(1, 0.3)"
                splitType="chars"
                textAlign="left"
                tag="span"
              />
              <SplitText
                text="KAI"
                className="font-display text-3xl sm:text-4xl md:text-[4.75rem] lg:text-[5.25rem] font-black leading-[0.95] tracking-tighter text-[#FF6B00] uppercase block"
                delay={300}
                duration={2}
                ease="elastic.out(1, 0.3)"
                splitType="chars"
                textAlign="left"
                tag="span"
              />
              <div className="flex flex-wrap md:flex-nowrap items-baseline gap-x-3 md:gap-x-5 whitespace-nowrap">
                <SplitText
                  text="For Sharing"
                  className="font-display text-2xl sm:text-3xl md:text-[3.8rem] lg:text-[4.2rem] font-black leading-[0.95] tracking-tighter text-white uppercase block"
                  delay={100}
                  duration={2}
                  ease="elastic.out(1, 0.3)"
                  splitType="chars"
                  textAlign="left"
                  tag="span"
                />
                <RotatingText
                  texts={['coding', 'life', 'feeling', 'thinking']}
                  mainClassName="font-display text-2xl sm:text-3xl md:text-[3.8rem] lg:text-[4.2rem] font-black text-[#FF6B00] uppercase inline-flex overflow-hidden pb-1"
                  staggerFrom="first"
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: "-120%", opacity: 0 }}
                  staggerDuration={0.025}
                  splitBy="characters"
                  transition={{ type: "spring", damping: 30, stiffness: 400 }}
                  rotationInterval={1800}
                  auto={true}
                  loop={true}
                />
              </div>
            </h1>
          </div>

          {/* 打字机组件，位于底部 */}
          <div className="mt-auto">
            <div className="inline-block">
              <ElectricBorder
                color="#278acf"
                speed={3}
                chaos={0.01}
                borderRadius={28}
              >
                <div className="flex flex-col md:flex-row md:items-center gap-3 px-5 py-2.5 font-display text-sm sm:text-base md:text-[1.425rem] lg:text-[1.575rem] font-black leading-[0.95] tracking-tighter text-white uppercase drop-shadow-xl bg-transparent">
                  <span className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-emerald-500 animate-pulse flex-shrink-0"></span>
                  <TextType 
                    text={['吉林大学 2027 届 软件工程软件学院本科', 'JAVA', 'SPRING BOOT', 'KAFKA', 'REDIS', 'MySQL']}
                    typingSpeed={70}
                    pauseDuration={1400}
                    showCursor={true}
                    cursorCharacter="|"
                    variableSpeed={{ min: 80, max: 135 }}
                    cursorBlinkDuration={0.6}
                  />
                </div>
              </ElectricBorder>
            </div>
          </div>

        </div>
      </section>

      {/* ==================== 3. 个人经历与核心指标 (BIO) ==================== */}
      <section id="experience" ref={experienceRef} className="relative bg-[#0F0F12] py-28 border-b border-neutral-900 overflow-hidden">
        
        {/* 背景视频与上下 200px 渐变消隐遮罩 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-10 bio-bg-container">
          <video
            src="/bio-bg.webm"
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover bio-bg-video"
            style={{ opacity: 0, transform: 'scale(1.1)' }}
          />
          {/* 顶部消隐遮罩 */}
          <div className="absolute top-0 left-0 right-0 h-[200px] bg-gradient-to-b from-[#0F0F12] to-transparent z-15 pointer-events-none" />
          {/* 底部消隐遮罩 */}
          <div className="absolute bottom-0 left-0 right-0 h-[200px] bg-gradient-to-t from-[#0F0F12] to-transparent z-15 pointer-events-none" />
        </div>

        {/* 背景大格网划分线 */}
        <div className="absolute inset-0 pointer-events-none z-20 grid grid-cols-1 md:grid-cols-12 max-w-[1700px] mx-auto w-full">
          <div className="col-span-3 border-r border-neutral-900/60 h-full"></div>
          <div className="col-span-6 border-r border-neutral-900/60 h-full"></div>
          <div className="col-span-3 h-full"></div>
        </div>

        <div className="relative w-full max-w-[1700px] mx-auto px-6 md:px-12 z-30">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            
            {/* 左侧头像大卡片/抽象艺术图 (占 4 列) */}
            <div className="lg:col-span-4 space-y-6 animate-profile-card">
              <div className="relative group">
                <ProfileCard
                  name="彭凯"
                  title="JAVA BACKEND"
                  avatarUrl="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80"
                  showUserInfo={false}
                  enableTilt={true}
                  enableMobileTilt={false}
                  behindGlowEnabled={true}
                  iconUrl="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22120%22%20height%3D%22120%22%20viewBox%3D%220%200%20120%20120%22%3E%3Cg%20fill%3D%22none%22%20stroke%3D%22white%22%20stroke-width%3D%222.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M-8%2C-5%20L-14%2C0%20L-8%2C5%20M-3%2C7%20L3%2C-7%20M8%2C-5%20L14%2C0%20L8%2C5%22%20transform%3D%22translate(30%2C%2035)%20rotate(-40)%22%2F%3E%3Cpath%20d%3D%22M-8%2C-5%20L-14%2C0%20L-8%2C5%20M-3%2C7%20L3%2C-7%20M8%2C-5%20L14%2C0%20L8%2C5%22%20transform%3D%22translate(90%2C%2035)%20rotate(45)%22%2F%3E%3Cpath%20d%3D%22M-8%2C-5%20L-14%2C0%20L-8%2C5%20M-3%2C7%20L3%2C-7%20M8%2C-5%20L14%2C0%20L8%2C5%22%20transform%3D%22translate(60%2C%2060)%20rotate(-15)%22%2F%3E%3Cpath%20d%3D%22M-8%2C-5%20L-14%2C0%20L-8%2C5%20M-3%2C7%20L3%2C-7%20M8%2C-5%20L14%2C0%20L8%2C5%22%20transform%3D%22translate(30%2C%2085)%20rotate(45)%22%2F%3E%3Cpath%20d%3D%22M-8%2C-5%20L-14%2C0%20L-8%2C5%20M-3%2C7%20L3%2C-7%20M8%2C-5%20L14%2C0%20L8%2C5%22%20transform%3D%22translate(85%2C%2090)%20rotate(-45)%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E"
                  behindGlowColor="rgba(255, 107, 0, 0.4)"
                  innerGradient="linear-gradient(145deg, rgba(20, 20, 25, 0.9) 0%, rgba(30, 30, 35, 0.7) 100%)"
                  grainUrl="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22200%22%20height%3D%22200%22%3E%3Cfilter%20id%3D%22n%22%3E%3CfeTurbulence%20type%3D%22fractalNoise%22%20baseFrequency%3D%220.8%22%20numOctaves%3D%223%22%20stitchTiles%3D%22stitch%22%2F%3E%3CfeColorMatrix%20type%3D%22matrix%22%20values%3D%220%200%200%200%200%20%20%200%200%200%200%200%20%20%200%200%200%200%200%20%200%200%200%200.07%200%22%2F%3E%3C%2Ffilter%3E%3Crect%20width%3D%22200%22%20height%3D%22200%22%20filter%3D%22url(%23n)%22%2F%3E%3C%2Fsvg%3E"
                />
              </div>

            </div>

            {/* 右侧生活随笔与博客分类 (占 8 列) */}
            <div className="lg:col-span-8 space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-neutral-800/80 pb-5">
                <div className="space-y-2">
                  <div className="flex items-center gap-3 animate-bio-subtitle">
                    <Shuffle
                      text="LIFE & CODING REFLECTION"
                      className="uppercase tracking-[0.2em] text-[#FF6B00]"
                      style={{ fontSize: '12.5px', fontFamily: "'Press Start 2P', sans-serif" }}
                      shuffleDirection="right"
                      duration={0.75}
                      animationMode="evenodd"
                      shuffleTimes={1}
                      ease="power2.out"
                      stagger={0.03}
                      loop={true}
                      loopDelay={2}
                      triggerOnHover={true}
                      tag="span"
                      textAlign="left"
                    />
                  </div>
                  <h2 className="font-display text-2xl md:text-3xl font-black tracking-tighter uppercase text-white leading-none animate-bio-title">
                    <ShinyText
                      text="✨ 极客生活与深度思考"
                      speed={2}
                      delay={0.5}
                      color="#a59e9a"
                      shineColor="#ffffff"
                      spread={115}
                      direction="left"
                      yoyo={false}
                      pauseOnHover={false}
                    />
                  </h2>
                </div>
                
                {/* 3D 悬浮玻璃过滤器 */}
                <div style={{ fontSize: '8px', overflow: 'visible' }}>
                  <GlassIcons
                    items={filterIcons}
                    activeValue={activeTab}
                    onChange={setActiveTab}
                  />
                </div>
              </div>

              {/* 3D 环形相册展示 */}
              <div style={{ height: '380px', position: 'relative' }} className="w-full animate-gallery-wrapper">
                <CircularGallery
                  items={galleryItems}
                  bend={0}
                  textColor="#ffffff"
                  borderRadius={0.16}
                  scrollEase={0.06}
                  fontUrl="https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@500&display=swap"
                  font="bold 22px Orbitron"
                  scrollSpeed={2.3}
                />
              </div>
            </div>

          </div>
        </div>
      </section>
      {/* ==================== 5. 个人优势与能力看板（CORE COMPETENCIES） ==================== */}
      <section id="competencies" className="relative py-28 border-b border-neutral-900 bg-[#0E0E11]">
        
        {/* 背景格线 */}
        <div className="absolute inset-0 pointer-events-none z-0 grid grid-cols-1 md:grid-cols-12 max-w-[1700px] mx-auto w-full">
          <div className="col-span-3 border-r border-neutral-900/60 h-full"></div>
          <div className="col-span-6 border-r border-neutral-900/60 h-full"></div>
          <div className="col-span-3 h-full"></div>
        </div>

        <div className="relative w-full max-w-[1700px] mx-auto px-6 md:px-12 z-20 space-y-16">
          
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <span className="text-xs uppercase tracking-[0.25em] font-mono text-[#FF6B00] font-bold">CORE COMPETENCIES</span>
            <h2 className="font-display text-4xl md:text-5xl font-black tracking-tighter uppercase leading-none">后端工程师的专业积淀</h2>
            <p className="text-neutral-400 font-light text-sm">除了常规研发，在计算机科学底层深度、JUC 性能排查、高可用多线程以及大模型前沿应用上皆具备极强优势。</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* 卡片 1: AI 协同开发 (Vibe Coding) */}
            <div className="bg-[#121215] border border-neutral-800 hover:border-[#FF6B00]/40 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-[#FF6B00]/10 flex items-center justify-center text-[#FF6B00] group-hover:bg-[#FF6B00] group-hover:text-black transition-colors">
                  <SparklesIcon />
                </div>
                <h3 className="text-lg font-display font-bold text-white tracking-tight uppercase">AI 辅助提效 (Vibe Coding)</h3>
                <p className="text-neutral-400 text-xs leading-relaxed font-light">
                  精通将 ChatGPT、Claude Code、Cursor 与本地环境深度融合。擅长提示词调优、自动骨架生成、接口联调、批量代码 logic 重构及单元测试编写，具备极其敏捷的交付交付优势。
                </p>
              </div>
              <span className="text-[10px] font-mono text-neutral-600 tracking-wider block mt-6">DEVELOPMENT ACCELERATION</span>
            </div>

            {/* 卡片 2: Java 基础与 JUC 并发 */}
            <div className="bg-[#121215] border border-neutral-800 hover:border-[#FF6B00]/40 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-[#FF6B00]/10 flex items-center justify-center text-[#FF6B00] group-hover:bg-[#FF6B00] group-hover:text-black transition-colors">
                  <CodeIcon />
                </div>
                <h3 className="text-lg font-display font-bold text-white tracking-tight uppercase">Java & 高级 JUC 并发</h3>
                <p className="text-neutral-400 text-xs leading-relaxed font-light">
                  熟练掌握 Java 集合底层数据结构与 JVM 内存管理、垃圾回收算法及双亲派隔离模型。深入探究线程池、ThreadLocal、CAS 原子指令、AQS 独占共享以及 JMM 内存模型。
                </p>
              </div>
              <span className="text-[10px] font-mono text-neutral-600 tracking-wider block mt-6">MULTITHREADING DESIGN</span>
            </div>

            {/* 卡片 3: MySQL 事务与关系存储 */}
            <div className="bg-[#121215] border border-neutral-800 hover:border-[#FF6B00]/40 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-[#FF6B00]/10 flex items-center justify-center text-[#FF6B00] group-hover:bg-[#FF6B00] group-hover:text-black transition-colors">
                  <DatabaseIcon />
                </div>
                <h3 className="text-lg font-display font-bold text-white tracking-tight uppercase">高性能 MySQL 体系</h3>
                <p className="text-neutral-400 text-xs leading-relaxed font-light">
                  熟悉 MySQL 存储引擎底层事务四大隔离级别。深入索引 B+ Tree 数据结构构建原理。熟悉两阶段加锁、表排他锁与自增锁机制以及 MVCC 多版本并发控制一致性非锁定读策略。
                </p>
              </div>
              <span className="text-[10px] font-mono text-neutral-600 tracking-wider block mt-6">STORAGE RELIABILITY</span>
            </div>

            {/* 卡片 4: 分布式高可用与大流量队列 */}
            <div className="bg-[#121215] border border-neutral-800 hover:border-[#FF6B00]/40 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-[#FF6B00]/10 flex items-center justify-center text-[#FF6B00] group-hover:bg-[#FF6B00] group-hover:text-black transition-colors">
                  <CpuIcon />
                </div>
                <h3 className="text-lg font-display font-bold text-white tracking-tight uppercase">分布式中间件 Redis/Kafka</h3>
                <p className="text-neutral-400 text-xs leading-relaxed font-light">
                  熟练运用 Redis 数据类型，通过分布式锁保障一致性。掌握 Kafka 核心，能有效解决消息零丢失、防重复消费、顺序消费、堆积等问题，确保复杂链路 stable。
                </p>
              </div>
              <span className="text-[10px] font-mono text-neutral-600 tracking-wider block mt-6">HIGH-THROUGHPUT QUEUE</span>
            </div>

          </div>

        </div>
      </section>

      


      {/* ==================== 7. 全屏谢幕联系方式 (FOOTER) ==================== */}
      <section id="footer" className="relative min-h-screen bg-[#0A0A0C] border-t border-neutral-900 flex flex-col justify-between py-20 px-6 md:px-12 overflow-hidden">
        
        {/* 背景分割大线 */}
        <div className="absolute inset-0 pointer-events-none z-0 grid grid-cols-1 md:grid-cols-12 max-w-[1700px] mx-auto w-full">
          <div className="col-span-3 border-r border-neutral-900/40 h-full"></div>
          <div className="col-span-6 border-r border-neutral-900/40 h-full"></div>
          <div className="col-span-3 h-full"></div>
        </div>

        <div className="relative w-full max-w-[1700px] mx-auto z-20 mt-16">
          <span className="text-xs uppercase tracking-[0.25em] font-mono text-[#FF6B00] font-bold block mb-4">LET'S COMMUNICATE</span>
          
          {/* 页脚超级标题 */}
          <h2 className="font-display text-5xl md:text-[6.5rem] font-black leading-[0.98] tracking-tighter uppercase text-white">
            Building the next <br />
            <span className="font-light text-neutral-400 tracking-tight lowercase italic">high-performance system</span>
          </h2>
        </div>

        {/* 交互联系面板区与吉林大学表彰印章 */}
        <div className="relative w-full max-w-[1700px] mx-auto z-20 grid grid-cols-1 lg:grid-cols-12 gap-12 pt-16 border-t border-neutral-900/80 items-end">
          
          {/* 左侧文字联系 */}
          <div className="lg:col-span-6 space-y-6">
            <p className="text-neutral-400 text-base md:text-lg max-w-md font-light leading-relaxed">
              随时欢迎寻找对 Java 并发、AI Agent、微电网架构与大模型 Spring AI 开发有需求的团队、老师或企业伙伴与我深入畅谈。我随时到岗、并保证 6 个月以上的全职付出。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <a 
                href="mailto:2157437575@qq.com" 
                className="bg-[#FF6B00] hover:bg-[#E05E00] text-black font-mono font-bold px-8 py-4 rounded-xl text-center text-xs transition-all tracking-wider inline-block shadow-lg hover:shadow-[0_0_20px_rgba(255,107,0,0.4)] cursor-pointer"
              >
                发送电子邮件邀约
              </a>
              <a 
                href="tel:15344405967" 
                className="border border-neutral-800 hover:bg-neutral-900 text-white font-mono px-8 py-4 rounded-xl text-center text-xs transition-all tracking-wider inline-block cursor-pointer"
              >
                拨打手机联系彭凯
              </a>
            </div>
          </div>

          {/* 右侧设计印章、版本及声明 */}
          <div className="lg:col-span-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-8 font-mono text-xs text-neutral-500">
            <div className="space-y-2">
              <p className="text-neutral-400 text-sm">吉林大学 · 软件工程本科 · 彭凯</p>
              <p>© 2026 Peng Kai. 版权所有，由 Vibe Coding 提供高效交付支持。</p>
            </div>
            
            <div className="flex gap-6">
              <a href="#hero" className="hover:text-white transition-colors cursor-pointer">BACK TO TOP</a>
              <span className="text-[#FF6B00]">ONLINE STATUS</span>
            </div>
          </div>

        </div>

      </section>

    </div>
  );
}