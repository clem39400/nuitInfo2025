import Door from '../components/Door';
import VideoRoom from './rooms/VideoRoom';
import useGameStore from '../core/GameStateContext';
import { FlickeringLight } from '../effects/AtmosphericEffects';
import { HallwayFloor } from '../components/StaticFloor';

/**
 * Hallway Scene - Phase 2: The Hub
 * Atmospheric school corridor with flickering lights and reflections
 */
function HallwayScene({ isChatbotOpen }) {
  const goToGate = useGameStore((state) => state.goToGate);

  return (
    <group>
      {/* Static wooden floor - won't re-render */}
      <HallwayFloor />

      {/* Return to Gate Button */}
      <group position={[3, 1, 3]}>
        <mesh
          onClick={goToGate}
          onPointerOver={(e) => {
            e.stopPropagation();
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={(e) => {
            e.stopPropagation();
            document.body.style.cursor = 'default';
          }}
        >
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial
            color="#ff0000"
            emissive="#ff0000"
            emissiveIntensity={0.5}
          />
        </mesh>
        <mesh position={[0, 0.8, 0]}>
          <planeGeometry args={[1.5, 0.5]} />
          <meshBasicMaterial color="#ff0000" transparent opacity={0.8} />
        </mesh>
      </group>

      {/* Left wall */}
      <group position={[-5.5, 0, 0]}>
        <mesh position={[0, 2.5, 0]} receiveShadow>
          <boxGeometry args={[0.3, 5, 30]} />
          <meshStandardMaterial color="#1a1a25" roughness={0.7} metalness={0.3} />
        </mesh>
        <mesh position={[0.1, 0.3, 0]}>
          <boxGeometry args={[0.1, 0.6, 30]} />
          <meshStandardMaterial color="#0a0a12" roughness={0.5} metalness={0.6} />
        </mesh>
      </group>

      {/* Right wall - Split for Video Room */}
      <group position={[5.5, 0, 0]}>
        <mesh position={[0, 2.5, 8]} receiveShadow>
          <boxGeometry args={[0.3, 5, 14]} />
          <meshStandardMaterial color="#1a1a25" roughness={0.7} metalness={0.3} />
        </mesh>
        <mesh position={[-0.1, 0.3, 8]}>
          <boxGeometry args={[0.1, 0.6, 14]} />
          <meshStandardMaterial color="#0a0a12" roughness={0.5} metalness={0.6} />
        </mesh>
        <mesh position={[0, 2.5, -8]} receiveShadow>
          <boxGeometry args={[0.3, 5, 14]} />
          <meshStandardMaterial color="#1a1a25" roughness={0.7} metalness={0.3} />
        </mesh>
        <mesh position={[-0.1, 0.3, -8]}>
          <boxGeometry args={[0.1, 0.6, 14]} />
          <meshStandardMaterial color="#0a0a12" roughness={0.5} metalness={0.6} />
        </mesh>
      </group>

      {/* Ceiling */}
      <mesh position={[0, 5, 0]} receiveShadow>
        <boxGeometry args={[12, 0.3, 30]} />
        <meshStandardMaterial color="#0d0d15" roughness={0.8} />
      </mesh>

      {/* Back wall */}
      <mesh position={[0, 2.5, -14]} receiveShadow>
        <boxGeometry args={[12, 5, 0.3]} />
        <meshStandardMaterial color="#1c1c28" roughness={0.65} metalness={0.35} />
      </mesh>

      {/* NIRD poster */}
      <mesh position={[0, 3.5, -13.85]}>
        <planeGeometry args={[3, 1.5]} />
        <meshStandardMaterial color="#1a2a3a" emissive="#00ff88" emissiveIntensity={0.15} />
      </mesh>

      {/* Back wall trim */}
      <mesh position={[0, 0.3, -13.9]}>
        <boxGeometry args={[12, 0.6, 0.1]} />
        <meshStandardMaterial color="#0a0a12" roughness={0.5} metalness={0.6} />
      </mesh>

      {/* Front wall */}
      <mesh position={[0, 2.5, 14]} receiveShadow>
        <boxGeometry args={[12, 5, 0.3]} />
        <meshStandardMaterial color="#1a1a25" roughness={0.7} metalness={0.3} />
      </mesh>

      {/* Flickering lights */}
      <FlickeringLight position={[0, 4.5, -8]} intensity={3.5} />
      <FlickeringLight position={[0, 4.5, 0]} intensity={3.5} />
      <FlickeringLight position={[0, 4.5, 8]} intensity={3.5} />

      {/* Lights */}
      <ambientLight intensity={0.4} color="#ffffff" />
      <pointLight position={[-3, 3, -4]} intensity={1.5} distance={10} color="#ffffff" />
      <pointLight position={[3, 3, 4]} intensity={1.5} distance={10} color="#ffffff" />

      {/* Video Room */}
      <group position={[12, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <VideoRoom />
      </group>

      {/* Doors */}
      <Door
        roomId="lab"
        position={[-3.2, 0, -12]}
        cameraTarget={{ position: { x: 0, y: 1.6, z: 5 }, lookAt: { x: 0, y: 1, z: 0 } }}
        label="Computer Lab"
      />
      <Door
        roomId="server"
        position={[0, 0, -12]}
        cameraTarget={{ position: { x: 0, y: 1.6, z: 5 }, lookAt: { x: 0, y: 1, z: 0 } }}
        label="Server Room"
      />
      <Door
        roomId="office"
        position={[3.2, 0, -12]}
        cameraTarget={{ position: { x: 0, y: 1.6, z: 5 }, lookAt: { x: 0, y: 1, z: 0 } }}
        label="Admin Office"
      />

      {/* Door signs */}
      {[
        { pos: [-3.2, 2.8, -12], text: 'LAB', color: '#00aaff' },
        { pos: [0, 2.8, -12], text: 'SERVER', color: '#ff4444' },
        { pos: [3.2, 2.8, -12], text: 'OFFICE', color: '#ffaa00' },
      ].map((sign, i) => (
        <group key={i} position={sign.pos}>
          <mesh>
            <boxGeometry args={[1.2, 0.3, 0.05]} />
            <meshStandardMaterial color="#0a0a12" emissive={sign.color} emissiveIntensity={0.3} />
          </mesh>
          <pointLight intensity={0.3} distance={2} color={sign.color} />
        </group>
      ))}

      {/* Ambient light */}
      <ambientLight intensity={0.12} color="#99aacc" />

      {/* Emergency exit glow */}
      <pointLight position={[0, 4, -13]} intensity={0.3} color="#00ff44" distance={6} />
    </group>
  );
}

export default HallwayScene;
