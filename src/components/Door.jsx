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
function Door({ roomId, position, rotation = [0, 0, 0], cameraTarget, label, onCustomClick }) {
  const doorRef = useRef();
  const { camera } = useThree();
  const { enterRoom, setTransitioning } = useGameStore();

  const handleClick = () => {
    if (onCustomClick) {
      onCustomClick();
      return;
    }

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
      <group ref={doorRef} position={position} rotation={rotation}>
        {/* Door outer frame - dark wood */}
        <mesh position={[0, 1.35, -0.02]}>
          <boxGeometry args={[1.4, 2.7, 0.08]} />
          <meshStandardMaterial
            color="#2a1810"
            roughness={0.6}
            metalness={0.1}
          />
        </mesh>

        {/* Door panel - main wooden door */}
        <mesh position={[0, 1.35, 0.02]}>
          <boxGeometry args={[1.2, 2.5, 0.08]} />
          <meshStandardMaterial
            color="#5a3825"
            roughness={0.5}
            metalness={0.05}
          />
        </mesh>

        {/* Door panels (decorative insets) */}
        {/* Top panel */}
        <mesh position={[0, 2.1, 0.06]}>
          <boxGeometry args={[0.9, 0.7, 0.02]} />
          <meshStandardMaterial color="#4a2815" roughness={0.4} />
        </mesh>
        {/* Middle panel */}
        <mesh position={[0, 1.2, 0.06]}>
          <boxGeometry args={[0.9, 0.7, 0.02]} />
          <meshStandardMaterial color="#4a2815" roughness={0.4} />
        </mesh>
        {/* Bottom panel */}
        <mesh position={[0, 0.4, 0.06]}>
          <boxGeometry args={[0.9, 0.5, 0.02]} />
          <meshStandardMaterial color="#4a2815" roughness={0.4} />
        </mesh>

        {/* Door window (small glass pane at top) */}
        <mesh position={[0, 2.1, 0.07]}>
          <boxGeometry args={[0.6, 0.4, 0.01]} />
          <meshStandardMaterial
            color="#112233"
            emissive="#003366"
            emissiveIntensity={0.3}
            transparent
            opacity={0.7}
            metalness={0.9}
          />
        </mesh>

        {/* Door handle - brass/gold */}
        <group position={[0.45, 1.2, 0.1]}>
          {/* Handle plate */}
          <mesh>
            <boxGeometry args={[0.06, 0.2, 0.02]} />
            <meshStandardMaterial color="#b8860b" metalness={0.9} roughness={0.2} />
          </mesh>
          {/* Handle knob */}
          <mesh position={[0.04, 0, 0.03]}>
            <sphereGeometry args={[0.04, 16, 16]} />
            <meshStandardMaterial
              color="#daa520"
              metalness={0.95}
              roughness={0.1}
              emissive="#ffaa00"
              emissiveIntensity={0.2}
            />
          </mesh>
        </group>

        {/* Subtle glow around door when hovered - indicates interactivity */}
        <pointLight position={[0, 1.35, 0.3]} intensity={0.3} color="#ffcc88" distance={2} />
      </group>
    </InteractiveObject>
  );
}

export default Door;
