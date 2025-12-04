import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import useRefurbishmentStore, { REFURBISHMENT_STATIONS } from '../core/RefurbishmentGameState';

/**
 * MasterGuidePC - The front desk PC that gives instructions
 * Starts the game and shows current progress
 */
function MasterGuidePC({ position = [0, 0, 4] }) {
  const screenRef = useRef();
  const { 
    currentStationIndex, 
    startGame, 
    completedStations, 
    isGameComplete,
    score,
    getCurrentStation,
    activeMiniGame
  } = useRefurbishmentStore();
  
  const gameStarted = currentStationIndex !== null;
  const currentStation = getCurrentStation();
  const isMiniGameOpen = activeMiniGame !== null;
  
  // Animate screen glow
  useFrame((state) => {
    if (screenRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.2 + 0.8;
      screenRef.current.material.emissiveIntensity = pulse;
    }
  });
  
  const handleClick = (e) => {
    e.stopPropagation();
    if (!gameStarted) {
      startGame();
    }
  };
  
  return (
    <group position={position}>
      {/* Large desk */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[3, 0.12, 1.2]} />
        <meshStandardMaterial
          color="#2a2a3a"
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>
      
      {/* Desk legs */}
      {[[-1.3, -0.5], [1.3, -0.5], [-1.3, 0.5], [1.3, 0.5]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.25, z]} castShadow>
          <boxGeometry args={[0.08, 0.5, 0.08]} />
          <meshStandardMaterial color="#1a1a25" metalness={0.8} />
        </mesh>
      ))}
      
      {/* Large monitor */}
      <group position={[0, 1.1, -0.3]}>
        <mesh castShadow onClick={handleClick}
          onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
          onPointerOut={() => { document.body.style.cursor = 'default'; }}
        >
          <boxGeometry args={[2, 1.2, 0.08]} />
          <meshStandardMaterial
            color="#0a0a0a"
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>
        
        {/* Screen */}
        <mesh position={[0, 0, 0.045]} ref={screenRef}>
          <planeGeometry args={[1.85, 1.05]} />
          <meshStandardMaterial
            color={isGameComplete ? '#00ff88' : '#00aaff'}
            emissive={isGameComplete ? '#00ff88' : '#00aaff'}
            emissiveIntensity={0.7}
          />
        </mesh>
        
        {/* Monitor stand */}
        <mesh position={[0, -0.7, 0.15]} castShadow>
          <boxGeometry args={[0.15, 0.4, 0.2]} />
          <meshStandardMaterial color="#0a0a0a" metalness={0.8} />
        </mesh>
        <mesh position={[0, -0.9, 0.15]} castShadow>
          <cylinderGeometry args={[0.3, 0.3, 0.03, 16]} />
          <meshStandardMaterial color="#0a0a0a" metalness={0.8} />
        </mesh>
      </group>
      
      {/* Keyboard */}
      <mesh position={[0, 0.57, 0.3]} castShadow>
        <boxGeometry args={[0.8, 0.025, 0.25]} />
        <meshStandardMaterial color="#1a1a20" metalness={0.5} />
      </mesh>
      
      {/* Screen glow light */}
      <pointLight 
        position={[0, 1.1, 0.5]} 
        intensity={1} 
        color={isGameComplete ? '#00ff88' : '#00aaff'} 
        distance={5} 
      />
      
      {/* UI Panel above - hidden when mini-game is open */}
      {!isMiniGameOpen && (
      <Html
        position={[0, 2.2, 0]}
        center
        distanceFactor={5}
        style={{ pointerEvents: gameStarted ? 'none' : 'auto' }}
      >
        <div style={{
          background: 'linear-gradient(145deg, rgba(0, 20, 40, 0.95), rgba(0, 10, 30, 0.98))',
          border: `2px solid ${isGameComplete ? '#00ff88' : '#00aaff'}`,
          borderRadius: '16px',
          padding: '20px 30px',
          minWidth: '320px',
          textAlign: 'center',
          fontFamily: 'monospace',
          boxShadow: `0 0 30px ${isGameComplete ? '#00ff8866' : '#00aaff66'}`,
        }}>
          {!gameStarted ? (
            <>
              <div style={{ fontSize: '28px', marginBottom: '10px' }}>🖥️</div>
              <h2 style={{ 
                color: '#00aaff', 
                margin: '0 0 10px 0',
                fontSize: '20px',
                textTransform: 'uppercase',
                letterSpacing: '2px'
              }}>
                La Chasse au Reconditionnement
              </h2>
              <p style={{ color: '#aaa', margin: '0 0 15px 0', fontSize: '13px' }}>
                Apprenez à reconditionner un PC en 6 étapes !
              </p>
              <button
                onClick={handleClick}
                style={{
                  background: 'linear-gradient(135deg, #00aaff, #0066cc)',
                  border: 'none',
                  borderRadius: '25px',
                  color: 'white',
                  padding: '12px 30px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  fontFamily: 'inherit',
                }}
                onMouseOver={(e) => e.target.style.transform = 'scale(1.1)'}
                onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
              >
                🎮 COMMENCER
              </button>
            </>
          ) : isGameComplete ? (
            <>
              <div style={{ fontSize: '48px', marginBottom: '10px' }}>🎉</div>
              <h2 style={{ 
                color: '#00ff88', 
                margin: '0 0 10px 0',
                fontSize: '22px'
              }}>
                FÉLICITATIONS !
              </h2>
              <p style={{ color: '#fff', margin: '0 0 10px 0', fontSize: '14px' }}>
                Vous avez appris à reconditionner un PC !
              </p>
              <div style={{
                background: 'rgba(0, 255, 136, 0.2)',
                padding: '10px 20px',
                borderRadius: '10px',
                color: '#00ff88',
                fontSize: '18px',
                fontWeight: 'bold'
              }}>
                Score: {score} points
              </div>
              <div style={{ 
                marginTop: '15px', 
                fontSize: '12px', 
                color: '#aaa',
                lineHeight: '1.6'
              }}>
                💚 Vous savez maintenant collecter, diagnostiquer,<br/>
                effacer, réparer, installer Linux et redistribuer !
              </div>
            </>
          ) : (
            <>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                gap: '10px',
                marginBottom: '15px'
              }}>
                <span style={{ fontSize: '32px' }}>{currentStation?.icon}</span>
                <div>
                  <div style={{ color: '#888', fontSize: '11px' }}>ÉTAPE {currentStationIndex + 1}/6</div>
                  <div style={{ color: currentStation?.color, fontSize: '18px', fontWeight: 'bold' }}>
                    {currentStation?.name}
                  </div>
                </div>
              </div>
              
              <p style={{ color: '#fff', margin: '0 0 15px 0', fontSize: '13px' }}>
                {currentStation?.lesson}
              </p>
              
              {/* Progress dots */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                {REFURBISHMENT_STATIONS.map((station, i) => (
                  <div
                    key={station.id}
                    style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      background: completedStations.includes(station.id) 
                        ? '#00ff88' 
                        : (i === currentStationIndex ? station.color : '#333'),
                      border: i === currentStationIndex ? `2px solid ${station.color}` : 'none',
                      transition: 'all 0.3s'
                    }}
                  />
                ))}
              </div>
              
              <div style={{ marginTop: '12px', color: '#666', fontSize: '11px' }}>
                👆 Trouvez le PC qui brille et cliquez dessus !
              </div>
            </>
          )}
        </div>
      </Html>
      )}
      
      {/* "GUIDE" Label on desk - hidden when mini-game is open */}
      {!isMiniGameOpen && (
      <Html
        position={[0, 0.65, 0.5]}
        center
        distanceFactor={8}
        style={{ pointerEvents: 'none' }}
      >
        <div style={{
          background: 'rgba(0, 170, 255, 0.9)',
          padding: '4px 12px',
          borderRadius: '4px',
          color: '#fff',
          fontWeight: 'bold',
          fontSize: '11px',
          fontFamily: 'monospace',
          letterSpacing: '2px'
        }}>
          🎓 GUIDE
        </div>
      </Html>
      )}
    </group>
  );
}

export default MasterGuidePC;
