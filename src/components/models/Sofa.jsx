import { useGLTF } from '@react-three/drei';

/**
 * Sofa - Kenney Furniture Kit
 * A modern design sofa for waiting areas
 */
function Sofa({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1, ...props }) {
  const { scene } = useGLTF('/assets/models/furniture/loungeDesignSofa.glb');
  
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

useGLTF.preload('/assets/models/furniture/loungeDesignSofa.glb');

export default Sofa;
