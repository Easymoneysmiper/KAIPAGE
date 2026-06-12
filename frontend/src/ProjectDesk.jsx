import { useState, useEffect } from 'react';

// Detailed project specs matching the interactive desk devices
const PROJECTS = [
  {
    id: 'monitor',
    title: 'KAIPAGE - 数字化战术 HUD 门户空间',
    tag: 'FRONTEND / THREE.JS / GSAP',
    device: '双屏显示器 (MONITOR)',
    desc: '基于 React 19 + Vite 8.0 构建的高视觉冲击力个人开发者数字空间。融合了 R3F 3D 反射服务器机房背景、Lenis 平滑滚动以及 GSAP 容器级滑屏过渡，打造出军事重工 HUD 精准操控面板。',
    tech: ['React 19', 'Tailwind v4', 'Three.js', 'React Three Fiber', 'GSAP', 'Lenis'],
    logs: [
      'STATUS: LOADED',
      'INITIALIZING WEBGL VIEWPORT... DONE',
      'COMPILING SHADERS: 12/12 PASSED',
      'SYNCING LENIS SMOOTH TICKER... ACTIVE',
      'PULLING TELEMETRY STREAM... OK'
    ]
  },
  {
    id: 'cabinet',
    title: '秒杀交易库存高可靠锁扣减控制器',
    tag: 'BACKEND / CONCURRENCY / REDIS',
    device: '服务器机架 (SERVER_CABINET)',
    desc: '应对每秒数万 QPS 并发流量的交易秒杀方案。底层基于 Redis 分布式乐观锁验证、库存原子指令扣减、Kafka 异步高通量消息主题拉入削峰，以及两阶段事务两级缓存防御策略，保障数据库安全落库。',
    tech: ['Java 21', 'Spring Boot 3.3', 'Redis Sentinel', 'Apache Kafka', 'MySQL', 'JUC'],
    logs: [
      'STATUS: SECURE',
      'MOCKING INBOUND QPS: 4,850+ REQ/SEC',
      'REDIS DISTRIBUTED LOCKS: 100% ACQUIRED',
      'PULLING KAFKA BROKER PARTITIONS... OK',
      'PERSISTING OPTIMISTIC LOCK TO MYSQL... DONE'
    ]
  },
  {
    id: 'hologram',
    title: 'RAG 智能旅行规划大模型系统',
    tag: 'AI / VECTOR_DB / SPRING_AI',
    date: '2026 / 04',
    device: 'AI 全息投影仪 (HOLOGRAM_ORB)',
    desc: '大模型集成旅行助理。采用多 query 语句重构召回，PgVector 进行地理坐标与向量双向混合检索，通过 Spring AI Function Calling 支持动态接口回调（航司、天气），保障规划信息时效性。',
    tech: ['Spring AI', 'PgVector', 'Milvus', 'OpenAI API', 'Java JUC'],
    logs: [
      'STATUS: ONLINE',
      'RECONSTRUCTING INBOUND QUERY... DONE',
      'SIMILARITY SEARCH (PgVector): TOP_K=5',
      'SPRING AI CALLBACK INTERFACE ROUTED... OK',
      'GENERATING RETRIEVAL REPORT... OK'
    ]
  },
  {
    id: 'arcade',
    title: 'Vibe Coding 协同自动重构测试引擎',
    tag: 'TOOLING / LLM / DEVOPS',
    device: '复古街机终端 (ARCADE_CONSOLE)',
    desc: '将本地 CLI 环境（git、eslint、npm）与 Claude Code 深度联通的自动化交付助手。支持分析代码依赖深度、生成标准骨架、自动批量单元测试补完与修复反思，为开发者赋能超高交付效率。',
    tech: ['Node.js', 'Claude API', 'Shell Scripting', 'Git Hooks', 'ESLint Flat'],
    logs: [
      'STATUS: RUNNING',
      'ANALYZING FRONTEND SOURCE DEPENDENCY DEPTH...',
      'GENERATING UNIT TEST SPEC TEMPLATES... OK',
      'INSPECTING CODE COMPILATION... PASSED',
      'PUSHING REFACTORING COMMIT TO REMOTE... OK'
    ]
  }
];

export default function ProjectDesk() {
  const [selectedProjectId, setSelectedProjectId] = useState('monitor');
  const [logOffset, setLogOffset] = useState(0);

  const currentProject = PROJECTS.find(p => p.id === selectedProjectId) || PROJECTS[0];

  // Rotate simulator console logs
  useEffect(() => {
    const interval = setInterval(() => {
      setLogOffset(prev => (prev + 1) % 6);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full py-24 border-b border-white/5 bg-[#0E0E11] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0C] via-transparent to-[#0A0A0C] pointer-events-none z-10" />

      <div className="relative w-full max-w-[1700px] mx-auto px-6 md:px-12 z-20">
        
        {/* Module Subtitle */}
        <div className="flex items-center gap-4 mb-16 border-b border-white/10 pb-4 font-mono">
          <span className="text-ark-cyan text-sm tracking-widest font-bold">PROJECTS // 04</span>
          <span className="text-neutral-500 text-xs">/ 交互式工作台与项目经历展示</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* Left panel: Interactive isometric workspace SVG (7 columns) */}
          <div className="lg:col-span-7 flex flex-col justify-center items-center p-6 bg-[#070709] border border-white/5 rounded-sm relative min-h-[380px] lg:min-h-[500px] animate-project-left">
            <span className="absolute top-3 left-3 text-[8px] font-mono text-neutral-600 tracking-wider">
              INTERACTIVE_WORKSPACE // CLICK_DEVICE_TO_INSPECT
            </span>

            {/* Corner tags */}
            <span className="absolute top-2 left-2 w-2.5 h-2.5 border-t border-l border-white/20" />
            <span className="absolute top-2 right-2 w-2.5 h-2.5 border-t border-r border-white/20" />
            <span className="absolute bottom-2 left-2 w-2.5 h-2.5 border-b border-l border-white/20" />
            <span className="absolute bottom-2 right-2 w-2.5 h-2.5 border-b border-r border-white/20" />

            {/* Styled Isometric Workspace SVG drawing */}
            <svg 
              viewBox="0 0 500 360" 
              className="w-full max-w-[460px] h-auto text-neutral-600 drop-shadow-[0_0_20px_rgba(0,240,255,0.08)] select-none"
            >
              {/* Isometric Floor Grid lines */}
              <path d="M250 50 L450 150 L250 250 L50 150 Z" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1.5" />
              <path d="M200 75 L350 150 L200 225 L50 150 Z" fill="none" stroke="rgba(255,255,255,0.015)" strokeWidth="1" />
              
              {/* Desk Surface Projection */}
              <polygon points="120,200 380,200 420,250 80,250" fill="rgba(30,30,36,0.5)" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />

              {/* Device 1: Dual Monitors (clickable area) */}
              <g 
                onClick={() => setSelectedProjectId('monitor')}
                className={`cursor-pointer transition-all duration-300 group/dev ${selectedProjectId === 'monitor' ? 'text-ark-cyan' : 'text-neutral-500 hover:text-white'}`}
              >
                {/* Visual glow indicator */}
                {selectedProjectId === 'monitor' && (
                  <polygon points="190,135 310,135 310,185 190,185" fill="rgba(0,240,255,0.08)" className="animate-pulse" />
                )}
                {/* Left screen */}
                <rect x="200" y="140" width="45" height="30" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5" />
                <line x1="222" y1="170" x2="222" y2="182" stroke="currentColor" strokeWidth="1.5" />
                {/* Right screen */}
                <rect x="250" y="140" width="45" height="30" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5" />
                <line x1="272" y1="170" x2="272" y2="182" stroke="currentColor" strokeWidth="1.5" />
                {/* Stand bar */}
                <line x1="222" y1="182" x2="272" y2="182" stroke="currentColor" strokeWidth="1.5" />
                <text x="210" y="132" fontSize="7" fill="currentColor" fontFamily="monospace" letterSpacing="1">MONITORS</text>
              </g>

              {/* Device 2: Server Cabinet Rack (clickable area) */}
              <g 
                onClick={() => setSelectedProjectId('cabinet')}
                className={`cursor-pointer transition-all duration-300 group/dev ${selectedProjectId === 'cabinet' ? 'text-ark-cyan' : 'text-neutral-500 hover:text-white'}`}
              >
                {/* Server outline tower */}
                {selectedProjectId === 'cabinet' && (
                  <polygon points="370,105 440,105 440,215 370,215" fill="rgba(0,240,255,0.08)" className="animate-pulse" />
                )}
                <rect x="380" y="110" width="40" height="90" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
                {/* Slots with status dots */}
                <line x1="385" y1="125" x2="415" y2="125" stroke="currentColor" strokeWidth="1" />
                <line x1="385" y1="135" x2="415" y2="135" stroke="currentColor" strokeWidth="1" />
                <line x1="385" y1="145" x2="415" y2="145" stroke="currentColor" strokeWidth="1" />
                <line x1="385" y1="155" x2="415" y2="155" stroke="currentColor" strokeWidth="1" />
                <line x1="385" y1="165" x2="415" y2="165" stroke="currentColor" strokeWidth="1" />
                <line x1="385" y1="175" x2="415" y2="175" stroke="currentColor" strokeWidth="1" />
                <circle cx="390" cy="125" r="1.2" fill={selectedProjectId === 'cabinet' ? '#00f0ff' : 'currentColor'} />
                <circle cx="390" cy="145" r="1.2" fill={selectedProjectId === 'cabinet' ? '#00f0ff' : 'currentColor'} />
                <circle cx="390" cy="165" r="1.2" fill={selectedProjectId === 'cabinet' ? '#00f0ff' : 'currentColor'} />
                <text x="380" y="102" fontSize="7" fill="currentColor" fontFamily="monospace" letterSpacing="1">SERVER_RACK</text>
              </g>

              {/* Device 3: Holographic Orb projection (clickable area) */}
              <g 
                onClick={() => setSelectedProjectId('hologram')}
                className={`cursor-pointer transition-all duration-300 group/dev ${selectedProjectId === 'hologram' ? 'text-ark-cyan' : 'text-neutral-500 hover:text-white'}`}
              >
                {/* Hologram base */}
                <ellipse cx="140" cy="165" rx="15" ry="6" fill="none" stroke="currentColor" strokeWidth="1.5" />
                <polygon points="130,165 150,165 140,152" fill="none" stroke="currentColor" strokeWidth="1" />
                
                {/* Holo projection floating particles */}
                <ellipse cx="140" cy="120" rx="22" ry="22" fill="none" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3,3" />
                <circle cx="140" cy="120" r="4" fill="currentColor" className="animate-pulse" />
                <line x1="140" y1="160" x2="140" y2="142" stroke="currentColor" strokeWidth="1" strokeDasharray="2,2" />
                
                <text x="110" y="90" fontSize="7" fill="currentColor" fontFamily="monospace" letterSpacing="1">AI_HOLOGRAM</text>
              </g>

              {/* Device 4: Retro Console Keyboard or Controller (clickable area) */}
              <g 
                onClick={() => setSelectedProjectId('arcade')}
                className={`cursor-pointer transition-all duration-300 group/dev ${selectedProjectId === 'arcade' ? 'text-ark-cyan' : 'text-neutral-500 hover:text-white'}`}
              >
                {/* Keyboard body */}
                {selectedProjectId === 'arcade' && (
                  <polygon points="210,210 290,210 290,232 210,232" fill="rgba(0,240,255,0.08)" />
                )}
                <polygon points="220,215 280,215 285,230 215,230" fill="none" stroke="currentColor" strokeWidth="1.5" />
                <line x1="230" y1="222" x2="270" y2="222" stroke="currentColor" strokeWidth="1" strokeDasharray="2,2" />
                
                {/* Joystick detail */}
                <line x1="230" y1="215" x2="228" y2="204" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="228" cy="204" r="2.5" fill="currentColor" />
                <text x="225" y="244" fontSize="7" fill="currentColor" fontFamily="monospace" letterSpacing="1">CONSOLE_PORT</text>
              </g>
            </svg>

            {/* Quick selectors for mobile / list view alternative */}
            <div className="mt-8 flex flex-wrap justify-center gap-3 w-full">
              {PROJECTS.map((proj) => {
                const isActive = proj.id === selectedProjectId;
                return (
                  <button
                    key={proj.id}
                    onClick={() => setSelectedProjectId(proj.id)}
                    className={`px-3 py-1.5 border text-[9px] font-mono font-bold tracking-widest rounded-sm transition-all duration-300 cursor-pointer ${
                      isActive 
                        ? 'border-ark-cyan bg-ark-cyan/10 text-white shadow-[0_0_8px_rgba(0,240,255,0.25)]' 
                        : 'border-white/10 bg-white/5 text-neutral-400 hover:border-white/20 hover:text-white'
                    }`}
                  >
                    {proj.id.toUpperCase()}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right panel: Terminal HUD Dossier & Log Simulator (5 columns) */}
          <div className="lg:col-span-5 flex flex-col justify-between p-6 md:p-8 bg-[#0F0F12] border border-white/10 rounded-sm relative ark-border-box corner-br animate-project-right">
            
            {/* Dossier top info */}
            <div>
              <span className="text-[10px] text-ark-cyan font-mono tracking-widest block font-bold mb-2">PROJECT Dossier // {currentProject.id.toUpperCase()}</span>
              <h3 className="text-xl font-bold text-white tracking-wide font-sans mb-1">
                {currentProject.title}
              </h3>
              <span className="text-[10px] text-neutral-500 font-mono tracking-wider block mb-4 border-b border-white/5 pb-3">
                {currentProject.device} / {currentProject.tag}
              </span>

              <p className="text-neutral-400 text-xs leading-relaxed font-light mb-6">
                {currentProject.desc}
              </p>

              {/* Tech Stack tags */}
              <div className="mb-6">
                <span className="text-[9px] text-ark-cyan font-mono tracking-widest block font-bold mb-2">COMPILATION_ENV / 技术栈</span>
                <div className="flex flex-wrap gap-2">
                  {currentProject.tech.map((t) => (
                    <span 
                      key={t} 
                      className="px-2 py-0.5 border border-white/10 bg-white/5 text-[9px] font-mono text-neutral-300 rounded-sm"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Simulating running processes logs */}
            <div className="font-mono text-[9px] bg-[#070709] border border-white/5 p-4 rounded-sm text-neutral-400 space-y-1.5 overflow-hidden">
              <span className="text-ark-green block font-bold tracking-widest mb-2 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-ark-green animate-pulse" />
                EXECUTION_LOG_SIMULATOR
              </span>
              
              <div className="space-y-1 leading-normal">
                {currentProject.logs.map((log, i) => {
                  const rotatedIndex = (i + logOffset) % currentProject.logs.length;
                  const logText = currentProject.logs[rotatedIndex];
                  return (
                    <div key={i} className="truncate">
                      <span className="text-neutral-600 mr-2">&gt;</span>
                      <span className={logText.includes('STATUS:') || logText.includes('DONE') ? 'text-white' : 'text-neutral-400'}>
                        {logText}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
