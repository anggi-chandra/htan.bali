"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useLoading } from "../context/LoadingContext";
import { usePathname, useRouter } from "next/navigation";

export default function LoadingScreen() {
    const [progress, setProgress] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const barRef = useRef<HTMLDivElement>(null);
    const logoRef = useRef<HTMLImageElement>(null);

    const { setIsLoading } = useLoading();
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        // Redirect to home if not on home page
        if (pathname !== '/') {
            router.push('/');
        }

        // Prevent browser from restoring scroll position
        if (typeof window !== 'undefined') {
            window.history.scrollRestoration = 'manual';
        }

        window.scrollTo(0, 0);

        const tl = gsap.timeline({
            onComplete: () => {
                setIsLoading(false);
                // Fade out the entire container after loading is complete
                gsap.to(containerRef.current, {
                    opacity: 0,
                    duration: 0.5,
                    display: "none",
                    onComplete: () => {
                        // Re-enable scroll restoration after loading
                        if (typeof window !== 'undefined') {
                            window.history.scrollRestoration = 'auto';
                        }
                    }
                });
            },
        });

        // Animate logo
        tl.fromTo(
            logoRef.current,
            { opacity: 0, scale: 0.8 },
            { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.7)" }
        );

        // Animate progress bar
        tl.to(
            {},
            {
                duration: 2, // Loading time
                onUpdate: function () {
                    const p = Math.round(this.progress() * 100);
                    setProgress(p);
                    if (barRef.current) {
                        barRef.current.style.width = `${p}%`;
                    }
                },
            }
        );
    }, []);

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black text-white"
        >
            <div className="relative w-32 h-32 mb-8">
                <Image
                    ref={logoRef}
                    src="/logo_htan.png"
                    alt="HTan Bali Logo"
                    fill
                    className="object-contain opacity-0"
                    priority
                />
            </div>

            <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                    ref={barRef}
                    className="h-full bg-[#F69B26] w-0"
                ></div>
            </div>

            <div className="mt-2 text-sm text-gray-400 font-mono">
                {progress}%
            </div>
        </div>
    );
}
