import React, { useState, useEffect, useRef } from 'react';
import GooeyNav from './GooeyNav';
import ElectricBorder from './ElectricBorder';
import SplitText from './SplitText';
import RotatingText from './RotatingText';
import ProfileCard from './ProfileCard';
import MagicBento from './MagicBento';
import ScrollFloat from './ScrollFloat';
import TextType from './TextType';
import Lanyard from './Lanyard';

// ==================== Canvas Texture Helpers for 3D Lanyard Card ====================
const wrapText = (ctx, text, x, y, maxWidth, lineHeight) => {
  const words = text.split('');
  let line = '';
  for (let n = 0; n < words.length; n++) {
    let testLine = line + words[n];
    let metrics = ctx.measureText(testLine);
    let testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line, x, y);
      line = words[n];
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, y);
};

const roundRect = (ctx, x, y, width, height, radius, fill, stroke) => {
  if (typeof radius === 'number') {
    radius = { tl: radius, tr: radius, br: radius, bl: radius };
  } else {
    radius = { tl: 0, tr: 0, br: 0, bl: 0, ...radius };
  }
  ctx.beginPath();
  ctx.moveTo(x + radius.tl, y);
  ctx.lineTo(x + width - radius.tr, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
  ctx.lineTo(x + width, y + height - radius.br);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
  ctx.lineTo(x + radius.bl, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
  ctx.lineTo(x, y + radius.tl);
  ctx.quadraticCurveTo(x, y, x + radius.tl, y);
  ctx.closePath();
  if (fill) ctx.fill();
  if (stroke) ctx.stroke();
};

const drawPill = (ctx, text, x, y, bg, borderCol) => {
  ctx.font = 'bold 24px "Plus Jakarta Sans", "Outfit", sans-serif';
  const metrics = ctx.measureText(text);
  const w = metrics.width + 40;
  const h = 50;
  ctx.fillStyle = bg;
  ctx.strokeStyle = borderCol;
  ctx.lineWidth = 1.5;
  roundRect(ctx, x, y, w, h, h / 2, true, true);
  ctx.fillStyle = borderCol;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, x + w / 2, y + h / 2);
  ctx.textBaseline = 'alphabetic'; // restore
};

const generateFrontTexture = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1536;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  // Background gradient
  const grad = ctx.createLinearGradient(0, 0, 0, 1536);
  grad.addColorStop(0, '#0F0F12');
  grad.addColorStop(1, '#050507');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 1536);

  // Technological grid lines
  ctx.strokeStyle = 'rgba(255, 107, 0, 0.04)';
  ctx.lineWidth = 1;
  for (let i = 0; i < 1024; i += 64) {
    ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 1536); ctx.stroke();
  }
  for (let i = 0; i < 1536; i += 64) {
    ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(1024, i); ctx.stroke();
  }

  // Sleek white border around the card
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.95)';
  ctx.lineWidth = 20;
  ctx.strokeRect(10, 10, 1004, 1516);
  
  // Thin inner orange line
  ctx.strokeStyle = 'rgba(255, 107, 0, 0.5)';
  ctx.lineWidth = 4;
  ctx.strokeRect(30, 30, 964, 1476);

  // Sleek header
  ctx.font = 'bold 36px "Plus Jakarta Sans", "Outfit", sans-serif';
  ctx.fillStyle = '#FF6B00';
  ctx.textAlign = 'center';
  ctx.fillText('——  BIO & EDUCATION  ——', 512, 130);

  // Slogan (Title from Figure 2)
  ctx.font = 'bold 52px "Plus Jakarta Sans", "Outfit", sans-serif';
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.fillText('专注于技术厚度与', 512, 250);
  ctx.fillText('极致的高吞吐服务设计', 512, 330);

  // Description
  ctx.font = '30px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#A0A0AB';
  ctx.textAlign = 'left';
  
  const descText = '目前就读于吉林大学（985、211、双一流）软件学院软件工程专业。在校期间深度钻研并发底层理论与大型高并发高一致性系统的架构，注重系统底层优化。提倡 AI 辅助开发 (Vibe Coding)，通过熟练运用 Claude code 等 AI 工具配合深厚的代码素养大幅提高功能研发的交付质量与效率。';
  wrapText(ctx, descText, 80, 440, 864, 52);

  // JLU Background watermark
  ctx.save();
  ctx.globalAlpha = 0.08;
  ctx.font = 'bold 300px "Outfit", sans-serif';
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('JLU', 512, 850);
  ctx.restore();

  // Bottom Divider
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(80, 1150);
  ctx.lineTo(944, 1150);
  ctx.stroke();

  // JLU Badge
  ctx.fillStyle = '#FF6B00';
  ctx.beginPath();
  ctx.arc(140, 1240, 40, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 30px "Outfit", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('J', 140, 1240);

  // Text details next to JLU logo
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 36px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('吉林大学 · 软件工程本科', 210, 1225);
  ctx.fillStyle = '#71717A';
  ctx.font = '26px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('软件学院 | 卓越工程师体系培养班 2023.09 - 2027.06', 210, 1270);

  // Pills: 985/211 and 软件工程专业 at the bottom
  drawPill(ctx, '985 / 211', 80, 1340, 'rgba(255, 255, 255, 0.05)', '#A0A0AB');
  drawPill(ctx, '软件工程专业', 280, 1340, 'rgba(255, 107, 0, 0.1)', '#FF6B00');

  return canvas.toDataURL('image/png');
};

const generateBackTexture = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1536;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  // Background gradient
  const grad = ctx.createLinearGradient(0, 0, 0, 1536);
  grad.addColorStop(0, '#0F0F12');
  grad.addColorStop(1, '#050507');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 1536);

  // Grid
  ctx.strokeStyle = 'rgba(255, 107, 0, 0.04)';
  ctx.lineWidth = 1;
  for (let i = 0; i < 1024; i += 64) {
    ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 1536); ctx.stroke();
  }
  for (let i = 0; i < 1536; i += 64) {
    ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(1024, i); ctx.stroke();
  }

  // Sleek white border
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.95)';
  ctx.lineWidth = 20;
  ctx.strokeRect(10, 10, 1004, 1516);
  
  ctx.strokeStyle = 'rgba(255, 107, 0, 0.5)';
  ctx.lineWidth = 4;
  ctx.strokeRect(30, 30, 964, 1476);

  // Sleek header
  ctx.font = 'bold 36px "Plus Jakarta Sans", "Outfit", sans-serif';
  ctx.fillStyle = '#FF6B00';
  ctx.textAlign = 'center';
  ctx.fillText('——  TECHNICAL METRICS  ——', 512, 130);

  // Metrics
  const cards = [
    {
      title: '缓存穿透/击穿/雪崩',
      value: '100% 拦截解决率',
      desc: 'Cache Aside 模式，热点锁及空值机制'
    },
    {
      title: '智能体最大决策安全',
      value: '10 步上限控制',
      desc: 'ReAct Loop 死循环实时检测防御'
    },
    {
      title: '高并发秒杀并发吞吐',
      value: 'X 10 倍效率提升',
      desc: 'Lua脚本原子操作 + Kafka 异步削峰下单'
    }
  ];

  let startY = 220;
  cards.forEach((card, index) => {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 2;
    roundRect(ctx, 80, startY, 864, 320, 16, true, true);

    ctx.fillStyle = '#FF6B00';
    roundRect(ctx, 80, startY, 12, 320, { tl: 16, bl: 16, tr: 0, br: 0 }, true, false);

    ctx.fillStyle = '#71717A';
    ctx.font = 'bold 30px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(card.title, 130, startY + 70);

    ctx.fillStyle = '#FF6B00';
    ctx.font = 'bold 64px "Outfit", sans-serif';
    ctx.fillText(card.value, 130, startY + 170);

    ctx.fillStyle = '#A0A0AB';
    ctx.font = '26px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(card.desc, 130, startY + 250);

    startY += 360;
  });

  // Bottom watermark
  ctx.font = 'bold 24px "Outfit", sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.textAlign = 'center';
  ctx.fillText('PENGKAI.DEV | PING ME', 512, 1400);

  return canvas.toDataURL('image/png');
};


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

const TerminalIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const navItems = [
  { label: "01 HOME", href: "#hero" },
  { label: "02 BIO & LIFE", href: "#experience" },
  { label: "03 CORE SKILLS", href: "#competencies" },
];

export default function App() {
  // 1. 滚动进度 state
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeTab, setActiveTab] = useState('all');

  // 2. 交互智能体（Travel Agent）模拟器核心 State
  const [agentState, setAgentState] = useState('idle'); // idle -> user_input -> rag_search -> tool_calling -> mcp_mats -> output
  const [agentLogs, setAgentLogs] = useState([]);
  const [userQuery, setUserQuery] = useState('');

  // 3. 享吃点高并发秒杀模拟器 State
  const [secStock, setSecStock] = useState(10);
  const [qpsValue, setQpsValue] = useState(0);
  const [secStatus, setSecStatus] = useState('waiting'); // waiting -> processing -> empty
  const [secLogs, setSecLogs] = useState([]);

  // 4. VibeCoding 自研重构助手 State
  const [vibeCodeStage, setVibeCodeStage] = useState('idle');
  const [vibeOutput, setVibeOutput] = useState('');

  // 5. Lanyard 悬挂卡片 3D State
  const [textures, setTextures] = useState({ front: null, back: null });
  const [isLanyardOpen, setIsLanyardOpen] = useState(false);
  const [hasOpenedOnce, setHasOpenedOnce] = useState(false);
  const lanyardRef = useRef(null);

  useEffect(() => {
    if (!isLanyardOpen) return;
    const handleOutsideClick = (e) => {
      if (lanyardRef.current && !lanyardRef.current.contains(e.target)) {
        setIsLanyardOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isLanyardOpen]);

  useEffect(() => {
    if (isLanyardOpen) {
      setHasOpenedOnce(true);
    }
  }, [isLanyardOpen]);

  useEffect(() => {
    const front = generateFrontTexture();
    const back = generateBackTexture();
    setTextures({ front, back });
  }, []);

  // Canvas 背景引用
  const canvasRef = useRef(null);

  // 监听全局滚动
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress((window.pageYOffset / totalScroll) * 100);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 交互式 Canvas背景网络粒子
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

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

  // ------------------ 智能旅行助手模拟流 ------------------
  const runAgentSimulation = (query) => {
    if (!query.trim()) {
      alert("请输入你想去的旅行地点或偏好（如：吉林长春市三天冰雪之旅）");
      return;
    }
    setUserQuery(query);
    setAgentState('user_input');
    setAgentLogs([]);

    const pushLog = (text, delay) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          setAgentLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${text}`]);
          resolve();
        }, delay);
      });
    };

    pushLog(`收到用户规划指令: "${query}"`, 0)
      .then(() => {
        setAgentState('rag_search');
        return pushLog("RAG重写: 触发 Multi-Query 原信息增强，生成 3 组子检索句。正在遍历向量数据库中长春、吉大周边及净月潭景区文档切片...", 1200);
      })
      .then(() => {
        return pushLog("文档切片相关度召回: 匹配到 4 篇精确文档 (召回度：94.5%)。提取元数据 (冰雪节优惠、推荐线路)...", 1000);
      })
      .then(() => {
        setAgentState('tool_calling');
        return pushLog("触发 Tool Calling: Spring AI Function Calling 成功注入。发起高德实时交通拥慢与实时天气 API 调度...", 1000);
      })
      .then(() => {
        return pushLog("API 实时回调返回: 长春市当前气温 -12°C，今日推荐以室内冰雪活动和伪满皇宫为主，交通顺畅...", 900);
      })
      .then(() => {
        setAgentState('mcp_mats');
        return pushLog("深度连接 MCP 协议服务端: 采用 SSE 双传输模式。成功集成高德地图精准推荐 MCP 以及多模态图片检索 MCP 节点...", 1100);
      })
      .then(() => {
        return pushLog("检测 ReAct 自主智能体状态: 最大执行步数限制为 10 步。当前第 3 步，死循环检测器状态绿色正常...", 800);
      })
      .then(() => {
        setAgentState('output');
        return pushLog("智能规划完成。成功输出 PDF 旅行指南格式及多模态卡片信息：[1. 南湖公园雪雕-2. 吉大前卫南区极光大剧院-3. 享吃点美食汇]", 1000);
      });
  };

  // ------------------ 享吃点秒杀模拟流 ------------------
  const triggerSecKill = () => {
    if (secStock <= 0) {
      alert("抢购商品已被一抢而空，请刷新或稍后再试");
      return;
    }
    setSecStatus('processing');
    setQpsValue(4500 + Math.floor(Math.random() * 800));
    setSecLogs([]);

    const logList = [
      "⚡ 瞬时并发流量接入，QPS 直线上飙至 5,200+！开启集群弹性伸缩机制",
      "🔑 第一层安全防护: Redis 分布式集群拦截。验证 Session 与 Token 自动续期",
      "📦 第二层熔断防线: Redis Lua 脚本进行原子化资格预检与扣减库存",
      "🛡️ 第三层严谨拦截: 运用 Redisson 分布式锁严密校验『一人一单』，抵挡同一用户重放攻击",
      "🎯 资格预检成功！库存减少 -1。正在压入 Kafka 核心下单主题(topic-share-eat-order)",
      "📨 Kafka 消费者启动：主线程异步脱离落库耗时任务，接口吞吐量实现无阻流输出",
      "💾 异步线程异步落库 MySQL，触发 CAS 乐观锁扣减库存。数据最终一致性建立！"
    ];

    let step = 0;
    const interval = setInterval(() => {
      if (step < logList.length) {
        setSecLogs((prev) => [...prev, logList[step]]);
        step++;
      } else {
        clearInterval(interval);
        setSecStock((prev) => Math.max(0, prev - 1));
        setQpsValue(0);
        setSecStatus(secStock - 1 <= 0 ? 'empty' : 'waiting');
      }
    }, 650);
  };

  // ------------------ Vibe Coding 智能重构流 ------------------
  const triggerVibeCode = (templateType) => {
    setVibeCodeStage('running');
    setVibeOutput('');
    
    let content = "";
    let fullText = "";

    if (templateType === 'rag') {
      fullText = `// Vibe Coding: 协同 Claude Code 生成高阶向量检索逻辑\n` +
                 `@Service\n` +
                 `public class HighPrecisionRAGService {\n` +
                 `    @Autowired private VectorStore vectorStore;\n` +
                 `    public List<Document> queryWithMetadata(String queryText) {\n` +
                 `        return vectorStore.similaritySearch(\n` +
                 `            SearchRequest.query(queryText)\n` +
                 `                .withTopK(5)\n` +
                 `                .withSimilarityThreshold(0.85)\n` +
                 `                .withFilterExpression("class == 'SoftwareEng'")\n` +
                 `        );\n` +
                 `    }\n` +
                 `}`;
    } else {
      fullText = `// Vibe Coding: 高并发 Redis分布式锁原子预减扣减方案\n` +
                 `@Transactional\n` +
                 `public boolean secKillOrder(String userId, Long orderId) {\n` +
                 `    String lockKey = "lock:order:" + userId;\n` +
                 `    RLock lock = redissonClient.getLock(lockKey);\n` +
                 `    if (lock.tryLock(3, 10, TimeUnit.SECONDS)) {\n` +
                 `        try {\n` +
                 `            kafkaTemplate.send("order_topic", new OrderEvent(userId, orderId));\n` +
                 `            return true;\n` +
                 `        } finally { lock.unlock(); }\n` +
                 `    }\n` +
                 `    return false;\n` +
                 `}`;
    }

    let index = 0;
    const timer = setInterval(() => {
      if (index < fullText.length) {
        content += fullText[index];
        setVibeOutput(content);
        index += 3; // 加快模拟打印速度
      } else {
        clearInterval(timer);
        setVibeCodeStage('done');
      }
    }, 15);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-white selection:bg-[#FF6B00] selection:text-white relative font-sans overflow-x-hidden">
      

      {/* 顶部滚动条 */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-neutral-900 z-[70]">
        <div 
          className="h-full bg-gradient-to-r from-[#FF6B00] to-amber-500 transition-all duration-100" 
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* ==================== 1. 极简网格导航栏 ==================== */}
      <div className="fixed top-6 left-0 right-0 z-[9999] flex justify-center px-4 md:px-12">
        <div className="relative w-full max-w-[1700px]" ref={lanyardRef}>
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
                initialActiveIndex={0}
                animationTime={600}
                timeVariance={1400}
                colors={[1, 2, 3, 1, 2, 3, 1, 4]}
              />
            </div>

            <button 
              onClick={(e) => {
                e.preventDefault();
                setIsLanyardOpen(prev => !prev);
              }}
              className="bg-white hover:bg-neutral-200 text-black text-[11px] font-mono font-bold uppercase px-5 py-2.5 rounded-lg transition-all duration-300 shadow-md cursor-pointer block"
            >
              PING ME
            </button>
          </nav>

          {/* Lanyard Box (z-10 absolute, behind nav bar but overlaps in top coordinate, w-2000px centered relative to button) */}
          <div 
            className={`absolute right-[56px] translate-x-1/2 top-0 w-[2000px] h-[750px] z-10 overflow-hidden transition-all duration-700 cubic-bezier(0.34, 1.56, 0.64, 1) origin-top ${
              isLanyardOpen 
                ? 'opacity-100 translate-y-0 pointer-events-auto' 
                : 'opacity-0 -translate-y-[250px] pointer-events-none'
            }`}
          >
            {textures.front && textures.back && isLanyardOpen && (
              <Lanyard 
                position={[0, 0, 18]} 
                gravity={[0, -40, 0]} 
                frontImage={textures.front} 
                backImage={textures.back} 
                lanyardWidth={0.41}
                onClose={() => setIsLanyardOpen(false)}
              />
            )}
          </div>
        </div>
      </div>

      {/* ==================== 2. 全屏首页 HERO 区域 ==================== */}
      <section id="hero" className="relative h-screen flex flex-col justify-start pt-40 md:pt-52 overflow-hidden pb-24 md:pb-32 px-6 md:px-12 border-b border-neutral-900">
        
        {/* 【在线静态无缝播放视频 - z-10】
          - 这里为了在右侧预览窗口顺利展示，使用的是公共 CDN 视频。
          - ⚠️ 部署到本地时：请将 src 替换为 src="./2月17日_1_.webm" 或 import 导入。
        */}
        <video
          src="/background.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-10 opacity-65 pointer-events-none"
        />

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
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0C] via-[#0A0A0C]/30 to-black/20 pointer-events-none z-25" />

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
      <section id="experience" className="relative bg-[#0F0F12] py-28 border-b border-neutral-900">
        
        {/* 背景大格网划分线 */}
        <div className="absolute inset-0 pointer-events-none z-0 grid grid-cols-1 md:grid-cols-12 max-w-[1700px] mx-auto w-full">
          <div className="col-span-3 border-r border-neutral-900/60 h-full"></div>
          <div className="col-span-6 border-r border-neutral-900/60 h-full"></div>
          <div className="col-span-3 h-full"></div>
        </div>

        <div className="relative w-full max-w-[1700px] mx-auto px-6 md:px-12 z-20">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            
            {/* 左侧头像大卡片/抽象艺术图 (占 4 列) */}
            <div className="lg:col-span-4 space-y-6">
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
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-px bg-[#FF6B00]"></span>
                    <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-[#FF6B00]">LIFE & CODING REFLECTION</span>
                  </div>
                  <h2 className="font-display text-2xl md:text-3xl font-black tracking-tighter uppercase text-white leading-none">
                    吉大四季、美食与极客生活
                  </h2>
                </div>
                
                {/* 过滤器 */}
                <div className="flex flex-wrap gap-1.5 text-[10px] font-mono">
                  {['all', 'campus', 'life_style', 'tech'].map((tab) => (
                    <button 
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={"px-3 py-1.5 rounded-full border transition-all cursor-pointer " + (activeTab === tab ? "bg-[#FF6B00] border-[#FF6B00] text-black font-bold" : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white")}
                    >
                      {tab === "all" && "全部记录"}
                      {tab === "campus" && "🏫 校园"}
                      {tab === "life_style" && "🍳 生活"}
                      {tab === "tech" && "📝 思考"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Daylight 风格不规则高阶视觉相册网格 (在 8 列内适配为三栏) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                
                {/* 卡片 1: 北区大雪 */}
                {(activeTab === 'all' || activeTab === 'campus') && (
                  <div className="bg-[#111115] border border-neutral-800 hover:border-[#FF6B00]/40 rounded-2xl overflow-hidden group transition-all duration-300 flex flex-col h-full">
                    <div className="aspect-[16/10] overflow-hidden relative">
                      <img src="https://images.unsplash.com/photo-1547989453-11e67ffb3885?auto=format&fit=crop&w=800&q=80" alt="长春大雪" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[8px] font-mono text-neutral-300">CAMPUS</div>
                    </div>
                    <div className="p-4 space-y-2 flex-grow flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <span className="text-[9px] font-mono text-[#FF6B00] block">长春 · 吉大北区雪景</span>
                        <h4 className="font-display text-sm text-white font-bold tracking-tight uppercase group-hover:text-[#FF6B00] transition-colors line-clamp-1">吉大北区的四季与初雪</h4>
                        <p className="text-[11px] text-neutral-400 leading-relaxed font-light line-clamp-4">银装素裹的前卫南区，和北风里呼出的白气。每次深夜写完高并发重构，从软院机房里走出来，世界都变得极为寂静...</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* 卡片 2: 键盘咖啡极客桌面 */}
                {(activeTab === 'all' || activeTab === 'life_style') && (
                  <div className="bg-[#111115] border border-neutral-800 hover:border-[#FF6B00]/40 rounded-2xl overflow-hidden group transition-all duration-300 flex flex-col h-full">
                    <div className="aspect-[16/10] overflow-hidden relative">
                      <img src="https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=800&q=80" alt="桌面搭建" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[8px] font-mono text-neutral-300">LIFE</div>
                    </div>
                    <div className="p-4 space-y-2 flex-grow flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <span className="text-[9px] font-mono text-[#FF6B00] block">GEEK GEAR</span>
                        <h4 className="font-display text-sm text-white font-bold tracking-tight uppercase group-hover:text-[#FF6B00] transition-colors line-clamp-1">深夜咖啡与机械键盘的节律</h4>
                        <p className="text-[11px] text-neutral-400 leading-relaxed font-light line-clamp-4">精心搭建起来的 1700px 视宽多层副屏，和手里时刻准备着续期 Token 的 Redis 热窗。敲下每一行 Java 代码都充满纯粹秩序感。</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* 卡片 3: 人机协同的思考 */}
                {(activeTab === 'all' || activeTab === 'tech') && (
                  <div className="bg-[#111115] border border-neutral-800 hover:border-[#FF6B00]/40 rounded-2xl overflow-hidden group transition-all duration-300 flex flex-col h-full">
                    <div className="aspect-[16/10] overflow-hidden relative">
                      <img src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80" alt="人工智能" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[8px] font-mono text-neutral-300">REVOLUTION</div>
                    </div>
                    <div className="p-4 space-y-2 flex-grow flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <span className="text-[9px] font-mono text-[#FF6B00] block">AI EXPLORATION</span>
                        <h4 className="font-display text-sm text-white font-bold tracking-tight uppercase group-hover:text-[#FF6B00] transition-colors line-clamp-1">Vibe Coding 带来开发新范式吗？</h4>
                        <p className="text-[11px] text-neutral-400 leading-relaxed font-light line-clamp-4">结合 Claude Code 交付需求，开发已经变为“设计与状态治理”的哲学。后端研发不仅要关注底层，还要关注大模型指令集。</p>
                      </div>
                    </div>
                  </div>
                )}

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