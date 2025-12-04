import { useRef, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import gsap from 'gsap';

/**
 * Camera Controller - Handles cinematic camera transitions
 * Follows Single Responsibility Principle - only manages camera animations
 */
function CameraController() {
  const { camera } = useThree();
  const targetRef = useRef({ x: 0, y: 0, z: 0 });

  useEffect(() => {
    // Set initial camera position (Gate scene)
    camera.position.set(0, 1.6, 5);
    camera.lookAt(0, 1.6, 0);
  }, [camera]);

  return null;
}

/**
 * Animate camera to a new position with cinematic easing
 * @param {Object} camera - Three.js camera
 * @param {Object} position - Target position {x, y, z}
 * @param {Object} lookAt - Target look-at point {x, y, z}
 * @param {number} duration - Animation duration in seconds
 * @param {Function} onComplete - Callback when animation completes
 */
export function tweenCamera(camera, position, lookAt, duration = 2, onComplete) {
  const target = { x: lookAt.x, y: lookAt.y, z: lookAt.z };
  
  // Animate camera position
  gsap.to(camera.position, {
    x: position.x,
    y: position.y,
    z: position.z,
    duration,
    ease: 'power2.inOut',
    onUpdate: () => {
      camera.lookAt(target.x, target.y, target.z);
    },
    onComplete,
  });
}

export default CameraController;
