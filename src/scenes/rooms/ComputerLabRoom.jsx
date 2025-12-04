import RoomBase from './RoomBase';
import { ScreenGlow, DustParticles, FlickeringLight } from '../../effects/AtmosphericEffects';
import { ReflectiveFloor } from '../../components/Environment';

/**
 * Computer Lab Room - Software Freedom theme
 * Rows of computers showing Blue Screen of Death
 * 
 * Integration point for puzzle developers:
 * - Install Linux puzzle should be placed at position [0, 1, -2]
 * - Call completePuzzle('lab') when puzzle is solved
 */
function ComputerLabRoom() {
  return (
    <RoomBase lightingPreset="lab">
      {/* Reflective floor */}
      <ReflectiveFloor
        position={[0, 0, 0]}
        size={[14, 14]}
        color="#0a0a15"
        roughness={0.15}
        metalness={0.85}
        mirror={0.5}
      />
      
      {/* Dust particles */}
      <DustParticles count={60} spread={10} color="#8899aa" />
      
      {/* Walls */}
      <mesh position={[0, 2.5, -7]}>
        <boxGeometry args={[14, 5, 0.2]} />
        <meshStandardMaterial color="#1a1a25" roughness={0.8} />
      </mesh>
      <mesh position={[-7, 2.5, 0]}>
        <boxGeometry args={[0.2, 5, 14]} />
        <meshStandardMaterial color="#1a1a25" roughness={0.8} />
      </mesh>
      <mesh position={[7, 2.5, 0]}>
        <boxGeometry args={[0.2, 5, 14]} />
        <meshStandardMaterial color="#1a1a25" roughness={0.8} />
      </mesh>
      
      {/* Ceiling with lights */}
      <mesh position={[0, 5, 0]}>
        <boxGeometry args={[14, 0.2, 14]} />
        <meshStandardMaterial color="#0d0d12" />
      </mesh>
      <FlickeringLight position={[-3, 4.5, -2]} intensity={1.5} />
      <FlickeringLight position={[3, 4.5, -2]} intensity={1.5} />
      
      {/* Rows of computer desks with BSOD screens */}
      {Array.from({ length: 9 }).map((_, i) => {
        const row = Math.floor(i / 3);
        const col = i % 3;
        return (
          <group key={i} position={[-4 + col * 4, 0, -4 + row * 3]}>
            {/* Modern desk */}
            <mesh position={[0, 0.45, 0]} castShadow>
              <boxGeometry args={[1.6, 0.08, 0.8]} />
              <meshStandardMaterial
                color="#2a2a35"
                metalness={0.6}
                roughness={0.4}
              />
            </mesh>
            
            {/* Desk legs */}
            {[[-0.7, -0.3], [0.7, -0.3], [-0.7, 0.3], [0.7, 0.3]].map(([x, z], j) => (
              <mesh key={j} position={[x, 0.2, z]} castShadow>
                <boxGeometry args={[0.04, 0.4, 0.04]} />
                <meshStandardMaterial color="#1a1a20" metalness={0.8} />
              </mesh>
            ))}
            
            {/* Monitor with BSOD */}
            <group position={[0, 0.75, -0.15]}>
              {/* Monitor bezel */}
              <mesh castShadow>
                <boxGeometry args={[0.9, 0.55, 0.04]} />
                <meshStandardMaterial
                  color="#0a0a0a"
                  metalness={0.9}
                  roughness={0.2}
                />
              </mesh>
              
              {/* Screen with BSOD glow */}
              <ScreenGlow
                position={[0, 0, 0.025]}
                size={[0.82, 0.47]}
                color="#0066dd"
                intensity={0.6}
              />
              
              {/* Monitor stand */}
              <mesh position={[0, -0.35, 0.1]} castShadow>
                <boxGeometry args={[0.08, 0.2, 0.15]} />
                <meshStandardMaterial color="#0a0a0a" metalness={0.8} />
              </mesh>
              <mesh position={[0, -0.45, 0.1]} castShadow>
                <cylinderGeometry args={[0.15, 0.15, 0.02, 16]} />
                <meshStandardMaterial color="#0a0a0a" metalness={0.8} />
              </mesh>
            </group>
            
            {/* Keyboard */}
            <mesh position={[0, 0.5, 0.2]} castShadow>
              <boxGeometry args={[0.5, 0.02, 0.18]} />
              <meshStandardMaterial color="#1a1a20" metalness={0.5} />
            </mesh>
          </group>
        );
      })}
      
      {/* USB Linux Install placeholder - glowing pedestal */}
      <group position={[0, 0.5, 3]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.4, 0.5, 0.3, 32]} />
          <meshStandardMaterial
            color="#1a1a25"
            emissive="#00ff88"
            emissiveIntensity={0.3}
            metalness={0.8}
          />
        </mesh>
        
        {/* USB drive placeholder */}
        <mesh position={[0, 0.3, 0]}>
          <boxGeometry args={[0.15, 0.25, 0.05]} />
          <meshStandardMaterial
            color="#222222"
            emissive="#00ff88"
            emissiveIntensity={0.5}
          />
        </mesh>
        
        <pointLight position={[0, 0.5, 0]} intensity={0.8} color="#00ff88" distance={3} />
      </group>
      
      {/* Ambient blue glow from all screens */}
      <pointLight position={[0, 2, 0]} intensity={0.5} color="#0066dd" distance={10} />
    </RoomBase>
  );
}

export default ComputerLabRoom;
