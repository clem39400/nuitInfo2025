import { useThree } from '@react-three/fiber';
import { tweenCamera } from '../../components/CameraController';
import useGameStore from '../../core/GameStateContext';

/**
 * RoomBase - Abstract base component for all rooms
 * Follows Template Method pattern - defines common structure
 * 
 * @param {Object} props
 * @param {JSX.Element} props.children - Room-specific content
 * @param {string} props.lightingPreset - Lighting configuration
 */
function RoomBase({ children, lightingPreset = 'default' }) {
  const { camera } = useThree();
  const { exitRoom } = useGameStore();

  const handleBackToHallway = () => {
    // Animate camera back to hallway
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

  // Lighting presets
  const lightingConfigs = {
    default: {
      ambient: 0.4,
      point: { intensity: 1, color: '#ffffff' }
    },
    dark: {
      ambient: 0.2,
      point: { intensity: 0.5, color: '#ff4444' }
    },
    bright: {
      ambient: 0.6,
      point: { intensity: 1.5, color: '#e8f4ff' }
    }
  };

  const lighting = lightingConfigs[lightingPreset] || lightingConfigs.default;

  return (
    <group>
      {/* Room content */}
      {children}
      
      {/* Back button (floating cube) */}
      <mesh
        position={[-4, 1.5, 4]}
        onClick={handleBackToHallway}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'default';
        }}
      >
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial
          color="#ff0088"
          emissive="#ff0088"
          emissiveIntensity={0.5}
        />
      </mesh>
      
      {/* Room lighting */}
      <ambientLight intensity={lighting.ambient} />
      <pointLight
        position={[0, 3, 0]}
        intensity={lighting.point.intensity}
        distance={10}
        color={lighting.point.color}
      />
    </group>
  );
}

export default RoomBase;
