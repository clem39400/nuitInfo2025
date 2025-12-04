import { useState } from 'react';
import { useThree } from '@react-three/fiber';

/**
 * Interactive Object - Base component for clickable 3D objects
 * Follows Liskov Substitution Principle - can be extended by specific objects
 * 
 * @param {Object} props
 * @param {Function} props.onClick - Click handler
 * @param {string} props.tooltip - Tooltip text on hover
 * @param {JSX.Element} props.children - 3D object to make interactive
 */
function InteractiveObject({ onClick, tooltip, children, ...props }) {
  const [hovered, setHovered] = useState(false);
  const { gl } = useThree();

  const handlePointerOver = (e) => {
    e.stopPropagation();
    setHovered(true);
    gl.domElement.style.cursor = 'pointer';
  };

  const handlePointerOut = (e) => {
    e.stopPropagation();
    setHovered(false);
    gl.domElement.style.cursor = 'default';
  };

  const handleClick = (e) => {
    e.stopPropagation();
    if (onClick) onClick(e);
  };

  return (
    <group
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      {...props}
    >
      {children}
      
      {/* Glow effect when hovered */}
      {hovered && (
        <pointLight
          position={[0, 0, 0]}
          intensity={0.5}
          distance={2}
          color="#00ff88"
        />
      )}
    </group>
  );
}

export default InteractiveObject;
