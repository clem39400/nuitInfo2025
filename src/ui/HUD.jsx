import useGameStore from '../core/GameStateContext';

/**
 * HUD - Heads-Up Display showing current phase
 */
function HUD() {
  const { currentPhase, currentRoom } = useGameStore();

  const getPhaseText = () => {
    if (currentPhase === 'gate') return 'Phase 1: The Gatekeeper';
    if (currentPhase === 'hallway') return 'Phase 2: The Hub';
    if (currentPhase === 'room') {
      if (currentRoom === 'lab') return 'Computer Lab';
      if (currentRoom === 'server') return 'Server Room';
      if (currentRoom === 'office') return 'Admin Office';
    }
    return '';
  };

  return (
    <div className="hud">
      <div className="phase-indicator">
        {getPhaseText()}
      </div>
    </div>
  );
}

export default HUD;
