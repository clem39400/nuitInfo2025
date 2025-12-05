import { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import gsap from 'gsap';
import * as THREE from 'three';
import useGameStore from '../core/GameStateContext';

/**
 * Scene-specific collision boundaries
 * Each scene has its own collision configuration
 */
const SCENE_BOUNDARIES = {
  gate: {
    // Outer boundaries - limited by hedges along the path
    minX: -3.0,  // Left hedge at -3.5, with buffer
    maxX: 3.0,   // Right hedge at 3.5, with buffer
    minZ: -9,    // Can't go past the gate at z=-10
    maxZ: 8,     // Open area behind player

    // Gate collision - the iron gate bars
    obstacles: [
      // Gate bars - can't pass through the gate
      { minX: -3.5, maxX: 3.5, minZ: -10.5, maxZ: -9.5 },
      // Left gate pillar
      { minX: -4, maxX: -3, minZ: -10.8, maxZ: -9.2 },
      // Right gate pillar  
      { minX: 3, maxX: 4, minZ: -10.8, maxZ: -9.2 },
      // Hologram pedestal
      { minX: -1.2, maxX: 1.2, minZ: -3, maxZ: -1 },
    ]
  },
  hallway: {
    // Hallway walls
    minX: -5,   // Left wall at -5.5
    maxX: 5,    // Right wall at 5.5
    minZ: -11,  // Doors at end
    maxZ: 8,    // Entry area

    obstacles: [
      // Left lockers collision
      { minX: -5.2, maxX: -4.3, minZ: -14, maxZ: 14 },
      // Right lockers collision
      { minX: 4.3, maxX: 5.2, minZ: -14, maxZ: 14 },
      // Back wall with doors
      { minX: -6, maxX: 6, minZ: -13, maxZ: -11.5 },
    ]
  },
  room: {
    // Generic room boundaries
    minX: -8,
    maxX: 8,
    minZ: -8,
    maxZ: 8,
    obstacles: []
  }
};

/**
 * Camera Controller - First-person controls WITHOUT pointer lock
 * Right-click and drag to look around, WASD/Arrows to move
 * Cursor is always visible for clicking objects
 * Now with scene-aware collision detection!
 */
function CameraController({ disableMovement = false }) {
  const { camera, gl } = useThree();
  const { currentPhase } = useGameStore();
  const velocity = useRef(new THREE.Vector3());
  const direction = useRef(new THREE.Vector3());

  // Mouse look state
  const isRightDragging = useRef(false);
  const mouseDelta = useRef({ x: 0, y: 0 });
  const rotation = useRef({ yaw: 0, pitch: 0 });

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
    camera.rotation.order = 'YXZ';

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

    // Mouse look with right-click drag
    const handleMouseDown = (event) => {
      if (event.button === 2) { // Right click
        isRightDragging.current = true;
        gl.domElement.style.cursor = 'grabbing';
      }
    };

    const handleMouseUp = (event) => {
      if (event.button === 2) {
        isRightDragging.current = false;
        gl.domElement.style.cursor = 'default';
      }
    };

    const handleMouseMove = (event) => {
      if (isRightDragging.current) {
        mouseDelta.current.x = event.movementX;
        mouseDelta.current.y = event.movementY;
      }
    };

    // Prevent context menu on right click
    const handleContextMenu = (event) => {
      event.preventDefault();
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    gl.domElement.addEventListener('mousedown', handleMouseDown);
    gl.domElement.addEventListener('mouseup', handleMouseUp);
    gl.domElement.addEventListener('mousemove', handleMouseMove);
    gl.domElement.addEventListener('contextmenu', handleContextMenu);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      gl.domElement.removeEventListener('mousedown', handleMouseDown);
      gl.domElement.removeEventListener('mouseup', handleMouseUp);
      gl.domElement.removeEventListener('mousemove', handleMouseMove);
      gl.domElement.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [camera, gl]);

  /**
   * Check if a position collides with any obstacle
   */
  const checkObstacleCollision = (pos, obstacles) => {
    const playerRadius = 0.4; // Player collision radius
    for (const obs of obstacles) {
      if (
        pos.x + playerRadius > obs.minX &&
        pos.x - playerRadius < obs.maxX &&
        pos.z + playerRadius > obs.minZ &&
        pos.z - playerRadius < obs.maxZ
      ) {
        return true; // Collision detected
      }
    }
    return false;
  };

  // Movement and look logic
  useFrame((state, delta) => {
    // Skip all movement processing if disabled (chatbot/snake game open)
    if (disableMovement) {
      // Reset keys to prevent stuck movement when re-enabled
      keys.current.forward = false;
      keys.current.backward = false;
      keys.current.left = false;
      keys.current.right = false;
      return;
    }

    const moveSpeed = 5;
    const actualSpeed = moveSpeed * delta;
    const lookSpeed = 0.002;

    // Update camera rotation from mouse
    if (isRightDragging.current && (mouseDelta.current.x !== 0 || mouseDelta.current.y !== 0)) {
      rotation.current.yaw -= mouseDelta.current.x * lookSpeed;
      rotation.current.pitch -= mouseDelta.current.y * lookSpeed;

      // Clamp pitch to prevent flipping
      rotation.current.pitch = Math.max(-Math.PI / 2 + 0.1, Math.min(Math.PI / 2 - 0.1, rotation.current.pitch));

      // Apply rotation
      camera.rotation.y = rotation.current.yaw;
      camera.rotation.x = rotation.current.pitch;

      mouseDelta.current.x = 0;
      mouseDelta.current.y = 0;
    }

    // Get camera direction for movement
    camera.getWorldDirection(direction.current);
    direction.current.y = 0;
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

    // Collision detection
    const boundaries = {
      minX: -3.5,
      maxX: 3.5,
      minZ: -18,
      maxZ: 8,
      gateZ: -10,
      gateMinX: -3,
      gateMaxX: 3,
      gateDepth: 0.8,
      buildingZ: -14,
    };

    let canMove = true;

    if (newPosition.x < boundaries.minX) canMove = false;

    // Video Room Exception: Allow moving right if within Z range
    const isEnteringVideoRoom = newPosition.z > -2 && newPosition.z < 2;
    if (!isEnteringVideoRoom && newPosition.x > boundaries.maxX) canMove = false;
    if (isEnteringVideoRoom && newPosition.x > 18) canMove = false; // Video room back wall

    if (newPosition.z < boundaries.minZ || newPosition.z > boundaries.maxZ) canMove = false;

    // Check obstacle collisions
    if (canMove && boundaries.obstacles) {
      canMove = !checkObstacleCollision(newPosition, boundaries.obstacles);
    }
    if (newPosition.z < boundaries.buildingZ) canMove = false;

    if (canMove) {
      camera.position.copy(newPosition);

      // Check if player is in video room area (x > 6 when inside the opening)
      const inVideoRoomArea = newPosition.x > 6 && newPosition.z > -2 && newPosition.z < 2;
      const { inVideoRoom, setInVideoRoom } = useGameStore.getState();
      if (inVideoRoomArea !== inVideoRoom) {
        setInVideoRoom(inVideoRoomArea);
      }
    }

    camera.position.y = 1.6;
  });

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
