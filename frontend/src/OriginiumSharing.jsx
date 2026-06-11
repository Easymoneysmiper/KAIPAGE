import { useState, useEffect, useRef } from 'react';

// Static mock posts for tech and lifestyle reflections
const MOCK_POSTS = [
  {
    id: 1,
    category: 'tech',
    title: '高并发秒杀扣减的 7 层高可靠架构设计与验证',
    date: '2026 / 06 / 10',
    summary: '针对大流量并发场景，采用 Redis 乐观锁原子化扣减与 Kafka 异步削峰。本文探讨如何通过两阶段提交、本地事务事务校验与消息防重来应对极端雪崩。',
    tag: 'DISTRIBUTED_SYSTEMS'
  },
  {
    id: 2,
    category: 'tech',
    title: '基于 Spring AI & Function Calling 的 RAG 智能搜索工程化',
    date: '2026 / 05 / 24',
    summary: '深度解析本地知识库通过 PgVector / Milvus 向量化检索、多 Query 路由切片重排以及集成 Spring AI 声明式大模型交互接口的召回率优化方案。',
    tag: 'ARTIFICIAL_INTELLIGENCE'
  },
  {
    id: 3,
    category: 'life',
    title: '深夜咖啡与机械键盘的节律：软件工程的感性维度',
    date: '2026 / 04 / 18',
    summary: '代码并非全是冰冷的数值，它往往是开发者心境的倒影。在长夜中静听青轴的弹起，伴随微温的手冲咖啡，在沉浸状态下寻求简洁逻辑的纯真艺术。',
    tag: 'LIFESTYLE_REFLECTIONS'
  },
  {
    id: 4,
    category: 'life',
    title: '从 JUC 并发原理探寻生活中的多线程阻塞与解套',
    date: '2026 / 03 / 02',
    summary: '当事务在流水线发生死锁时，我们该如何像 AQS 的 CLH 队列一样优雅地挂起与唤醒？生活是一场更大层面的多线程调度，适时释放共享锁是化解阻碍的良药。',
    tag: 'PHILOSOPHY_OF_CODE'
  }
];

export default function OriginiumSharing() {
  const [activeCategory, setActiveCategory] = useState('all');
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);

  // Filter posts based on active tab
  const filteredPosts = MOCK_POSTS.filter(
    (post) => activeCategory === 'all' || post.category === activeCategory
  );

  // Particle Morphing Logic
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const particleCount = 180;
    const particles = [];

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        originX: Math.random() * width,
        originY: Math.random() * height,
        targetX: Math.random() * width,
        targetY: Math.random() * height,
        vx: 0,
        vy: 0,
        color: 'rgba(0, 240, 255, 0.4)',
        size: Math.random() * 1.5 + 0.8,
        speed: 0.03 + Math.random() * 0.03,
      });
    }

    // Set target positions based on active category shape
    const setTargetPositions = (category) => {
      const centerX = width / 2;
      const centerY = height / 2;

      particles.forEach((p, i) => {
        let tx, ty, color;

        if (category === 'tech') {
          // Double Helix Shape
          const angle = (i / particleCount) * Math.PI * 8;
          const isStrandB = i % 2 === 0;
          const offset = isStrandB ? Math.PI : 0;
          const helixWidth = Math.min(width * 0.28, 140);
          
          tx = centerX + Math.cos(angle + offset) * helixWidth;
          ty = centerY - (height * 0.35) + (i / particleCount) * (height * 0.7);
          color = isStrandB ? 'rgba(0, 240, 255, 0.75)' : 'rgba(255, 107, 0, 0.75)';
        } else if (category === 'life') {
          // Circular Sphere Shape
          const radius = Math.min(width, height) * 0.25;
          const angle = (i / particleCount) * Math.PI * 2 + Math.random() * 0.1;
          const depth = Math.sin(i * 1.7) * radius * 0.5; // Simulate 3D rotation projection
          
          tx = centerX + Math.cos(angle) * (radius + depth * 0.2);
          ty = centerY + Math.sin(angle) * (radius + depth * 0.2);
          color = 'rgba(166, 246, 38, 0.7)'; // lime green
        } else {
          // "All" - Floating Nebula cloud shape
          const radius = Math.min(width, height) * 0.35;
          const theta = Math.random() * Math.PI * 2;
          const r = Math.pow(Math.random(), 1.5) * radius;
          
          tx = centerX + Math.cos(theta) * r;
          ty = centerY + Math.sin(theta) * r;
          color = 'rgba(255, 255, 255, 0.35)';
        }

        p.targetX = tx;
        p.targetY = ty;
        p.color = color;
      });
    };

    // Initialize shapes
    setTargetPositions(activeCategory);

    // Main Draw loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw subtle orbital rings for tactical styling
      if (activeCategory === 'life') {
        ctx.beginPath();
        ctx.arc(width / 2, height / 2, Math.min(width, height) * 0.25, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(166, 246, 38, 0.07)';
        ctx.lineWidth = 1;
        ctx.stroke();
      } else if (activeCategory === 'tech') {
        ctx.beginPath();
        ctx.moveTo(width / 2 - 50, height / 2 - 120);
        ctx.lineTo(width / 2 - 50, height / 2 + 120);
        ctx.moveTo(width / 2 + 50, height / 2 - 120);
        ctx.lineTo(width / 2 + 50, height / 2 + 120);
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.05)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      particles.forEach((p) => {
        // Smoothly interpolate to target position (Morphing effect)
        p.x += (p.targetX - p.x) * p.speed;
        p.y += (p.targetY - p.y) * p.speed;

        // Faint Brownian noise
        p.x += (Math.random() - 0.5) * 0.3;
        p.y += (Math.random() - 0.5) * 0.3;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        // Connect particles with thin lines if close and in tech mode
        if (activeCategory === 'tech') {
          particles.forEach((p2) => {
            const dx = p.x - p2.x;
            const dy = p.y - p2.y;
            const d = Math.sqrt(dx * dx + dy * dy);
            if (d > 0 && d < 22 && Math.random() > 0.94) {
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = 'rgba(0, 240, 255, 0.08)';
              ctx.lineWidth = 0.3;
              ctx.stroke();
            }
          });
        }
      });

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    // Handle resize
    const handleResize = () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
      setTargetPositions(activeCategory);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, [activeCategory]);

  return (
    <section className="relative w-full py-24 border-b border-white/5 bg-[#0F0F12] overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#0A0A0C] to-transparent pointer-events-none z-10" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0A0A0C] to-transparent pointer-events-none z-10" />

      <div className="relative w-full max-w-[1700px] mx-auto px-6 md:px-12 z-20">
        
        {/* Module Subtitle */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-white/10 pb-4 mb-12 font-mono">
          <div className="flex items-center gap-4">
            <span className="text-ark-cyan text-sm tracking-widest font-bold">WORLD // 03</span>
            <span className="text-neutral-500 text-xs">/ 源石技艺粒子与极客生活随笔</span>
          </div>

          {/* HUD Styled filter tabs */}
          <div className="flex border border-white/10 p-0.5 rounded-sm bg-white/5 text-[10px]">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-4 py-1.5 font-bold uppercase transition-all duration-300 cursor-pointer ${
                activeCategory === 'all' 
                  ? 'bg-ark-cyan text-black shadow-[0_0_10px_rgba(0,240,255,0.4)]' 
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              ALL / 全部
            </button>
            <button
              onClick={() => setActiveCategory('tech')}
              className={`px-4 py-1.5 font-bold uppercase transition-all duration-300 cursor-pointer ${
                activeCategory === 'tech' 
                  ? 'bg-ark-cyan text-black shadow-[0_0_10px_rgba(0,240,255,0.4)]' 
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              TECH / 技术思考
            </button>
            <button
              onClick={() => setActiveCategory('life')}
              className={`px-4 py-1.5 font-bold uppercase transition-all duration-300 cursor-pointer ${
                activeCategory === 'life' 
                  ? 'bg-ark-cyan text-black shadow-[0_0_10px_rgba(0,240,255,0.4)]' 
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              LIFE / 生活随感
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Side: WebGL Particle Visualizer (5 columns) */}
          <div className="lg:col-span-5 h-[360px] md:h-[420px] bg-[#070709] border border-white/5 rounded-sm relative overflow-hidden flex items-center justify-center">
            
            {/* Visual HUD grid coordinates */}
            <span className="absolute top-3 left-3 text-[8px] font-mono text-neutral-600 tracking-wider">
              SYS.PRTCL.VISUALIZER
            </span>

            {/* Tactical overlay frames */}
            <span className="absolute top-2 left-2 w-2 h-2 border-t border-l border-white/30" />
            <span className="absolute top-2 right-2 w-2 h-2 border-t border-r border-white/30" />
            <span className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-white/30" />
            <span className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-white/30" />
            
            {/* Morphing Canvas */}
            <canvas ref={canvasRef} className="w-full h-full block cursor-crosshair" />

            {/* Legend indicators */}
            <div className="absolute bottom-3 right-3 flex items-center gap-4 text-[8px] font-mono text-neutral-500">
              <div className="flex items-center gap-1.5">
                <span className="w-1 h-1 bg-ark-cyan rounded-full" />
                <span>TECH CODE</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1 h-1 bg-[#ff6b00] rounded-full" />
                <span>TECH INFO</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1 h-1 bg-[#a6f626] rounded-full" />
                <span>LIFESTYLE</span>
              </div>
            </div>

          </div>

          {/* Right Side: Log-style Blog Post Entries (7 columns) */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="max-h-[440px] overflow-y-auto pr-2 space-y-5 scrollbar-thin">
              {filteredPosts.map((post) => (
                <div 
                  key={post.id} 
                  className="group p-5 bg-[#0A0A0C]/50 border border-white/5 hover:border-ark-cyan/30 transition-all duration-300 rounded-sm relative"
                >
                  {/* Category Accent corner tags */}
                  <span className={`absolute top-0 right-0 w-0 h-0 border-t-[8px] border-r-[8px] border-l-[8px] border-l-transparent border-t-transparent ${
                    post.category === 'tech' ? 'border-r-ark-cyan' : 'border-r-ark-green'
                  }`} />
                  
                  <div className="flex items-center justify-between gap-4 mb-2">
                    <span className="font-mono text-[9px] text-neutral-500">{post.date}</span>
                    <span className={`font-mono text-[9px] font-bold px-2 py-0.5 rounded-sm ${
                      post.category === 'tech' 
                        ? 'text-ark-cyan bg-ark-cyan/5 border border-ark-cyan/10' 
                        : 'text-ark-green bg-ark-green/5 border border-ark-green/10'
                    }`}>
                      {post.tag}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white tracking-wider group-hover:text-ark-cyan transition-colors duration-300 mb-3">
                    {post.title}
                  </h3>
                  
                  <p className="text-neutral-400 text-xs leading-relaxed font-light">
                    {post.summary}
                  </p>

                  {/* READ LOG tactical hover link */}
                  <div className="mt-4 flex items-center justify-end">
                    <button className="text-[10px] font-mono font-bold text-ark-cyan flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer">
                      <span>ACCESS_LOG</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary telemetry block */}
            <div className="p-4 bg-white/5 border border-white/10 rounded-sm flex items-center justify-between text-[10px] font-mono text-neutral-500">
              <span>ACTIVE_RECORDS: {filteredPosts.length} / {MOCK_POSTS.length}</span>
              <span>READ_ACCESS: LEVEL_2</span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
