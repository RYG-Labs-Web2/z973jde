'use client';

import { useEffect, useState } from 'react';
import { useSmoothScroll } from './hooks/useSmoothScroll';

export function BackgroundGradient() {
    const { currentSection } = useSmoothScroll();
    const [scrollProgress, setScrollProgress] = useState(0);

    // Các màu gradient cho từng section
    const sectionColors = [
        { from: '#FF897D', via: '#FF6B5B', to: '#FF4A3C' }, // Section 0
        { from: '#FF897D', via: '#FF6B5B', to: '#FF4A3C' }, // Section 1
        { from: '#FF897D', via: '#FF6B5B', to: '#FF4A3C' }, // Section 2
        { from: '#FF897D', via: '#FF6B5B', to: '#FF4A3C' }, // Section 3
    ];

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.pageYOffset;
            const windowHeight = window.innerHeight;
            const totalHeight = windowHeight * 4; // 4 sections
            const progress = Math.min(scrollY / totalHeight, 1);
            setScrollProgress(progress);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Tính toán màu gradient dựa trên scroll position
    const getCurrentGradient = () => {
        const currentColors = sectionColors[currentSection] || sectionColors[0];
        return `linear-gradient(135deg, ${currentColors.from} 0%, ${currentColors.via} 50%, ${currentColors.to} 100%)`;
    };

    return (
        <div
            className="fixed inset-0 -z-10 transition-all duration-1000 ease-out"
            style={{
                background: getCurrentGradient(),
                backgroundSize: '400% 400%',
                animation: 'gradientShift 15s ease infinite'
            }}
        />
    );
}
