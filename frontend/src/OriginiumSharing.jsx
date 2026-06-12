import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';

// Import image assets
import imgConcurrency from './assets/tech_concurrency.webp';
import imgRag from './assets/tech_rag.webp';
import imgCoffee from './assets/life_coffee.webp';
import imgThread from './assets/life_thread.webp';

// Static mock posts with rich HTML content
const MOCK_POSTS = [
  {
    id: 1,
    category: 'tech',
    title: '高并发秒杀扣减的 7 层高可靠架构设计与验证',
    date: '2026 // 06 // 10',
    tag: 'DISTRIBUTED_SYSTEMS',
    summary: '针对大流量并发场景，采用 Redis 乐观锁原子化扣减与 Kafka 异步削峰。本文探讨如何通过两阶段提交、本地事务事务校验与消息防重来应对极端雪崩。',
    url: 'HTTPS://KAI.DEV/POST/SECKILL-ARCHITECTURE',
    image: imgConcurrency,
    subIndex: '01',
    content: `
      <h3>1. 业务场景与痛点</h3>
      <p>在高并发秒杀扣减场景中，核心痛点在于如何确保<strong>高性能</strong>的同时，不发生<strong>超卖（库存扣为负数）</strong>或<strong>少卖（库存扣减失败但实际上还有货）</strong>。传统数据库事务在应对万级 TPS 时会因为行级锁竞争激烈导致系统崩溃。因此，设计一个多层防御、高可靠的扣减架构势在必行。</p>

      <h3>2. 7 层防御高可靠架构设计</h3>
      <ul>
        <li><strong>第一层：客户端防重与限流</strong> - 前端按钮置灰、图形验证码，以及网关层的 IP 级限流。</li>
        <li><strong>第二层：黑名单与风控过滤</strong> - 快速拦截恶意爬虫和抢单机器人。</li>
        <li><strong>第三层：分布式限流与令牌桶</strong> - 限制进入核心服务的流量，超出阈值直接返回售罄。</li>
        <li><strong>第四层：Redis 原子化预扣减</strong> - 使用 Lua 脚本将库存检查与扣减合并为一步操作，发挥 Redis 单线程的高性能。</li>
        <li><strong>第五层：Kafka 异步消息队列削峰</strong> - 将扣减成功的订单信息发送到 Kafka，下游平滑消费。</li>
        <li><strong>第六层：数据库事务与幂等校验</strong> - 本地数据库事务执行最终扣减，使用订单唯一键保证幂等。</li>
        <li><strong>第七层：异常对账与自动回滚</strong> - 若后续付款失败或订单取消，通过对账脚本自动恢复 Redis 缓存库存。</li>
      </ul>

      <h3>3. Redis Lua 库存扣减核心代码</h3>
      <pre><code><span class="comment">-- KEYS[1]: 缓存商品库存 Key, KEYS[2]: 订单幂等 Key</span>
<span class="comment">-- ARGV[1]: 扣减数量</span>
<span class="keyword">local</span> stock_key = KEYS[1]
<span class="keyword">local</span> order_key = KEYS[2]
<span class="keyword">local</span> num = tonumber(ARGV[1])

<span class="comment">-- 1. 幂等校验，防止重复请求</span>
<span class="keyword">if</span> redis.call(<span class="string">'hexists'</span>, order_key, <span class="string">'status'</span>) == 1 <span class="keyword">then</span>
    <span class="keyword">return</span> 2 <span class="comment">-- 已成功扣减过</span>
<span class="keyword">end</span>

<span class="comment">-- 2. 库存校验</span>
<span class="keyword">local</span> stock = tonumber(redis.call(<span class="string">'get'</span>, stock_key))
<span class="keyword">if</span> <span class="keyword">not</span> stock <span class="keyword">or</span> stock &lt; num <span class="keyword">then</span>
    <span class="keyword">return</span> 0 <span class="comment">-- 库存不足</span>
<span class="keyword">end</span>

<span class="comment">-- 3. 原子扣减</span>
redis.call(<span class="string">'decrby'</span>, stock_key, num)
redis.call(<span class="string">'hset'</span>, order_key, <span class="string">'status'</span>, <span class="string">'success'</span>)
<span class="keyword">return</span> 1 <span class="comment">-- 扣减成功</span></code></pre>

      <h3>4. 架构验证与测试数据</h3>
      <p>在 JMeter 压测环境下，模拟 10,000 名用户同时抢购库存为 100 的商品。测试结果显示，系统吞吐量稳定在 <strong>8,500+ QPS</strong>，Redis 内存数据与 MySQL 最终数据完美一致，超卖率为 <strong>0.00%</strong>，未发生任何死锁或雪崩事故。</p>
    `
  },
  {
    id: 2,
    category: 'tech',
    title: '基于 Spring AI & Function Calling 的 RAG 智能搜索工程化',
    date: '2026 // 05 // 24',
    tag: 'ARTIFICIAL_INTELLIGENCE',
    summary: '深度解析本地知识库通过 PgVector / Milvus 向量化检索、多 Query 路由切片重排以及集成 Spring AI 声明式大模型交互接口的召回率优化方案。',
    url: 'HTTPS://KAI.DEV/POST/SPRING-AI-RAG',
    image: imgRag,
    subIndex: '02',
    content: `
      <h3>1. RAG 架构的工程化挑战</h3>
      <p>检索增强生成（RAG）在企业知识库落地时面临着诸多挑战：知识文档格式混乱、向量相似度计算存在噪音、大模型对无关上下文的注意力分散、以及缺乏实时交易数据接口。为了解决这些问题，我们设计了基于 Spring AI 的生产级 RAG 架构。</p>

      <h3>2. 核心流水线设计</h3>
      <ul>
        <li><strong>文档智能解析与自适应分块</strong> - 根据文档层级结构，采用滑动窗口（Overlap）算法进行自适应切片。</li>
        <li><strong>多重向量数据库支撑</strong> - 使用 Milvus 存储海量向量，利用 PgVector 保证高可靠性与关系型数据关联。</li>
        <li><strong>混合检索（Hybrid Search）</strong> - 结合 BM25 文本关键词检索与 Vector 稠密向量语义检索，取长补短。</li>
        <li><strong>多路重排（Reranking）</strong> - 接入 BGE-Reranker 模型，对初步召回的 Top-20 文档进行语义相似度精细排序，截取 Top-5 送入 LLM。</li>
        <li><strong>Function Calling 动态调用</strong> - 当用户提问涉及实时状态时，LLM 声明式触发本地 API 接口（如查询实时数据库中的库存或物流），丰富回答的实时性。</li>
      </ul>

      <h3>3. Spring AI ChatClient 声明式调用示例</h3>
      <pre><code><span class="comment">// 声明一个支持 RAG 知识检索与 Function Calling 的智能客服</span>
<span class="keyword">public</span> ChatResponse <span class="keyword">askAssistant</span>(String userQuery) {
    <span class="keyword">return</span> <span class="keyword">this</span>.chatClient.prompt()
        .user(userQuery)
        .advisors(<span class="keyword">new</span> QuestionAnswerAdvisor(vectorStore, SearchRequest.defaults()
            .withTopK(5)
            .withSimilarityThreshold(0.75)))
        .functions(<span class="string">"queryRealtimeInventory"</span>, <span class="string">"getLogisticStatus"</span>)
        .call()
        .chatResponse();
}</code></pre>

      <h3>4. 运行成效</h3>
      <p>通过引入 BGE 重排和多 Query 重写，检索召回率（Recall@5）从原先的 64% 提升至 <strong>91.5%</strong>。同时，Function Calling 机制使得系统能够实时响应“我的订单发货了吗”这类动态问题，避免了大模型的“幻觉”现象。</p>
    `
  },
  {
    id: 3,
    category: 'life',
    title: '深夜咖啡与机械键盘的节律：软件工程的感性维度',
    date: '2026 // 04 // 18',
    tag: 'LIFESTYLE_REFLECTIONS',
    summary: '代码并非全是冰冷的数值，它往往是开发者心境的倒影。在长夜中静听青轴的弹起，伴随微温的手冲咖啡，在沉浸状态下寻求简洁逻辑的纯真艺术。',
    url: 'HTTPS://KAI.DEV/LIFE/COFFEE-AND-KEYBOARD',
    image: imgCoffee,
    subIndex: '01',
    content: `
      <h3>1. 键盘的白噪音与脑电波共振</h3>
      <p>当大部分城市已经入睡，软件工程师的第二生命才刚刚拉开序幕。在这个点，没有了钉钉的打扰，没有了会开不完的会议，只有显示器的荧光和手指下的敲击声。我偏爱段落感极强的机械键盘（比如精心调校的青轴或茶轴），那每一次清脆的物理回弹，都仿佛是在虚无的逻辑世界中刻下一块基石，给虚构的字节注入实体的重量。</p>

      <h3>2. 冲煮一杯咖啡的专注力重组</h3>
      <p>在解决一个复杂的 Bug 或是整理设计草案的中途，我习惯离开椅子去冲一杯咖啡。从磨豆到手冲，这一套看似机械的步骤却是我重组专注力的仪式：</p>
      <ul>
        <li><strong>称重与磨粉</strong> - 20g 埃塞俄比亚耶加雪菲豆子，磨成中等粗细。听着磨豆机里坚果与花香被揉碎的声音。</li>
        <li><strong>润湿滤纸与预浸泡</strong> - 92度的热水缓缓注入，闷蒸 30 秒，看着咖啡粉如面包般膨胀，释放出迷人的浆果酸甜。</li>
        <li><strong>三段式注水</strong> - 掌控水流的速度与打圈的轨迹，这需要极佳的耐心。就如同重构一段脏乱的业务代码，急于求成只会带来过萃与杂质。</li>
      </ul>

      <h3>3. 寻找数字世界的诗意</h3>
      <p>很多非开发人员认为编程是极度枯燥和死板的工作，但实际上它需要极度丰富的感性想象力。你在构建一个类结构、在设计一个解耦的接口时，其实是在以文字为泥土，构建一个可以自我流转、井然有序的理想国。当杯中的耶加雪菲渐渐变温，微酸的果香在口中弥漫，键盘敲下最后的 <code>Ctrl+S</code>，编译通过。这一刻的成就感与手冲咖啡的回甘完美交融。</p>
    `
  },
  {
    id: 4,
    category: 'life',
    title: '从 JUC 并发原理探寻生活中的多线程阻塞与解套',
    date: '2026 // 03 // 02',
    tag: 'PHILOSOPHY_OF_CODE',
    summary: '当事务在流水线发生死锁时，我们该如何像 AQS 的 CLH 队列一样优雅地挂起与唤醒？生活是一场更大层面的多线程调度，适时释放共享锁是化解阻碍的良药。',
    url: 'HTTPS://KAI.DEV/LIFE/CONCURRENCY-PHILOSOPHY',
    image: imgThread,
    subIndex: '02',
    content: `
      <h3>1. 生活是一场多线程调度</h3>
      <p>作为软件工程师，我们整天与 Java 的 <code>java.util.concurrent</code> (JUC) 包打交道。我们讨论并发度、乐观锁、读写锁和线程池。但如果退后一步审视，我们会发现，生活本身就是一场更大层面的多线程调度，我们每个人都是那个在死锁与阻塞中挣扎的 CPU 核心。</p>

      <h3>2. 阻塞与解套：生活中的 JUC 模型</h3>
      <ul>
        <li><strong>独占锁 (ReentrantLock) 与注意力超载</strong> - 当我们把全部精力投入到某一件事情（如赶 deadline）时，我们就获取了一把排他独占锁。此时，家人、朋友和兴趣爱好的请求都会处于 Blocked 状态，排在 CLH 队列中。如果长期不释放该锁，队列里的等待者就会超时（Timeout Exception），从而引发人际关系的抛错。</li>
        <li><strong>信号量 (Semaphore) 与精力管理</strong> - 人的精力是有限的，就像系统的信号量许可只有 3 个。如果我们同时处理 5 个复杂的任务，就会因为上下文切换（Context Switch）太频繁而导致整体效率雪崩。学会使用 <code>acquire()</code> 申请许可，并在感到疲惫时通过 <code>release()</code> 归还许可，是防止身心崩溃的关键。</li>
        <li><strong>栅栏 (CyclicBarrier) 与团队协作</strong> - 软件发布或旅行出发需要全员到齐。只有大家在同步点（Barrier Point）完成各自的准备，调用了 <code>await()</code>，系统才能进行下一步。在此期间，理解并包容“慢线程”是团队平稳运转的基石。</li>
      </ul>

      <h3>3. 适时释放共享锁</h3>
      <p>如果你在生活中感到焦虑、阻塞或思维死锁，请试着像 JVM 垃圾回收（GC）一样进行一次 <strong>Full GC</strong> —— 丢弃不需要的无用对象，清理内存空间。退后一步，释放占用太久的锁资源，让那些在等待队列中的美好事物有机会被唤醒和加载。生活不是一次单向的顺序执行流，它更像是一个充满无限可能的事件循环（Event Loop）。</p>
    `
  }
];

const CATEGORIES = [
  { id: 'all', name: '全部' },
  { id: 'tech', name: '技术分享' },
  { id: 'life', name: '生活' }
];

export default function OriginiumSharing({ isActive = false }) {
  const videoRef = useRef(null);
  const [videoReady, setVideoReady] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedPost, setSelectedPost] = useState(MOCK_POSTS[0]);
  const [showModal, setShowModal] = useState(false);
  const [readProgress, setReadProgress] = useState(0);
  const articleContainerRef = useRef(null);

  // Control video playback based on page visibility
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (isActive) {
      // Small delay to wait for the page wipe animation to settle before playing
      const t = setTimeout(() => {
        video.play().catch(() => {});
      }, 200);
      return () => clearTimeout(t);
    } else {
      video.pause();
    }
  }, [isActive]);
  
  const [displayedPost, setDisplayedPost] = useState(selectedPost);
  const detailsRef = useRef(null);
  const detailsOutTimelineRef = useRef(null);
  const detailsInTimelineRef = useRef(null);

  // Category list animation states
  const getFilteredPosts = (catId) => MOCK_POSTS.filter(
    (post) => catId === 'all' || post.category === catId
  );
  const [displayedPosts, setDisplayedPosts] = useState(getFilteredPosts('all'));
  const listRef = useRef(null);
  const listOutTimelineRef = useRef(null);
  const listInTimelineRef = useRef(null);

  // Details Fade Out when selectedPost changes
  useEffect(() => {
    if (!detailsRef.current) return;

    if (detailsOutTimelineRef.current) detailsOutTimelineRef.current.kill();
    if (detailsInTimelineRef.current) detailsInTimelineRef.current.kill();

    const items = detailsRef.current.querySelectorAll('.animate-detail-item');
    if (items.length === 0) {
      setDisplayedPost(selectedPost);
      return;
    }

    const tl = gsap.timeline();
    detailsOutTimelineRef.current = tl;

    tl.to(items, {
      opacity: 0,
      x: -15,
      skewX: 12,
      filter: 'blur(3px)',
      duration: 0.15,
      stagger: 0.03,
      ease: 'power1.in',
      onComplete: () => {
        setDisplayedPost(selectedPost);
      }
    });

    return () => {
      if (tl) tl.kill();
    };
  }, [selectedPost]);

  // Details Fade In when displayedPost changes
  useEffect(() => {
    if (!detailsRef.current) return;

    if (detailsInTimelineRef.current) detailsInTimelineRef.current.kill();

    const items = detailsRef.current.querySelectorAll('.animate-detail-item');
    if (items.length === 0) return;

    gsap.set(items, { x: 20, skewX: -12, filter: 'blur(4px)', opacity: 0 });

    const tl = gsap.timeline();
    detailsInTimelineRef.current = tl;

    tl.to(items, {
      opacity: 1,
      x: 0,
      skewX: 0,
      filter: 'blur(0px)',
      duration: 0.3,
      stagger: 0.05,
      ease: 'power3.out'
    });

    return () => {
      if (tl) tl.kill();
    };
  }, [displayedPost]);

  // Category list Fade Out when activeCategory changes
  useEffect(() => {
    if (!listRef.current) return;

    if (listOutTimelineRef.current) listOutTimelineRef.current.kill();
    if (listInTimelineRef.current) listInTimelineRef.current.kill();

    const items = listRef.current.querySelectorAll('.animate-list-item');
    const targetPosts = getFilteredPosts(activeCategory);
    
    if (items.length === 0) {
      setDisplayedPosts(targetPosts);
      return;
    }

    const tl = gsap.timeline();
    listOutTimelineRef.current = tl;

    tl.to(items, {
      opacity: 0,
      x: -15,
      skewX: 12,
      filter: 'blur(3px)',
      duration: 0.15,
      stagger: 0.02,
      ease: 'power1.in',
      onComplete: () => {
        setDisplayedPosts(targetPosts);
      }
    });

    return () => {
      if (tl) tl.kill();
    };
  }, [activeCategory]);

  // Category list Fade In when displayedPosts changes
  useEffect(() => {
    if (!listRef.current) return;

    if (listInTimelineRef.current) listInTimelineRef.current.kill();

    const items = listRef.current.querySelectorAll('.animate-list-item');
    if (items.length === 0) return;

    gsap.set(items, { x: 20, skewX: -12, filter: 'blur(4px)', opacity: 0 });

    const tl = gsap.timeline();
    listInTimelineRef.current = tl;

    tl.to(items, {
      opacity: 1,
      x: 0,
      skewX: 0,
      filter: 'blur(0px)',
      duration: 0.3,
      stagger: 0.03,
      ease: 'power3.out'
    });

    return () => {
      if (tl) tl.kill();
    };
  }, [displayedPosts]);

  // Filter posts based on active category
  const filteredPosts = MOCK_POSTS.filter(
    (post) => activeCategory === 'all' || post.category === activeCategory
  );

  // Get active index within filtered list
  const activeIndex = filteredPosts.findIndex((p) => p.id === selectedPost.id);

  // ── Auto-cycle timer ──────────────────────────────────────────────────────
  const autoCycleRef = useRef(null);
  const userPausedRef = useRef(false);
  const resumeTimerRef = useRef(null);

  // Advance to next post in filteredPosts
  const cycleToNext = () => {
    setSelectedPost((prev) => {
      const posts = MOCK_POSTS.filter(
        (p) => activeCategory === 'all' || p.category === activeCategory
      );
      if (posts.length === 0) return prev;
      const idx = posts.findIndex((p) => p.id === prev.id);
      return posts[(idx + 1) % posts.length];
    });
  };

  // Start / restart the 3.5-second auto-cycle interval
  const startAutoCycle = () => {
    if (autoCycleRef.current) clearInterval(autoCycleRef.current);
    autoCycleRef.current = setInterval(cycleToNext, 3500);
  };

  // Pause for 6 s after user interaction then resume
  const pauseAutoCycle = () => {
    userPausedRef.current = true;
    if (autoCycleRef.current) clearInterval(autoCycleRef.current);
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => {
      userPausedRef.current = false;
      startAutoCycle();
    }, 6000);
  };

  useEffect(() => {
    startAutoCycle();
    return () => {
      if (autoCycleRef.current) clearInterval(autoCycleRef.current);
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategory]);

  // Sync selectedPost when category changes – reset cycle
  const handleCategoryChange = (catId) => {
    setActiveCategory(catId);
    const newFiltered = MOCK_POSTS.filter(
      (post) => catId === 'all' || post.category === catId
    );
    if (newFiltered.length > 0) {
      setSelectedPost(newFiltered[0]);
      setReadProgress(0);
    }
  };

  // Safe selection of post – also pause auto-cycle
  const handlePostSelect = (post) => {
    setSelectedPost(post);
    setReadProgress(0);
    pauseAutoCycle();
  };

  // Helper to open modal and reset progress
  const handleOpenModal = () => {
    setReadProgress(0);
    setShowModal(true);
  };

  // Helper to select post via clicking on progress bar
  const handleProgressClick = (e) => {
    if (!filteredPosts || filteredPosts.length === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const ratio = Math.max(0, Math.min(1, clickX / width));
    const targetIdx = Math.min(
      filteredPosts.length - 1,
      Math.floor(ratio * filteredPosts.length)
    );
    handlePostSelect(filteredPosts[targetIdx]);
  };

  // ── Image fade transition ─────────────────────────────────────────────────
  const [visibleImage, setVisibleImage] = useState(selectedPost.image);
  const [fadingImage, setFadingImage] = useState(null);
  const imgFadeRef = useRef(null);

  useEffect(() => {
    if (!selectedPost.image || selectedPost.image === visibleImage) return;

    if (imgFadeRef.current) gsap.killTweensOf(imgFadeRef.current);

    // Show the old image fading out on top, then swap underneath
    setFadingImage(visibleImage);
    const timer = setTimeout(() => {
      setVisibleImage(selectedPost.image);
      setFadingImage(null);
    }, 280); // swap just before fade completes
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPost.image]);

  // ── Draggable progress bar ────────────────────────────────────────────────
  const trackRef = useRef(null);
  const isDraggingRef = useRef(false);

  const getIndexFromX = (clientX) => {
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect) return -1;
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    return Math.min(filteredPosts.length - 1, Math.floor(ratio * filteredPosts.length));
  };

  const handleTrackMouseDown = (e) => {
    e.preventDefault();
    isDraggingRef.current = true;
    pauseAutoCycle();
    const idx = getIndexFromX(e.clientX);
    if (idx >= 0) handlePostSelect(filteredPosts[idx]);
  };

  useEffect(() => {
    const onMove = (e) => {
      if (!isDraggingRef.current) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const idx = getIndexFromX(clientX);
      if (idx >= 0) handlePostSelect(filteredPosts[idx]);
    };
    const onUp = () => { isDraggingRef.current = false; };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('touchend', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredPosts]);

  // Scroll handler to compute reading percentage in Modal
  const handleArticleScroll = () => {
    const container = articleContainerRef.current;
    if (!container) return;
    const { scrollTop, scrollHeight, clientHeight } = container;
    const totalScroll = scrollHeight - clientHeight;
    if (totalScroll > 0) {
      const progress = (scrollTop / totalScroll) * 100;
      setReadProgress(progress);
    } else {
      setReadProgress(0);
    }
  };

  // Reset scroll when modal opens or post changes
  useEffect(() => {
    if (showModal) {
      const timer = setTimeout(() => {
        if (articleContainerRef.current) {
          articleContainerRef.current.scrollTop = 0;
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [showModal, selectedPost]);

  return (
    <div className="w-full h-full lg:h-screen flex flex-col lg:flex-row justify-between pt-24 pb-8 px-6 md:px-12 relative z-20 overflow-hidden select-none">
      
      {/* ============ VIDEO BACKGROUND ============ */}
      <video
        ref={videoRef}
        src="/world-bg-compressed.mp4"
        muted
        loop
        playsInline
        preload="metadata"
        onCanPlayThrough={() => setVideoReady(true)}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0"
        style={{
          opacity: videoReady ? 1 : 0,
          transition: 'opacity 0.6s ease',
        }}
      />
      {/* Uniform 50% darkening overlay */}
      <div className="absolute inset-0 z-[1] pointer-events-none bg-[rgba(10,10,12,0.50)]" />

      {/* Styles for Dangerous Inner HTML Article Render */}
      <style dangerouslySetInnerHTML={{__html: `
        .ark-article-content h3 {
          font-size: 1.15rem;
          font-weight: 800;
          color: var(--color-ark-cyan);
          margin-top: 2rem;
          margin-bottom: 0.75rem;
          font-family: var(--font-mono);
          border-left: 3px solid var(--color-ark-cyan);
          padding-left: 10px;
          letter-spacing: 0.05em;
        }
        .ark-article-content p {
          font-size: 0.875rem;
          color: #a3a3a3;
          line-height: 1.8;
          margin-bottom: 1.25rem;
          font-weight: 300;
          text-align: justify;
        }
        .ark-article-content strong {
          color: #ffffff;
          font-weight: 600;
        }
        .ark-article-content pre {
          background-color: #050507;
          border: 1px solid rgba(255, 255, 255, 0.05);
          padding: 1.25rem;
          border-radius: 2px;
          overflow-x: auto;
          margin-top: 1.25rem;
          margin-bottom: 1.5rem;
          font-family: var(--font-code);
          font-size: 0.75rem;
          line-height: 1.6;
          color: #e4e4e7;
        }
        .ark-article-content code {
          font-family: var(--font-code);
        }
        .ark-article-content .keyword { color: #ff6b00; font-weight: bold; }
        .ark-article-content .comment { color: #6b7280; font-style: italic; }
        .ark-article-content .string { color: #a6f626; }
        .ark-article-content ul {
          list-style-type: none;
          padding-left: 0;
          margin-top: 0.5rem;
          margin-bottom: 1.5rem;
        }
        .ark-article-content li {
          font-size: 0.875rem;
          color: #d4d4d8;
          line-height: 1.8;
          position: relative;
          padding-left: 1.5rem;
          margin-bottom: 0.6rem;
        }
        .ark-article-content li::before {
          content: "▪";
          position: absolute;
          left: 0.25rem;
          color: var(--color-ark-cyan);
          font-size: 0.75rem;
          line-height: 1.8;
        }
        @keyframes modalFadeIn {
          from { opacity: 0; transform: scale(0.96) translateY(8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-modal-in {
          animation: modalFadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}} />

      {/* Decorative grid structure and vertical/horizontal lines matching Arknights HUD */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {/* Halftone grid matrix background */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.015)_1.5px,transparent_1.5px)] bg-[size:16px_16px] opacity-40" />
        
        {/* Left vertical border separating left column (34% width) */}
        <div className="absolute top-0 bottom-0 left-[34%] border-r border-white/5" />
        
        {/* Right vertical border separating page index column (90% width / 10% right column) */}
        <div className="absolute top-0 bottom-0 right-[10%] border-l border-white/5" />
        
        {/* Horizontal border at the bottom (90% height) */}
        <div className="absolute bottom-[10%] left-0 right-0 border-b border-white/5" />
      </div>

      {/* ==================== LEFT COLUMN: LIST AND SELECTED DESCRIPTION ==================== */}
      <div className="w-full lg:w-[32%] flex flex-col justify-between h-full pr-0 lg:pr-8 border-r-0 lg:border-r border-white/10 z-20 gap-6">
        
        {/* Upper part: Tabs & List */}
        <div className="flex flex-col flex-1 overflow-hidden">
          
          {/* Tab bar header */}
          <div className="flex border-b border-white/10 pb-2 mb-3.5 gap-3">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className="relative px-4 py-2 font-black font-mono text-[16.5px] tracking-wider uppercase transition-all duration-300 cursor-pointer"
                style={
                  activeCategory === cat.id
                    ? {
                        backgroundColor: 'var(--color-ark-cyan)',
                        color: '#000',
                        clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 100%, 0 100%)',
                        paddingRight: '22px',
                        fontWeight: '900',
                        boxShadow: '0 0 15px rgba(0, 240, 255, 0.4)',
                      }
                    : {
                        color: 'rgba(255, 255, 255, 0.4)',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        clipPath: 'polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%)',
                      }
                }
              >
                <span>{cat.name}</span>
              </button>
            ))}
          </div>

          {/* Article items list */}
          <div ref={listRef} className="flex-1 flex flex-col gap-0.5 overflow-y-auto pr-1.5 scrollbar-thin max-h-[260px] lg:max-h-none">
            {displayedPosts.map((post) => {
              const isSelected = selectedPost.id === post.id;
              return (
                <div
                  key={post.id}
                  onClick={() => handlePostSelect(post)}
                  className={`py-2 border-b border-white/5 cursor-pointer flex flex-col gap-2 transition-all duration-200 group relative animate-list-item ${
                    isSelected ? 'opacity-100' : 'opacity-50 hover:opacity-85'
                  }`}
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-4 text-[16px] font-mono font-medium">
                      <span className={post.category === 'tech' ? 'text-ark-cyan bg-ark-cyan/10 px-1.5 py-0.5 rounded-[1px] border border-ark-cyan/20 font-bold' : 'text-ark-green bg-ark-green/10 px-1.5 py-0.5 rounded-[1px] border border-ark-green/20 font-bold'}>
                        {post.category === 'tech' ? '技术分享' : '生活'}
                      </span>
                      <span className="text-neutral-500 font-mono tracking-widest">
                        {post.date}
                      </span>
                    </div>
                    <div className="text-[19.5px] font-bold text-white tracking-wider mt-0.5 group-hover:text-ark-cyan transition-colors duration-200">
                      {`「${post.title}」`}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Underlist indicator buttons */}
          <div className="pt-4 pb-2 border-t border-white/5">
            <button className="px-3.5 py-1 border border-white/10 text-[9px] font-mono text-neutral-400 hover:text-white hover:border-white/30 transition-all duration-300 rounded-[1px]">
              READ MORE &gt;
            </button>
          </div>
        </div>

        {/* Lower part: Featured Detail */}
        <div ref={detailsRef} className="flex flex-col relative pt-2 border-t border-white/10 lg:border-t-0 pb-10">
          
          {/* Giant backdrop background outlined text */}
          <div 
            className="absolute bottom-24 left-0 text-[4.5rem] lg:text-[6.5rem] font-black tracking-widest select-none uppercase pointer-events-none font-display leading-[0.8] italic opacity-20"
            style={{
              color: 'transparent',
              WebkitTextStroke: '1.5px rgba(255, 255, 255, 0.05)',
              transform: 'skewX(-10deg)',
            }}
          >
            BREAKING NEWS
          </div>

          <div className="animate-detail-item text-[9px] font-mono text-neutral-500 mb-2 tracking-widest">
            {displayedPost.date}
          </div>
          <h2 className="animate-detail-item text-xl sm:text-2xl font-black leading-tight tracking-wider text-white mb-2.5 uppercase select-text">
            {displayedPost.title}
          </h2>
          <p className="animate-detail-item text-[11px] text-neutral-400 leading-relaxed font-light mb-3 line-clamp-3 select-text">
            {displayedPost.summary}
          </p>
          <div className="animate-detail-item text-[9px] font-mono text-ark-cyan/50 tracking-wider mb-4 select-text">
            {displayedPost.url}
          </div>

          {/* Action button */}
          <button
            onClick={handleOpenModal}
            className="animate-detail-item relative bg-ark-cyan hover:bg-[#00e1f0] text-black px-6 py-2.5 font-bold uppercase transition-all duration-300 group cursor-pointer border-none flex flex-col items-start gap-0 shadow-[0_0_15px_rgba(0,240,255,0.25)] hover:shadow-[0_0_25px_rgba(0,240,255,0.5)] rounded-[1px] w-[140px]"
            style={{ 
              clipPath: 'polygon(0 0, calc(100% - 15px) 0, 100% 100%, 0 100%)',
            }}
          >
            <span className="text-[11px] tracking-wider font-sans font-black leading-tight">更多情报</span>
            <span className="text-[7px] font-mono tracking-widest text-black/60 leading-none mt-0.5">READ MORE</span>
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-black">&gt;</span>
          </button>
        </div>

      </div>

      {/* ==================== MIDDLE COLUMN: MAIN VISUAL IMAGE & SLIDER ==================== */}
      <div className="flex-1 flex flex-col justify-center h-full pl-0 lg:pl-10 mt-8 lg:mt-0 z-20 gap-4">
        
        {/* Large featured graphic */}
        <div className="w-full aspect-[16/10] bg-[#070709] border border-white/10 rounded-sm relative overflow-hidden flex items-center justify-center shadow-[inset_0_0_25px_rgba(0,0,0,0.9)] group">
          
          {/* Tactical overlays on image corner */}
          <span className="absolute top-3 left-3 text-[7px] font-mono text-neutral-500 tracking-wider z-20">
            SYS.IMG.VISUAL_TELEMETRY // CH_{selectedPost.subIndex}
          </span>
          <span className="absolute top-2 left-2 w-2 h-2 border-t border-l border-white/20 z-20" />
          <span className="absolute top-2 right-2 w-2 h-2 border-t border-r border-white/20 z-20" />
          <span className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-white/20 z-20" />
          <span className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-white/20 z-20" />
          
          {/* Image — fade-transition layer stack */}
          <div className="absolute inset-0 w-full h-full">
            {/* Stable visible image */}
            {visibleImage && (
              <img
                key={visibleImage}
                src={visibleImage}
                alt={selectedPost.title}
                className="absolute inset-0 w-full h-full object-cover object-center"
                style={{ opacity: 0.82, transition: 'opacity 0.28s ease-in' }}
              />
            )}
            {/* Fading-out previous image (sits on top, fades away) */}
            {fadingImage && (
              <img
                key={`fade-${fadingImage}`}
                src={fadingImage}
                alt="prev"
                className="absolute inset-0 w-full h-full object-cover object-center"
                style={{
                  opacity: 0,
                  transition: 'opacity 0.3s ease-out',
                  animation: 'imgFadeOut 0.3s ease-out forwards'
                }}
              />
            )}
          </div>

          {/* Copyright overlay watermark */}
          <span className="absolute top-3 right-3 text-[8px] font-mono text-white/30 tracking-widest select-none z-20 font-light">
            © HYPERGRYPH
          </span>

          {/* Logo overlay block inside image */}
          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between z-20 pointer-events-none bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4 border border-white/5 rounded-[1px] backdrop-blur-[1px]">
            <div>
              <div className="text-[8px] font-mono text-ark-cyan font-bold tracking-widest uppercase">
                {selectedPost.tag}
              </div>
              <div className="text-[10px] font-bold text-white/90 font-mono mt-1 tracking-wider uppercase">
                TALES WITHIN THE CODE // {selectedPost.subIndex}
              </div>
            </div>
            <div className="text-[8px] font-mono text-white/40 tracking-widest hidden sm:block">
              RESTRICTED // AREA_03
            </div>
          </div>

          {/* Futuristic matrix scan overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.01] to-transparent pointer-events-none mix-blend-overlay" />
        </div>

        {/* Bottom indicator – click + drag progress bar */}
        <div className="w-full flex flex-col items-center gap-3 relative pb-2">

          {/* Inject keyframe for fading-out image */}
          <style>{`@keyframes imgFadeOut { from { opacity: 0.82; } to { opacity: 0; } }`}</style>

          {/* Segment-dot progress bar: click anywhere OR drag thumb */}
          <div
            ref={trackRef}
            onMouseDown={handleTrackMouseDown}
            onTouchStart={(e) => {
              isDraggingRef.current = true;
              pauseAutoCycle();
              const idx = getIndexFromX(e.touches[0].clientX);
              if (idx >= 0) handlePostSelect(filteredPosts[idx]);
            }}
            className="w-full h-6 flex items-center cursor-pointer select-none"
          >
            {/* Segmented dots – one per post */}
            <div className="w-full flex items-center gap-1.5">
              {filteredPosts.map((post, i) => {
                const isActive = i === activeIndex;
                return (
                  <div
                    key={post.id}
                    className="relative flex-1 h-[4px] rounded-full overflow-hidden bg-white/10 transition-all duration-300"
                  >
                    {/* Auto-fill progress bar for active segment */}
                    {isActive && (
                      <div
                        className="absolute inset-y-0 left-0 bg-ark-cyan shadow-[0_0_8px_#00f0ff] rounded-full"
                        style={{
                          width: '100%',
                          transition: 'width 0.3s ease-out'
                        }}
                      />
                    )}
                    {/* Inactive fill */}
                    {!isActive && (
                      <div className="absolute inset-y-0 left-0 right-0 bg-white/5 rounded-full" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Scroll indicators */}
          <div className="flex flex-col items-center justify-center text-[7px] font-mono text-neutral-500 gap-1 animate-pulse select-none">
            <span>SCROLL</span>
            <svg
              className="w-3.5 h-3.5 text-neutral-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 13l-7 7-7-7"
              />
            </svg>
          </div>
        </div>

      </div>

      {/* ==================== RIGHT COLUMN: VERTICAL DISPLAY INDEX ==================== */}
      <div className="hidden lg:flex w-[10%] h-full flex-col items-center justify-center border-l border-white/10 pl-6 relative select-none z-20">
        
        {/* Halftone grid matrix background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:10px_10px] opacity-40 -z-10" />

        {/* Stylized Giant Page Index */}
        <div className="flex flex-col items-center rotate-0 my-auto gap-2">
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-4xl font-black text-ark-cyan font-display tracking-tighter glow-cyan italic">
              {selectedPost.subIndex}
            </span>
            <span className="text-neutral-500 font-mono text-[9px] mx-0.5">//</span>
            <span className="text-neutral-400 font-mono text-[10px]">
              {activeCategory === 'all'
                ? '01'
                : activeCategory === 'tech'
                ? '02'
                : '03'}
            </span>
            <span className="text-neutral-500 font-mono text-[9px] mx-0.5">/</span>
            <span className="text-neutral-400 font-mono text-[10px]">
              {String(filteredPosts.length).padStart(2, '0')}
            </span>
          </div>

          <div className="text-[8px] font-bold text-neutral-500 tracking-[0.25em] uppercase border-t border-white/10 pt-2 w-full text-center font-mono">
            INFORMATION
          </div>
        </div>

        {/* Decorative corner bracket */}
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-white/20" />
      </div>

      {/* ==================== TACTICAL TERMINAL modal (READING CONSOLE) ==================== */}
      {showModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 md:p-8">
          <div className="relative w-full max-w-7xl h-[88vh] bg-[#070709] border border-white/10 flex flex-col md:flex-row overflow-hidden rounded-[1px] shadow-[0_0_50px_rgba(0,0,0,0.8)] animate-modal-in ark-scanline">
            
            {/* Top decorative banner */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-ark-cyan shadow-[0_0_8px_#00f0ff] z-40" />

            {/* Close button (top right) */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-5 right-5 px-3.5 py-1.5 border border-ark-red/40 hover:bg-ark-red/20 text-ark-red hover:text-white text-[9px] font-mono font-bold uppercase transition-all duration-300 cursor-pointer flex items-center gap-1.5 shadow-[0_0_8px_rgba(255,62,62,0.1)] hover:shadow-[0_0_15px_rgba(255,62,62,0.3)] z-50 rounded-[1px]"
            >
              <span>[X]</span>
              <span>CLOSE TERMINAL</span>
            </button>

            {/* 1. Modal Sidebar: Metadata (30% width) */}
            <div className="w-full md:w-[28%] border-b md:border-b-0 md:border-r border-white/10 p-6 flex flex-col justify-between pt-12 gap-8 bg-[#0A0A0C]">
              
              {/* Top metadata display */}
              <div className="flex flex-col gap-5 text-[10px] font-mono">
                <div className="text-ark-cyan font-bold tracking-widest text-[11px] pb-2 border-b border-white/10 uppercase">
                  // RECON_DATALOG
                </div>

                <div className="flex flex-col gap-1.5">
                  <span className="text-neutral-500">FILE_TAG:</span>
                  <span className="text-white font-bold tracking-wider">{selectedPost.tag}</span>
                </div>

                <div className="flex flex-col gap-1.5">
                  <span className="text-neutral-500">TIMESTAMP:</span>
                  <span className="text-white font-bold tracking-wider">{selectedPost.date}</span>
                </div>

                <div className="flex flex-col gap-1.5">
                  <span className="text-neutral-500">READ_ACCESS:</span>
                  <span className="text-ark-green font-bold tracking-wider">LEVEL_2 (RESTRICTED)</span>
                </div>

                <div className="flex flex-col gap-1.5">
                  <span className="text-neutral-500">SECURITY_DECRYPT:</span>
                  <span className="text-ark-cyan font-bold tracking-wider animate-pulse">
                    SUCCESS (100% // VERIFIED)
                  </span>
                </div>
              </div>

              {/* Server loading telemetry visualizer */}
              <div className="flex flex-col gap-3 font-mono">
                <div className="text-[8px] text-neutral-500 tracking-wider flex justify-between">
                  <span>SYS.SECTOR.DECRYPTOR</span>
                  <span>ONLINE</span>
                </div>

                {/* Progress bar visual grid */}
                <div className="grid grid-cols-8 gap-1 h-3.5 w-full border border-white/10 p-0.5 rounded-[1px] bg-black/50">
                  <div className="bg-ark-cyan/85 h-full rounded-[1px]" />
                  <div className="bg-ark-cyan/85 h-full rounded-[1px]" />
                  <div className="bg-ark-cyan/85 h-full rounded-[1px]" />
                  <div className="bg-ark-cyan/85 h-full rounded-[1px]" />
                  <div className="bg-ark-cyan/50 h-full rounded-[1px]" />
                  <div className="bg-ark-cyan/50 h-full rounded-[1px]" />
                  <div className="bg-ark-cyan/20 h-full rounded-[1px]" />
                  <div className="border border-white/5 h-full rounded-[1px]" />
                </div>

                {/* Decorative technical console lines */}
                <div className="text-[7px] text-neutral-600 space-y-0.5 leading-none font-light">
                  <div>SYS_CORE_TEMP: 42.6°C</div>
                  <div>SECURE_CONN_HASH: 0x8F9A7B3C</div>
                  <div>DATAPACKET_STREAM: ACTIVE</div>
                  <div>ORIGINIUM_RES_DENSITY: 0.12u/cm³</div>
                </div>
              </div>

              {/* Decorative brackets */}
              <div className="text-[8px] text-neutral-600 font-mono tracking-wider pt-4 border-t border-white/5">
                PROJECT KAI_ARCHIVE // VER.3.0
              </div>
            </div>

            {/* 2. Modal Body: Scrollable Article Content (72% width) */}
            <div className="flex-1 flex flex-col justify-between overflow-hidden relative">
              
              {/* Scrollable text container */}
              <div
                ref={articleContainerRef}
                onScroll={handleArticleScroll}
                className="flex-1 overflow-y-auto px-6 md:px-12 py-10 pt-16 md:pt-14 scrollbar-thin select-text text-justify"
              >
                {/* Article Header info */}
                <div className="border-b border-white/10 pb-6 mb-8">
                  <div className="text-[10px] font-mono text-ark-cyan tracking-widest font-bold uppercase mb-2">
                    {selectedPost.category === 'tech' ? 'TECHNICAL_LOG' : 'PERSONAL_ESSAY'}
                  </div>
                  <h1 className="text-2xl md:text-3xl font-black text-white tracking-wider uppercase leading-tight font-display mb-3">
                    {selectedPost.title}
                  </h1>
                  <div className="text-xs text-neutral-500 font-mono flex gap-4">
                    <span>DATE: {selectedPost.date}</span>
                    <span>AUTHOR: DEVELOPER_KAI</span>
                  </div>
                </div>

                {/* Main Text Content */}
                <div
                  className="ark-article-content text-neutral-300 leading-relaxed font-sans max-w-4xl"
                  dangerouslySetInnerHTML={{ __html: selectedPost.content }}
                />
              </div>

              {/* Bottom scroll progress telemetry bar */}
              <div className="bg-[#0A0A0C] border-t border-white/10 px-6 py-4 flex items-center justify-between text-[10px] font-mono text-neutral-500 z-20">
                <div className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 bg-ark-cyan rounded-full animate-ping" />
                  <span>READING_PROGRESS: {Math.round(readProgress)}%</span>
                </div>
                
                {/* Horizontal progress bar */}
                <div className="flex-1 max-w-[200px] md:max-w-[320px] h-[3px] bg-white/5 mx-6 relative rounded-full overflow-hidden">
                  <div
                    className="absolute top-0 left-0 h-full bg-ark-cyan transition-all duration-150"
                    style={{ width: `${readProgress}%` }}
                  />
                </div>

                <div className="hidden sm:block">
                  SECTOR_DECRYPT_ID: KAIPG-03-P{selectedPost.id}
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
