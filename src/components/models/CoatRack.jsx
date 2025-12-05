import { useGLTF } from '@react-three/drei';

/**
 * Coat Rack - Kenney Furniture Kit
 * A standing coat rack for hallways
 */
function CoatRack({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1, ...props }) {
  const { scene } = useGLTF('/assets/models/props/coatRackStanding.glb');
  
  return (
    <primitive 
      object={scene.clone()} 
      position={position} 
      rotation={rotation}
      scale={scale}
      {...props}
    />
  );
}

useGLTF.preload('/assets/models/props/coatRackStanding.glb');

export default CoatRack;
