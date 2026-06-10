import React, { useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { MeshReflectorMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ==================== Symmetrical Server Rack Chassis ====================
function IndustrialMachine({ position }) {
  const height = 2.8;
  const width = 0.9; // Spaced out width
  const depth = 1.1; // Cabinet depth
  
  const rotationY = -Math.PI / 2;
  const isLeft = position[0] < 0;

  // Panel Z coordinates relative to the corridor center:
  // Detailed panel (cyan | | | and red dot) is on the side away from the corridor
  // Simple panel (cyan |) is on the side closer to the corridor
  const leftPanelZ = -0.27; // Cyan | | | panel Z
  const rightPanelZ = 0.315; // Cyan | panel Z
  const centerChannelZ = 0.045; // Recessed channel Z
  const dividerZ1 = -0.09;
  const dividerZ2 = 0.18;

  // Shared materials
  const darkBackingMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#101014",
    metalness: 0.85,
    roughness: 0.4
  }), []);

  const cyanIndicatorMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#00e5ff",
    emissive: new THREE.Color("#00b0ff"),
    emissiveIntensity: 8.0
  }), []);

  const chassisMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#060608",
    metalness: 0.92,
    roughness: 0.35
  }), []);

  const glassMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: "#0a0a0f",
    transparent: true,
    opacity: 0.18,
    roughness: 0.04,
    metalness: 0.1,
    transmission: 0.90,
    thickness: 0.02
  }), []);

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Main Rack Frame (Dark steel chassis box) */}
      <mesh position={[0, height / 2, 0]} material={chassisMaterial}>
        <boxGeometry args={[depth, height, width]} />
      </mesh>

      {/* Symmetrical corner support columns */}
      {[-depth / 2, depth / 2].map((x, i) => (
        [-width / 2, width / 2].map((z, j) => (
          <mesh key={`${i}-${j}`} position={[x, height / 2, z]}>
            <boxGeometry args={[0.04, height + 0.01, 0.04]} />
            <meshStandardMaterial 
              color="#1c1c22" 
              metalness={0.95} 
              roughness={0.15} 
            />
          </mesh>
        ))
      ))}

      {/* Front Face Overlay (Left Panel, Middle Recessed Channel, Right Panel) */}
      {/* For left side, rotate by 180 deg (Math.PI) and scale X by -1 to mirror Z layout while keeping recessed X depth correct */}
      <group 
        position={[depth / 2 + 0.002, 0, 0]} 
        rotation={[0, isLeft ? Math.PI : 0, 0]}
        scale={[isLeft ? -1 : 1, 1, 1]}
      >
        {/* Dark Backing Plane for left/right panels */}
        <mesh position={[0, height / 2, 0]}>
          <planeGeometry args={[width - 0.01, height - 0.02]} />
          <meshStandardMaterial color="#040406" roughness={0.9} />
        </mesh>

        {/* ================= DETAILED PANEL (width 0.36, contains | | | and red dot) ================= */}
        {Array.from({ length: 8 }).map((_, i) => {
          const yVal = 0.22 + i * 0.33;
          return (
            <group key={`detailed-blade-${i}`} position={[0, yVal, leftPanelZ]}>
              {/* Blade Backing Plate */}
              <mesh position={[0, 0, 0]} material={darkBackingMaterial}>
                <planeGeometry args={[0.34, 0.26]} />
              </mesh>
              
              {/* 3 Glowing Cyan Indicators: | | | */}
              {[-0.08, 0, 0.08].map((zOffset, j) => (
                <mesh key={`cyan-left-${j}`} position={[0.001, 0, zOffset]} material={cyanIndicatorMaterial}>
                  <planeGeometry args={[0.015, 0.08]} />
                </mesh>
              ))}

              {/* 1 Glowing Tiny Red Dot in the middle top */}
              <mesh position={[0.001, 0.065, 0]}>
                <planeGeometry args={[0.008, 0.008]} />
                <meshStandardMaterial 
                  color="#ff1744" 
                  emissive="#ff1744" 
                  emissiveIntensity={9.0} 
                />
              </mesh>
            </group>
          );
        })}

        {/* ================= SIMPLE PANEL (width 0.27, contains | ) ================= */}
        {Array.from({ length: 8 }).map((_, i) => {
          const yVal = 0.22 + i * 0.33;
          return (
            <group key={`simple-blade-${i}`} position={[0, yVal, rightPanelZ]}>
              {/* Blade Backing Plate */}
              <mesh position={[0, 0, 0]} material={darkBackingMaterial}>
                <planeGeometry args={[0.25, 0.26]} />
              </mesh>
              
              {/* 1 Glowing Cyan Indicator: | */}
              <mesh position={[0.001, 0, 0]} material={cyanIndicatorMaterial}>
                <planeGeometry args={[0.015, 0.08]} />
              </mesh>
            </group>
          );
        })}

        {/* ================= CENTER RECESSED CHANNEL (width 0.27, recessed in X) ================= */}
        <group position={[-0.05, 0, centerChannelZ]}>
          {/* Recessed Backing Plate */}
          <mesh position={[0, height / 2, 0]}>
            <planeGeometry args={[0.26, height - 0.04]} />
            <meshStandardMaterial color="#08080c" roughness={0.95} />
          </mesh>

          {/* Horizontal grille lines */}
          {Array.from({ length: 24 }).map((_, k) => {
            const barY = 0.12 + k * 0.11;
            return (
              <mesh key={`grille-${k}`} position={[0.001, barY, 0]}>
                <planeGeometry args={[0.26, 0.015]} />
                <meshStandardMaterial color="#141418" metalness={0.9} roughness={0.6} />
              </mesh>
            );
          })}

          {/* Vertical Glowing Fiber Optic Cables inside the recessed channel */}
          {/* Cyan/Blue Glowing Cable */}
          <mesh position={[0.02, height / 2, -0.06]}>
            <cylinderGeometry args={[0.006, 0.006, height - 0.1, 8]} />
            <meshStandardMaterial 
              color="#00e5ff" 
              emissive="#00b0ff" 
              emissiveIntensity={8.0} 
            />
          </mesh>
          {/* Orange/Amber Glowing Cable */}
          <mesh position={[0.02, height / 2, 0.06]}>
            <cylinderGeometry args={[0.006, 0.006, height - 0.1, 8]} />
            <meshStandardMaterial 
              color="#ff9100" 
              emissive="#ff3d00" 
              emissiveIntensity={8.0} 
            />
          </mesh>

          {/* Middle Horizontal Orange Status Glow Strip */}
          <mesh position={[0.002, 1.35, 0]}>
            <planeGeometry args={[0.26, 0.035]} />
            <meshStandardMaterial 
              color="#ff9100" 
              emissive="#ff3d00" 
              emissiveIntensity={12.0} 
            />
          </mesh>

          {/* Bottom Horizontal Cyan Glow Strip */}
          <mesh position={[0.002, 0.08, 0]}>
            <planeGeometry args={[0.26, 0.025]} />
            <meshStandardMaterial 
              color="#00e5ff" 
              emissive="#00b0ff" 
              emissiveIntensity={12.0} 
            />
          </mesh>
        </group>

        {/* Divider rails framing the center recessed channel */}
        {[dividerZ1, dividerZ2].map((zPos, idx) => (
          <mesh key={`divider-${idx}`} position={[-0.025, height / 2, zPos]}>
            <boxGeometry args={[0.05, height - 0.02, 0.02]} />
            <meshStandardMaterial color="#121216" metalness={0.9} roughness={0.2} />
          </mesh>
        ))}

        {/* Glass Cabinet Door (Tinted cover reflecting the ceiling lights) */}
        <mesh position={[0.012, height / 2, 0]} material={glassMaterial}>
          <planeGeometry args={[width - 0.02, height - 0.02]} />
        </mesh>
      </group>
    </group>
  );
}

// ==================== Linear Orange Ceiling Light Grid Panel ====================
const LightPanel = React.forwardRef(({ position }, ref) => {
  // Shared orange glow material across sub-meshes
  const glowMaterial = useMemo(() => new THREE.MeshBasicMaterial({
    color: new THREE.Color("#ff881b"),
    toneMapped: false,
    transparent: true,
    opacity: 0
  }), []);

  // Expose material to GSAP timeline
  React.useImperativeHandle(ref, () => ({
    material: glowMaterial
  }));

  return (
    <group position={position}>
      {/* Dark backing frame */}
      <mesh position={[0, 0.025, 0]}>
        <boxGeometry args={[1.2, 0.02, 3.5]} />
        <meshStandardMaterial color="#08080a" metalness={0.92} roughness={0.55} />
      </mesh>

      {/* Dark metal longitudinal rails */}
      {[-0.45, 0.0, 0.45].map((xLoc, idx) => (
        <mesh key={`ceil-rail-l-${idx}`} position={[xLoc, 0.012, 0]}>
          <boxGeometry args={[0.05, 0.01, 3.5]} />
          <meshStandardMaterial color="#101014" metalness={0.9} roughness={0.3} />
        </mesh>
      ))}

      {/* Dark metal transverse rails */}
      {[-1.75, 0.0, 1.75].map((zLoc, idx) => (
        <mesh key={`ceil-rail-t-${idx}`} position={[0, 0.01, zLoc]}>
          <boxGeometry args={[0.95, 0.01, 0.05]} />
          <meshStandardMaterial color="#101014" metalness={0.9} roughness={0.3} />
        </mesh>
      ))}

      {/* Glowing Orange Longitudinal Lines */}
      {[-0.45, 0.0, 0.45].map((xLoc, idx) => (
        <mesh key={`glow-l-${idx}`} position={[xLoc, 0.002, 0]} material={glowMaterial}>
          <boxGeometry args={[0.025, 0.005, 3.5]} />
        </mesh>
      ))}

      {/* Glowing Orange Transverse Lines */}
      {[-1.75, 0.0, 1.75].map((zLoc, idx) => (
        <mesh key={`glow-t-${idx}`} position={[0, 0.001, zLoc]} material={glowMaterial}>
          <boxGeometry args={[0.92, 0.005, 0.025]} />
        </mesh>
      ))}
    </group>
  );
});

// ==================== Scene Controller & Animations ====================
function SceneController({ isReady }) {
  const { camera, invalidate } = useThree();
  const lightGroupRef = useRef();
  
  const lightRefs = useRef([]);
  const panelRefs = useRef([]);

  // Camera target coordinates
  const targetCamPos = useRef({ x: 0, y: 1.6, z: 9.5 });

  // GSAP ScrollTrigger timeline setup
  useEffect(() => {
    camera.position.set(0, 1.6, 9.5);
    camera.lookAt(0, 1.45, -8);
    targetCamPos.current.z = 9.5;

    if (!isReady) return;

    // Pinned scrub timeline (zoom-in + sequential light ignition)
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: '+=85%', // Pinned for 85% height to create a 50% scroll buffer after zoom-in completes
        pin: true,
        scrub: 0.3, // Even faster scrub catch-up (0.3s lag) for instant wheel mapping
        anticipatePin: 1, // Anticipate pinning to prevent layout jumps on reload/transition
        fastScrollEnd: true, // Forces scrolltrigger animations to complete immediately when scrolled past fast
        invalidateOnRefresh: true,
        onUpdate: () => invalidate(), // Force re-render during GSAP scroll animation
      }
    });

    // 2. Camera Cinematic Dolly-in (Accelerated to finish dollying in by 50% scroll timeline)
    tl.to(targetCamPos.current, {
      z: 5.6,
      duration: 0.50, // Finished by 50% of the scroll timeline (which is 42.5% scroll depth)
      ease: 'power2.inOut'
    }, 0);

    // 3. Warm ceiling lights turn on in sequence (wave from back to front, accelerated)
    lightRefs.current.forEach((light, idx) => {
      if (!light) return;
      
      const zOrder = Math.floor(idx / 2); // row index (0 to 5)
      const invertedZOrder = 5 - zOrder; // Back-to-front order (far to near)
      const startTime = invertedZOrder * 0.04; // Accelerated stagger (all rows start within 0.16s)
      const panel = panelRefs.current[idx];

      // Light glow turns on quickly and smoothly (brightness raised to 12.0 to make overall hangar corridor details clear)
      tl.to(light, {
        intensity: 12.0, // Brighter overhead panel illumination
        duration: 0.18, // Faster fade-in
        ease: 'power2.out'
      }, startTime);

      if (panel) {
        tl.to(panel.material, {
          opacity: 1.0, // Fully glowing white panels
          duration: 0.18,
          ease: 'power2.out'
        }, startTime);
      }
    });

    return () => {
      ScrollTrigger.getAll().filter(t => t.trigger === '#hero').forEach(t => t.kill());
    };

  }, [isReady, camera]);

  useFrame(() => {
    // Lock X and Y to prevent mouse sway/shaking
    camera.position.x = 0;
    camera.position.y = 1.6;
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetCamPos.current.z, 0.16); // Increased lerp from 0.12 to 0.16 for faster follow

    camera.lookAt(0, 1.45, -9);
    invalidate(); // Request next frame for demand-driven rendering
  });

  // Hangar Grid Lights: 6 rows along Z, 2 columns across X (Symmetrical corridor lights)
  const lightsData = useMemo(() => {
    const data = [];
    const zCoords = [4.5, 1.0, -2.5, -6.0, -9.5, -13.0];
    const xCoords = [-1.2, 1.2]; // Aligned with the left/right ceiling panels
    
    let id = 0;
    zCoords.forEach((z) => {
      xCoords.forEach((x) => {
        data.push({ id: id++, position: [x, 4.4, z] });
      });
    });
    return data;
  }, []);

  return (
    <>
      <group ref={lightGroupRef}>
        {lightsData.map((light, index) => (
          <group key={light.id}>
            <LightPanel 
              ref={(el) => (panelRefs.current[index] = el)} 
              position={light.position} 
            />
            <pointLight
              ref={(el) => (lightRefs.current[index] = el)}
              position={[light.position[0], light.position[1] - 0.2, light.position[2]]}
              intensity={0}
              distance={14.0} // Reaches slightly further
              decay={1.15} // Slightly less decay for stronger floor specular reflection
              color="#ff8c00" // Warm golden/orange light
            />
          </group>
        ))}
      </group>
    </>
  );
}

// ==================== Floor, Ceiling and Scenic Backdoor Opening ====================
function HangarStructure() {
  return (
    <group>
      {/* ⚠️ HIGH AESTHETIC: Real Mirror Reflector Floor for glowing orange reflection */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[100, 100]} />
        <MeshReflectorMaterial
          blur={[300, 100]}
          resolution={512}
          mixBlur={1.0}
          mixStrength={3.0} // High glossy reflection matching the image
          roughness={0.02} // Highly polished glossy floor for sharp mirror reflection
          depthScale={1.2}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.45}
          color="#030305" // Deep black floor for contrast
          metalness={0.95} // High metalness for polished reflectiveness
        />
      </mesh>

      {/* ⚙️ FLOOR GRID TILE DETAILS: raised floor tile joints (1.2m grid to enrich floor details) */}
      {/* Transverse joints (along X) */}
      {Array.from({ length: 30 }).map((_, i) => {
        const zVal = -18 + i * 1.2;
        return (
          <mesh key={`t-joint-${i}`} position={[0, 0.0002, zVal]}>
            <boxGeometry args={[12, 0.0005, 0.008]} />
            <meshStandardMaterial 
              color="#1a1a22" 
              metalness={0.95} 
              roughness={0.1} 
            />
          </mesh>
        );
      })}
      {/* Longitudinal joints (along Z) */}
      {[-2.4, -1.2, 1.2, 2.4].map((xVal, i) => (
        <mesh key={`l-joint-${i}`} position={[xVal, 0.0002, 0]}>
          <boxGeometry args={[0.008, 0.0005, 100]} />
          <meshStandardMaterial 
            color="#1a1a22" 
            metalness={0.95} 
            roughness={0.1} 
          />
        </mesh>
      ))}

      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 4.5, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial 
          color="#050507"
          roughness={0.5}
          metalness={0.7}
        />
      </mesh>

      {/* Structural side beams along ceiling */}
      {[-5.2, 5.2].map((x, i) => (
        <mesh key={i} position={[x, 4.3, 0]}>
          <boxGeometry args={[0.3, 0.3, 100]} />
          <meshStandardMaterial color="#0b0b0d" metalness={0.95} roughness={0.2} />
        </mesh>
      ))}

      {/* ==================== 🌅 SCENIC DOORWAY OPENING (Exactly as in the image) ==================== */}
      {/* Sliced Back Wall segments forming a central portal opening */}
      {/* Left Back Wall */}
      <mesh position={[-15.9, 2.25, -16]}>
        <planeGeometry args={[28.2, 4.5]} />
        <meshStandardMaterial color="#020203" roughness={0.8} />
      </mesh>
      {/* Right Back Wall */}
      <mesh position={[15.9, 2.25, -16]}>
        <planeGeometry args={[28.2, 4.5]} />
        <meshStandardMaterial color="#020203" roughness={0.8} />
      </mesh>
      {/* Header Wall above doorway */}
      <mesh position={[0, 3.85, -16]}>
        <planeGeometry args={[3.6, 1.3]} />
        <meshStandardMaterial color="#020203" roughness={0.8} />
      </mesh>

      {/* Glowing Sky/Mountains visible through the portal doorway (at z = -16.5) */}
      <group>
        {/* Bright cyan-blue glowing sky background (with fog=false to remain bright and glowing) */}
        <mesh position={[0, 1.6, -16.5]}>
          <planeGeometry args={[5.0, 4.0]} />
          <meshBasicMaterial color="#a0dfff" toneMapped={false} fog={false} />
        </mesh>
        
        {/* Layered mountain peaks forming silhouette ranges (with fog=false to remain clearly visible) */}
        {/* Mountain Left Peak */}
        <mesh position={[-0.8, 0.4, -16.3]} rotation={[0, 0, Math.PI / 4]}>
          <planeGeometry args={[1.5, 1.5]} />
          <meshBasicMaterial color="#101626" toneMapped={false} fog={false} />
        </mesh>
        {/* Mountain Right Peak */}
        <mesh position={[0.8, 0.3, -16.35]} rotation={[0, 0, -Math.PI / 3]}>
          <planeGeometry args={[2.0, 2.0]} />
          <meshBasicMaterial color="#0c111f" toneMapped={false} fog={false} />
        </mesh>
        {/* Mountain Center Peak */}
        <mesh position={[0.1, 0.1, -16.25]} rotation={[0, 0, Math.PI / 6]}>
          <planeGeometry args={[1.2, 1.2]} />
          <meshBasicMaterial color="#1a253b" toneMapped={false} fog={false} />
        </mesh>
      </group>
    </group>
  );
}

// ==================== Main ServerHangarCanvas Component ====================
export default function ServerHangarCanvas({ isReady = true }) {
  // Symmetrical spaced rows of server racks flanking the central corridor
  const machineInstances = useMemo(() => {
    const instances = [];
    // Spacing at 1.6m with 0.9m cabinet width leaves 0.7m gap between servers
    const zPositions = [4.8, 3.2, 1.6, 0.0, -1.6, -3.2, -4.8, -6.4, -8.0, -9.6, -11.2, -12.8, -14.4];
    
    zPositions.forEach((z, i) => {
      // Left rack row
      instances.push({
        id: `L-${i}`,
        position: [-2.0, 0, z]
      });
      // Right rack row
      instances.push({
        id: `R-${i}`,
        position: [2.0, 0, z]
      });
    });
    
    return instances;
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full bg-[#020204] z-10 pointer-events-none">
      <Canvas
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
        style={{ pointerEvents: 'none' }}
        frameloop="demand"
      >
        <ambientLight intensity={0.24} />
        <hemisphereLight skyColor="#bce0ff" groundColor="#151520" intensity={0.35} />

        {/* Atmospheric fog (end extended from 16.0 to 25.0 to increase overall background brightness) */}
        <fog attach="fog" args={['#030305', 3.0, 25.0]} />

        {/* Controller */}
        <SceneController isReady={isReady} />

        {/* Structure */}
        <HangarStructure />

        {/* Server Racks */}
        <group>
          {machineInstances.map((machine) => (
            <IndustrialMachine 
              key={machine.id} 
              position={machine.position} 
            />
          ))}
        </group>

        {/* Bloom glow filter */}
        <EffectComposer>
          <Bloom 
            intensity={1.5} 
            luminanceThreshold={0.15} 
            luminanceSmoothing={0.9} 
            mipmapBlur 
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
