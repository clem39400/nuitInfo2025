import { memo } from 'react';
import { Environment as DreiEnvironment } from '@react-three/drei';
import CityBackdrop from './CityBackdrop';

/**
 * Environment setup - Professional lighting and reflections
 * Uses HDRI for realistic image-based lighting
 */

// Preset configurations for different scenes
const PRESETS = {
  gate: {
    preset: 'park',
    ambientIntensity: 0.4,
    fogColor: '#c8e0f0',
    fogNear: 40,
    fogFar: 90,
  },
  hallway: {
    preset: 'warehouse',
    ambientIntensity: 0.3,
    fogColor: '#0a0a15',
    fogNear: 8,
    fogFar: 25,
  },
  lab: {
    preset: 'warehouse',
    ambientIntensity: 0.4,
    fogColor: '#0a0a20',
    fogNear: 10,
    fogFar: 30,
  },
  server: {
    preset: 'night',
    ambientIntensity: 0.15,
    fogColor: '#100505',
    fogNear: 3,
    fogFar: 15,
  },
  office: {
    preset: 'apartment',
    ambientIntensity: 0.35,
    fogColor: '#0a0a12',
    fogNear: 8,
    fogFar: 25,
  },
};

// Memoized Environment component
const Environment = memo(function Environment({ scene = 'hallway' }) {
  const config = PRESETS[scene] || PRESETS.hallway;

  return (
    <>
      {/* HDRI Environment for realistic reflections */}
      {scene === 'gate' ? (
        <DreiEnvironment files="/assets/textures/sky.hdr" background={false} />
      ) : (
        <DreiEnvironment preset={config.preset} background={false} />
      )}

      {/* Sky background color */}
      <color attach="background" args={['#8ab8d0']} />

      {/* City backdrop */}
      <CityBackdrop position={[0, 0, -25]} />

      {/* Ambient fill light */}
      <ambientLight intensity={config.ambientIntensity * 0.5} color="#fff8f0" />

      {/* Rim light for depth */}
      <directionalLight
        position={[-5, 5, -5]}
        intensity={0.3}
        color="#4466ff"
      />

      {/* Atmospheric fog */}
      <fog attach="fog" args={[config.fogColor, config.fogNear, config.fogFar]} />
    </>
  );
});

/**
 * Simple Floor Component - No reflections for best performance
 */
export const ReflectiveFloor = memo(function ReflectiveFloor({
  position,
  size,
  color = "#080810",
  roughness = 0.1,
  metalness = 0.9,
}) {
  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={position}
      receiveShadow
    >
      <planeGeometry args={size} />
      <meshStandardMaterial
        color={color}
        roughness={roughness + 0.2}
        metalness={metalness * 0.7}
        envMapIntensity={0.5}
      />
    </mesh>
  );
});

export default Environment;
