import RoomBase from './RoomBase';
import { DustParticles } from '../../effects/AtmosphericEffects';
import { ReflectiveFloor } from '../../components/Environment';
import { Float, Text } from '@react-three/drei';
import useGameStore from '../../core/GameStateContext';
// Real 3D Models from Kenney Furniture Kit
import Laptop from '../../components/models/Laptop';
import Desk from '../../components/models/Desk';
import { Trashcan, CardboardBox } from '../../components/models/Props';

/**
 * Server Room - Hardware & E-Waste theme
 * Dark room with red emergency lighting and server racks
 * 
 * Integration point for puzzle developers:
 * - Repair Laptop puzzle should be placed at position [0, 1, 0]
 * - Call completePuzzle('server') when puzzle is solved
 */
function ServerRoom() {
  const { openLinuxGame } = useGameStore();

  return (
    <RoomBase lightingPreset="server">
      {/* Dark reflective floor */}
      <ReflectiveFloor
        position={[0, 0, 0]}
        size={[14, 14]}
        color="#080808"
        roughness={0.1}
        metalness={0.95}
        mirror={0.6}
      />

      {/* Hot air particles */}
      <DustParticles count={40} spread={8} color="#ff6644" />

      {/* Dark walls */}
      {/* Back wall */}
      <mesh position={[0, 2.5, -7]}>
        <boxGeometry args={[14, 5, 0.2]} />
        <meshStandardMaterial color="#0a0808" roughness={0.9} />
      </mesh>
      {/* Left wall */}
      <mesh position={[-7, 2.5, 0]}>
        <boxGeometry args={[0.2, 5, 14]} />
        <meshStandardMaterial color="#0a0808" roughness={0.9} />
      </mesh>
      {/* Right wall */}
      <mesh position={[7, 2.5, 0]}>
        <boxGeometry args={[0.2, 5, 14]} />
        <meshStandardMaterial color="#0a0808" roughness={0.9} />
      </mesh>
      {/* Front wall - closes off the room entrance */}
      <mesh position={[0, 2.5, 7]}>
        <boxGeometry args={[14, 5, 0.2]} />
        <meshStandardMaterial color="#0a0808" roughness={0.9} />
      </mesh>

      {/* Ceiling with exposed pipes/cables */}
      <mesh position={[0, 5, 0]}>
        <boxGeometry args={[14, 0.2, 14]} />
        <meshStandardMaterial color="#050505" />
      </mesh>

      {/* Server racks - industrial look */}
      {Array.from({ length: 5 }).map((_, i) => (
        <group key={i} position={[-4 + i * 2, 0, -4]}>
          {/* Rack frame */}
          <mesh position={[0, 1.2, 0]} castShadow>
            <boxGeometry args={[0.65, 2.4, 0.8]} />
            <meshStandardMaterial
              color="#0a0a0a"
              metalness={0.9}
              roughness={0.3}
            />
          </mesh>

          {/* Server units */}
          {Array.from({ length: 6 }).map((_, j) => (
            <group key={j} position={[0, 0.3 + j * 0.35, 0.41]}>
              {/* Server face */}
              <mesh>
                <boxGeometry args={[0.58, 0.28, 0.02]} />
                <meshStandardMaterial
                  color="#1a1a1a"
                  metalness={0.8}
                  roughness={0.3}
                />
              </mesh>

              {/* Status LED */}
              <mesh position={[0.22, 0, 0.01]}>
                <circleGeometry args={[0.02, 16]} />
                <meshBasicMaterial
                  color={Math.random() > 0.3 ? "#00ff00" : "#ff0000"}
                />
              </mesh>

              {/* Blinking effect light */}
              {Math.random() > 0.5 && (
                <pointLight
                  position={[0.22, 0, 0.1]}
                  intensity={0.2}
                  distance={0.5}
                  color={Math.random() > 0.5 ? "#00ff00" : "#ff0000"}
                />
              )}
            </group>
          ))}
        </group>
      ))}

      {/* E-Waste pile with Real 3D Models */}
      <group position={[4, 0, 3]}>
        {/* Real Trashcan - replaces procedural box */}
        <Trashcan position={[0, 0, 0]} scale={2.5} />
        
        {/* "TRASH" label */}
        <mesh position={[0, 1.2, 0.5]}>
          <planeGeometry args={[1, 0.3]} />
          <meshBasicMaterial color="#ff4444" />
        </mesh>
        
        {/* Discarded Real Laptops */}
        <Laptop position={[-0.3, 0.8, 0.2]} rotation={[0.2, 0.5, 0.1]} scale={2} glowing={false} />
        <Laptop position={[0.2, 1.0, -0.1]} rotation={[-0.1, -0.8, 0.15]} scale={2} glowing={false} />
        <Laptop position={[0, 1.2, 0.3]} rotation={[0.3, 1.2, -0.1]} scale={2} glowing={false} />
        
        {/* Cardboard boxes with e-waste */}
        <CardboardBox position={[-1.2, 0, 0.5]} rotation={[0, 0.3, 0]} scale={2} />
        <CardboardBox position={[-1.5, 0, -0.3]} rotation={[0, -0.2, 0]} scale={2} />
      </group>

      {/* Repair bench - puzzle location */}
      <group position={[0, 0, 2]}>
        {/* Workbench */}
        <mesh position={[0, 0.5, 0]} castShadow>
          <boxGeometry args={[2, 0.1, 1]} />
          <meshStandardMaterial
            color="#3a3a3a"
            metalness={0.4}
            roughness={0.6}
          />
        </mesh>

        {/* Bench legs */}
        {[[-0.9, -0.4], [0.9, -0.4], [-0.9, 0.4], [0.9, 0.4]].map(([x, z], j) => (
          <mesh key={j} position={[x, 0.22, z]} castShadow>
            <boxGeometry args={[0.08, 0.44, 0.08]} />
            <meshStandardMaterial color="#2a2a2a" />
          </mesh>
        ))}

        {/* Laptop to repair - glowing highlight */}
        <group
          position={[0, 0.6, 0]}
          onClick={(e) => {
            e.stopPropagation();
            openLinuxGame();
          }}
          onPointerOver={() => document.body.style.cursor = 'pointer'}
          onPointerOut={() => document.body.style.cursor = 'default'}
        >
          {/* Floating Label */}
          <Float speed={2} rotationIntensity={0} floatIntensity={0.5}>
            <Text
              position={[0, 0.4, 0]}
              fontSize={0.15}
              color="#ff8800"
              anchorX="center"
              anchorY="middle"
              outlineWidth={0.01}
              outlineColor="#000000"
            >
              ACCÉDER AU TERMINAL
            </Text>
            <Text
              position={[0, 0.25, 0]}
              fontSize={0.08}
              color="#ffffff"
              anchorX="center"
              anchorY="middle"
            >
              (Cliquer pour réparer)
            </Text>
          </Float>

          <mesh castShadow>
            <boxGeometry args={[0.4, 0.03, 0.28]} />
            <meshStandardMaterial
              color="#1a1a1a"
              emissive="#ff8800"
              emissiveIntensity={0.2}
              metalness={0.8}
            />
          </mesh>

          {/* Screen part */}
          <mesh position={[0, 0.15, -0.12]} rotation={[-0.3, 0, 0]} castShadow>
            <boxGeometry args={[0.38, 0.25, 0.01]} />
            <meshStandardMaterial
              color="#0a0a0a"
              emissive="#ff4400"
              emissiveIntensity={0.3}
            />
          </mesh>

          <pointLight position={[0, 0.3, 0]} intensity={1} color="#ff8800" distance={2} decay={2} />
        </group>

        {/* Tools scattered on bench */}
        <mesh position={[0.6, 0.52, 0.2]} rotation={[0, 0.5, 0]}>
          <boxGeometry args={[0.15, 0.02, 0.02]} />
          <meshStandardMaterial color="#888888" metalness={0.9} />
        </mesh>
      </group>

      {/* Red emergency lighting */}
      <pointLight position={[0, 4.5, 0]} intensity={2} color="#ff0000" distance={12} />
      <pointLight position={[-5, 2, -5]} intensity={0.5} color="#ff2200" distance={6} />
      <pointLight position={[5, 2, -5]} intensity={0.5} color="#ff2200" distance={6} />

      {/* Ambient heat glow */}
      <ambientLight intensity={0.1} color="#ff4422" />
    </RoomBase>
  );
}

export default ServerRoom;
