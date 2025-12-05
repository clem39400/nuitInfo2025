import Door from '../components/Door';
import VideoRoom from './rooms/VideoRoom';
import useGameStore from '../core/GameStateContext';
import { FlickeringLight, DustParticles } from '../effects/AtmosphericEffects';
import { ReflectiveFloor } from '../components/Environment';
// Real 3D Models from Kenney Furniture Kit
import Bench from '../components/models/Bench';
import WallLamp from '../components/models/WallLamp';
import CoatRack from '../components/models/CoatRack';
import CoffeeTable from '../components/models/CoffeeTable';
import Sofa from '../components/models/Sofa';
import { PottedPlant, Trashcan, Books } from '../components/models/Props';
import { RectangleRug, Doormat } from '../components/models/Rug';

/**
 * Hallway Scene - Phase 2: The Hub
 * Welcoming school corridor with warm lighting, furniture, and decorations
 * - Lighter walls for better visibility
 * - Light well from Video Room
 * - Doors flush against back wall
 * - Real door frames with decorations
 */
function HallwayScene({ isChatbotOpen }) {
  const { goToGate } = useGameStore();
  
  // Light warm wall color
  const wallColor = "#6B5B4F";
  const trimColor = "#4A3F35";
  const ceilingColor = "#5A5045";
  
  return (
    <group>
      {/* ========== FLOOR ========== */}
      <ReflectiveFloor
        position={[0, 0, 0]}
        size={[12, 30]}
        color="#9B8B7A"
        roughness={0.35}
        metalness={0.1}
        mirror={0.2}
      />

      {/* ========== RUGS AND DOORMATS ========== */}
      <RectangleRug position={[0, 0.01, 10]} rotation={[0, 0, 0]} scale={3} />
      <Doormat position={[-3.2, 0.01, -13]} scale={1.5} />
      <Doormat position={[0, 0.01, -13]} scale={1.5} />
      <Doormat position={[3.2, 0.01, -13]} scale={1.5} />

      {/* Return to Gate - styled as exit sign */}
      <group position={[4.5, 2.5, 13.5]}>
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
          <boxGeometry args={[1, 0.4, 0.1]} />
          <meshStandardMaterial
            color="#22aa44"
            emissive="#00ff44"
            emissiveIntensity={0.5}
          />
        </mesh>
        <pointLight position={[0, 0, 0.3]} intensity={0.6} color="#00ff44" distance={4} />
      </group>

      {/* ========== LEFT WALL - SOLID ========== */}
      <group position={[-6, 0, 0]}>
        {/* Main wall - lighter color */}
        <mesh position={[0, 2.5, 0]} receiveShadow>
          <boxGeometry args={[0.4, 5, 30]} />
          <meshStandardMaterial color={wallColor} roughness={0.7} />
        </mesh>

        {/* Wainscoting / Wall trim at bottom */}
        <mesh position={[0.15, 0.6, 0]}>
          <boxGeometry args={[0.15, 1.2, 30]} />
          <meshStandardMaterial color={trimColor} roughness={0.5} />
        </mesh>

        {/* ===== WALL PAINTINGS / POSTERS ===== */}
        {/* NIRD Value Poster 1 - "REPAIR" */}
        <group position={[0.25, 2.8, -6]}>
          <mesh>
            <boxGeometry args={[0.08, 1.4, 1.1]} />
            <meshStandardMaterial color="#2a2a2a" />
          </mesh>
          <mesh position={[0.05, 0, 0]}>
            <planeGeometry args={[1, 1.3]} />
            <meshStandardMaterial 
              color="#2a5a4a" 
              emissive="#00ff88" 
              emissiveIntensity={0.15}
            />
          </mesh>
          <pointLight position={[0.3, 0, 0]} intensity={0.2} color="#00ff88" distance={2} />
        </group>

        {/* NIRD Value Poster 2 - "REUSE" */}
        <group position={[0.25, 2.8, 0]}>
          <mesh>
            <boxGeometry args={[0.08, 1.4, 1.1]} />
            <meshStandardMaterial color="#2a2a2a" />
          </mesh>
          <mesh position={[0.05, 0, 0]}>
            <planeGeometry args={[1, 1.3]} />
            <meshStandardMaterial 
              color="#4a5a2a" 
              emissive="#88ff00" 
              emissiveIntensity={0.15}
            />
          </mesh>
          <pointLight position={[0.3, 0, 0]} intensity={0.2} color="#88ff00" distance={2} />
        </group>

        {/* NIRD Value Poster 3 - "REDUCE" */}
        <group position={[0.25, 2.8, 6]}>
          <mesh>
            <boxGeometry args={[0.08, 1.4, 1.1]} />
            <meshStandardMaterial color="#2a2a2a" />
          </mesh>
          <mesh position={[0.05, 0, 0]}>
            <planeGeometry args={[1, 1.3]} />
            <meshStandardMaterial 
              color="#5a4a2a" 
              emissive="#ffaa00" 
              emissiveIntensity={0.15}
            />
          </mesh>
          <pointLight position={[0.3, 0, 0]} intensity={0.2} color="#ffaa00" distance={2} />
        </group>

        {/* Wall Lamps */}
        <WallLamp position={[0.35, 2.5, -9]} rotation={[0, Math.PI / 2, 0]} scale={1.8} lightColor="#ffeecc" lightIntensity={0.6} />
        <WallLamp position={[0.35, 2.5, -3]} rotation={[0, Math.PI / 2, 0]} scale={1.8} lightColor="#ffeecc" lightIntensity={0.6} />
        <WallLamp position={[0.35, 2.5, 3]} rotation={[0, Math.PI / 2, 0]} scale={1.8} lightColor="#ffeecc" lightIntensity={0.6} />
        <WallLamp position={[0.35, 2.5, 9]} rotation={[0, Math.PI / 2, 0]} scale={1.8} lightColor="#ffeecc" lightIntensity={0.6} />
      </group>

      {/* ========== RIGHT WALL - WITH VIDEO ROOM OPENING ========== */}
      <group position={[6, 0, 0]}>
        {/* Front section (before Video Room opening) - z = 1 to 15 */}
        <mesh position={[0, 2.5, 8]} receiveShadow>
          <boxGeometry args={[0.4, 5, 14]} />
          <meshStandardMaterial color={wallColor} roughness={0.7} />
        </mesh>
        <mesh position={[-0.15, 0.6, 8]}>
          <boxGeometry args={[0.15, 1.2, 14]} />
          <meshStandardMaterial color={trimColor} roughness={0.5} />
        </mesh>

        {/* Back section (after Video Room opening) - z = -15 to -1 */}
        <mesh position={[0, 2.5, -8]} receiveShadow>
          <boxGeometry args={[0.4, 5, 14]} />
          <meshStandardMaterial color={wallColor} roughness={0.7} />
        </mesh>
        <mesh position={[-0.15, 0.6, -8]}>
          <boxGeometry args={[0.15, 1.2, 14]} />
          <meshStandardMaterial color={trimColor} roughness={0.5} />
        </mesh>

        {/* Wall Lamps on right side */}
        <WallLamp position={[-0.35, 2.5, 10]} rotation={[0, -Math.PI / 2, 0]} scale={1.8} lightColor="#ffeecc" lightIntensity={0.6} />
        <WallLamp position={[-0.35, 2.5, -10]} rotation={[0, -Math.PI / 2, 0]} scale={1.8} lightColor="#ffeecc" lightIntensity={0.6} />
      </group>

      {/* ========== LIGHT WELL FROM VIDEO ROOM ========== */}
      {/* Bright light spilling from the Video Room opening */}
      <group position={[5.5, 0, 0]}>
        {/* Main light beam from projection room */}
        <spotLight 
          position={[2, 3, 0]} 
          angle={0.8}
          penumbra={0.5}
          intensity={3}
          color="#aaccff"
          distance={12}
          target-position={[0, 0, 0]}
        />
        <pointLight position={[1, 2, 0]} intensity={1.5} color="#8899ff" distance={8} />
        <pointLight position={[0, 1, 0]} intensity={1} color="#aabbff" distance={5} />
        
        {/* Glowing floor area from light */}
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[3, 4]} />
          <meshStandardMaterial 
            color="#667788" 
            emissive="#4466aa" 
            emissiveIntensity={0.15}
            transparent
            opacity={0.5}
          />
        </mesh>
      </group>

      {/* ========== CEILING ========== */}
      <mesh position={[0, 5, 0]} receiveShadow>
        <boxGeometry args={[12, 0.4, 30]} />
        <meshStandardMaterial color={ceilingColor} roughness={0.75} />
      </mesh>

      {/* ========== BACK WALL WITH DOOR ALCOVES ========== */}
      {/* Main back wall - with cutouts for doors */}
      <mesh position={[0, 2.5, -14.2]} receiveShadow>
        <boxGeometry args={[12, 5, 0.4]} />
        <meshStandardMaterial color={wallColor} roughness={0.65} />
      </mesh>

      {/* Door frames / alcoves - decorative surrounds */}
      {[-3.2, 0, 3.2].map((x, i) => (
        <group key={i} position={[x, 0, -14]}>
          {/* Door frame - top */}
          <mesh position={[0, 2.7, 0.1]}>
            <boxGeometry args={[1.6, 0.15, 0.25]} />
            <meshStandardMaterial color="#3a2a1a" roughness={0.4} />
          </mesh>
          {/* Door frame - left */}
          <mesh position={[-0.75, 1.35, 0.1]}>
            <boxGeometry args={[0.1, 2.7, 0.25]} />
            <meshStandardMaterial color="#3a2a1a" roughness={0.4} />
          </mesh>
          {/* Door frame - right */}
          <mesh position={[0.75, 1.35, 0.1]}>
            <boxGeometry args={[0.1, 2.7, 0.25]} />
            <meshStandardMaterial color="#3a2a1a" roughness={0.4} />
          </mesh>
          {/* Decorative plant next to each door */}
          <PottedPlant position={[1.2, 0, 0.5]} scale={1.8} />
        </group>
      ))}

      {/* NIRD Hero Banner on back wall */}
      <group position={[0, 4.2, -13.95]}>
        <mesh>
          <planeGeometry args={[8, 0.8]} />
          <meshStandardMaterial
            color="#1a3a5a"
            emissive="#00aaff"
            emissiveIntensity={0.3}
          />
        </mesh>
        <pointLight position={[0, 0, 0.5]} intensity={0.5} color="#00aaff" distance={4} />
      </group>

      {/* Back wall trim */}
      <mesh position={[0, 0.6, -14]}>
        <boxGeometry args={[12, 1.2, 0.18]} />
        <meshStandardMaterial color={trimColor} roughness={0.5} />
      </mesh>

      {/* ========== FRONT WALL ========== */}
      <mesh position={[0, 2.5, 14.2]} receiveShadow>
        <boxGeometry args={[12, 5, 0.4]} />
        <meshStandardMaterial color={wallColor} roughness={0.65} />
      </mesh>

      {/* ========== WAITING AREA ========== */}
      <group position={[-3.5, 0, 6]}>
        <Sofa position={[0, 0, 0]} rotation={[0, Math.PI / 2, 0]} scale={1.8} />
        <CoffeeTable position={[1.5, 0, 0]} scale={1.5} />
        <Books position={[1.5, 0.4, 0.2]} rotation={[0, 0.3, 0]} scale={1.2} />
        <RectangleRug position={[0.8, 0.01, 0]} scale={2.5} />
      </group>

      {/* ========== BENCHES ========== */}
      <Bench position={[-5.2, 0, -2]} rotation={[0, Math.PI / 2, 0]} scale={1.5} withCushion={true} />
      <Bench position={[-5.2, 0, -8]} rotation={[0, Math.PI / 2, 0]} scale={1.5} withCushion={true} />

      {/* ========== COAT RACKS ========== */}
      <CoatRack position={[-5, 0, 11]} scale={1.8} />
      <CoatRack position={[5, 0, 5]} scale={1.8} />

      {/* ========== POTTED PLANTS ========== */}
      <PottedPlant position={[-5.2, 0, 2]} scale={2.5} />
      <PottedPlant position={[-5.2, 0, -5]} scale={2} />
      <PottedPlant position={[5.2, 0, 8]} scale={2.5} />
      <PottedPlant position={[-1, 0, 12.5]} scale={2} />
      <PottedPlant position={[1, 0, 12.5]} scale={2} />

      {/* ========== TRASH CANS ========== */}
      <Trashcan position={[5, 0, -5]} scale={1.5} />
      <Trashcan position={[-5, 0, 12]} scale={1.5} />

      {/* ========== CEILING LIGHTS ========== */}
      <FlickeringLight position={[0, 4.5, -8]} intensity={3} />
      <FlickeringLight position={[0, 4.5, 0]} intensity={3} />
      <FlickeringLight position={[0, 4.5, 8]} intensity={3} />

      {/* ========== AMBIENT LIGHTING - BRIGHTER ========== */}
      <ambientLight intensity={0.5} color="#fff8f0" />
      <pointLight position={[-3, 3, 6]} intensity={1.2} distance={10} color="#ffeecc" />
      <pointLight position={[3, 3, -4]} intensity={1.2} distance={10} color="#ffeecc" />
      {/* Extra fill light */}
      <pointLight position={[0, 4, 0]} intensity={0.8} distance={15} color="#ffffff" />

      {/* ========== VIDEO ROOM ========== */}
      <group position={[12, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <VideoRoom />
      </group>

      {/* ========== DOORS - FLUSH AGAINST BACK WALL ========== */}
      <Door
        roomId="lab"
        position={[-3.2, 0, -13.8]}
        cameraTarget={{
          position: { x: 0, y: 1.6, z: 5 },
          lookAt: { x: 0, y: 1, z: 0 }
        }}
        label="Computer Lab"
      />
      <Door
        roomId="server"
        position={[0, 0, -13.8]}
        cameraTarget={{
          position: { x: 0, y: 1.6, z: 5 },
          lookAt: { x: 0, y: 1, z: 0 }
        }}
        label="Server Room"
      />
      <Door
        roomId="office"
        position={[3.2, 0, -13.8]}
        cameraTarget={{
          position: { x: 0, y: 1.6, z: 5 },
          lookAt: { x: 0, y: 1, z: 0 }
        }}
        label="Admin Office"
      />

      {/* ========== DOOR SIGNS ========== */}
      {[
        { pos: [-3.2, 2.9, -13.7], text: 'LAB', color: '#00aaff' },
        { pos: [0, 2.9, -13.7], text: 'SERVER', color: '#ff4444' },
        { pos: [3.2, 2.9, -13.7], text: 'OFFICE', color: '#ffaa00' },
      ].map((sign, i) => (
        <group key={i} position={sign.pos}>
          <mesh>
            <boxGeometry args={[1.4, 0.35, 0.1]} />
            <meshStandardMaterial
              color="#222222"
              emissive={sign.color}
              emissiveIntensity={0.5}
            />
          </mesh>
          <pointLight intensity={0.5} distance={3} color={sign.color} />
        </group>
      ))}

      {/* Subtle dust particles */}
      <DustParticles count={40} spread={12} color="#ffeecc" />
    </group>
  );
}

export default HallwayScene;
