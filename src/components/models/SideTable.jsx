import { useGLTF } from '@react-three/drei';

/**
 * Side Table with Drawers - Kenney Furniture Kit
 * A side table for offices and bedrooms
 */
function SideTable({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1, ...props }) {
  const { scene } = useGLTF('/assets/models/furniture/sideTableDrawers.glb');
  
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

useGLTF.preload('/assets/models/furniture/sideTableDrawers.glb');

export default SideTable;
