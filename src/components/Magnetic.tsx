"use client";

import React, { useEffect, useRef, ReactNode } from 'react';
import gsap from 'gsap';

/**
 * Magnetic hover: the element eases toward the cursor with an elastic spring,
 * giving it weight and "life". Decorative, so it's gated behind fine-pointer
 * devices and disabled under reduced motion (no false hover on touch).
 */
export default function Magnetic({ children, strength = 0.35 }: { children: ReactNode; strength?: number }) {
    const magnetic = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!magnetic.current) return;

        // Only fine pointers, and respect reduced-motion preference.
        const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (!finePointer || reduceMotion) return;

        const xTo = gsap.quickTo(magnetic.current, "x", { duration: 1, ease: "elastic.out(1, 0.3)" });
        const yTo = gsap.quickTo(magnetic.current, "y", { duration: 1, ease: "elastic.out(1, 0.3)" });

        const handleMouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e;
            const { height, width, left, top } = magnetic.current!.getBoundingClientRect();
            const x = clientX - (left + width / 2);
            const y = clientY - (top + height / 2);
            xTo(x * strength);
            yTo(y * strength);
        };

        const handleMouseLeave = () => {
            xTo(0);
            yTo(0);
        };

        const currentRef = magnetic.current;
        currentRef.addEventListener("mousemove", handleMouseMove);
        currentRef.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            currentRef.removeEventListener("mousemove", handleMouseMove);
            currentRef.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, [strength]);

    return (
        <div ref={magnetic} style={{ display: 'inline-block' }}>
            {children}
        </div>
    );
}
