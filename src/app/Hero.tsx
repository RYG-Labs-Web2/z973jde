'use client';

import { Canvas } from '@react-three/fiber';
import { HeroScene } from './HeroScene';
import { useState, useEffect } from 'react';
import Lenis from 'lenis';

interface HeroProps {
  setIsScrolledOverHeroScene: (isScrolled: boolean) => void;
  stuckGridRef: React.RefObject<HTMLDivElement | null>;
}

const easeInOutCubic = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

interface LenisScrollEvent {
  scroll: number;
}

export function Hero() {

  return (
    <div className="absolute inset-0 z-0 w-screen">
      <Canvas className="w-full h-full" style={{ background: 'transparent', pointerEvents: 'none' }}>
        <ambientLight />
        <HeroScene />
      </Canvas>
    </div>
  );
}
