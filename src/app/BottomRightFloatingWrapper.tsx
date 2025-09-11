'use client';

import { Canvas } from '@react-three/fiber';
import { BottomRightFloatingComponent } from './BottomRightFloatingComponent';

interface BottomRightFloatingWrapperProps {
    currentSection: number;
}

export function BottomRightFloatingWrapper({ currentSection }: BottomRightFloatingWrapperProps) {
    // Show component in Section 1 and 2 (section 0,1), hide in Section 3 and 4 (section 2,3)
    const isVisible = currentSection <= 1;

    console.log(`BottomRightFloating: ${isVisible ? 'showing' : 'hiding'} at section ${currentSection}`);

    // Không render gì cả khi không visible để tránh che khuất
    if (!isVisible) {
        return null;
    }

    return (
        <div className="fixed -bottom-[100px] -right-[200px] z-50 w-full h-full pointer-events-none">
            <div className="w-full h-full pointer-events-auto">
                <Canvas
                    camera={{ position: [0, 0, 10], fov: 75 }}
                    style={{ width: '100%', height: '100%' }}
                >
                    <ambientLight />
                    <BottomRightFloatingComponent isVisible={isVisible} />
                </Canvas>
            </div>
        </div>
    );
}
