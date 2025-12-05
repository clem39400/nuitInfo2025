import { useGLTF } from '@react-three/drei';

/**
 * Bench - Kenney Furniture Kit
 * A bench for hallways and waiting areas
 */
function Bench({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1, withCushion = false, ...props }) {
  const modelPath = withCushion 
    ? '/assets/models/furniture/benchCushion.glb'
    : '/assets/models/furniture/bench.glb';
  
  const { scene } = useGLTF(modelPath);
  
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

useGLTF.preload('/assets/models/furniture/bench.glb');
useGLTF.preload('/assets/models/furniture/benchCushion.glb');

export default Bench;
