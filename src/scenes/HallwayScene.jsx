import Door from '../components/Door';
import useGameStore from '../core/GameStateContext';
import { FlickeringLight, DustParticles } from '../effects/AtmosphericEffects';
import { ReflectiveFloor } from '../components/Environment';

/**
 * Hallway Scene - Phase 2: The Hub
 * Atmospheric school corridor with flickering lights and reflections
 */
function HallwayScene({ isChatbotOpen }) {
  const { goToGate } = useGameStore();
  return (
    <group>
      {/* Highly reflective floor */}
      <ReflectiveFloor
        position={[0, 0, 0]}
        size={[12, 30]}
        color="#0a0a12"
        roughness={0.08}
        metalness={0.95}
        mirror={0.75}
      />

      {/* Floating dust in the air - Disabled when chatbot is open for performance */}
      {!isChatbotOpen && <DustParticles count={80} spread={8} color="#aabbcc" />}

      {/* Return to Gate Button - "Exit" block - Placed to the right for visibility */}
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
        {/* Label */}
        <mesh position={[0, 0.8, 0]}>
          <planeGeometry args={[1.5, 0.5]} />
          <meshBasicMaterial color="#ff0000" transparent opacity={0.8} />
        </mesh>
      </group>

      {/* Left wall with panel details */}
      <group position={[-5.5, 0, 0]}>
        {/* Main wall */}
        <mesh position={[0, 2.5, 0]} receiveShadow>
          <boxGeometry args={[0.3, 5, 30]} />
          <meshStandardMaterial
            color="#1a1a25"
            roughness={0.7}
            metalness={0.3}
          />
        </mesh>

        {/* Wall trim at bottom */}
        <mesh position={[0.1, 0.3, 0]}>
          <boxGeometry args={[0.1, 0.6, 30]} />
          <meshStandardMaterial
            color="#0a0a12"
            roughness={0.5}
            metalness={0.6}
          />
        </mesh>
      </group>

      {/* Right wall */}
      <group position={[5.5, 0, 0]}>
        <mesh position={[0, 2.5, 0]} receiveShadow>
          <boxGeometry args={[0.3, 5, 30]} />
          <meshStandardMaterial
            color="#1a1a25"
            roughness={0.7}
            metalness={0.3}
          />
        </mesh>

        <mesh position={[-0.1, 0.3, 0]}>
          <boxGeometry args={[0.1, 0.6, 30]} />
          <meshStandardMaterial
            color="#0a0a12"
            roughness={0.5}
            metalness={0.6}
          />
        </mesh>
      </group>

      {/* Ceiling with light fixtures */}
      <mesh position={[0, 5, 0]} receiveShadow>
        <boxGeometry args={[12, 0.3, 30]} />
        <meshStandardMaterial color="#0d0d15" roughness={0.8} />
      </mesh>

      {/* Back wall - closes off the end of the hallway behind the doors */}
      <mesh position={[0, 2.5, -14]} receiveShadow>
        <boxGeometry args={[12, 5, 0.3]} />
        <meshStandardMaterial
          color="#1a1a25"
          roughness={0.7}
          metalness={0.3}
        />
      </mesh>
      
      {/* Back wall trim at bottom */}
      <mesh position={[0, 0.3, -13.9]}>
        <boxGeometry args={[12, 0.6, 0.1]} />
        <meshStandardMaterial
          color="#0a0a12"
          roughness={0.5}
          metalness={0.6}
        />
      </mesh>

      {/* Front wall - closes off the entrance end (optional, for better enclosure) */}
      <mesh position={[0, 2.5, 14]} receiveShadow>
        <boxGeometry args={[12, 5, 0.3]} />
        <meshStandardMaterial
          color="#1a1a25"
          roughness={0.7}
          metalness={0.3}
        />
      </mesh>

      {/* Flickering fluorescent lights */}
      <FlickeringLight position={[0, 4.5, -8]} intensity={2.5} />
      <FlickeringLight position={[0, 4.5, 0]} intensity={2.5} />
      <FlickeringLight position={[0, 4.5, 8]} intensity={2.5} />

      {/* Modern lockers - LEFT side */}
      {Array.from({ length: 8 }).map((_, i) => (
        <group key={`locker-left-${i}`} position={[-4.8, 0, -12 + i * 3]}>
          {/* Locker body */}
          <mesh position={[0, 1.2, 0]} castShadow>
            <boxGeometry args={[0.5, 2.4, 0.9]} />
            <meshStandardMaterial
              color="#2a3040"
              metalness={0.85}
              roughness={0.2}
            />
          </mesh>

          {/* Locker door line */}
          <mesh position={[0.26, 1.2, 0]}>
            <boxGeometry args={[0.01, 2.3, 0.85]} />
            <meshStandardMaterial color="#1a1a25" />
          </mesh>

          {/* Handle */}
          <mesh position={[0.27, 1.2, 0.25]}>
            <boxGeometry args={[0.02, 0.15, 0.05]} />
            <meshStandardMaterial
              color="#888888"
              metalness={0.9}
              roughness={0.1}
            />
          </mesh>

          {/* Number plate glow */}
          <mesh position={[0.26, 2, 0]}>
            <planeGeometry args={[0.15, 0.1]} />
            <meshBasicMaterial color="#00ff88" transparent opacity={0.3} />
          </mesh>
        </group>
      ))}

      {/* Modern lockers - RIGHT side */}
      {Array.from({ length: 8 }).map((_, i) => (
        <group key={`locker-right-${i}`} position={[4.8, 0, -12 + i * 3]}>
          <mesh position={[0, 1.2, 0]} castShadow>
            <boxGeometry args={[0.5, 2.4, 0.9]} />
            <meshStandardMaterial
              color="#2a3040"
              metalness={0.85}
              roughness={0.2}
            />
          </mesh>

          <mesh position={[-0.26, 1.2, 0]}>
            <boxGeometry args={[0.01, 2.3, 0.85]} />
            <meshStandardMaterial color="#1a1a25" />
          </mesh>

          <mesh position={[-0.27, 1.2, 0.25]}>
            <boxGeometry args={[0.02, 0.15, 0.05]} />
            <meshStandardMaterial
              color="#888888"
              metalness={0.9}
              roughness={0.1}
            />
          </mesh>
        </group>
      ))}

      {/* Three interactive doors at the end */}
      <Door
        roomId="lab"
        position={[-3.2, 0, -12]}
        cameraTarget={{
          position: { x: 0, y: 1.6, z: 5 },
          lookAt: { x: 0, y: 1, z: 0 }
        }}
        label="Computer Lab"
      />

      <Door
        roomId="server"
        position={[0, 0, -12]}
        cameraTarget={{
          position: { x: 0, y: 1.6, z: 5 },
          lookAt: { x: 0, y: 1, z: 0 }
        }}
        label="Server Room"
      />

      <Door
        roomId="office"
        position={[3.2, 0, -12]}
        cameraTarget={{
          position: { x: 0, y: 1.6, z: 5 },
          lookAt: { x: 0, y: 1, z: 0 }
        }}
        label="Admin Office"
      />

      {/* Door labels - glowing signs above doors */}
      {[
        { pos: [-3.2, 2.8, -12], text: 'LAB', color: '#00aaff' },
        { pos: [0, 2.8, -12], text: 'SERVER', color: '#ff4444' },
        { pos: [3.2, 2.8, -12], text: 'OFFICE', color: '#ffaa00' },
      ].map((sign, i) => (
        <group key={i} position={sign.pos}>
          <mesh>
            <boxGeometry args={[1.2, 0.3, 0.05]} />
            <meshStandardMaterial
              color="#0a0a12"
              emissive={sign.color}
              emissiveIntensity={0.3}
            />
          </mesh>
          <pointLight intensity={0.3} distance={2} color={sign.color} />
        </group>
      ))}

      {/* Ambient light */}
      <ambientLight intensity={0.15} color="#8888cc" />

      {/* Emergency exit sign glow at the end */}
      <pointLight position={[0, 4, -13]} intensity={0.4} color="#00ff44" distance={6} />
    </group>
  );
}

export default HallwayScene;
