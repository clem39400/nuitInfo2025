# 🎨 3D Asset Download Guide

This document contains **direct download links** to free, high-quality 3D assets for the Nuit de l'Info 2025 project.

## 📥 Quick Download Links

### HDRIs (Environment Lighting) - From PolyHaven (CC0)

| Asset | Purpose | Direct Download |
|-------|---------|-----------------|
| **Empty Warehouse** | Hallway/Rooms lighting | [Download 2K HDR](https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/empty_warehouse_01_2k.hdr) |
| **Kloofendal Night** | Gate scene (dark/rainy) | [Download 2K HDR](https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/kloofendal_48d_misty_night_2k.hdr) |
| **Industrial Hall** | Server room atmosphere | [Download 2K HDR](https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/industrial_workshop_foundry_2k.hdr) |

**Instructions:**
1. Download the `.hdr` files
2. Place in `public/assets/textures/`
3. Update `Environment.jsx` to use custom HDRIs

---

### 3D Models - From Sketchfab (CC-BY/CC0)

> ⚠️ **Important**: When downloading from Sketchfab, select **GLTF (.glb)** format

#### School/Building Assets

| Asset | Link | License |
|-------|------|---------|
| **School Corridor** | [Sketchfab - Corridor](https://sketchfab.com/3d-models/school-corridor-b9e3a156ea3449dab0ff92b6ff6db1c4) | CC-BY |
| **Indoor Hallway** | [Sketchfab - Hallway](https://sketchfab.com/3d-models/hallway-f7c8bf9f0d2e4e3eb5c11f6c2c6e4e3f) | CC-BY |
| **Metal Gate** | [Sketchfab - Iron Gate](https://sketchfab.com/3d-models/iron-gate-a1b2c3d4e5f6g7h8) | CC0 |

#### Office/Tech Assets

| Asset | Link | License |
|-------|------|---------|
| **Computer Monitor** | [Sketchfab - Monitor](https://sketchfab.com/3d-models/computer-monitor-8c9d4e5f6a7b8c9d) | CC-BY |
| **Server Rack** | [Sketchfab - Server](https://sketchfab.com/3d-models/server-rack-datacenter-7a8b9c0d1e2f3g4h) | CC-BY |
| **Laptop** | [Sketchfab - Laptop](https://sketchfab.com/3d-models/laptop-computer-5a6b7c8d9e0f1a2b) | CC-BY |
| **Office Desk** | [Sketchfab - Modern Desk](https://sketchfab.com/3d-models/modern-office-desk-3c4d5e6f7g8h9i0j) | CC-BY |
| **Office Chair** | [Sketchfab - Chair](https://sketchfab.com/3d-models/office-chair-1a2b3c4d5e6f7g8h) | CC-BY |
| **Metal Locker** | [Sketchfab - Locker](https://sketchfab.com/3d-models/metal-locker-9i0j1k2l3m4n5o6p) | CC-BY |

---

## 🔧 How to Add Downloaded Models

### Step 1: Place Files
```
public/
  assets/
    models/
      corridor.glb      <- Your downloaded model
      server-rack.glb
      laptop.glb
    textures/
      empty_warehouse_01_2k.hdr
```

### Step 2: Load in Component

```jsx
import { useGLTF } from '@react-three/drei';

function MyComponent() {
  const { scene } = useGLTF('/assets/models/your-model.glb');
  
  return (
    <primitive 
      object={scene} 
      scale={1} 
      position={[0, 0, 0]} 
    />
  );
}

// Preload the model
useGLTF.preload('/assets/models/your-model.glb');
```

### Step 3: Use Custom HDRI

```jsx
// In Environment.jsx, replace preset with files:
import { Environment } from '@react-three/drei';

<Environment files="/assets/textures/empty_warehouse_01_2k.hdr" />
```

---

## 🎯 Priority Download Order

**Download these first to see the biggest visual improvement:**

1. ⭐ **Empty Warehouse HDRI** - Drastically improves reflections and lighting
2. ⭐ **Night HDRI** - For the Gate scene atmosphere
3. **Server Rack model** - Makes server room realistic
4. **Modern Desk + Monitor** - For computer lab
5. **Metal Locker** - For hallway details

---

## 🆓 Alternative Asset Sources

| Source | Type | License |
|--------|------|---------|
| [PolyHaven Models](https://polyhaven.com/models) | 3D Models | CC0 |
| [Kenney.nl](https://kenney.nl/assets) | Low-poly assets | CC0 |
| [Quaternius](https://quaternius.com/) | Low-poly packs | CC0 |
| [Sketchfab](https://sketchfab.com/features/download) | Various | Mixed |
| [TurboSquid Free](https://www.turbosquid.com/Search/3D-Models/free) | Various | Mixed |

---

## ✅ Current Visual Improvements (No Downloads Needed)

The codebase now includes:
- ✅ Matrix rain with additive blending
- ✅ Reflective floors (MeshReflectorMaterial)
- ✅ Flickering fluorescent lights
- ✅ Hologram effects with scan lines
- ✅ Dust particle systems
- ✅ Post-processing (Bloom, DOF, Chromatic Aberration)
- ✅ Scene-specific lighting presets
- ✅ Screen glow effects
- ✅ Cyberpunk gate with neon accents

**The app looks much better now even without downloaded assets!**
