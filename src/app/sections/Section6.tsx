'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';

interface Obstacle {
    id: string;
    x: number;
    y: number;
    type: 'cactus' | 'rock';
    passed: boolean;
}

interface PowerUp {
    id: string;
    x: number;
    y: number;
    type: 'speed' | 'jump' | 'shield';
    collected: boolean;
}

interface Particle {
    id: string;
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    color: string;
}

export function Section6() {
    const [gameStarted, setGameStarted] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [dinoY, setDinoY] = useState(0);
    const [isJumping, setIsJumping] = useState(false);
    const [gameSpeed, setGameSpeed] = useState(1);
    const [obstacles, setObstacles] = useState<Obstacle[]>([]);
    const [powerUps, setPowerUps] = useState<PowerUp[]>([]);
    const [particles, setParticles] = useState<Particle[]>([]);
    const [isShieldActive, setIsShieldActive] = useState(false);
    const [isSpeedActive, setIsSpeedActive] = useState(false);
    const [isJumpBoostActive, setIsJumpBoostActive] = useState(false);
    const [groundY] = useState(300); // Vị trí mặt đất
    const gameLoopRef = useRef<number | null>(null);
    const lastObstacleTime = useRef<number>(0);
    const lastPowerUpTime = useRef<number>(0);

    // Khởi tạo game
    const startGame = () => {
        setGameStarted(true);
        setGameOver(false);
        setScore(0);
        setDinoY(0);
        setIsJumping(false);
        setGameSpeed(1);
        setObstacles([]);
        setPowerUps([]);
        setParticles([]);
        setIsShieldActive(false);
        setIsSpeedActive(false);
        setIsJumpBoostActive(false);
        lastObstacleTime.current = 0;
        lastPowerUpTime.current = 0;
    };

    // Tạo hiệu ứng particle
    const createParticles = useCallback((x: number, y: number, color: string = '#ff6b6b') => {
        const newParticles: Particle[] = [];
        for (let i = 0; i < 6; i++) {
            newParticles.push({
                id: `particle-${Date.now()}-${i}`,
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 8,
                vy: (Math.random() - 0.5) * 8,
                life: 1,
                color: color
            });
        }
        setParticles(prev => [...prev, ...newParticles]);
    }, []);

    // Xử lý nhảy với animation mượt mà
    const jump = useCallback(() => {
        if (!gameStarted || gameOver || isJumping) return;

        setIsJumping(true);

        // Animation nhảy mượt mà với easing
        const jumpHeight = -150;
        const jumpDuration = 800;

        // Tạo hiệu ứng bụi khi nhảy
        createParticles(150, groundY, '#8B4513');

        // Animation lên
        const startTime = Date.now();
        const animateUp = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / (jumpDuration / 2), 1);

            // Easing function (ease-out)
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentY = jumpHeight * easeOut;

            setDinoY(currentY);

            if (progress < 1) {
                requestAnimationFrame(animateUp);
            } else {
                // Animation xuống
                const animateDown = () => {
                    const elapsed = Date.now() - startTime - (jumpDuration / 2);
                    const progress = Math.min(elapsed / (jumpDuration / 2), 1);

                    // Easing function (ease-in)
                    const easeIn = Math.pow(progress, 2);
                    const currentY = jumpHeight + (jumpHeight * -1 * easeIn);

                    setDinoY(currentY);

                    if (progress < 1) {
                        requestAnimationFrame(animateDown);
                    } else {
                        setDinoY(0);
                        setIsJumping(false);
                    }
                };
                requestAnimationFrame(animateDown);
            }
        };

        requestAnimationFrame(animateUp);
    }, [gameStarted, gameOver, isJumping, createParticles, groundY]);

    // Loại bỏ chức năng cúi đầu vì chỉ sử dụng Space

    // Tạo chướng ngại vật - chỉ cactus và rock
    const generateObstacle = useCallback(() => {
        const types: Array<'cactus' | 'rock'> = ['cactus', 'rock'];
        const randomType = types[Math.floor(Math.random() * types.length)];

        const newObstacle: Obstacle = {
            id: `obstacle-${Date.now()}`,
            x: window.innerWidth + 50,
            y: groundY,
            type: randomType,
            passed: false
        };

        setObstacles(prev => [...prev, newObstacle]);
    }, [groundY]);

    // Tạo power-up
    const generatePowerUp = useCallback(() => {
        const types: Array<'speed' | 'jump' | 'shield'> = ['speed', 'jump', 'shield'];
        const randomType = types[Math.floor(Math.random() * types.length)];

        const newPowerUp: PowerUp = {
            id: `powerup-${Date.now()}`,
            x: window.innerWidth + 50,
            y: groundY - 60,
            type: randomType,
            collected: false
        };

        setPowerUps(prev => [...prev, newPowerUp]);
    }, [groundY]);

    // Kiểm tra va chạm
    const checkCollision = useCallback((obstacle: Obstacle) => {
        const dinoX = 150;
        const dinoWidth = 60;
        const dinoHeight = 60;
        const dinoCurrentY = groundY + dinoY;

        const obstacleWidth = 40;
        const obstacleHeight = 40;

        // Nếu có shield thì không bị va chạm
        if (isShieldActive) return false;

        return (
            dinoX < obstacle.x + obstacleWidth &&
            dinoX + dinoWidth > obstacle.x &&
            dinoCurrentY < obstacle.y + obstacleHeight &&
            dinoCurrentY + dinoHeight > obstacle.y
        );
    }, [groundY, dinoY, isShieldActive]);

    // Game loop chính
    useEffect(() => {
        if (!gameStarted || gameOver) return;

        const gameLoop = () => {
            const currentTime = Date.now();

            // Tạo chướng ngại vật
            if (currentTime - lastObstacleTime.current > 2000 / gameSpeed) {
                generateObstacle();
                lastObstacleTime.current = currentTime;
            }

            // Tạo power-up
            if (currentTime - lastPowerUpTime.current > 8000 / gameSpeed) {
                generatePowerUp();
                lastPowerUpTime.current = currentTime;
            }

            // Di chuyển chướng ngại vật
            setObstacles(prev => {
                const updated = prev.map(obstacle => {
                    const newX = obstacle.x - (5 * gameSpeed);

                    // Kiểm tra va chạm
                    if (newX < 200 && !obstacle.passed) {
                        if (checkCollision(obstacle)) {
                            // Game over
                            setGameOver(true);
                            if (score > highScore) {
                                setHighScore(score);
                            }
                            createParticles(obstacle.x, obstacle.y, '#ff0000');
                        } else if (newX < 100) {
                            // Đã vượt qua
                            setScore(prev => prev + 10);
                            return { ...obstacle, x: newX, passed: true };
                        }
                    }

                    return { ...obstacle, x: newX };
                });

                // Loại bỏ chướng ngại vật đã ra khỏi màn hình
                return updated.filter(obstacle => obstacle.x > -100);
            });

            // Di chuyển power-ups
            setPowerUps(prev => {
                const updated = prev.map(powerUp => {
                    const newX = powerUp.x - (5 * gameSpeed);

                    // Kiểm tra thu thập power-up
                    if (newX < 200 && !powerUp.collected) {
                        const dinoX = 150;
                        const dinoWidth = 60;
                        const dinoHeight = 60;
                        const dinoCurrentY = groundY + dinoY;

                        if (
                            dinoX < newX + 30 &&
                            dinoX + dinoWidth > newX &&
                            dinoCurrentY < powerUp.y + 30 &&
                            dinoCurrentY + dinoHeight > powerUp.y
                        ) {
                            // Thu thập power-up
                            setScore(prev => prev + 50);
                            createParticles(powerUp.x, powerUp.y, '#00ff00');

                            // Áp dụng hiệu ứng
                            switch (powerUp.type) {
                                case 'speed':
                                    setIsSpeedActive(true);
                                    setTimeout(() => setIsSpeedActive(false), 5000);
                                    break;
                                case 'jump':
                                    setIsJumpBoostActive(true);
                                    setTimeout(() => setIsJumpBoostActive(false), 5000);
                                    break;
                                case 'shield':
                                    setIsShieldActive(true);
                                    setTimeout(() => setIsShieldActive(false), 3000);
                                    break;
                            }

                            return { ...powerUp, x: newX, collected: true };
                        }
                    }

                    return { ...powerUp, x: newX };
                });

                // Loại bỏ power-ups đã ra khỏi màn hình
                return updated.filter(powerUp => powerUp.x > -100);
            });

            // Tăng tốc độ game
            setGameSpeed(prev => Math.min(prev + 0.001, 3));

            gameLoopRef.current = requestAnimationFrame(gameLoop);
        };

        gameLoopRef.current = requestAnimationFrame(gameLoop);

        return () => {
            if (gameLoopRef.current) {
                cancelAnimationFrame(gameLoopRef.current);
            }
        };
    }, [gameStarted, gameOver, gameSpeed, generateObstacle, generatePowerUp, checkCollision, groundY, dinoY, score, highScore, createParticles]);

    // Xử lý phím - chỉ sử dụng Space
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === 'Space') {
                e.preventDefault();
                jump();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [jump]);

    // Animation particles
    useEffect(() => {
        if (particles.length === 0) return;

        const interval = setInterval(() => {
            setParticles(prev =>
                prev
                    .map(particle => ({
                        ...particle,
                        x: particle.x + particle.vx,
                        y: particle.y + particle.vy,
                        life: particle.life - 0.02
                    }))
                    .filter(particle => particle.life > 0)
            );
        }, 16);

        return () => clearInterval(interval);
    }, [particles]);

    return (
        <div className="relative w-full h-screen bg-gradient-to-b from-sky-400 via-yellow-300 to-green-400 overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-0">
                {/* Clouds */}
                {[...Array(5)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute text-6xl opacity-30"
                        style={{
                            left: `${20 + i * 20}%`,
                            top: `${10 + (i % 2) * 10}%`,
                        }}
                        animate={{
                            x: [0, 80, 0],
                            y: [0, -10, 0],
                            scale: [1, 1.1, 1],
                            opacity: [0.3, 0.5, 0.3],
                        }}
                        transition={{
                            duration: 15 + i * 3,
                            repeat: Infinity,
                            ease: "easeInOut",
                            times: [0, 0.5, 1]
                        }}
                    >
                        ☁️
                    </motion.div>
                ))}

                {/* Mountains */}
                <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-gray-600 to-gray-500"></div>
                <div className="absolute bottom-0 w-full h-20 bg-gradient-to-t from-green-600 to-green-500"></div>
            </div>

            {/* Game UI */}
            <div className="absolute top-4 left-4 z-20 text-black">
                <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 border border-black/20">
                    <div className="text-2xl font-bold mb-2">Score: {score}</div>
                    <div className="text-lg mb-2">High Score: {highScore}</div>
                    <div className="text-lg mb-2">Speed: {gameSpeed.toFixed(1)}x</div>
                    <div className="flex gap-2">
                        {isShieldActive && (
                            <div className="bg-blue-500/80 px-2 py-1 rounded text-sm text-white">🛡️ Shield</div>
                        )}
                        {isSpeedActive && (
                            <div className="bg-red-500/80 px-2 py-1 rounded text-sm text-white">⚡ Speed</div>
                        )}
                        {isJumpBoostActive && (
                            <div className="bg-green-500/80 px-2 py-1 rounded text-sm text-white">🚀 Jump</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Instructions */}
            <div className="absolute top-4 right-4 z-20 text-black">
                <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 border border-black/20">
                    <div className="text-sm font-bold mb-2">Controls:</div>
                    <div className="text-xs space-y-1">
                        <div>Space - Jump</div>
                    </div>
                </div>
            </div>

            {/* Dinosaur */}
            <motion.div
                className="absolute z-10"
                style={{
                    left: 150,
                    top: groundY + dinoY,
                }}
                animate={{
                    y: [0, -8, 0],
                    scale: [1, 1.05, 1],
                    rotate: [0, 2, -2, 0],
                }}
                transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    times: [0, 0.5, 1]
                }}
            >
                <motion.div
                    className="text-6xl"
                    animate={{
                        filter: isShieldActive ? [
                            'drop-shadow(0 0 10px rgba(255, 255, 255, 0.8))',
                            'drop-shadow(0 0 20px rgba(255, 255, 255, 1))',
                            'drop-shadow(0 0 10px rgba(255, 255, 255, 0.8))'
                        ] : [
                            'drop-shadow(0 0 5px rgba(0, 0, 0, 0.3))',
                            'drop-shadow(0 0 8px rgba(0, 0, 0, 0.4))',
                            'drop-shadow(0 0 5px rgba(0, 0, 0, 0.3))'
                        ]
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                >
                    {isShieldActive ? '🦕✨' : '🦕'}
                </motion.div>
            </motion.div>

            {/* Obstacles */}
            <AnimatePresence>
                {obstacles.map((obstacle) => (
                    <motion.div
                        key={obstacle.id}
                        className="absolute z-10"
                        style={{
                            left: obstacle.x,
                            top: obstacle.y,
                        }}
                        initial={{
                            opacity: 0,
                            scale: 0,
                            rotate: -180,
                            y: -50
                        }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            rotate: 0,
                            y: 0
                        }}
                        exit={{
                            opacity: 0,
                            scale: 0,
                            rotate: 180,
                            y: 50
                        }}
                        transition={{
                            duration: 0.6,
                            ease: "easeOut",
                            type: "spring",
                            stiffness: 200,
                            damping: 15
                        }}
                    >
                        <motion.div
                            className="text-4xl"
                            animate={{
                                y: [0, -3, 0],
                                rotate: [0, 1, -1, 0],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        >
                            {obstacle.type === 'cactus' && '🌵'}
                            {obstacle.type === 'rock' && '🪨'}
                        </motion.div>
                    </motion.div>
                ))}
            </AnimatePresence>

            {/* Power-ups */}
            <AnimatePresence>
                {powerUps.map((powerUp) => (
                    <motion.div
                        key={powerUp.id}
                        className="absolute z-10"
                        style={{
                            left: powerUp.x,
                            top: powerUp.y,
                        }}
                        initial={{
                            opacity: 0,
                            scale: 0,
                            rotate: -360,
                            y: -30
                        }}
                        animate={{
                            opacity: powerUp.collected ? 0 : 1,
                            scale: powerUp.collected ? 0 : [1, 1.3, 1],
                            rotate: powerUp.collected ? 720 : [0, 15, -15, 0],
                            y: powerUp.collected ? -50 : [0, -8, 0]
                        }}
                        exit={{
                            opacity: 0,
                            scale: 0,
                            rotate: 360,
                            y: -30
                        }}
                        transition={{
                            scale: {
                                duration: 1.5,
                                repeat: Infinity,
                                ease: "easeInOut",
                                type: "spring",
                                stiffness: 100
                            },
                            rotate: {
                                duration: 3,
                                repeat: Infinity,
                                ease: "easeInOut"
                            },
                            y: {
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }
                        }}
                    >
                        <motion.div
                            className="text-3xl"
                            animate={{
                                filter: [
                                    'drop-shadow(0 0 5px rgba(255, 255, 255, 0.5))',
                                    'drop-shadow(0 0 15px rgba(255, 255, 255, 0.8))',
                                    'drop-shadow(0 0 5px rgba(255, 255, 255, 0.5))'
                                ]
                            }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        >
                            {powerUp.type === 'speed' && '⚡'}
                            {powerUp.type === 'jump' && '🚀'}
                            {powerUp.type === 'shield' && '🛡️'}
                        </motion.div>
                    </motion.div>
                ))}
            </AnimatePresence>

            {/* Particles */}
            {particles.map((particle) => (
                <motion.div
                    key={particle.id}
                    className="absolute pointer-events-none"
                    style={{
                        left: particle.x,
                        top: particle.y,
                        opacity: particle.life,
                        width: '8px',
                        height: '8px',
                        background: `radial-gradient(circle, ${particle.color} 0%, transparent 70%)`,
                        borderRadius: '50%',
                        boxShadow: `0 0 15px ${particle.color}, 0 0 30px ${particle.color}`,
                    }}
                    initial={{
                        scale: 0,
                        rotate: 0,
                        opacity: 0
                    }}
                    animate={{
                        scale: [0, 1.5, 0.8, 0],
                        rotate: [0, 180, 360],
                        opacity: [0, 1, 0.8, 0]
                    }}
                    exit={{
                        scale: 0,
                        opacity: 0
                    }}
                    transition={{
                        duration: 1.2,
                        ease: "easeOut",
                        times: [0, 0.3, 0.7, 1]
                    }}
                />
            ))}

            {/* Ground line */}
            <div
                className="absolute w-full h-2 bg-gray-800 z-5"
                style={{ top: groundY + 50 }}
            />

            {/* Start screen */}
            {!gameStarted && (
                <motion.div
                    className="absolute inset-0 bg-black/50 flex items-center justify-center z-30"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <div className="text-center text-white">
                        <h2 className="text-4xl font-bold mb-4">🦕 Zerk Dino Run</h2>
                        <p className="text-xl mb-6">Help Zerk the dinosaur run and avoid obstacles!</p>
                        <button
                            onClick={startGame}
                            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full text-xl transition-colors"
                        >
                            Start Game
                        </button>
                    </div>
                </motion.div>
            )}

            {/* Game over screen */}
            {gameOver && (
                <motion.div
                    className="absolute inset-0 bg-black/70 flex items-center justify-center z-30"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <div className="text-center text-white">
                        <h2 className="text-4xl font-bold mb-4">Game Over!</h2>
                        <p className="text-2xl mb-4">Score: {score}</p>
                        {score === highScore && score > 0 && (
                            <p className="text-xl mb-4 text-yellow-400">🎉 New High Score!</p>
                        )}
                        <button
                            onClick={startGame}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full transition-colors"
                        >
                            Play Again
                        </button>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
