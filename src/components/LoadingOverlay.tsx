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
        const totalDurationMs = Math.round(2000 / safeSpeed); // environ 2s
        return { totalDurationMs, barDurationMs: totalDurationMs };
    }, [safeSpeed]);

    const [isAnimating, setIsAnimating] = useState(true);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const stopAnim = setTimeout(() => setIsAnimating(false), timings.totalDurationMs);
        // laisse le fondu s'exécuter avant de retirer le DOM
        const hide = setTimeout(() => setIsVisible(false), timings.totalDurationMs + 600);

        return () => {
            clearTimeout(stopAnim);
            clearTimeout(hide);
        };
    }, [timings.totalDurationMs]);

    if (!isVisible) return null;

    return (
        <div
            className={cn(
                "fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0b1224] text-white transition-opacity duration-800",
                "gap-3 md:gap-4 px-4",
                isAnimating ? "opacity-100" : "opacity-0 pointer-events-none"
            )}
            style={{ ["--bee-speed" as string]: safeSpeed }}
            aria-hidden={!isVisible}
        >
            <div className="flex items-center justify-center w-full h-[32vh] md:h-[36vh]">
                <div className="drop-shadow-[0_0_22px_rgba(255,199,39,0.35)] bee-pulse">
                    <BeeIcon className="w-28 h-28 md:w-36 md:h-36" />
                </div>
            </div>

            <div className="w-full flex justify-center">
                <img
                    src="/Logo PhoBee/Logo PhoBee/Logo-Phobee-Fond-Noir.svg"
                    alt="Phobee"
                    className="h-32 md:h-36 w-auto"
                />
            </div>

            <div className="h-1.5 w-48 max-w-[80%] rounded-full bg-white/10 overflow-hidden">
                <div
                    className="h-full bg-[#F7B500] animate-loader-bar"
                    style={{ animationDuration: `${timings.barDurationMs}ms` }}
                />
            </div>
        </div>
    );
}

