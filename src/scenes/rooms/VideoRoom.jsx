import { useState, useRef } from 'react';
import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { DustParticles, FlickeringLight } from '../../effects/AtmosphericEffects';
import { ReflectiveFloor } from '../../components/Environment';
import Chair from '../../components/models/Chair';
import Desk from '../../components/models/Desk';
import { PottedPlant, Trashcan } from '../../components/models/Props';

/**
 * Video Room - School Lecture Hall / Auditorium
 * A proper school projection room with classroom desks, a projector, and whiteboard
 */
function VideoRoom(props) {
    const [currentVideo, setCurrentVideo] = useState(null);
    const projectorLightRef = useRef();
    
    // Subtle projector flicker
    useFrame((state) => {
        if (projectorLightRef.current && currentVideo) {
            projectorLightRef.current.intensity = 1.5 + Math.sin(state.clock.elapsedTime * 8) * 0.1;
        }
    });

    const videos = [
        {
            id: 'youtube1',
            title: 'Vidéo 1',
            url: 'https://www.youtube.com/embed/S6GLqkhykmA',
            type: 'iframe'
        },
        {
            id: 'youtube2',
            title: 'Vidéo 2',
            url: 'https://www.youtube.com/embed/76T8oubek-c',
            type: 'iframe'
        }
    ];

    // School colors
    const wallColor = "#e8e4dc";  // Light beige/cream walls
    const trimColor = "#6a5d4d";  // Wood trim
    const floorColor = "#b8a090"; // Light wood/linoleum

    return (
        <group {...props}>
            {/* ========== LIGHTING - Bright school fluorescent ========== */}
            <ambientLight intensity={0.5} color="#fff8f0" />
            <FlickeringLight position={[-3, 4.2, -2]} intensity={2} />
            <FlickeringLight position={[3, 4.2, -2]} intensity={2} />
            <FlickeringLight position={[0, 4.2, 3]} intensity={2} />
            
            {/* ========== FLOOR - School linoleum ========== */}
            <ReflectiveFloor
                position={[0, 0, 0]}
                size={[14, 14]}
                color={floorColor}
                roughness={0.6}
                metalness={0.1}
                mirror={0.1}
            />

            {/* ========== WALLS - School style ========== */}
            {/* Back Wall with screen */}
            <mesh position={[0, 2.5, -6.9]}>
                <boxGeometry args={[14, 5, 0.2]} />
                <meshStandardMaterial color={wallColor} roughness={0.8} />
            </mesh>
            
            {/* Left Wall */}
            <mesh position={[-6.9, 2.5, 0]}>
                <boxGeometry args={[0.2, 5, 14]} />
                <meshStandardMaterial color={wallColor} roughness={0.8} />
            </mesh>
            
            {/* Right Wall */}
            <mesh position={[6.9, 2.5, 0]}>
                <boxGeometry args={[0.2, 5, 14]} />
                <meshStandardMaterial color={wallColor} roughness={0.8} />
            </mesh>
            
            {/* Floor trim / baseboard */}
            <mesh position={[0, 0.15, -6.85]}>
                <boxGeometry args={[14, 0.3, 0.1]} />
                <meshStandardMaterial color={trimColor} roughness={0.5} />
            </mesh>
            <mesh position={[-6.85, 0.15, 0]}>
                <boxGeometry args={[0.1, 0.3, 14]} />
                <meshStandardMaterial color={trimColor} roughness={0.5} />
            </mesh>
            <mesh position={[6.85, 0.15, 0]}>
                <boxGeometry args={[0.1, 0.3, 14]} />
                <meshStandardMaterial color={trimColor} roughness={0.5} />
            </mesh>

            {/* ========== CEILING ========== */}
            <mesh position={[0, 4.8, 0]}>
                <boxGeometry args={[14, 0.2, 14]} />
                <meshStandardMaterial color="#f0f0f0" />
            </mesh>
            
            {/* Ceiling tiles pattern */}
            {[-4, 0, 4].map((x) => 
                [-4, 0, 4].map((z) => (
                    <mesh key={`tile-${x}-${z}`} position={[x, 4.69, z]}>
                        <boxGeometry args={[3.8, 0.02, 3.8]} />
                        <meshStandardMaterial color="#e8e8e8" />
                    </mesh>
                ))
            )}

            {/* ========== PROJECTOR (mounted on ceiling) ========== */}
            <group position={[0, 4.3, 1]}>
                {/* Projector body */}
                <mesh>
                    <boxGeometry args={[0.5, 0.25, 0.7]} />
                    <meshStandardMaterial color="#d0d0d0" metalness={0.3} roughness={0.5} />
                </mesh>
                
                {/* Projector lens */}
                <mesh position={[0, -0.05, -0.4]}>
                    <cylinderGeometry args={[0.08, 0.1, 0.15, 16]} />
                    <meshStandardMaterial 
                        color="#3a3a4a" 
                        metalness={0.8}
                        emissive={currentVideo ? "#aabbff" : "#333344"}
                        emissiveIntensity={currentVideo ? 0.6 : 0.1}
                    />
                </mesh>
                
                {/* Ceiling mount */}
                <mesh position={[0, 0.2, 0]}>
                    <cylinderGeometry args={[0.08, 0.08, 0.2, 8]} />
                    <meshStandardMaterial color="#888888" />
                </mesh>
                
                {/* Projector beam (only when playing) */}
                {currentVideo && (
                    <spotLight
                        ref={projectorLightRef}
                        position={[0, -0.15, -0.5]}
                        angle={0.4}
                        penumbra={0.2}
                        intensity={1.5}
                        color="#ffffff"
                        distance={10}
                        target-position={[0, 2.2, -6.5]}
                    />
                )}
            </group>

            {/* ========== PROJECTION SCREEN (Pull-down style) ========== */}
            <group position={[0, 2.5, -6.7]}>
                {/* Screen housing (the roll at top) */}
                <mesh position={[0, 1.2, 0]}>
                    <boxGeometry args={[4.2, 0.15, 0.12]} />
                    <meshStandardMaterial color="#cccccc" />
                </mesh>
                
                {/* Screen surface - white projection screen */}
                <mesh position={[0, -0.1, 0.02]}>
                    <planeGeometry args={[3.8, 2.2]} />
                    <meshStandardMaterial 
                        color="#ffffff" 
                        emissive={currentVideo ? "#e8e8ff" : "#f0f0f0"}
                        emissiveIntensity={currentVideo ? 0.15 : 0.02}
                    />
                </mesh>
                
                {/* Screen border */}
                <mesh position={[0, -0.1, 0]}>
                    <boxGeometry args={[4, 2.4, 0.02]} />
                    <meshStandardMaterial color="#222222" />
                </mesh>

                {/* Video Selection UI */}
                {!currentVideo && (
                    <Html
                        transform
                        position={[0, -0.1, 0.05]}
                        occlude
                        distanceFactor={2.5}
                    >
                        <div style={{
                            background: 'rgba(255, 255, 255, 0.95)',
                            padding: '20px',
                            borderRadius: '8px',
                            width: '280px',
                            color: '#333',
                            fontFamily: "'Segoe UI', Arial, sans-serif",
                            textAlign: 'center',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                            border: '2px solid #0066aa'
                        }}>
                            <h2 style={{ 
                                margin: '0 0 15px 0', 
                                fontSize: '20px', 
                                color: '#0066aa'
                            }}>
                                📽️ Sélection Vidéo
                            </h2>
                            <p style={{ color: '#666', marginBottom: '15px', fontSize: '12px' }}>
                                Cliquez pour lancer la projection
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {videos.map(video => (
                                    <button
                                        key={video.id}
                                        onClick={() => setCurrentVideo(video)}
                                        style={{
                                            background: '#0066aa',
                                            border: 'none',
                                            padding: '12px 20px',
                                            color: 'white',
                                            cursor: 'pointer',
                                            fontSize: '14px',
                                            borderRadius: '5px',
                                            transition: 'all 0.2s ease'
                                        }}
                                        onMouseOver={(e) => {
                                            e.target.style.background = '#0088cc';
                                        }}
                                        onMouseOut={(e) => {
                                            e.target.style.background = '#0066aa';
                                        }}
                                    >
                                        ▶ {video.title}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </Html>
                )}

                {/* Video Content */}
                {currentVideo && (
                    <Html
                        transform
                        position={[0, -0.1, 0.05]}
                        occlude
                        distanceFactor={2.5}
                    >
                        <div style={{ position: 'relative' }}>
                            <div style={{ 
                                width: '320px', 
                                height: '180px', 
                                background: 'black',
                                borderRadius: '3px',
                                overflow: 'hidden'
                            }}>
                                <iframe
                                    width="100%"
                                    height="100%"
                                    src={`${currentVideo.url}${currentVideo.url.includes('?') ? '&' : '?'}autoplay=1`}
                                    title={currentVideo.title}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            </div>
                            <button
                                onClick={() => setCurrentVideo(null)}
                                style={{
                                    position: 'absolute',
                                    bottom: '-35px',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    background: '#cc3333',
                                    border: 'none',
                                    padding: '8px 20px',
                                    color: 'white',
                                    cursor: 'pointer',
                                    fontSize: '12px',
                                    borderRadius: '4px'
                                }}
                            >
                                ⏹ Arrêter
                            </button>
                        </div>
                    </Html>
                )}
            </group>

            {/* ========== WHITEBOARD (next to screen) ========== */}
            <group position={[3.5, 2.2, -6.75]}>
                <mesh>
                    <boxGeometry args={[2.5, 1.5, 0.05]} />
                    <meshStandardMaterial color="#ffffff" />
                </mesh>
                {/* Whiteboard frame */}
                <mesh position={[0, 0, -0.02]}>
                    <boxGeometry args={[2.7, 1.7, 0.03]} />
                    <meshStandardMaterial color="#888888" metalness={0.5} />
                </mesh>
                {/* Marker tray */}
                <mesh position={[0, -0.85, 0.1]}>
                    <boxGeometry args={[2.5, 0.08, 0.15]} />
                    <meshStandardMaterial color="#888888" />
                </mesh>
            </group>

            {/* ========== TEACHER'S DESK ========== */}
            <Desk position={[-4.5, 0, -4.5]} rotation={[0, 0, 0]} scale={2} />
            <Chair position={[-4.5, 0, -3.5]} rotation={[0, 0, 0]} scale={1.8} variant="desk" />

            {/* ========== STUDENT DESKS & CHAIRS - 3 rows of 3 ========== */}
            {[0.5, 2.5, 4.5].map((z, row) => (
                <group key={`row-${row}`}>
                    {[-3, 0, 3].map((x, col) => (
                        <group key={`desk-${row}-${col}`} position={[x, 0, z]}>
                            {/* Larger school desk */}
                            <mesh position={[0, 0.4, 0]}>
                                <boxGeometry args={[1.4, 0.05, 0.9]} />
                                <meshStandardMaterial color="#c4a77d" roughness={0.6} />
                            </mesh>
                            {/* Desk frame */}
                            <mesh position={[0, 0.2, 0]}>
                                <boxGeometry args={[1.3, 0.35, 0.8]} />
                                <meshStandardMaterial color="#666666" />
                            </mesh>
                            {/* Desk legs */}
                            <mesh position={[-0.6, 0.2, -0.35]}>
                                <boxGeometry args={[0.05, 0.4, 0.05]} />
                                <meshStandardMaterial color="#444444" />
                            </mesh>
                            <mesh position={[0.6, 0.2, -0.35]}>
                                <boxGeometry args={[0.05, 0.4, 0.05]} />
                                <meshStandardMaterial color="#444444" />
                            </mesh>
                            <mesh position={[-0.6, 0.2, 0.35]}>
                                <boxGeometry args={[0.05, 0.4, 0.05]} />
                                <meshStandardMaterial color="#444444" />
                            </mesh>
                            <mesh position={[0.6, 0.2, 0.35]}>
                                <boxGeometry args={[0.05, 0.4, 0.05]} />
                                <meshStandardMaterial color="#444444" />
                            </mesh>
                            
                            {/* School chair behind desk */}
                            <group position={[0, 0, 0.8]}>
                                {/* Seat */}
                                <mesh position={[0, 0.32, 0]}>
                                    <boxGeometry args={[0.42, 0.04, 0.42]} />
                                    <meshStandardMaterial color="#4477aa" />
                                </mesh>
                                {/* Backrest */}
                                <mesh position={[0, 0.55, 0.18]} rotation={[-0.1, 0, 0]}>
                                    <boxGeometry args={[0.42, 0.4, 0.04]} />
                                    <meshStandardMaterial color="#4477aa" />
                                </mesh>
                                {/* Chair legs */}
                                <mesh position={[-0.17, 0.16, -0.15]}>
                                    <boxGeometry args={[0.04, 0.32, 0.04]} />
                                    <meshStandardMaterial color="#444444" />
                                </mesh>
                                <mesh position={[0.17, 0.16, -0.15]}>
                                    <boxGeometry args={[0.04, 0.32, 0.04]} />
                                    <meshStandardMaterial color="#444444" />
                                </mesh>
                                <mesh position={[-0.17, 0.16, 0.15]}>
                                    <boxGeometry args={[0.04, 0.32, 0.04]} />
                                    <meshStandardMaterial color="#444444" />
                                </mesh>
                                <mesh position={[0.17, 0.16, 0.15]}>
                                    <boxGeometry args={[0.04, 0.32, 0.04]} />
                                    <meshStandardMaterial color="#444444" />
                                </mesh>
                            </group>
                        </group>
                    ))}
                </group>
            ))}

            {/* ========== CLOCK ON WALL ========== */}
            <group position={[-3, 3.8, -6.75]}>
                <mesh>
                    <circleGeometry args={[0.3, 32]} />
                    <meshStandardMaterial color="#ffffff" />
                </mesh>
                <mesh position={[0, 0, -0.02]}>
                    <cylinderGeometry args={[0.32, 0.32, 0.05, 32]} />
                    <meshStandardMaterial color="#333333" />
                </mesh>
            </group>

            {/* ========== TRASH CAN ========== */}
            <Trashcan position={[5.5, 0, -5]} scale={1.5} />
            
            {/* ========== POTTED PLANT ========== */}
            <PottedPlant position={[5.5, 0, 5]} scale={2} />

            {/* ========== DUST MOTES ========== */}
            <DustParticles count={25} spread={8} color="#eeeecc" />
        </group>
    );
}

export default VideoRoom;
