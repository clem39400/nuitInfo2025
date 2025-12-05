import { useGLTF } from '@react-three/drei';

/**
 * Wall Lamp - Kenney Furniture Kit
 * A wall-mounted lamp with integrated light source
 */
function WallLamp({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1, lightColor = '#ffeecc', lightIntensity = 0.5, ...props }) {
  const { scene } = useGLTF('/assets/models/props/lampWall.glb');
  
  return (
    <group position={position} rotation={rotation} scale={scale} {...props}>
      <primitive object={scene.clone()} />
      
      {/* Warm light emanating from the lamp */}
      <pointLight 
        position={[0, 0, 0.2]} 
        intensity={lightIntensity} 
        color={lightColor} 
        distance={4} 
        decay={2}
      />
    </group>
  );
}

useGLTF.preload('/assets/models/props/lampWall.glb');

export default WallLamp;
