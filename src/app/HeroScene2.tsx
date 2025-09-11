'use client';

import { useLoader, useFrame, ThreeEvent, useThree } from '@react-three/fiber';
import { TextureLoader, Mesh } from 'three';
import { useRef, useState, useEffect } from 'react';
import { Plane } from '@react-three/drei';
import * as THREE from 'three';


// 1. Extract Magic Numbers
const ANIMATION_PARAMS = {
  bgCloud: { y: -1.0, sinFactor: 1.5, sinAmplitude: 0.04 },
  zerkLogo: { y: 0.5, sinFactor: 1.2, sinAmplitude: 0.05 },
  planet: { y: -4, sinFactor: 1, sinAmplitude: 0.015 },
  cloud1: { y: -1.6, sinFactor: 2, sinAmplitude: 0.07 },
  cloud2: { y: -2, sinFactor: 1.1, sinAmplitude: 0.02 },
  typo: { y: 1.5, sinFactor: 1.4, sinAmplitude: 0.035 },
  link: { y: 3, sinFactor: 1.6, sinAmplitude: 0.045 },
};

interface ImageProps {
  textureUrl: string;
  innerRef?: React.Ref<Mesh>;
  alt: string;
  [key: string]: unknown; // Allow other props
}

function Image({ textureUrl, innerRef, delay = 0, ...props }: ImageProps & { delay?: number }) {
  const texture = useLoader(TextureLoader, textureUrl);
  const aspectRatio = texture.image ? texture.image.height / texture.image.width : 1;
  const [opacity, setOpacity] = useState(0);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);

  useEffect(() => {
    // Simple fade-in animation when texture loads
    const timer = setTimeout(() => {
      setOpacity(1);
    }, 100 + delay);

    return () => clearTimeout(timer);
  }, [texture, delay]);

  useFrame(() => {
    // Smooth opacity transition
    if (materialRef.current && materialRef.current.opacity !== opacity) {
      materialRef.current.opacity += (opacity - materialRef.current.opacity) * 0.05;
    }
  });

  return (
    <Plane args={[1, aspectRatio]} ref={innerRef as React.Ref<THREE.Mesh> | undefined} {...props}>
      <meshStandardMaterial ref={materialRef} map={texture} transparent={true} opacity={0} />
    </Plane>
  );
}


export function HeroScene({ }) {
  const { clock } = useThree();
  const planetRef = useRef<Mesh>(null!);
  const zerkLogoRef = useRef<Mesh>(null!);

  const animatedRefs = {
    bgCloudRef: useRef<Mesh>(null!),
    zerkLogoRef: zerkLogoRef,
    planetRef: planetRef,
    cloud1Ref: useRef<Mesh>(null!),
    cloud2Ref: useRef<Mesh>(null!),
    typoRef: useRef<Mesh>(null!),
    linkRef: useRef<Mesh>(null!),
  };

  const [isDragging, setIsDragging] = useState(false);
  const lastMouseX = useRef(0);
  const [zerkLogoAnimation, setZerkLogoAnimation] = useState({ time: 0, running: false });

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();

    // 3. Data-driven animation loop
    Object.entries(animatedRefs).forEach(([key, ref]) => {
      const params = ANIMATION_PARAMS[key.replace('Ref', '') as keyof typeof ANIMATION_PARAMS];
      if (ref.current && params) {
        ref.current.position.y = params.y + Math.sin(elapsedTime * params.sinFactor) * params.sinAmplitude;
      }
    });


    if (zerkLogoAnimation.running) {
      const progress = (elapsedTime - zerkLogoAnimation.time) / 0.1;
      if (progress < 1) {
        const scale = 3.6 + 0.4 * Math.sin(progress * Math.PI); // Animate from 3.6 to 4 and back to 3.6
        zerkLogoRef.current.scale.set(scale, scale, 1);
      } else {
        zerkLogoRef.current.scale.set(3.6, 3.6, 1);
        setZerkLogoAnimation({ time: 0, running: false });
      }
    }


  });

  const handleZerkLogoClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    setZerkLogoAnimation({ time: clock.getElapsedTime(), running: true });
  };

  return (
    <>


      <ambientLight intensity={2} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      <pointLight position={[-10, -10, -10]} />
      <Image
        alt=""
        innerRef={animatedRefs.zerkLogoRef}
        textureUrl="/img/Zerk.png"
        position={[3.7, 2, 0]}
        scale={[3.5, 3.5, 1]}
        delay={400}
        onClick={handleZerkLogoClick}
        onPointerOver={() => (document.body.style.cursor = 'pointer')}
        onPointerOut={() => (document.body.style.cursor = 'auto')}
      />
      <Image
        alt=""
        innerRef={animatedRefs.planetRef}
        textureUrl="/img/Planet.png"
        position={[8, -4, -2.2]}
        scale={[5, 5, 1]}
        delay={600}

      />
      <Image alt="" innerRef={animatedRefs.cloud1Ref} textureUrl="/img/Cloud 1.png" position={[6, -1.8, -1]} scale={[5, 3, 1]} rotation={[0, 0, 0.25]} delay={300} />

    </>
  );
}