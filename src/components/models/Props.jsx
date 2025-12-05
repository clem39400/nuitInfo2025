import { useGLTF } from '@react-three/drei';

/**
 * Props Collection - Kenney Furniture Kit
 * Various decorative props for room environments
 */

// Trash Can
export function Trashcan({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1, ...props }) {
  const { scene } = useGLTF('/assets/models/props/trashcan.glb');
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

// Books Stack
export function Books({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1, ...props }) {
  const { scene } = useGLTF('/assets/models/props/books.glb');
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

// Potted Plant
export function PottedPlant({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1, ...props }) {
  const { scene } = useGLTF('/assets/models/props/pottedPlant.glb');
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

// Small Plant
export function SmallPlant({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1, ...props }) {
  const { scene } = useGLTF('/assets/models/props/plantSmall1.glb');
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

// Cardboard Box
export function CardboardBox({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1, ...props }) {
  const { scene } = useGLTF('/assets/models/props/cardboardBoxClosed.glb');
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

// Preload all props
useGLTF.preload('/assets/models/props/trashcan.glb');
useGLTF.preload('/assets/models/props/books.glb');
useGLTF.preload('/assets/models/props/pottedPlant.glb');
useGLTF.preload('/assets/models/props/plantSmall1.glb');
useGLTF.preload('/assets/models/props/cardboardBoxClosed.glb');

// Default export for convenience
export default { Trashcan, Books, PottedPlant, SmallPlant, CardboardBox };
