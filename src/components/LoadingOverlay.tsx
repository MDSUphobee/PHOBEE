"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export default function LoadingOverlay() {
    const [isAnimating, setIsAnimating] = useState(true);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const stopAnim = setTimeout(() => setIsAnimating(false), 2400);
        const hide = setTimeout(() => setIsVisible(false), 3200);

        return () => {
            clearTimeout(stopAnim);
            clearTimeout(hide);
        };
    }, []);

    if (!isVisible) return null;

    return (
        <div
            className={cn(
                "fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0b1224] text-white transition-opacity duration-700",
                isAnimating ? "opacity-100" : "opacity-0 pointer-events-none"
            )}
        >
            <div className="relative w-full max-w-4xl h-40 overflow-hidden">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 bee-flight">
                    <div className="w-16 h-16 md:w-20 md:h-20 origin-center bee-spin drop-shadow-[0_0_22px_rgba(255,199,39,0.35)]">
                        <img
                            src="/Logo PhoBee/Logo PhoBee/Picto-Phobee.svg"
                            alt="Abeille Phobee"
                            className="w-full h-full"
                        />
                    </div>
                </div>
            </div>

            <div className="mt-6 text-xs md:text-sm tracking-[0.45em] text-slate-200 uppercase">
                Phobee
            </div>

            <div className="mt-4 h-1.5 w-40 max-w-[70%] rounded-full bg-white/10 overflow-hidden">
                <div className="h-full bg-[#F7B500] animate-loader-bar" />
            </div>
        </div>
    );
}

