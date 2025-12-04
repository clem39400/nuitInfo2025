# Nuit de l'Info 2025 - 3D Environment Base

## 🎮 Project Overview

This is the **base 3D environment** for the Nuit de l'Info 2025 interactive game about Digital Responsibility. Built with **React Three Fiber (R3F)** following **SOLID principles** for team collaboration.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:5173](http://localhost:5173) to view the project.

## 📁 Project Structure

```
src/
├── core/               # Core systems (state, assets, scenes)
├── components/         # Reusable 3D components
├── scenes/            # Phase scenes (Gate, Hallway, Rooms)
├── effects/           # Visual effects (Matrix rain, etc.)
└── ui/                # 2D overlay components
```

## 🎯 Current Features

### ✅ Implemented
- **Phase 1 (Gate Scene)**: Matrix rain effect, hologram pedestal
- **Phase 2 (Hallway)**: 3D corridor with 3 interactive doors
- **Phase 3 (Rooms)**: Computer Lab, Server Room, Admin Office templates
- **Camera System**: GSAP-powered cinematic transitions
- **Post-Processing**: Bloom, Vignette effects
- **State Management**: Zustand store for game state

### 🔌 Integration Points for Team

#### 1. Chatbot Component
**File**: `src/ui/ChatbotSlot.jsx`

**Props Interface**:
```jsx
<ChatbotSlot
  isActive={boolean}
  onSnakeCommand={() => {/* Launch snake game */}}
  onClose={() => {/* Chatbot defeated */}}
/>
```

**Integration**:
- Replace placeholder in `ChatbotSlot.jsx` with your chatbot UI
- Position: Fixed overlay on top of 3D scene
- Trigger: Automatically shown in Gate Scene

#### 2. Snake Game
**Location**: Gate Scene (`src/scenes/GateScene.jsx`)

**Integration**:
- Create component in `src/components/SnakeGame.jsx`
- Import and place at position `[0, 1, -2]` (hologram pedestal)
- On win, call: `useGameStore().completePuzzle('gate')` and `goToHallway()`

#### 3. Room Puzzles

**Computer Lab** (`src/scenes/rooms/ComputerLabRoom.jsx`):
- Puzzle position: `[0, 1, -2]`
- On complete: `completePuzzle('lab')`

**Server Room** (`src/scenes/rooms/ServerRoom.jsx`):
- Puzzle position: `[0, 1, 0]`
- On complete: `completePuzzle('server')`

**Admin Office** (`src/scenes/rooms/AdminOfficeRoom.jsx`):
- Cookie puzzle position: `[0, 1.5, -2]`
- NIRD Form position: `[3, 0.5, 2]` (hidden terminal)
- On complete: `completePuzzle('office')`

#### 4. NIRD Form (Nexus)
**Location**: Admin Office, hidden terminal in corner

**Integration**:
- Create form component in `src/components/NIRDForm.jsx`
- Trigger when user clicks hidden terminal
- Style: Cyberpunk terminal aesthetic

## 🎨 Design System

### Colors
- **Primary**: `#00ff88` (Matrix green)
- **Background**: `#0a0a1e` (Dark blue-black)
- **Accent**: `#ff0088` (Neon pink)
- **Warning**: `#ff4444` (Red)

### Fonts
- **UI**: Inter, -apple-system
- **Terminal**: Space Mono, monospace

## 🛠️ Development Tips

### Accessing Game State
```jsx
import useGameStore from './core/GameStateContext';

function MyComponent() {
  const { currentPhase, enterRoom, completePuzzle } = useGameStore();
  
  // Navigate to a room
  enterRoom('lab');
  
  // Mark puzzle complete
  completePuzzle('gate');
}
```

### Camera Transitions
```jsx
import { useThree } from '@react-three/fiber';
import { tweenCamera } from './components/CameraController';

const { camera } = useThree();

tweenCamera(
  camera,
  { x: 0, y: 1.6, z: 5 },  // Target position
  { x: 0, y: 1, z: 0 },     // Look-at point
  2,                         // Duration (seconds)
  () => console.log('Done') // Callback
);
```

### Adding 3D Models
1. Place `.glb` files in `public/assets/models/`
2. Add path to `src/core/AssetLoader.jsx`
3. Use `useGLTF` hook:
```jsx
import { useGLTF } from '@react-three/drei';

const { scene } = useGLTF('/assets/models/your-model.glb');
return <primitive object={scene} />;
```

## 🐛 Debug Controls

### Keyboard Shortcuts
- **OrbitControls**: Click + drag to rotate camera
- **Zoom**: Mouse wheel

### Debug Features
- **Pink cube in Gate Scene**: Click to skip to Hallway
- **Pink cube in Rooms**: Click to return to Hallway

**Remove these before production!**

## 📦 Required 3D Assets

See `implementation_plan.md` for the full list of required 3D models to download.

### Priority Assets:
1. School corridor/hallway
2. Doors (x3)
3. Computer desks
4. Server racks

Place all `.glb` files in `public/assets/models/`

## 🎯 Next Steps

1. **Download 3D assets** (see implementation plan)
2. **Integrate chatbot** (replace `ChatbotSlot.jsx`)
3. **Add Snake game** (in `GateScene.jsx`)
4. **Build room puzzles** (in respective room files)
5. **Add NIRD form** (in `AdminOfficeRoom.jsx`)

## 🤝 Team Workflow

1. **Pull latest changes** before starting work
2. **Work in your assigned files** (chatbot, snake, puzzles)
3. **Test in browser** (`npm run dev`)
4. **Commit frequently** with clear messages
5. **Communicate** about shared components

## 📚 Resources

- [React Three Fiber Docs](https://docs.pmnd.rs/react-three-fiber)
- [Drei Helpers](https://github.com/pmndrs/drei)
- [GSAP Animation](https://greensock.com/gsap/)
- [Zustand State](https://github.com/pmndrs/zustand)

## 🆘 Troubleshooting

**Black screen?**
- Check browser console for errors
- Ensure all imports are correct

**Assets not loading?**
- Verify file paths in `AssetLoader.jsx`
- Check `.glb` files are in `public/assets/models/`

**Camera not moving?**
- Check `CameraController` is mounted in `App.jsx`
- Verify GSAP is installed

---

Built with ❤️ for Nuit de l'Info 2025