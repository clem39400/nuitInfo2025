import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import useRefurbishmentStore from '../core/RefurbishmentGameState';

/**
 * RefurbishmentWorkstation - A clickable PC workstation for the treasure hunt
 * Glows when it's the active station, shows completion state
 */
function RefurbishmentWorkstation({ station, onInteract }) {
  const meshRef = useRef();
  const glowRef = useRef();
  const [hovered, setHovered] = useState(false);
  
  const { isStationActive, isStationCompleted, currentStationIndex, activeMiniGame } = useRefurbishmentStore();
  const isActive = isStationActive(station.id);
  const isCompleted = isStationCompleted(station.id);
  const gameStarted = currentStationIndex !== null;
  const isMiniGameOpen = activeMiniGame !== null;
  
  // Animate the glow for active station
  useFrame((state) => {
    if (glowRef.current && isActive) {
      const pulse = Math.sin(state.clock.elapsedTime * 3) * 0.3 + 0.7;
      glowRef.current.material.emissiveIntensity = pulse;
      glowRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 2) * 0.05);
    }
    if (meshRef.current && isActive) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });
  
  const handleClick = (e) => {
    e.stopPropagation();
    if (isActive && onInteract) {
      onInteract(station.id);
    }
  };
  
  // Determine screen color based on state
  const getScreenColor = () => {
    if (isCompleted) return '#00ff88'; // Green - done!
    if (isActive) return station.color;  // Station's accent color
    return '#0066dd'; // Blue - BSOD waiting
  };
  
  return (
    <group position={station.position}>
      {/* Desk */}
      <mesh position={[0, 0.45, 0]} castShadow>
        <boxGeometry args={[1.8, 0.1, 1]} />
        <meshStandardMaterial
          color={isActive ? '#3a3a4a' : '#2a2a35'}
          metalness={0.6}
          roughness={0.4}
        />
      </mesh>
      
      {/* Desk legs */}
      {[[-0.8, -0.4], [0.8, -0.4], [-0.8, 0.4], [0.8, 0.4]].map(([x, z], j) => (
        <mesh key={j} position={[x, 0.2, z]} castShadow>
          <boxGeometry args={[0.05, 0.4, 0.05]} />
          <meshStandardMaterial color="#1a1a20" metalness={0.8} />
        </mesh>
      ))}
      
      {/* PC Tower under desk */}
      <mesh position={[0.6, 0.25, 0]} castShadow>
        <boxGeometry args={[0.25, 0.45, 0.5]} />
        <meshStandardMaterial
          color="#1a1a1a"
          metalness={0.7}
          emissive={isActive ? station.color : '#000000'}
          emissiveIntensity={isActive ? 0.3 : 0}
        />
      </mesh>
      
      {/* Power LED on PC */}
      <mesh position={[0.48, 0.35, 0.15]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshStandardMaterial
          color={isCompleted ? '#00ff88' : (isActive ? station.color : '#333333')}
          emissive={isCompleted ? '#00ff88' : (isActive ? station.color : '#111111')}
          emissiveIntensity={isActive || isCompleted ? 1 : 0.2}
        />
      </mesh>
      
      {/* Monitor */}
      <group position={[0, 0.85, -0.2]}>
        {/* Monitor bezel */}
        <mesh 
          ref={meshRef}
          castShadow
          onClick={handleClick}
          onPointerOver={(e) => {
            e.stopPropagation();
            if (isActive) {
              setHovered(true);
              document.body.style.cursor = 'pointer';
            }
          }}
          onPointerOut={(e) => {
            e.stopPropagation();
            setHovered(false);
            document.body.style.cursor = 'default';
          }}
        >
          <boxGeometry args={[1, 0.65, 0.05]} />
          <meshStandardMaterial
            color="#0a0a0a"
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>
        
        {/* Screen */}
        <mesh position={[0, 0, 0.03]} ref={glowRef}>
          <planeGeometry args={[0.9, 0.55]} />
          <meshStandardMaterial
            color={getScreenColor()}
            emissive={getScreenColor()}
            emissiveIntensity={isActive ? 0.8 : 0.4}
          />
        </mesh>
        
        {/* Monitor stand */}
        <mesh position={[0, -0.4, 0.1]} castShadow>
          <boxGeometry args={[0.1, 0.25, 0.15]} />
          <meshStandardMaterial color="#0a0a0a" metalness={0.8} />
        </mesh>
        <mesh position={[0, -0.52, 0.1]} castShadow>
          <cylinderGeometry args={[0.18, 0.18, 0.02, 16]} />
          <meshStandardMaterial color="#0a0a0a" metalness={0.8} />
        </mesh>
      </group>
      
      {/* Keyboard */}
      <mesh position={[0, 0.51, 0.25]} castShadow>
        <boxGeometry args={[0.55, 0.02, 0.2]} />
        <meshStandardMaterial color="#1a1a20" metalness={0.5} />
      </mesh>
      
      {/* Mouse */}
      <mesh position={[0.4, 0.51, 0.3]} castShadow>
        <boxGeometry args={[0.08, 0.02, 0.12]} />
        <meshStandardMaterial color="#1a1a20" metalness={0.5} />
      </mesh>
      
      {/* Glowing ring on floor for active station */}
      {isActive && (
        <>
          <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[1.2, 1.4, 32]} />
            <meshBasicMaterial 
              color={station.color} 
              transparent 
              opacity={0.6}
              side={THREE.DoubleSide}
            />
          </mesh>
          <pointLight 
            position={[0, 0.5, 0]} 
            intensity={1.5} 
            color={station.color} 
            distance={4} 
          />
        </>
      )}
      
      {/* Station icon and name label - hidden when mini-game is open */}
      {gameStarted && !isMiniGameOpen && (
        <Html
          position={[0, 1.6, 0]}
          center
          distanceFactor={6}
          occlude
          style={{ pointerEvents: 'none' }}
        >
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            animation: isActive ? 'bounce 1s ease-in-out infinite' : 'none',
          }}>
            {/* Station icon */}
            <div style={{
              fontSize: '32px',
              marginBottom: '4px',
              filter: isCompleted ? 'grayscale(0)' : (isActive ? 'none' : 'grayscale(0.8)'),
              opacity: isCompleted ? 1 : (isActive ? 1 : 0.5),
            }}>
              {isCompleted ? '✅' : station.icon}
            </div>
            
            {/* Station name */}
            <div style={{
              background: isActive 
                ? `linear-gradient(135deg, ${station.color}dd, ${station.color}88)` 
                : (isCompleted ? 'rgba(0, 255, 136, 0.8)' : 'rgba(0, 0, 0, 0.7)'),
              padding: '6px 12px',
              borderRadius: '12px',
              color: '#fff',
              fontWeight: 'bold',
              fontSize: '12px',
              fontFamily: 'monospace',
              whiteSpace: 'nowrap',
              border: `2px solid ${isActive ? station.color : (isCompleted ? '#00ff88' : '#333')}`,
              boxShadow: isActive ? `0 0 20px ${station.color}88` : 'none',
            }}>
              {station.name}
            </div>
            
            {/* Click instruction for active station */}
            {isActive && (
              <div style={{
                marginTop: '6px',
                color: station.color,
                fontSize: '11px',
                fontFamily: 'monospace',
                textShadow: `0 0 10px ${station.color}`,
              }}>
                ▼ CLIQUEZ ▼
              </div>
            )}
          </div>
        </Html>
      )}
      
      {/* Completed checkmark floating above */}
      {isCompleted && (
        <pointLight 
          position={[0, 1, 0]} 
          intensity={0.5} 
          color="#00ff88" 
          distance={3} 
        />
      )}
    </group>
  );
}

export default RefurbishmentWorkstation;
