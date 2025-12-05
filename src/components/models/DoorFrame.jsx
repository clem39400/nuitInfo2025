import { useGLTF } from '@react-three/drei';

/**
 * Doorway Frame - Kenney Furniture Kit
 * A doorway frame for room entrances
 */
function DoorFrame({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1, ...props }) {
  const { scene } = useGLTF('/assets/models/props/doorwayFront.glb');
  
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

useGLTF.preload('/assets/models/props/doorwayFront.glb');

export default DoorFrame;
