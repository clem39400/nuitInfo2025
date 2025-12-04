import { useState, Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Preload } from '@react-three/drei';
import SceneManager from './core/SceneManager';
import CameraController from './components/CameraController';
import Environment from './components/Environment';
import PostProcessing from './components/PostProcessing';
import LoadingScreen from './ui/LoadingScreen';
import HUD from './ui/HUD';
import IntroOverlay from './ui/IntroOverlay';
import Chatbot from './components/Chatbot';
import SnakeGame from './components/SnakeGame';
import ResistanceUplinkForm from './ui/ResistanceUplinkForm';
import useGameStore from './core/GameStateContext';

/**
 * Main App Component
 * Orchestrates the R3F Canvas and all visual systems
 */
function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const {
    currentPhase,
    currentRoom,
    isSnakeGameOpen,
    setSnakeGameOpen,
    completePuzzle,
    goToHallway
  } = useGameStore();

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

  const handleSnakeWin = () => {
    setSnakeGameOpen(false);
    completePuzzle('gate');
    goToHallway();
  };

  return (
    <>
      {/* Loading Screen */}
      <LoadingScreen isLoading={isLoading} />

      {/* HUD Overlay */}
      <HUD />

      {/* NIRD Intro Panel - Shows in Gate phase */}
      <IntroOverlay />

      {/* Satirical Chatbot */}
      <Chatbot
        isOpen={isChatbotOpen}
        onClose={() => setIsChatbotOpen(false)}
        onSnakeGameStart={() => {
          setIsChatbotOpen(false);
          setSnakeGameOpen(true);
        }}
        onSkipGate={handleSnakeWin}
      />

      {/* Snake Game Overlay */}
      {isSnakeGameOpen && (
        <SnakeGame
          onClose={() => setSnakeGameOpen(false)}
          onWin={handleSnakeWin}
          winScore={5} // Lower score for easier testing/demo
        />
      )}

      {/* Resistance Uplink Form Overlay */}
      <ResistanceUplinkForm />

      {/* Controls Instructions */}
      <div style={{
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(0, 0, 0, 0.8)',
        color: '#00ff88',
        padding: '12px 24px',
        borderRadius: '8px',
        fontFamily: 'monospace',
        fontSize: '14px',
        border: '1px solid #00ff88',
        zIndex: 999,
        pointerEvents: 'none',
      }}>
        <strong>Right-click + Drag</strong> to look around | <strong>WASD/Arrows</strong> to move | <strong>Left-click</strong> objects normally
      </div>

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
        {/* Camera Controller - Disable movement when chatbot or snake game is open */}
        <CameraController disableMovement={isChatbotOpen || isSnakeGameOpen} />

        {/* Environment & Lighting */}
        <Environment scene={getEnvironmentScene()} />

        {/* Scene Content - Pass chatbot handler */}
        <Suspense fallback={null}>
          <SceneManager
            onOpenChatbot={() => setIsChatbotOpen(true)}
            isChatbotOpen={isChatbotOpen}
          />
        </Suspense>

        {/* Post-Processing Effects - Disabled during Snake Game or Chatbot for performance */}
        {(!isSnakeGameOpen && !isChatbotOpen) && <PostProcessing bloomIntensity={0.6} />}

        {/* Preload assets */}
        <Preload all />
      </Canvas>
    </>
  );
}

export default App;
