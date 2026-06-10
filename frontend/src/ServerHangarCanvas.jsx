import React, { useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { MeshReflectorMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ==================== Floor Grid Tile Details Instanced Components ====================
function TransverseJoints({ sharedAssets }) {
  const meshRef = useRef();
  const { geometries, materials } = sharedAssets;

  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const dummy = new THREE.Object3D();
    for (let i = 0; i < 30; i++) {
      const zVal = -18 + i * 1.2;
      dummy.position.set(0, 0.0002, zVal);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  }, [geometries.transverseJointBox, materials.floorJointMat]);

  return <instancedMesh ref={meshRef} args={[geometries.transverseJointBox, materials.floorJointMat, 30]} />;
}

// Longitudinal floor joints
function LongitudinalJoints({ sharedAssets }) {
  const meshRef = useRef();
  const { geometries, materials } = sharedAssets;

  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const dummy = new THREE.Object3D();
    const xVals = [-2.4, -1.2, 1.2, 2.4];
    xVals.forEach((xVal, i) => {
      dummy.position.set(xVal, 0.0002, 0);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  }, [geometries.longitudinalJointBox, materials.floorJointMat]);

  return <instancedMesh ref={meshRef} args={[geometries.longitudinalJointBox, materials.floorJointMat, 4]} />;
}

// ==================== Symmetrical Server Rack Chassis ====================
function IndustrialMachine({ position, sharedAssets, roomIndex = 0 }) {
  const height = 2.8;
  const width = 0.9; // Spaced out width
  const depth = 1.1; // Cabinet depth
  
  const rotationY = -Math.PI / 2;
  const roomX = roomIndex * 15;
  const isLeft = (position[0] - roomX) < 0;

  // Panel Z coordinates relative to the corridor center
  const leftPanelZ = -0.27; // Cyan | | | panel Z
  const rightPanelZ = 0.315; // Cyan | panel Z
  const centerChannelZ = 0.045; // Recessed channel Z
  const dividerZ1 = -0.09;
  const dividerZ2 = 0.18;

  const { geometries, materials } = sharedAssets;
  const roomMats = materials.rooms[roomIndex];

  // Unique offset index per machine to break up synchronized flickering
  const machineIndex = Math.round(position[2] * 10) + Math.round(position[0]);

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Main Rack Frame (Dark steel chassis box) */}
      <mesh position={[0, height / 2, 0]} geometry={geometries.cabinetBox} material={materials.chassisMat} />

      {/* Symmetrical corner support columns */}
      {[-depth / 2, depth / 2].map((x, i) => (
        [-width / 2, width / 2].map((z, j) => (
          <mesh key={`${i}-${j}`} position={[x, height / 2, z]} geometry={geometries.columnBox} material={materials.columnMat} />
        ))
      ))}

      {/* Front Face Overlay (Left Panel, Middle Recessed Channel, Right Panel) */}
      <group 
        position={[depth / 2 + 0.002, 0, 0]} 
        rotation={[0, isLeft ? Math.PI : 0, 0]}
        scale={[isLeft ? -1 : 1, 1, 1]}
      >
        {/* Dark Backing Plane for left/right panels */}
        <mesh position={[0, height / 2, 0]} geometry={geometries.backingPlane} material={materials.backOverlayMat} />

        {/* ================= DETAILED PANEL (width 0.36, contains | | | and red dot) ================= */}
        {Array.from({ length: 8 }).map((_, i) => {
          const yVal = 0.22 + i * 0.33;
          const groupIdx = Math.abs(machineIndex + i) % 4; // Out-of-phase blinking per blade
          return (
            <group key={`detailed-blade-${i}`} position={[0, yVal, leftPanelZ]}>
              {/* Blade Backing Plate */}
              <mesh position={[0, 0, 0]} geometry={geometries.detailedBladePlane} material={materials.darkBackingMat} />
              
              {/* 3 Glowing Indicators: | | | */}
              {[-0.08, 0, 0.08].map((zOffset, j) => (
                <mesh key={`cyan-left-${j}`} position={[0.001, 0, zOffset]} geometry={geometries.indicatorPlane} material={roomMats.primaryIndicatorMatGroup[groupIdx]} />
              ))}

              {/* 1 Glowing Tiny Red Dot in the middle top */}
              <mesh position={[0.001, 0.065, 0]} geometry={geometries.redDotPlane} material={roomMats.redDotMatGroup[groupIdx]} />
            </group>
          );
        })}

        {/* ================= SIMPLE PANEL (width 0.27, contains | ) ================= */}
        {Array.from({ length: 8 }).map((_, i) => {
          const yVal = 0.22 + i * 0.33;
          const groupIdx = Math.abs(machineIndex + i + 2) % 4; // Phase shifted
          return (
            <group key={`simple-blade-${i}`} position={[0, yVal, rightPanelZ]}>
              {/* Blade Backing Plate */}
              <mesh position={[0, 0, 0]} geometry={geometries.simpleBladePlane} material={materials.darkBackingMat} />
              
              {/* 1 Glowing Indicator: | */}
              <mesh position={[0.001, 0, 0]} geometry={geometries.indicatorPlane} material={roomMats.primaryIndicatorMatGroup[groupIdx]} />
            </group>
          );
        })}

        {/* ================= CENTER RECESSED CHANNEL (width 0.27, recessed in X) ================= */}
        {(() => {
          const channelGroupIdx = Math.abs(machineIndex) % 4;
          return (
            <group position={[-0.05, 0, centerChannelZ]}>
              {/* Recessed Backing Plate */}
              <mesh position={[0, height / 2, 0]} geometry={geometries.centerBackingPlane} material={materials.centerBackingMat} />

              {/* Horizontal grille lines */}
              {Array.from({ length: 24 }).map((_, k) => {
                const barY = 0.12 + k * 0.11;
                return (
                  <mesh key={`grille-${k}`} position={[0.001, barY, 0]} geometry={geometries.grillePlane} material={materials.grilleMat} />
                );
              })}

              {/* Vertical Glowing Fiber Optic Cables inside the recessed channel */}
              {/* Primary Glowing Cable */}
              <mesh position={[0.02, height / 2, -0.06]} geometry={geometries.cableCylinder} material={roomMats.primaryIndicatorMatGroup[channelGroupIdx]} />
              {/* Secondary Glowing Cable */}
              <mesh position={[0.02, height / 2, 0.06]} geometry={geometries.cableCylinder} material={roomMats.secondaryCableMatGroup[channelGroupIdx]} />

              {/* Middle Horizontal Status Glow Strip */}
              <mesh position={[0.002, 1.35, 0]} geometry={geometries.glowStripPlane} material={roomMats.secondaryGlowMatGroup[channelGroupIdx]} />

              {/* Bottom Horizontal Glow Strip */}
              <mesh position={[0.002, 0.08, 0]} geometry={geometries.cyanStripPlane} material={roomMats.primaryGlowMatGroup[channelGroupIdx]} />
            </group>
          );
        })()}

        {/* Divider rails framing the center recessed channel */}
        {[dividerZ1, dividerZ2].map((zPos, idx) => (
          <mesh key={`divider-${idx}`} position={[-0.025, height / 2, zPos]} geometry={geometries.dividerBox} material={materials.dividerMat} />
        ))}

        {/* Glass Cabinet Door (Tinted cover reflecting the ceiling lights) */}
        <mesh position={[0.012, height / 2, 0]} geometry={geometries.glassPlane} material={materials.glassMat} />
      </group>
    </group>
  );
}

// ==================== Linear Ceiling Light Grid Panel ====================
const LightPanel = React.forwardRef(({ position, sharedAssets, lightColor = "#ff881b" }, ref) => {
  const { geometries, materials } = sharedAssets;

  // Shared glow material across sub-meshes (unique per light panel for GSAP opacity animation)
  const glowMaterial = useMemo(() => new THREE.MeshBasicMaterial({
    color: new THREE.Color(lightColor),
    toneMapped: false,
    transparent: true,
    opacity: 0
  }), [lightColor]);

  useEffect(() => {
    return () => glowMaterial.dispose();
  }, [glowMaterial]);

  // Expose material to GSAP timeline / update loop
  React.useImperativeHandle(ref, () => ({
    material: glowMaterial
  }));

  return (
    <group position={position}>
      {/* Dark backing frame */}
      <mesh position={[0, 0.025, 0]} geometry={geometries.panelBackingBox} material={materials.panelBackingMat} />

      {/* Dark metal longitudinal rails */}
      {[-0.45, 0.0, 0.45].map((xLoc, idx) => (
        <mesh key={`ceil-rail-l-${idx}`} position={[xLoc, 0.012, 0]} geometry={geometries.panelLongRailBox} material={materials.panelRailMat} />
      ))}

      {/* Dark metal transverse rails */}
      {[-1.75, 0.0, 1.75].map((zLoc, idx) => (
        <mesh key={`ceil-rail-t-${idx}`} position={[0, 0.01, zLoc]} geometry={geometries.panelTransRailBox} material={materials.panelRailMat} />
      ))}

      {/* Glowing Longitudinal Lines */}
      {[-0.45, 0.0, 0.45].map((xLoc, idx) => (
        <mesh key={`glow-l-${idx}`} position={[xLoc, 0.002, 0]} geometry={geometries.panelLongGlowBox} material={glowMaterial} />
      ))}

      {/* Glowing Transverse Lines */}
      {[-1.75, 0.0, 1.75].map((zLoc, idx) => (
        <mesh key={`glow-t-${idx}`} position={[0, 0.001, zLoc]} geometry={geometries.panelTransGlowBox} material={glowMaterial} />
      ))}
    </group>
  );
});

// ==================== Partition Wall between rooms ====================
function PartitionWall({ boundaryX, sharedAssets }) {
  return (
    <group>
      {/* Left partition wall (Z < -2) */}
      <mesh position={[boundaryX, 2.25, -9]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[14, 4.5]} />
        <meshStandardMaterial color="#0c0c10" metalness={0.9} roughness={0.3} side={THREE.DoubleSide} />
      </mesh>

      {/* Right partition wall (Z > 2) */}
      <mesh position={[boundaryX, 2.25, 9]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[14, 4.5]} />
        <meshStandardMaterial color="#0c0c10" metalness={0.9} roughness={0.3} side={THREE.DoubleSide} />
      </mesh>

      {/* Ceiling connection beam */}
      <mesh position={[boundaryX, 4.35, 0]}>
        <boxGeometry args={[0.6, 0.3, 4]} />
        <meshStandardMaterial color="#121216" metalness={0.9} roughness={0.3} />
      </mesh>

      {/* Corridor Left Wall Face */}
      <mesh position={[boundaryX - 0.25, 2.25, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[4, 4.5]} />
        <meshStandardMaterial color="#141418" metalness={0.9} roughness={0.3} side={THREE.DoubleSide} />
      </mesh>

      {/* Corridor Right Wall Face */}
      <mesh position={[boundaryX + 0.25, 2.25, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[4, 4.5]} />
        <meshStandardMaterial color="#141418" metalness={0.9} roughness={0.3} side={THREE.DoubleSide} />
      </mesh>

      {/* Internal Structure (Inside the 0.5m thick wall) */}
      {/* Vertical I-beams (represented as metallic pillars) */}
      {[-1.2, 0, 1.2].map((zOffset, i) => (
        <group key={`ibeam-${i}`} position={[boundaryX, 2.25, zOffset]}>
          {/* Web of the I-beam */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.02, 4.5, 0.12]} />
            <meshStandardMaterial color="#1c1c24" metalness={0.95} roughness={0.2} />
          </mesh>
          {/* Flanges of the I-beam */}
          <mesh position={[-0.04, 0, 0]}>
            <boxGeometry args={[0.01, 4.5, 0.16]} />
            <meshStandardMaterial color="#1c1c24" metalness={0.95} roughness={0.2} />
          </mesh>
          <mesh position={[0.04, 0, 0]}>
            <boxGeometry args={[0.01, 4.5, 0.16]} />
            <meshStandardMaterial color="#1c1c24" metalness={0.95} roughness={0.2} />
          </mesh>
        </group>
      ))}

      {/* Vertical Glowing Conduit Pipes */}
      {/* Cyan conduit */}
      <mesh position={[boundaryX, 2.25, -0.6]}>
        <cylinderGeometry args={[0.03, 0.03, 4.5, 12]} />
        <meshStandardMaterial color="#00e5ff" emissive="#00b0ff" emissiveIntensity={8.0} />
      </mesh>
      {/* Orange conduit */}
      <mesh position={[boundaryX, 2.25, 0.6]}>
        <cylinderGeometry args={[0.03, 0.03, 4.5, 12]} />
        <meshStandardMaterial color="#ff9100" emissive="#ff3d00" emissiveIntensity={8.0} />
      </mesh>
    </group>
  );
}

// ==================== Individual Hangar Room ====================
function HangarRoom({ roomIdx, roomX, sharedAssets, lightRefs, panelRefs }) {
  // Spaced rows of server racks flanking the central corridor
  const machinePositions = useMemo(() => {
    const positions = [];
    const zPositions = [4.8, 3.2, 1.6, 0.0, -1.6, -3.2, -4.8, -6.4, -8.0, -9.6, -11.2, -12.8, -14.4];
    zPositions.forEach((z, i) => {
      // Left rack row
      positions.push({ id: `L-${i}`, pos: [roomX - 2.0, 0, z] });
      // Right rack row
      positions.push({ id: `R-${i}`, pos: [roomX + 2.0, 0, z] });
    });
    return positions;
  }, [roomX]);

  // Hangar Grid Lights: 6 rows along Z, 2 columns across X (Symmetrical corridor lights)
  const lightsData = useMemo(() => {
    const data = [];
    const zCoords = [4.5, 1.0, -2.5, -6.0, -9.5, -13.0];
    const xCoords = [roomX - 1.2, roomX + 1.2]; // Aligned with the left/right ceiling panels
    
    let id = 0;
    zCoords.forEach((z) => {
      xCoords.forEach((x) => {
        data.push({ id: id++, position: [x, 4.4, z] });
      });
    });
    return data;
  }, [roomX]);

  // Sky color per room
  const skyColor = useMemo(() => {
    const colors = ["#a0dfff", "#e8bcf0", "#bcffe0", "#ffc8a0"];
    return colors[roomIdx];
  }, [roomIdx]);

  return (
    <group position={[0, 0, 0]}>
      {/* ⚙️ FLOOR GRID TILE DETAILS: raised floor tile joints */}
      <group position={[roomX, 0, 0]}>
        <TransverseJoints sharedAssets={sharedAssets} />
        <LongitudinalJoints sharedAssets={sharedAssets} />
      </group>

      {/* Structural side beams along ceiling */}
      {[-5.2, 5.2].map((x, i) => (
        <mesh key={i} position={[roomX + x, 4.3, 0]}>
          <boxGeometry args={[0.3, 0.3, 100]} />
          <meshStandardMaterial color="#0b0b0d" metalness={0.95} roughness={0.2} />
        </mesh>
      ))}

      {/* ==================== 🌅 SCENIC DOORWAY OPENING ==================== */}
      {/* Left Back Wall */}
      <mesh position={[roomX - 15.9, 2.25, -16]}>
        <planeGeometry args={[28.2, 4.5]} />
        <meshStandardMaterial color="#020203" roughness={0.8} />
      </mesh>
      {/* Right Back Wall */}
      <mesh position={[roomX + 15.9, 2.25, -16]}>
        <planeGeometry args={[28.2, 4.5]} />
        <meshStandardMaterial color="#020203" roughness={0.8} />
      </mesh>
      {/* Header Wall above doorway */}
      <mesh position={[roomX, 3.85, -16]}>
        <planeGeometry args={[3.6, 1.3]} />
        <meshStandardMaterial color="#020203" roughness={0.8} />
      </mesh>

      {/* Glowing Sky/Mountains visible through the portal doorway */}
      <group>
        {/* Bright glowing sky background */}
        <mesh position={[roomX, 1.6, -16.5]}>
          <planeGeometry args={[5.0, 4.0]} />
          <meshBasicMaterial color={skyColor} toneMapped={false} fog={false} />
        </mesh>
        
        {/* Layered mountain peaks forming silhouette ranges */}
        {/* Mountain Left Peak */}
        <mesh position={[roomX - 0.8, 0.4, -16.3]} rotation={[0, 0, Math.PI / 4]}>
          <planeGeometry args={[1.5, 1.5]} />
          <meshBasicMaterial color="#101626" toneMapped={false} fog={false} />
        </mesh>
        {/* Mountain Right Peak */}
        <mesh position={[roomX + 0.8, 0.3, -16.35]} rotation={[0, 0, -Math.PI / 3]}>
          <planeGeometry args={[2.0, 2.0]} />
          <meshBasicMaterial color="#0c111f" toneMapped={false} fog={false} />
        </mesh>
        {/* Mountain Center Peak */}
        <mesh position={[roomX + 0.1, 0.1, -16.25]} rotation={[0, 0, Math.PI / 6]}>
          <planeGeometry args={[1.2, 1.2]} />
          <meshBasicMaterial color="#1a253b" toneMapped={false} fog={false} />
        </mesh>
      </group>

      {/* Server Racks */}
      {machinePositions.map((machine) => (
        <IndustrialMachine 
          key={machine.id} 
          position={machine.pos} 
          sharedAssets={sharedAssets}
          roomIndex={roomIdx}
        />
      ))}

      {/* Room Lights */}
      {lightsData.map((light, index) => {
        // Light color per room
        const lightColors = ["#ff8c00", "#d500f9", "#00ff66", "#ff3d00"];
        const lightColor = lightColors[roomIdx];
        
        return (
          <group key={light.id}>
            <LightPanel 
              ref={(el) => {
                if (panelRefs.current[roomIdx]) {
                  panelRefs.current[roomIdx][index] = el;
                }
              }} 
              position={light.position} 
              sharedAssets={sharedAssets}
              lightColor={lightColor}
            />
            <pointLight
              ref={(el) => {
                if (lightRefs.current[roomIdx]) {
                  lightRefs.current[roomIdx][index] = el;
                }
              }}
              position={[light.position[0], light.position[1] - 0.2, light.position[2]]}
              intensity={0}
              distance={14.0}
              decay={1.15}
              color={lightColor}
            />
          </group>
        );
      })}
    </group>
  );
}

// ==================== Scene Controller & Animations ====================
function SceneController({ isReady, sharedAssets }) {
  const { camera, invalidate } = useThree();
  
  const roomGroupsRef = useRef([]);
  const lightRefs = useRef([[], [], [], []]);
  const panelRefs = useRef([[], [], [], []]);

  // Camera target coordinates
  const targetCamPos = useRef({ x: 0, y: 1.6, z: 9.5 });

  // GSAP ScrollTrigger timeline setup for global scroll tracking
  useEffect(() => {
    // 1. Initial position setup:
    camera.position.set(0, 1.6, 9.5);
    camera.lookAt(0, 1.45, -8);
    targetCamPos.current = { x: 0, y: 1.6, z: 9.5 };

    if (!isReady) return;

    // 2. Register global ScrollTrigger to track scroll progress
    const trigger = ScrollTrigger.create({
      id: "globalScroll",
      trigger: document.documentElement,
      start: 'top top',
      end: () => `+=${window.innerWidth * 2.5}`, // Matches the total scroll height in App.jsx (2.5 width sections)
      scrub: true,
      onUpdate: (self) => {
        const p = self.progress;
        
        // p inside [0, 0.2]: target X is 0 (Home Room)
        // p inside [0.2, 1.0]: target X interpolates from 0 to 30
        if (p <= 0.2) {
          targetCamPos.current.x = 0;
          // Zoom-in along Z for Room 1
          targetCamPos.current.z = 9.5 - (p / 0.2) * 3.9;
        } else {
          targetCamPos.current.x = ((p - 0.2) / 0.8) * 30;
          targetCamPos.current.z = 5.6;
        }
        
        invalidate();
      }
    });

    return () => {
      trigger.kill();
    };
  }, [isReady, camera, invalidate]);

  useFrame((state) => {
    // 1. Smoothly interpolate camera position towards target position:
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetCamPos.current.x, 0.1);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetCamPos.current.z, 0.1);
    camera.position.y = 1.6;

    camera.lookAt(camera.position.x, 1.45, -9);

    const camX = camera.position.x;
    const time = state.clock.getElapsedTime();

    // 2. Loop over rooms and update visibility/lights
    for (let r = 0; r < 4; r++) {
      const roomX = r * 15;
      const dx = Math.abs(camX - roomX);
      const isVisible = dx < 12;

      if (roomGroupsRef.current[r]) {
        roomGroupsRef.current[r].visible = isVisible;
      }

      if (isVisible) {
        const factor = Math.max(0, 1 - dx / 12.0);
        const roomLights = lightRefs.current[r];
        const roomPanels = panelRefs.current[r];

        // Flicker indicator lights for this room:
        for (let i = 0; i < 4; i++) {
          const phase = time * 3.5 + i * 1.5 + r * 2.0;
          const breath = 1.0 + Math.sin(phase) * 0.35;
          const flicker = (Math.sin(phase * 11) * Math.cos(phase * 7) > 0.2) ? 0.75 : 1.15;
          const randomDrop = Math.random() > 0.985 ? 0.4 : 1.0;
          const modulation = breath * flicker * randomDrop;

          sharedAssets.materials.rooms[r].primaryIndicatorMatGroup[i].emissiveIntensity = 8.0 * modulation;
          sharedAssets.materials.rooms[r].redDotMatGroup[i].emissiveIntensity = 9.0 * modulation;
          sharedAssets.materials.rooms[r].secondaryCableMatGroup[i].emissiveIntensity = 8.0 * modulation;
          sharedAssets.materials.rooms[r].secondaryGlowMatGroup[i].emissiveIntensity = 12.0 * modulation;
          sharedAssets.materials.rooms[r].primaryGlowMatGroup[i].emissiveIntensity = 12.0 * modulation;
        }

        if (r === 0) {
          // Room 1 (Home) sequential light ignition on scroll
          const trigger = ScrollTrigger.getById("globalScroll");
          const p = trigger ? trigger.progress : 0;
          const zoomP = Math.min(1.0, p / 0.25);

          for (let index = 0; index < 12; index++) {
            const zOrder = Math.floor(index / 2); // row index 0 to 5
            const rowStart = (5 - zOrder) * 0.15;
            const rowEnd = rowStart + 0.25;
            const rowP = Math.min(1.0, Math.max(0.0, (zoomP - rowStart) / (rowEnd - rowStart)));

            const intensityVal = 12.0 * rowP * factor;
            const opacityVal = rowP * factor;

            if (roomLights && roomLights[index]) {
              roomLights[index].intensity = intensityVal;
            }
            if (roomPanels && roomPanels[index] && roomPanels[index].material) {
              roomPanels[index].material.opacity = opacityVal;
            }
          }
        } else {
          // Other rooms: simple fade in/out based on camera distance
          for (let index = 0; index < 12; index++) {
            const intensityVal = 12.0 * factor;
            const opacityVal = factor;

            if (roomLights && roomLights[index]) {
              roomLights[index].intensity = intensityVal;
            }
            if (roomPanels && roomPanels[index] && roomPanels[index].material) {
              roomPanels[index].material.opacity = opacityVal;
            }
          }
        }
      }
    }

    // Force frame redraw
    invalidate();
  });

  return (
    <>
      {/* ⚠️ HIGH AESTHETIC: Real Mirror Reflector Floor for glowing orange reflection */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[22.5, 0, 0]}>
        <planeGeometry args={[120, 100]} />
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

      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[22.5, 4.5, 0]}>
        <planeGeometry args={[120, 100]} />
        <meshStandardMaterial 
          color="#050507"
          roughness={0.5}
          metalness={0.7}
        />
      </mesh>

      {/* Rooms */}
      {Array.from({ length: 3 }).map((_, r) => (
        <group key={`room-${r}`} ref={(el) => (roomGroupsRef.current[r] = el)}>
          <HangarRoom
            roomIdx={r}
            roomX={r * 15}
            sharedAssets={sharedAssets}
            lightRefs={lightRefs}
            panelRefs={panelRefs}
          />
        </group>
      ))}

      {/* Partition Walls between rooms */}
      <PartitionWall boundaryX={7.5} sharedAssets={sharedAssets} />
      <PartitionWall boundaryX={22.5} sharedAssets={sharedAssets} />
    </>
  );
}

// ==================== Main ServerHangarCanvas Component ====================
export default function ServerHangarCanvas({ isReady = true }) {
  // Shared assets (geometries & materials) created once and passed to all server racks
  const sharedAssets = useMemo(() => {
    // Machine Geometries
    const cabinetBox = new THREE.BoxGeometry(1.1, 2.8, 0.9);
    const columnBox = new THREE.BoxGeometry(0.04, 2.81, 0.04);
    const backingPlane = new THREE.PlaneGeometry(0.9 - 0.01, 2.8 - 0.02);
    const detailedBladePlane = new THREE.PlaneGeometry(0.34, 0.26);
    const indicatorPlane = new THREE.PlaneGeometry(0.015, 0.08);
    const redDotPlane = new THREE.PlaneGeometry(0.008, 0.008);
    const simpleBladePlane = new THREE.PlaneGeometry(0.25, 0.26);
    const centerBackingPlane = new THREE.PlaneGeometry(0.26, 2.8 - 0.04);
    const grillePlane = new THREE.PlaneGeometry(0.26, 0.015);
    const cableCylinder = new THREE.CylinderGeometry(0.006, 0.006, 2.8 - 0.1, 8);
    const glowStripPlane = new THREE.PlaneGeometry(0.26, 0.035);
    const cyanStripPlane = new THREE.PlaneGeometry(0.26, 0.025);
    const dividerBox = new THREE.BoxGeometry(0.05, 2.8 - 0.02, 0.02);
    const glassPlane = new THREE.PlaneGeometry(0.9 - 0.02, 2.8 - 0.02);

    // Floor Joints Geometries
    const transverseJointBox = new THREE.BoxGeometry(12, 0.0005, 0.008);
    const longitudinalJointBox = new THREE.BoxGeometry(0.008, 0.0005, 100);

    // Light Panel Geometries
    const panelBackingBox = new THREE.BoxGeometry(1.2, 0.02, 3.5);
    const panelLongRailBox = new THREE.BoxGeometry(0.05, 0.01, 3.5);
    const panelTransRailBox = new THREE.BoxGeometry(0.95, 0.01, 0.05);
    const panelLongGlowBox = new THREE.BoxGeometry(0.025, 0.005, 3.5);
    const panelTransGlowBox = new THREE.BoxGeometry(0.92, 0.005, 0.025);

    // Dynamic Rooms Materials (4 rooms, each with primary and secondary color combinations)
    const rooms = Array.from({ length: 4 }, (_, r) => {
      const primaryColors = ["#00e5ff", "#d500f9", "#00e676", "#ff3d00"];
      const primaryEmissives = ["#00b0ff", "#b000e6", "#00c853", "#dd2c00"];
      
      const secondaryColors = ["#ff9100", "#00b0ff", "#00b0ff", "#ff9100"];
      const secondaryEmissives = ["#ff3d00", "#0077ff", "#0077ff", "#ffab00"];

      const primaryColor = primaryColors[r];
      const primaryEmissive = primaryEmissives[r];
      const secondaryColor = secondaryColors[r];
      const secondaryEmissive = secondaryEmissives[r];

      const primaryIndicatorMatGroup = Array.from({ length: 4 }, () => new THREE.MeshStandardMaterial({
        color: primaryColor,
        emissive: new THREE.Color(primaryEmissive),
        emissiveIntensity: 8.0
      }));

      const redDotMatGroup = Array.from({ length: 4 }, () => new THREE.MeshStandardMaterial({
        color: "#ff1744",
        emissive: new THREE.Color("#ff1744"),
        emissiveIntensity: 9.0
      }));

      const secondaryCableMatGroup = Array.from({ length: 4 }, () => new THREE.MeshStandardMaterial({
        color: secondaryColor,
        emissive: new THREE.Color(secondaryEmissive),
        emissiveIntensity: 8.0
      }));

      const secondaryGlowMatGroup = Array.from({ length: 4 }, () => new THREE.MeshStandardMaterial({
        color: secondaryColor,
        emissive: new THREE.Color(secondaryEmissive),
        emissiveIntensity: 12.0
      }));

      const primaryGlowMatGroup = Array.from({ length: 4 }, () => new THREE.MeshStandardMaterial({
        color: primaryColor,
        emissive: new THREE.Color(primaryEmissive),
        emissiveIntensity: 12.0
      }));

      return {
        primaryIndicatorMatGroup,
        redDotMatGroup,
        secondaryCableMatGroup,
        secondaryGlowMatGroup,
        primaryGlowMatGroup
      };
    });

    const darkBackingMat = new THREE.MeshStandardMaterial({
      color: "#101014",
      metalness: 0.85,
      roughness: 0.4
    });

    const chassisMat = new THREE.MeshStandardMaterial({
      color: "#060608",
      metalness: 0.92,
      roughness: 0.35
    });

    const glassMat = new THREE.MeshPhysicalMaterial({
      color: "#0a0a0f",
      transparent: true,
      opacity: 0.18,
      roughness: 0.04,
      metalness: 0.1,
      transmission: 0.90,
      thickness: 0.02
    });

    const columnMat = new THREE.MeshStandardMaterial({
      color: "#1c1c22",
      metalness: 0.95,
      roughness: 0.15
    });

    const backOverlayMat = new THREE.MeshStandardMaterial({
      color: "#040406",
      roughness: 0.9
    });

    const centerBackingMat = new THREE.MeshStandardMaterial({
      color: "#08080c",
      roughness: 0.95
    });

    const grilleMat = new THREE.MeshStandardMaterial({
      color: "#141418",
      metalness: 0.9,
      roughness: 0.6
    });

    const dividerMat = new THREE.MeshStandardMaterial({
      color: "#121216",
      metalness: 0.9,
      roughness: 0.2
    });

    // Floor Joints Materials
    const floorJointMat = new THREE.MeshStandardMaterial({
      color: "#1a1a22",
      metalness: 0.95,
      roughness: 0.1
    });

    // Light Panel Materials
    const panelBackingMat = new THREE.MeshStandardMaterial({
      color: "#08080a",
      metalness: 0.92,
      roughness: 0.55
    });
    const panelRailMat = new THREE.MeshStandardMaterial({
      color: "#101014",
      metalness: 0.9,
      roughness: 0.3
    });

    return {
      geometries: {
        cabinetBox,
        columnBox,
        backingPlane,
        detailedBladePlane,
        indicatorPlane,
        redDotPlane,
        simpleBladePlane,
        centerBackingPlane,
        grillePlane,
        cableCylinder,
        glowStripPlane,
        cyanStripPlane,
        dividerBox,
        glassPlane,
        transverseJointBox,
        longitudinalJointBox,
        panelBackingBox,
        panelLongRailBox,
        panelTransRailBox,
        panelLongGlowBox,
        panelTransGlowBox
      },
      materials: {
        rooms,
        darkBackingMat,
        chassisMat,
        glassMat,
        columnMat,
        backOverlayMat,
        centerBackingMat,
        grilleMat,
        dividerMat,
        floorJointMat,
        panelBackingMat,
        panelRailMat
      }
    };
  }, []);

  // WebGL context cleanup on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      Object.values(sharedAssets.geometries).forEach((g) => g.dispose());
      Object.values(sharedAssets.materials).forEach((m) => {
        if (m === sharedAssets.materials.rooms) {
          m.forEach((room) => {
            Object.values(room).forEach((group) => {
              if (Array.isArray(group)) {
                group.forEach((mat) => mat.dispose());
              } else if (group && typeof group.dispose === 'function') {
                group.dispose();
              }
            });
          });
        } else if (Array.isArray(m)) {
          m.forEach((mat) => mat.dispose());
        } else {
          m.dispose();
        }
      });
    };
  }, [sharedAssets]);

  return (
    <div className="fixed inset-0 w-full h-full bg-[#020204] z-0 pointer-events-none">
      <Canvas
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
        style={{ pointerEvents: 'none' }}
        frameloop="demand"
      >
        <ambientLight intensity={0.24} />
        <hemisphereLight skyColor="#bce0ff" groundColor="#151520" intensity={0.35} />

        {/* Atmospheric fog */}
        <fog attach="fog" args={['#030305', 3.0, 25.0]} />

        {/* Controller */}
        <SceneController isReady={isReady} sharedAssets={sharedAssets} />

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
