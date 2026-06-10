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
  * `@react-three/postprocessing` 与 `postprocessing` (用于 3D 场景发光/Bloom 滤镜效果)
* **动画系统**: 
  * GSAP + `@gsap/react` (用于部分滚动触发式文本浮现动画)
  * Motion (原 Framer Motion, 用于部分 UI 状态平滑过渡)
* **平滑滚动**: Lenis (已安装，供后续高级页面滚动效果扩展使用)

---

## 2. 核心模块与文件架构 (Directory & Module Architecture)

```
E:\IDEA\KAIPAGE
├── CLAUDE.md                   # 针对 Claude Code 的开发指南
├── project_progress_documentation.md  # 技术交底与项目开发进度文档 (本文件)
├── README.md                   # 项目 README 说明书
└── frontend/                   # 前端源码及配置文件
    ├── index.html              # 入口 HTML，配置有 SEO 元数据（Meta, Title）
    ├── vite.config.js          # Vite 配置文件 (整合了 React 与 Tailwind v4 插件)
    ├── eslint.config.js        # ESLint flat 配置文件
    ├── package.json            # 项目依赖与 NPM 脚本配置
    ├── public/                 # 静态资源目录
    │   ├── background.mp4      # 备用首屏背景循环视频 (已由 3D Hangar Canvas 替代)
    │   ├── bio-bg.webm         # Bio 模块背景视频
    │   └── favicon.svg
    └── src/
        ├── main.jsx                # React 渲染挂载入口
        ├── index.css               # 全局样式文件（引入 Google 字体及 Tailwind v4 指令）
        ├── App.jsx                 # 页面主控制台，包含布局、模拟器状态逻辑及动态纹理绘制
        ├── App.css                 # App 特有辅助动画与 3D 贴图视差样式
        │
        ├── ServerHangarCanvas.jsx  # 【核心3D组件】3D服务器机柜机库背景，带亮灯与拉近开场动画
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
        ├── RotatingText.css        # 旋转文本过渡类
        │
        ├── ScrollFloat.jsx         # 滚动驱动式字母淡入浮现动画组件
        ├── ScrollFloat.css         # 滚动浮现效果布局
        │
        ├── SplitText.jsx           # 基于 GSAP ScrollTrigger 的文字分割动效组件
        │
        ├── TextType.jsx            # 精致动态打字机动画组件
        ├── TextType.css            # 打字机光标闪烁样式
        │
        ├── ShinyText.jsx           # 渐变闪烁文本组件
        ├── Shuffle.jsx             # 字符乱码洗牌效果文本组件
        ├── CircularGallery.jsx     # 3D 环形旋转相册组件
        ├── GlassIcons.jsx          # 毛玻璃风格标签分类选择图标
        ├── MagicBento.jsx          # 炫酷 Bento 格栅卡片包装组件
        └── assets/                 # 静态模型与纹理目录
            └── hero.png            # 备用首屏缩略图
```

---

## 3. 已实现功能与开发进度 (Current Status & Features)

### 3.1. 首页 Hero 视觉区
* **3D 工业机库背景 (Server Hangar)**: 代替了原有的静态视频，使用 React Three Fiber (R3F) 程序化高精度建模对称的双列服务器机柜，外观采用碳黑外壳与粗壮金属立柱。天花板采用 2 列 x 6 排的暖橙色线性发光网格格栅灯，地板升级为纯黑镜面反射材质（`MeshReflectorMaterial`, 移除导轨和圆形井盖），可完美实时反射天花板的橙光和机架的蓝光倒影。滚动时触发天花板线性灯自远而近逐级点亮，伴随相机 Dolly-in 向前平滑推进。机柜单体正面分为左右分栏指示灯面板与中间凹陷通道，内部带有双根垂直的立体发光电缆（蓝绿与暖橙）和高透光反射镜面玻璃，且两侧均已做对称偏转与镜像缩放（右侧 `rotationY = -Math.PI / 2`，左侧 `rotationY = Math.PI / 2` 结合 `scale = [-1, 1, 1]` 与 `rotation = [0, Math.PI, 0]`），确保所有指示灯、凹陷散热通道与透明反射门板均完全面向镜头通道，细节反射拉满。
* **科幻网格参考线**: 横纵划分的细暗线背景叠加在 3D 场景上层，构造极致图纸视觉。
* **粒子互动 Canvas**: 前层悬浮 60 个互动粒子，具有鼠标物理引力及自动距离连线动效。
* **动态流光边框打字机**: `TextType` 组件展示吉林大学信息与后端专业标签，外侧包裹动态蓝色冷光粒子边框 `ElectricBorder`。

### 3.2. 后端技术指标交互模拟器 (Interactive Simulator Panels)
在页面中集成了三个高交互性的控制台，模拟真实的后端服务链路：
1. **RAG 旅行规划 AI 助手**: 模拟多 Query 增强、向量检索 RAG 文档召回、Spring AI Function Calling 接口调用及结果渲染的全日志输出。
2. **高并发秒杀扣减模拟器**: 动态调整 QPS 并发数（4500~5300+ 模拟接入），包含 Redis分布式锁验证、库存原子扣减、Kafka 异步消息主题压入、乐观锁落库等 7 层高可靠架构的控制台日志滚动。
3. **Vibe Coding 协同重构代码助手**: 动态展示与大模型结对重构 Spring 向量服务与秒杀锁的 Java 源码打印流。

---

## 4. 重点问题排查历史与技术规避 (Troubleshooting & Fixes)

*(无未决的重要排查问题，物理 Lanyard 卡片组件已被移除。)*

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
* 构建成功后生成 `dist/` 文件夹。其中的静态资源文件及相关的贴图素材均会被混淆并自动整合。

---

## 6. 后续开发建议与交接要点 (Handover Guidelines for next Agent)

对于后续接手此项目的开发 Agent，有以下几点建议：
1. **3D Hangar Canvas 性能优化**: 场景中使用了 MeshReflectorMaterial 模糊镜面反射材质，对于低性能设备可能带来渲染压力。如遇到卡顿，可通过降低 Drei MeshReflectorMaterial 的 `resolution` (如从 1024 降为 512) 或调整 `blur` 强度进行调试。
2. **SEO 保持**: 如需增删模块，注意维持 `index.html` 中的 `h1` 单一标题规范以及对交互按钮添加唯一的 `id` 或描述类。
