import { useGLTF } from '@react-three/drei';

/**
 * Rug - Kenney Furniture Kit
 * Floor rugs for hallways and rooms
 */

export function RectangleRug({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1, ...props }) {
  const { scene } = useGLTF('/assets/models/props/rugRectangle.glb');
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

export function Doormat({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1, ...props }) {
  const { scene } = useGLTF('/assets/models/props/rugDoormat.glb');
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

useGLTF.preload('/assets/models/props/rugRectangle.glb');
useGLTF.preload('/assets/models/props/rugDoormat.glb');

export default { RectangleRug, Doormat };
