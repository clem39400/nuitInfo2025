import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Simple 3D Person/NPC Component
 * Low-poly stylized characters for the school environment
 * 
 * @param {Object} props
 * @param {Array} props.position - [x, y, z] position
 * @param {number} props.rotation - Y-axis rotation in radians
 * @param {string} props.type - 'student', 'teacher', 'guide'
 * @param {string} props.skinColor - Skin tone color
 * @param {string} props.shirtColor - Shirt/top color
 * @param {string} props.pantsColor - Pants/bottom color
 * @param {string} props.hairColor - Hair color
 * @param {boolean} props.hasBackpack - Show backpack (for students)
 * @param {boolean} props.animated - Enable idle animation
 * @param {number} props.scale - Overall scale
 */
export function Person({
  position = [0, 0, 0],
  rotation = 0,
  type = 'student',
  skinColor = '#e0b89d',
  shirtColor = '#4477aa',
  pantsColor = '#444455',
  hairColor = '#3a2a1a',
  hasBackpack = false,
  animated = true,
  scale = 1,
}) {
  const groupRef = useRef();
  const headRef = useRef();
  
  // Subtle idle animation
  useFrame((state) => {
    if (!animated || !groupRef.current) return;
    
    const t = state.clock.elapsedTime;
    // Gentle breathing/swaying motion
    groupRef.current.position.y = position[1] + Math.sin(t * 2) * 0.02;
    
    if (headRef.current) {
      // Subtle head movement
      headRef.current.rotation.y = Math.sin(t * 0.5) * 0.1;
    }
  });

  // Type-specific styling
  const isTeacher = type === 'teacher' || type === 'guide';
  const bodyHeight = isTeacher ? 1.8 : 1.5;
  const headSize = 0.25;
  
  return (
    <group ref={groupRef} position={position} rotation={[0, rotation, 0]} scale={scale}>
      {/* Legs */}
      <mesh position={[-0.08, 0.35, 0]} castShadow>
        <capsuleGeometry args={[0.06, 0.5, 4, 8]} />
        <meshStandardMaterial color={pantsColor} roughness={0.8} />
      </mesh>
      <mesh position={[0.08, 0.35, 0]} castShadow>
        <capsuleGeometry args={[0.06, 0.5, 4, 8]} />
        <meshStandardMaterial color={pantsColor} roughness={0.8} />
      </mesh>
      
      {/* Shoes */}
      <mesh position={[-0.08, 0.05, 0.03]} castShadow>
        <boxGeometry args={[0.1, 0.08, 0.18]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.9} />
      </mesh>
      <mesh position={[0.08, 0.05, 0.03]} castShadow>
        <boxGeometry args={[0.1, 0.08, 0.18]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.9} />
      </mesh>
      
      {/* Body/Torso */}
      <mesh position={[0, 0.9, 0]} castShadow>
        <capsuleGeometry args={[0.15, 0.4, 4, 8]} />
        <meshStandardMaterial color={shirtColor} roughness={0.7} />
      </mesh>
      
      {/* Arms */}
      <mesh position={[-0.22, 0.85, 0]} rotation={[0, 0, 0.2]} castShadow>
        <capsuleGeometry args={[0.045, 0.35, 4, 8]} />
        <meshStandardMaterial color={shirtColor} roughness={0.7} />
      </mesh>
      <mesh position={[0.22, 0.85, 0]} rotation={[0, 0, -0.2]} castShadow>
        <capsuleGeometry args={[0.045, 0.35, 4, 8]} />
        <meshStandardMaterial color={shirtColor} roughness={0.7} />
      </mesh>
      
      {/* Hands */}
      <mesh position={[-0.28, 0.6, 0]} castShadow>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color={skinColor} roughness={0.6} />
      </mesh>
      <mesh position={[0.28, 0.6, 0]} castShadow>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color={skinColor} roughness={0.6} />
      </mesh>
      
      {/* Neck */}
      <mesh position={[0, 1.15, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.06, 0.1, 8]} />
        <meshStandardMaterial color={skinColor} roughness={0.6} />
      </mesh>
      
      {/* Head */}
      <group ref={headRef} position={[0, 1.35, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[headSize, 16, 16]} />
          <meshStandardMaterial color={skinColor} roughness={0.5} />
        </mesh>
        
        {/* Hair */}
        <mesh position={[0, 0.08, 0]} castShadow>
          <sphereGeometry args={[headSize * 0.95, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color={hairColor} roughness={0.9} />
        </mesh>
        
        {/* Eyes */}
        <mesh position={[-0.08, 0, 0.22]}>
          <sphereGeometry args={[0.025, 8, 8]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        <mesh position={[0.08, 0, 0.22]}>
          <sphereGeometry args={[0.025, 8, 8]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        {/* Pupils */}
        <mesh position={[-0.08, 0, 0.24]}>
          <sphereGeometry args={[0.012, 8, 8]} />
          <meshBasicMaterial color="#2a2a3a" />
        </mesh>
        <mesh position={[0.08, 0, 0.24]}>
          <sphereGeometry args={[0.012, 8, 8]} />
          <meshBasicMaterial color="#2a2a3a" />
        </mesh>
      </group>
      
      {/* Backpack (for students) */}
      {hasBackpack && (
        <group position={[0, 0.85, -0.2]}>
          <mesh castShadow>
            <boxGeometry args={[0.25, 0.35, 0.12]} />
            <meshStandardMaterial color="#ff6b35" roughness={0.8} />
          </mesh>
          {/* Backpack straps hint */}
          <mesh position={[-0.1, 0.1, 0.05]}>
            <boxGeometry args={[0.03, 0.2, 0.02]} />
            <meshStandardMaterial color="#cc5533" roughness={0.8} />
          </mesh>
          <mesh position={[0.1, 0.1, 0.05]}>
            <boxGeometry args={[0.03, 0.2, 0.02]} />
            <meshStandardMaterial color="#cc5533" roughness={0.8} />
          </mesh>
        </group>
      )}
      
      {/* Teacher/Guide badge or lanyard */}
      {isTeacher && (
        <group position={[0, 0.95, 0.16]}>
          {/* Lanyard */}
          <mesh>
            <cylinderGeometry args={[0.01, 0.01, 0.15, 8]} />
            <meshStandardMaterial color="#00aa55" roughness={0.5} />
          </mesh>
          {/* Badge */}
          <mesh position={[0, -0.1, 0]}>
            <boxGeometry args={[0.06, 0.08, 0.01]} />
            <meshStandardMaterial color="#00cc66" emissive="#00aa55" emissiveIntensity={0.3} />
          </mesh>
        </group>
      )}
    </group>
  );
}

/**
 * Group of students chatting together
 */
export function StudentGroup({ position = [0, 0, 0], rotation = 0 }) {
  const students = [
    { offset: [-0.4, 0, 0], rot: 0.3, skin: '#e0b89d', shirt: '#4477aa', hair: '#3a2a1a', backpack: true },
    { offset: [0.4, 0, 0], rot: -0.3, skin: '#c4956a', shirt: '#aa4455', hair: '#1a1a1a', backpack: true },
    { offset: [0, 0, 0.5], rot: Math.PI, skin: '#f5d0b5', shirt: '#558844', hair: '#8a6a4a', backpack: false },
  ];

  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {students.map((s, i) => (
        <Person
          key={i}
          position={s.offset}
          rotation={s.rot}
          skinColor={s.skin}
          shirtColor={s.shirt}
          hairColor={s.hair}
          hasBackpack={s.backpack}
          scale={0.9}
        />
      ))}
    </group>
  );
}

/**
 * Walking student animation
 */
export function WalkingStudent({
  position = [0, 0, 0],
  direction = 1, // 1 = forward, -1 = backward
  skinColor = '#e0b89d',
  shirtColor = '#5588bb',
  hairColor = '#3a2a1a',
}) {
  const groupRef = useRef();
  
  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    
    // Bob up and down while walking
    groupRef.current.position.y = position[1] + Math.abs(Math.sin(t * 4)) * 0.03;
  });

  return (
    <group ref={groupRef} position={position}>
      <Person
        position={[0, 0, 0]}
        rotation={direction > 0 ? 0 : Math.PI}
        skinColor={skinColor}
        shirtColor={shirtColor}
        hairColor={hairColor}
        hasBackpack={true}
        animated={false}
        scale={0.9}
      />
    </group>
  );
}

/**
 * Teacher or guide figure
 */
export function Teacher({
  position = [0, 0, 0],
  rotation = 0,
  skinColor = '#d8a87a',
  shirtColor = '#334455',
  pantsColor = '#2a2a35',
  hairColor = '#5a4a3a',
}) {
  return (
    <Person
      position={position}
      rotation={rotation}
      type="teacher"
      skinColor={skinColor}
      shirtColor={shirtColor}
      pantsColor={pantsColor}
      hairColor={hairColor}
      hasBackpack={false}
      scale={1.1}
    />
  );
}

export default Person;
