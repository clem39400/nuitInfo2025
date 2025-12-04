import * as THREE from 'three';

/**
 * CityBackdrop - Reusable city skyline component
 * Shows surrounding buildings for all scenes - positioned CLOSE for visibility
 */
function CityBackdrop({ position = [0, 0, -20] }) {
  return (
    <group position={position}>
      {/* ========== LEFT SIDE BUILDINGS ========== */}
      {/* Apartment building 1 - CLOSE LEFT */}
      <group position={[-18, 0, 8]}>
        <mesh position={[0, 6, 0]}>
          <boxGeometry args={[10, 12, 8]} />
          <meshStandardMaterial color="#d4c4a8" />
        </mesh>
        {/* Windows grid */}
        {[0, 1, 2, 3, 4].map((row) =>
          [0, 1, 2, 3].map((col) => (
            <mesh key={`l1-${row}-${col}`} position={[-3.5 + col * 2.3, 2 + row * 2.2, 4.1]}>
              <planeGeometry args={[1.5, 1.8]} />
              <meshStandardMaterial color="#5090c0" emissive="#aaddff" emissiveIntensity={0.15} />
            </mesh>
          ))
        )}
        {/* Roof */}
        <mesh position={[0, 12.3, 0]}>
          <boxGeometry args={[10.5, 0.6, 8.5]} />
          <meshStandardMaterial color="#8b6b4a" />
        </mesh>
      </group>

      {/* Tall building LEFT */}
      <group position={[-28, 0, 5]}>
        <mesh position={[0, 9, 0]}>
          <boxGeometry args={[8, 18, 6]} />
          <meshStandardMaterial color="#c8b89a" />
        </mesh>
        {[0, 1, 2, 3, 4, 5, 6, 7].map((row) =>
          [0, 1, 2].map((col) => (
            <mesh key={`l2-${row}-${col}`} position={[-2.2 + col * 2.2, 1.5 + row * 2.1, 3.1]}>
              <planeGeometry args={[1.3, 1.6]} />
              <meshStandardMaterial color="#4080b0" />
            </mesh>
          ))
        )}
        <mesh position={[0, 18.2, 0]}>
          <boxGeometry args={[8.3, 0.5, 6.3]} />
          <meshStandardMaterial color="#7a5a3a" />
        </mesh>
      </group>

      {/* ========== RIGHT SIDE BUILDINGS ========== */}
      {/* Modern building RIGHT */}
      <group position={[18, 0, 8]}>
        <mesh position={[0, 5, 0]}>
          <boxGeometry args={[9, 10, 7]} />
          <meshStandardMaterial color="#e0d8c8" />
        </mesh>
        {[0, 1, 2, 3].map((row) =>
          [0, 1, 2, 3].map((col) => (
            <mesh key={`r1-${row}-${col}`} position={[-3 + col * 2, 1.5 + row * 2.2, 3.6]}>
              <planeGeometry args={[1.4, 1.7]} />
              <meshStandardMaterial color="#6098c0" emissive="#bbddff" emissiveIntensity={0.1} />
            </mesh>
          ))
        )}
        <mesh position={[0, 10.2, 0]}>
          <boxGeometry args={[9.3, 0.5, 7.3]} />
          <meshStandardMaterial color="#9a7a5a" />
        </mesh>
      </group>

      {/* Tall building RIGHT */}
      <group position={[28, 0, 5]}>
        <mesh position={[0, 8, 0]}>
          <boxGeometry args={[7, 16, 5]} />
          <meshStandardMaterial color="#dcd0bc" />
        </mesh>
        {[0, 1, 2, 3, 4, 5, 6].map((row) => (
          <mesh key={`r2-${row}`} position={[0, 1.5 + row * 2.1, 2.6]}>
            <planeGeometry args={[5, 1.6]} />
            <meshStandardMaterial color="#5088b8" />
          </mesh>
        ))}
        <mesh position={[0, 16.2, 0]}>
          <boxGeometry args={[7.3, 0.5, 5.3]} />
          <meshStandardMaterial color="#8a6a4a" />
        </mesh>
      </group>

      {/* ========== BACKGROUND ROW ========== */}
      <mesh position={[-10, 7, -8]}>
        <boxGeometry args={[8, 14, 5]} />
        <meshStandardMaterial color="#b8a890" />
      </mesh>
      <mesh position={[8, 5, -8]}>
        <boxGeometry args={[7, 10, 5]} />
        <meshStandardMaterial color="#c0b0a0" />
      </mesh>
      <mesh position={[0, 4, -12]}>
        <boxGeometry args={[14, 8, 5]} />
        <meshStandardMaterial color="#d0c0b0" />
      </mesh>
      
      {/* Far background buildings */}
      <mesh position={[-22, 6, -15]}>
        <boxGeometry args={[10, 12, 4]} />
        <meshStandardMaterial color="#c8c0b0" />
      </mesh>
      <mesh position={[22, 8, -15]}>
        <boxGeometry args={[9, 16, 4]} />
        <meshStandardMaterial color="#bab0a0" />
      </mesh>
    </group>
  );
}

export default CityBackdrop;
