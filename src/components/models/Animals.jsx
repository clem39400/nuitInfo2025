import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Low-poly Bird component with flapping animation
 */
export function Bird({ 
  position = [0, 0, 0], 
  rotation = 0,
  color = '#4a5568',
  scale = 1 
}) {
  const groupRef = useRef();
  const leftWingRef = useRef();
  const rightWingRef = useRef();

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    
    // Gentle hovering
    groupRef.current.position.y = position[1] + Math.sin(t * 2) * 0.05;
    
    // Wing flapping
    if (leftWingRef.current && rightWingRef.current) {
      const flapAngle = Math.sin(t * 8) * 0.4;
      leftWingRef.current.rotation.z = flapAngle;
      rightWingRef.current.rotation.z = -flapAngle;
    }
  });

  return (
    <group ref={groupRef} position={position} rotation={[0, rotation, 0]} scale={scale}>
      {/* Body */}
      <mesh castShadow>
        <sphereGeometry args={[0.12, 8, 8]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
      
      {/* Head */}
      <mesh position={[0.12, 0.05, 0]} castShadow>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
      
      {/* Beak */}
      <mesh position={[0.22, 0.03, 0]} rotation={[0, 0, -0.2]}>
        <coneGeometry args={[0.025, 0.08, 4]} />
        <meshStandardMaterial color="#f6ad55" roughness={0.5} />
      </mesh>
      
      {/* Eye */}
      <mesh position={[0.16, 0.08, 0.04]}>
        <sphereGeometry args={[0.015, 6, 6]} />
        <meshBasicMaterial color="#1a1a1a" />
      </mesh>
      
      {/* Left Wing */}
      <group ref={leftWingRef} position={[0, 0, 0.1]}>
        <mesh rotation={[0.3, 0, 0]}>
          <boxGeometry args={[0.15, 0.02, 0.12]} />
          <meshStandardMaterial color={color} roughness={0.8} />
        </mesh>
      </group>
      
      {/* Right Wing */}
      <group ref={rightWingRef} position={[0, 0, -0.1]}>
        <mesh rotation={[-0.3, 0, 0]}>
          <boxGeometry args={[0.15, 0.02, 0.12]} />
          <meshStandardMaterial color={color} roughness={0.8} />
        </mesh>
      </group>
      
      {/* Tail */}
      <mesh position={[-0.15, 0, 0]} rotation={[0, 0, 0.3]}>
        <boxGeometry args={[0.12, 0.02, 0.08]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
    </group>
  );
}

/**
 * Low-poly Dog component with tail wagging
 */
export function Dog({ 
  position = [0, 0, 0], 
  rotation = 0,
  color = '#a0522d',
  scale = 1 
}) {
  const tailRef = useRef();
  const headRef = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    
    // Tail wagging
    if (tailRef.current) {
      tailRef.current.rotation.y = Math.sin(t * 6) * 0.5;
    }
    
    // Subtle head movement
    if (headRef.current) {
      headRef.current.rotation.y = Math.sin(t * 0.8) * 0.1;
    }
  });

  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      {/* Body */}
      <mesh position={[0, 0.25, 0]} castShadow>
        <capsuleGeometry args={[0.12, 0.3, 4, 8]} />
        <meshStandardMaterial color={color} roughness={0.85} />
      </mesh>
      
      {/* Legs */}
      {[[-0.08, 0, 0.08], [0.08, 0, 0.08], [-0.08, 0, -0.08], [0.08, 0, -0.08]].map((pos, i) => (
        <mesh key={i} position={[pos[0], 0.1, pos[2]]} castShadow>
          <cylinderGeometry args={[0.03, 0.035, 0.2, 6]} />
          <meshStandardMaterial color={color} roughness={0.85} />
        </mesh>
      ))}
      
      {/* Head */}
      <group ref={headRef} position={[0.22, 0.32, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.15, 0.12, 0.12]} />
          <meshStandardMaterial color={color} roughness={0.85} />
        </mesh>
        
        {/* Snout */}
        <mesh position={[0.1, -0.02, 0]}>
          <boxGeometry args={[0.1, 0.08, 0.08]} />
          <meshStandardMaterial color={color} roughness={0.85} />
        </mesh>
        
        {/* Nose */}
        <mesh position={[0.16, -0.01, 0]}>
          <sphereGeometry args={[0.025, 6, 6]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.3} />
        </mesh>
        
        {/* Eyes */}
        <mesh position={[0.05, 0.02, 0.05]}>
          <sphereGeometry args={[0.02, 6, 6]} />
          <meshBasicMaterial color="#1a1a1a" />
        </mesh>
        <mesh position={[0.05, 0.02, -0.05]}>
          <sphereGeometry args={[0.02, 6, 6]} />
          <meshBasicMaterial color="#1a1a1a" />
        </mesh>
        
        {/* Ears */}
        <mesh position={[-0.02, 0.08, 0.06]} rotation={[0, 0, 0.3]}>
          <boxGeometry args={[0.06, 0.1, 0.03]} />
          <meshStandardMaterial color={color} roughness={0.85} />
        </mesh>
        <mesh position={[-0.02, 0.08, -0.06]} rotation={[0, 0, -0.3]}>
          <boxGeometry args={[0.06, 0.1, 0.03]} />
          <meshStandardMaterial color={color} roughness={0.85} />
        </mesh>
      </group>
      
      {/* Tail */}
      <group ref={tailRef} position={[-0.2, 0.3, 0]}>
        <mesh rotation={[0, 0, 0.8]}>
          <capsuleGeometry args={[0.02, 0.15, 4, 6]} />
          <meshStandardMaterial color={color} roughness={0.85} />
        </mesh>
      </group>
    </group>
  );
}

/**
 * Low-poly Cat component with tail swishing
 */
export function Cat({ 
  position = [0, 0, 0], 
  rotation = 0,
  color = '#ff8c42',
  scale = 1 
}) {
  const tailRef = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    
    // Tail swishing
    if (tailRef.current) {
      tailRef.current.rotation.z = Math.sin(t * 2) * 0.4;
      tailRef.current.rotation.y = Math.sin(t * 1.5) * 0.3;
    }
  });

  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      {/* Body */}
      <mesh position={[0, 0.18, 0]} castShadow>
        <capsuleGeometry args={[0.08, 0.2, 4, 8]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
      
      {/* Legs */}
      {[[-0.05, 0, 0.05], [0.05, 0, 0.05], [-0.05, 0, -0.05], [0.05, 0, -0.05]].map((pos, i) => (
        <mesh key={i} position={[pos[0], 0.07, pos[2]]} castShadow>
          <cylinderGeometry args={[0.02, 0.025, 0.14, 6]} />
          <meshStandardMaterial color={color} roughness={0.8} />
        </mesh>
      ))}
      
      {/* Head */}
      <group position={[0.15, 0.25, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.09, 8, 8]} />
          <meshStandardMaterial color={color} roughness={0.8} />
        </mesh>
        
        {/* Ears - triangular */}
        <mesh position={[-0.02, 0.1, 0.05]} rotation={[0, 0, 0.3]}>
          <coneGeometry args={[0.035, 0.08, 3]} />
          <meshStandardMaterial color={color} roughness={0.8} />
        </mesh>
        <mesh position={[-0.02, 0.1, -0.05]} rotation={[0, 0, -0.3]}>
          <coneGeometry args={[0.035, 0.08, 3]} />
          <meshStandardMaterial color={color} roughness={0.8} />
        </mesh>
        
        {/* Inner ears */}
        <mesh position={[-0.015, 0.1, 0.05]} rotation={[0, 0, 0.3]}>
          <coneGeometry args={[0.02, 0.05, 3]} />
          <meshStandardMaterial color="#ffb6c1" roughness={0.8} />
        </mesh>
        <mesh position={[-0.015, 0.1, -0.05]} rotation={[0, 0, -0.3]}>
          <coneGeometry args={[0.02, 0.05, 3]} />
          <meshStandardMaterial color="#ffb6c1" roughness={0.8} />
        </mesh>
        
        {/* Eyes */}
        <mesh position={[0.06, 0.02, 0.035]}>
          <sphereGeometry args={[0.02, 6, 6]} />
          <meshBasicMaterial color="#2ecc71" />
        </mesh>
        <mesh position={[0.06, 0.02, -0.035]}>
          <sphereGeometry args={[0.02, 6, 6]} />
          <meshBasicMaterial color="#2ecc71" />
        </mesh>
        {/* Pupils */}
        <mesh position={[0.075, 0.02, 0.035]}>
          <sphereGeometry args={[0.008, 6, 6]} />
          <meshBasicMaterial color="#1a1a1a" />
        </mesh>
        <mesh position={[0.075, 0.02, -0.035]}>
          <sphereGeometry args={[0.008, 6, 6]} />
          <meshBasicMaterial color="#1a1a1a" />
        </mesh>
        
        {/* Nose */}
        <mesh position={[0.085, -0.01, 0]}>
          <sphereGeometry args={[0.015, 6, 6]} />
          <meshStandardMaterial color="#ffb6c1" roughness={0.5} />
        </mesh>
        
        {/* Whiskers - simplified as thin boxes */}
        {[-0.02, 0, 0.02].map((yOffset, i) => (
          <mesh key={`left-${i}`} position={[0.07, -0.02 + yOffset * 0.5, 0.06]} rotation={[0, 0.2, 0]}>
            <boxGeometry args={[0.08, 0.003, 0.003]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        ))}
        {[-0.02, 0, 0.02].map((yOffset, i) => (
          <mesh key={`right-${i}`} position={[0.07, -0.02 + yOffset * 0.5, -0.06]} rotation={[0, -0.2, 0]}>
            <boxGeometry args={[0.08, 0.003, 0.003]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        ))}
      </group>
      
      {/* Tail */}
      <group ref={tailRef} position={[-0.18, 0.2, 0]}>
        <mesh rotation={[0, 0, 0.5]}>
          <capsuleGeometry args={[0.015, 0.2, 4, 6]} />
          <meshStandardMaterial color={color} roughness={0.8} />
        </mesh>
      </group>
    </group>
  );
}

/**
 * Interactive Snake component - clickable to trigger snake game
 */
export function Snake({ 
  position = [0, 0, 0], 
  rotation = 0,
  onClick,
  scale = 1 
}) {
  const groupRef = useRef();
  const tongueRef = useRef();

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    
    // Slithering body movement
    groupRef.current.children.forEach((child, i) => {
      if (child.userData.isSegment) {
        child.position.y = position[1] + 0.05 + Math.sin(t * 3 + i * 0.5) * 0.02;
      }
    });
    
    // Tongue flicking
    if (tongueRef.current) {
      tongueRef.current.scale.x = 0.8 + Math.sin(t * 10) * 0.4;
    }
  });

  const handleClick = (e) => {
    e.stopPropagation();
    if (onClick) onClick();
  };

  const handlePointerOver = (e) => {
    e.stopPropagation();
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = (e) => {
    e.stopPropagation();
    document.body.style.cursor = 'default';
  };

  // Snake body segments
  const segments = [
    { x: 0, z: 0, size: 0.12 },       // Head
    { x: -0.15, z: 0.02, size: 0.1 },
    { x: -0.28, z: -0.02, size: 0.09 },
    { x: -0.4, z: 0.03, size: 0.08 },
    { x: -0.5, z: -0.01, size: 0.07 },
    { x: -0.58, z: 0.02, size: 0.05 },
    { x: -0.65, z: 0, size: 0.03 },   // Tail
  ];

  return (
    <group 
      ref={groupRef} 
      position={position} 
      rotation={[0, rotation, 0]} 
      scale={scale}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      {/* Body segments */}
      {segments.map((seg, i) => (
        <mesh 
          key={i} 
          position={[seg.x, 0.05, seg.z]} 
          userData={{ isSegment: true }}
          castShadow
        >
          <sphereGeometry args={[seg.size, 8, 8]} />
          <meshStandardMaterial 
            color={i === 0 ? '#2d5016' : '#3d6b1e'} 
            roughness={0.6}
            emissive={i === 0 ? '#1a3a0a' : '#000000'}
            emissiveIntensity={0.2}
          />
        </mesh>
      ))}
      
      {/* Pattern on back */}
      {[1, 2, 3, 4].map((i) => (
        <mesh 
          key={`pattern-${i}`} 
          position={[segments[i].x, 0.1, segments[i].z]}
        >
          <sphereGeometry args={[0.03, 6, 6]} />
          <meshStandardMaterial color="#1a4a0a" roughness={0.7} />
        </mesh>
      ))}
      
      {/* Eyes */}
      <mesh position={[0.08, 0.1, 0.06]}>
        <sphereGeometry args={[0.025, 6, 6]} />
        <meshBasicMaterial color="#ffcc00" />
      </mesh>
      <mesh position={[0.08, 0.1, -0.06]}>
        <sphereGeometry args={[0.025, 6, 6]} />
        <meshBasicMaterial color="#ffcc00" />
      </mesh>
      {/* Slit pupils */}
      <mesh position={[0.1, 0.1, 0.06]}>
        <boxGeometry args={[0.01, 0.04, 0.008]} />
        <meshBasicMaterial color="#1a1a1a" />
      </mesh>
      <mesh position={[0.1, 0.1, -0.06]}>
        <boxGeometry args={[0.01, 0.04, 0.008]} />
        <meshBasicMaterial color="#1a1a1a" />
      </mesh>
      
      {/* Tongue */}
      <group ref={tongueRef} position={[0.14, 0.03, 0]}>
        <mesh>
          <boxGeometry args={[0.1, 0.008, 0.008]} />
          <meshStandardMaterial color="#cc3333" roughness={0.3} />
        </mesh>
        {/* Forked tips */}
        <mesh position={[0.06, 0, 0.015]} rotation={[0, 0.3, 0]}>
          <boxGeometry args={[0.04, 0.006, 0.006]} />
          <meshStandardMaterial color="#cc3333" roughness={0.3} />
        </mesh>
        <mesh position={[0.06, 0, -0.015]} rotation={[0, -0.3, 0]}>
          <boxGeometry args={[0.04, 0.006, 0.006]} />
          <meshStandardMaterial color="#cc3333" roughness={0.3} />
        </mesh>
      </group>
      
      {/* Glow effect for interactivity hint */}
      <pointLight position={[0, 0.2, 0]} intensity={0.3} color="#55ff55" distance={1.5} />
    </group>
  );
}

/**
 * Butterfly with flapping wings
 */
export function Butterfly({ 
  position = [0, 0, 0], 
  color = '#ff6b9d',
  scale = 1 
}) {
  const groupRef = useRef();
  const leftWingRef = useRef();
  const rightWingRef = useRef();

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    
    // Flutter around position
    groupRef.current.position.x = position[0] + Math.sin(t * 1.5) * 0.3;
    groupRef.current.position.y = position[1] + Math.sin(t * 2) * 0.2;
    groupRef.current.position.z = position[2] + Math.cos(t * 1.2) * 0.3;
    
    // Wing flapping
    if (leftWingRef.current && rightWingRef.current) {
      const flapAngle = Math.sin(t * 12) * 0.6;
      leftWingRef.current.rotation.y = flapAngle;
      rightWingRef.current.rotation.y = -flapAngle;
    }
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Body */}
      <mesh>
        <capsuleGeometry args={[0.015, 0.08, 4, 6]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.7} />
      </mesh>
      
      {/* Left Wing */}
      <group ref={leftWingRef} position={[0, 0, 0.02]}>
        <mesh rotation={[0, 0, 0.2]}>
          <planeGeometry args={[0.1, 0.08]} />
          <meshStandardMaterial 
            color={color} 
            side={THREE.DoubleSide}
            transparent
            opacity={0.9}
            emissive={color}
            emissiveIntensity={0.2}
          />
        </mesh>
      </group>
      
      {/* Right Wing */}
      <group ref={rightWingRef} position={[0, 0, -0.02]}>
        <mesh rotation={[0, 0, 0.2]}>
          <planeGeometry args={[0.1, 0.08]} />
          <meshStandardMaterial 
            color={color} 
            side={THREE.DoubleSide}
            transparent
            opacity={0.9}
            emissive={color}
            emissiveIntensity={0.2}
          />
        </mesh>
      </group>
      
      {/* Antennae */}
      <mesh position={[0, 0.06, 0.01]} rotation={[0.5, 0, 0.3]}>
        <cylinderGeometry args={[0.002, 0.002, 0.05, 4]} />
        <meshBasicMaterial color="#2a2a2a" />
      </mesh>
      <mesh position={[0, 0.06, -0.01]} rotation={[-0.5, 0, 0.3]}>
        <cylinderGeometry args={[0.002, 0.002, 0.05, 4]} />
        <meshBasicMaterial color="#2a2a2a" />
      </mesh>
    </group>
  );
}

/**
 * Squirrel sitting or scurrying
 */
export function Squirrel({ 
  position = [0, 0, 0], 
  rotation = 0,
  scale = 1 
}) {
  const tailRef = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    
    // Bushy tail movement
    if (tailRef.current) {
      tailRef.current.rotation.x = 0.5 + Math.sin(t * 2) * 0.2;
    }
  });

  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      {/* Body */}
      <mesh position={[0, 0.12, 0]} castShadow>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial color="#8b4513" roughness={0.9} />
      </mesh>
      
      {/* Head */}
      <mesh position={[0.08, 0.2, 0]} castShadow>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial color="#8b4513" roughness={0.9} />
      </mesh>
      
      {/* Ears */}
      <mesh position={[0.06, 0.28, 0.03]}>
        <sphereGeometry args={[0.02, 6, 6]} />
        <meshStandardMaterial color="#8b4513" roughness={0.9} />
      </mesh>
      <mesh position={[0.06, 0.28, -0.03]}>
        <sphereGeometry args={[0.02, 6, 6]} />
        <meshStandardMaterial color="#8b4513" roughness={0.9} />
      </mesh>
      
      {/* Eyes */}
      <mesh position={[0.12, 0.22, 0.025]}>
        <sphereGeometry args={[0.012, 6, 6]} />
        <meshBasicMaterial color="#1a1a1a" />
      </mesh>
      <mesh position={[0.12, 0.22, -0.025]}>
        <sphereGeometry args={[0.012, 6, 6]} />
        <meshBasicMaterial color="#1a1a1a" />
      </mesh>
      
      {/* Nose */}
      <mesh position={[0.14, 0.18, 0]}>
        <sphereGeometry args={[0.01, 6, 6]} />
        <meshBasicMaterial color="#1a1a1a" />
      </mesh>
      
      {/* Front legs */}
      <mesh position={[0.04, 0.05, 0.04]}>
        <capsuleGeometry args={[0.015, 0.06, 4, 6]} />
        <meshStandardMaterial color="#8b4513" roughness={0.9} />
      </mesh>
      <mesh position={[0.04, 0.05, -0.04]}>
        <capsuleGeometry args={[0.015, 0.06, 4, 6]} />
        <meshStandardMaterial color="#8b4513" roughness={0.9} />
      </mesh>
      
      {/* Back legs */}
      <mesh position={[-0.04, 0.06, 0.05]}>
        <capsuleGeometry args={[0.02, 0.08, 4, 6]} />
        <meshStandardMaterial color="#8b4513" roughness={0.9} />
      </mesh>
      <mesh position={[-0.04, 0.06, -0.05]}>
        <capsuleGeometry args={[0.02, 0.08, 4, 6]} />
        <meshStandardMaterial color="#8b4513" roughness={0.9} />
      </mesh>
      
      {/* Bushy tail */}
      <group ref={tailRef} position={[-0.08, 0.15, 0]}>
        <mesh rotation={[0.5, 0, 0]}>
          <sphereGeometry args={[0.06, 8, 8, 0, Math.PI * 2, 0, Math.PI / 1.5]} />
          <meshStandardMaterial color="#a0522d" roughness={0.95} />
        </mesh>
        <mesh position={[0, 0.08, 0]} rotation={[0.3, 0, 0]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshStandardMaterial color="#a0522d" roughness={0.95} />
        </mesh>
      </group>
    </group>
  );
}

export default { Bird, Dog, Cat, Snake, Butterfly, Squirrel };
