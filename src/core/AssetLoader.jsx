import { useGLTF } from '@react-three/drei';

/**
 * Asset preloader - loads all 3D models before game starts
 * Follows Single Responsibility Principle - only handles asset loading
 */

// List of all assets to preload
const ASSETS = {
  // Models (to be added when user provides them)
  // gate: '/assets/models/gate.glb',
  // corridor: '/assets/models/corridor.glb',
  // door: '/assets/models/door.glb',
  // computerDesk: '/assets/models/computer-desk.glb',
  // serverRack: '/assets/models/server-rack.glb',
  // laptop: '/assets/models/laptop.glb',
};

/**
 * Preload all assets
 * Call this at app initialization
 */
export function preloadAssets() {
  Object.values(ASSETS).forEach((path) => {
    if (path) {
      useGLTF.preload(path);
    }
  });
}

/**
 * Hook to check if all assets are loaded
 */
export function useAssetsLoaded() {
  // For now, return true since we don't have assets yet
  // This will be updated when assets are added
  return true;
}

export default ASSETS;
