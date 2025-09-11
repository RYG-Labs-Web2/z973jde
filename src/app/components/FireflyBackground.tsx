'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

// Component cho đom đóm
function Firefly({ delay = 0, size = 'small', color = 'yellow' }: {
    delay?: number;
    size?: 'small' | 'medium' | 'large';
    color?: 'yellow' | 'orange' | 'red' | 'white';
}) {
    const [position, setPosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        // Tạo vị trí ngẫu nhiên
        setPosition({
            x: Math.random() * 100,
            y: Math.random() * 100
        });
    }, []);

    const sizeClasses = {
        small: 'w-1 h-1',
        medium: 'w-2 h-2',
        large: 'w-3 h-3'
    };

    const colorClasses = {
        yellow: 'bg-yellow-400',
        orange: 'bg-orange-400',
        red: 'bg-red-400',
        white: 'bg-white'
    };

    const shadowStyles = {
        yellow: '0 0 10px #fbbf24, 0 0 20px #f59e0b, 0 0 30px #d97706',
        orange: '0 0 10px #fb923c, 0 0 20px #f97316, 0 0 30px #ea580c',
        red: '0 0 10px #f87171, 0 0 20px #ef4444, 0 0 30px #dc2626',
        white: '0 0 10px #ffffff, 0 0 20px #f3f4f6, 0 0 30px #e5e7eb'
    };

    return (
        <motion.div
            className={`absolute ${sizeClasses[size]} ${colorClasses[color]} rounded-full opacity-80`}
            style={{
                left: `${position.x}%`,
                top: `${position.y}%`,
                boxShadow: shadowStyles[color]
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
                opacity: [0, 1, 0.2, 1, 0.1, 1, 0],
                scale: [0, 1, 0.6, 1.3, 0.8, 1.1, 0],
                x: [0, Math.random() * 30 - 15, Math.random() * 40 - 20, Math.random() * 25 - 12.5],
                y: [0, Math.random() * 30 - 15, Math.random() * 40 - 20, Math.random() * 25 - 12.5]
            }}
            transition={{
                duration: 4 + Math.random() * 3,
                repeat: Infinity,
                delay: delay,
                ease: "easeInOut"
            }}
        />
    );
}

// Component cho đom đóm đặc biệt bay lượn
function SpecialFirefly({
    color = 'yellow',
    size = 'medium',
    duration = 8,
    delay = 0,
    startPosition = { x: 20, y: 30 }
}: {
    color?: 'yellow' | 'orange' | 'red' | 'white';
    size?: 'small' | 'medium' | 'large';
    duration?: number;
    delay?: number;
    startPosition?: { x: number; y: number };
}) {
    const sizeClasses = {
        small: 'w-2 h-2',
        medium: 'w-3 h-3',
        large: 'w-4 h-4'
    };

    const colorClasses = {
        yellow: 'bg-yellow-300',
        orange: 'bg-orange-400',
        red: 'bg-red-400',
        white: 'bg-white'
    };

    const shadowStyles = {
        yellow: '0 0 20px #fde047, 0 0 40px #facc15, 0 0 60px #eab308',
        orange: '0 0 15px #fb923c, 0 0 30px #f97316, 0 0 45px #ea580c',
        red: '0 0 12px #f87171, 0 0 24px #ef4444, 0 0 36px #dc2626',
        white: '0 0 15px #ffffff, 0 0 30px #f3f4f6, 0 0 45px #e5e7eb'
    };

    const opacityValues = {
        yellow: [0.6, 1, 0.3, 0.8, 0.6],
        orange: [0.7, 1, 0.2, 0.9, 0.7],
        red: [0.8, 1, 0.1, 0.7, 0.8],
        white: [0.6, 1, 0.4, 0.8, 0.6]
    };

    const scaleValues = {
        yellow: [1, 1.5, 0.8, 1.2, 1],
        orange: [1, 1.3, 0.7, 1.1, 1],
        red: [1, 1.4, 0.6, 1.3, 1],
        white: [1, 1.2, 0.8, 1.1, 1]
    };

    const movementPatterns = {
        yellow: {
            x: [0, 100, -50, 80, 0],
            y: [0, -30, 50, -20, 0]
        },
        orange: {
            x: [0, -80, 60, -40, 0],
            y: [0, 40, -60, 30, 0]
        },
        red: {
            x: [0, 60, -80, 40, 0],
            y: [0, -50, 70, -30, 0]
        },
        white: {
            x: [0, 70, -60, 50, 0],
            y: [0, -40, 60, -25, 0]
        }
    };

    return (
        <motion.div
            className={`absolute ${sizeClasses[size]} ${colorClasses[color]} rounded-full opacity-60`}
            style={{
                left: `${startPosition.x}%`,
                top: `${startPosition.y}%`,
                boxShadow: shadowStyles[color]
            }}
            animate={{
                ...movementPatterns[color],
                opacity: opacityValues[color],
                scale: scaleValues[color]
            }}
            transition={{
                duration: duration,
                repeat: Infinity,
                ease: "easeInOut",
                delay: delay
            }}
        />
    );
}

// Component chính cho background đom đóm
interface FireflyBackgroundProps {
    count?: number;
    showSpecialFireflies?: boolean;
    specialFireflies?: Array<{
        color?: 'yellow' | 'orange' | 'red' | 'white';
        size?: 'small' | 'medium' | 'large';
        duration?: number;
        delay?: number;
        startPosition?: { x: number; y: number };
    }>;
}

export function FireflyBackground({
    count = 20,
    showSpecialFireflies = true,
    specialFireflies = [
        { color: 'yellow', size: 'large', duration: 8, delay: 0, startPosition: { x: 20, y: 30 } },
        { color: 'orange', size: 'medium', duration: 10, delay: 2, startPosition: { x: 70, y: 60 } },
        { color: 'red', size: 'small', duration: 12, delay: 4, startPosition: { x: 50, y: 20 } }
    ]
}: FireflyBackgroundProps) {
    const colors: ('yellow' | 'orange' | 'red' | 'white')[] = ['yellow', 'orange', 'red', 'white'];
    const sizes: ('small' | 'medium' | 'large')[] = ['small', 'medium', 'large'];

    return (
        <>
            {/* Đom đóm ngẫu nhiên */}
            {Array.from({ length: count }, (_, i) => {
                const randomColor = colors[Math.floor(Math.random() * colors.length)];
                const randomSize = sizes[Math.floor(Math.random() * sizes.length)];

                return (
                    <Firefly
                        key={`firefly-${i}`}
                        delay={i * 0.2}
                        color={randomColor}
                        size={randomSize}
                    />
                );
            })}

            {/* Đom đóm đặc biệt */}
            {showSpecialFireflies && specialFireflies.map((firefly, index) => (
                <SpecialFirefly
                    key={`special-firefly-${index}`}
                    color={firefly.color}
                    size={firefly.size}
                    duration={firefly.duration}
                    delay={firefly.delay}
                    startPosition={firefly.startPosition}
                />
            ))}
        </>
    );
}
