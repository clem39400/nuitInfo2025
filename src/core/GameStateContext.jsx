import { create } from 'zustand';

/**
 * Global game state management using Zustand
 * Follows Single Responsibility Principle - only manages game state
 */
const useGameStore = create((set) => ({
  // Current phase of the game
  currentPhase: 'gate', // 'gate' | 'hallway' | 'room'

  // Current room if in room phase
  currentRoom: null, // null | 'lab' | 'server' | 'office' | 'video'

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

  // Track if player is in the video room area
  inVideoRoom: false,

  // Performance optimization: track if camera is moving
  isMoving: false,

  // Actions
  goToHallway: () => set({
    currentPhase: 'hallway',
    currentRoom: null,
    isTransitioning: false,
    inVideoRoom: false
  }),

  goToGate: () => set({
    currentPhase: 'gate',
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

  setInVideoRoom: (value) => set({ inVideoRoom: value }),

  setIsMoving: (value) => set({ isMoving: value }),

  setSnakeGameOpen: (isOpen) => set({ isSnakeGameOpen: isOpen }),

  // NIRD Form State
  showNIRDForm: false,
  openNIRDForm: () => set({ showNIRDForm: true }),
  closeNIRDForm: () => set({ showNIRDForm: false }),

  // Linux Game State
  showLinuxGame: false,
  openLinuxGame: () => set({ showLinuxGame: true }),
  closeLinuxGame: () => set({ showLinuxGame: false }),

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
