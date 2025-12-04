import MatrixRain, { RainEffect } from '../effects/MatrixRain';
import { HologramEffect, DustParticles } from '../effects/AtmosphericEffects';
import { ReflectiveFloor } from '../components/Environment';
import useGameStore from '../core/GameStateContext';
import * as THREE from 'three';

/**
 * Gate Scene - Phase 1: The Gatekeeper
 * Cinematic rainy school entrance with Matrix effect
 * 
 * Integration points for other developers:
 * - Chatbot component should be placed inside <HologramEffect> at position [0, 1.2, -2]
 * - Snake game triggers via completePuzzle('gate')
 */
function GateScene() {
  const { completePuzzle, goToHallway } = useGameStore();

  // Temporary: Skip to hallway for testing
  const handleDebugSkip = () => {
    completePuzzle('gate');
    goToHallway();
  };

  return (
    <group>
      {/* Matrix rain effect - dramatic falling code */}
      <MatrixRain count={600} spread={40} />
      
      {/* Real rain effect */}
      <RainEffect count={800} spread={35} />
      
      {/* Floating dust particles */}
      <DustParticles count={50} spread={15} color="#00ff88" />
      
      {/* Reflective wet ground */}
      <ReflectiveFloor
        position={[0, 0, 0]}
        size={[60, 60]}
        color="#020205"
        roughness={0.05}
        metalness={0.95}
        mirror={0.8}
      />
      
      {/* School gate structure - cyberpunk style */}
      <group position={[0, 0, -8]}>
        {/* Gate pillars with neon trim */}
        {[-4, 4].map((x, i) => (
          <group key={i} position={[x, 0, 0]}>
            {/* Main pillar */}
            <mesh position={[0, 2, 0]} castShadow>
              <boxGeometry args={[0.6, 4, 0.6]} />
              <meshStandardMaterial
                color="#0a0a12"
                metalness={0.9}
                roughness={0.2}
              />
            </mesh>
            
            {/* Neon strip */}
            <mesh position={[0.31, 2, 0]}>
              <boxGeometry args={[0.02, 3.8, 0.1]} />
              <meshBasicMaterial
                color="#00ff88"
                transparent
                opacity={0.9}
              />
            </mesh>
            
            {/* Top cap */}
            <mesh position={[0, 4.1, 0]} castShadow>
              <boxGeometry args={[0.8, 0.2, 0.8]} />
              <meshStandardMaterial
                color="#1a1a2e"
                metalness={0.8}
                roughness={0.3}
                emissive="#00ff44"
                emissiveIntensity={0.1}
              />
            </mesh>
          </group>
        ))}
        
        {/* Gate horizontal bar */}
        <mesh position={[0, 4, 0]} castShadow>
          <boxGeometry args={[9, 0.3, 0.3]} />
          <meshStandardMaterial
            color="#0a0a12"
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>
        
        {/* Gate bars */}
        {Array.from({ length: 7 }).map((_, i) => (
          <mesh key={i} position={[-3 + i, 1.8, 0]} castShadow>
            <cylinderGeometry args={[0.03, 0.03, 3.5, 8]} />
            <meshStandardMaterial
              color="#1a1a2e"
              metalness={0.8}
              roughness={0.3}
            />
          </mesh>
        ))}
        
        {/* "SCHOOL" text placeholder - neon sign */}
        <mesh position={[0, 4.8, 0]}>
          <boxGeometry args={[3, 0.5, 0.1]} />
          <meshStandardMaterial
            color="#ff0044"
            emissive="#ff0044"
            emissiveIntensity={0.8}
          />
        </mesh>
      </group>
      
      {/* Hologram pedestal for chatbot */}
      <HologramEffect position={[0, 1.2, -2]} color="#00ff88">
        {/* Chatbot placeholder - animated sphere */}
        <mesh>
          <icosahedronGeometry args={[0.4, 1]} />
          <meshStandardMaterial
            color="#00ff88"
            emissive="#00ff88"
            emissiveIntensity={0.5}
            wireframe
            transparent
            opacity={0.8}
          />
        </mesh>
      </HologramEffect>
      
      {/* Base pedestal */}
      <mesh position={[0, 0.3, -2]} castShadow>
        <cylinderGeometry args={[0.8, 1, 0.6, 32]} />
        <meshStandardMaterial
          color="#0a0a15"
          metalness={0.95}
          roughness={0.1}
          emissive="#00ff88"
          emissiveIntensity={0.1}
        />
      </mesh>
      
      {/* Atmospheric lighting */}
      <ambientLight intensity={0.05} color="#4444ff" />
      
      {/* Main dramatic light from above */}
      <spotLight
        position={[0, 15, 5]}
        angle={0.4}
        penumbra={0.8}
        intensity={0.8}
        color="#4488ff"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      
      {/* Gate accent lights */}
      <pointLight position={[-4, 4, -8]} intensity={0.5} color="#00ff88" distance={8} />
      <pointLight position={[4, 4, -8]} intensity={0.5} color="#00ff88" distance={8} />
      
      {/* Hologram glow */}
      <pointLight position={[0, 2, -2]} intensity={1.5} color="#00ff88" distance={5} />
      
      {/* DEBUG: Click to skip to hallway - Pink cube */}
      <mesh
        position={[6, 0.5, 0]}
        onClick={handleDebugSkip}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'default';
        }}
      >
        <boxGeometry args={[0.8, 0.8, 0.8]} />
        <meshStandardMaterial
          color="#ff0088"
          emissive="#ff0088"
          emissiveIntensity={0.8}
        />
      </mesh>
    </group>
  );
}

export default GateScene;
