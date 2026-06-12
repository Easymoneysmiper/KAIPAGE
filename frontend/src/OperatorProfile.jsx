import { useState } from 'react';

// Data representing different "Operator Roles" or specializations
const SPECIALTIES = [
  {
    id: 'arch',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    title: '系统架构设计师',
    subtitle: 'SYSTEM ARCHITECT',
    stats: {
      concurrency: '优良 EXCELLENT',
      database: '卓越 OUTSTANDING',
      architecture: '卓越 OUTSTANDING',
      collaboration: '标准 STANDARD',
      innovative: '卓越 OUTSTANDING',
    },
    bio: '专注于大流量分布式架构设计、高性能关系型存储与消息通道设计。熟练保障高并发扣减、消息无损传递等大型后端核心链路安全稳定运行。',
    evaluation: '该开发干员在系统架构设计上拥有深厚的理论基础与落地经验，对高可用架构有着敏锐的洞察力。',
  },
  {
    id: 'concur',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    title: '并发性能专家',
    subtitle: 'CONCURRENCY SPECIALIST',
    stats: {
      concurrency: '卓越 OUTSTANDING',
      database: '优良 EXCELLENT',
      architecture: '优良 EXCELLENT',
      collaboration: '标准 STANDARD',
      innovative: '标准 STANDARD',
    },
    bio: '深度钻研 Java 并发多线程（JUC）、JVM 内存调优与垃圾回收、分布式事务与多版本并发控制（MVCC），擅长排查复杂死锁与线程阻塞问题。',
    evaluation: '高并发秒杀扣减模拟器等核心组件的关键设计者。对 AQS 独占共享与 CAS 原子指令有极高掌控力。',
  },
  {
    id: 'ai_dev',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
    title: 'AI 协同创新干员',
    subtitle: 'AI CO-INNOVATION AGENT',
    stats: {
      concurrency: '标准 STANDARD',
      database: '标准 STANDARD',
      architecture: '优良 EXCELLENT',
      collaboration: '卓越 OUTSTANDING',
      innovative: '卓越 OUTSTANDING',
    },
    bio: '极高效率的 Vibe Coding 实践者，熟练运用 Cursor、Claude Code、Spring AI 等工具进行提示词调优、自动重构与检索增强生成（RAG）方案设计。',
    evaluation: '在人机结对重构及大模型向量服务领域具有突破性的交付效率，属于高响应速度的前沿开发力量。',
  }
];

export default function OperatorProfile() {
  const [selectedSpecialty, setSelectedSpecialty] = useState(SPECIALTIES[0]);

  return (
    <section className="relative w-full py-24 border-b border-white/5 bg-[#0A0A0C] overflow-hidden ark-grid">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0C] via-transparent to-[#0A0A0C] pointer-events-none z-10" />

      {/* Decorative vertical coordinates overlay */}
      <div className="absolute top-12 left-12 hidden xl:block text-[9px] text-neutral-600 font-mono select-none tracking-widest z-10 leading-relaxed">
        <div>RHODES ISLAND // PROFILE DEPT</div>
        <div>SYS_STATUS: LOCALHOST_OK</div>
        <div>COORDS_GRID: 54X-88Y</div>
      </div>

      <div className="relative w-full max-w-[1700px] mx-auto px-6 md:px-12 z-20">
        
        {/* Module Subtitle */}
        <div className="flex items-center gap-4 mb-16 border-b border-white/10 pb-4 font-mono">
          <span className="text-ark-cyan text-sm tracking-widest font-bold">PROFILE // 02</span>
          <span className="text-neutral-500 text-xs">/ 干员个人档案与技术核心优势</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* Left panel: Tactical Coder Stats Dossier (6 columns) */}
          <div className="lg:col-span-6 flex flex-col justify-between p-6 md:p-8 bg-[#0F0F12]/90 border border-white/10 rounded-sm relative ark-border-box corner-tl animate-profile-card">
            
            {/* Header info */}
            <div>
              <div className="flex items-baseline justify-between mb-6">
                <div>
                  <span className="text-[10px] text-ark-cyan tracking-widest font-mono block">CODENAME / 代号</span>
                  <h2 className="text-3xl font-black text-white tracking-widest font-sans flex items-center gap-3">
                    彭凯 <span className="text-ark-cyan font-mono text-sm tracking-wider">KAI</span>
                  </h2>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-neutral-500 tracking-widest font-mono block">AFFILIATION / 势力</span>
                  <span className="text-xs font-bold text-white tracking-wide uppercase font-mono">JILIN_UNIV // 软件工程</span>
                </div>
              </div>

              {/* Dossier info list */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6 border-t border-b border-white/5 py-5 mb-6 text-xs font-mono">
                <div>
                  <span className="text-[10px] text-neutral-500 block">SEX / 性别</span>
                  <span className="text-white font-bold">MALE / 男</span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-500 block">POSITION / 职业定位</span>
                  <span className="text-ark-cyan font-bold">JAVA BACKEND DEVELOPER</span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-500 block">GRADUATION / 毕业年限</span>
                  <span className="text-white font-bold">2027 CLASS / 2027届</span>
                </div>
              </div>

              {/* Tactical stats bars */}
              <div className="space-y-4 mb-6 font-mono">
                <span className="text-[10px] text-ark-cyan tracking-widest block font-bold">TACTICAL EVALUATION / 战术评估指标</span>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                  {/* Stats items */}
                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-neutral-400">CONCURRENCY / 高并发</span>
                      <span className="text-white">{selectedSpecialty.stats.concurrency}</span>
                    </div>
                    <div className="h-1 bg-white/10 relative">
                      <div 
                        className="h-full bg-ark-cyan shadow-[0_0_5px_#00f0ff] transition-all duration-500" 
                        style={{ width: selectedSpecialty.stats.concurrency.includes('OUTSTANDING') ? '95%' : selectedSpecialty.stats.concurrency.includes('EXCELLENT') ? '82%' : '65%' }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-neutral-400">DATABASE / 关系型存储</span>
                      <span className="text-white">{selectedSpecialty.stats.database}</span>
                    </div>
                    <div className="h-1 bg-white/10 relative">
                      <div 
                        className="h-full bg-ark-cyan shadow-[0_0_5px_#00f0ff] transition-all duration-500" 
                        style={{ width: selectedSpecialty.stats.database.includes('OUTSTANDING') ? '95%' : selectedSpecialty.stats.database.includes('EXCELLENT') ? '82%' : '65%' }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-neutral-400">ARCHITECTURE / 分布式架构</span>
                      <span className="text-white">{selectedSpecialty.stats.architecture}</span>
                    </div>
                    <div className="h-1 bg-white/10 relative">
                      <div 
                        className="h-full bg-ark-cyan shadow-[0_0_5px_#00f0ff] transition-all duration-500" 
                        style={{ width: selectedSpecialty.stats.architecture.includes('OUTSTANDING') ? '95%' : selectedSpecialty.stats.architecture.includes('EXCELLENT') ? '82%' : '65%' }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-neutral-400">AI COLLABORATION / AI协同开发</span>
                      <span className="text-white">{selectedSpecialty.stats.collaboration}</span>
                    </div>
                    <div className="h-1 bg-white/10 relative">
                      <div 
                        className="h-full bg-ark-cyan shadow-[0_0_5px_#00f0ff] transition-all duration-500" 
                        style={{ width: selectedSpecialty.stats.collaboration.includes('OUTSTANDING') ? '95%' : selectedSpecialty.stats.collaboration.includes('EXCELLENT') ? '82%' : '65%' }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Bio & Evaluation text */}
              <div className="space-y-4 font-sans border-t border-white/5 pt-5">
                <div>
                  <span className="text-[10px] font-mono text-neutral-500 tracking-wider block mb-1">DOSSIER / 履历档案</span>
                  <p className="text-neutral-300 text-xs leading-relaxed font-light">
                    {selectedSpecialty.bio}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-neutral-500 tracking-wider block mb-1">CLINICAL EVALUATION / 督导评估</span>
                  <p className="text-neutral-400 text-xs leading-relaxed font-light italic">
                    {selectedSpecialty.evaluation}
                  </p>
                </div>
              </div>
            </div>

            {/* Specialty variants selector at bottom */}
            <div className="mt-8 pt-4 border-t border-white/15">
              <span className="text-[10px] text-ark-cyan font-mono tracking-widest block mb-3 font-bold">SPECIALIZATION VARIANTS / 选择干员类型</span>
              <div className="flex gap-4">
                {SPECIALTIES.map((spec) => {
                  const isCurrent = spec.id === selectedSpecialty.id;
                  return (
                    <button
                      key={spec.id}
                      onClick={() => setSelectedSpecialty(spec)}
                      className={`flex-1 flex items-center gap-3 p-2 border transition-all duration-300 rounded-sm cursor-pointer ${
                        isCurrent 
                          ? 'border-ark-cyan bg-ark-cyan/10 shadow-[0_0_8px_rgba(0,240,255,0.2)]' 
                          : 'border-white/10 bg-white/5 hover:border-white/20'
                      }`}
                    >
                      <img 
                        src={spec.avatar} 
                        alt={spec.title} 
                        className={`w-7 h-7 rounded-sm object-cover border transition-colors ${isCurrent ? 'border-ark-cyan' : 'border-white/10'}`} 
                      />
                      <div className="flex flex-col text-left font-mono">
                        <span className={`text-[10px] font-bold ${isCurrent ? 'text-white' : 'text-neutral-400'}`}>
                          {spec.title.slice(0, 4)}...
                        </span>
                        <span className="text-[7px] text-neutral-500 uppercase tracking-tighter">
                          {spec.subtitle.split(' ')[0]}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Right panel: Giant artwork illustration frame (6 columns) */}
          <div className="lg:col-span-6 flex flex-col justify-center items-center relative min-h-[400px] lg:min-h-0 bg-[#070709] border border-white/10 rounded-sm overflow-hidden group animate-profile-artwork">
            
            {/* Tech grid elements inside frame */}
            <div className="absolute inset-0 ark-grid pointer-events-none opacity-20" />
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1px] bg-white/10 pointer-events-none" />
            <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[1px] bg-white/10 pointer-events-none" />
            
            {/* HUD Corner accents around artwork */}
            <span className="absolute top-2 left-2 w-3 h-3 border-t border-l border-white/30" />
            <span className="absolute top-2 right-2 w-3 h-3 border-t border-r border-white/30" />
            <span className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-white/30" />
            <span className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-white/30" />

            {/* Scanning line animation overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-ark-cyan/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 ark-scanbar" />

            {/* Giant artwork placeholder with HUD overlay */}
            <div className="relative w-[85%] h-[85%] flex items-center justify-center border border-white/5 bg-[#0F0F12]/60 overflow-hidden">
              
              {/* Overlay crosshair coordinates */}
              <div className="absolute bottom-3 left-3 text-[8px] text-neutral-600 font-mono tracking-widest uppercase">
                IMG_SECURE_HASH: 0x93FF48
              </div>

              {/* Developer character illustration */}
              <div className="relative w-full h-full flex items-center justify-center p-4">
                {/* Cyberpunk shadow/silhouette background vector or stylized image */}
                <div className="absolute w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,rgba(0,240,255,0.06)_0,transparent_70%)] animate-pulse pointer-events-none" />
                
                {/* Visualizer silhouette representing KAI developer artwork */}
                <svg className="w-full h-full max-w-[280px] text-[#1D1D24] drop-shadow-[0_0_20px_rgba(0,240,255,0.15)] group-hover:scale-105 transition-transform duration-700" viewBox="0 0 100 100" fill="currentColor">
                  {/* Human developer silhouette with coding HUD */}
                  <path d="M50 15c-7.2 0-13 5.8-13 13s5.8 13 13 13 13-5.8 13-13-5.8-13-13-13zm0 2c6 0 11 5 11 11s-5 11-11 11-11-5-11-11 5-11 11-11zm-20 38c-8.8 0-16 7.2-16 16v14h72V71c0-8.8-7.2-16-16-16H30zm0 2h40c7.8 0 14 6.2 14 14v12H16V71c0-7.8 6.2-14 14-14z" />
                  {/* Stylized code glyph outline */}
                  <path d="M18 30l-4 4 4 4M82 30l4 4-4 4M46 25l8 50" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
                </svg>

                {/* Tactical holographic UI tags on top of artwork */}
                <div className="absolute top-6 right-6 font-mono text-[9px] text-ark-cyan border border-ark-cyan/30 bg-ark-cyan/5 px-2 py-0.5 rounded-sm shadow-[0_0_5px_rgba(0,240,255,0.2)]">
                  SYS_MODEL: KAI_V1
                </div>

                <div className="absolute bottom-6 right-6 font-mono text-[9px] text-ark-green border border-ark-green/30 bg-ark-green/5 px-2 py-0.5 rounded-sm">
                  SECURITY: GRANTED
                </div>
              </div>
            </div>

            {/* Corner tags for decorative aesthetic */}
            <div className="absolute top-4 left-4 font-mono text-[9px] text-neutral-500 uppercase tracking-widest">
              RHODES ISLAND SPECIAL DOSSIER
            </div>
            
          </div>

        </div>

      </div>
    </section>
  );
}
