import { useGLTF } from '@react-three/drei';

/**
 * Bookcase - Kenney Furniture Kit
 * A bookcase for offices and libraries
 */
function Bookcase({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1, ...props }) {
  const { scene } = useGLTF('/assets/models/furniture/bookcaseClosed.glb');
  
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

useGLTF.preload('/assets/models/furniture/bookcaseClosed.glb');

export default Bookcase;
