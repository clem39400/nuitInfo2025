import { useGLTF } from '@react-three/drei';

/**
 * Office Chair Model - Kenney Furniture Kit
 * A desk chair for office/lab environments
 */
function Chair({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1, variant = 'desk', ...props }) {
  const modelPath = variant === 'desk' 
    ? '/assets/models/furniture/chairDesk.glb' 
    : '/assets/models/furniture/chair.glb';
  
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

useGLTF.preload('/assets/models/furniture/chairDesk.glb');
useGLTF.preload('/assets/models/furniture/chair.glb');

export default Chair;
