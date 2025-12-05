import RoomBase from './RoomBase';
import { DustParticles, FlickeringLight } from '../../effects/AtmosphericEffects';
import { ReflectiveFloor } from '../../components/Environment';
import RefurbishmentWorkstation from '../../components/RefurbishmentWorkstation';
import MasterGuidePC from '../../components/MasterGuidePC';
import useRefurbishmentStore, { REFURBISHMENT_STATIONS } from '../../core/RefurbishmentGameState';
// Real 3D Models from Kenney Furniture Kit
import Desk from '../../components/models/Desk';
import Chair from '../../components/models/Chair';
import { Trashcan, Books, PottedPlant } from '../../components/models/Props';
import Door from '../../components/Door';
import useGameStore from '../../core/GameStateContext';
import { useThree } from '@react-three/fiber';
import { tweenCamera } from '../../components/CameraController';

/**
 * Computer Lab Room - PC Refurbishment Treasure Hunt
 * 
 * Players navigate between 6 workstations scattered around the room
 * to learn about PC reconditionnement (refurbishment) in a fun way!
 * 
 * The active station glows to guide players through the hunt.
 */
function ComputerLabRoom() {
  const { openMiniGame } = useRefurbishmentStore();
  const { exitRoom, setTransitioning } = useGameStore();
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

  return (
    <RoomBase lightingPreset="lab" showBackButton={false}>
      {/* Solid floor base */}
      <mesh position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[16, 16]} />
        <meshStandardMaterial color="#0a0a12" roughness={0.9} />
      </mesh>

      {/* Reflective floor with subtle grid pattern */}
      <ReflectiveFloor
        position={[0, 0, 0]}
        size={[16, 16]}
        color="#0a0a12"
        roughness={0.12}
        metalness={0.9}
        mirror={0.6}
      />

      {/* Floating particles for atmosphere */}
      <DustParticles count={80} spread={12} color="#66aaff" />

      {/* ========== WALLS ========== */}
      {/* Back wall */}
      <mesh position={[0, 2.5, -8]}>
        <boxGeometry args={[16, 5, 0.2]} />
        <meshStandardMaterial color="#12121a" roughness={0.85} />
      </mesh>
      {/* Left wall */}
      <mesh position={[-8, 2.5, 0]}>
        <boxGeometry args={[0.2, 5, 16]} />
        <meshStandardMaterial color="#12121a" roughness={0.85} />
      </mesh>
      {/* Right wall */}
      <mesh position={[8, 2.5, 0]}>
        <boxGeometry args={[0.2, 5, 16]} />
        <meshStandardMaterial color="#12121a" roughness={0.85} />
      </mesh>
      {/* Front wall - solid */}
      <mesh position={[0, 2.5, 8]}>
        <boxGeometry args={[16, 5, 0.2]} />
        <meshStandardMaterial color="#12121a" roughness={0.85} />
      </mesh>

      {/* Return Door - Behind the user */}
      <Door
        position={[0, 0, 7.9]}
        rotation={[0, Math.PI, 0]}
        label="Retour au Couloir"
        onCustomClick={handleBackToHallway}
      />

      {/* ========== CEILING ========== */}
      <mesh position={[0, 5, 0]}>
        <boxGeometry args={[16, 0.2, 16]} />
        <meshStandardMaterial color="#0a0a0f" />
      </mesh>

      {/* Ceiling lights */}
      <FlickeringLight position={[-4, 4.5, -3]} intensity={1.2} />
      <FlickeringLight position={[4, 4.5, -3]} intensity={1.2} />
      <FlickeringLight position={[-4, 4.5, 3]} intensity={1.2} />
      <FlickeringLight position={[4, 4.5, 3]} intensity={1.2} />

      {/* ========== DECORATIVE ELEMENTS ========== */}
      {/* Neon strip on back wall - "SALLE INFORMATIQUE" vibe */}
      <mesh position={[0, 4.2, -7.85]}>
        <boxGeometry args={[8, 0.1, 0.05]} />
        <meshStandardMaterial
          color="#00aaff"
          emissive="#00aaff"
          emissiveIntensity={0.8}
        />
      </mesh>
      <pointLight position={[0, 4.2, -7]} intensity={0.6} color="#00aaff" distance={6} />

      {/* Floor cable channels */}
      {[-3, 0, 3].map((x, i) => (
        <mesh key={i} position={[x, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.3, 14]} />
          <meshStandardMaterial color="#1a1a22" metalness={0.8} />
        </mesh>
      ))}

      {/* ========== MASTER GUIDE PC - Front of room ========== */}
      <MasterGuidePC position={[0, 0, 5.5]} />

      {/* ========== 6 REFURBISHMENT WORKSTATIONS - Scattered! ========== */}
      {REFURBISHMENT_STATIONS.map((station) => (
        <RefurbishmentWorkstation
          key={station.id}
          station={station}
          onInteract={(stationId) => openMiniGame(stationId)}
        />
      ))}

      {/* ========== REAL 3D FURNITURE - Kenney Assets ========== */}
      {/* Teacher's desk area */}
      <Desk position={[-5.5, 0, -5]} rotation={[0, Math.PI / 4, 0]} scale={1.5} />
      <Chair position={[-4.8, 0, -4.3]} rotation={[0, Math.PI / 4 + Math.PI, 0]} scale={1.5} variant="desk" />

      {/* Side desks along walls */}
      <Desk position={[6, 0, 0]} rotation={[0, -Math.PI / 2, 0]} scale={1.2} />
      <Desk position={[6, 0, -3]} rotation={[0, -Math.PI / 2, 0]} scale={1.2} />
      <Chair position={[5.2, 0, 0]} rotation={[0, Math.PI / 2, 0]} scale={1.2} variant="desk" />
      <Chair position={[5.2, 0, -3]} rotation={[0, Math.PI / 2, 0]} scale={1.2} variant="desk" />

      {/* Props for decoration */}
      <Trashcan position={[-6.5, 0, 6]} scale={1.5} />
      <Trashcan position={[6.5, 0, -6]} scale={1.5} />
      <Books position={[-5.3, 0.85, -5.2]} rotation={[0, 0.3, 0]} scale={1.2} />
      <Books position={[6.2, 0.85, 0.2]} rotation={[0, -0.5, 0]} scale={1.2} />
      <PottedPlant position={[-7, 0, -7]} scale={2} />
      <PottedPlant position={[7, 0, 6]} scale={2} />

      {/* ========== AMBIENT LIGHTING ========== */}
      {/* General ambient */}
      <ambientLight intensity={0.15} color="#6688aa" />

      {/* Blue tech glow from center */}
      <pointLight position={[0, 2, 0]} intensity={0.4} color="#0066dd" distance={12} />

      {/* Colored accent lights in corners */}
      <pointLight position={[-6, 0.5, -6]} intensity={0.3} color="#ff9500" distance={4} />
      <pointLight position={[6, 0.5, -6]} intensity={0.3} color="#00d4ff" distance={4} />
      <pointLight position={[-6, 0.5, 2]} intensity={0.3} color="#ff3366" distance={4} />
      <pointLight position={[6, 0.5, 2]} intensity={0.3} color="#cc66ff" distance={4} />
    </RoomBase>
  );
}

export default ComputerLabRoom;
