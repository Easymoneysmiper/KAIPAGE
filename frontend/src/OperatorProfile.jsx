import React, { useEffect, useRef, useState } from 'react';
import { Terminal, Code, Cpu, Database, MapPin, Mail, ChevronDown, Layout, Server, Globe, Shield, RefreshCw, Zap, Disc, Activity, Layers } from 'lucide-react';
import { gsap } from 'gsap';
import InfiniteMenu from './InfiniteMenu';
import personalSchool from './assets/personal_school.png';
import personalPhoto1 from './assets/personal_photo1.jpg';
import personalPhoto2 from './assets/personal_photo2.jpg';
import personalEmail from './assets/personal_email.png';
import personalUltraman from './assets/personal_ultraman.png';
import personalFigures from './assets/personal_figures.png';
import personalFitness from './assets/personal_fitness.png';
// Custom SVG Component for GitHub (since Lucide v1.x removed brand icons)
const Github = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.size || "24"}
    height={props.size || "24"}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={props.className}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

// ==========================================
// PURE RAW WEBGL SHADER SOURCES
// ==========================================
const vs = `
  attribute vec2 position;
  varying vec2 vUv;
  void main() {
    vUv = position * 0.5 + 0.5;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const fs = `
  precision highp float;

  uniform vec3  iResolution;
  uniform vec2  iMouse;
  uniform float iTime;

  uniform vec3  uColor0;
  uniform vec3  uColor1;
  uniform vec3  uColor2;
  uniform vec3  uColor3;
  uniform vec3  uColor4;
  uniform vec3  uColor5;
  uniform vec3  uColor6;
  uniform vec3  uColor7;
  uniform int   uColorCount;

  uniform vec3  uMouseColor;
  uniform vec2  uFlow;
  uniform float uSpeed;
  uniform float uScale;
  uniform float uTurbulence;
  uniform float uFluidity;
  uniform float uRimWidth;
  uniform float uSharpness;
  uniform float uShimmer;
  uniform float uGlow;
  uniform float uOpacity;
  uniform float uMouseEnabled;
  uniform float uMouseStrength;
  uniform float uMouseRadius;

  varying vec2 vUv;

  #define PI 3.14159265

  vec3 palette(float h) {
    int count = uColorCount;
    if (count < 1) count = 1;
    
    float clampH = clamp(h, 0.0, 0.999999);
    int idx = int(floor(clampH * float(count)));
    
    if (idx <= 0) return uColor0;
    if (idx == 1) return uColor1;
    if (idx == 2) return uColor2;
    if (idx == 3) return uColor3;
    if (idx == 4) return uColor4;
    if (idx == 5) return uColor5;
    if (idx == 6) return uColor6;
    return uColor7;
  }

  float hash(vec3 p3) {
    p3 = fract(p3 * 0.1031);
    p3 += dot(p3, p3.zyx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
  }

  float smin(float a, float b, float k) {
    float r = exp2(-a / k) + exp2(-b / k);
    return -k * log2(r);
  }

  float sinlerp(float a, float b, float w) {
    return mix(a, b, (sin(w * PI - PI / 2.0) + 1.0) / 2.0);
  }

  float vn(vec2 p, float s, float seed) {
    vec2 cellp = floor(p / s);
    vec2 relp = mod(p, s);
    float g1 = hash(vec3(cellp, seed));
    float g2 = hash(vec3(cellp.x + 1.0, cellp.y, seed));
    float g3 = hash(vec3(cellp.x + 1.0, cellp.y + 1.0, seed));
    float g4 = hash(vec3(cellp.x, cellp.y + 1.0, seed));
    float bx = sinlerp(g1, g2, relp.x / s);
    float tx = sinlerp(g4, g3, relp.x / s);
    return sinlerp(bx, tx, relp.y / s);
  }

  float dbn(vec2 p, float s, float seed) {
    float o = s / 2.0;
    float n0 = vn(p, s, seed);
    float n1 = vn(p + vec2(o, o), s, seed + 0.1);
    float n2 = vn(p + vec2(-o, o), s, seed + 0.2);
    float n3 = vn(p + vec2(o, -o), s, seed + 0.3);
    float n4 = vn(p + vec2(-o, -o), s, seed + 0.4);
    return (2.0 * n0 + 1.5 * n1 + 1.25 * n2 + 1.125 * n3 + n4) / 7.0;
  }

  void main() {
    vec2 fragCoord = vUv * iResolution.xy;
    float ref = 700.0 / max(uScale, 0.05);
    vec2 p = fragCoord / iResolution.y * ref;

    float spd = 200.0 * uSpeed;
    float t = iTime;

    vec2 dir = uFlow;
    vec2 perp = vec2(-dir.y, dir.x);

    float distort1 = vn(p + perp * (t * spd), 60.0, 10.0) * 50.0 * uTurbulence;
    float distort2 = vn(p - perp * (t * spd), 120.0, 15.0) * 100.0 * uTurbulence;

    float peaks = dbn(p + distort1 + dir * (t * spd * 0.5), 40.0, 1.0);
    float peaks2 = dbn(p + distort2 - dir * (t * spd * 0.5), 40.0, 0.0);

    float mapeaks = smin(peaks, peaks2, max(uFluidity, 0.001));

    float mGlow = 0.0;
    if (uMouseEnabled > 0.5) {
      vec2 mp = iMouse / iResolution.y * ref;
      float md = length(p - mp) / ref;
      float rr = max(uMouseRadius, 0.02);
      mGlow = exp(-md * md / (rr * rr)) * uMouseStrength;
    }

    float band = (uRimWidth - abs((mapeaks - 0.4) * 2.0)) * 5.0;
    float ltn = clamp(band - vn(p + dir * (t * spd * 0.5), 60.0, 12.0) * uShimmer, 0.0, 1.0);
    ltn = pow(ltn, uSharpness) * uGlow;
    ltn *= clamp(1.0 - mGlow, 0.0, 1.0);

    float h = clamp(0.5 + (peaks - peaks2) * 0.8, 0.0, 1.0);
    vec3 col = palette(h);

    vec3 outc = col * ltn;
    float a = clamp(max(outc.r, max(outc.g, outc.b)), 0.0, 1.0);
    gl_FragColor = vec4(outc, a * uOpacity);
  }
`;

const hexToRGB = hex => {
  const c = hex.replace('#', '').padEnd(6, '0');
  const r = parseInt(c.slice(0, 2), 16) / 255;
  const g = parseInt(c.slice(2, 4), 16) / 255;
  const b = parseInt(c.slice(4, 6), 16) / 255;
  return [r, g, b];
};

const flowVec = d => {
  switch (d) {
    case 'up': return [0, 1];
    case 'down': return [0, -1];
    case 'left': return [-1, 0];
    case 'right': return [1, 0];
    default: return [0, -1];
  }
};

const MAX_COLORS = 8;

const prepColors = input => {
  const base = (input && input.length ? input : ['#4F46E5', '#06B6D4', '#E0F2FE']).slice(0, MAX_COLORS);
  const count = base.length;
  const arr = [];
  for (let i = 0; i < MAX_COLORS; i++) arr.push(hexToRGB(base[Math.min(i, base.length - 1)]));
  const avg = [0, 0, 0];
  for (let i = 0; i < count; i++) {
    avg[0] += arr[i][0];
    avg[1] += arr[i][1];
    avg[2] += arr[i][2];
  }
  avg[0] /= count;
  avg[1] /= count;
  avg[2] /= count;
  return { arr, count, avg };
};
const Ferrofluid = ({
  className,
  colors = ['#06b6d4', '#a855f7', '#eab308'],
  speed = 0.25,
  scale = 1.3,
  turbulence = 1.1,
  fluidity = 0.12,
  rimWidth = 0.16,
  sharpness = 2.0,
  shimmer = 1.3,
  glow = 1.6,
  flowDirection = 'down',
  opacity = 0.38,
  mouseInteraction = true,
  mouseStrength = 1.4,
  mouseRadius = 0.4,
  mouseDampening = 0.15,
  mixBlendMode,
  isActive = false
}) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const requestRef = useRef(null);
  const renderRef = useRef(null);
  const isActiveRef = useRef(isActive);

  // Resume or pause render loop based on active state without rebuilding WebGL context
  useEffect(() => {
    isActiveRef.current = isActive;
    if (isActive) {
      if (!requestRef.current && renderRef.current) {
        requestRef.current = requestAnimationFrame(renderRef.current);
      }
    } else {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
        requestRef.current = null;
      }
    }
  }, [isActive]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const canvas = document.createElement('canvas');
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    container.appendChild(canvas);
    canvasRef.current = canvas;

    const gl = canvas.getContext('webgl', { antialias: false, powerPreference: "high-performance" }) || 
               canvas.getContext('experimental-webgl', { antialias: false });
    if (!gl) {
      console.error("WebGL context initialization failed.");
      return;
    }

    const compileShader = (source, type) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compilation log:", gl.getShaderInfoLog(shader));
        return null;
      }
      return shader;
    };

    const shaderProgram = gl.createProgram();
    const vertexShader = compileShader(vs, gl.VERTEX_SHADER);
    const fragmentShader = compileShader(fs, gl.FRAGMENT_SHADER);
    if (!vertexShader || !fragmentShader) return;

    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      console.error("Program linking log:", gl.getProgramInfoLog(shaderProgram));
      return;
    }

    const vertices = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
      -1,  1,
       1, -1,
       1,  1,
    ]);

    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(shaderProgram, 'position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    let mousePos = [0, 0];
    let currentMouse = [0, 0];

    const onPointerMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const dpr = 1.0; 
      const x = (e.clientX - rect.left) * dpr;
      const y = (rect.height - (e.clientY - rect.top)) * dpr;
      mousePos = [x, y];
    };

    if (mouseInteraction) {
      window.addEventListener('pointermove', onPointerMove, { passive: true });
    }

    const { arr, count, avg } = prepColors(colors);
    const flow = flowVec(flowDirection);

    const locs = {
      iResolution: gl.getUniformLocation(shaderProgram, 'iResolution'),
      iMouse: gl.getUniformLocation(shaderProgram, 'iMouse'),
      iTime: gl.getUniformLocation(shaderProgram, 'iTime'),
      uColorCount: gl.getUniformLocation(shaderProgram, 'uColorCount'),
      uMouseColor: gl.getUniformLocation(shaderProgram, 'uMouseColor'),
      uFlow: gl.getUniformLocation(shaderProgram, 'uFlow'),
      uSpeed: gl.getUniformLocation(shaderProgram, 'uSpeed'),
      uScale: gl.getUniformLocation(shaderProgram, 'uScale'),
      uTurbulence: gl.getUniformLocation(shaderProgram, 'uTurbulence'),
      uFluidity: gl.getUniformLocation(shaderProgram, 'uFluidity'),
      uRimWidth: gl.getUniformLocation(shaderProgram, 'uRimWidth'),
      uSharpness: gl.getUniformLocation(shaderProgram, 'uSharpness'),
      uShimmer: gl.getUniformLocation(shaderProgram, 'uShimmer'),
      uGlow: gl.getUniformLocation(shaderProgram, 'uGlow'),
      uOpacity: gl.getUniformLocation(shaderProgram, 'uOpacity'),
      uMouseEnabled: gl.getUniformLocation(shaderProgram, 'uMouseEnabled'),
      uMouseStrength: gl.getUniformLocation(shaderProgram, 'uMouseStrength'),
      uMouseRadius: gl.getUniformLocation(shaderProgram, 'uMouseRadius'),
    };

    const uColors = Array.from({ length: 8 }, (_, i) => 
      gl.getUniformLocation(shaderProgram, `uColor${i}`)
    );

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = 1.0; 
      const w = Math.floor(rect.width * dpr);
      const h = Math.floor(rect.height * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(container);

    let startTime = performance.now();
    let lastTime = startTime;

    const render = (time) => {
      if (!isActiveRef.current) {
        requestRef.current = null;
        return;
      }
      const elapsed = (time - startTime) * 0.001;
      const dt = (time - lastTime) * 0.001;
      lastTime = time;

      if (mouseDampening > 0) {
        const factor = 1 - Math.exp(-dt / Math.max(1e-4, mouseDampening));
        currentMouse[0] += (mousePos[0] - currentMouse[0]) * factor;
        currentMouse[1] += (mousePos[1] - currentMouse[1]) * factor;
      } else {
        currentMouse = [...mousePos];
      }

      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(shaderProgram);

      gl.uniform3f(locs.iResolution, canvas.width, canvas.height, 1);
      gl.uniform2f(locs.iMouse, currentMouse[0], currentMouse[1]);
      gl.uniform1f(locs.iTime, elapsed);
      gl.uniform1i(locs.uColorCount, count);
      gl.uniform3f(locs.uMouseColor, avg[0], avg[1], avg[2]);
      gl.uniform2f(locs.uFlow, flow[0], flow[1]);
      gl.uniform1f(locs.uSpeed, speed);
      gl.uniform1f(locs.uScale, scale);
      gl.uniform1f(locs.uTurbulence, turbulence);
      gl.uniform1f(locs.uFluidity, fluidity);
      gl.uniform1f(locs.uRimWidth, rimWidth);
      gl.uniform1f(locs.uSharpness, sharpness);
      gl.uniform1f(locs.uShimmer, shimmer);
      gl.uniform1f(locs.uGlow, glow);
      gl.uniform1f(locs.uOpacity, opacity);
      gl.uniform1f(locs.uMouseEnabled, mouseInteraction ? 1.0 : 0.0);
      gl.uniform1f(locs.uMouseStrength, mouseStrength);
      gl.uniform1f(locs.uMouseRadius, mouseRadius);

      for (let i = 0; i < 8; i++) {
        const c = arr[Math.min(i, arr.length - 1)];
        gl.uniform3f(uColors[i], c[0], c[1], c[2]);
      }

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      requestRef.current = requestAnimationFrame(render);
    };

    renderRef.current = render;
    if (isActiveRef.current) {
      requestRef.current = requestAnimationFrame(render);
    }

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      if (mouseInteraction) window.removeEventListener('pointermove', onPointerMove);
      observer.disconnect();
      gl.deleteBuffer(vertexBuffer);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      gl.deleteProgram(shaderProgram);
      if (canvas.parentElement === container) {
        container.removeChild(canvas);
      }
    };
  }, [colors, speed, scale, turbulence, fluidity, rimWidth, sharpness, shimmer, glow, flowDirection, opacity, mouseInteraction, mouseStrength, mouseRadius, mouseDampening]);

  return <div ref={containerRef} className={`ferrofluid-container ${className ?? ''}`} style={{ mixBlendMode }} />;
};

function parseHSL(hslStr) {
  const match = hslStr.match(/([\d.]+)\s*([\d.]+)%?\s*([\d.]+)%?/);
  if (!match) return { h: 40, s: 80, l: 80 };
  return { h: parseFloat(match[1]), s: parseFloat(match[2]), l: parseFloat(match[3]) };
}

function buildGlowVars(glowColor, intensity) {
  const { h, s, l } = parseHSL(glowColor);
  const base = `${h}deg ${s}% ${l}%`;
  const opacities = [100, 60, 50, 40, 30, 20, 10];
  const keys = ['', '-60', '-50', '-40', '-30', '-20', '-10'];
  const vars = {};
  for (let i = 0; i < opacities.length; i++) {
    vars[`--glow-color${keys[i]}`] = `hsl(${base} / ${Math.min(opacities[i] * intensity, 100)}%)`;
  }
  return vars;
}

const GRADIENT_POSITIONS = ['80% 55%', '69% 34%', '8% 6%', '41% 38%', '86% 85%', '82% 18%', '51% 4%'];
const GRADIENT_KEYS = ['--gradient-one', '--gradient-two', '--gradient-three', '--gradient-four', '--gradient-five', '--gradient-six', '--gradient-seven'];
const COLOR_MAP = [0, 1, 2, 0, 1, 2, 1];

function buildGradientVars(colors) {
  const vars = {};
  for (let i = 0; i < 7; i++) {
    const c = colors[Math.min(COLOR_MAP[i], colors.length - 1)];
    vars[GRADIENT_KEYS[i]] = `radial-gradient(at ${GRADIENT_POSITIONS[i]}, ${c} 0px, transparent 50%)`;
  }
  vars['--gradient-base'] = `linear-gradient(${colors[0]} 0 100%)`;
  return vars;
}

function easeOutCubic(x) { return 1 - Math.pow(1 - x, 3); }
function easeInCubic(x) { return x * x * x; }

function animateValue({ start = 0, end = 100, duration = 1000, delay = 0, ease = easeOutCubic, onUpdate, onEnd }) {
  const t0 = performance.now() + delay;
  function tick() {
    const elapsed = performance.now() - t0;
    const t = Math.min(elapsed / duration, 1);
    onUpdate(start + (end - start) * ease(t));
    if (t < 1) requestAnimationFrame(tick);
    else if (onEnd) onEnd();
  }
  setTimeout(() => requestAnimationFrame(tick), delay);
}

const BorderGlow = ({
  children,
  className = '',
  edgeSensitivity = 30,
  glowColor = '40 80 80',
  backgroundColor = '#120F17',
  borderRadius = 28,
  glowRadius = 40,
  glowIntensity = 1.0,
  coneSpread = 25,
  animated = false,
  colors = ['#c084fc', '#f472b6', '#38bdf8'],
  fillOpacity = 0.5,
  isPowered = false,
}) => {
  const cardRef = useRef(null);
  const rotationRef = useRef(0);

  useEffect(() => {
    const card = cardRef.current;
    if (!isPowered) {
      if (card) {
        card.style.setProperty('--edge-proximity', '0');
      }
      return;
    }

    let active = true;
    const rotate = () => {
      if (!active) return;
      rotationRef.current = (rotationRef.current + 0.8) % 360;
      if (card) {
        card.style.setProperty('--cursor-angle', `${rotationRef.current}deg`);
        card.style.setProperty('--edge-proximity', '100');
      }
      requestAnimationFrame(rotate);
    };
    
    rotate();
    return () => { 
      active = false; 
    };
  }, [isPowered]);

  useEffect(() => {
    if (!animated || !cardRef.current) return;
    const card = cardRef.current;
    const angleStart = 110;
    const angleEnd = 465;
    card.classList.add('sweep-active');
    card.style.setProperty('--cursor-angle', `${angleStart}deg`);

    animateValue({ duration: 500, onUpdate: v => card.style.setProperty('--edge-proximity', v) });
    animateValue({ ease: easeInCubic, duration: 1500, end: 50, onUpdate: v => {
      card.style.setProperty('--cursor-angle', `${(angleEnd - angleStart) * (v / 100) + angleStart}deg`);
    }});
    animateValue({ ease: easeOutCubic, delay: 1500, duration: 2250, start: 50, end: 100, onUpdate: v => {
      card.style.setProperty('--cursor-angle', `${(angleEnd - angleStart) * (v / 100) + angleStart}deg`);
    }});
    animateValue({ ease: easeInCubic, delay: 2500, duration: 1500, start: 100, end: 0,
      onUpdate: v => card.style.setProperty('--edge-proximity', v),
      onEnd: () => card.classList.remove('sweep-active'),
    });
  }, [animated]);

  const glowVars = buildGlowVars(glowColor, glowIntensity);

  return (
    <div
      ref={cardRef}
      className={`border-glow-card ${isPowered ? 'glow-powered' : ''} ${className}`}
      style={{
        '--card-bg': backgroundColor,
        '--edge-sensitivity': edgeSensitivity,
        '--border-radius': `${borderRadius}px`,
        '--glow-padding': `${glowRadius}px`,
        '--cone-spread': coneSpread,
        '--fill-opacity': fillOpacity,
        ...glowVars,
        ...buildGradientVars(colors),
      }}
    >
      <span className="edge-light" />
      <div className="border-glow-inner">
        {children}
      </div>
    </div>
  );
};

const FERROFLUID_COLORS = ['#06b6d4', '#a855f7', '#eab308', '#0284c7', '#7c3aed', '#d97706'];

const MENU_ITEMS = [
  {
    image: personalSchool,
    link: 'https://github.com/easymoneysniper',
    title: 'JILIN UNIVERSITY',
    description: '吉林大学 软件工程本科在读 (JLU)'
  },
  {
    image: personalPhoto1,
    link: 'weixin://',
    title: 'WECHAT CONTACT',
    description: '微信号: pkai_jlu'
  },
  {
    image: personalPhoto2,
    link: 'tencent://message/?uin=1587635881',
    title: 'QQ CONNECTION',
    description: 'QQ号: 1587635881'
  },
  {
    image: personalEmail,
    link: 'mailto:pkai_jlu@163.com',
    title: 'EMAIL INBOX',
    description: '邮箱: pkai_jlu@163.com'
  },
  {
    image: personalUltraman,
    link: 'https://github.com/easymoneysniper',
    title: 'ULTRAMAN FAN',
    description: '特摄文化与奥特曼收集爱好者'
  },
  {
    image: personalFigures,
    link: 'https://github.com/easymoneysniper',
    title: 'COLLECTIBLES',
    description: '各种手办模型与战术机甲涂装'
  },
  {
    image: personalFitness,
    link: 'https://github.com/easymoneysniper',
    title: 'FITNESS HOBBY',
    description: '力量训练与卡路里监控健康生活'
  }
];

export default function OperatorProfile({ isActive = false }) {
  const wrapRef = useRef(null);
  const scrollIndicatorRef = useRef(null);
  const platformRef = useRef(null);
  
  const scrollPercentTextRef = useRef(null);
  const scrollProgressBarRef = useRef(null);
  
  const reactorGridPercentRef = useRef(null);
  const reactorProgressBarRef = useRef(null);

  const bioUnitStatusRef = useRef(null);
  const skillNetStatusRef = useRef(null);
  const ctrlUnitStatusRef = useRef(null);

  // 🌟 Scheme A: Cards are initialized to activeLight = 3 (Always fully online on load)
  const [activeLight] = useState(3); 

  useEffect(() => {
    if (!isActive) {
      if (scrollPercentTextRef.current) scrollPercentTextRef.current.textContent = '0%';
      if (scrollProgressBarRef.current) scrollProgressBarRef.current.style.width = '0%';
      if (reactorGridPercentRef.current) {
        reactorGridPercentRef.current.textContent = '0%';
        reactorGridPercentRef.current.className = "text-gray-500 font-bold";
      }
      if (reactorProgressBarRef.current) {
        reactorProgressBarRef.current.style.width = '0%';
        reactorProgressBarRef.current.className = "h-full rounded-full bg-gray-700";
      }
      if (bioUnitStatusRef.current) {
        bioUnitStatusRef.current.className = "py-1.5 border rounded-lg border-gray-900 text-gray-700 transition-all duration-300";
      }
      if (skillNetStatusRef.current) {
        skillNetStatusRef.current.className = "py-1.5 border rounded-lg border-gray-900 text-gray-700 transition-all duration-300";
      }
      if (ctrlUnitStatusRef.current) {
        ctrlUnitStatusRef.current.className = "py-1.5 border rounded-lg border-gray-900 text-gray-700 transition-all duration-300";
      }
      return;
    }

    const animObj = { val: 0 };
    const tween = gsap.to(animObj, {
      val: 100,
      duration: 2.2,
      ease: "power2.out",
      onUpdate: () => {
        const p = Math.round(animObj.val);
        if (scrollPercentTextRef.current) scrollPercentTextRef.current.textContent = `${p}%`;
        if (scrollProgressBarRef.current) scrollProgressBarRef.current.style.width = `${p}%`;

        if (reactorGridPercentRef.current) {
          reactorGridPercentRef.current.textContent = `${p}%`;
          if (p > 80) {
            reactorGridPercentRef.current.className = "text-yellow-400 glow-text-yellow font-bold";
          } else if (p > 35) {
            reactorGridPercentRef.current.className = "text-purple-400 glow-text-purple font-bold";
          } else {
            reactorGridPercentRef.current.className = "text-cyan-400 glow-text-cyan font-bold";
          }
        }
        if (reactorProgressBarRef.current) {
          reactorProgressBarRef.current.style.width = `${p}%`;
          if (p > 80) {
            reactorProgressBarRef.current.className = "h-full rounded-full transition-all duration-300 bg-yellow-500 shadow-[0_0_12px_#eab308]";
          } else if (p > 35) {
            reactorProgressBarRef.current.className = "h-full rounded-full transition-all duration-300 bg-purple-500 shadow-[0_0_12px_#a855f7]";
          } else {
            reactorProgressBarRef.current.className = "h-full rounded-full transition-all duration-300 bg-cyan-400 shadow-[0_0_12px_#06b6d4]";
          }
        }

        if (p >= 33) {
          if (bioUnitStatusRef.current) bioUnitStatusRef.current.className = "py-1.5 border rounded-lg border-cyan-500/50 bg-cyan-950/20 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.3)] font-bold transition-all duration-300";
        }
        if (p >= 66) {
          if (skillNetStatusRef.current) skillNetStatusRef.current.className = "py-1.5 border rounded-lg border-purple-500/50 bg-purple-950/20 text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.3)] font-bold transition-all duration-300";
        }
        if (p >= 100) {
          if (ctrlUnitStatusRef.current) ctrlUnitStatusRef.current.className = "py-1.5 border rounded-lg border-yellow-500/50 bg-yellow-950/20 text-yellow-300 shadow-[0_0_12px_rgba(234,179,8,0.3)] font-bold transition-all duration-300";
        }
      }
    });

    return () => {
      tween.kill();
    };
  }, [isActive]);
  return (
    <div ref={wrapRef} className="relative w-full h-full bg-[#03010a] text-gray-200 font-mono selection:bg-cyan-500/30 overflow-hidden">
      
      {/* WebGL Background */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-[#03010a] pointer-events-none">
        <Ferrofluid
          isActive={isActive}
          colors={FERROFLUID_COLORS}
          speed={0.16}
          scale={1.3}
          turbulence={1.0}
          fluidity={0.15}
          rimWidth={0.18}
          sharpness={2.2}
          shimmer={1.2}
          glow={1.8}
          flowDirection="down"
          opacity={0.42}
          mouseInteraction={true}
          mouseStrength={1.5}
          mouseRadius={0.4}
          mixBlendMode="screen"
        />
      </div>

      {/* Premium Stylesheets injection */}
      <style dangerouslySetInnerHTML={{__html: `
        .border-glow-card {
          --edge-proximity: 0;
          --cursor-angle: 45deg;
          --edge-sensitivity: 25;
          --color-sensitivity: calc(var(--edge-sensitivity) + 15);
          --border-radius: 24px;
          --glow-padding: 45px;
          --cone-spread: 28;

          position: relative;
          border-radius: var(--border-radius);
          isolation: isolate;
          transform: translate3d(0, 0, 0.01px);
          display: grid;
          border: 1px solid rgba(255, 255, 255, 0.05);
          background: var(--card-bg, #04060a);
          overflow: visible;
          box-shadow: 0px 40px 80px rgba(0,0,0,0.95);
          transition: border-color 0.4s ease, filter 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .border-glow-card::before,
        .border-glow-card::after,
        .border-glow-card > .edge-light {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          transition: opacity 0.4s ease-out;
          z-index: -1;
        }

        .border-glow-card:not(:hover):not(.sweep-active)::before,
        .border-glow-card:not(:hover):not(.sweep-active)::after,
        .border-glow-card:not(:hover):not(.sweep-active) > .edge-light {
          opacity: 0;
          transition: opacity 0.7s ease-in-out;
        }

        .border-glow-card.glow-powered::before,
        .border-glow-card.glow-powered::after,
        .border-glow-card.glow-powered > .edge-light {
          opacity: 1 !important;
        }

        .border-glow-card.glow-powered.glow-cyan {
          filter: drop-shadow(0 0 35px rgba(6, 182, 212, 0.55)) drop-shadow(0 0 90px rgba(6, 182, 212, 0.3));
        }
        .border-glow-card.glow-powered.glow-purple {
          filter: drop-shadow(0 0 35px rgba(168, 85, 247, 0.55)) drop-shadow(0 0 90px rgba(168, 85, 247, 0.3));
        }
        .border-glow-card.glow-powered.glow-yellow {
          filter: drop-shadow(0 0 35px rgba(234, 179, 8, 0.55)) drop-shadow(0 0 90px rgba(234, 179, 8, 0.3));
        }

        .border-glow-card::before {
          border: 1px solid transparent;
          background:
            linear-gradient(var(--card-bg, #04060a) 0 100%) padding-box,
            linear-gradient(rgb(255 255 255 / 0%) 0% 100%) border-box,
            var(--gradient-one) border-box,
            var(--gradient-two) border-box,
            var(--gradient-three) border-box,
            var(--gradient-four) border-box,
            var(--gradient-five) border-box,
            var(--gradient-six) border-box,
            var(--gradient-seven) border-box,
            var(--gradient-base) border-box;

          opacity: calc((var(--edge-proximity) - var(--color-sensitivity)) / (100 - var(--color-sensitivity)));

          mask-image:
            conic-gradient(
              from var(--cursor-angle) at center,
              black calc(var(--cone-spread) * 1%),
              transparent calc((var(--cone-spread) + 12) * 1%),
              transparent calc((100 - var(--cone-spread) - 12) * 1%),
              black calc((100 - var(--cone-spread)) * 1%)
            );
        }

        .border-glow-card::after {
          border: 1px solid transparent;
          background:
            var(--gradient-one) padding-box,
            var(--gradient-two) padding-box,
            var(--gradient-three) padding-box,
            var(--gradient-four) padding-box,
            var(--gradient-five) padding-box,
            var(--gradient-six) padding-box,
            var(--gradient-seven) padding-box,
            var(--gradient-base) padding-box;

          mask-image:
            linear-gradient(to bottom, black, black),
            radial-gradient(ellipse at 50% 50%, black 40%, transparent 65%),
            radial-gradient(ellipse at 66% 66%, black 5%, transparent 40%),
            conic-gradient(from var(--cursor-angle) at center, transparent 5%, black 15%, black 85%, transparent 95%);

          mask-composite: subtract, add, add;
          opacity: calc(var(--fill-opacity, 0.6) * (var(--edge-proximity) - var(--color-sensitivity)) / (100 - var(--color-sensitivity)));
          mix-blend-mode: screen;
        }

        .border-glow-card > .edge-light {
          inset: calc(var(--glow-padding) * -1.25);
          pointer-events: none;
          z-index: 1;

          mask-image:
            conic-gradient(
              from var(--cursor-angle) at center, black 1.5%, transparent 8%, transparent 92%, black 98.5%
            );

          opacity: calc((var(--edge-proximity) - var(--edge-sensitivity)) / (100 - var(--edge-sensitivity)));
          mix-blend-mode: plus-lighter;
        }

        .border-glow-card > .edge-light::before {
          content: "";
          position: absolute;
          inset: calc(var(--glow-padding) * 1.25);
          border-radius: inherit;
          box-shadow:
            inset 0 0 0 2px var(--glow-color),
            inset 0 0 4px 0 var(--glow-color-60),
            inset 0 0 12px 0 var(--glow-color-50),
            inset 0 0 28px 0 var(--glow-color-40),
            inset 0 0 55px 0 var(--glow-color-30),
            inset 0 0 110px 4px var(--glow-color-20),
            0 0 3px 0 var(--glow-color-60),
            0 0 10px 0 var(--glow-color-50),
            0 0 28px 0 var(--glow-color-40),
            0 0 70px 4px var(--glow-color-30),
            0 0 130px 15px var(--glow-color-20),
            0 0 260px 30px var(--glow-color-10);
        }

        .border-glow-inner {
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
          z-index: 2;
          height: 100%;
        }

        .deck-3d-scene {
          perspective: 1500px;
          perspective-origin: 50% 50%;
        }
        
        .deck-3d-platform {
          transform-style: preserve-3d;
          transition: transform 0.1s cubic-bezier(0.25, 0.8, 0.25, 1);
        }
        
        .card-transition-wrapper {
          opacity: 0;
          transform: translate3d(0, 15px, -30px) scale(0.95);
          filter: brightness(0.1) blur(2.5px) saturate(0.2);
          transition: opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1), 
                      transform 1.2s cubic-bezier(0.16, 1, 0.3, 1),
                      filter 1.2s cubic-bezier(0.16, 1, 0.3, 1);
          transform-style: preserve-3d;
          pointer-events: none;
        }

        .card-transition-wrapper.light-active {
          opacity: 1;
          transform: translate3d(0, 0, 0) scale(1);
          pointer-events: auto;
        }

        .card-transition-wrapper.light-active.light-active-cyan {
          filter: brightness(1.2) saturate(1.2) drop-shadow(0 0 35px rgba(6, 182, 212, 0.55)) drop-shadow(0 0 90px rgba(6, 182, 212, 0.3));
        }
        .card-transition-wrapper.light-active.light-active-purple {
          filter: brightness(1.2) saturate(1.2) drop-shadow(0 0 35px rgba(168, 85, 247, 0.55)) drop-shadow(0 0 90px rgba(168, 85, 247, 0.3));
        }
        .card-transition-wrapper.light-active.light-active-yellow {
          filter: brightness(1.2) saturate(1.2) drop-shadow(0 0 35px rgba(234, 179, 8, 0.55)) drop-shadow(0 0 90px rgba(234, 179, 8, 0.3));
        }

        .unpowered-card {
          opacity: 1 !important;
          pointer-events: none !important;
          filter: brightness(0.015) blur(2.5px) saturate(0.1) !important;
          transform: scale(0.95) translate3d(0, 15px, -30px) !important;
        }

        .cascade-item {
          opacity: 0;
          transform: translateY(15px);
          transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .light-active .cascade-item {
          opacity: 1;
          transform: translateY(0);
        }

        .light-active .boot-stagger-1 { transition-delay: 0.08s !important; }
        .light-active .boot-stagger-2 { transition-delay: 0.16s !important; }
        .light-active .boot-stagger-3 { transition-delay: 0.24s !important; }
        .light-active .boot-stagger-4 { transition-delay: 0.32s !important; }
        .light-active .boot-stagger-5 { transition-delay: 0.40s !important; }

        .glow-text-cyan {
          text-shadow: 0 0 12px rgba(6, 182, 212, 0.95), 0 0 2px rgba(255,255,255,1);
        }
        .glow-text-purple {
          text-shadow: 0 0 12px rgba(168, 85, 247, 0.95), 0 0 2px rgba(255,255,255,1);
        }
        .glow-text-yellow {
          text-shadow: 0 0 12px rgba(234, 179, 8, 0.95), 0 0 2px rgba(255,255,255,1);
        }

        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(520px); }
        }
        .powered-scanline-cyan {
          position: absolute;
          top: 0; left: 0; right: 0; height: 3px;
          background: linear-gradient(to right, transparent, rgba(0, 243, 255, 0.6), transparent);
          box-shadow: 0 0 8px rgba(0, 243, 255, 0.8);
          animation: scanline 4s linear infinite;
          pointer-events: none;
          z-index: 10;
        }
        .powered-scanline-purple {
          position: absolute;
          top: 0; left: 0; right: 0; height: 3px;
          background: linear-gradient(to right, transparent, rgba(168, 85, 247, 0.6), transparent);
          box-shadow: 0 0 8px rgba(168, 85, 247, 0.8);
          animation: scanline 4s linear infinite;
          pointer-events: none;
          z-index: 10;
        }
        .powered-scanline-yellow {
          position: absolute;
          top: 0; left: 0; right: 0; height: 3px;
          background: linear-gradient(to right, transparent, rgba(234, 179, 8, 0.6), transparent);
          box-shadow: 0 0 8px rgba(234, 179, 8, 0.8);
          animation: scanline 4s linear infinite;
          pointer-events: none;
          z-index: 10;
        }

        .grid-plane-floor {
          position: absolute;
          bottom: -300px;
          left: -50%;
          width: 200%;
          height: 1200px;
          background-size: 40px 40px;
          background-image: 
            linear-gradient(to right, rgba(6, 182, 212, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(6, 182, 212, 0.05) 1px, transparent 1px);
          transform: rotateX(85deg);
          transform-origin: top center;
          mask-image: radial-gradient(ellipse at top, black 30%, transparent 80%);
        }

        .grid-plane-ceiling {
          position: absolute;
          top: -300px;
          left: -50%;
          width: 200%;
          height: 1200px;
          background-size: 40px 40px;
          background-image: 
            linear-gradient(to right, rgba(168, 85, 247, 0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(168, 85, 247, 0.03) 1px, transparent 1px);
          transform: rotateX(-85deg);
          transform-origin: bottom center;
          mask-image: radial-gradient(ellipse at bottom, black 30%, transparent 80%);
        }

        .neon-glow-cyan { filter: drop-shadow(0 0 8px rgba(6,182,212,0.9)); }
        .neon-glow-purple { filter: drop-shadow(0 0 8px rgba(168,85,247,0.9)); }
        .neon-glow-yellow { filter: drop-shadow(0 0 8px rgba(234,179,8,0.9)); }

        @keyframes pulse-flow {
          0% { stroke-dashoffset: 120; }
          100% { stroke-dashoffset: 0; }
        }
        .wire-pulse {
          stroke-dasharray: 10 20;
          animation: pulse-flow 3s linear infinite;
        }

        .hud-border-cyan { border-color: rgba(6, 182, 212, 0.35); }
        .hud-border-purple { border-color: rgba(168, 85, 247, 0.35); }
        .hud-border-yellow { border-color: rgba(234, 179, 8, 0.35); }

        .ferrofluid-container {
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
      `}} />


      {/* ==================== PERSPECTIVE STAGE ==================== */}
      <div className="absolute inset-0 overflow-hidden flex items-center justify-center z-10 deck-3d-scene pointer-events-none">
        
        {/* Luminous Floor & Ceiling Lines */}
        <div className="grid-plane-floor"></div>
        <div className="grid-plane-ceiling"></div>

        {/* 3D PARALLAX WRAPPER PLATFORM */}
        <div 
          ref={platformRef}
          className="w-full max-w-[1200px] mx-auto px-6 h-[550px] relative flex flex-col justify-center deck-3d-platform pointer-events-auto z-20"
          style={{
            transform: `rotateX(0deg) rotateY(0deg)`,
          }}
        >
          <InfiniteMenu items={MENU_ITEMS} scale={0.75} isActive={isActive} />
        </div>

        {/* ==================== SYSTEM STATUS FOOTER ==================== */}
        <div 
          ref={scrollIndicatorRef}
          className="absolute bottom-11 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 transition-opacity duration-300 pointer-events-none z-30 font-mono text-center"
        >
          <span className="text-[11px] text-cyan-400 tracking-[0.25em] uppercase animate-pulse neon-glow-cyan">SYS_STATUS: ACTIVE // ALL SUB_CORES OPERATIONAL</span>
          <span className="text-[9px] text-gray-500 tracking-wider">SECURE LINK ESTABLISHED // JILIN UNIVERSITY SECTOR</span>
        </div>

        {/* Dynamic bottom telemetry progress indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-64 h-[2px] bg-gray-950 border border-gray-900 rounded-full overflow-hidden">
          <div 
            ref={scrollProgressBarRef}
            className="h-full bg-cyan-500 transition-all duration-300 shadow-[0_0_12px_#06b6d4]"
            style={{ width: `0%` }}
          />
        </div>

      </div>
    </div>
  );
}
