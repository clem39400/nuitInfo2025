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
    const SPEED = 100;

    // Game state
    const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
    const [food, setFood] = useState({ x: 15, y: 15 });
    // direction state removed to prevent re-renders, using directionRef only
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [gameWon, setGameWon] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    const canvasRef = useRef(null);
    const directionRef = useRef({ x: 0, y: 0 }); // Ref to avoid closure staleness in interval

    // Initialize/Reset Game
    const resetGame = () => {
        setSnake([{ x: 10, y: 10 }]);
        setFood(generateFood());
        directionRef.current = { x: 0, y: 0 };
        setScore(0);
        setGameOver(false);
        setGameWon(false);
        setIsPaused(false);
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

    // Render Canvas
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');

        // Clear canvas
        ctx.fillStyle = '#0a0a15'; // Dark background
        ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

        // Draw Grid (Optional, for retro feel)
        ctx.strokeStyle = '#1a1a2a';
        ctx.lineWidth = 0.5;
        for (let i = 0; i <= CANVAS_SIZE; i += GRID_SIZE) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, CANVAS_SIZE);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(CANVAS_SIZE, i);
            ctx.stroke();
        }

        // Draw Food
        ctx.fillStyle = '#ff0088'; // Neon pink food
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#ff0088';
        ctx.fillRect(food.x * GRID_SIZE, food.y * GRID_SIZE, GRID_SIZE - 2, GRID_SIZE - 2);
        ctx.shadowBlur = 0;

        // Draw Snake
        ctx.fillStyle = '#00ff88'; // Matrix green snake
        snake.forEach((segment, index) => {
            // Head is slightly different color or brighter
            if (index === 0) {
                ctx.fillStyle = '#ccffcc';
                ctx.shadowBlur = 10;
                ctx.shadowColor = '#00ff88';
            } else {
                ctx.fillStyle = '#00ff88';
                ctx.shadowBlur = 0;
            }
            ctx.fillRect(segment.x * GRID_SIZE, segment.y * GRID_SIZE, GRID_SIZE - 2, GRID_SIZE - 2);
        });

    }, [snake, food, gameOver, gameWon]);

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 10000,
            // backdropFilter removed for performance
        }}>
            <div style={{
                position: 'relative',
                padding: '20px',
                background: 'rgba(10, 10, 20, 0.9)',
                border: '2px solid #00ff88',
                borderRadius: '10px',
                boxShadow: '0 0 20px rgba(0, 255, 136, 0.3)',
                textAlign: 'center',
                color: '#00ff88',
                fontFamily: 'monospace'
            }}>
                <h2 style={{ margin: '0 0 15px 0', textShadow: '0 0 5px #00ff88' }}>
                    SYSTEM HACK: SNAKE.EXE
                </h2>

                <div style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
                    <span>SCORE: {score} / {winScore}</span>
                    <span>STATUS: {gameWon ? 'ACCESS GRANTED' : gameOver ? 'CRITICAL FAILURE' : 'RUNNING...'}</span>
                </div>

                <canvas
                    ref={canvasRef}
                    width={CANVAS_SIZE}
                    height={CANVAS_SIZE}
                    style={{
                        border: '1px solid #333',
                        boxShadow: 'inset 0 0 20px rgba(0,0,0,0.8)'
                    }}
                />

                <div style={{ marginTop: '15px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
                    {!gameOver && !gameWon && (
                        <div style={{ fontSize: '0.8rem', color: '#888' }}>
                            Use ARROW KEYS to move • SPACE to pause
                        </div>
                    )}

                    {gameOver && (
                        <button
                            onClick={resetGame}
                            style={{
                                padding: '8px 16px',
                                background: '#ff0044',
                                border: 'none',
                                color: 'white',
                                fontFamily: 'monospace',
                                cursor: 'pointer',
                                fontWeight: 'bold'
                            }}
                        >
                            RETRY_CONNECTION
                        </button>
                    )}

                    <button
                        onClick={onClose}
                        style={{
                            padding: '8px 16px',
                            background: 'transparent',
                            border: '1px solid #00ff88',
                            color: '#00ff88',
                            fontFamily: 'monospace',
                            cursor: 'pointer'
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
