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
 */
function SceneManager({ onOpenChatbot, isChatbotOpen }) {
  const currentPhase = useGameStore((state) => state.currentPhase);
  const currentRoom = useGameStore((state) => state.currentRoom);

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
