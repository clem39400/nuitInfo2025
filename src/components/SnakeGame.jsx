import React, { useState, useEffect, useRef } from 'react';

/**
 * SnakeGame Component
 * A modular, self-contained Snake game that renders in a modal overlay.
 * 
 * Props:
 * - onClose: () => void - Callback when the game is closed
 * - onWin: () => void - Callback when the win condition is met
 * - winScore: number - Score required to win (default: 10)
 */
const SnakeGame = ({ onClose, onWin, winScore = 10 }) => {
    // Game constants
    const CANVAS_SIZE = 400;
    const GRID_SIZE = 20;
    const SPEED = 100; // Original speed with smooth interpolation

    const HACK_MESSAGES = [
        "Installation de Linux...",
        "Réparation des composants...",
        "Reconditionnement...",
        "Installation de logiciels...",
        "Optimisation du kernel...",
        "Défragmentation du disque...",
        "Compilation du noyau...",
        "Mise à jour des drivers...",
        "Nettoyage du cache...",
        "Overclocking du CPU...",
        "Remplacement de la pâte thermique...",
        "Configuration du firewall...",
        "Analyse antivirus...",
        "Sauvegarde des données...",
        "Cryptage du disque..."
    ];

    // Game state
    const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
    const [food, setFood] = useState({ x: 15, y: 15 });
    // direction state removed to prevent re-renders, using directionRef only
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [gameWon, setGameWon] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [interpolation, setInterpolation] = useState(0); // 0-1 for smooth visual transition
    const [activeMessage, setActiveMessage] = useState("");
    const [messageKey, setMessageKey] = useState(0);

    const canvasRef = useRef(null);
    const directionRef = useRef({ x: 0, y: 0 }); // Ref to avoid closure staleness in interval
    const lastMoveTimeRef = useRef(Date.now());
    const animationFrameRef = useRef(null);

    // Initialize/Reset Game
    const resetGame = () => {
        setSnake([{ x: 10, y: 10 }]);
        setFood(generateFood());
        directionRef.current = { x: 0, y: 0 };
        setScore(0);
        setGameOver(false);
        setGameWon(false);
        setIsPaused(false);
        setGameWon(false);
        setIsPaused(false);
        setActiveMessage("");
    };

    // Generate random food position
    const generateFood = () => {
        return {
            x: Math.floor(Math.random() * (CANVAS_SIZE / GRID_SIZE)),
            y: Math.floor(Math.random() * (CANVAS_SIZE / GRID_SIZE))
        };
    };

    // Handle Keyboard Input
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (gameOver || gameWon) return;

            // Prevent default browser actions (scrolling) and stop propagation to camera controls
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'Escape'].includes(e.key)) {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
            }

            switch (e.key) {
                case 'ArrowUp':
                    if (directionRef.current.y === 0) directionRef.current = { x: 0, y: -1 };
                    break;
                case 'ArrowDown':
                    if (directionRef.current.y === 0) directionRef.current = { x: 0, y: 1 };
                    break;
                case 'ArrowLeft':
                    if (directionRef.current.x === 0) directionRef.current = { x: -1, y: 0 };
                    break;
                case 'ArrowRight':
                    if (directionRef.current.x === 0) directionRef.current = { x: 1, y: 0 };
                    break;
                case 'Escape':
                    onClose();
                    break;
                case ' ': // Space to pause/resume
                    setIsPaused(prev => !prev);
                    break;
                default:
                    break;
            }
        };

        // Use capture phase to intercept events before they reach document/CameraController
        window.addEventListener('keydown', handleKeyDown, { capture: true });
        return () => window.removeEventListener('keydown', handleKeyDown, { capture: true });
    }, [gameOver, gameWon, onClose]);

    // Game Loop
    useEffect(() => {
        if (gameOver || gameWon || isPaused) return;

        const moveSnake = () => {
            // Don't move if no direction set (start of game)
            if (directionRef.current.x === 0 && directionRef.current.y === 0) return;

            setSnake(prevSnake => {
                const newHead = {
                    x: prevSnake[0].x + directionRef.current.x,
                    y: prevSnake[0].y + directionRef.current.y
                };

                // Check Wall Collision
                if (
                    newHead.x < 0 ||
                    newHead.x >= CANVAS_SIZE / GRID_SIZE ||
                    newHead.y < 0 ||
                    newHead.y >= CANVAS_SIZE / GRID_SIZE
                ) {
                    setGameOver(true);
                    return prevSnake;
                }

                // Check Self Collision
                if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
                    setGameOver(true);
                    return prevSnake;
                }

                const newSnake = [newHead, ...prevSnake];

                // Check Food Collision
                if (newHead.x === food.x && newHead.y === food.y) {
                    const newScore = score + 1;
                    setScore(newScore);

                    // Trigger random hack message
                    const randomMsg = HACK_MESSAGES[Math.floor(Math.random() * HACK_MESSAGES.length)];
                    setActiveMessage(randomMsg);
                    setMessageKey(prev => prev + 1);

                    if (newScore >= winScore) {
                        setGameWon(true);
                        setTimeout(() => onWin(), 1500); // Delay slightly to show win screen
                    } else {
                        setFood(generateFood());
                    }
                } else {
                    newSnake.pop(); // Remove tail if not eating
                }

                return newSnake;
            });
        };

        const gameInterval = setInterval(moveSnake, SPEED);
        return () => clearInterval(gameInterval);
    }, [food, gameOver, gameWon, isPaused, score, winScore]);

    // Render Canvas with 3D effects
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const COLS = CANVAS_SIZE / GRID_SIZE;
        const ROWS = CANVAS_SIZE / GRID_SIZE;

        // Clear canvas with dark gradient
        const bgGradient = ctx.createRadialGradient(
            CANVAS_SIZE / 2, CANVAS_SIZE / 2, 0,
            CANVAS_SIZE / 2, CANVAS_SIZE / 2, CANVAS_SIZE
        );
        bgGradient.addColorStop(0, '#0a1020');
        bgGradient.addColorStop(0.5, '#050815');
        bgGradient.addColorStop(1, '#020408');
        ctx.fillStyle = bgGradient;
        ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

        // Draw 3D Grid
        ctx.strokeStyle = 'rgba(0, 255, 136, 0.12)';
        ctx.lineWidth = 1;
        for (let i = 0; i <= COLS; i++) {
            ctx.beginPath();
            ctx.moveTo(i * GRID_SIZE, 0);
            ctx.lineTo(i * GRID_SIZE, CANVAS_SIZE);
            ctx.stroke();
        }
        for (let i = 0; i <= ROWS; i++) {
            ctx.beginPath();
            ctx.moveTo(0, i * GRID_SIZE);
            ctx.lineTo(CANVAS_SIZE, i * GRID_SIZE);
            ctx.stroke();
        }

        // Draw border glow
        ctx.strokeStyle = '#00ff88';
        ctx.lineWidth = 2;
        ctx.shadowBlur = 25;
        ctx.shadowColor = '#00ff88';
        ctx.strokeRect(1, 1, CANVAS_SIZE - 2, CANVAS_SIZE - 2);
        ctx.shadowBlur = 0;

        // Helper function to draw glowing rectangular block with 3D depth
        // offsetX and offsetY are for smooth interpolation
        const drawGlowingBlock = (x, y, color, glowColor, isHead = false, offsetX = 0, offsetY = 0) => {
            const px = x * GRID_SIZE + 1 + offsetX; // Apply interpolation offset
            const py = y * GRID_SIZE + 2 + offsetY; // Apply interpolation offset
            const w = GRID_SIZE - 2; // Reduced width
            const h = GRID_SIZE - 4; // Normal height
            const depth = 12; // Z depth for 3D effect

            // Strong outer glow (Z effect)
            ctx.shadowBlur = 30;
            ctx.shadowColor = glowColor;

            // 3D Right face (depth)
            ctx.fillStyle = isHead ? '#006644' : '#004422';
            ctx.beginPath();
            ctx.moveTo(px + w, py);
            ctx.lineTo(px + w + depth, py - depth * 0.5);
            ctx.lineTo(px + w + depth, py + h - depth * 0.5);
            ctx.lineTo(px + w, py + h);
            ctx.closePath();
            ctx.fill();

            // 3D Top face (depth)
            ctx.fillStyle = isHead ? '#00ffcc' : glowColor;
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(px + depth, py - depth * 0.5);
            ctx.lineTo(px + w + depth, py - depth * 0.5);
            ctx.lineTo(px + w, py);
            ctx.closePath();
            ctx.fill();

            // Main front face with gradient
            const gradient = ctx.createLinearGradient(px, py, px + w, py + h);
            gradient.addColorStop(0, glowColor);
            gradient.addColorStop(0.5, color);
            gradient.addColorStop(1, glowColor);
            ctx.fillStyle = gradient;

            // Draw rounded rectangle for front face
            const radius = 3;
            ctx.beginPath();
            ctx.moveTo(px + radius, py);
            ctx.lineTo(px + w - radius, py);
            ctx.quadraticCurveTo(px + w, py, px + w, py + radius);
            ctx.lineTo(px + w, py + h - radius);
            ctx.quadraticCurveTo(px + w, py + h, px + w - radius, py + h);
            ctx.lineTo(px + radius, py + h);
            ctx.quadraticCurveTo(px, py + h, px, py + h - radius);
            ctx.lineTo(px, py + radius);
            ctx.quadraticCurveTo(px, py, px + radius, py);
            ctx.closePath();
            ctx.fill();

            // Inner highlight
            ctx.shadowBlur = 0;
            ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
            ctx.beginPath();
            ctx.ellipse(px + w * 0.3, py + h * 0.35, w * 0.2, h * 0.2, -0.3, 0, Math.PI * 2);
            ctx.fill();

            // Border glow
            ctx.strokeStyle = glowColor;
            ctx.lineWidth = 2;
            ctx.shadowBlur = 15;
            ctx.shadowColor = glowColor;
            ctx.beginPath();
            ctx.moveTo(px + radius, py);
            ctx.lineTo(px + w - radius, py);
            ctx.quadraticCurveTo(px + w, py, px + w, py + radius);
            ctx.lineTo(px + w, py + h - radius);
            ctx.quadraticCurveTo(px + w, py + h, px + w - radius, py + h);
            ctx.lineTo(px + radius, py + h);
            ctx.quadraticCurveTo(px, py + h, px, py + h - radius);
            ctx.lineTo(px, py + radius);
            ctx.quadraticCurveTo(px, py, px + radius, py);
            ctx.closePath();
            ctx.stroke();
            ctx.shadowBlur = 0;
        };

        // Calculate interpolation offset based on current direction
        const interpOffsetX = directionRef.current.x * interpolation * GRID_SIZE;
        const interpOffsetY = directionRef.current.y * interpolation * GRID_SIZE;

        // Draw Food as 3D mini computer with depth
        const foodPx = food.x * GRID_SIZE + 3;
        const foodPy = food.y * GRID_SIZE + 2;
        const foodW = GRID_SIZE - 6;
        const foodH = GRID_SIZE - 6;
        const pcDepth = 10;

        ctx.shadowBlur = 25;
        ctx.shadowColor = '#ff0088';

        // PC 3D Right face (monitor depth)
        ctx.fillStyle = '#1a0a10';
        ctx.beginPath();
        ctx.moveTo(foodPx + foodW, foodPy);
        ctx.lineTo(foodPx + foodW + pcDepth, foodPy - pcDepth * 0.5);
        ctx.lineTo(foodPx + foodW + pcDepth, foodPy + foodH * 0.7 - pcDepth * 0.5);
        ctx.lineTo(foodPx + foodW, foodPy + foodH * 0.7);
        ctx.closePath();
        ctx.fill();

        // PC 3D Top face (monitor top)
        ctx.fillStyle = '#3a2a30';
        ctx.beginPath();
        ctx.moveTo(foodPx, foodPy);
        ctx.lineTo(foodPx + pcDepth, foodPy - pcDepth * 0.5);
        ctx.lineTo(foodPx + foodW + pcDepth, foodPy - pcDepth * 0.5);
        ctx.lineTo(foodPx + foodW, foodPy);
        ctx.closePath();
        ctx.fill();

        // Monitor body (front)
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(foodPx, foodPy, foodW, foodH * 0.7);

        // Screen with gradient glow
        const screenGradient = ctx.createLinearGradient(foodPx + 1, foodPy + 1, foodPx + foodW - 2, foodPy + foodH * 0.7 - 2);
        screenGradient.addColorStop(0, '#ff0088');
        screenGradient.addColorStop(0.5, '#ff66bb');
        screenGradient.addColorStop(1, '#ff0088');
        ctx.fillStyle = screenGradient;
        ctx.fillRect(foodPx + 1, foodPy + 1, foodW - 2, foodH * 0.7 - 2);

        // Screen reflection
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.fillRect(foodPx + 2, foodPy + 2, foodW / 3, 2);

        // Stand
        ctx.fillStyle = '#333';
        ctx.fillRect(foodPx + foodW / 2 - 1, foodPy + foodH * 0.7, 2, 3);
        ctx.fillStyle = '#444';
        ctx.fillRect(foodPx + foodW / 2 - 3, foodPy + foodH * 0.85, 6, 2);
        ctx.shadowBlur = 0;

        // Draw Snake with glowing blocks (from tail to head)
        for (let index = snake.length - 1; index >= 0; index--) {
            const segment = snake[index];
            const isHead = index === 0;
            const alpha = 1 - (index / (snake.length + 5)) * 0.3;
            const greenValue = Math.floor(200 + 55 * alpha);

            // Apply interpolation offset only to the head for smooth movement
            const segOffsetX = isHead ? interpOffsetX : 0;
            const segOffsetY = isHead ? interpOffsetY : 0;

            if (isHead) {
                drawGlowingBlock(segment.x, segment.y, '#00aa88', '#00ffcc', true, segOffsetX, segOffsetY);

                // Eyes (with interpolation offset)
                const eyeCx = segment.x * GRID_SIZE + GRID_SIZE / 2 + segOffsetX;
                const eyeCy = segment.y * GRID_SIZE + GRID_SIZE / 2 - 2 + segOffsetY;
                ctx.fillStyle = '#ffffff';
                ctx.shadowBlur = 5;
                ctx.shadowColor = '#ffffff';
                ctx.beginPath();
                ctx.arc(eyeCx - 4, eyeCy, 3, 0, Math.PI * 2);
                ctx.arc(eyeCx + 4, eyeCy, 3, 0, Math.PI * 2);
                ctx.fill();

                // Pupils
                ctx.fillStyle = '#000000';
                ctx.shadowBlur = 0;
                ctx.beginPath();
                ctx.arc(eyeCx - 4, eyeCy, 1.5, 0, Math.PI * 2);
                ctx.arc(eyeCx + 4, eyeCy, 1.5, 0, Math.PI * 2);
                ctx.fill();
            } else {
                const bodyColor = `rgba(0, ${greenValue - 50}, ${Math.floor(greenValue * 0.5)}, ${alpha})`;
                const glowColor = `rgba(0, ${greenValue}, ${Math.floor(greenValue * 0.7)}, ${alpha})`;
                drawGlowingBlock(segment.x, segment.y, bodyColor, glowColor);
            }
        }

    }, [snake, food, gameOver, gameWon]);

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 10000,
        }}>
            {/* CSS Animations */}
            <style>{`
                @keyframes alertBlink {
                    0%, 100% { 
                        opacity: 1; 
                        box-shadow: 0 0 30px rgba(255, 68, 68, 1), 0 0 60px rgba(255, 68, 68, 0.8);
                        border-color: #ff0000;
                        background: rgba(60, 0, 0, 0.95);
                    }
                    50% { 
                        opacity: 0.3; 
                        box-shadow: 0 0 5px rgba(255, 68, 68, 0.2);
                        border-color: #660000;
                        background: rgba(20, 0, 0, 0.9);
                    }
                }
                @keyframes textBlink {
                    0%, 100% { opacity: 1; text-shadow: 0 0 15px #ff0000, 0 0 30px #ff0000; color: #ff0000; }
                    50% { opacity: 0.2; text-shadow: none; color: #660000; }
                }
                @keyframes pulse {
                    0%, 100% { box-shadow: 0 0 20px rgba(0, 255, 136, 0.3); }
                    50% { box-shadow: 0 0 40px rgba(0, 255, 136, 0.5); }
                }
                @keyframes messagePop {
                    0% { opacity: 0; transform: translateY(10px) scale(0.9); }
                    20% { opacity: 1; transform: translateY(0) scale(1.1); }
                    80% { opacity: 1; transform: translateY(0) scale(1); }
                    100% { opacity: 0; transform: translateY(-10px) scale(0.9); }
                }
            `}</style>

            <div style={{
                position: 'relative',
                padding: '15px',
                background: 'linear-gradient(145deg, rgba(0, 20, 10, 0.95), rgba(0, 10, 5, 0.98))',
                border: '2px solid #00ff88',
                borderRadius: '10px',
                boxShadow: '0 0 40px rgba(0, 255, 136, 0.3)',
                textAlign: 'center',
                color: '#00ff88',
                fontFamily: "'Courier New', monospace",
                animation: 'pulse 3s infinite ease-in-out',
            }}>
                <h2 style={{ margin: '0 0 15px 0', textShadow: '0 0 10px #00ff88', letterSpacing: '3px' }}>
                    SYSTEM HACK: NIRD.EXE
                </h2>

                <div style={{ marginBottom: '15px', display: 'flex', justifyContent: 'space-between', padding: '8px 15px', background: 'rgba(0, 255, 136, 0.1)', borderRadius: '6px' }}>
                    <span style={{ fontWeight: 'bold' }}>SCORE: {score} / {winScore}</span>
                    <span style={{ color: gameWon ? '#00ffcc' : gameOver ? '#ff4444' : '#00ff88', fontWeight: 'bold' }}>
                        STATUS: {gameWon ? 'ACCESS GRANTED' : gameOver ? 'CRITICAL FAILURE...' : 'RUNNING...'}
                    </span>
                </div>

                {/* Dynamic Hack Message Overlay */}
                <div style={{
                    height: '30px',
                    marginBottom: '10px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    overflow: 'hidden'
                }}>
                    {activeMessage && (
                        <div key={messageKey} style={{
                            color: '#00ffcc',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            textShadow: '0 0 10px #00ffcc',
                            animation: 'messagePop 2s forwards',
                            background: 'rgba(0, 255, 136, 0.1)',
                            padding: '4px 12px',
                            borderRadius: '4px',
                            border: '1px solid rgba(0, 255, 136, 0.3)'
                        }}>
                            {activeMessage}
                        </div>
                    )}
                </div>

                {/* Game Canvas Container with Side Alerts */}
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '8px' }}>

                    {/* Left Side Alerts */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '25px', marginLeft: '-50px' }}>
                        {[
                            { speed: '0.3s', delay: '0s', rotate: '-12deg', marginTop: '0px' },
                            { speed: '0.5s', delay: '0.15s', rotate: '-5deg', marginTop: '30px' },
                        ].map((config, i) => (
                            <div key={`left-${i}`} style={{
                                width: '170px',
                                background: 'rgba(20, 0, 0, 0.95)',
                                border: '3px solid #ff4444',
                                borderRadius: '10px',
                                padding: '18px',
                                textAlign: 'left',
                                animation: `alertBlink ${config.speed} ease-in-out infinite`,
                                animationDelay: config.delay,
                                transform: `rotate(${config.rotate})`,
                                marginTop: config.marginTop,
                            }}>
                                <div style={{ color: '#00ff88', fontSize: '18px', marginBottom: '6px', fontWeight: 'bold' }}>+1</div>
                                <div style={{ color: '#00ff88', fontSize: '14px', fontWeight: 'bold', marginBottom: '4px' }}>SYSTEM HACK:</div>
                                <div style={{
                                    color: '#ff4444',
                                    fontSize: '20px',
                                    fontWeight: 'bold',
                                    lineHeight: '1.2',
                                    animation: `textBlink ${config.speed} ease-in-out infinite`,
                                    animationDelay: config.delay
                                }}>CRITICAL<br />FAILURE</div>
                            </div>
                        ))}
                    </div>

                    {/* Game Canvas with 3D Perspective */}
                    <div style={{
                        position: 'relative',
                        perspective: '800px',
                        perspectiveOrigin: '50% 40%',
                        marginTop: '-40px',
                        marginBottom: '20px',
                    }}>
                        <div style={{
                            position: 'relative',
                            transform: 'rotateX(55deg) rotateZ(-45deg)',
                            transformStyle: 'preserve-3d',
                        }}>
                            {/* Shadow under the platform */}
                            <div style={{
                                position: 'absolute',
                                top: '20px',
                                left: '20px',
                                width: CANVAS_SIZE,
                                height: CANVAS_SIZE,
                                background: 'rgba(0, 255, 136, 0.1)',
                                filter: 'blur(30px)',
                                transform: 'translateZ(-50px)',
                                borderRadius: '10px',
                            }} />

                            <canvas
                                ref={canvasRef}
                                width={CANVAS_SIZE}
                                height={CANVAS_SIZE}
                                style={{
                                    border: '2px solid #00ff88',
                                    borderRadius: '4px',
                                    boxShadow: '0 0 30px rgba(0, 255, 136, 0.3), 0 20px 60px rgba(0, 0, 0, 0.5)',
                                }}
                            />

                            {/* Glowing edges for 3D effect */}
                            <div style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                border: '2px solid rgba(0, 255, 136, 0.5)',
                                borderRadius: '4px',
                                pointerEvents: 'none',
                                boxShadow: 'inset 0 0 20px rgba(0, 255, 136, 0.2)',
                            }} />
                        </div>
                    </div>

                    {/* Right Side Alerts */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '25px', marginRight: '-50px' }}>
                        {[
                            { speed: '0.4s', delay: '0.1s', rotate: '5deg', marginTop: '0px' },
                            { speed: '0.25s', delay: '0s', rotate: '12deg', marginTop: '30px' },
                        ].map((config, i) => (
                            <div key={`right-${i}`} style={{
                                width: '170px',
                                background: 'rgba(20, 0, 0, 0.95)',
                                border: '3px solid #ff4444',
                                borderRadius: '10px',
                                padding: '18px',
                                textAlign: 'left',
                                animation: `alertBlink ${config.speed} ease-in-out infinite`,
                                animationDelay: config.delay,
                                transform: `rotate(${config.rotate})`,
                                marginTop: config.marginTop,
                            }}>
                                <div style={{ color: '#00ff88', fontSize: '18px', marginBottom: '6px', fontWeight: 'bold' }}>+1</div>
                                <div style={{ color: '#00ff88', fontSize: '14px', fontWeight: 'bold', marginBottom: '4px' }}>SYSTEM HACK:</div>
                                <div style={{
                                    color: '#ff4444',
                                    fontSize: '20px',
                                    fontWeight: 'bold',
                                    lineHeight: '1.2',
                                    animation: `textBlink ${config.speed} ease-in-out infinite`,
                                    animationDelay: config.delay
                                }}>CRITICAL<br />FAILURE</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Controls */}
                <div style={{ marginTop: '15px', display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    {!gameOver && !gameWon && (
                        <div style={{ fontSize: '0.75rem', color: 'rgba(0, 255, 136, 0.6)', width: '100%', marginBottom: '10px' }}>
                            Use ARROW KEYS to move • SPACE to pause • Collect computers to hack!
                        </div>
                    )}

                    {gameOver && (
                        <button
                            onClick={resetGame}
                            style={{
                                padding: '10px 20px',
                                background: 'linear-gradient(145deg, #ff0044, #cc0033)',
                                border: 'none',
                                borderRadius: '6px',
                                color: 'white',
                                fontFamily: 'monospace',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                boxShadow: '0 0 15px rgba(255, 0, 68, 0.4)',
                            }}
                        >
                            RETRY_CONNECTION
                        </button>
                    )}

                    <button
                        onClick={onClose}
                        style={{
                            padding: '10px 20px',
                            background: 'transparent',
                            border: '2px solid #00ff88',
                            borderRadius: '6px',
                            color: '#00ff88',
                            fontFamily: 'monospace',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                        }}
                    >
                        ABORT
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SnakeGame;
