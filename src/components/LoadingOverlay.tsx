"use client";

import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

type LoadingOverlayProps = {
    /** 1 = vitesse normale, >1 plus rapide, <1 plus lente */
    speed?: number;
};

function BeeIcon({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 160 160"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            role="img"
            aria-label="Phobee loader"
        >
            <defs>
                <linearGradient id="bee-grad" x1="80.34" y1="70.91" x2="80.34" y2="20.38" gradientUnits="userSpaceOnUse">
                    <stop offset="0" stopColor="#ffc82c" />
                    <stop offset="1" stopColor="#ffc82c" />
                </linearGradient>
            </defs>
            <path
                className="fill-white"
                d="M48.3,108.21c0-17.87,13.3-31.82,31.95-31.82,18.52-.13,30.52,13.04,30.52,27.26,0,4.96-1.7,10.17-4.44,14.35h-16.95c2.87-4.04,4.56-7.96,4.56-12.26,0-7.83-5.87-13.69-13.69-13.69-9.13,0-15.39,7.04-15.39,15.91s6.91,17.35,20.61,17.35h25.17l-4.43,15.52h-22.43c-20.74,0-35.47-13.96-35.47-32.61Z"
            />
            <path
                className="fill-[#ffc82c] bee-wing bee-wing-left"
                d="M46.77,49.83c-1.32,5.6,1.6,13.83,23.16,21.07,0,0-2.33-18.05-10.86-25.05-4.44-3.65-10.98-1.62-12.3,3.98"
            />
            <path
                className="fill-[url(#bee-grad)] bee-wing bee-wing-right"
                d="M79.28,70.91s16.07-23.25,13.51-40.19c-1.34-8.82-10.99-13.28-18.33-8.19-7.34,5.09-12.53,17.61,4.82,48.38Z"
            />
        </svg>
    );
}

export default function LoadingOverlay({ speed = 1 }: LoadingOverlayProps) {
    const safeSpeed = Math.max(speed, 0.2);

    const timings = useMemo(() => {
        const flightDurationMs = Math.round(5200 / safeSpeed);
        const fadeDurationMs = Math.round(900 / safeSpeed);
        const totalDurationMs = flightDurationMs + fadeDurationMs + 400;
        const spinDurationMs = Math.round(1400 / safeSpeed);
        const barDurationMs = Math.round(2600 / safeSpeed);

        return { flightDurationMs, totalDurationMs, spinDurationMs, barDurationMs };
    }, [safeSpeed]);

    const [isAnimating, setIsAnimating] = useState(true);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const stopAnim = setTimeout(() => setIsAnimating(false), timings.flightDurationMs);
        const hide = setTimeout(() => setIsVisible(false), timings.totalDurationMs);

        return () => {
            clearTimeout(stopAnim);
            clearTimeout(hide);
        };
    }, [timings.flightDurationMs, timings.totalDurationMs]);

    if (!isVisible) return null;

    return (
        <div
            className={cn(
                "fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0b1224] text-white transition-opacity duration-700",
                isAnimating ? "opacity-100" : "opacity-0 pointer-events-none"
            )}
            style={{ ["--bee-speed" as string]: safeSpeed }}
        >
            <div className="relative w-full max-w-4xl h-48 md:h-52 overflow-hidden">
                <div
                    className="absolute left-0 top-1/2 -translate-y-1/2 bee-flight"
                    style={{ animationDuration: `${timings.flightDurationMs}ms` }}
                >
                    <div
                        className="w-16 h-16 md:w-20 md:h-20 origin-center bee-spin drop-shadow-[0_0_22px_rgba(255,199,39,0.35)]"
                        style={{ animationDuration: `${timings.spinDurationMs}ms` }}
                    >
                        <BeeIcon className="w-full h-full" />
                    </div>
                </div>
            </div>

            <div className="mt-6 text-xs md:text-sm tracking-[0.45em] text-slate-200 uppercase">
                Phobee
            </div>

            <div className="mt-4 h-1.5 w-40 max-w-[70%] rounded-full bg-white/10 overflow-hidden">
                <div
                    className="h-full bg-[#F7B500] animate-loader-bar"
                    style={{ animationDuration: `${timings.barDurationMs}ms` }}
                />
            </div>
        </div>
    );
}

