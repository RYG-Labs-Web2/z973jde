'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useSmoothScroll } from './hooks/useSmoothScroll';

export function ScrollButton() {
    const [isVisible, setIsVisible] = useState(true);
    const { currentSection, isScrolling, scrollToNext } = useSmoothScroll();

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            // Ẩn nút khi ở section cuối cùng
            setIsVisible(currentSection < 3);
        };

        handleScroll(); // Gọi ngay lập tức
    }, [currentSection]);

    const bounceVariants = {
        animate: {
            y: [0, -8, 0],
            transition: {
                duration: 1.8,
                repeat: Infinity,
                ease: "easeInOut" as const
            }
        },
        disabled: {
            y: 0,
            transition: {
                duration: 0.3,
                ease: "easeOut" as const
            }
        }
    };

    const pulseVariants = {
        animate: {
            scale: [1, 1.05, 1],
            transition: {
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut" as const
            }
        }
    };

    if (!isVisible) return null;

    return (
        <motion.div
            className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 flex flex-col items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2, duration: 0.8 }}
        >
            <motion.button
                onClick={scrollToNext}
                disabled={isScrolling}
                className="w-10 h-10 bg-white/15 backdrop-blur-md border border-white/25 rounded-full flex items-center justify-center cursor-pointer hover:bg-white/25 transition-all duration-300 group shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                variants={bounceVariants}
                animate={isScrolling ? "disabled" : "animate"}
                whileHover={!isScrolling ? { scale: 1.05 } : {}}
                whileTap={!isScrolling ? { scale: 0.95 } : {}}
            >
                <motion.div
                    className="w-4 h-6 border border-white/60 rounded-full flex justify-center relative"
                    variants={pulseVariants}
                    animate="animate"
                >
                    <motion.div
                        className="w-0.5 h-2 bg-white/80 rounded-full mt-1"
                        animate={{
                            y: [0, 8, 0],
                            opacity: [1, 0.4, 1]
                        }}
                        transition={{
                            duration: 1.8,
                            repeat: Infinity,
                            ease: "easeInOut" as const
                        }}
                    />
                </motion.div>
            </motion.button>

            <motion.p
                className="text-white/50 text-[10px] mt-1.5 text-center font-light tracking-wide"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3, duration: 0.8 }}
            >
                Scroll to explore
            </motion.p>
        </motion.div>
    );
}
