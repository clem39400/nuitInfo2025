import React, { useState } from 'react';
import { Html } from '@react-three/drei';
import { useSpring, animated } from '@react-spring/three';

/**
 * NirdPanel - A pedagogical panel displaying NIRD values
 * 
 * @param {string} title - The main title (e.g., "INCLUSION")
 * @param {string} icon - Emoji icon
 * @param {string} description - Short description
 * @param {string} details - Detailed pedagogical text
 * @param {string} color - Theme color
 * @param {array} position - [x, y, z]
 * @param {array} rotation - [x, y, z]
 */
const NirdPanel = ({ title, icon, description, details, color, position, rotation, scale = 1, type = 'panel' }) => {
  const [active, setActive] = useState(false);
  const [hovered, setHovered] = useState(false);

  const { springScale, emissiveIntensity } = useSpring({
    springScale: active ? 1.1 : hovered ? 1.05 : 1,
    emissiveIntensity: active ? 2 : hovered ? 1 : 0.3,
    config: { tension: 300, friction: 20 }
  });

  // Dimensions based on type
  const width = type === 'banner' ? 3 : 1.4;
  const height = type === 'banner' ? 1 : 1.8;
  const depth = 0.1;

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Panel Base */}
      <animated.mesh 
        scale={springScale}
        onClick={(e) => { e.stopPropagation(); setActive(!active); }}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
        onPointerOut={(e) => { e.stopPropagation(); setHovered(false); document.body.style.cursor = 'default'; }}
      >
        <boxGeometry args={[depth, height, width]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.5} metalness={0.8} />
      </animated.mesh>

      {/* Glowing Frame */}
      <mesh position={[depth/2 + 0.01, 0, 0]}>
        <boxGeometry args={[0.01, height - 0.1, width - 0.1]} />
        <animated.meshStandardMaterial 
          color={color} 
          emissive={color} 
          emissiveIntensity={emissiveIntensity} 
        />
      </mesh>

      {/* Content Surface */}
      <mesh position={[depth/2 + 0.02, 0, 0]}>
        <planeGeometry args={[width - 0.2, height - 0.2]} />
        <meshBasicMaterial color="#1a1a1a" />
      </mesh>

      {/* HTML Content */}
      <Html 
        transform 
        occlude 
        position={[depth/2 + 0.03, 0, 0]} 
        rotation={[0, Math.PI / 2, 0]}
        scale={0.15}
        style={{
          userSelect: 'none',
          pointerEvents: 'auto', // Enable clicks on HTML
        }}
      >
        <div 
          onClick={(e) => {
            e.stopPropagation();
            setActive(!active);
          }}
          style={{
          width: type === 'banner' ? '1800px' : '800px',
          height: type === 'banner' ? '500px' : '1000px',
          padding: '40px',
          background: `linear-gradient(135deg, rgba(20,20,30,0.95) 0%, ${color}22 100%)`,
          border: `4px solid ${color}`,
          borderRadius: '20px',
          display: 'flex',
          flexDirection: type === 'banner' ? 'row' : 'column',
          alignItems: 'center',
          justifyContent: type === 'banner' ? 'space-around' : 'flex-start',
          textAlign: type === 'banner' ? 'left' : 'center',
          color: 'white',
          fontFamily: "'Segoe UI', sans-serif",
          boxShadow: `0 0 50px ${color}44`
        }}>
          <div style={{ fontSize: type === 'banner' ? '100px' : '120px', marginBottom: type === 'banner' ? 0 : '20px', marginRight: type === 'banner' ? '40px' : 0 }}>{icon}</div>
          
          <div style={{ flex: 1 }}>
            <h2 style={{ 
              fontSize: type === 'banner' ? '90px' : '80px', 
              margin: '0 0 20px 0', 
              color: color,
              textTransform: 'uppercase',
              letterSpacing: '5px',
              borderBottom: type === 'banner' ? 'none' : `4px solid ${color}`,
              paddingBottom: type === 'banner' ? 0 : '20px',
            }}>
              {title}
            </h2>
            
            <p style={{ 
              fontSize: type === 'banner' ? '50px' : '40px', 
              lineHeight: '1.4', 
              marginBottom: type === 'banner' ? 0 : '40px',
              fontWeight: '300' 
            }}>
              {description}
            </p>
          </div>

          {/* Expanded Details - Visible when active */}
          <div style={{
            opacity: active ? 1 : 0,
            transform: active ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.5s ease',
            background: 'rgba(255,255,255,0.1)',
            padding: '30px',
            borderRadius: '15px',
            marginTop: type === 'banner' ? 0 : 'auto',
            marginLeft: type === 'banner' ? '40px' : 0,
            width: type === 'banner' ? '40%' : '100%',
            position: type === 'banner' && !active ? 'absolute' : 'relative',
            pointerEvents: active ? 'auto' : 'none',
          }}>
            <p style={{ fontSize: '32px', lineHeight: '1.5', margin: 0 }}>
              {details}
            </p>
          </div>

          {!active && (
            <div style={{ 
              marginTop: type === 'banner' ? 0 : 'auto', 
              fontSize: '30px', 
              color: color, 
              animation: 'pulse 2s infinite',
              position: type === 'banner' ? 'absolute' : 'relative',
              bottom: type === 'banner' ? '20px' : 'auto',
              right: type === 'banner' ? '40px' : 'auto',
            }}>
              ▼ {type === 'banner' ? 'Info' : 'Cliquer pour en savoir plus'}
            </div>
          )}
        </div>
        <style>{`
          @keyframes pulse {
            0% { opacity: 0.5; }
            50% { opacity: 1; }
            100% { opacity: 0.5; }
          }
        `}</style>
      </Html>
      
      {/* Light Source */}
      <pointLight position={[0.5, 0, 0]} color={color} intensity={0.5} distance={3} />
    </group>
  );
};

export default NirdPanel;
