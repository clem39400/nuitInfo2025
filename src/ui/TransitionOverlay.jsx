import { useEffect, useState } from 'react';
import useGameStore from '../core/GameStateContext';

/**
 * TransitionOverlay - Subtle vignette effect during scene transitions
 */
function TransitionOverlay() {
  const isTransitioning = useGameStore((state) => state.isTransitioning);
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    if (isTransitioning) {
      setOpacity(1);
    } else {
      setOpacity(0);
    }
  }, [isTransitioning]);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.4) 100%)',
        opacity: opacity,
        transition: 'opacity 0.2s ease-in-out',
        zIndex: 9998,
        pointerEvents: 'none',
      }}
    />
  );
}

export default TransitionOverlay;
