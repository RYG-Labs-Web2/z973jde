'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback, useMemo } from 'react';
import Image from 'next/image';

interface SwearWord {
    id: number;
    text: string;
    x: number;
    y: number;
    isClicked: boolean;
}

interface Particle {
    id: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
}

export function Section4() {
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(30);
    const [gameStarted, setGameStarted] = useState(false);
    const [gameEnded, setGameEnded] = useState(false);
    const [zerkSize, setZerkSize] = useState(1);
    const [zerkImageIndex, setZerkImageIndex] = useState(0);
    const [clickCount, setClickCount] = useState(0);
    const [swearWords, setSwearWords] = useState<SwearWord[]>([]);
    const [particles, setParticles] = useState<Particle[]>([]);

    // Danh sách các câu chửi tiếng Anh - memoized để tránh re-render
    const swearTexts = useMemo(() => [
        "You're stupid!",
        "You're crazy!",
        "You're insane!",
        "You're dumb!",
        "You're an idiot!",
        "You're lazy!",
        "You're weak!",
        "You're slow!",
        "You're terrible!",
        "You're ugly!",
        "You're pathetic!",
        "You're worthless!",
        "You're useless!",
        "You're a loser!",
        "You're a failure!",
        "You're garbage!",
        "You're trash!",
        "You're a joke!",
        "You're pathetic!",
        "You're a waste!",
        "You're nothing!",
        "You're a nobody!",
        "You're a zero!",
        "You're a disaster!",
        "You're a mess!",
        "Next stop 0!",
        "Dead project!",
        "Exit pump!",
        "No buyers!",
        "Volume dead!",
        "Floor next candle!",
        "Rug soon!",
        "No roadmap!",
        "Dev printing jeet bags!",
        "Minted to zero!",
        "Rekt incoming!",
        "Holders coping!",
    ], []);

    // Danh sách hình ảnh Zerk - memoized để tránh re-render
    const zerkImages = useMemo(() => [
        "/img/zerk.png",
        "/img/1.png",
        "/img/zerk-lv3.png",
        "/img/zerk-lv4.png"
    ], []);

    // Tạo các câu chửi rải rác toàn màn hình
    const generateSwearWords = useCallback(() => {
        const words: SwearWord[] = [];
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        const minDistance = 100; // Khoảng cách tối thiểu từ biên màn hình
        const centerX = screenWidth / 2;
        const centerY = screenHeight / 2;
        const centerRadius = 200; // Vùng cấm xung quanh nhân vật

        // Tạo 15 câu chửi rải rác
        for (let i = 0; i < 15; i++) {
            let x, y;
            let attempts = 0;

            // Tìm vị trí hợp lệ (không quá gần center và không quá gần biên)
            do {
                x = Math.random() * (screenWidth - 2 * minDistance) + minDistance;
                y = Math.random() * (screenHeight - 2 * minDistance) + minDistance;
                attempts++;
            } while (
                Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2) < centerRadius &&
                attempts < 50
            );

            words.push({
                id: i,
                text: swearTexts[Math.floor(Math.random() * swearTexts.length)],
                x: x,
                y: y,
                isClicked: false
            });
        }
        setSwearWords(words);
    }, [swearTexts]);

    // Bắt đầu game
    const startGame = () => {
        setGameStarted(true);
        setGameEnded(false);
        setScore(0);
        setTimeLeft(30);
        setZerkSize(1);
        setZerkImageIndex(0);
        setClickCount(0);

        generateSwearWords();
    };

    // Tạo hiệu ứng particle
    const createParticles = useCallback((x: number, y: number) => {
        const newParticles: Particle[] = [];
        for (let i = 0; i < 8; i++) {
            newParticles.push({
                id: Date.now() + Math.random(),
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() - 0.5) * 10,
                life: 1
            });
        }
        setParticles(prev => [...prev, ...newParticles]);
    }, []);

    useEffect(() => {
        if (clickCount >= 20) {
            setZerkImageIndex(prevIndex => (prevIndex + 1) % zerkImages.length);
            createParticles(window.innerWidth / 2, window.innerHeight / 2);
            setZerkSize(1);
            setClickCount(0);
        }
    }, [clickCount, zerkImages.length, createParticles]);

    // Xử lý khi nhấn vào câu chửi
    const handleSwearWordClick = (id: number) => {
        if (gameEnded || !gameStarted) return;

        // Tìm vị trí của câu chửi để tạo particle
        const clickedWord = swearWords.find(word => word.id === id);
        if (clickedWord) {
            createParticles(clickedWord.x, clickedWord.y);
        }

        // Hiệu ứng ngay lập tức - đánh dấu đã click và ẩn
        setSwearWords(prev =>
            prev.map(word =>
                word.id === id
                    ? { ...word, isClicked: true }
                    : word
            )
        );

        setScore(prev => prev + 1);
        setClickCount(prev => prev + 1);

        // Ẩn câu chửi sau 300ms (thời gian hiệu ứng)
        setTimeout(() => {
            setSwearWords(prev =>
                prev.filter(word => word.id !== id)
            );
        }, 300);

        // Tạo câu chửi mới ở vị trí random sau khi ẩn
        setTimeout(() => {
            const screenWidth = window.innerWidth;
            const screenHeight = window.innerHeight;
            const minDistance = 100;
            const centerX = screenWidth / 2;
            const centerY = screenHeight / 2;
            const centerRadius = 200;

            let newX, newY;
            let attempts = 0;

            do {
                newX = Math.random() * (screenWidth - 2 * minDistance) + minDistance;
                newY = Math.random() * (screenHeight - 2 * minDistance) + minDistance;
                attempts++;
            } while (
                Math.sqrt((newX - centerX) ** 2 + (newY - centerY) ** 2) < centerRadius &&
                attempts < 50
            );

            // Thêm câu chửi mới
            setSwearWords(prev => [
                ...prev,
                {
                    id: Date.now() + Math.random(), // Unique ID
                    text: swearTexts[Math.floor(Math.random() * swearTexts.length)],
                    x: newX,
                    y: newY,
                    isClicked: false
                }
            ]);
        }, 500);
    };


    useEffect(() => {
        if (!gameStarted || gameEnded) return;

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    setGameEnded(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [gameStarted, gameEnded]);

    // Particle animation
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
        }, 16); // ~60fps

        return () => clearInterval(interval);
    }, [particles]);

    // Share to X
    const shareToX = () => {
        const text = `I scored ${score} points in the Zerk game! Try this challenge! 🎮 #ZerkGame`;
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
    };

    return (
        <div className="relative w-full h-screen bg-gradient-to-br from-purple-900 via-red-900 to-orange-900 flex items-center justify-center overflow-hidden z-10">
            {/* Background effects */}
            <div className="absolute inset-0 bg-black/20"></div>

            {/* Animated background particles */}
            <div className="absolute inset-0 overflow-hidden">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-white/20 rounded-full"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            y: [0, -100, 0],
                            opacity: [0, 1, 0],
                        }}
                        transition={{
                            duration: 3 + Math.random() * 2,
                            repeat: Infinity,
                            delay: Math.random() * 2,
                            ease: "easeInOut"
                        }}
                    />
                ))}
            </div>

            {/* Game UI */}
            <div className="absolute top-4 left-4 z-10 text-white">
                <div className="text-2xl font-bold mb-2">Score: {score}</div>
                <div className="text-xl mb-2">Time: {timeLeft}s</div>
                <div className="text-lg">Evolution: {clickCount}/20</div>
                <div className="w-32 h-2 bg-gray-700 rounded-full mt-1">
                    <div
                        className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all duration-300"
                        style={{ width: `${(clickCount / 20) * 100}%` }}
                    ></div>
                </div>
            </div>

            {/* Game area */}
            <div className="relative w-full h-full flex items-center justify-center">
                {/* Nhân vật Zerk */}
                <motion.div
                    className="relative z-10"
                    animate={{
                        scale: [zerkSize * 0.8, zerkSize * 1.1, zerkSize],
                        rotate: [0, 3, -3, 0],
                    }}
                    transition={{
                        scale: { duration: 0.6, ease: "easeOut" },
                        rotate: { duration: 2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }
                    }}
                    style={{
                        willChange: 'transform',
                        filter: 'drop-shadow(0 20px 40px rgba(0, 0, 0, 0.3)) drop-shadow(0 0 20px rgba(255, 255, 255, 0.1))'
                    }}
                >
                    <div className="relative">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={zerkImageIndex}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.2 }}
                                transition={{ duration: 0.5, ease: "easeInOut" }}
                                className="relative z-10"
                            >
                                <Image
                                    src={zerkImages[zerkImageIndex]}
                                    alt={`Zerk Character ${zerkImageIndex + 1}`}
                                    width={200}
                                    height={200}
                                    className="relative z-10"
                                    priority
                                />
                            </motion.div>
                        </AnimatePresence>
                        {/* Glow effect */}
                        <motion.div
                            className="absolute inset-0 rounded-full"
                            style={{
                                background: 'radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 70%)',
                                filter: 'blur(20px)',
                                transform: 'scale(1.5)'
                            }}
                            animate={{
                                opacity: [0.4, 0.8, 0.4],
                                scale: [1.5 * zerkSize, 1.8 * zerkSize, 1.5 * zerkSize]
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        />
                    </div>
                </motion.div>

                {/* Các câu chửi xung quanh */}
                <AnimatePresence>
                    {swearWords.map((word) => (
                        <motion.button
                            key={word.id}
                            className={`absolute z-30 px-6 py-4 rounded-2xl font-bold text-xl transition-all duration-300 cursor-pointer select-none pointer-events-auto ${word.isClicked
                                ? 'bg-gradient-to-r from-green-400 to-green-600 text-white shadow-green-500/50'
                                : 'bg-gradient-to-r from-red-500 to-red-700 text-white shadow-red-500/50 hover:from-red-600 hover:to-red-800'
                                }`}
                            style={{
                                left: word.x - 80,
                                top: word.y - 35,
                                willChange: 'transform, opacity',
                                minWidth: '140px',
                                minHeight: '60px',
                                boxShadow: word.isClicked
                                    ? '0 10px 25px rgba(34, 197, 94, 0.4), 0 0 20px rgba(34, 197, 94, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                                    : '0 8px 20px rgba(239, 68, 68, 0.4), 0 0 15px rgba(239, 68, 68, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                                textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                backdropFilter: 'blur(10px)',
                                background: word.isClicked
                                    ? 'linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)'
                                    : 'linear-gradient(135deg, #ef4444 0%, #dc2626 50%, #b91c1c 100%)'
                            }}
                            onClick={() => handleSwearWordClick(word.id)}
                            initial={{ opacity: 0, scale: 0, y: 20 }}
                            animate={{
                                opacity: word.isClicked ? 0 : 1,
                                scale: word.isClicked ? 1.3 : 1,
                                y: word.isClicked ? -25 : [0, -8, 0],
                                rotate: word.isClicked ? 360 : 0,
                                boxShadow: word.isClicked
                                    ? '0 15px 35px rgba(34, 197, 94, 0.6), 0 0 30px rgba(34, 197, 94, 0.5)'
                                    : '0 8px 20px rgba(239, 68, 68, 0.4), 0 0 15px rgba(239, 68, 68, 0.3)'
                            }}
                            exit={{
                                opacity: 0,
                                scale: 0,
                                y: -40,
                                rotate: 180,
                                boxShadow: '0 0 0 rgba(0, 0, 0, 0)'
                            }}
                            transition={{
                                duration: word.isClicked ? 0.4 : 0.3,
                                ease: word.isClicked ? "easeIn" : "easeOut",
                                y: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                            }}
                            whileHover={{
                                scale: 1.08,
                                boxShadow: '0 12px 30px rgba(239, 68, 68, 0.6), 0 0 25px rgba(239, 68, 68, 0.4)',
                                y: -5
                            }}
                            whileTap={{
                                scale: 0.92,
                                boxShadow: '0 4px 15px rgba(239, 68, 68, 0.3)'
                            }}
                        >
                            <span className="relative z-10">{word.text}</span>
                            {!word.isClicked && (
                                <motion.div
                                    className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/20 to-transparent"
                                    initial={{ x: '-100%' }}
                                    animate={{ x: '100%' }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                    style={{
                                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)'
                                    }}
                                />
                            )}
                        </motion.button>
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
                            width: '6px',
                            height: '6px',
                            background: 'radial-gradient(circle, #fbbf24 0%, #f59e0b 50%, #d97706 100%)',
                            borderRadius: '50%',
                            boxShadow: '0 0 10px rgba(251, 191, 36, 0.8), 0 0 20px rgba(251, 191, 36, 0.4)',
                            filter: 'blur(0.5px)'
                        }}
                        initial={{ scale: 0, rotate: 0 }}
                        animate={{
                            scale: [0, 1.2, 0.8, 0],
                            rotate: [0, 180, 360]
                        }}
                        exit={{ scale: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                ))}
            </div>

            {/* Start screen */}
            {!gameStarted && (
                <motion.div
                    className="absolute inset-0 bg-black/80 flex items-center justify-center z-30"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <div className="text-center text-white">
                        <h2 className="text-4xl font-bold mb-4">Zerk Game</h2>
                        <p className="text-xl mb-6">Click on the swear words to make Zerk grow bigger!</p>
                        <button
                            onClick={startGame}
                            className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full text-xl transition-colors"
                        >
                            Start Game
                        </button>
                    </div>
                </motion.div>
            )}

            {/* End screen */}
            {gameEnded && (
                <motion.div
                    className="absolute inset-0 bg-black/80 flex items-center justify-center z-30"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <div className="text-center text-white">
                        <h2 className="text-4xl font-bold mb-4">Game Over!</h2>
                        <p className="text-2xl mb-4">Your Score: {score}</p>
                        <div className="space-x-4">
                            <button
                                onClick={startGame}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full transition-colors"
                            >
                                Play Again
                            </button>
                            <button
                                onClick={shareToX}
                                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full transition-colors"
                            >
                                Share to X
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
