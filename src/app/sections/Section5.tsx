'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

interface FloatingElement {
    id: string;
    x: number;
    y: number;
    type: 'coin' | 'gem' | 'star';
    collected: boolean;
    value: number;
}

interface PowerUp {
    id: string;
    x: number;
    y: number;
    type: 'speed' | 'magnet' | 'multiplier';
    active: boolean;
    duration: number;
}

export function Section5() {
    const [score, setScore] = useState(0);
    const [multiplier, setMultiplier] = useState(1);
    const [floatingElements, setFloatingElements] = useState<FloatingElement[]>([]);
    const [powerUps, setPowerUps] = useState<PowerUp[]>([]);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isMagnetActive, setIsMagnetActive] = useState(false);
    const [isSpeedActive, setIsSpeedActive] = useState(false);
    const [combo, setCombo] = useState(0);
    const [showCombo, setShowCombo] = useState(false);

    // Các loại element với giá trị khác nhau - theme Zerk
    const elementTypes = {
        coin: { value: 10, color: 'from-yellow-400 to-yellow-600', emoji: '🪙', name: 'FUD Coin' },
        gem: { value: 50, color: 'from-red-400 to-red-600', emoji: '💎', name: 'Hate Gem' },
        star: { value: 100, color: 'from-orange-400 to-orange-600', emoji: '⭐', name: 'Rage Star' }
    };

    // Tạo floating elements
    const generateFloatingElements = useCallback(() => {
        const elements: FloatingElement[] = [];
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;

        for (let i = 0; i < 8; i++) {
            const types = Object.keys(elementTypes) as Array<keyof typeof elementTypes>;
            const randomType = types[Math.floor(Math.random() * types.length)];

            elements.push({
                id: `element-${Date.now()}-${i}`,
                x: Math.random() * (screenWidth - 100) + 50,
                y: Math.random() * (screenHeight - 100) + 50,
                type: randomType,
                collected: false,
                value: elementTypes[randomType].value
            });
        }

        setFloatingElements(elements);
    }, []);

    // Tạo power-ups
    const generatePowerUps = useCallback(() => {
        const powerUps: PowerUp[] = [];
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;

        for (let i = 0; i < 3; i++) {
            const types = ['speed', 'magnet', 'multiplier'] as const;
            const randomType = types[Math.floor(Math.random() * types.length)];

            powerUps.push({
                id: `powerup-${Date.now()}-${i}`,
                x: Math.random() * (screenWidth - 100) + 50,
                y: Math.random() * (screenHeight - 100) + 50,
                type: randomType,
                active: false,
                duration: 10 // 10 giây
            });
        }

        setPowerUps(powerUps);
    }, []);

    // Theo dõi vị trí chuột
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Khởi tạo game
    useEffect(() => {
        generateFloatingElements();
        generatePowerUps();
    }, [generateFloatingElements, generatePowerUps]);

    // Xử lý khi click vào element
    const handleElementClick = (elementId: string) => {
        const element = floatingElements.find(el => el.id === elementId);
        if (!element || element.collected) return;

        // Đánh dấu đã thu thập
        setFloatingElements(prev =>
            prev.map(el =>
                el.id === elementId ? { ...el, collected: true } : el
            )
        );

        // Tính điểm với multiplier
        const points = element.value * multiplier;
        setScore(prev => prev + points);

        // Tăng combo
        setCombo(prev => {
            const newCombo = prev + 1;
            setShowCombo(true);
            setTimeout(() => setShowCombo(false), 2000);
            return newCombo;
        });

        // Ẩn element sau animation
        setTimeout(() => {
            setFloatingElements(prev => prev.filter(el => el.id !== elementId));
        }, 500);

        // Tạo element mới
        setTimeout(() => {
            const screenWidth = window.innerWidth;
            const screenHeight = window.innerHeight;
            const types = Object.keys(elementTypes) as Array<keyof typeof elementTypes>;
            const randomType = types[Math.floor(Math.random() * types.length)];

            setFloatingElements(prev => [
                ...prev,
                {
                    id: `element-${Date.now()}-${Math.random()}`,
                    x: Math.random() * (screenWidth - 100) + 50,
                    y: Math.random() * (screenHeight - 100) + 50,
                    type: randomType,
                    collected: false,
                    value: elementTypes[randomType].value
                }
            ]);
        }, 1000);
    };

    // Xử lý khi click vào power-up
    const handlePowerUpClick = (powerUpId: string) => {
        const powerUp = powerUps.find(pu => pu.id === powerUpId);
        if (!powerUp || powerUp.active) return;

        // Kích hoạt power-up
        setPowerUps(prev =>
            prev.map(pu =>
                pu.id === powerUpId ? { ...pu, active: true } : pu
            )
        );

        // Áp dụng hiệu ứng
        switch (powerUp.type) {
            case 'speed':
                setIsSpeedActive(true);
                setTimeout(() => setIsSpeedActive(false), powerUp.duration * 1000);
                break;
            case 'magnet':
                setIsMagnetActive(true);
                setTimeout(() => setIsMagnetActive(false), powerUp.duration * 1000);
                break;
            case 'multiplier':
                setMultiplier(prev => prev * 2);
                setTimeout(() => setMultiplier(prev => prev / 2), powerUp.duration * 1000);
                break;
        }

        // Ẩn power-up
        setTimeout(() => {
            setPowerUps(prev => prev.filter(pu => pu.id !== powerUpId));
        }, 500);

        // Tạo power-up mới
        setTimeout(() => {
            const screenWidth = window.innerWidth;
            const screenHeight = window.innerHeight;
            const types = ['speed', 'magnet', 'multiplier'] as const;
            const randomType = types[Math.floor(Math.random() * types.length)];

            setPowerUps(prev => [
                ...prev,
                {
                    id: `powerup-${Date.now()}-${Math.random()}`,
                    x: Math.random() * (screenWidth - 100) + 50,
                    y: Math.random() * (screenHeight - 100) + 50,
                    type: randomType,
                    active: false,
                    duration: 10
                }
            ]);
        }, 2000);
    };

    // Hiệu ứng magnet - tự động thu thập elements gần chuột
    useEffect(() => {
        if (!isMagnetActive) return;

        const interval = setInterval(() => {
            setFloatingElements(prev => {
                return prev.map(element => {
                    const distance = Math.sqrt(
                        Math.pow(element.x - mousePosition.x, 2) +
                        Math.pow(element.y - mousePosition.y, 2)
                    );

                    if (distance < 150 && !element.collected) {
                        // Tự động thu thập
                        setTimeout(() => {
                            const points = element.value * multiplier;
                            setScore(score => score + points);
                            setCombo(prev => {
                                const newCombo = prev + 1;
                                setShowCombo(true);
                                setTimeout(() => setShowCombo(false), 2000);
                                return newCombo;
                            });
                        }, 100);

                        return { ...element, collected: true };
                    }
                    return element;
                });
            });
        }, 100);

        return () => clearInterval(interval);
    }, [isMagnetActive, mousePosition, multiplier]);

    return (
        <div className="relative w-full h-screen bg-gradient-to-br from-red-900 via-orange-900 to-yellow-900 flex items-center justify-center overflow-hidden">
            {/* Background effects */}
            <div className="absolute inset-0 bg-black/30"></div>

            {/* Animated background particles */}
            <div className="absolute inset-0 overflow-hidden">
                {[...Array(30)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-white/30 rounded-full"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            y: [0, -100, 0],
                            opacity: [0, 1, 0],
                            scale: [0.5, 1, 0.5],
                        }}
                        transition={{
                            duration: 4 + Math.random() * 3,
                            repeat: Infinity,
                            delay: Math.random() * 3,
                            ease: "easeInOut"
                        }}
                    />
                ))}
            </div>

            {/* UI Panel */}
            <div className="absolute top-4 left-4 z-20 text-white">
                <div className="bg-black/60 backdrop-blur-md rounded-2xl p-4 border border-red-500/30">
                    <div className="text-2xl font-bold mb-2 text-red-400">Power: {score.toLocaleString()}</div>
                    <div className="text-lg mb-2 text-orange-400">Rage Level: {multiplier}x</div>
                    <div className="text-lg mb-2 text-yellow-400">Combo: {combo}</div>
                    <div className="flex gap-2">
                        {isMagnetActive && (
                            <div className="bg-red-500/80 px-2 py-1 rounded text-sm border border-red-400/50">Devour</div>
                        )}
                        {isSpeedActive && (
                            <div className="bg-orange-500/80 px-2 py-1 rounded text-sm border border-orange-400/50">Berserk</div>
                        )}
                        {multiplier > 1 && (
                            <div className="bg-yellow-500/80 px-2 py-1 rounded text-sm border border-yellow-400/50">2x Rage</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Combo display */}
            <AnimatePresence>
                {showCombo && (
                    <motion.div
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                    >
                        <div className="text-6xl font-bold text-red-400 drop-shadow-2xl">
                            RAGE x{combo}!
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Magnet effect indicator */}
            {isMagnetActive && (
                <motion.div
                    className="absolute pointer-events-none z-10"
                    style={{
                        left: mousePosition.x - 75,
                        top: mousePosition.y - 75,
                    }}
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                >
                    <div className="w-32 h-32 border-4 border-red-400 rounded-full bg-red-400/20"></div>
                </motion.div>
            )}

            {/* Floating Elements */}
            <AnimatePresence>
                {floatingElements.map((element) => (
                    <motion.button
                        key={element.id}
                        className={`absolute z-20 w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold transition-all duration-300 cursor-pointer ${element.collected
                            ? 'opacity-0 scale-0'
                            : `bg-gradient-to-r ${elementTypes[element.type].color} hover:scale-110`
                            }`}
                        style={{
                            left: element.x - 32,
                            top: element.y - 32,
                            boxShadow: element.collected
                                ? 'none'
                                : '0 8px 25px rgba(0,0,0,0.3), 0 0 20px rgba(255,255,255,0.2)',
                        }}
                        onClick={() => handleElementClick(element.id)}
                        initial={{ scale: 0, opacity: 0, rotate: 0 }}
                        animate={{
                            scale: element.collected ? 0 : 1,
                            opacity: element.collected ? 0 : 1,
                            rotate: element.collected ? 360 : [0, 10, -10, 0],
                            y: element.collected ? -50 : [0, -10, 0],
                        }}
                        exit={{
                            scale: 0,
                            opacity: 0,
                            rotate: 360,
                            y: -50,
                        }}
                        transition={{
                            duration: element.collected ? 0.5 : 0.3,
                            ease: element.collected ? "easeIn" : "easeOut",
                            rotate: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                            y: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                        }}
                        whileHover={{
                            scale: 1.2,
                            boxShadow: '0 12px 35px rgba(0,0,0,0.4), 0 0 30px rgba(255,255,255,0.3)',
                        }}
                        whileTap={{
                            scale: 0.9,
                        }}
                    >
                        <span className="drop-shadow-lg">
                            {elementTypes[element.type].emoji}
                        </span>
                    </motion.button>
                ))}
            </AnimatePresence>

            {/* Power-ups */}
            <AnimatePresence>
                {powerUps.map((powerUp) => (
                    <motion.button
                        key={powerUp.id}
                        className={`absolute z-20 w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-bold transition-all duration-300 cursor-pointer ${powerUp.active
                            ? 'opacity-0 scale-0'
                            : 'bg-gradient-to-r from-pink-500 to-purple-600 hover:scale-110'
                            }`}
                        style={{
                            left: powerUp.x - 40,
                            top: powerUp.y - 40,
                            boxShadow: powerUp.active
                                ? 'none'
                                : '0 10px 30px rgba(0,0,0,0.4), 0 0 25px rgba(255,255,255,0.3)',
                        }}
                        onClick={() => handlePowerUpClick(powerUp.id)}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{
                            scale: powerUp.active ? 0 : 1,
                            opacity: powerUp.active ? 0 : 1,
                            rotate: powerUp.active ? 360 : [0, 5, -5, 0],
                            y: powerUp.active ? -30 : [0, -5, 0],
                        }}
                        exit={{
                            scale: 0,
                            opacity: 0,
                            rotate: 360,
                            y: -30,
                        }}
                        transition={{
                            duration: powerUp.active ? 0.5 : 0.3,
                            ease: powerUp.active ? "easeIn" : "easeOut",
                            rotate: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                            y: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                        }}
                        whileHover={{
                            scale: 1.15,
                            boxShadow: '0 15px 40px rgba(0,0,0,0.5), 0 0 35px rgba(255,255,255,0.4)',
                        }}
                        whileTap={{
                            scale: 0.9,
                        }}
                    >
                        <span className="drop-shadow-lg">
                            {powerUp.type === 'speed' && '🔥'}
                            {powerUp.type === 'magnet' && '👹'}
                            {powerUp.type === 'multiplier' && '💀'}
                        </span>
                    </motion.button>
                ))}
            </AnimatePresence>

            {/* Zerk Character in center */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-15">
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0],
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="relative"
                >
                    <Image
                        src="/img/Zerk.png"
                        alt="Zerk Character"
                        width={150}
                        height={150}
                        className="drop-shadow-2xl"
                        style={{
                            filter: 'drop-shadow(0 0 30px rgba(255, 255, 255, 0.3))',
                        }}
                    />
                    {/* Glow effect around Zerk */}
                    <motion.div
                        className="absolute inset-0 rounded-full"
                        style={{
                            background: 'radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 70%)',
                            filter: 'blur(30px)',
                            transform: 'scale(2)'
                        }}
                        animate={{
                            opacity: [0.3, 0.6, 0.3],
                            scale: [2, 2.5, 2]
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                </motion.div>
            </div>

            {/* Instructions */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20">
                <div className="bg-black/60 backdrop-blur-md rounded-2xl p-6 border border-red-500/30 text-white text-center">
                    <div className="text-2xl font-bold mb-3 text-red-400">Zerk's FUD Feast</div>
                    <div className="text-sm opacity-90 max-w-md">
                        Help Zerk devour the negative energy! Click on coins, gems, and stars to feed his power.
                        Use power-ups to become unstoppable!
                    </div>
                </div>
            </div>
        </div>
    );
}
