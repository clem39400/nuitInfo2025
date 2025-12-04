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
 * Bright, welcoming school entrance with NIRD values
 * 
 * Integration points for other developers:
 * - Chatbot component should be placed inside <HologramEffect> at position [0, 1.2, -2]
 * - Snake game triggers via completePuzzle('gate')
 */
function GateScene({ onOpenChatbot }) {
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
      {/* Gentle floating particles - like pollen/leaves */}
      <DustParticles count={30} spread={20} color="#ffdd88" />

      {/* Realistic grass ground with texture variation */}
      {/* Base layer - darker grass */}
      <mesh position={[0, -0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#3d6b2a" roughness={0.95} />
      </mesh>
      
      {/* Main grass layer */}
      <mesh position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[80, 80]} />
        <meshStandardMaterial color="#5a9045" roughness={0.9} />
      </mesh>
      
      {/* Grass texture patches for realism */}
      {Array.from({ length: 20 }).map((_, i) => (
        <mesh 
          key={`grass-${i}`}
          position={[(Math.random() - 0.5) * 40, 0.001, (Math.random() - 0.5) * 30]} 
          rotation={[-Math.PI / 2, 0, Math.random() * Math.PI]}
        >
          <circleGeometry args={[1 + Math.random() * 2, 8]} />
          <meshStandardMaterial 
            color={i % 2 === 0 ? '#4a7a35' : '#62a550'} 
            roughness={0.95}
            transparent
            opacity={0.7}
          />
        </mesh>
      ))}
      
      {/* Dirt/earth patches near path */}
      <mesh position={[-4, 0.002, -5]} rotation={[-Math.PI / 2, 0, 0.3]}>
        <circleGeometry args={[1.5, 8]} />
        <meshStandardMaterial color="#6a5a4a" roughness={0.95} />
      </mesh>
      <mesh position={[4.5, 0.002, -3]} rotation={[-Math.PI / 2, 0, -0.2]}>
        <circleGeometry args={[1.2, 8]} />
        <meshStandardMaterial color="#7a6a5a" roughness={0.95} />
      </mesh>

      {/* Stone pathway to gate */}
      <mesh position={[0, 0.01, -3]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[6, 14]} />
        <meshStandardMaterial
          color="#9a9080"
          roughness={0.85}
        />
      </mesh>

      {/* Decorative path tiles */}
      {Array.from({ length: 7 }).map((_, i) => (
        <mesh key={i} position={[0, 0.02, 2 - i * 2]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[5.5, 0.8]} />
          <meshStandardMaterial color="#8a7a6a" roughness={0.8} />
        </mesh>
      ))}

      {/* LEFT SIDE - Trees and garden */}
      <group position={[-8, 0, -5]}>
        {/* Tree 1 */}
        <mesh position={[0, 2, 0]}>
          <cylinderGeometry args={[0.2, 0.3, 4, 8]} />
          <meshStandardMaterial color="#5a3a20" />
        </mesh>
        <mesh position={[0, 4.5, 0]}>
          <sphereGeometry args={[2, 16, 16]} />
          <meshStandardMaterial color="#2d6a1e" />
        </mesh>
        {/* Tree shadow on grass */}
        <mesh position={[1, 0.02, 1]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[2.5, 16]} />
          <meshBasicMaterial color="#3a7a2a" transparent opacity={0.5} />
        </mesh>
      </group>

      {/* Tree 2 */}
      <group position={[-10, 0, 3]}>
        <mesh position={[0, 1.5, 0]}>
          <cylinderGeometry args={[0.15, 0.25, 3, 8]} />
          <meshStandardMaterial color="#5a3a20" />
        </mesh>
        <mesh position={[0, 3.5, 0]}>
          <sphereGeometry args={[1.5, 16, 16]} />
          <meshStandardMaterial color="#3d7a2e" />
        </mesh>
      </group>

      {/* RIGHT SIDE - Trees and garden */}
      <group position={[8, 0, -5]}>
        {/* Tree 3 */}
        <mesh position={[0, 2.2, 0]}>
          <cylinderGeometry args={[0.22, 0.32, 4.4, 8]} />
          <meshStandardMaterial color="#5a3a20" />
        </mesh>
        <mesh position={[0, 5, 0]}>
          <sphereGeometry args={[2.2, 16, 16]} />
          <meshStandardMaterial color="#2d6a1e" />
        </mesh>
      </group>

      {/* Tree 4 */}
      <group position={[10, 0, 2]}>
        <mesh position={[0, 1.8, 0]}>
          <cylinderGeometry args={[0.18, 0.28, 3.6, 8]} />
          <meshStandardMaterial color="#5a3a20" />
        </mesh>
        <mesh position={[0, 4, 0]}>
          <sphereGeometry args={[1.8, 16, 16]} />
          <meshStandardMaterial color="#3d8a2e" />
        </mesh>
      </group>

      {/* Flower beds - left side */}
      <group position={[-5, 0.1, -2]}>
        {[0, 0.6, 1.2, 1.8].map((x, i) => (
          <mesh key={i} position={[x, 0.15, 0]}>
            <sphereGeometry args={[0.15, 8, 8]} />
            <meshStandardMaterial color={['#ff6b6b', '#feca57', '#ff9ff3', '#54a0ff'][i]} />
          </mesh>
        ))}
        {/* Flower bed base */}
        <mesh position={[0.9, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[2.5, 0.8]} />
          <meshStandardMaterial color="#3a5f2a" />
        </mesh>
      </group>

      {/* Flower beds - right side */}
      <group position={[4, 0.1, -2]}>
        {[0, 0.6, 1.2, 1.8].map((x, i) => (
          <mesh key={i} position={[x, 0.15, 0]}>
            <sphereGeometry args={[0.15, 8, 8]} />
            <meshStandardMaterial color={['#54a0ff', '#ff6b6b', '#feca57', '#ff9ff3'][i]} />
          </mesh>
        ))}
        <mesh position={[0.9, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[2.5, 0.8]} />
          <meshStandardMaterial color="#3a5f2a" />
        </mesh>
      </group>

      {/* Decorative hedges along path */}
      <mesh position={[-3.5, 0.4, -3]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.8, 0.8, 10]} />
        <meshStandardMaterial color="#2a5a1a" />
      </mesh>
      <mesh position={[3.5, 0.4, -3]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.8, 0.8, 10]} />
        <meshStandardMaterial color="#2a5a1a" />
      </mesh>

      {/* ========== SKY BACKDROP ========== */}
      <mesh position={[0, 20, -50]} rotation={[0, 0, 0]}>
        <planeGeometry args={[200, 60]} />
        <meshBasicMaterial color="#87ceeb" />
      </mesh>
      
      {/* White fluffy clouds */}
      <group position={[0, 25, -45]}>
        <mesh position={[-20, 0, 0]}>
          <sphereGeometry args={[3, 16, 16]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        <mesh position={[-17, -0.5, 0]}>
          <sphereGeometry args={[2.5, 16, 16]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        <mesh position={[-23, -0.3, 0]}>
          <sphereGeometry args={[2, 16, 16]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        
        <mesh position={[15, 2, 0]}>
          <sphereGeometry args={[2.5, 16, 16]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        <mesh position={[18, 1.5, 0]}>
          <sphereGeometry args={[2, 16, 16]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </group>

      {/* ========== SURROUNDING BUILDINGS - LEFT SIDE ========== */}
      <group position={[-20, 0, -12]}>
        {/* Apartment building 1 */}
        <mesh position={[0, 5, 0]}>
          <boxGeometry args={[8, 10, 6]} />
          <meshStandardMaterial color="#d4c4a8" />
        </mesh>
        {/* Windows */}
        {[0, 1, 2, 3].map((row) =>
          [0, 1, 2].map((col) => (
            <mesh key={`l1-${row}-${col}`} position={[-2.5 + col * 2.5, 2 + row * 2, 3.1]}>
              <planeGeometry args={[1.2, 1.5]} />
              <meshStandardMaterial color="#6ba3d6" emissive="#aaccff" emissiveIntensity={0.1} />
            </mesh>
          ))
        )}
        {/* Roof */}
        <mesh position={[0, 10.3, 0]}>
          <boxGeometry args={[8.5, 0.6, 6.5]} />
          <meshStandardMaterial color="#8b6b4a" />
        </mesh>
      </group>

      {/* Building 2 - taller */}
      <group position={[-28, 0, -8]}>
        <mesh position={[0, 7, 0]}>
          <boxGeometry args={[6, 14, 5]} />
          <meshStandardMaterial color="#c8b89a" />
        </mesh>
        {/* Windows */}
        {[0, 1, 2, 3, 4, 5].map((row) =>
          [0, 1].map((col) => (
            <mesh key={`l2-${row}-${col}`} position={[-1.2 + col * 2.4, 1.5 + row * 2, 2.6]}>
              <planeGeometry args={[1, 1.4]} />
              <meshStandardMaterial color="#5a9ed4" />
            </mesh>
          ))
        )}
        <mesh position={[0, 14.2, 0]}>
          <boxGeometry args={[6.3, 0.4, 5.3]} />
          <meshStandardMaterial color="#7a5a3a" />
        </mesh>
      </group>

      {/* ========== SURROUNDING BUILDINGS - RIGHT SIDE ========== */}
      <group position={[20, 0, -12]}>
        {/* Modern building */}
        <mesh position={[0, 4, 0]}>
          <boxGeometry args={[7, 8, 5]} />
          <meshStandardMaterial color="#e0d8c8" />
        </mesh>
        {/* Windows - modern style */}
        {[0, 1, 2].map((row) =>
          [0, 1, 2].map((col) => (
            <mesh key={`r1-${row}-${col}`} position={[-2 + col * 2, 1.5 + row * 2.2, 2.6]}>
              <planeGeometry args={[1.4, 1.6]} />
              <meshStandardMaterial color="#87b8d8" emissive="#aaddff" emissiveIntensity={0.05} />
            </mesh>
          ))
        )}
        <mesh position={[0, 8.2, 0]}>
          <boxGeometry args={[7.3, 0.4, 5.3]} />
          <meshStandardMaterial color="#9a7a5a" />
        </mesh>
      </group>

      {/* Building 4 */}
      <group position={[28, 0, -8]}>
        <mesh position={[0, 6, 0]}>
          <boxGeometry args={[5, 12, 4]} />
          <meshStandardMaterial color="#dcd0bc" />
        </mesh>
        {[0, 1, 2, 3, 4].map((row) => (
          <mesh key={`r2-${row}`} position={[0, 1.5 + row * 2.2, 2.1]}>
            <planeGeometry args={[3.5, 1.4]} />
            <meshStandardMaterial color="#70a0c8" />
          </mesh>
        ))}
        <mesh position={[0, 12.2, 0]}>
          <boxGeometry args={[5.3, 0.4, 4.3]} />
          <meshStandardMaterial color="#8a6a4a" />
        </mesh>
      </group>

      {/* ========== BACKGROUND BUILDINGS (further away) ========== */}
      <group position={[0, 0, -30]}>
        {/* Tall building center-left */}
        <mesh position={[-15, 8, 0]}>
          <boxGeometry args={[6, 16, 4]} />
          <meshStandardMaterial color="#b8a890" />
        </mesh>
        {/* Tall building center-right */}
        <mesh position={[12, 6, 0]}>
          <boxGeometry args={[5, 12, 4]} />
          <meshStandardMaterial color="#c0b0a0" />
        </mesh>
        {/* Wide building center */}
        <mesh position={[0, 4, -5]}>
          <boxGeometry args={[12, 8, 4]} />
          <meshStandardMaterial color="#d0c0b0" />
        </mesh>
      </group>

      {/* School building facade - ÉCOLE NIRD */}
      <group position={[0, 0, -15]}>
        {/* Main school building wall - warm cream color */}
        <mesh position={[0, 4, 0]} receiveShadow>
          <boxGeometry args={[25, 8, 0.5]} />
          <meshStandardMaterial
            color="#e8dcc8"
            roughness={0.75}
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

        {/* School name sign - "ÉCOLE NIRD" */}
        <group position={[0, 7.5, 0.3]}>
          <mesh>
            <boxGeometry args={[10, 1.2, 0.15]} />
            <meshStandardMaterial
              color="#1a1a2e"
              emissive="#00ff88"
              emissiveIntensity={0.4}
            />
          </mesh>
          {/* ÉCOLE NIRD HTML Text */}
          <Html
            position={[0, 0, 0.1]}
            center
            transform
            occlude
            style={{
              fontSize: '24px',
              fontWeight: 'bold',
              fontFamily: 'monospace',
              color: '#00ff88',
              textShadow: '0 0 10px #00ff88',
              letterSpacing: '4px',
              whiteSpace: 'nowrap',
            }}
          >
            ÉCOLE NIRD
          </Html>
        </group>

        {/* School clock */}
        <group position={[0, 6.2, 0.4]}>
          <mesh>
            <circleGeometry args={[0.5, 32]} />
            <meshStandardMaterial color="#f5f5f0" />
          </mesh>
          {/* Clock hands */}
          <mesh position={[0, 0.15, 0.01]} rotation={[0, 0, 0]}>
            <boxGeometry args={[0.03, 0.25, 0.02]} />
            <meshBasicMaterial color="#333" />
          </mesh>
          <mesh position={[0.1, 0, 0.01]} rotation={[0, 0, -Math.PI / 3]}>
            <boxGeometry args={[0.02, 0.35, 0.02]} />
            <meshBasicMaterial color="#333" />
          </mesh>
          {/* Clock border */}
          <mesh>
            <ringGeometry args={[0.48, 0.52, 32]} />
            <meshBasicMaterial color="#1a1a1a" />
          </mesh>
        </group>

        {/* French flag pole - left side */}
        <group position={[-11, 0, 0.5]}>
          {/* Pole */}
          <mesh position={[0, 5, 0]}>
            <cylinderGeometry args={[0.05, 0.08, 10, 8]} />
            <meshStandardMaterial color="#888888" metalness={0.8} roughness={0.3} />
          </mesh>
          {/* French flag - Bleu Blanc Rouge */}
          <group position={[0.6, 9, 0]}>
            {/* Blue */}
            <mesh position={[-0.35, 0, 0]}>
              <planeGeometry args={[0.35, 0.7]} />
              <meshBasicMaterial color="#002654" side={THREE.DoubleSide} />
            </mesh>
            {/* White */}
            <mesh position={[0, 0, 0]}>
              <planeGeometry args={[0.35, 0.7]} />
              <meshBasicMaterial color="#ffffff" side={THREE.DoubleSide} />
            </mesh>
            {/* Red */}
            <mesh position={[0.35, 0, 0]}>
              <planeGeometry args={[0.35, 0.7]} />
              <meshBasicMaterial color="#ed2939" side={THREE.DoubleSide} />
            </mesh>
          </group>
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
      {/* CLICKABLE Chatbot Hologram - THE GATEKEEPER */}
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
            <icosahedronGeometry args={[0.5, 0]} />
            <meshStandardMaterial
              color="#0078d4"
              emissive="#0078d4"
              emissiveIntensity={1}
              wireframe
              transparent
              opacity={0.95}
            />
          </mesh>
        </HologramEffect>

        {/* CLICK ME indicator - bouncing arrow and text */}
        <Html
          position={[0, 2.2, 0]}
          center
          style={{
            pointerEvents: 'none',
          }}
        >
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            animation: 'bounce 1.5s ease-in-out infinite',
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #0078d4 0%, #00a2ff 100%)',
              padding: '8px 16px',
              borderRadius: '20px',
              color: '#fff',
              fontWeight: 'bold',
              fontSize: '14px',
              fontFamily: 'monospace',
              boxShadow: '0 0 20px rgba(0, 120, 212, 0.6)',
              border: '2px solid rgba(255,255,255,0.3)',
            }}>
              💬 CLIQUEZ-MOI
            </div>
            <div style={{
              marginTop: '4px',
              fontSize: '24px',
              color: '#0078d4',
              textShadow: '0 0 10px #0078d4',
            }}>
              ▼
            </div>
          </div>
        </Html>

        {/* Professor title */}
        <Html
          position={[0, 0.5, 0]}
          center
          style={{ pointerEvents: 'none' }}
        >
          <div style={{
            background: 'rgba(0, 0, 0, 0.8)',
            padding: '6px 12px',
            borderRadius: '8px',
            border: '1px solid #0078d4',
            color: '#0078d4',
            fontSize: '11px',
            fontFamily: 'monospace',
            whiteSpace: 'nowrap',
            boxShadow: '0 0 15px rgba(0, 120, 212, 0.4)',
          }}>
            🎩 Prof. GAFAMius Windowsky III
          </div>
        </Html>

        {/* Base pedestal */}
        <mesh position={[0, 0.3, 0]} castShadow>
          <cylinderGeometry args={[0.9, 1.1, 0.6, 32]} />
          <meshStandardMaterial
            color="#0a0a15"
            metalness={0.95}
            roughness={0.1}
            emissive="#0078d4"
            emissiveIntensity={0.3}
          />
        </mesh>

        {/* Pedestal ring glow */}
        <mesh position={[0, 0.65, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.85, 0.95, 32]} />
          <meshBasicMaterial color="#0078d4" transparent opacity={0.8} />
        </mesh>
      </group>
      {/* BRIGHT SUNNY LIGHTING */}
      <ambientLight intensity={0.6} color="#fffaf0" />

      {/* Sun light from above-right */}
      <directionalLight
        position={[10, 20, 10]}
        intensity={1.2}
        color="#fff8e0"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />

      {/* Sky blue fill light */}
      <hemisphereLight
        skyColor="#87ceeb"
        groundColor="#4a8c3a"
        intensity={0.5}
      />

      {/* Warm accent lights near school */}
      <pointLight position={[-4, 4, -8]} intensity={0.4} color="#ffcc66" distance={12} />
      <pointLight position={[4, 4, -8]} intensity={0.4} color="#ffcc66" distance={12} />

      {/* Hologram glow */}
      <pointLight position={[0, 2, -2]} intensity={1} color="#00aaff" distance={6} />

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
