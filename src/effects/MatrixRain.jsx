import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Enhanced Matrix Rain Effect - Cinematic falling code
 * Uses instanced meshes with varying opacity and speed
 */
function MatrixRain({ count = 500, spread = 30 }) {
  const meshRef = useRef();
  const glowRef = useRef();
  
  // Character set for Matrix-style rain
  const characters = '日月火水木金土竹戈十大中小口山田力刀七八九十百千万円';
  
  // Create random positions, speeds, and properties for each particle
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * spread;
      const z = (Math.random() - 0.5) * spread;
      temp.push({
        x,
        y: Math.random() * 25 - 5,
        z,
        speed: 2 + Math.random() * 4,
        opacity: 0.3 + Math.random() * 0.7,
        scale: 0.5 + Math.random() * 1,
        rotationSpeed: (Math.random() - 0.5) * 2,
      });
    }
    return temp;
  }, [count, spread]);

  // Pre-create matrix for performance
  const tempMatrix = useMemo(() => new THREE.Matrix4(), []);
  const tempColor = useMemo(() => new THREE.Color(), []);

  // Animate falling particles
  useFrame((state, delta) => {
    if (!meshRef.current) return;

    particles.forEach((particle, i) => {
      // Update position
      particle.y -= particle.speed * delta;
      
      // Reset to top when reaching bottom
      if (particle.y < -10) {
        particle.y = 20;
        particle.x = (Math.random() - 0.5) * spread;
        particle.z = (Math.random() - 0.5) * spread;
      }

      // Calculate fade based on height
      const fadeTop = particle.y > 15 ? 1 - (particle.y - 15) / 5 : 1;
      const fadeBottom = particle.y < -5 ? (particle.y + 10) / 5 : 1;
      const fade = Math.max(0, Math.min(1, fadeTop * fadeBottom));

      // Update instance matrix with position and scale
      tempMatrix.makeScale(
        0.03 * particle.scale,
        0.15 * particle.scale,
        0.03 * particle.scale
      );
      tempMatrix.setPosition(particle.x, particle.y, particle.z);
      meshRef.current.setMatrixAt(i, tempMatrix);

      // Update color with opacity variation
      tempColor.setHSL(0.35 + Math.sin(state.clock.elapsedTime + i) * 0.05, 1, 0.5 * fade);
      meshRef.current.setColorAt(i, tempColor);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  });

  return (
    <group>
      {/* Main rain particles */}
      <instancedMesh ref={meshRef} args={[null, null, count]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial
          color="#00ff88"
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
        />
      </instancedMesh>

      {/* Ambient glow layer */}
      <mesh position={[0, 5, 0]}>
        <planeGeometry args={[spread, 30]} />
        <meshBasicMaterial
          color="#00ff44"
          transparent
          opacity={0.02}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

/**
 * Rain Effect - Realistic water droplets
 */
export function RainEffect({ count = 1000, spread = 25 }) {
  const meshRef = useRef();

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      temp.push({
        x: (Math.random() - 0.5) * spread,
        y: Math.random() * 20,
        z: (Math.random() - 0.5) * spread,
        speed: 15 + Math.random() * 10,
      });
    }
    return temp;
  }, [count, spread]);

  const tempMatrix = useMemo(() => new THREE.Matrix4(), []);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    particles.forEach((particle, i) => {
      particle.y -= particle.speed * delta;
      
      if (particle.y < 0) {
        particle.y = 20;
        particle.x = (Math.random() - 0.5) * spread;
        particle.z = (Math.random() - 0.5) * spread;
      }

      tempMatrix.makeScale(0.01, 0.3, 0.01);
      tempMatrix.setPosition(particle.x, particle.y, particle.z);
      meshRef.current.setMatrixAt(i, tempMatrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial
        color="#aaccff"
        transparent
        opacity={0.4}
      />
    </instancedMesh>
  );
}

export default MatrixRain;
