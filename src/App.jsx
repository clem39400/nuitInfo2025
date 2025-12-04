import { useState, Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Preload } from '@react-three/drei';
import SceneManager from './core/SceneManager';
import CameraController from './components/CameraController';
import Environment from './components/Environment';
import PostProcessing from './components/PostProcessing';
import LoadingScreen from './ui/LoadingScreen';
import HUD from './ui/HUD';
import useGameStore from './core/GameStateContext';

/**
 * Main App Component
 * Orchestrates the R3F Canvas and all visual systems
 */
function App() {
  const [isLoading, setIsLoading] = useState(true);
  const { currentPhase, currentRoom } = useGameStore();

  // Simulate asset loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Determine environment scene based on current state
  const getEnvironmentScene = () => {
    if (currentPhase === 'gate') return 'gate';
    if (currentPhase === 'hallway') return 'hallway';
    if (currentRoom === 'lab') return 'lab';
    if (currentRoom === 'server') return 'server';
    if (currentRoom === 'office') return 'office';
    return 'hallway';
  };

  return (
    <>
      {/* Loading Screen */}
      <LoadingScreen isLoading={isLoading} />

      {/* HUD Overlay */}
      <HUD />

      {/* 3D Canvas */}
      <Canvas
        shadows
        camera={{ position: [0, 1.6, 5], fov: 75, near: 0.1, far: 100 }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
        }}
        dpr={[1, 2]}
      >
        {/* Camera Controller */}
        <CameraController />

        {/* Environment & Lighting */}
        <Environment scene={getEnvironmentScene()} />

        {/* Scene Content */}
        <Suspense fallback={null}>
          <SceneManager />
        </Suspense>

        {/* Post-Processing Effects */}
        <PostProcessing bloomIntensity={0.6} />

        {/* Preload assets */}
        <Preload all />

        {/* Debug Controls (remove in production) */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          maxPolarAngle={Math.PI * 0.85}
          minPolarAngle={Math.PI * 0.1}
          minDistance={1}
          maxDistance={20}
          target={[0, 1, 0]}
        />
      </Canvas>
    </>
  );
}

export default App;
