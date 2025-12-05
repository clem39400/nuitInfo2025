import MatrixRain, { RainEffect } from '../effects/MatrixRain';
import { HologramEffect, DustParticles } from '../effects/AtmosphericEffects';
import { ReflectiveFloor } from '../components/Environment';
import useGameStore from '../core/GameStateContext';
import { Html, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Person, StudentGroup } from '../components/models/Person';

/**
 * Gate Scene - Phase 1: The Gatekeeper
 * Bright, welcoming school entrance with NIRD values
 * 
 * Integration points for other developers:
 * - Chatbot component should be placed inside <HologramEffect> at position [0, 1.2, -2]
 * - Snake game triggers via completePuzzle('gate')
 */
function GateScene({ onOpenChatbot, isChatbotOpen }) {
  const { completePuzzle, goToHallway } = useGameStore();
  const hologramRef = useRef();
  const hologramCoreRef = useRef();

  // Animate hologram - both refs
  useFrame((state) => {
    const rotationY = state.clock.elapsedTime * 0.5;
    if (hologramRef.current) {
      hologramRef.current.rotation.y = rotationY;
    }
    if (hologramCoreRef.current) {
      hologramCoreRef.current.rotation.y = rotationY;
    }
  });

  // Static styles for HTML elements to prevent re-renders
  const clickMeStyles = useMemo(() => ({
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      animation: 'bounce 1.5s ease-in-out infinite',
    },
    button: {
      background: 'linear-gradient(135deg, #0078d4 0%, #00a2ff 100%)',
      padding: '8px 16px',
      borderRadius: '20px',
      color: '#fff',
      fontWeight: 'bold',
      fontSize: '14px',
      fontFamily: 'monospace',
      boxShadow: '0 0 20px rgba(0, 120, 212, 0.6)',
      border: '2px solid rgba(255,255,255,0.3)',
    },
    arrow: {
      marginTop: '4px',
      fontSize: '24px',
      color: '#0078d4',
      textShadow: '0 0 10px #0078d4',
    },
  }), []);

  const professorStyles = useMemo(() => ({
    background: 'rgba(0, 0, 0, 0.8)',
    padding: '6px 12px',
    borderRadius: '8px',
    border: '1px solid #0078d4',
    color: '#0078d4',
    fontSize: '11px',
    fontFamily: 'monospace',
    whiteSpace: 'nowrap',
    boxShadow: '0 0 15px rgba(0, 120, 212, 0.4)',
  }), []);

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
  // Load real textures from PolyHaven
  const grassTexture = useTexture('/assets/textures/grass/grass_diff.jpg');
  const stoneTexture = useTexture('/assets/textures/stone/stone_diff.jpg');
  const woodTexture = useTexture('/assets/textures/wood/wood_diff.jpg');

  // Configure texture tiling
  useMemo(() => {
    [grassTexture, stoneTexture, woodTexture].forEach((tex) => {
      if (tex) {
        tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
      }
    });
    if (grassTexture) {
      grassTexture.repeat.set(20, 20);
    }
    if (stoneTexture) {
      stoneTexture.repeat.set(4, 8);
    }
    if (woodTexture) {
      woodTexture.repeat.set(2, 2);
    }
  }, [grassTexture, stoneTexture, woodTexture]);

  return (
    <group>
      {/* Gentle floating particles - like pollen/leaves */}
      <DustParticles count={30} spread={20} color="#ffdd88" />

      {/* Realistic grass ground with REAL texture */}
      {/* Base layer - darker grass */}
      <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial map={grassTexture} color="#5a9045" roughness={0.95} />
      </mesh>

      {/* Main grass layer with texture */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[80, 80]} />
        <meshStandardMaterial map={grassTexture} color="#6aaa55" roughness={0.9} />
      </mesh>

      {/* Grass texture patches for realism - fixed positions to avoid flickering */}
      {[
        // Left side - well spaced
        { x: -6, z: 5, r: 0.5, size: 1.8 },
        { x: -9, z: -6, r: 1.2, size: 1.5 },
        { x: -12, z: 2, r: 2.1, size: 2.0 },
        { x: -7, z: -12, r: 1.5, size: 1.4 },
        // Right side - well spaced
        { x: 6, z: 5, r: 2.5, size: 1.8 },
        { x: 9, z: -6, r: 0.3, size: 1.5 },
        { x: 12, z: 2, r: 1.8, size: 2.0 },
        { x: 7, z: -12, r: 0.7, size: 1.4 },
      ].map((patch, i) => (
        <mesh
          key={`grass-${i}`}
          position={[patch.x, 0.001, patch.z]}
          rotation={[-Math.PI / 2, 0, patch.r]}
        >
          <circleGeometry args={[patch.size, 8]} />
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

      {/* Stone pathway to gate with REAL cobblestone texture */}
      <mesh position={[0, 0.04, -3]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[6, 14]} />
        <meshStandardMaterial
          map={stoneTexture}
          color="#c0b8a8"
          roughness={0.85}
        />
      </mesh>

      {/* Decorative path tiles */}
      {Array.from({ length: 7 }).map((_, i) => (
        <mesh key={i} position={[0, 0.06, 2 - i * 2]} rotation={[-Math.PI / 2, 0, 0]}>
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





      {/* Decorative hedges along path */}
      <mesh position={[-3.5, 0.4, -3]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.8, 0.8, 10]} />
        <meshStandardMaterial color="#2a5a1a" />
      </mesh>
      <mesh position={[3.5, 0.4, -3]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.8, 0.8, 10]} />
        <meshStandardMaterial color="#2a5a1a" />
      </mesh>

      {/* ========== NPCs - STUDENTS OUTDOORS ========== */}
      {/* Student group chatting near trees on left */}
      <StudentGroup position={[-7, 0, 0]} rotation={Math.PI / 3} />
      
      {/* Student walking toward the gate */}
      <Person 
        position={[5, 0, 2]}
        rotation={-Math.PI / 2 - 0.3}
        shirtColor="#5588cc"
        hairColor="#2a2a2a"
        hasBackpack={true}
        scale={0.95}
      />
      
      {/* Students near the school entrance */}
      <Person 
        position={[-6, 0, -8]}
        rotation={Math.PI / 4}
        skinColor="#d8a87a"
        shirtColor="#ee6655"
        hairColor="#5a4a3a"
        hasBackpack={true}
        scale={0.9}
      />
      <Person 
        position={[-5, 0, -7.5]}
        rotation={-Math.PI / 6}
        skinColor="#f0c8a0"
        shirtColor="#55aa77"
        hairColor="#8a6a4a"
        hasBackpack={false}
        scale={0.88}
      />
      
      {/* Student on right side near tree */}
      <Person 
        position={[7, 0, -3]}
        rotation={-Math.PI / 4}
        skinColor="#c4956a"
        shirtColor="#aa5577"
        hairColor="#1a1a1a"
        hasBackpack={true}
        scale={0.92}
      />

      {/* Subtle stone marker with snake game clue - near left hedge, player's side */}
      <group position={[-4.2, 0, 1.5]}>
        {/* Small weathered stone */}
        <mesh position={[0, 0.15, 0]} rotation={[0, 0.3, 0]}>
          <boxGeometry args={[0.5, 0.3, 0.3]} />
          <meshStandardMaterial color="#7a7a7a" roughness={0.95} />
        </mesh>
        {/* Carved text on stone - visible clue */}
        <Html
          position={[0, 0.38, 0]}
          center
          distanceFactor={4}
          style={{ pointerEvents: 'none' }}
        >
          <div style={{
            color: '#3a3a3a',
            fontSize: '10px',
            fontFamily: 'Georgia, serif',
            fontStyle: 'italic',
            whiteSpace: 'nowrap',
            textShadow: '0 0 2px rgba(255,255,255,0.5)',
          }}>
            <span style={{ fontSize: '14px' }}>🐍</span> → Prof. GAFAMius
          </div>
        </Html>
      </group>

      {/* ========== SKY ENCLOSURE - Complete backdrop ========== */}
      {/* Back sky wall - main backdrop behind the school - MATCHES BACKGROUND */}
      <mesh position={[0, 15, -35]} rotation={[0, 0, 0]}>
        <planeGeometry args={[100, 50]} />
        <meshBasicMaterial color="#8ab8d0" side={THREE.DoubleSide} />
      </mesh>

      {/* Left side wall - closes the left side */}
      <mesh position={[-30, 15, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[80, 50]} />
        <meshBasicMaterial color="#8ab8d0" side={THREE.DoubleSide} />
      </mesh>

      {/* Right side wall - closes the right side */}
      <mesh position={[30, 15, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[80, 50]} />
        <meshBasicMaterial color="#8ab8d0" side={THREE.DoubleSide} />
      </mesh>

      {/* Top sky - covers any gaps above */}
      <mesh position={[0, 40, -10]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[100, 80]} />
        <meshBasicMaterial color="#8ab8d0" side={THREE.DoubleSide} />
      </mesh>

      {/* ========== NATURAL FOREST BACKDROP - Closes off the scene properly ========== */}

      {/* Layer 1: Dense forest treeline (furthest back) */}
      <group position={[0, 0, -28]}>
        {/* Continuous hedge/forest base */}
        <mesh position={[0, 3, 0]}>
          <boxGeometry args={[80, 6, 4]} />
          <meshStandardMaterial color="#1a4a1a" roughness={0.95} />
        </mesh>

        {/* Individual trees in the back */}
        {Array.from({ length: 15 }).map((_, i) => (
          <group key={`back-tree-${i}`} position={[-35 + i * 5, 0, Math.random() * 2]}>
            {/* Tree trunk */}
            <mesh position={[0, 3, 0]}>
              <cylinderGeometry args={[0.3, 0.4, 6, 8]} />
              <meshStandardMaterial color="#4a3020" roughness={0.9} />
            </mesh>
            {/* Tree crown - large */}
            <mesh position={[0, 7 + Math.random() * 2, 0]}>
              <sphereGeometry args={[2.5 + Math.random(), 12, 12]} />
              <meshStandardMaterial color={`hsl(${110 + Math.random() * 20}, 50%, ${20 + Math.random() * 10}%)`} roughness={0.95} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Layer 2: Mid-distance bushes and smaller trees */}
      <group position={[0, 0, -22]}>
        {/* Green bush line */}
        <mesh position={[0, 1.5, 0]}>
          <boxGeometry args={[60, 3, 2]} />
          <meshStandardMaterial color="#2a5a25" roughness={0.95} />
        </mesh>

        {/* Scattered bushes */}
        {Array.from({ length: 20 }).map((_, i) => (
          <mesh key={`bush-${i}`} position={[-28 + i * 3 + Math.random(), 1, Math.random() - 0.5]}>
            <sphereGeometry args={[0.8 + Math.random() * 0.5, 8, 8]} />
            <meshStandardMaterial color={`hsl(${115 + Math.random() * 15}, 45%, ${25 + Math.random() * 10}%)`} roughness={0.95} />
          </mesh>
        ))}
      </group>

      {/* Layer 3: Closest vegetation - decorative shrubs */}
      {[-18, -12, 12, 18].map((x, i) => (
        <group key={`shrub-${i}`} position={[x, 0, -18]}>
          <mesh position={[0, 1, 0]}>
            <sphereGeometry args={[1.2, 8, 8]} />
            <meshStandardMaterial color="#3a6a30" roughness={0.95} />
          </mesh>
        </group>
      ))}

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

      {/* ========== SURROUNDING BUILDINGS - LEFT SIDE - DARKER ========== */}
      <group position={[-20, 0, -12]}>
        {/* Apartment building 1 */}
        <mesh position={[0, 5, 0]}>
          <boxGeometry args={[8, 10, 6]} />
          <meshStandardMaterial color="#a89888" roughness={0.9} />
        </mesh>
        {/* Windows - minimal glow */}
        {[0, 1, 2, 3].map((row) =>
          [0, 1, 2].map((col) => (
            <mesh key={`l1-${row}-${col}`} position={[-2.5 + col * 2.5, 2 + row * 2, 3.1]}>
              <planeGeometry args={[1.2, 1.5]} />
              <meshStandardMaterial color="#4a7b9a" emissive="#5588aa" emissiveIntensity={0.02} />
            </mesh>
          ))
        )}
        {/* Roof */}
        <mesh position={[0, 10.3, 0]}>
          <boxGeometry args={[8.5, 0.6, 6.5]} />
          <meshStandardMaterial color="#6a5a4a" roughness={0.95} />
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

      {/* School building facade - ÉCOLE NIRD - DARKER colors */}
      <group position={[0, 0, -15]}>
        {/* Main school building wall - warmer, darker cream color */}
        <mesh position={[0, 4, 0]} receiveShadow>
          <boxGeometry args={[25, 8, 0.5]} />
          <meshStandardMaterial
            color="#c8b8a0"
            roughness={0.85}
          />
        </mesh>

        {/* Building windows - darker, less glow */}
        {Array.from({ length: 8 }).map((_, i) => (
          <group key={i} position={[-10 + i * 2.8, 4.5, 0.3]}>
            {/* Window */}
            <mesh>
              <planeGeometry args={[1.2, 1.8]} />
              <meshStandardMaterial
                color="#2a2a3a"
                emissive="#886633"
                emissiveIntensity={0.03}
              />
            </mesh>
            {/* Very subtle window glow */}
            <pointLight position={[0, 0, 0.5]} intensity={0.05} color="#ffcc66" distance={2} />
          </group>
        ))}
        <group position={[0, 7.5, 0.3]}>
          <mesh>
            <boxGeometry args={[10, 1.2, 0.15]} />
            <meshStandardMaterial
              color="#1a1a2e"
              emissive="#00ff88"
              emissiveIntensity={0.25}
            />
          </mesh>
          {/* ÉCOLE NIRD HTML Text - STATIC, not affected by camera */}
          <Html
            position={[0, 0, 0.1]}
            center
            sprite={false}
            distanceFactor={10}
            zIndexRange={[0, 100]}
            style={{
              fontSize: '28px',
              fontWeight: 'bold',
              fontFamily: 'Arial, sans-serif',
              color: '#00ff88',
              textShadow: '0 0 15px #00ff88, 0 0 30px #00ff88',
              letterSpacing: '6px',
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
              userSelect: 'none',
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
      <group position={[0, -1, -5]}>
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
      {/* CLICKABLE Chatbot Hologram - THE GATEKEEPER - MUCH MORE VISIBLE */}
      <group position={[0, 0, -2]}>
        {/* Hologram pedestal for chatbot - CLICKABLE */}
        <HologramEffect position={[0, 1.5, 0]} color="#00aaff">
          {/* Chatbot avatar - rotating Windows-style shape - BIGGER & BRIGHTER */}
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
            <icosahedronGeometry args={[0.7, 0]} />
            <meshStandardMaterial
              color="#00ccff"
              emissive="#00aaff"
              emissiveIntensity={2.5}
              wireframe
              transparent
              opacity={0.98}
            />
          </mesh>

          {/* Inner solid core for more visibility */}
          <mesh ref={hologramCoreRef}>
            <icosahedronGeometry args={[0.35, 0]} />
            <meshStandardMaterial
              color="#00ddff"
              emissive="#00ccff"
              emissiveIntensity={3}
              transparent
              opacity={0.7}
            />
          </mesh>
        </HologramEffect>

        {/* Bright blue light around hologram */}
        <pointLight position={[0, 1.5, 0]} intensity={4} color="#00aaff" distance={8} />
        <pointLight position={[0, 2.5, 0]} intensity={2} color="#00ccff" distance={5} />

        {/* CLICK ME indicator - bouncing arrow and text */}
        <Html
          position={[0, 2.2, 0]}
          center
          zIndexRange={[0, 0]}
          distanceFactor={8}
          style={{
            pointerEvents: 'none',
          }}
        >
          <div style={clickMeStyles.container}>
            <div style={clickMeStyles.button}>
              💬 CLIQUEZ-MOI
            </div>
            <div style={clickMeStyles.arrow}>
              ▼
            </div>
          </div>
        </Html>

        {/* Professor title */}
        <Html
          position={[0, 0.5, 0]}
          center
          zIndexRange={[0, 0]}
          distanceFactor={8}
          style={{ pointerEvents: 'none' }}
        >
          <div style={professorStyles}>
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
      {/* NATURAL BALANCED LIGHTING - DARKER for hologram visibility */}
      <ambientLight intensity={0.25} color="#fffaf0" />

      {/* Sun light from above-right - LOWER intensity */}
      <directionalLight
        position={[15, 25, 12]}
        intensity={0.5}
        color="#fff5e0"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={60}
        shadow-camera-left={-25}
        shadow-camera-right={25}
        shadow-camera-top={25}
        shadow-camera-bottom={-25}
      />

      {/* Sky blue fill light - much softer */}
      <hemisphereLight
        skyColor="#90b0c0"
        groundColor="#4a7a3a"
        intensity={0.25}
      />

      {/* Warm accent lights near school - reduced */}
      <pointLight position={[-4, 4, -8]} intensity={0.25} color="#ffcc66" distance={12} />
      <pointLight position={[4, 4, -8]} intensity={0.25} color="#ffcc66" distance={12} />

      {/* Hologram glow */}
      <pointLight position={[0, 2, -2]} intensity={1} color="#00aaff" distance={6} />


    </group>
  );
}

export default GateScene;
