"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type HighlightProps = {
    children: React.ReactNode;
    variant?: "underline" | "marker";
    color?: "yellow" | "blue";
    angle?: number;
    className?: string;
};

type Bar = { left: number; top: number; width: number; height: number };

export default function Highlight({
    children,
    variant = "underline",
    color = "yellow",
    angle = 0,
    className,
}: HighlightProps) {
    const tilt = angle ? { transform: `rotate(${angle}deg)` } : undefined;

    const wrapperRef = React.useRef<HTMLSpanElement>(null);
    const textRef = React.useRef<HTMLSpanElement>(null);
    const [bars, setBars] = React.useState<Bar[]>([]);

    React.useEffect(() => {
        if (variant !== "underline") return;
        const wrap = wrapperRef.current;
        const text = textRef.current;
        if (!wrap || !text) return;

        const measure = () => {
            const wrapRect = wrap.getBoundingClientRect();
            const lines = Array.from(text.getClientRects());
            setBars(
                lines.map((r) => {
                    const height = Math.max(3, r.height * 0.18);
                    return {
                        left: r.left - wrapRect.left,
                        top: r.bottom - wrapRect.top - height - 2,
                        width: r.width,
                        height,
                    };
                })
            );
        };

        measure();
        const ro = new ResizeObserver(measure);
        ro.observe(wrap);
        window.addEventListener("resize", measure);
        // La largeur du texte change une fois les polices web chargées.
        if (typeof document !== "undefined" && document.fonts?.ready) {
            document.fonts.ready.then(measure).catch(() => {});
        }

        return () => {
            ro.disconnect();
            window.removeEventListener("resize", measure);
        };
    }, [children, variant, angle]);

    if (variant === "marker") {
        return (
            <span
                style={tilt}
                className={cn(
                    "rounded-md px-1.5 box-decoration-clone font-semibold",
                    // inline-block requis pour la rotation ; sinon on garde inline
                    // pour que le surligneur se coupe proprement sur plusieurs lignes.
                    angle ? "inline-block" : "",
                    color === "yellow"
                        ? "bg-primary text-[#0f1729]"
                        : "bg-[#deeefc] text-[#0f1729] dark:bg-sky-400/20 dark:text-foreground",
                    className
                )}
            >
                {children}
            </span>
        );
    }

    // variant "underline"
    const barColorClass = color === "blue" ? "bg-[#deeefc]" : "bg-[#FFCC00]";

    return (
        <span ref={wrapperRef} className="relative inline-block">
            {/* Le texte passe au-dessus des barres (z-[1]) */}
            <span ref={textRef} className="relative z-[1]">
                {children}
            </span>
            {bars.map((b, i) => (
                <span
                    key={i}
                    aria-hidden
                    className={cn("absolute origin-left pointer-events-none rounded-[1px]", barColorClass, className)}
                    style={{
                        left: b.left,
                        top: b.top,
                        width: b.width,
                        height: b.height,
                        transform: tilt?.transform,
                    }}
                />
            ))}
        </span>
    );
}
