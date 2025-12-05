import { useGLTF } from '@react-three/drei';

/**
 * Office Desk Model - Kenney Furniture Kit
 * A simple desk for office/lab environments
 */
function Desk({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1, ...props }) {
  const { scene } = useGLTF('/assets/models/furniture/desk.glb');
  
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

useGLTF.preload('/assets/models/furniture/desk.glb');

export default Desk;
