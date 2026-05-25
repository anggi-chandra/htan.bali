'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import Link from 'next/link';
import { useLoading } from '../context/LoadingContext';

export default function Hero() {
    const heroRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const subtitleRef = useRef<HTMLParagraphElement>(null);
    const ctaRef = useRef<HTMLDivElement>(null);

    const { isLoading } = useLoading();

    useEffect(() => {
        if (isLoading) return;

        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

            tl.from(titleRef.current, {
                y: 100,
                opacity: 0,
                duration: 1,
                delay: 0.2,
            })
                .from(
                    subtitleRef.current,
                    {
                        y: 50,
                        opacity: 0,
                        duration: 1,
                    },
                    '-=0.6'
                )
                .from(
                    ctaRef.current,
                    {
                        y: 30,
                        opacity: 0,
                        duration: 0.8,
                    },
                    '-=0.6'
                );
        }, heroRef);

        return () => ctx.revert();
    }, [isLoading]);

    return (
        <div ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden">
            {/* Background with overlay */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black z-10" />
                <img
                    src="/gambar_background_home_page.png"
                    alt="Concert Crowd"
                    className="w-full h-full object-cover opacity-60"
                />
            </div>

            <div className="relative z-20 text-center px-4 max-w-5xl mx-auto">
                <h1
                    ref={titleRef}
                    className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 tracking-tight"
                >
                    Communicate <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">Without Limits</span>
                </h1>
                <p
                    ref={subtitleRef}
                    className="text-xl md:text-2xl text-gray-300 mb-10 max-w-5xl mx-auto leading-relaxed"
                >
                    Penyewaan peralatan premium untuk acara, produksi, dan keamanan di Bali.
                    <br className="hidden md:block" />
                    Audio jernih, koneksi andal, layanan profesional.
                </p>
                <div ref={ctaRef} className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        href="/catalog"
                        className="px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-all transform hover:scale-105"
                    >
                        Lihat Katalog
                    </Link>
                    <a
                        href="https://wa.me/6282145580460" // Replace with actual number
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-8 py-4 bg-transparent border border-white/30 text-white font-bold rounded-full hover:bg-white/10 transition-all"
                    >
                        Hubungi Kami
                    </a>
                </div>
            </div>
        </div>
    );
}
