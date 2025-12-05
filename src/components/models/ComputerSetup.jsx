import { useGLTF } from '@react-three/drei';

/**
 * Computer Setup Model - Kenney Furniture Kit
 * A complete computer setup with monitor, keyboard, and mouse
 */
function ComputerSetup({ 
  position = [0, 0, 0], 
  rotation = [0, 0, 0], 
  scale = 1, 
  showKeyboard = true,
  showMouse = true,
  screenEmissive = '#00ff00',
  screenEmissiveIntensity = 0.3,
  ...props 
}) {
  const { scene: monitorScene } = useGLTF('/assets/models/tech/computerScreen.glb');
  const { scene: keyboardScene } = useGLTF('/assets/models/tech/computerKeyboard.glb');
  const { scene: mouseScene } = useGLTF('/assets/models/tech/computerMouse.glb');
  
  return (
    <group position={position} rotation={rotation} scale={scale} {...props}>
      {/* Monitor */}
      <primitive 
        object={monitorScene.clone()} 
        position={[0, 0, 0]}
      />
      
      {/* Keyboard */}
      {showKeyboard && (
        <primitive 
          object={keyboardScene.clone()} 
          position={[0, 0, 0.3]}
        />
      )}
      
      {/* Mouse */}
      {showMouse && (
        <primitive 
          object={mouseScene.clone()} 
          position={[0.25, 0, 0.3]}
        />
      )}
      
      {/* Screen glow effect */}
      <pointLight 
        position={[0, 0.3, 0.1]} 
        intensity={0.3} 
        color={screenEmissive} 
        distance={1.5} 
        decay={2}
      />
    </group>
  );
}

useGLTF.preload('/assets/models/tech/computerScreen.glb');
useGLTF.preload('/assets/models/tech/computerKeyboard.glb');
useGLTF.preload('/assets/models/tech/computerMouse.glb');

export default ComputerSetup;
