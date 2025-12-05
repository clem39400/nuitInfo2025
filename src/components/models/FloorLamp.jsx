import { useGLTF } from '@react-three/drei';

/**
 * Floor Lamp - Kenney Furniture Kit
 * A floor lamp for offices and living spaces
 */
function FloorLamp({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1, lightColor = '#ffcc88', lightIntensity = 0.5, ...props }) {
  const { scene } = useGLTF('/assets/models/furniture/lampSquareFloor.glb');
  
  return (
    <group position={position} rotation={rotation} scale={scale} {...props}>
      <primitive object={scene.clone()} />
      
      {/* Add actual light from the lamp */}
      <pointLight 
        position={[0, 1.5, 0]} 
        intensity={lightIntensity} 
        color={lightColor} 
        distance={5} 
        decay={2}
      />
    </group>
  );
}

useGLTF.preload('/assets/models/furniture/lampSquareFloor.glb');

export default FloorLamp;
