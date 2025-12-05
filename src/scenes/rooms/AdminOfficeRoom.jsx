import RoomBase from './RoomBase';
import { ScreenGlow, DustParticles, FlickeringLight, HologramEffect } from '../../effects/AtmosphericEffects';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { ReflectiveFloor } from '../../components/Environment';
import useGameStore from '../../core/GameStateContext';
// Real 3D Models from Kenney Furniture Kit
import Desk from '../../components/models/Desk';
import Chair from '../../components/models/Chair';
import LoungeChair from '../../components/models/LoungeChair';
import Bookcase from '../../components/models/Bookcase';
import SideTable from '../../components/models/SideTable';
import FloorLamp from '../../components/models/FloorLamp';
import { PottedPlant, Books, Trashcan } from '../../components/models/Props';
import Door from '../../components/Door';
import { useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { useMemo } from 'react';
import { tweenCamera } from '../../components/CameraController';

/**
 * Admin Office Room - Data Privacy & The Nexus theme
 * Paranoid atmosphere with Big Brother aesthetic
 * 
 * Integration points for puzzle developers:
 * - Cookie Monster puzzle should be placed at position [0, 1.2, -3]
 * - NIRD Form (Nexus) should be placed at position [5, 0.5, 4] (hidden terminal)
 * - Call completePuzzle('office') when puzzle is solved
 */
function AdminOfficeRoom() {
  const { openNIRDForm, exitRoom, setTransitioning } = useGameStore();
  const hologramRef = useRef();
  const { camera } = useThree();

  const handleBackToHallway = () => {
    setTransitioning(true);
    tweenCamera(
      camera,
      { x: 0, y: 1.6, z: 5 },
      { x: 0, y: 1.6, z: 0 },
      2,
      () => {
        exitRoom();
      }
    );
  };

  // Styles for the "Click Me" buttons
  const getButtonStyles = (color) => ({
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      animation: 'bounce 1.5s ease-in-out infinite',
    },
    button: {
      background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
      padding: '6px 12px',
      borderRadius: '20px',
      color: '#fff',
      fontWeight: 'bold',
      fontSize: '12px',
      fontFamily: 'monospace',
      boxShadow: `0 0 15px ${color}80`,
      border: '2px solid rgba(255,255,255,0.3)',
      whiteSpace: 'nowrap',
    },
    arrow: {
      marginTop: '2px',
      fontSize: '20px',
      color: color,
      textShadow: `0 0 10px ${color}`,
    },
  });

  const keyframeStyles = `
    @keyframes bounce {
      0%, 60%, 100% { transform: translateY(0); }
      30% { transform: translateY(-4px); }
    }
  `;

  // Animate hologram
  useFrame((state) => {
    if (hologramRef.current) {
      hologramRef.current.rotation.y = state.clock.elapsedTime * 0.5;
      hologramRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
  });

  return (
    <RoomBase lightingPreset="office" showBackButton={false}>
      <Html>
        <style>{keyframeStyles}</style>
      </Html>
      {/* Wooden-look floor with some reflection */}
      <ReflectiveFloor
        position={[0, 0, 0]}
        size={[14, 14]}
        color="#1a1510"
        roughness={0.3}
        metalness={0.4}
        mirror={0.3}
      />

      {/* Dust in the stale air */}
      <DustParticles count={50} spread={10} color="#998866" />

      {/* Walls */}
      {/* Back wall */}
      <mesh position={[0, 2.5, -7]}>
        <boxGeometry args={[14, 5, 0.2]} />
        <meshStandardMaterial color="#2a2520" roughness={0.85} />
      </mesh>
      {/* Left wall */}
      <mesh position={[-7, 2.5, 0]}>
        <boxGeometry args={[0.2, 5, 14]} />
        <meshStandardMaterial color="#2a2520" roughness={0.85} />
      </mesh>
      {/* Right wall */}
      <mesh position={[7, 2.5, 0]}>
        <boxGeometry args={[0.2, 5, 14]} />
        <meshStandardMaterial color="#2a2520" roughness={0.85} />
      </mesh>
      {/* Front wall - closes off the room entrance */}
      <mesh position={[0, 2.5, 7]}>
        <boxGeometry args={[14, 5, 0.2]} />
        <meshStandardMaterial color="#2a2520" roughness={0.85} />
      </mesh>

      {/* Return Door - Behind the user */}
      <Door
        position={[0, 0, 6.9]}
        rotation={[0, Math.PI, 0]}
        label="Retour au Couloir"
        onCustomClick={handleBackToHallway}
      />
      {/* Click Me Button for Return Door */}
      <Html
        position={[0, 2.8, 6.9]}
        center
        zIndexRange={[0, 0]}
        distanceFactor={10}
        style={{ pointerEvents: 'none' }}
      >
        <div style={getButtonStyles('#ffaa00').container}>
          <div style={getButtonStyles('#ffaa00').button}>
            💬 CLIQUEZ-MOI
          </div>
          <div style={getButtonStyles('#ffaa00').arrow}>
            ▼
          </div>
        </div>
      </Html>

      {/* Ceiling */}
      <mesh position={[0, 5, 0]}>
        <boxGeometry args={[14, 0.2, 14]} />
        <meshStandardMaterial color="#1a1815" />
      </mesh>
      <FlickeringLight position={[0, 4.5, 0]} intensity={1.8} />

      {/* BIG BROTHER EYE poster - creepy surveillance */}
      <group position={[0, 3, -6.85]}>
        {/* Poster frame */}
        <mesh>
          <boxGeometry args={[2.2, 2.2, 0.05]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>

        {/* Eye poster background */}
        <mesh position={[0, 0, 0.03]}>
          <planeGeometry args={[2, 2]} />
          <meshStandardMaterial
            color="#880000"
            emissive="#ff0000"
            emissiveIntensity={0.2}
          />
        </mesh>

        {/* Eye shape */}
        <mesh position={[0, 0, 0.04]}>
          <circleGeometry args={[0.5, 32]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={0.2}
          />
        </mesh>

        {/* Pupil */}
        <mesh position={[0, 0, 0.05]}>
          <circleGeometry args={[0.2, 32]} />
          <meshStandardMaterial
            color="#000000"
            emissive="#ff0000"
            emissiveIntensity={0.3}
          />
        </mesh>

        {/* Glowing effect */}
        <pointLight position={[0, 0, 0.5]} intensity={0.5} color="#ff0000" distance={4} />
      </group>

      {/* Main office desk with cookie popup computer */}
      <group position={[0, 0, -3]}>
        {/* Large desk */}
        <mesh position={[0, 0.45, 0]} castShadow>
          <boxGeometry args={[2.5, 0.1, 1.2]} />
          <meshStandardMaterial
            color="#3a2a1a"
            roughness={0.6}
          />
        </mesh>

        {/* Desk legs */}
        {[[-1.1, -0.5], [1.1, -0.5], [-1.1, 0.5], [1.1, 0.5]].map(([x, z], j) => (
          <mesh key={j} position={[x, 0.2, z]} castShadow>
            <boxGeometry args={[0.08, 0.4, 0.08]} />
            <meshStandardMaterial color="#2a1a0a" />
          </mesh>
        ))}

        {/* Monitor with cookie popups */}
        <group position={[0, 0.8, -0.3]}>
          <mesh castShadow>
            <boxGeometry args={[1.1, 0.7, 0.05]} />
            <meshStandardMaterial color="#1a1a1a" metalness={0.8} />
          </mesh>

          {/* Screen showing cookie horror */}
          <ScreenGlow
            position={[0, 0, 0.03]}
            size={[1, 0.6]}
            color="#ffffff"
            intensity={0.8}
          />

          {/* Cookie popup overlays (visual) */}
          {Array.from({ length: 5 }).map((_, i) => (
            <mesh
              key={i}
              position={[
                (Math.random() - 0.5) * 0.6,
                (Math.random() - 0.5) * 0.4,
                0.04 + i * 0.005
              ]}
            >
              <planeGeometry args={[0.25, 0.15]} />
              <meshBasicMaterial
                color="#222222"
                transparent
                opacity={0.95}
              />
            </mesh>
          ))}
        </group>

        {/* Keyboard */}
        <mesh position={[0, 0.52, 0.3]} castShadow>
          <boxGeometry args={[0.5, 0.02, 0.18]} />
          <meshStandardMaterial color="#2a2a2a" />
        </mesh>
      </group>

      {/* ========== REAL 3D OFFICE FURNITURE ========== */}

      {/* Bookcases along left wall */}
      <Bookcase position={[-6, 0, -4]} rotation={[0, Math.PI / 2, 0]} scale={1.8} />
      <Bookcase position={[-6, 0, -1]} rotation={[0, Math.PI / 2, 0]} scale={1.8} />
      <Bookcase position={[-6, 0, 2]} rotation={[0, Math.PI / 2, 0]} scale={1.8} />

      {/* Lounge seating area */}
      <LoungeChair position={[4, 0, -4]} rotation={[0, -Math.PI / 4, 0]} scale={1.5} />
      <LoungeChair position={[5.5, 0, -2]} rotation={[0, -Math.PI / 2, 0]} scale={1.5} />
      <SideTable position={[5, 0, -3]} scale={1.5} />

      {/* Floor lamps for ambiance */}
      <FloorLamp position={[-5.5, 0, 5]} scale={1.5} lightColor="#ffaa66" lightIntensity={0.4} />
      <FloorLamp position={[5.5, 0, 5]} scale={1.5} lightColor="#ffaa66" lightIntensity={0.4} />

      {/* Decorative plants */}
      <PottedPlant position={[-6.2, 0, -6]} scale={2.5} />
      <PottedPlant position={[6.2, 0, -6]} scale={2.5} />
      <PottedPlant position={[-6.2, 0, 5]} scale={2} />

      {/* Books on side table */}
      <Books position={[5, 0.55, -3]} rotation={[0, 0.5, 0]} scale={1.2} />

      {/* Trashcan near desk */}
      <Trashcan position={[1.8, 0, -2.5]} scale={1.5} />

      {/* Executive desk chair */}
      <Chair position={[0, 0, -1.8]} rotation={[0, Math.PI, 0]} scale={1.5} variant="desk" />

      {/* Document shredder */}
      <group position={[-4, 0, 3]}>
        <mesh position={[0, 0.4, 0]} castShadow>
          <boxGeometry args={[0.5, 0.8, 0.4]} />
          <meshStandardMaterial color="#3a3a3a" metalness={0.6} />
        </mesh>

        {/* Shredder slot */}
        <mesh position={[0, 0.75, 0]}>
          <boxGeometry args={[0.35, 0.05, 0.02]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>

        {/* Paper being shredded */}
        <mesh position={[0, 0.85, 0]}>
          <boxGeometry args={[0.25, 0.15, 0.01]} />
          <meshStandardMaterial color="#e8e0d0" />
        </mesh>
      </group>

      {/* Blue Hologram Trigger - CENTERED */}
      <group position={[0, 0, 0]}>
        {/* Hologram Effect */}
        <HologramEffect position={[0, 1.2, 0]} color="#0078d4">
          <mesh
            ref={hologramRef}
            onClick={(e) => {
              console.log('Blue Hologram Clicked!');
              e.stopPropagation();
              openNIRDForm();
            }}
            onPointerOver={() => document.body.style.cursor = 'pointer'}
            onPointerOut={() => document.body.style.cursor = 'default'}
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

        {/* "LE NEXUS" label */}
        <mesh position={[0, 0.6, 0]}>
          <planeGeometry args={[1.2, 0.25]} />
          <meshBasicMaterial color="#0078d4" transparent opacity={0.9} />
        </mesh>

        {/* Base pedestal */}
        <mesh position={[0, 0.3, 0]} castShadow>
          <cylinderGeometry args={[0.6, 0.8, 0.6, 32]} />
          <meshStandardMaterial
            color="#0a0a15"
            metalness={0.95}
            roughness={0.1}
            emissive="#0078d4"
            emissiveIntensity={0.2}
          />
        </mesh>

        {/* Hologram glow */}
        <pointLight position={[0, 1.5, 0]} intensity={2} color="#0078d4" distance={4} />

        {/* Click Me Button for Hologram */}
        <Html
          position={[0, 2.0, 0]}
          center
          zIndexRange={[0, 0]}
          distanceFactor={10}
          style={{ pointerEvents: 'none' }}
        >
          <div style={getButtonStyles('#0078d4').container}>
            <div style={getButtonStyles('#0078d4').button}>
              💬 CLIQUEZ-MOI
            </div>
            <div style={getButtonStyles('#0078d4').arrow}>
              ▼
            </div>
          </div>
        </Html>
      </group>

      {/* Moody lighting */}
      <ambientLight intensity={0.2} color="#aa9988" />
      <pointLight position={[-3, 3, 2]} intensity={0.4} color="#ffcc88" distance={8} />
    </RoomBase>
  );
}

export default AdminOfficeRoom;
