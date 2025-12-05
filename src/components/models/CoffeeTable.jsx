import { useGLTF } from '@react-three/drei';

/**
 * Coffee Table - Kenney Furniture Kit
 * A coffee table for waiting areas
 */
function CoffeeTable({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1, ...props }) {
  const { scene } = useGLTF('/assets/models/furniture/tableCoffee.glb');
  
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

useGLTF.preload('/assets/models/furniture/tableCoffee.glb');

export default CoffeeTable;
