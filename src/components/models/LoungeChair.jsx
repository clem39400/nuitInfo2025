import { useGLTF } from '@react-three/drei';

/**
 * Lounge Chair - Kenney Furniture Kit
 * A comfortable lounge chair for offices and waiting areas
 */
function LoungeChair({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1, ...props }) {
  const { scene } = useGLTF('/assets/models/furniture/loungeChair.glb');
  
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

useGLTF.preload('/assets/models/furniture/loungeChair.glb');

export default LoungeChair;
