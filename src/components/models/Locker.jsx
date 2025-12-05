import React from 'react';

export default function Locker({ position = [0, 0, 0], rotation = [0, 0, 0], color = '#556677' }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Main Body */}
      <mesh position={[0, 0.9, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.35, 1.8, 0.35]} />
        <meshStandardMaterial color={color} roughness={0.5} metalness={0.4} />
      </mesh>

      {/* Door Gap/Outline */}
      <mesh position={[0, 0.9, 0.176]}>
        <planeGeometry args={[0.33, 1.75]} />
        <meshStandardMaterial color="#222" />
      </mesh>

      {/* Door */}
      <mesh position={[0, 0.9, 0.18]} castShadow receiveShadow>
        <boxGeometry args={[0.32, 1.74, 0.02]} />
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.5} />
      </mesh>

      {/* Vents (Top) */}
      <group position={[0, 1.6, 0.191]}>
        {[0, 1, 2].map((i) => (
          <mesh key={i} position={[0, -i * 0.03, 0]}>
            <planeGeometry args={[0.2, 0.01]} />
            <meshStandardMaterial color="#111" />
          </mesh>
        ))}
      </group>

      {/* Vents (Bottom) */}
      <group position={[0, 0.3, 0.191]}>
        {[0, 1, 2].map((i) => (
          <mesh key={i} position={[0, -i * 0.03, 0]}>
            <planeGeometry args={[0.2, 0.01]} />
            <meshStandardMaterial color="#111" />
          </mesh>
        ))}
      </group>

      {/* Handle/Lock */}
      <mesh position={[0.1, 1.0, 0.2]} castShadow>
        <cylinderGeometry args={[0.02, 0.02, 0.05, 16]} rotation={[Math.PI / 2, 0, 0]} />
        <meshStandardMaterial color="#888" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}
