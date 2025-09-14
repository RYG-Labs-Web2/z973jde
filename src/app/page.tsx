'use client';
import { useState, useRef } from 'react';
import { Hero } from './Hero';
import { ScrollButton } from './ScrollButton';
import { Section1 } from './sections/Section1';
import { Section2 } from './sections/Section2';
import { Section3 } from './sections/Section3';
import { Section4 } from './sections/Section4';
import { Section5 } from './sections/Section5';
import { Section6 } from './sections/Section6';
import { BackgroundGradient } from './BackgroundGradient';
import { useSmoothScroll } from './hooks/useSmoothScroll';
import { BottomRightFloatingWrapper } from './BottomRightFloatingWrapper';


export default function Home() {
  const [isScrolledOverHeroScene, setIsScrolledOverHeroScene] = useState(false);
  const stuckGridRef = useRef<HTMLDivElement>(null);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

  // Initialize smooth scroll hook and get current section
  const { currentSection } = useSmoothScroll();

  const handleImageLoad = (imageSrc: string) => {
    setLoadedImages(prev => new Set(prev).add(imageSrc));
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const
      }
    },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 1.2, ease: "easeOut" as const }
    },
  };

  const uiVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { delay: 1.2, duration: 0.8, ease: "easeOut" as const }
    },
  };

  return (
    <>
      <BackgroundGradient />
      <Section1 />
      <Section2 />
      <Section3 />
      <Section4 />
      {/* <Section5 /> */}
      {/* <Section6 /> */}
      <ScrollButton />
      <BottomRightFloatingWrapper currentSection={currentSection} />
    </>
  );
}
