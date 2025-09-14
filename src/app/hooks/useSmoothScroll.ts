'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

// Đăng ký plugin GSAP
gsap.registerPlugin(ScrollToPlugin);

export function useSmoothScroll() {
    const [currentSection, setCurrentSection] = useState(0);
    const [isScrolling, setIsScrolling] = useState(false);
    const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const scrollLockRef = useRef<boolean>(false);
    const currentSectionRef = useRef<number>(0);
    const delayTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Initialize current section based on scroll position
    useEffect(() => {
        const initializeSection = () => {
            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', initializeSection);
                return;
            }

            const scrollY = window.pageYOffset;
            const sectionHeight = window.innerHeight;
            const initialSection = Math.round(scrollY / sectionHeight);
            const clampedSection = Math.max(0, Math.min(initialSection, 3)); // 0-5 sections

            setCurrentSection(clampedSection);
            currentSectionRef.current = clampedSection;
            console.log(`Initialized section to ${clampedSection} based on scroll position ${scrollY}`);
        };

        // Initialize immediately
        initializeSection();
    }, []);

    const scrollToSection = (sectionIndex: number) => {
        // Kiểm tra lock trước - phải check cả isScrolling và scrollLockRef
        if (isScrolling || scrollLockRef.current) {
            console.log('Scroll blocked - already scrolling or locked');
            return;
        }

        // Lock ngay lập tức để ngăn scroll tiếp theo
        scrollLockRef.current = true;
        setIsScrolling(true);
        setCurrentSection(sectionIndex);
        currentSectionRef.current = sectionIndex;

        console.log(`Starting scroll to section ${sectionIndex}`);

        const targetY = sectionIndex * window.innerHeight;

        gsap.to(window, {
            duration: 1.0, // Tăng duration để scroll mượt hơn
            scrollTo: { y: targetY, autoKill: false },
            ease: "power2.inOut",
            onComplete: () => {
                console.log(`Scroll animation completed to section ${sectionIndex}`);
                // Delay 1.5 giây trước khi cho phép scroll tiếp theo
                delayTimeoutRef.current = setTimeout(() => {
                    scrollLockRef.current = false;
                    setIsScrolling(false);
                    console.log(`Section ${sectionIndex} - ready for next scroll`);
                }, 1500); // Tăng delay lên 1.5 giây
            }
        });

        // Clear timeout nếu có
        if (scrollTimeoutRef.current) {
            clearTimeout(scrollTimeoutRef.current);
        }

        // Backup timeout để đảm bảo unlock - tăng thời gian
        scrollTimeoutRef.current = setTimeout(() => {
            scrollLockRef.current = false;
            setIsScrolling(false);
            console.log('Scroll timeout - force unlock');
        }, 3000); // Tăng lên 3 giây
    };

    const scrollToNext = () => {
        const maxSections = 6; // Tổng số section
        const nextSection = Math.min(currentSectionRef.current + 1, maxSections - 1);
        console.log(`ScrollToNext: from ${currentSectionRef.current} to ${nextSection}`);
        scrollToSection(nextSection);
    };

    const scrollToPrevious = () => {
        const prevSection = Math.max(currentSectionRef.current - 1, 0);
        console.log(`ScrollToPrevious: from ${currentSectionRef.current} to ${prevSection}`);
        scrollToSection(prevSection);
    };

    const forceUnlock = () => {
        console.log('Force unlocking scroll...');
        scrollLockRef.current = false;
        setIsScrolling(false);
        if (scrollTimeoutRef.current) {
            clearTimeout(scrollTimeoutRef.current);
        }
        if (delayTimeoutRef.current) {
            clearTimeout(delayTimeoutRef.current);
        }
    };

    useEffect(() => {
        const handleWheel = (e: WheelEvent) => {
            e.preventDefault();

            // Kiểm tra lock nghiêm ngặt
            if (isScrolling || scrollLockRef.current) {
                console.log('Wheel event blocked - scroll locked');
                return;
            }

            // Thêm threshold nhỏ để tránh scroll quá nhạy
            const threshold = 10;
            if (Math.abs(e.deltaY) < threshold) {
                return;
            }

            if (e.deltaY > 0) {
                // Scroll xuống
                console.log(`Wheel down: current section ${currentSectionRef.current}`);
                scrollToNext();
            } else if (e.deltaY < 0) {
                // Scroll lên  
                console.log(`Wheel up: current section ${currentSectionRef.current}`);
                scrollToPrevious();
            }
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            // Kiểm tra lock nghiêm ngặt
            if (isScrolling || scrollLockRef.current) {
                console.log('Key event blocked - scroll locked');
                return;
            }

            if (e.key === 'ArrowDown' || e.key === 'PageDown') {
                e.preventDefault();
                console.log(`Key down: current section ${currentSectionRef.current}`);
                scrollToNext();
            } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
                e.preventDefault();
                console.log(`Key up: current section ${currentSectionRef.current}`);
                scrollToPrevious();
            }
        };

        // Thêm event listeners
        window.addEventListener('wheel', handleWheel, { passive: false });
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('wheel', handleWheel);
            window.removeEventListener('keydown', handleKeyDown);
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }
            if (delayTimeoutRef.current) {
                clearTimeout(delayTimeoutRef.current);
            }
            // Unlock khi cleanup
            scrollLockRef.current = false;
        };
    }, [currentSection, isScrolling]);

    // Detect current section based on scroll position
    useEffect(() => {
        const handleScroll = () => {
            if (isScrolling) return;

            const scrollY = window.pageYOffset;
            const sectionHeight = window.innerHeight;
            const newSection = Math.round(scrollY / sectionHeight);
            const clampedSection = Math.max(0, Math.min(newSection, 5));

            // Chỉ update nếu section thực sự thay đổi và trong phạm vi hợp lệ
            if (clampedSection !== currentSection && clampedSection >= 0 && clampedSection < 6) {
                console.log(`Section changed from ${currentSection} to ${clampedSection}`);
                setCurrentSection(clampedSection);
                currentSectionRef.current = clampedSection;
            }
        };

        // Chỉ listen scroll khi không đang scroll
        if (!isScrolling) {
            window.addEventListener('scroll', handleScroll);
        }

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [currentSection, isScrolling]);

    // Emergency unlock mechanism - tự động unlock sau 4 giây nếu bị stuck
    useEffect(() => {
        const emergencyTimeout = setTimeout(() => {
            if (isScrolling || scrollLockRef.current) {
                console.log('Emergency unlock triggered - scroll was stuck');
                forceUnlock();
            }
        }, 4000); // Giảm xuống 4 giây vì backup timeout đã là 3 giây

        return () => clearTimeout(emergencyTimeout);
    }, [isScrolling]);

    return {
        currentSection,
        isScrolling,
        scrollToSection,
        scrollToNext,
        scrollToPrevious,
        forceUnlock
    };
}
