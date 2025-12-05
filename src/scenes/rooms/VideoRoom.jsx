import { useState } from 'react';
import { Html } from '@react-three/drei';
import { ScreenGlow, DustParticles } from '../../effects/AtmosphericEffects';

/**
 * Video Room - Educational media center
 * Features a projection screen and computer control
 * Now integrated directly into the hallway
 */
function VideoRoom(props) {
    const [currentVideo, setCurrentVideo] = useState(null);

    // When video is playing, we'll disable some effects for performance

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

    return (
        <group {...props}>
            {/* Local Lighting for the room */}
            <pointLight position={[0, 3, 0]} intensity={1} distance={10} color="#ffffff" />
            <ambientLight intensity={0.2} />

            {/* Floor removed - using hallway floor instead */}


            {/* Walls - Open front (z-positive is entrance) */}
            {/* Back Wall */}
            <mesh position={[0, 2.5, -7]}>
                <boxGeometry args={[14, 5, 0.2]} />
                <meshStandardMaterial color="#1a1a25" roughness={0.8} />
            </mesh>
            {/* Left Wall */}
            <mesh position={[-6.5, 2.5, -0.5]}>
                <boxGeometry args={[0.2, 5, 14.25]} />
                <meshStandardMaterial color="#1a1a25" roughness={0.8} />
            </mesh>
            {/* Right Wall */}
            <mesh position={[6.5, 2.5, -0.5]}>
                <boxGeometry args={[0.2, 5, 14.25]} />
                <meshStandardMaterial color="#1a1a25" roughness={0.8} />
            </mesh>

            {/* Ceiling */}
            <mesh position={[0, 5, 0]}>
                <boxGeometry args={[14, 0.2, 14]} />
                <meshStandardMaterial color="#0d0d12" />
            </mesh>

            {/* Projection Screen */}
            <group position={[0, 2.5, -6.8]}>
                <mesh>
                    <planeGeometry args={[8, 4.5]} />
                    <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.1} />
                </mesh>

                {/* Video Selection UI - shown when no video is playing */}
                {!currentVideo && (
                    <Html
                        transform
                        position={[0, 0, 0.1]}
                        occlude
                        distanceFactor={4.5}
                    >
                        <div style={{
                            background: 'rgba(0, 26, 51, 0.95)',
                            padding: '40px',
                            borderRadius: '15px',
                            width: '700px',
                            color: 'white',
                            fontFamily: 'monospace',
                            textAlign: 'center'
                        }}>
                            <h2 style={{ margin: '0 0 30px 0', fontSize: '42px', borderBottom: '3px solid #00aaff', paddingBottom: '15px' }}>Sélection Vidéo</h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                {videos.map(video => (
                                    <button
                                        key={video.id}
                                        onClick={() => setCurrentVideo(video)}
                                        style={{
                                            background: '#004466',
                                            border: '2px solid #00aaff',
                                            padding: '25px 30px',
                                            color: 'white',
                                            cursor: 'pointer',
                                            fontSize: '32px',
                                            borderRadius: '10px',
                                            transition: 'all 0.2s'
                                        }}
                                        onMouseOver={(e) => e.target.style.background = '#00aaff'}
                                        onMouseOut={(e) => e.target.style.background = '#004466'}
                                    >
                                        ▶ {video.title}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </Html>
                )}

                {/* Video Content with Stop Button */}
                {currentVideo && (
                    <Html
                        transform
                        position={[0, 0, 0.1]}
                        occlude
                        distanceFactor={4.5}
                    >
                        <div style={{ position: 'relative' }}>
                            <div style={{ width: '600px', height: '340px', background: 'black' }}>
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
                                    bottom: '-60px',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    background: '#ff4444',
                                    border: 'none',
                                    padding: '15px 40px',
                                    color: 'white',
                                    cursor: 'pointer',
                                    fontSize: '24px',
                                    borderRadius: '8px'
                                }}
                            >
                                ⏹ Arrêter
                            </button>
                        </div>
                    </Html>
                )}
            </group>

            {/* 4 Rows of Chairs */}
            {Array.from({ length: 4 }).map((_, row) => (
                <group key={`row-${row}`} position={[0, 0, -1 + row * 2]}>
                    {/* 4 Chairs per row */}
                    {[-3, -1, 1, 3].map((x, col) => (
                        <group key={`chair-${row}-${col}`} position={[x, 0, 0]}>
                            {/* Seat */}
                            <mesh position={[0, 0.4, 0]} castShadow>
                                <boxGeometry args={[0.5, 0.1, 0.5]} />
                                <meshStandardMaterial color="#2a2a35" />
                            </mesh>
                            {/* Backrest */}
                            <mesh position={[0, 0.8, 0.23]} rotation={[-0.1, 0, 0]} castShadow>
                                <boxGeometry args={[0.5, 0.5, 0.05]} />
                                <meshStandardMaterial color="#2a2a35" />
                            </mesh>
                            {/* Legs */}
                            {[[-0.2, -0.2], [0.2, -0.2], [-0.2, 0.2], [0.2, 0.2]].map(([lx, lz], i) => (
                                <mesh key={i} position={[lx, 0.2, lz]}>
                                    <cylinderGeometry args={[0.03, 0.03, 0.4]} />
                                    <meshStandardMaterial color="#1a1a1a" />
                                </mesh>
                            ))}
                        </group>
                    ))}
                </group>
            ))}

        </group>
    );
}

export default VideoRoom;
