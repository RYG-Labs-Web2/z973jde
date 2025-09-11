'use client';

import { motion } from 'framer-motion';
import { Hero } from '../Hero';

export function Section1() {
    return (
        <section className="min-h-screen relative flex items-center justify-center">
            <div className="text-center text-white">
                <Hero />

            </div>
        </section>
    );
}
