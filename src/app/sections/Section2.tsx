'use client';

import { motion } from 'framer-motion';
import { Hero } from '../Hero2';
import { FireflyBackground } from '../components/FireflyBackground';

export function Section2() {
    const text = "In the deepest pit of the Crypto Underworld, where dead memes rot in endless FUD, a freak was born. Not of light, not of darkness, but from pure hatred, doubt, disdain and curses of humanity. Thus, ZERK – The FUD-Eater came to life.";

    return (
        <section className="min-h-screen relative flex items-center justify-start pl-24 pr-8 bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden">
            {/* Component đom đóm background */}
            <FireflyBackground
                count={20}
                showSpecialFireflies={true}
                specialFireflies={[
                    { color: 'yellow', size: 'large', duration: 8, delay: 0, startPosition: { x: 20, y: 30 } },
                    { color: 'orange', size: 'medium', duration: 10, delay: 2, startPosition: { x: 70, y: 60 } },
                    { color: 'red', size: 'small', duration: 12, delay: 4, startPosition: { x: 50, y: 20 } }
                ]}
            />

            <motion.div
                className="text-left text-white max-w-4xl relative"
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                    duration: 0.8,
                    ease: "easeOut",
                    delay: 0.2
                }}
            >
                {/* Simplified background glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-red-900/10 via-orange-900/10 to-red-900/10 blur-2xl rounded-lg"></div>

                <motion.div
                    className="relative z-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                >
                    <motion.p
                        className="text-[36px] md:text-[42px] lg:text-[48px] leading-relaxed font-bold font-creepster gradient-text"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            duration: 1.2,
                            ease: "easeOut",
                            delay: 0.7
                        }}
                    >
                        {text}
                    </motion.p>
                </motion.div>

                {/* Simplified decorative elements */}
                <motion.div
                    className="absolute -top-10 -left-10 w-16 h-16 border border-red-500/20 rounded-full"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1.5, duration: 0.8, ease: "easeOut" }}
                />
                <motion.div
                    className="absolute -bottom-10 -right-10 w-12 h-12 border border-orange-500/20 rounded-full"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1.8, duration: 0.8, ease: "easeOut" }}
                />
            </motion.div>

            <style jsx>{`
                .gradient-text {
                    background: linear-gradient(135deg, #ff6b6b, #ff8e53, #ee5a24);
                    background-size: 200% 200%;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    text-shadow: 0 0 20px rgba(255, 107, 107, 0.3);
                    animation: gradientShift 4s ease-in-out infinite;
                }
                
                @keyframes gradientShift {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
            `}</style>
        </section>
    );
}
