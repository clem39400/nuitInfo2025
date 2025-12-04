import { useRef, useEffect, useState } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { PointerLockControls } from '@react-three/drei';
import gsap from 'gsap';
import * as THREE from 'three';

/**
 * Camera Controller - First-person controls with keyboard movement
 * Press C to toggle mouse look, move with WASD or Arrow keys
 */
function CameraController() {
  const { camera, gl } = useThree();
  const controlsRef = useRef();
  const velocity = useRef(new THREE.Vector3());
  const direction = useRef(new THREE.Vector3());
  const [isLocked, setIsLocked] = useState(false);
  
  // Keyboard state
  const keys = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
  });

  useEffect(() => {
    // Set initial camera position (Gate scene)
    camera.position.set(0, 1.6, 5);
    
    // Keyboard event listeners
    const handleKeyDown = (event) => {
      switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
          keys.current.forward = true;
          break;
        case 'ArrowDown':
        case 'KeyS':
          keys.current.backward = true;
          break;
        case 'ArrowLeft':
        case 'KeyA':
          keys.current.left = true;
          break;
        case 'ArrowRight':
        case 'KeyD':
          keys.current.right = true;
          break;
        case 'KeyC':
          // Toggle pointer lock with C key
          if (controlsRef.current) {
            if (document.pointerLockElement) {
              controlsRef.current.unlock();
            } else {
              controlsRef.current.lock();
            }
          }
          break;
      }
    };

    const handleKeyUp = (event) => {
      switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
          keys.current.forward = false;
          break;
        case 'ArrowDown':
        case 'KeyS':
          keys.current.backward = false;
          break;
        case 'ArrowLeft':
        case 'KeyA':
          keys.current.left = false;
          break;
        case 'ArrowRight':
        case 'KeyD':
          keys.current.right = false;
          break;
      }
    };

    const handleLock = () => setIsLocked(true);
    const handleUnlock = () => setIsLocked(false);

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    document.addEventListener('pointerlockchange', handleLock);
    document.addEventListener('pointerlockerror', handleUnlock);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      document.removeEventListener('pointerlockchange', handleLock);
      document.removeEventListener('pointerlockerror', handleUnlock);
    };
  }, [camera]);

  // Movement logic with collision detection
  useFrame((state, delta) => {
    if (!controlsRef.current) return;

    const moveSpeed = 5; // Units per second
    const actualSpeed = moveSpeed * delta;

    // Get camera direction (forward/backward)
    camera.getWorldDirection(direction.current);
    direction.current.y = 0; // Keep movement horizontal
    direction.current.normalize();

    // Calculate movement
    velocity.current.set(0, 0, 0);

    if (keys.current.forward) {
      velocity.current.add(direction.current.clone().multiplyScalar(actualSpeed));
    }
    if (keys.current.backward) {
      velocity.current.add(direction.current.clone().multiplyScalar(-actualSpeed));
    }
    if (keys.current.left) {
      const right = new THREE.Vector3();
      right.crossVectors(camera.up, direction.current).normalize();
      velocity.current.add(right.multiplyScalar(actualSpeed));
    }
    if (keys.current.right) {
      const right = new THREE.Vector3();
      right.crossVectors(camera.up, direction.current).normalize();
      velocity.current.add(right.multiplyScalar(-actualSpeed));
    }

    // Calculate new position
    const newPosition = camera.position.clone().add(velocity.current);
    
    // Collision detection - define boundaries (adjusted to match scene)
    const boundaries = {
      // Walkway boundaries (sidewalk area)
      minX: -3.5,
      maxX: 3.5,
      minZ: -18,
      maxZ: 8,
      
      // Gate blocking (can't pass through gate until opened)
      gateZ: -10,
      gateMinX: -3,
      gateMaxX: 3,
      gateDepth: 0.8,
      
      // Building wall (can't go through building)
      buildingZ: -14,
    };
    
    // Check if new position is valid
    let canMove = true;
    
    // Check walkway boundaries (X axis - left/right edges)
    if (newPosition.x < boundaries.minX || newPosition.x > boundaries.maxX) {
      canMove = false;
    }
    
    // Check walkway boundaries (Z axis - forward/backward)
    if (newPosition.z < boundaries.minZ || newPosition.z > boundaries.maxZ) {
      canMove = false;
    }
    
    // Check gate collision (can't walk through the gate)
    if (newPosition.z < boundaries.gateZ && newPosition.z > boundaries.gateZ - boundaries.gateDepth) {
      if (newPosition.x > boundaries.gateMinX && newPosition.x < boundaries.gateMaxX) {
        canMove = false;
      }
    }
    
    // Check building wall collision
    if (newPosition.z < boundaries.buildingZ) {
      canMove = false;
    }
    
    // Apply movement only if no collision
    if (canMove) {
      camera.position.copy(newPosition);
    }
    
    // Keep camera at fixed height (no flying or going underground)
    camera.position.y = 1.6;
  });

  return (
    <PointerLockControls
      ref={controlsRef}
      args={[camera, gl.domElement]}
    />
  );
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
