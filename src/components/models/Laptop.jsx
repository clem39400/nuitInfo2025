import { useGLTF } from '@react-three/drei';

/**
 * Laptop Model - Kenney Furniture Kit
 * A laptop for workstation setups
 */
function Laptop({ 
  position = [0, 0, 0], 
  rotation = [0, 0, 0], 
  scale = 1, 
  screenColor = '#00aaff',
  glowing = true,
  ...props 
}) {
  const { scene } = useGLTF('/assets/models/tech/laptop.glb');
  
  return (
    <group position={position} rotation={rotation} scale={scale} {...props}>
      <primitive object={scene.clone()} />
      
      {/* Screen glow effect */}
      {glowing && (
        <pointLight 
          position={[0, 0.15, 0]} 
          intensity={0.4} 
          color={screenColor} 
          distance={1} 
          decay={2}
        />
      )}
    </group>
  );
}

useGLTF.preload('/assets/models/tech/laptop.glb');

export default Laptop;
