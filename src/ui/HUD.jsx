import useGameStore from '../core/GameStateContext';

/**
 * HUD - Heads-Up Display showing current phase
 */
function HUD() {
  const { currentPhase, currentRoom } = useGameStore();

  const getPhaseText = () => {
    if (currentPhase === 'gate') return 'Phase 1: The Gatekeeper';
    if (currentPhase === 'hallway') {
      // Check if player is in video room area
      const { inVideoRoom } = useGameStore.getState();
      if (inVideoRoom) return 'Phase 2: Salle de Projection';
      return 'Phase 2: The Hub';
    }
    if (currentPhase === 'video') return 'Phase 2: Salle de Projection';
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
