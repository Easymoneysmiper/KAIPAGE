# 技术交底与项目开发进度文档 (Project Handover & Progress Documentation)

本仓库是一个高视觉质感、高交互性的 **个人开发者数字空间门户 (Developer Portfolio Site)**，采用现代的前端技术栈（React 19 + Vite + Tailwind CSS v4 + React Three Fiber 3D 物理引擎），融合了多种前沿的交互卡片和流程模拟器。

---

## 1. 项目技术栈 (Technology Stack)

* **核心框架**: React 19.2 (Vite 8.0 构建系统)
* **样式系统**: Tailwind CSS v4 + CSS Modules
* **3D 图形与物理**: 
  * Three.js (0.184)
  * React Three Fiber (R3F 9.6)
  * `@react-three/drei` (10.7, 用于相机、光源、外部模型加载)
  * `@react-three/rapier` (2.2, 用于基于 Rapier 引擎的 3D 刚体及关节物理模拟)
* **动画系统**: 
  * GSAP + `@gsap/react` (用于部分滚动触发式文本浮现动画)
  * Motion (原 Framer Motion, 用于部分 UI 状态平滑过渡)
* **平滑滚动**: Lenis (已安装，供后续高级页面滚动效果扩展使用)

---

## 2. 核心模块与文件架构 (Directory & Module Architecture)

```
E:\IDEA\KAIPAGE
├── index.html                  # 入口 HTML，配置有 SEO 元数据（Meta, Title）
├── vite.config.js              # Vite 配置文件
├── package.json                # 项目依赖包与 NPM 脚本配置
└── src
    ├── main.jsx                # React 渲染挂载入口
    ├── index.css               # 全局样式文件（引入 Google 字体及 Tailwind 指令）
    ├── App.jsx                 # 页面主控制台，包含布局、模拟器状态逻辑及动态纹理绘制
    ├── App.css                 # App 特有辅助动画与 3D 贴图视差样式
    │
    ├── Lanyard.jsx             # 【核心3D组件】3D物理工牌与绳索模拟组件
    ├── Lanyard.css             # 3D Canvas 容器尺寸控制
    │
    ├── GooeyNav.jsx            # 顶部粘性流体动效导航条组件
    ├── GooeyNav.css            # 粘性导航条滤镜与粒子样式
    │
    ├── ProfileCard.jsx         # 左侧 3D 倾斜光泽个人名片组件
    ├── ProfileCard.css         # 个人名片视差与发光特效样式
    │
    ├── ElectricBorder.jsx      # 精致动态流动电子边框组件
    ├── ElectricBorder.css      # 电子边框 Canvas/CSS 布局
    │
    ├── RotatingText.jsx        # 字符级/单词级文字循环翻转动画组件
    ├── RotatingText.css        # 旋转文本过渡过渡类
    │
    ├── ScrollFloat.jsx         # 滚动驱动式字母淡入浮现动画组件
    ├── ScrollFloat.css         # 滚动浮现效果布局
    │
    ├── SplitText.jsx           # 基于 GSAP ScrollTrigger 的文字分割动效组件
    │
    ├── TextType.jsx            # 精致动态打字机动画组件
    ├── TextType.css            # 打字机光标闪烁样式
    │
    └── assets                  # 静态资源目录
        ├── card.glb            # 3D 工牌模型文件（含夹子、夹子座与工牌板三部分）
        ├── lanyard.png         # 绳索的编织纹理图片
        └── background.mp4      # 首页背景循环播放的高清动态科幻视频
```

---

## 3. 已实现功能与开发进度 (Current Status & Features)

### 3.1. 首页 Hero 视觉区
* **动态视频背景**: 使用 `background.mp4` 居中铺满并降低不透明度 (`opacity-65`)。
* **科幻网格参考线**: 横纵划分的细暗线背景叠加在视频上层，构造极致图纸视觉。
* **粒子互动 Canvas**: 前层悬浮 60 个互动粒子，具有鼠标物理引力及自动距离连线动效。
* **动态流光边框打字机**: `TextType` 组件展示吉林大学信息与后端专业标签，外侧包裹动态蓝色冷光粒子边框 `ElectricBorder`。

### 3.2. 3D 物理交互工牌 (Lanyard Box) — 重点技术实现
点击顶部导航栏的 **"PING ME"** 按钮后，工牌箱将从导航栏下方优雅掉落：
1. **3D 物理绑定**: 
   * 工牌通过物理刚体组件进行解算。顶部固定点（`type="fixed"`）设在 `[0, 2.7, 0]`，悬挂在导航栏下方 **2px** 位置。
   * 下方连接三个球形刚体作为绳节点（`j1`, `j2`, `j3`），使用三个 `useRopeJoint` 串联。
   * 最下方工牌板（`card`）使用 `useSphericalJoint` 连接到 `j3` 节点，球关节精确连接在工牌金属吊钩（`y: 1.33`）上，消除了穿模。
2. **高分动态双面纹理 (Dynamic Canvas Atlas Texturing)**:
   * **正反面贴图合并**: 为防止 Canvas 贴图拉伸，利用内存中的 `1024x1536` 高清 Canvas，按左右 `0.5 : 0.5` 区域分别绘制工牌的正面与反面，合并输出一张 DataURL。
   * **正面 (Front Image)**: 绘制了“彭凯·吉林大学软件工程”的本科介绍、专属卓越班印章、JLU 水印和专业 Pills 徽章。
   * **反面 (Back Image)**: 绘制了核心后端性能技术指标卡片（包含并发拦截率、大模型 Agent 限制、秒杀 QPS 底层设计等细节）。
3. **流畅手势交互**: 用户可以按住工牌板进行物理拖拽（卡片设为 `kinematicPosition` 并在拖动时调用 `setNextKinematicTranslation`），松手后工牌将在重力与悬挂力矩作用下产生高频、自然的往复晃动。

### 3.3. 后端技术指标交互模拟器 (Interactive Simulator Panels)
在页面中集成了三个高交互性的控制台，模拟真实的后端服务链路：
1. **RAG 旅行规划 AI 助手**: 模拟多 Query 增强、向量检索 RAG 文档召回、Spring AI Function Calling 接口调用及结果渲染的全日志输出。
2. **高并发秒杀扣减模拟器**: 动态调整 QPS 并发数（4500~5300+ 模拟接入），包含 Redis分布式锁验证、库存原子扣减、Kafka 异步消息主题压入、乐观锁落库等 7 层高可靠架构的控制台日志滚动。
3. **Vibe Coding 协同重构代码助手**: 动态展示与大模型结对重构 Spring 向量服务与秒杀锁的 Java 源码打印流。

---

## 4. 重点问题排查历史与技术规避 (Troubleshooting & Fixes)

### 🚨 网页滚动时 3D 绳索悬挂点位移（已修复）
* **故障现象**: 点击 "PING ME" 展开工牌后，滚动网页，工牌绳索的吊挂点会偏离导航栏，发生明显的位移。
* **排查发现**:
  * 导航栏容器样式为 `fixed`，其屏幕坐标在滚动中完全保持不变（`x: 336`, `y: 24`）。
  * 但工牌外层包裹 `div` 拥有 `transition-all duration-700` 和 `scale-95` ➔ `scale-100` 的进入过渡动画。
  * **深层原因**: CSS 的 scale 缩放改变了容器的视觉边界（`getBoundingClientRect`）。R3F 的 `<Canvas>` 在挂载时读取了这个带缩放的边界值（~`1901px` 宽度）。由于 CSS 缩放不触发 `ResizeObserver` 布局调整，三维视口保持在此尺寸。当页面滚动时，`scrollProgress` 状态改变触发 `App.jsx` 全局重渲染，R3F Canvas 在 React 更新周期中重新检测当前容器物理尺寸（此时缩放过渡已结束，为 `2000px`），发生了重绘和宽度拉伸，导致 Canvas 3D 中心点向右平移 `50px`，从而使以中心点定位的物理吊点偏离了导航栏按钮。
* **修复方法**: 
  * 移除了工牌下拉外层 `div` 的 `scale-95` 和 `scale-100` 样式，只保留 `opacity` 和 `translate-y` 滑动渐入动画。
  * 这一改动保证了外层容器的 layout width 在动画前后恒定为 `2000px`。Canvas 不再会由于滚动重渲染触发大小重算，彻底消除了物理悬挂点的偏移抖动。

---

## 5. 本地运行与构建指令 (How to Run & Build)

### 5.1. 安装依赖项
```powershell
npm install
```

### 5.2. 本地开发服务器启动
```powershell
npm run dev
```
* 服务启动后默认占用 `5173` 端口，若被占用会自动顺延至 `5174` 等。可通过控制台日志直接访问本地页面。

### 5.3. 生产环境打包
```powershell
npm run build
```
* 构建成功后生成 `dist/` 文件夹。其中 3D 模型 `card-*.glb` 以及相关的贴图素材均会被混淆并自动整合。

---

## 6. 后续开发建议与交接要点 (Handover Guidelines for next Agent)

对于后续接手此项目的开发 Agent，有以下几点建议：
1. **模型与刚体交互**: `src/Lanyard.jsx` 内的 rigid body 参数经过高度精细的调试。微调 `card` 和 `fixed` 的位置或关节偏移量时，请确保 `useSphericalJoint` 和 `useRopeJoint` 的定位数组成比例地缩放，否则容易引起吊绳和工牌扣环的脱节或重力解算爆炸。
2. **性能优化**: 物理引擎（Rapier）在手机端使用 `timeStep={1 / 30}`，在 PC 端使用 `timeStep={1 / 60}`。如果后续在 3D 场景内增加其他碰撞体，切记开启 `canSleep: true` 以释放 CPU 算力。
3. **SEO 保持**: 如需增删模块，注意维持 `index.html` 中的 `h1` 单一标题规范以及对交互按钮添加唯一的 `id` 或描述类。
