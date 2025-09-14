'use client';

import { motion } from 'framer-motion';
import { Hero } from '../Hero';
import Image from 'next/image';
import Link from 'next/link';



export function Section1() {
    const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 1.5 } },
    };
    const uiVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { delay: 1.5, duration: 0.8 } },
  };
    
    return (
        <section className="min-h-screen relative flex items-center justify-center">
            <div className="text-center text-white">
                <Hero />
                 <motion.div
        className="relative w-screen z-[999]"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div
          className="absolute inset-0"
          initial="hidden"
          animate="visible"
          variants={uiVariants}
        >

          <div className="absolute bottom-1/2 left-1/2 -translate-x-50 translate-y-33  pointer-events-auto">
            <motion.div
              whileHover={{ scale: 1.1, transition: { type: "spring", stiffness: 400, damping: 10 } }}
              whileTap={{ scale: 0.9 }}
              className="cursor-pointer"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            >
              <a href="https://example.com/dex" className='cursor-pointer' style={{ cursor: 'pointer !important' }}>
                <Image src="/img/Button Dex.png" alt="Dex Button" width={100} height={40} />
              </a>
            </motion.div>
          </div>
          <div className="absolute bottom-1/2 left-1/2 -translate-x-15 translate-y-10 pointer-events-auto scale-80">
            <motion.div
              whileHover={{ scale: 1.1, transition: { type: "spring", stiffness: 400, damping: 10 } }}
              whileTap={{ scale: 0.9 }}
              className="cursor-pointer"
              animate={{ y: [0, -7, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <a href="https://example.com/x" className='cursor-pointer' style={{ cursor: 'pointer !important' }}>
                <Image src="/img/Button X.png" alt="X Button" width={100} height={40} />
              </a>
            </motion.div>
          </div>

          {/* Floating BUY.png */}
          <motion.div
            className="absolute left-1/2 top-1/2 -translate-x-25 translate-y-40 pointer-events-auto z-10"
            animate={{ y: [0, -5, 0] }} // Bobbing animation
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <a href="https://example.com/buy-coin" className='cursor-pointer' style={{ cursor: 'pointer !important' }}>
                <Image src="/img/BUY.png" alt="Floating BUY Coin" width={150} height={150} />
            </a>
          </motion.div>

          {/* BUY $ZERK Button */}
          <div className="absolute top-1/2 left-1/2 -translate-x-30 translate-y-34 pointer-events-auto hover:shadow-none cursor-pointer">
            <motion.div
              whileHover={{ scale: 1.1, transition: { type: "spring", stiffness: 400, damping: 10 } }}
              whileTap={{ scale: 0.9 }}
              className="cursor-pointer"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 2.3, repeat: Infinity, ease: "easeInOut" }}
            >
              <a href="https://example.com/buy-zerk" className='cursor-pointer' style={{ cursor: 'pointer !important' }}>
                <Image src="/img/Button buy.png" alt="Buy Zerk Button" width={200} height={80} />
              </a>
            </motion.div>
          </div>
        </motion.div>

      </motion.div>

            </div>
        </section>
    );
}
