'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import Image from 'next/image';

const zerkImages = [
    '/img/zerk-angry.png',
    '/img/zerk-bull.png',
    '/img/zerk-fire.png',
    '/img/zerk-happi.png',
    '/img/zerk-lion.png',
    '/img/zerk-mind.png',
    '/img/zerk-strong.png',
    '/img/Zerk.png',
];

export function Section3() {
    const [visibleImages, setVisibleImages] = useState<{ id: string, imageIndex: number }[]>([]);

    useEffect(() => {
        // Hiển thị 3-5 ảnh cùng lúc
        const showRandomImages = () => {
            const numImages = Math.floor(Math.random() * 3) + 3; // 3-5 ảnh
            const shuffled = [...Array(zerkImages.length)].map((_, i) => i).sort(() => Math.random() - 0.5);
            const newImages = shuffled.slice(0, numImages).map(imageIndex => ({
                id: `${imageIndex}-${Date.now()}-${Math.random()}`,
                imageIndex
            }));
            setVisibleImages(newImages);
        };

        // Hiển thị ảnh ngay lập tức
        showRandomImages();

        // Thay đổi ảnh mỗi 2-4 giây
        const interval = setInterval(() => {
            showRandomImages();
        }, Math.random() * 2000 + 2000);

        return () => clearInterval(interval);
    }, []);

    return (
        <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
            {/* Background particles */}
            <div className="absolute inset-0">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-white rounded-full opacity-20"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            y: [0, -20, 0],
                            opacity: [0.2, 0.8, 0.2],
                        }}
                        transition={{
                            duration: 3 + Math.random() * 2,
                            repeat: Infinity,
                            delay: Math.random() * 2,
                        }}
                    />
                ))}
            </div>

            {/* Multiple images container */}
            <div className="relative z-10 w-full h-full">
                <AnimatePresence>
                    {visibleImages.map((imageData, index) => {
                        const randomX = Math.random() * 800 - 400; // -400 to 400
                        const randomY = Math.random() * 600 - 300; // -300 to 300
                        const randomScale = Math.random() * 0.8 + 0.6; // 0.6 to 1.4
                        const randomDelay = Math.random() * 2;

                        return (
                            <motion.div
                                key={imageData.id}
                                initial={{
                                    scale: 0.1,
                                    opacity: 0,
                                    rotate: 0,
                                    x: randomX,
                                    y: randomY,
                                }}
                                animate={{
                                    scale: [0.1, randomScale * 1.5, randomScale * 0.8, randomScale],
                                    opacity: [0, 1, 1, 0.8],
                                    rotate: [0, 10, -10, 0],
                                    x: [randomX, randomX + Math.random() * 100 - 50, randomX],
                                    y: [randomY, randomY + Math.random() * 100 - 50, randomY],
                                }}
                                exit={{
                                    scale: 0.05,
                                    opacity: 0,
                                    rotate: 0,
                                    x: randomX + Math.random() * 200 - 100,
                                    y: randomY + Math.random() * 200 - 100,
                                }}
                                transition={{
                                    duration: 3 + Math.random() * 2,
                                    ease: "easeInOut",
                                    delay: randomDelay,
                                    times: [0, 0.3, 0.6, 1],
                                }}
                                className="absolute"
                                style={{
                                    left: '50%',
                                    top: '50%',
                                    transform: 'translate(-50%, -50%)',
                                }}
                            >
                                <Image
                                    src={zerkImages[imageData.imageIndex]}
                                    alt={`Zerk ${imageData.imageIndex + 1}`}
                                    width={200}
                                    height={200}
                                    className="object-contain drop-shadow-2xl"
                                    style={{
                                        filter: 'drop-shadow(0 0 20px rgba(255, 255, 255, 0.4))',
                                    }}
                                />

                                {/* Individual glow effect */}
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 rounded-full blur-xl opacity-20"
                                    animate={{
                                        scale: [1, 1.3, 1],
                                        opacity: [0.2, 0.5, 0.2],
                                    }}
                                    transition={{
                                        duration: 2 + Math.random(),
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                        delay: Math.random() * 2,
                                    }}
                                />
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            {/* Floating elements */}
            <div className="absolute inset-0 pointer-events-none">
                {[...Array(8)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute text-6xl opacity-10"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            y: [0, -30, 0],
                            rotate: [0, 180, 360],
                            scale: [1, 1.2, 1],
                        }}
                        transition={{
                            duration: 4 + Math.random() * 2,
                            repeat: Infinity,
                            delay: Math.random() * 2,
                        }}
                    >
                        ⚡
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
