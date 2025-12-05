/**
 * Static Floor - A completely static floor that never re-renders
 */

// Pre-defined floor for the hallway - wooden texture
export function HallwayFloor() {
    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
            <planeGeometry args={[12, 30]} />
            <meshStandardMaterial
                color="#5d4037"
                roughness={0.7}
                metalness={0.07}
                envMapIntensity={0.3}
            />
        </mesh>
    );
}

// Generic simple floor
export function SimpleFloor({ position, size, color }) {
    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={position} receiveShadow>
            <planeGeometry args={size} />
            <meshStandardMaterial color={color} roughness={0.8} metalness={0.1} />
        </mesh>
    );
}
