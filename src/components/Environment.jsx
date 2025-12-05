import { Environment as DreiEnvironment, useTexture, MeshReflectorMaterial } from '@react-three/drei';
import CityBackdrop from './CityBackdrop';

/**
 * Environment setup - Professional lighting and reflections
 * Uses HDRI for realistic image-based lighting
 */

// Preset configurations for different scenes
const PRESETS = {
  gate: {
    preset: 'park',  // Bright outdoor environment
    ambientIntensity: 0.4,  // Reduced ambient for more natural daytime
    fogColor: '#c8e0f0',  // Light blue-gray fog
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

function Environment({ scene = 'hallway' }) {
  const config = PRESETS[scene] || PRESETS.hallway;

  return (
    <>
      {/* HDRI Environment for realistic reflections - use downloaded sky for gate */}
      {scene === 'gate' ? (
        <DreiEnvironment files="/assets/textures/sky.hdr" background={false} />
      ) : (
        <DreiEnvironment preset={config.preset} background={false} />
      )}
      
      {/* Softer blue sky background color - not too bright */}
      <color attach="background" args={['#8ab8d0']} />
      
      {/* City backdrop - visible from all scenes - CLOSE so buildings are clear */}
      <CityBackdrop position={[0, 0, -25]} />
      
      {/* Ambient fill light - warm for daytime, MUCH reduced intensity */}
      <ambientLight intensity={config.ambientIntensity * 0.5} color="#fff8f0" />
      
      {/* Main directional light with shadows */}
      <directionalLight
        position={[5, 10, 5]}
        intensity={0.5}
        color="#ffffff"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
        shadow-bias={-0.0001}
      />
      
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
}

/**
 * Reflective Floor Component - Creates shiny surfaces
 */
export function ReflectiveFloor({
  position = [0, 0, 0],
  size = [20, 20],
  color = "#080810",
  roughness = 0.1,
  metalness = 0.9,
  mirror = 0.5,
}) {
  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={position}
      receiveShadow
    >
      <planeGeometry args={size} />
      <MeshReflectorMaterial
        blur={[400, 100]}
        resolution={1024}
        mixBlur={1}
        mixStrength={mirror}
        roughness={roughness}
        depthScale={1}
        minDepthThreshold={0.4}
        maxDepthThreshold={1.4}
        color={color}
        metalness={metalness}
        mirror={mirror}
      />
    </mesh>
  );
}

export default Environment;
