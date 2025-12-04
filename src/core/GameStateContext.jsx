import { create } from 'zustand';

/**
 * Global game state management using Zustand
 * Follows Single Responsibility Principle - only manages game state
 */
const useGameStore = create((set) => ({
  // Current phase of the game
  currentPhase: 'gate', // 'gate' | 'hallway' | 'room'

  // Current room if in room phase
  currentRoom: null, // null | 'lab' | 'server' | 'office'

  // Transition state
  isTransitioning: false,

  // Puzzle completion tracking
  completedPuzzles: {
    gate: false,
    lab: false,
    server: false,
    office: false,
  },

  // UI State
  isSnakeGameOpen: false,

  // Actions
  goToHallway: () => set({
    currentPhase: 'hallway',
    currentRoom: null,
    isTransitioning: false
  }),

  enterRoom: (roomId) => set({
    currentPhase: 'room',
    currentRoom: roomId,
    isTransitioning: false
  }),

  exitRoom: () => set({
    currentPhase: 'hallway',
    currentRoom: null,
    isTransitioning: false
  }),

  setTransitioning: (value) => set({ isTransitioning: value }),

  setSnakeGameOpen: (isOpen) => set({ isSnakeGameOpen: isOpen }),

  completePuzzle: (puzzleId) => set((state) => ({
    completedPuzzles: {
      ...state.completedPuzzles,
      [puzzleId]: true,
    },
  })),

  // Debug: reset game state
  reset: () => set({
    currentPhase: 'gate',
    currentRoom: null,
    isTransitioning: false,
    completedPuzzles: {
      gate: false,
      lab: false,
      server: false,
      office: false,
    },
    isSnakeGameOpen: false,
  }),
}));

export default useGameStore;
