import { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Text, Html, ContactShadows, Environment } from '@react-three/drei';
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
                {/* Notebook Cover */}
                <mesh position={[0, 0, 0]}>
                    <boxGeometry args={[1.5, 2, 0.1]} />
                    <meshStandardMaterial color="#4a3a2a" roughness={0.8} />
                </mesh>

                {/* Pages */}
                <mesh position={[0, 0, 0.06]}>
                    <boxGeometry args={[1.4, 1.9, 0.05]} />
                    <meshStandardMaterial color="#f0e6d2" />
                </mesh>

                {/* Spiral binding */}
                <mesh position={[-0.7, 0, 0.05]}>
                    <cylinderGeometry args={[0.05, 0.05, 1.9, 16]} />
                    <meshStandardMaterial color="#222" metalness={0.8} />
                </mesh>

                {/* Label/Text */}
                <group position={[0, 0, 0.1]}>
                    <Text
                        fontSize={0.15}
                        color="#333"
                        position={[0, 0.5, 0]}
                        anchorX="center"
                        anchorY="middle"
                    >
                        GUIDE LINUX
                    </Text>
                    <Text
                        fontSize={0.1}
                        color="#555"
                        position={[0, 0.2, 0]}
                        anchorX="center"
                        anchorY="middle"
                    >
                        (Cliquer pour aide)
                    </Text>

                    {/* Dynamic hint text */}
                    {hovered && (
                        <Html position={[0, -0.5, 0]} center transform>
                            <div style={{
                                background: 'rgba(255, 255, 200, 0.9)',
                                padding: '8px 12px',
                                borderRadius: '4px',
                                fontFamily: 'monospace',
                                fontSize: '12px',
                                color: '#333',
                                border: '1px solid #d4c4a8',
                                boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                                whiteSpace: 'nowrap'
                            }}>
                                Prochaine commande : {currentCommand}
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
        { type: 'info', content: 'C:\\Users\\Etudiant> wsl --install' },
        { type: 'success', content: 'Windows Subsystem for Linux (WSL) est activé... Redémarrage virtuel requis.' },
        { type: 'info', content: '' },
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
        { cmd: 'wsl --install', response: 'Windows Subsystem for Linux (WSL) est activé... Redémarrage virtuel requis.', delay: 1000 }, // Step 0 (Auto-completed in history)
        { cmd: 'wsl -d NuitInfoDistro', response: 'Connexion au serveur du Nexus 🌐...', delay: 1000 },
        { cmd: 'apt update && apt upgrade', response: '[#####] 12% – Récupération des paquets de l\'Éther...\n[###################] 100% – Synchronisation réussie.', delay: 3000 },
        { cmd: 'install linux-express-2025', response: 'Téléchargement du noyau \'Axolotl\' 🦎... [0.5%]\nInstallation des ressources de la Guilde... [45%]\nInstallation terminée.', delay: 4000 },
        { cmd: 'clean --cache', response: 'Nettoyage des fichiers temporaires... OK.', delay: 1000 },
        { cmd: 'uname -a', response: 'Linux NuitInfoDistro 5.15-express #1 SMP [Année 2025]', delay: 1000 },
        { cmd: 'exit', response: 'Déconnexion du Nexus. Installation Linux Express 2025 ✅. Succès.', delay: 1000 }
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
            setTimeout(() => {
                setHistory(prev => [...prev, { type: 'success', content: currentStepConfig.response }]);

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
            }, currentStepConfig.delay);
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
            background: 'rgba(0, 0, 0, 0.9)',
            display: 'flex',
            fontFamily: 'Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace',
        }}>
            {/* Terminal Area (Left 70%) */}
            <div style={{
                flex: '0 0 70%',
                padding: '40px',
                display: 'flex',
                flexDirection: 'column',
                color: '#ccc',
                fontSize: '16px',
                lineHeight: '1.5',
                overflow: 'hidden'
            }}>
                <div style={{
                    flex: 1,
                    overflowY: 'auto',
                    paddingRight: '10px',
                    marginBottom: '20px'
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
                <form onSubmit={handleCommand} style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ color: '#ccc', marginRight: '10px' }}>C:\Users\Etudiant&gt;</span>
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
                flex: '0 0 30%',
                background: 'linear-gradient(to left, #1a1a1a, #000)',
                borderLeft: '1px solid #333',
                position: 'relative'
            }}>
                <button
                    onClick={closeLinuxGame}
                    style={{
                        position: 'absolute',
                        top: '20px',
                        right: '20px',
                        zIndex: 10,
                        background: 'transparent',
                        border: '1px solid #555',
                        color: '#fff',
                        width: '30px',
                        height: '30px',
                        borderRadius: '50%',
                        cursor: 'pointer'
                    }}
                >
                    ×
                </button>

                {/* Canvas temporarily disabled for debugging */}
                {/* <Canvas>
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
        </Canvas> */}

                <div style={{
                    position: 'absolute',
                    bottom: '40px',
                    left: '0',
                    width: '100%',
                    textAlign: 'center',
                    color: '#888',
                    fontSize: '14px'
                }}>
                    Cliquez sur le carnet pour copier la commande
                </div>
            </div>
        </div>
    );
};

export default LinuxTerminalGame;
