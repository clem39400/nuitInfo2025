import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Flickering Fluorescent Light - Realistic office lighting
 */
export function FlickeringLight({ position = [0, 3, 0], intensity = 2, flickerSpeed = 0.1 }) {
  const lightRef = useRef();
  const nextFlickerTime = useRef(0);
  const targetIntensity = useRef(intensity);

  useFrame((state) => {
    if (!lightRef.current) return;

    const time = state.clock.elapsedTime;
    
    // Random flicker timing
    if (time > nextFlickerTime.current) {
      // Sometimes flicker rapidly, sometimes stay stable
      if (Math.random() > 0.85) {
        targetIntensity.current = intensity * (0.3 + Math.random() * 0.7);
        nextFlickerTime.current = time + 0.05 + Math.random() * 0.1;
      } else {
        targetIntensity.current = intensity;
        nextFlickerTime.current = time + 0.5 + Math.random() * 2;
      }
    }

    // Smooth transition to target intensity
    lightRef.current.intensity += (targetIntensity.current - lightRef.current.intensity) * 0.3;
  });

  return (
    <group position={position}>
      {/* Main light */}
      <pointLight
        ref={lightRef}
        intensity={intensity}
        distance={12}
        color="#e8f0ff"
        decay={2}
      />
      
      {/* Light fixture mesh */}
      <mesh>
        <boxGeometry args={[1.2, 0.05, 0.3]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={0.5}
        />
      </mesh>
    </group>
  );
}

/**
 * Holographic Effect - Glowing projection
 */
export function HologramEffect({ position = [0, 0, 0], color = "#00ff88", children }) {
  const groupRef = useRef();

  useFrame((state) => {
    if (!groupRef.current) return;
    
    // Subtle floating animation
    groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.05;
    
    // Slight rotation
    groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Hologram base ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
        <ringGeometry args={[0.4, 0.5, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.8}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Scan lines effect */}
      {Array.from({ length: 5 }).map((_, i) => (
        <mesh key={i} position={[0, i * 0.3, 0]}>
          <ringGeometry args={[0.01, 0.5 - i * 0.08, 32]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.2}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}

      {/* Content */}
      {children}

      {/* Glow light */}
      <pointLight
        intensity={1}
        distance={3}
        color={color}
        decay={2}
      />
    </group>
  );
}

/**
 * Screen Glow Effect - Computer monitor glow
 */
export function ScreenGlow({ position, size = [1, 0.6], color = "#0066ff", intensity = 0.5 }) {
  const meshRef = useRef();

  useFrame((state) => {
    if (!meshRef.current) return;
    // Subtle pulsing
    meshRef.current.material.emissiveIntensity = intensity + Math.sin(state.clock.elapsedTime * 3) * 0.1;
  });

  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <planeGeometry args={size} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={intensity}
        />
      </mesh>
      
      {/* Ambient glow */}
      <pointLight
        position={[0, 0, 0.2]}
        intensity={0.3}
        distance={2}
        color={color}
      />
    </group>
  );
}

/**
 * Dust Particles - Floating particles in the air
 */
export function DustParticles({ count = 100, spread = 10, color = "#ffffff" }) {
  const meshRef = useRef();

  const particles = Array.from({ length: count }, () => ({
    x: (Math.random() - 0.5) * spread,
    y: Math.random() * 4,
    z: (Math.random() - 0.5) * spread,
    speedX: (Math.random() - 0.5) * 0.2,
    speedY: (Math.random() - 0.5) * 0.1,
    phase: Math.random() * Math.PI * 2,
  }));

  const tempMatrix = new THREE.Matrix4();

  useFrame((state) => {
    if (!meshRef.current) return;

    particles.forEach((particle, i) => {
      const time = state.clock.elapsedTime;
      
      // Gentle floating motion
      const x = particle.x + Math.sin(time * 0.5 + particle.phase) * 0.3;
      const y = particle.y + Math.sin(time * 0.3 + particle.phase) * 0.2;
      const z = particle.z + Math.cos(time * 0.4 + particle.phase) * 0.3;

      tempMatrix.makeScale(0.02, 0.02, 0.02);
      tempMatrix.setPosition(x, y, z);
      meshRef.current.setMatrixAt(i, tempMatrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]}>
      <sphereGeometry args={[1, 4, 4]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.3}
      />
    </instancedMesh>
  );
}
