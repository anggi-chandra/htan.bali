'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const images = [
    { src: '/gambar_ht_baofeng.png', alt: 'HT Baofeng' },
    { src: '/gambar_interkom.png', alt: 'Interkom' },
    { src: '/gambar_toa.png', alt: 'Toa' },
    { src: '/gambar_ht_baofeng.png', alt: 'HT Baofeng' },
    { src: '/gambar_interkom.png', alt: 'Interkom' },
    { src: '/gambar_toa.png', alt: 'Toa' },
];

export default function AutoScrollImages() {
    const containerRef = useRef<HTMLDivElement>(null);
    const scrollerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const scroller = scrollerRef.current;
            if (!scroller) return;

            const scrollerContent = Array.from(scroller.children);

            // Clone items for seamless looping
            scrollerContent.forEach((item) => {
                const clone = item.cloneNode(true);
                scroller.appendChild(clone);
            });

            const totalWidth = scroller.scrollWidth / 2;

            gsap.to(scroller, {
                x: -totalWidth,
                duration: 20,
                ease: 'none',
                repeat: -1,
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="w-full overflow-hidden py-10 bg-white/5">
            <div ref={scrollerRef} className="flex gap-8 w-max px-4">
                {images.map((img, index) => (
                    <div
                        key={index}
                        className="relative w-96 h-60 flex-shrink-0 bg-white/5 rounded-2xl overflow-hidden flex items-center justify-center p-4 transition-all duration-300 ease-out grayscale hover:grayscale-0 hover:scale-110 hover:bg-white/10 hover:z-10 opacity-60 hover:opacity-100"
                    >
                        <img
                            src={img.src}
                            alt={img.alt}
                            className="w-full h-full object-contain drop-shadow-lg"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
