import { useRef, useMemo, useLayoutEffect } from 'react';
import * as THREE from 'three';

/**
 * Instanced Vegetation for GateScene
 * Uses InstancedMesh to render hundreds of objects with single draw calls
 */

// ========== DATA DEFINITIONS ==========

// Tree positions
const TREE_DATA = [
    // Left side
    { pos: [-8, 0, -5], scale: 1, type: 'type1' },
    { pos: [-10, 0, 3], scale: 0.8, type: 'type2' },
    // Right side
    { pos: [8, 0, -5], scale: 1.1, type: 'type1' },
    { pos: [10, 0, 2], scale: 0.9, type: 'type2' },
    // Background forest (generated)
    ...Array.from({ length: 15 }).map((_, i) => ({
        pos: [-35 + i * 5, 0, -28 + Math.random() * 2],
        scale: 1 + Math.random() * 0.5,
        type: 'forest'
    }))
];

// Bush positions
const BUSH_DATA = [
    // Mid-distance layer
    ...Array.from({ length: 20 }).map((_, i) => ({
        pos: [-28 + i * 3 + Math.random(), 0, -22 + Math.random() - 0.5],
        scale: 0.8 + Math.random() * 0.5,
        color: `hsl(${115 + Math.random() * 15}, 45%, ${25 + Math.random() * 10}%)`
    })),
    // Decorative shrubs
    { pos: [-18, 0, -18], scale: 1.2 },
    { pos: [-12, 0, -18], scale: 1.2 },
    { pos: [12, 0, -18], scale: 1.2 },
    { pos: [18, 0, -18], scale: 1.2 },
    // Hedges along path
    ...Array.from({ length: 10 }).map((_, i) => ({
        pos: [-3.5, 0.4, -8 + i],
        scale: 0.8,
        type: 'hedge'
    })),
    ...Array.from({ length: 10 }).map((_, i) => ({
        pos: [3.5, 0.4, -8 + i],
        scale: 0.8,
        type: 'hedge'
    }))
];

// Flower positions
const FLOWER_DATA = [
    // Left bed
    ...[0, 0.6, 1.2, 1.8].map((x, i) => ({
        pos: [-5 + x, 0.15, -2],
        color: ['#ff6b6b', '#feca57', '#ff9ff3', '#54a0ff'][i]
    })),
    // Right bed
    ...[0, 0.6, 1.2, 1.8].map((x, i) => ({
        pos: [4 + x, 0.15, -2],
        color: ['#54a0ff', '#ff6b6b', '#feca57', '#ff9ff3'][i]
    }))
];

// Window positions (simplified for instancing)
const WINDOW_DATA = [
    // Building 1 (Left)
    ...[0, 1, 2, 3].flatMap(row => [0, 1, 2].map(col => ({
        pos: [-20 - 2.5 + col * 2.5, 2 + row * 2, -12 + 3.1],
        size: [1.2, 1.5],
        color: "#4a7b9a",
        emissive: "#5588aa"
    }))),
    // Building 2 (Left Back)
    ...[0, 1, 2, 3, 4, 5].flatMap(row => [0, 1].map(col => ({
        pos: [-28 - 1.2 + col * 2.4, 1.5 + row * 2, -8 + 2.6],
        size: [1, 1.4],
        color: "#5a9ed4",
        emissive: "#5a9ed4"
    }))),
    // Building 3 (Right)
    ...[0, 1, 2].flatMap(row => [0, 1, 2].map(col => ({
        pos: [20 - 2 + col * 2, 1.5 + row * 2.2, -12 + 2.6],
        size: [1.4, 1.6],
        color: "#87b8d8",
        emissive: "#aaddff"
    }))),
    // School Building
    ...Array.from({ length: 8 }).map((_, i) => ({
        pos: [-10 + i * 2.8, 4.5, -15 + 0.3],
        size: [1.2, 1.8],
        color: "#2a2a3a",
        emissive: "#886633"
    }))
];

// ========== COMPONENTS ==========

export function VegetationInstances() {
    // Refs for InstancedMeshes
    const trunkRef = useRef();
    const crownRef = useRef();
    const bushRef = useRef();
    const flowerRef = useRef();

    // Temporary objects for calculations
    const tempObject = useMemo(() => new THREE.Object3D(), []);
    const tempColor = useMemo(() => new THREE.Color(), []);

    useLayoutEffect(() => {
        // --- Setup Trees ---
        if (trunkRef.current && crownRef.current) {
            TREE_DATA.forEach((data, i) => {
                const { pos, scale } = data;

                // Trunk
                tempObject.position.set(pos[0], pos[1] + 1.5 * scale, pos[2]);
                tempObject.scale.set(scale, scale, scale);
                tempObject.rotation.set(0, Math.random() * Math.PI, 0);
                tempObject.updateMatrix();
                trunkRef.current.setMatrixAt(i, tempObject.matrix);

                // Crown
                tempObject.position.set(pos[0], pos[1] + 4 * scale, pos[2]);
                tempObject.scale.set(scale, scale, scale);
                tempObject.updateMatrix();
                crownRef.current.setMatrixAt(i, tempObject.matrix);

                // Color variation for crowns
                if (data.type === 'forest') {
                    tempColor.setHSL(110 / 360 + Math.random() * 0.05, 0.5, 0.2 + Math.random() * 0.1);
                } else {
                    tempColor.set(data.type === 'type2' ? "#3d7a2e" : "#2d6a1e");
                }
                crownRef.current.setColorAt(i, tempColor);
            });
            trunkRef.current.instanceMatrix.needsUpdate = true;
            crownRef.current.instanceMatrix.needsUpdate = true;
            if (crownRef.current.instanceColor) crownRef.current.instanceColor.needsUpdate = true;
        }

        // --- Setup Bushes ---
        if (bushRef.current) {
            BUSH_DATA.forEach((data, i) => {
                const { pos, scale, color } = data;
                tempObject.position.set(pos[0], pos[1] + (data.type === 'hedge' ? 0.4 : 1), pos[2]);

                if (data.type === 'hedge') {
                    // Hedges are boxes in original, but spheres are cheaper/smoother for mass rendering
                    // Let's stick to spheres for uniformity or use a different geometry if needed.
                    // For optimization, using spheres for all bushes is fine.
                    tempObject.scale.set(scale, scale, scale);
                } else {
                    tempObject.scale.set(scale, scale, scale);
                }

                tempObject.updateMatrix();
                bushRef.current.setMatrixAt(i, tempObject.matrix);

                if (color) tempColor.set(color);
                else tempColor.set("#3a6a30");
                bushRef.current.setColorAt(i, tempColor);
            });
            bushRef.current.instanceMatrix.needsUpdate = true;
            if (bushRef.current.instanceColor) bushRef.current.instanceColor.needsUpdate = true;
        }

        // --- Setup Flowers ---
        if (flowerRef.current) {
            FLOWER_DATA.forEach((data, i) => {
                const { pos, color } = data;
                tempObject.position.set(pos[0], pos[1], pos[2]);
                tempObject.scale.set(1, 1, 1);
                tempObject.updateMatrix();
                flowerRef.current.setMatrixAt(i, tempObject.matrix);

                tempColor.set(color);
                flowerRef.current.setColorAt(i, tempColor);
            });
            flowerRef.current.instanceMatrix.needsUpdate = true;
            if (flowerRef.current.instanceColor) flowerRef.current.instanceColor.needsUpdate = true;
        }
    }, []);

    return (
        <group>
            {/* Tree Trunks */}
            <instancedMesh ref={trunkRef} args={[null, null, TREE_DATA.length]} castShadow receiveShadow>
                <cylinderGeometry args={[0.2, 0.3, 4, 8]} />
                <meshStandardMaterial color="#5a3a20" roughness={0.9} />
            </instancedMesh>

            {/* Tree Crowns */}
            <instancedMesh ref={crownRef} args={[null, null, TREE_DATA.length]} castShadow receiveShadow>
                <sphereGeometry args={[2, 12, 12]} />
                <meshStandardMaterial roughness={0.8} />
            </instancedMesh>

            {/* Bushes */}
            <instancedMesh ref={bushRef} args={[null, null, BUSH_DATA.length]} castShadow receiveShadow>
                <sphereGeometry args={[1, 8, 8]} />
                <meshStandardMaterial roughness={0.9} />
            </instancedMesh>

            {/* Flowers */}
            <instancedMesh ref={flowerRef} args={[null, null, FLOWER_DATA.length]}>
                <sphereGeometry args={[0.15, 6, 6]} />
                <meshStandardMaterial roughness={0.6} />
            </instancedMesh>
        </group>
    );
}

export function WindowInstances() {
    const meshRef = useRef();
    const tempObject = useMemo(() => new THREE.Object3D(), []);
    const tempColor = useMemo(() => new THREE.Color(), []);
    const tempEmissive = useMemo(() => new THREE.Color(), []);

    useLayoutEffect(() => {
        if (!meshRef.current) return;

        WINDOW_DATA.forEach((data, i) => {
            tempObject.position.set(data.pos[0], data.pos[1], data.pos[2]);
            tempObject.scale.set(data.size[0], data.size[1], 1);
            tempObject.updateMatrix();
            meshRef.current.setMatrixAt(i, tempObject.matrix);

            // We can't easily vary emissive per instance in standard material without custom shader
            // So we'll just use color for now, or average the emissive.
            // For true per-instance emissive, we'd need a custom shader or multiple instanced meshes.
            // For now, let's group by building type if we want different colors, 
            // or just use a generic window material for all.
            // To keep it simple and performant: Single material, color variation only.

            tempColor.set(data.color);
            meshRef.current.setColorAt(i, tempColor);
        });
        meshRef.current.instanceMatrix.needsUpdate = true;
        if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
    }, []);

    return (
        <instancedMesh ref={meshRef} args={[null, null, WINDOW_DATA.length]}>
            <planeGeometry args={[1, 1]} />
            <meshStandardMaterial
                color="#88ccff"
                emissive="#aaddff"
                emissiveIntensity={0.1}
                roughness={0.2}
                metalness={0.8}
            />
        </instancedMesh>
    );
}
