# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

KAIPage is a **high-visual-impact, interactive developer portfolio site** built with:

- **React 19.2** + **Vite 8.0** (build system)
- **Tailwind CSS v4** (styling via `@tailwindcss/vite` plugin)
- **Three.js 0.184** + **React Three Fiber 9.6** + **React Three Rapier 2.2** (3D physics)
- **GSAP 3.15** + **@gsap/react** (scroll-triggered animations)
- **Motion 12.40** (formerly Framer Motion, UI transitions)

## Common Commands

All frontend commands run from the `frontend/` directory:

```bash
cd frontend
npm install              # Install dependencies
npm run dev              # Start Vite dev server (default :5173)
npm run build            # Production build → frontend/dist/
npm run preview          # Preview production build
npm run lint             # ESLint
```

## Architecture

### Directory Structure

```
KAIPage/
├── CLAUDE.md                   # Dev guide for Claude Code
├── README.md                   # Project README
├── project_progress_documentation.md  # Technical handover & progress docs
├── .gitignore
└── frontend/                   # All frontend source code
    ├── index.html              # Entry HTML with SEO metadata
    ├── vite.config.js          # Vite config (React + Tailwind CSS v4 plugins)
    ├── eslint.config.js        # ESLint flat config
    ├── package.json            # Dependencies & scripts
    ├── public/                 # Static assets
    │   ├── background.mp4      # Hero background video
    │   ├── bio-bg.webm         # Bio section background video
    │   └── favicon.svg
    └── src/
        ├── main.jsx            # React entry point
        ├── index.css           # Global styles (Google Fonts + Tailwind directives)
        ├── App.jsx             # Main page controller: layout, simulators, Canvas textures
        ├── App.css             # App-specific 3D parallax styles
        │
        ├── ServerHangarCanvas.jsx # 3D server hangar canvas with lighting wave animation
        ├── GooeyNav.jsx/css    # Sticky gooey fluid navigation bar
        ├── ProfileCard.jsx/css # 3D tilt-gloss personal card
        ├── ElectricBorder.jsx/css  # Animated flowing electric border
        ├── RotatingText.jsx/css    # Character/word rotation animation
        ├── ScrollFloat.jsx/css     # Scroll-driven letter fade-in
        ├── SplitText.jsx           # GSAP ScrollTrigger text split animation
        ├── TextType.jsx/css        # Typewriter animation
        ├── ShinyText.jsx/css       # Shimmer/shine text effect
        ├── Shuffle.jsx/css         # Character shuffle animation
        ├── CircularGallery.jsx/css # 3D circular image carousel
        ├── GlassIcons.jsx/css      # Glass-morphism icon filter buttons
        ├── MagicBento.jsx/css      # Bento grid layout component
        └── assets/                 # 3D models and textures
          └── hero.png            # Hero image
```

### Page Sections (App.jsx)

1. **Hero** (`#hero`): Full-viewport with 3D ServerHangarCanvas background (lighting wave, zoom-in animation), grid overlay, interactive Canvas particles, SplitText headings, RotatingText loop, ElectricBorder + TextType combo
2. **Bio** (`#experience`): ProfileCard (3D tilt card) + CircularGallery (3D image carousel) with GlassIcons category filters lifecycle/life photos and tech/reflections
3. **Competencies** (`#competencies`): 4-column static benefit cards (Vibe Coding, Java JUC, MySQL, Redis/Kafka)
4. **Footer** (`#footer`): Contact info + email/phone CTAs

### Key Technical Details

**Scroll-driven Animations (App.jsx):**
- GSAP ScrollTrigger timeline on `#experience` section: animates profile card, titles, filter buttons, gallery with staggered entrance
- Scroll-synced background video reveal via GSAP `scrub`
- Navigation active index tracks scroll position via `getBoundingClientRect` against a 40% viewport threshold

**Canvas Particle Background:**
- 60 particles with mouse gravity interaction
- Distance-based line connections (max 110px)
- Rendered on an overlay Canvas in the hero section

## Design System

**Typography** (Google Fonts via `index.css`):
- **Nunito** + **Plus Jakarta Sans** — body text
- **Outfit** — display/headings (`.font-display`)
- **Space Grotesk** — mono/code labels

**Color Palette:**
- Primary accent: `#FF6B00` (vibrant orange)
- Background: `#0A0A0C` / `#0F0F12` / `#0E0E11` (deep dark)
- Borders: `border-neutral-800` / `border-neutral-900`
- Text: `text-white` / `text-neutral-400`

## Key Constraints

- **Never commit `.claude/` directory** (contains local settings)
- `vite.config.js` includes `assetsInclude: ['**/*.glb']` — 3D models must be imported as assets
- Tailwind CSS v4 uses `@import "tailwindcss"` (not `@tailwind base/components/utilities`)
- Font theme is defined via `@theme` block in `index.css`
- **功能编写完毕后，自动进行测试并修复发现的问题。** 包括：启动服务、验证编译通过、前端 E2E 测试（如 Puppeteer）。测试失败时自动排查并修复，直到全部通过。
- **修改完成后必须更新相关的技术文档**（CLAUDE.md、`project_progress_documentation.md` 等），保持文档与代码一致。
