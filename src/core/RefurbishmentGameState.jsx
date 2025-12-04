import { create } from 'zustand';

/**
 * Refurbishment Hunt Game State
 * Manages the treasure hunt progression through PC workstations
 * 
 * The stations are NOT in numerical order in the room - players must
 * follow the glowing PC to find the next challenge!
 */

// Station definitions with their challenges and positions (scattered around the room)
export const REFURBISHMENT_STATIONS = [
  {
    id: 'collect',
    name: 'Collecte',
    order: 1,
    position: [-4, 0, 2],      // Front-left
    description: 'Récupérer des ordinateurs usagés',
    icon: '📦',
    color: '#ff9500',
    lesson: 'Les PC peuvent venir d\'écoles, entreprises ou particuliers'
  },
  {
    id: 'diagnose',
    name: 'Diagnostic',
    order: 2,
    position: [4, 0, -4],      // Back-right (jump across room!)
    description: 'Identifier les problèmes matériels',
    icon: '🔍',
    color: '#00d4ff',
    lesson: 'Tester RAM, disque dur, écran et clavier'
  },
  {
    id: 'datawipe',
    name: 'Effacement',
    order: 3,
    position: [-4, 0, -4],     // Back-left
    description: 'Effacer les données personnelles',
    icon: '🔐',
    color: '#ff3366',
    lesson: 'Protéger la vie privée est une responsabilité éthique'
  },
  {
    id: 'repair',
    name: 'Réparation',
    order: 4,
    position: [0, 0, 0],       // Center
    description: 'Réparer et remplacer les composants',
    icon: '🔧',
    color: '#00ff88',
    lesson: 'Réparer plutôt que jeter = écologie numérique'
  },
  {
    id: 'install',
    name: 'Installation Linux',
    order: 5,
    position: [4, 0, 2],       // Front-right
    description: 'Installer un système libre',
    icon: '🐧',
    color: '#ffcc00',
    lesson: 'Linux = logiciel libre, gratuit et performant'
  },
  {
    id: 'redistribute',
    name: 'Redistribution',
    order: 6,
    position: [0, 0, -4],      // Back-center
    description: 'Donner une seconde vie aux PC',
    icon: '🎁',
    color: '#cc66ff',
    lesson: 'Solidarité numérique : PC pour familles et écoles'
  }
];

const useRefurbishmentStore = create((set, get) => ({
  // Current station index (0-5), null if not started
  currentStationIndex: null,
  
  // Completed stations
  completedStations: [],
  
  // Currently active mini-game
  activeMiniGame: null,
  
  // Game completed flag
  isGameComplete: false,
  
  // Player score
  score: 0,
  
  // Start the refurbishment hunt
  startGame: () => set({
    currentStationIndex: 0,
    completedStations: [],
    activeMiniGame: null,
    isGameComplete: false,
    score: 0
  }),
  
  // Get current station data
  getCurrentStation: () => {
    const { currentStationIndex } = get();
    if (currentStationIndex === null) return null;
    return REFURBISHMENT_STATIONS.find(s => s.order === currentStationIndex + 1);
  },
  
  // Open mini-game for a station
  openMiniGame: (stationId) => {
    const station = REFURBISHMENT_STATIONS.find(s => s.id === stationId);
    const { currentStationIndex } = get();
    
    // Only allow opening the current station's mini-game
    if (station && station.order === currentStationIndex + 1) {
      set({ activeMiniGame: stationId });
    }
  },
  
  // Close mini-game
  closeMiniGame: () => set({ activeMiniGame: null }),
  
  // Complete current station and advance
  completeStation: (stationId, earnedScore = 100) => {
    const { currentStationIndex, completedStations, score } = get();
    const station = REFURBISHMENT_STATIONS.find(s => s.id === stationId);
    
    if (station && station.order === currentStationIndex + 1) {
      const newCompleted = [...completedStations, stationId];
      const nextIndex = currentStationIndex + 1;
      const isComplete = nextIndex >= REFURBISHMENT_STATIONS.length;
      
      set({
        completedStations: newCompleted,
        currentStationIndex: isComplete ? currentStationIndex : nextIndex,
        activeMiniGame: null,
        isGameComplete: isComplete,
        score: score + earnedScore
      });
    }
  },
  
  // Check if a station is the current active one
  isStationActive: (stationId) => {
    const { currentStationIndex } = get();
    if (currentStationIndex === null) return false;
    const station = REFURBISHMENT_STATIONS.find(s => s.id === stationId);
    return station?.order === currentStationIndex + 1;
  },
  
  // Check if station is completed
  isStationCompleted: (stationId) => {
    return get().completedStations.includes(stationId);
  },
  
  // Reset game
  resetGame: () => set({
    currentStationIndex: null,
    completedStations: [],
    activeMiniGame: null,
    isGameComplete: false,
    score: 0
  })
}));

export default useRefurbishmentStore;
