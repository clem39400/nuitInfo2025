import MatrixRain, { RainEffect } from '../effects/MatrixRain';
import { HologramEffect, DustParticles } from '../effects/AtmosphericEffects';
import { ReflectiveFloor } from '../components/Environment';
import useGameStore from '../core/GameStateContext';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

/**
 * Gate Scene - Phase 1: The Gatekeeper
 * Cinematic rainy school entrance with Matrix effect
 * 
 * Integration points for other developers:
 * - Chatbot component should be placed inside <HologramEffect> at position [0, 1.2, -2]
 * - Snake game triggers via completePuzzle('gate')
 */
function GateScene({ onOpenChatbot, isChatbotOpen }) {
  const { completePuzzle, goToHallway } = useGameStore();
  const hologramRef = useRef();

  // Animate hologram
  useFrame((state) => {
    if (hologramRef.current) {
      hologramRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
  });

  // Temporary: Skip to hallway for testing
  const handleDebugSkip = () => {
    completePuzzle('gate');
    goToHallway();
  };

  // Handle chatbot click
  const handleChatbotClick = (e) => {
    e.stopPropagation();
    if (onOpenChatbot) onOpenChatbot();
  };
  return (
    <group>
      {/* Matrix rain effect - dramatic falling code */}
      <MatrixRain count={600} spread={40} />

      {/* Real rain effect */}
      <RainEffect count={800} spread={35} />

      {/* Floating dust particles - Disabled when chatbot is open for performance */}
      {!isChatbotOpen && <DustParticles count={50} spread={15} color="#00ff88" />}

      {/* Main reflective wet ground - larger and more visible */}
      <ReflectiveFloor
        position={[0, 0, 0]}
        size={[80, 80]}
        color="#020205"
        roughness={0.05}
        metalness={0.95}
        mirror={0.8}
      />

      {/* Grass/lawn area boundary markers */}
      {/* Left side boundary */}
      <mesh position={[-10, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[5, 40]} />
        <meshStandardMaterial
          color="#1a2a1a"
          roughness={0.95}
        />
      </mesh>

      {/* Right side boundary */}
      <mesh position={[10, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[5, 40]} />
        <meshStandardMaterial
          color="#1a2a1a"
          roughness={0.95}
        />
      </mesh>

      {/* School building facade - makes it look like an actual school */}
      <group position={[0, 0, -15]}>
        {/* Main school building wall */}
        <mesh position={[0, 4, 0]} receiveShadow>
          <boxGeometry args={[25, 8, 0.5]} />
          <meshStandardMaterial
            color="#3a3a45"
            roughness={0.8}
          />
        </mesh>

        {/* Building windows */}
        {Array.from({ length: 8 }).map((_, i) => (
          <group key={i} position={[-10 + i * 2.8, 4.5, 0.3]}>
            {/* Window */}
            <mesh>
              <planeGeometry args={[1.2, 1.8]} />
              <meshStandardMaterial
                color="#1a1a2a"
                emissive="#ffcc66"
                emissiveIntensity={0.1}
              />
            </mesh>
            {/* Window glow */}
            <pointLight position={[0, 0, 0.5]} intensity={0.2} color="#ffcc66" distance={3} />
          </group>
        ))}

        {/* School name sign on building */}
        <group position={[0, 7.5, 0.3]}>
          <mesh>
            <boxGeometry args={[8, 0.8, 0.1]} />
            <meshStandardMaterial
              color="#1a1a2e"
              emissive="#00ff88"
              emissiveIntensity={0.3}
            />
          </mesh>
          {/* "ÉCOLE NUMÉRIQUE" or "DIGITAL SCHOOL" text representation */}
          <mesh position={[0, 0, 0.06]}>
            <planeGeometry args={[7, 0.5]} />
            <meshBasicMaterial
              color="#00ff88"
              transparent
              opacity={0.9}
            />
          </mesh>
        </group>

        {/* Roof */}
        <mesh position={[0, 8.2, -0.3]} castShadow>
          <boxGeometry args={[25, 0.3, 1]} />
          <meshStandardMaterial color="#2a2a35" />
        </mesh>
      </group>

      {/* School entrance gate - more traditional style */}
      <group position={[0, 0, -10]}>
        {/* Gate pillars - brick/stone style */}
        {[-3.5, 3.5].map((x, i) => (
          <group key={i} position={[x, 0, 0]}>
            {/* Brick pillar */}
            <mesh position={[0, 1.8, 0]} castShadow>
              <boxGeometry args={[0.8, 3.6, 0.8]} />
              <meshStandardMaterial
                color="#4a3a3a"
                roughness={0.9}
              />
            </mesh>

            {/* Stone cap */}
            <mesh position={[0, 3.7, 0]} castShadow>
              <boxGeometry args={[1, 0.3, 1]} />
              <meshStandardMaterial
                color="#5a5a5a"
                roughness={0.7}
              />
            </mesh>

            {/* Small lamp on pillar */}
            <group position={[0, 3, x > 0 ? -0.5 : 0.5]}>
              <mesh castShadow>
                <boxGeometry args={[0.15, 0.3, 0.15]} />
                <meshStandardMaterial color="#2a2a2a" />
              </mesh>
              <pointLight position={[0, -0.1, 0]} intensity={0.5} color="#ffcc66" distance={4} />
            </group>
          </group>
        ))}

        {/* Iron gate bars */}
        <group>
          {/* Horizontal bars */}
          <mesh position={[0, 2.5, 0]}>
            <boxGeometry args={[7, 0.08, 0.08]} />
            <meshStandardMaterial color="#1a1a1a" metalness={0.8} />
          </mesh>
          <mesh position={[0, 1.2, 0]}>
            <boxGeometry args={[7, 0.08, 0.08]} />
            <meshStandardMaterial color="#1a1a1a" metalness={0.8} />
          </mesh>

          {/* Vertical bars */}
          {Array.from({ length: 11 }).map((_, i) => (
            <mesh key={i} position={[-3 + i * 0.6, 1.8, 0]} castShadow>
              <cylinderGeometry args={[0.025, 0.025, 3, 8]} />
              <meshStandardMaterial
                color="#1a1a1a"
                metalness={0.9}
                roughness={0.2}
              />
            </mesh>
          ))}

          {/* Decorative top spikes */}
          {Array.from({ length: 11 }).map((_, i) => (
            <mesh key={i} position={[-3 + i * 0.6, 3.3, 0]} castShadow>
              <coneGeometry args={[0.05, 0.3, 4]} />
              <meshStandardMaterial color="#1a1a1a" metalness={0.9} />
            </mesh>
          ))}
        </group>

        {/* Gate lock - glowing to indicate chatbot interaction point */}
        <mesh position={[2, 1.5, 0.1]}>
          <boxGeometry args={[0.2, 0.3, 0.15]} />
          <meshStandardMaterial
            color="#1a1a1a"
            emissive="#ff0044"
            emissiveIntensity={0.5}
            metalness={0.9}
          />
        </mesh>
      </group>

      {/* Sidewalk/pavement leading to gate */}
      <group position={[0, 0.01, -5]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[8, 10]} />
          <meshStandardMaterial
            color="#3a3a3a"
            roughness={0.9}
          />
        </mesh>

        {/* Pavement tiles lines */}
        {Array.from({ length: 10 }).map((_, i) => (
          <mesh key={i} position={[0, 0.005, -4.5 + i]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[8, 0.05]} />
            <meshBasicMaterial color="#2a2a2a" />
          </mesh>
        ))}
      </group>
      {/* CLICKABLE Chatbot Hologram */}
      <group position={[0, 0, -2]}>
        {/* Hologram pedestal for chatbot - CLICKABLE */}
        <HologramEffect position={[0, 1.2, 0]} color="#0078d4">
          {/* Chatbot avatar - rotating Windows-style shape */}
          <mesh
            ref={hologramRef}
            onClick={handleChatbotClick}
            onPointerOver={(e) => {
              e.stopPropagation();
              document.body.style.cursor = 'pointer';
            }}
            onPointerOut={(e) => {
              e.stopPropagation();
              document.body.style.cursor = 'default';
            }}
          >
            <icosahedronGeometry args={[0.4, 0]} />
            <meshStandardMaterial
              color="#0078d4"
              emissive="#0078d4"
              emissiveIntensity={0.8}
              wireframe
              transparent
              opacity={0.9}
            />
          </mesh>
        </HologramEffect>

        {/* "PARLEZ-MOI" label */}
        <mesh position={[0, 0.6, 0]}>
          <planeGeometry args={[1.2, 0.25]} />
          <meshBasicMaterial color="#0078d4" transparent opacity={0.9} />
        </mesh>

        {/* Base pedestal */}
        <mesh position={[0, 0.3, 0]} castShadow>
          <cylinderGeometry args={[0.8, 1, 0.6, 32]} />
          <meshStandardMaterial
            color="#0a0a15"
            metalness={0.95}
            roughness={0.1}
            emissive="#0078d4"
            emissiveIntensity={0.2}
          />
        </mesh>
      </group>
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

      {/* DEBUG: Click to launch Snake Game - Pink cube */}
      <mesh
        position={[6, 0.5, 0]}
        onClick={() => {
          completePuzzle('gate');
          goToHallway();
        }}
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
