import RoomBase from './RoomBase';
import { DustParticles } from '../../effects/AtmosphericEffects';
import { ReflectiveFloor } from '../../components/Environment';

/**
 * Server Room - Hardware & E-Waste theme
 * Dark room with red emergency lighting and server racks
 * 
 * Integration point for puzzle developers:
 * - Repair Laptop puzzle should be placed at position [0, 1, 0]
 * - Call completePuzzle('server') when puzzle is solved
 */
function ServerRoom() {
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
      <mesh position={[0, 2.5, -7]}>
        <boxGeometry args={[14, 5, 0.2]} />
        <meshStandardMaterial color="#0a0808" roughness={0.9} />
      </mesh>
      <mesh position={[-7, 2.5, 0]}>
        <boxGeometry args={[0.2, 5, 14]} />
        <meshStandardMaterial color="#0a0808" roughness={0.9} />
      </mesh>
      <mesh position={[7, 2.5, 0]}>
        <boxGeometry args={[0.2, 5, 14]} />
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
      
      {/* E-Waste pile with "good" computers marked TRASH */}
      <group position={[4, 0, 3]}>
        {/* Trash bin */}
        <mesh position={[0, 0.5, 0]} castShadow>
          <boxGeometry args={[1.5, 1, 1.2]} />
          <meshStandardMaterial
            color="#333333"
            metalness={0.6}
            roughness={0.5}
          />
        </mesh>
        
        {/* "TRASH" label */}
        <mesh position={[0, 0.8, 0.61]}>
          <planeGeometry args={[1, 0.3]} />
          <meshBasicMaterial color="#ff4444" />
        </mesh>
        
        {/* Discarded laptops/computers */}
        {Array.from({ length: 4 }).map((_, i) => (
          <mesh
            key={i}
            position={[
              (Math.random() - 0.5) * 0.8,
              1 + i * 0.15,
              (Math.random() - 0.5) * 0.6
            ]}
            rotation={[
              (Math.random() - 0.5) * 0.5,
              Math.random() * Math.PI,
              (Math.random() - 0.5) * 0.5
            ]}
            castShadow
          >
            <boxGeometry args={[0.35, 0.03, 0.25]} />
            <meshStandardMaterial
              color="#2a2a2a"
              metalness={0.5}
            />
          </mesh>
        ))}
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
        <group position={[0, 0.6, 0]}>
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
          
          <pointLight position={[0, 0.3, 0]} intensity={0.5} color="#ff8800" distance={2} />
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
