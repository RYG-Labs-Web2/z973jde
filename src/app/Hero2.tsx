'use client';

import { Canvas } from '@react-three/fiber';
import { HeroScene } from './HeroScene2';
import { useState, useEffect } from 'react';
import Lenis from 'lenis';

interface HeroProps {
  setIsScrolledOverHeroScene: (isScrolled: boolean) => void;
  stuckGridRef: React.RefObject<HTMLDivElement | null>;
}

interface LenisScrollEvent {
  scroll: number;
}

export function Hero() {

  return (
    <div className="absolute inset-0 z-0 w-screen">
      <Canvas className="w-full h-full" style={{ background: 'transparent' }}>
        <ambientLight />
        <HeroScene />
      </Canvas>
    </div>
  );
}
