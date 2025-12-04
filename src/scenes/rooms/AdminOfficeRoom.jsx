import RoomBase from './RoomBase';
import { ScreenGlow, DustParticles, FlickeringLight, HologramEffect } from '../../effects/AtmosphericEffects';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { ReflectiveFloor } from '../../components/Environment';
import useGameStore from '../../core/GameStateContext';

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
  const { openNIRDForm } = useGameStore();
  const hologramRef = useRef();

  // Animate hologram
  useFrame((state) => {
    if (hologramRef.current) {
      hologramRef.current.rotation.y = state.clock.elapsedTime * 0.5;
      hologramRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
  });

  return (
    <RoomBase lightingPreset="office">
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
      <mesh position={[0, 2.5, -7]}>
        <boxGeometry args={[14, 5, 0.2]} />
        <meshStandardMaterial color="#2a2520" roughness={0.85} />
      </mesh>
      <mesh position={[-7, 2.5, 0]}>
        <boxGeometry args={[0.2, 5, 14]} />
        <meshStandardMaterial color="#2a2520" roughness={0.85} />
      </mesh>
      <mesh position={[7, 2.5, 0]}>
        <boxGeometry args={[0.2, 5, 14]} />
        <meshStandardMaterial color="#2a2520" roughness={0.85} />
      </mesh>

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

      {/* Stacks of paper files */}
      {[[-4, -2], [-3.5, 1], [4, -1], [3, 2]].map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          {Array.from({ length: 3 + Math.floor(Math.random() * 4) }).map((_, j) => (
            <mesh key={j} position={[0, 0.1 + j * 0.08, 0]} castShadow>
              <boxGeometry args={[0.3, 0.06, 0.4]} />
              <meshStandardMaterial
                color={`hsl(40, 20%, ${70 + Math.random() * 20}%)`}
              />
            </mesh>
          ))}
        </group>
      ))}

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
      </group>

      {/* Moody lighting */}
      <ambientLight intensity={0.2} color="#aa9988" />
      <pointLight position={[-3, 3, 2]} intensity={0.4} color="#ffcc88" distance={8} />
    </RoomBase>
  );
}

export default AdminOfficeRoom;
