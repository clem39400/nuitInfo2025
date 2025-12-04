import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useThree } from '@react-three/fiber';
import InteractiveObject from './InteractiveObject';
import { tweenCamera } from './CameraController';
import useGameStore from '../core/GameStateContext';

/**
 * Door component - Interactive door that triggers room transitions
 * 
 * @param {Object} props
 * @param {string} props.roomId - ID of the room this door leads to
 * @param {Array} props.position - Door position [x, y, z]
 * @param {Array} props.cameraTarget - Camera position when entering room
 * @param {string} props.label - Door label text
 */
function Door({ roomId, position, cameraTarget, label }) {
  const doorRef = useRef();
  const { camera } = useThree();
  const { enterRoom, setTransitioning } = useGameStore();

  const handleClick = () => {
    setTransitioning(true);
    
    // Animate camera into the room
    tweenCamera(
      camera,
      cameraTarget.position,
      cameraTarget.lookAt,
      2,
      () => {
        enterRoom(roomId);
      }
    );
  };

  // Gentle floating animation
  useFrame((state) => {
    if (doorRef.current) {
      doorRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime) * 0.02;
    }
  });

  return (
    <InteractiveObject onClick={handleClick} tooltip={label}>
      <group ref={doorRef} position={position}>
        {/* Door frame */}
        <mesh position={[0, 1, 0]}>
          <boxGeometry args={[1.2, 2.4, 0.1]} />
          <meshStandardMaterial
            color="#1a1a2e"
            emissive="#00ff88"
            emissiveIntensity={0.2}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
        
        {/* Door handle glow */}
        <mesh position={[0.4, 1, 0.1]}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshStandardMaterial
            color="#00ff88"
            emissive="#00ff88"
            emissiveIntensity={1}
          />
        </mesh>
      </group>
    </InteractiveObject>
  );
}

export default Door;
