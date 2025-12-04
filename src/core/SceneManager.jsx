import { Suspense } from 'react';
import useGameStore from './GameStateContext';
import GateScene from '../scenes/GateScene';
import HallwayScene from '../scenes/HallwayScene';
import ComputerLabRoom from '../scenes/rooms/ComputerLabRoom';
import ServerRoom from '../scenes/rooms/ServerRoom';
import AdminOfficeRoom from '../scenes/rooms/AdminOfficeRoom';
import VideoRoom from '../scenes/rooms/VideoRoom';

/**
 * Scene Manager - Conditionally renders scenes based on game state
 * Follows Open/Closed Principle - easy to add new scenes without modifying existing code
 */
function SceneManager({ onOpenChatbot, isChatbotOpen }) {
  const { currentPhase, currentRoom } = useGameStore();

  return (
    <Suspense fallback={null}>
      {currentPhase === 'gate' && <GateScene onOpenChatbot={onOpenChatbot} isChatbotOpen={isChatbotOpen} />}
      {currentPhase === 'hallway' && <HallwayScene isChatbotOpen={isChatbotOpen} />}
      {currentPhase === 'room' && currentRoom === 'lab' && <ComputerLabRoom />}
      {currentPhase === 'room' && currentRoom === 'server' && <ServerRoom />}
      {currentPhase === 'room' && currentRoom === 'office' && <AdminOfficeRoom />}
      {currentPhase === 'room' && currentRoom === 'video' && <VideoRoom />}
    </Suspense>
  );
}

export default SceneManager;
