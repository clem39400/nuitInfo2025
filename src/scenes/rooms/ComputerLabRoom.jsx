import RoomBase from './RoomBase';
import { DustParticles, FlickeringLight } from '../../effects/AtmosphericEffects';
import { ReflectiveFloor } from '../../components/Environment';
import RefurbishmentWorkstation from '../../components/RefurbishmentWorkstation';
import useRefurbishmentStore, { REFURBISHMENT_STATIONS } from '../../core/RefurbishmentGameState';
// Real 3D Models from Kenney Furniture Kit
import Desk from '../../components/models/Desk';
import Chair from '../../components/models/Chair';
import { Trashcan, Books, PottedPlant } from '../../components/models/Props';
import Door from '../../components/Door';
import { Teacher } from '../../components/models/Person';
import { useState } from 'react';
import { Html } from '@react-three/drei';
import useGameStore from '../../core/GameStateContext';
import { useThree } from '@react-three/fiber';
import { tweenCamera } from '../../components/CameraController';

/**
 * Computer Lab Room - PC Refurbishment Treasure Hunt
 * 
 * Players navigate between 6 workstations scattered around the room
 * to learn about PC reconditionnement (refurbishment) in a fun way!
 * 
 * The active station glows to guide players through the hunt.
 */
function ComputerLabRoom() {
  const { openMiniGame, startGame, currentStationIndex, completedStations, isGameComplete, score, getCurrentStation, activeMiniGame } = useRefurbishmentStore();
  const [interactionStep, setInteractionStep] = useState(0); // 0: Help, 1: Mission
  const { exitRoom, setTransitioning } = useGameStore();
  const { camera } = useThree();

  const gameStarted = currentStationIndex !== null;
  const currentStation = getCurrentStation();
  const isMiniGameOpen = activeMiniGame !== null;

  const handleBackToHallway = () => {
    setTransitioning(true);
    tweenCamera(
      camera,
      { x: 0, y: 1.6, z: 5 },
      { x: 0, y: 1.6, z: 0 },
      2,
      () => {
        exitRoom();
      }
    );
  };

  return (
    <RoomBase lightingPreset="lab" showBackButton={false}>
      {/* Solid floor base */}
      <mesh position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[16, 16]} />
        <meshStandardMaterial color="#0a0a12" roughness={0.9} />
      </mesh>

      {/* Reflective floor with subtle grid pattern */}
      <ReflectiveFloor
        position={[0, 0, 0]}
        size={[16, 16]}
        color="#0a0a12"
        roughness={0.12}
        metalness={0.9}
        mirror={0.6}
      />

      {/* Floating particles for atmosphere */}
      <DustParticles count={80} spread={12} color="#66aaff" />

      {/* ========== WALLS ========== */}
      {/* Back wall */}
      <mesh position={[0, 2.5, -8]}>
        <boxGeometry args={[16, 5, 0.2]} />
        <meshStandardMaterial color="#12121a" roughness={0.85} />
      </mesh>
      {/* Left wall */}
      <mesh position={[-8, 2.5, 0]}>
        <boxGeometry args={[0.2, 5, 16]} />
        <meshStandardMaterial color="#12121a" roughness={0.85} />
      </mesh>
      {/* Right wall */}
      <mesh position={[8, 2.5, 0]}>
        <boxGeometry args={[0.2, 5, 16]} />
        <meshStandardMaterial color="#12121a" roughness={0.85} />
      </mesh>
      {/* Front wall - solid */}
      <mesh position={[0, 2.5, 8]}>
        <boxGeometry args={[16, 5, 0.2]} />
        <meshStandardMaterial color="#12121a" roughness={0.85} />
      </mesh>

      {/* Return Door - Behind the user */}
      <Door
        position={[0, 0, 7.9]}
        rotation={[0, Math.PI, 0]}
        label="Retour au Couloir"
        onCustomClick={handleBackToHallway}
      />

      {/* ========== CEILING ========== */}
      <mesh position={[0, 5, 0]}>
        <boxGeometry args={[16, 0.2, 16]} />
        <meshStandardMaterial color="#0a0a0f" />
      </mesh>

      {/* Ceiling lights */}
      <FlickeringLight position={[-4, 4.5, -3]} intensity={1.2} />
      <FlickeringLight position={[4, 4.5, -3]} intensity={1.2} />
      <FlickeringLight position={[-4, 4.5, 3]} intensity={1.2} />
      <FlickeringLight position={[4, 4.5, 3]} intensity={1.2} />

      {/* ========== DECORATIVE ELEMENTS ========== */}
      {/* Neon strip on back wall - "SALLE INFORMATIQUE" vibe */}
      <mesh position={[0, 4.2, -7.85]}>
        <boxGeometry args={[8, 0.1, 0.05]} />
        <meshStandardMaterial
          color="#00aaff"
          emissive="#00aaff"
          emissiveIntensity={0.8}
        />
      </mesh>
      <pointLight position={[0, 4.2, -7]} intensity={0.6} color="#00aaff" distance={6} />

      {/* Floor cable channels */}
      {[-3, 0, 3].map((x, i) => (
        <mesh key={i} position={[x, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.3, 14]} />
          <meshStandardMaterial color="#1a1a22" metalness={0.8} />
        </mesh>
      ))}

      {/* ========== 6 REFURBISHMENT WORKSTATIONS - Scattered! ========== */}
      {REFURBISHMENT_STATIONS.map((station) => (
        <RefurbishmentWorkstation
          key={station.id}
          station={station}
          onInteract={(stationId) => openMiniGame(stationId)}
        />
      ))}

      {/* ========== TEACHER NPC - Replaces MasterGuidePC ========== */}
      {/* Replaces the desk at [0, 0, 5.5]. Teacher faces towards the door (Z > 0) */}
      <group
        position={[0, -0.1, 3.5]}
        rotation={[0, 0, 0]}
        onClick={(e) => {
          e.stopPropagation();
          // Switch to mission view on interaction if not started
          if (interactionStep === 0) {
            setInteractionStep(1);
          }
        }}
        onPointerOver={() => document.body.style.cursor = 'pointer'}
        onPointerOut={() => document.body.style.cursor = 'default'}
      >
        <Teacher scale={1.2} />

        {/* Step 0: Initial Help Message */}
        {!gameStarted && interactionStep === 0 && (
          <Html position={[0, 2.3, 0]} center distanceFactor={8} style={{ pointerEvents: 'none' }}>
            <div style={{
              background: 'white',
              padding: '10px 15px',
              borderRadius: '20px',
              border: '2px solid #333',
              position: 'relative',
              whiteSpace: 'nowrap',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            }}>
              {/* Speech triangle */}
              <div style={{
                position: 'absolute',
                bottom: '-10px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: 0,
                height: 0,
                borderLeft: '8px solid transparent',
                borderRight: '8px solid transparent',
                borderTop: '10px solid #333'
              }} />
              <div style={{
                position: 'absolute',
                bottom: '-6px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: 0,
                height: 0,
                borderLeft: '6px solid transparent',
                borderRight: '6px solid transparent',
                borderTop: '8px solid white'
              }} />

              <p style={{ margin: 0, fontWeight: 'bold', color: '#333', fontSize: '14px' }}>
                👋 Bonjour, j'ai besoin d'aide !
              </p>
            </div>
          </Html>
        )}

        {/* Main Interface: Start Screen OR Game Progress OR Success */}
        {/* Visible if (Start Step is active) OR (Game is Running) */}
        {((!gameStarted && interactionStep === 1) || gameStarted) && !isMiniGameOpen && (
          <Html position={[0, 2.7, 0]} center distanceFactor={7}>
            <div style={{
              background: 'linear-gradient(145deg, rgba(0, 20, 40, 0.95), rgba(0, 10, 30, 0.98))',
              border: `2px solid ${isGameComplete ? '#00ff88' : '#00aaff'}`,
              borderRadius: '16px',
              padding: '20px 30px',
              minWidth: '320px',
              textAlign: 'center',
              fontFamily: 'monospace',
              boxShadow: `0 0 30px ${isGameComplete ? '#00ff8866' : '#00aaff66'}`,
              color: 'white',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px'
            }}>
              {/* Triangle for speech bubble tail */}
              <div style={{
                position: 'absolute',
                bottom: '-12px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: 0,
                height: 0,
                borderLeft: '10px solid transparent',
                borderRight: '10px solid transparent',
                borderTop: `12px solid ${isGameComplete ? '#00ff88' : '#00aaff'}`
              }} />
              <div style={{
                position: 'absolute',
                bottom: '-8px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: 0,
                height: 0,
                borderLeft: '8px solid transparent',
                borderRight: '8px solid transparent',
                borderTop: '10px solid #001428'
              }} />

              {!gameStarted ? (
                /* --- START SCREEN --- */
                <>
                  <div style={{ fontSize: '32px' }}>🖥️</div>
                  <h3 style={{
                    margin: '0',
                    color: '#00aaff',
                    fontSize: '18px',
                    textTransform: 'uppercase',
                    letterSpacing: '2px',
                    fontWeight: 'bold',
                    lineHeight: '1.4'
                  }}>
                    LA CHASSE AU<br />RECONDITIONNEMENT
                  </h3>
                  <p style={{ color: '#aaa', margin: '0', fontSize: '14px' }}>
                    Apprenez à reconditionner un PC en<br />6 étapes !
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      startGame();
                    }}
                    style={{
                      background: 'linear-gradient(135deg, #00aaff, #0066cc)',
                      border: 'none',
                      borderRadius: '25px',
                      color: 'white',
                      padding: '10px 25px',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      marginTop: '5px'
                    }}
                    onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                    onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                  >
                    <span>🎮</span> COMMENCER
                  </button>
                </>
              ) : isGameComplete ? (
                /* --- SUCCESS SCREEN --- */
                <>
                  <div style={{ fontSize: '42px' }}>🎉</div>
                  <h2 style={{ color: '#00ff88', margin: '0', fontSize: '20px' }}>
                    FÉLICITATIONS !
                  </h2>
                  <p style={{ color: '#fff', margin: '0', fontSize: '13px' }}>
                    Vous avez appris à reconditionner un PC !
                  </p>
                  <div style={{
                    background: 'rgba(0, 255, 136, 0.2)',
                    padding: '8px 16px',
                    borderRadius: '10px',
                    color: '#00ff88',
                    fontSize: '16px',
                    fontWeight: 'bold'
                  }}>
                    Score: {score} points
                  </div>
                  <div style={{ marginTop: '5px', fontSize: '11px', color: '#aaa', lineHeight: '1.4' }}>
                    💚 Vous savez maintenant collecter, diagnostiquer,<br />
                    effacer, réparer, installer Linux et redistribuer !
                  </div>
                </>
              ) : (
                /* --- PROGRESS SCREEN --- */
                <>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    width: '100%'
                  }}>
                    <span style={{ fontSize: '28px' }}>{currentStation?.icon}</span>
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ color: '#888', fontSize: '10px' }}>ÉTAPE {currentStationIndex + 1}/6</div>
                      <div style={{ color: currentStation?.color, fontSize: '16px', fontWeight: 'bold' }}>
                        {currentStation?.name}
                      </div>
                    </div>
                  </div>

                  <p style={{ color: '#fff', margin: '0', fontSize: '12px', lineHeight: '1.4' }}>
                    {currentStation?.lesson}
                  </p>

                  {/* Progress dots */}
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', margin: '5px 0' }}>
                    {REFURBISHMENT_STATIONS.map((station, i) => (
                      <div
                        key={station.id}
                        style={{
                          width: '10px',
                          height: '10px',
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

                  <div style={{ color: '#666', fontSize: '10px' }}>
                    👆 Trouvez le PC qui brille et cliquez dessus !
                  </div>
                </>
              )}
            </div>
          </Html>
        )}
      </group>

      {/* ========== REAL 3D FURNITURE - Kenney Assets ========== */}
      {/* Side desks along walls */}
      <Desk position={[6, 0, 0]} rotation={[0, -Math.PI / 2, 0]} scale={1.2} />
      <Desk position={[6, 0, -3]} rotation={[0, -Math.PI / 2, 0]} scale={1.2} />
      <Chair position={[5.2, 0, 0]} rotation={[0, Math.PI / 2, 0]} scale={1.2} variant="desk" />
      <Chair position={[5.2, 0, -3]} rotation={[0, Math.PI / 2, 0]} scale={1.2} variant="desk" />

      {/* Props for decoration */}
      <Trashcan position={[-6.5, 0, 6]} scale={1.5} />
      <Trashcan position={[6.5, 0, -6]} scale={1.5} />
      <Books position={[-5.3, 0.85, -5.2]} rotation={[0, 0.3, 0]} scale={1.2} />
      <Books position={[6.2, 0.85, 0.2]} rotation={[0, -0.5, 0]} scale={1.2} />
      <PottedPlant position={[-7, 0, -7]} scale={2} />
      <PottedPlant position={[7, 0, 6]} scale={2} />

      {/* ========== AMBIENT LIGHTING ========== */}
      {/* General ambient */}
      <ambientLight intensity={0.15} color="#6688aa" />

      {/* Blue tech glow from center */}
      <pointLight position={[0, 2, 0]} intensity={0.4} color="#0066dd" distance={12} />

      {/* Colored accent lights in corners */}
      <pointLight position={[-6, 0.5, -6]} intensity={0.3} color="#ff9500" distance={4} />
      <pointLight position={[6, 0.5, -6]} intensity={0.3} color="#00d4ff" distance={4} />
      <pointLight position={[-6, 0.5, 2]} intensity={0.3} color="#ff3366" distance={4} />
      <pointLight position={[6, 0.5, 2]} intensity={0.3} color="#cc66ff" distance={4} />
    </RoomBase>
  );
}

export default ComputerLabRoom;
