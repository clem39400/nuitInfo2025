import { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import gsap from 'gsap';
import * as THREE from 'three';

/**
 * Camera Controller - First-person controls WITHOUT pointer lock
 * Right-click and drag to look around, WASD/Arrows to move
 * Cursor is always visible for clicking objects
 */
function CameraController() {
  const { camera, gl } = useThree();
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

  // Movement and look logic
  useFrame((state, delta) => {
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
    
    if (newPosition.x < boundaries.minX || newPosition.x > boundaries.maxX) canMove = false;
    if (newPosition.z < boundaries.minZ || newPosition.z > boundaries.maxZ) canMove = false;
    if (newPosition.z < boundaries.gateZ && newPosition.z > boundaries.gateZ - boundaries.gateDepth) {
      if (newPosition.x > boundaries.gateMinX && newPosition.x < boundaries.gateMaxX) canMove = false;
    }
    if (newPosition.z < boundaries.buildingZ) canMove = false;
    
    if (canMove) {
      camera.position.copy(newPosition);
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
