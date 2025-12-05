import { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import gsap from 'gsap';
import * as THREE from 'three';
import useGameStore from '../core/GameStateContext';

/**
 * Scene-specific collision boundaries
 */
const SCENE_BOUNDARIES = {
  gate: {
    minX: -3.0,
    maxX: 3.0,
    minZ: -9,
    maxZ: 8,
    obstacles: [
      { minX: -3.5, maxX: 3.5, minZ: -10.5, maxZ: -9.5 },
      { minX: -4, maxX: -3, minZ: -10.8, maxZ: -9.2 },
      { minX: 3, maxX: 4, minZ: -10.8, maxZ: -9.2 },
      { minX: -1.2, maxX: 1.2, minZ: -3, maxZ: -1 },
    ]
  },
  hallway: {
    minX: -5,
    maxX: 5,
    minZ: -11,
    maxZ: 8,
    obstacles: [
      { minX: -5.2, maxX: -4.3, minZ: -14, maxZ: 14 },
      { minX: 4.3, maxX: 5.2, minZ: -14, maxZ: 14 },
      { minX: -6, maxX: 6, minZ: -13, maxZ: -11.5 },
    ]
  },
  room: {
    minX: -8,
    maxX: 8,
    minZ: -8,
    maxZ: 8,
    obstacles: []
  }
};

/**
 * Camera Controller - First-person controls WITHOUT pointer lock
 */
function CameraController({ disableMovement = false }) {
  const { camera, gl } = useThree();
  const currentPhase = useGameStore((state) => state.currentPhase);
  const setInVideoRoom = useGameStore((state) => state.setInVideoRoom);
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
    // Set initial position based on phase
    if (currentPhase === 'gate') {
      camera.position.set(0, 1.6, 0); // Closer to gate (was 5)
    } else if (currentPhase === 'hallway') {
      camera.position.set(0, 1.6, 0);
    } else {
      camera.position.set(0, 1.6, 5);
    }

    camera.rotation.order = 'YXZ';
    // Reset rotation
    rotation.current = { yaw: 0, pitch: 0 };
    camera.rotation.set(0, 0, 0);

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

    const handleMouseDown = (event) => {
      if (event.button === 2) {
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
  }, [camera, gl, currentPhase]);

  const checkObstacleCollision = (pos, obstacles) => {
    const playerRadius = 0.4;
    for (const obs of obstacles) {
      if (
        pos.x + playerRadius > obs.minX &&
        pos.x - playerRadius < obs.maxX &&
        pos.z + playerRadius > obs.minZ &&
        pos.z - playerRadius < obs.maxZ
      ) {
        return true;
      }
    }
    return false;
  };

  useFrame((state, delta) => {
    if (disableMovement) {
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
      rotation.current.pitch = Math.max(-Math.PI / 2 + 0.1, Math.min(Math.PI / 2 - 0.1, rotation.current.pitch));
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
      buildingZ: -14,
    };

    let canMove = true;

    if (newPosition.x < boundaries.minX) canMove = false;

    // Video Room Exception
    const isEnteringVideoRoom = newPosition.z > -2 && newPosition.z < 2;
    if (!isEnteringVideoRoom && newPosition.x > boundaries.maxX) canMove = false;
    if (isEnteringVideoRoom && newPosition.x > 18) canMove = false;

    if (newPosition.z < boundaries.minZ || newPosition.z > boundaries.maxZ) canMove = false;

    if (canMove && boundaries.obstacles) {
      canMove = !checkObstacleCollision(newPosition, boundaries.obstacles);
    }
    if (newPosition.z < boundaries.buildingZ) canMove = false;

    if (canMove) {
      camera.position.copy(newPosition);
    }

    camera.position.y = 1.6;

    // Check if in Video Room (x > 6)
    const inVideoRoom = camera.position.x > 6;
    // We can access the store directly to avoid re-renders or dependency loops if we were using the hook for reading
    // But since we are inside a component, we can use the setter we got from the hook.
    // However, to avoid calling setInVideoRoom every frame, we should check if it changed.
    // Since we don't have the current value in a ref, we can just call it if we are sure it's cheap, 
    // OR we can use useGameStore.getState().inVideoRoom to check.
    const currentInVideoRoom = useGameStore.getState().inVideoRoom;
    if (inVideoRoom !== currentInVideoRoom) {
      setInVideoRoom(inVideoRoom);
    }
  });

  return null;
}

/**
 * Animate camera to a new position with cinematic easing
 */
export function tweenCamera(camera, position, lookAt, duration = 2, onComplete) {
  const target = { x: lookAt.x, y: lookAt.y, z: lookAt.z };

  gsap.to(camera.position, {
    x: position.x,
    y: position.y,
    z: position.z,
    duration,
    ease: 'power2.inOut',
  });

  const startLookAt = new THREE.Vector3();
  camera.getWorldDirection(startLookAt);
  startLookAt.add(camera.position);

  const lookAtAnim = { x: startLookAt.x, y: startLookAt.y, z: startLookAt.z };
  gsap.to(lookAtAnim, {
    x: target.x,
    y: target.y,
    z: target.z,
    duration,
    ease: 'power2.inOut',
    onUpdate: () => {
      camera.lookAt(lookAtAnim.x, lookAtAnim.y, lookAtAnim.z);
    },
    onComplete,
  });
}

export default CameraController;
