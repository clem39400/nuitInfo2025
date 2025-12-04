import { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Text, Html, ContactShadows, Environment, PerspectiveCamera } from '@react-three/drei';
import useGameStore from '../core/GameStateContext';

// 3D Notebook Helper Component
const NotebookHelper = ({ currentCommand, onClick }) => {
    const meshRef = useRef();
    const [hovered, setHovered] = useState(false);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
            meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
        }
    });

    return (
        <group
            ref={meshRef}
            scale={0.85}
            onClick={(e) => {
                e.stopPropagation();
                onClick();
            }}
            onPointerOver={() => {
                setHovered(true);
                document.body.style.cursor = 'pointer';
            }}
            onPointerOut={() => {
                setHovered(false);
                document.body.style.cursor = 'default';
            }}
        >
            <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                {/* Notebook Cover - Dark Blue Leather look */}
                <mesh position={[0, 0, 0]}>
                    <boxGeometry args={[1.5, 2, 0.1]} />
                    <meshStandardMaterial color="#1a2b3c" roughness={0.6} metalness={0.1} />
                </mesh>

                {/* Pages */}
                <mesh position={[0, 0, 0.06]}>
                    <boxGeometry args={[1.4, 1.9, 0.05]} />
                    <meshStandardMaterial color="#f8f9fa" />
                </mesh>

                {/* Spine/Binding - Golden/Orange accent */}
                <mesh position={[-0.7, 0, 0.05]}>
                    <cylinderGeometry args={[0.06, 0.06, 1.95, 16]} />
                    <meshStandardMaterial color="#e67e22" metalness={0.3} roughness={0.4} />
                </mesh>

                {/* Label/Text & Tux Logo */}
                <group position={[0, 0, 0.11]}>
                    {/* Title */}
                    <Text
                        fontSize={0.1}
                        color="#ecf0f1"
                        position={[0, 0.65, 0]}
                        anchorX="center"
                        anchorY="middle"
                        textAlign="center"
                        maxWidth={1.2}
                        lineHeight={1.2}
                    >
                        GUIDE D'INSTALLATION
                        LINUX
                    </Text>

                    {/* Geometric Tux Penguin */}
                    <group position={[0, 0, 0]} scale={0.8}>
                        {/* Body */}
                        <mesh position={[0, 0, 0]}>
                            <capsuleGeometry args={[0.25, 0.4, 4, 8]} />
                            <meshStandardMaterial color="#111" roughness={0.3} />
                        </mesh>
                        {/* Belly */}
                        <mesh position={[0, -0.05, 0.18]} scale={[0.8, 0.6, 0.5]}>
                            <sphereGeometry args={[0.22, 32, 32]} />
                            <meshStandardMaterial color="#fff" roughness={0.8} />
                        </mesh>
                        {/* Eyes */}
                        <group position={[0, 0.15, 0.2]}>
                            <mesh position={[-0.08, 0, 0]}>
                                <sphereGeometry args={[0.06, 16, 16]} />
                                <meshStandardMaterial color="#fff" />
                            </mesh>
                            <mesh position={[0.08, 0, 0]}>
                                <sphereGeometry args={[0.06, 16, 16]} />
                                <meshStandardMaterial color="#fff" />
                            </mesh>
                            <mesh position={[-0.08, 0, 0.05]}>
                                <sphereGeometry args={[0.015, 16, 16]} />
                                <meshStandardMaterial color="#000" />
                            </mesh>
                            <mesh position={[0.08, 0, 0.05]}>
                                <sphereGeometry args={[0.015, 16, 16]} />
                                <meshStandardMaterial color="#000" />
                            </mesh>
                        </group>
                        {/* Beak */}
                        <mesh position={[0, 0.08, 0.25]} rotation={[0.2, 0, 0]}>
                            <coneGeometry args={[0.06, 0.1, 16]} />
                            <meshStandardMaterial color="#f1c40f" />
                        </mesh>
                        {/* Feet */}
                        <group position={[0, -0.35, 0.1]}>
                            <mesh position={[-0.15, 0, 0]} rotation={[-0.2, -0.4, 0]} scale={[1, 0.3, 1.5]}>
                                <sphereGeometry args={[0.1, 16, 16]} />
                                <meshStandardMaterial color="#f1c40f" />
                            </mesh>
                            <mesh position={[0.15, 0, 0]} rotation={[-0.2, 0.4, 0]} scale={[1, 0.3, 1.5]}>
                                <sphereGeometry args={[0.1, 16, 16]} />
                                <meshStandardMaterial color="#f1c40f" />
                            </mesh>
                        </group>
                        {/* Wings/Flippers */}
                        <group position={[0, -0.05, 0]}>
                            <mesh position={[-0.28, 0, 0]} rotation={[0, 0, 0.4]} scale={[0.3, 1, 0.2]}>
                                <sphereGeometry args={[0.25, 16, 16]} />
                                <meshStandardMaterial color="#111" />
                            </mesh>
                            <mesh position={[0.28, 0, 0]} rotation={[0, 0, -0.4]} scale={[0.3, 1, 0.2]}>
                                <sphereGeometry args={[0.25, 16, 16]} />
                                <meshStandardMaterial color="#111" />
                            </mesh>
                        </group>
                    </group>

                    {/* Subtitle */}
                    <Text
                        fontSize={0.07}
                        color="#bdc3c7"
                        position={[0, -0.6, 0]}
                        anchorX="center"
                        anchorY="middle"
                    >
                        (Cliquer pour aide)
                    </Text>

                    {/* Decorative line */}
                    <mesh position={[0, 0.45, 0]}>
                        <planeGeometry args={[1, 0.01]} />
                        <meshBasicMaterial color="#e67e22" />
                    </mesh>

                    {/* Dynamic hint text */}
                    {hovered && (
                        <Html position={[0, -0.8, 0]} center transform scale={0.5}>
                            <div style={{
                                background: 'rgba(255, 255, 200, 0.95)',
                                padding: '6px 10px',
                                borderRadius: '4px',
                                fontFamily: 'monospace',
                                fontSize: '12px',
                                fontWeight: 'bold',
                                color: '#333',
                                border: '1px solid #d4c4a8',
                                boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                                whiteSpace: 'pre-wrap',
                                maxWidth: '200px',
                                textAlign: 'center'
                            }}>
                                {currentCommand}
                            </div>
                        </Html>
                    )}
                </group>
            </Float>
        </group>
    );
};

/**
 * Linux Terminal Mini-Game
 * "Le Baptême du Terminal : Linux Express"
 */
const LinuxTerminalGame = () => {
    const { closeLinuxGame, completePuzzle } = useGameStore();
    const [history, setHistory] = useState([
        { type: 'info', content: 'Microsoft Windows [version 10.0.19045.3693]' },
        { type: 'info', content: '(c) Microsoft Corporation. Tous droits réservés.' },
        { type: 'info', content: '' },
        {
            type: 'success', content: `
  _      _____ _   _ _    _ X   _   ______  __   _______  _____  ______  _____  _____ 
 | |    |_   _| \\ | | |  | | \\ | | |  ____| \\ \\ / /  __ \\|  __ \\|  ____|/ ____|/ ____|
 | |      | | |  \\| | |  | |  \\| | | |__     \\ V /| |__) | |__) | |__  | (___ | (___  
 | |      | | | . \` | |  | | . \` | |  __|     > < |  ___/|  _  /|  __|  \\___ \\ \\___ \\ 
 | |____ _| |_| |\\  | |__| | |\\  | | |____   / . \\| |    | | \\ \\| |____ ____) |____) |
 |______|_____|_| \\_|\\____/|_| \\_| |______| /_/ \\_\\_|    |_|  \\_\\______|_____/|_____/ 
                                                                                      
` },
        { type: 'info', content: '================================================================' },
        { type: 'info', content: ' SYSTEM STATUS: ONLINE' },
        { type: 'info', content: ' CPU: [||||||||||] 12%  |  MEM: [|||||||||||||||] 4.2GB/16GB' },
        { type: 'info', content: ' NETWORK: CONNECTED (NuitInfo_Secure_VLAN)' },
        { type: 'info', content: '================================================================' },
        { type: 'info', content: '' },
        { type: 'info', content: 'C:\\Users\\Etudiant> wsl --install' },
        { type: 'success', content: 'Windows Subsystem for Linux (WSL) est activé... Redémarrage virtuel requis.\n' },
        { type: 'info', content: 'Bienvenue dans le défi Linux Express 2025 !' },
        { type: 'info', content: 'Votre mission : Installer l\'environnement "NuitInfoDistro".' },
        { type: 'info', content: 'Utilisez le carnet à droite si vous êtes bloqué.' },
        { type: 'info', content: '' },
    ]);
    const [input, setInput] = useState('');
    const [step, setStep] = useState(1);
    const [isProcessing, setIsProcessing] = useState(false);
    const inputRef = useRef(null);
    const bottomRef = useRef(null);

    // Game Steps Configuration
    const steps = [
        {
            cmd: 'wsl --install',
            response: [
                { text: 'Windows Subsystem for Linux (WSL) est activé...', delay: 1000 },
                { text: 'Redémarrage virtuel requis.\n', delay: 1000 }
            ]
        },
        {
            cmd: 'wsl -d NuitInfoDistro',
            response: [
                { text: 'Connexion au serveur du Nexus 🌐...', delay: 800 },
                { text: 'Connexion établie.\n', delay: 800 }
            ]
        },
        {
            cmd: 'apt update && apt upgrade',
            response: [
                { text: '[#####] 12% – Récupération des paquets de l\'Éther...', delay: 1000 },
                { text: '[###################] 100% – Synchronisation réussie.', delay: 2000 },
                { text: 'Système à jour.\n', delay: 500 }
            ]
        },
        {
            cmd: 'install linux-express-2025',
            response: [
                { text: 'Téléchargement du noyau de la plateforme de la Machine Virtuelle... [0.5%]', delay: 1000 },
                { text: 'Installation des ressources du Kernel... [45%]', delay: 2000 },
                { text: 'Installation terminée avec succès.\n', delay: 1000 }
            ]
        },
        {
            cmd: 'clean --cache',
            response: [
                { text: 'Nettoyage des fichiers temporaires...', delay: 800 },
                { text: 'Espace libéré : 402MB.', delay: 800 },
                { text: 'OK.\n', delay: 500 }
            ]
        },
        {
            cmd: 'uname -a',
            response: [
                { text: 'Linux NuitInfoDistro 5.15-express #1 SMP [Année 2025]\n', delay: 1000 }
            ]
        },
        {
            cmd: 'exit',
            response: [
                { text: 'Déconnexion du Nexus.', delay: 500 },
                { text: 'Installation Linux Express 2025 ✅.', delay: 500 },
                { text: 'Succès.', delay: 500 },
                { text: 'Fermeture de la session...', delay: 1000 }
            ]
        }
    ];

    // Auto-scroll to bottom
    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: 'smooth' });
        }
        // Focus input
        if (inputRef.current && !isProcessing) {
            inputRef.current.focus();
        }
    }, [history, isProcessing]);

    const handleCommand = async (e) => {
        e.preventDefault();
        if (isProcessing || !input.trim()) return;

        const cmd = input.trim();
        setHistory(prev => [...prev, { type: 'input', content: `C:\\Users\\Etudiant> ${cmd}` }]);
        setInput('');
        setIsProcessing(true);

        // Check command
        const currentStepConfig = steps[step];

        if (cmd === currentStepConfig.cmd) {
            // Correct command
            let totalDelay = 0;
            const responses = Array.isArray(currentStepConfig.response)
                ? currentStepConfig.response
                : [{ text: currentStepConfig.response, delay: currentStepConfig.delay || 1000 }];

            responses.forEach((item, index) => {
                totalDelay += item.delay;
                setTimeout(() => {
                    setHistory(prev => [...prev, { type: 'success', content: item.text }]);

                    // If last item
                    if (index === responses.length - 1) {
                        if (step === steps.length - 1) {
                            // Game Finished
                            setTimeout(() => {
                                completePuzzle('server');
                                closeLinuxGame();
                            }, 2000);
                        } else {
                            setStep(prev => prev + 1);
                            setIsProcessing(false);
                        }
                    }
                }, totalDelay);
            });

        } else {
            // Incorrect command
            setTimeout(() => {
                setHistory(prev => [...prev, { type: 'error', content: `'${cmd}' n'est pas reconnu en tant que commande interne ou externe, un programme exécutable ou un fichier de commandes.` }]);
                setIsProcessing(false);
            }, 500);
        }
    };

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 2000,
            background: 'rgba(0, 0, 0, 0.85)', // Darker overlay
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace',
        }}>
            {/* Game Container - Centered Modal */}
            <div style={{
                width: '1000px',
                height: '600px',
                background: 'rgba(10, 10, 10, 0.95)',
                borderRadius: '12px',
                border: '1px solid #333',
                boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                display: 'flex',
                overflow: 'hidden',
                position: 'relative'
            }}>
                {/* Terminal Area (Left 70%) */}
                <div style={{
                    flex: '0 0 65%',
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    color: '#ccc',
                    fontSize: '14px',
                    lineHeight: '1.5',
                    overflow: 'hidden',
                    borderRight: '1px solid #333'
                }}>
                    {/* Header */}
                    <div style={{
                        marginBottom: '16px',
                        paddingBottom: '8px',
                        borderBottom: '1px solid #333',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <span style={{ color: '#fff', fontWeight: 'bold' }}>Terminal - Administrator</span>
                        <div style={{ display: 'flex', gap: '6px' }}>
                            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ff5555' }}></div>
                            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ffb86c' }}></div>
                            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#50fa7b' }}></div>
                        </div>
                    </div>

                    <div style={{
                        flex: 1,
                        overflowY: 'auto',
                        paddingRight: '10px',
                        marginBottom: '10px'
                    }} onClick={() => inputRef.current?.focus()}>
                        {history.map((line, i) => (
                            <div key={i} style={{
                                marginBottom: '4px',
                                color: line.type === 'error' ? '#ff5555' : line.type === 'success' ? '#00ff88' : '#ccc',
                                whiteSpace: 'pre-wrap'
                            }}>
                                {line.content}
                            </div>
                        ))}
                        {isProcessing && (
                            <div style={{ color: '#00ff88' }}>Traitement en cours...</div>
                        )}
                        <div ref={bottomRef} />
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleCommand} style={{ display: 'flex', alignItems: 'center', background: '#000', padding: '8px', borderRadius: '4px' }}>
                        <span style={{ color: '#00ff88', marginRight: '10px' }}>➜</span>
                        <span style={{ color: '#8be9fd', marginRight: '10px' }}>~</span>
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            disabled={isProcessing}
                            autoFocus
                            style={{
                                flex: 1,
                                background: 'transparent',
                                border: 'none',
                                color: '#fff',
                                fontFamily: 'inherit',
                                fontSize: 'inherit',
                                outline: 'none'
                            }}
                        />
                    </form>
                </div>

                {/* Helper Area (Right 30%) */}
                <div style={{
                    flex: '0 0 35%',
                    background: 'linear-gradient(to bottom, #1a1a1a, #0a0a0a)',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <button
                        onClick={closeLinuxGame}
                        style={{
                            position: 'absolute',
                            top: '12px',
                            right: '12px',
                            zIndex: 10,
                            background: 'rgba(255, 255, 255, 0.1)',
                            border: 'none',
                            color: '#fff',
                            width: '24px',
                            height: '24px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '16px'
                        }}
                    >
                        ×
                    </button>

                    <div style={{ flex: 1, position: 'relative' }}>
                        <Canvas gl={{ alpha: true }}>
                            <PerspectiveCamera makeDefault position={[0, 0, 4]} />
                            <ambientLight intensity={0.5} />
                            <pointLight position={[10, 10, 10]} intensity={1} />
                            <Environment preset="city" />

                            <NotebookHelper
                                currentCommand={steps[step]?.cmd || "Terminé !"}
                                onClick={() => {
                                    if (!isProcessing && steps[step]) {
                                        setInput(steps[step].cmd);
                                        inputRef.current?.focus();
                                    }
                                }}
                            />

                            <ContactShadows position={[0, -1.5, 0]} opacity={0.4} scale={10} blur={2.5} far={4} />
                        </Canvas>
                    </div>

                    <div style={{
                        padding: '16px',
                        textAlign: 'center',
                        color: '#888',
                        fontSize: '12px',
                        borderTop: '1px solid #333',
                        background: '#111'
                    }}>
                        Cliquez sur le carnet pour<br />copier la commande
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LinuxTerminalGame;
