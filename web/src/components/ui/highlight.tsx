import * as React from "react";
import { cn } from "@/lib/utils";

type HighlightProps = {
    children: React.ReactNode;
    /**
     * "underline" (défaut) : barre jaune derrière le bas du texte — pour les titres (ex. Hero).
     * "marker" : fond plein façon surligneur, le texte passe par-dessus — pour le corps de texte (ex. Contact).
     */
    variant?: "underline" | "marker";
    /** Couleur du surlignage (utilisé surtout par le variant "marker"). */
    color?: "yellow" | "blue";
    /** Inclinaison du surlignage en degrés (0 = droit, ex. -2 pour un effet feutre). */
    angle?: number;
    className?: string;
};

// Composant partagé de surlignage (jaune charte). Centralise les deux styles
// utilisés dans le site pour éviter de répéter les <span> absolus à la main.
export default function Highlight({
    children,
    variant = "underline",
    color = "yellow",
    angle = 0,
    className,
}: HighlightProps) {
    const tilt = angle ? { transform: `rotate(${angle}deg)` } : undefined;

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

    // variant "underline" : barre jaune derrière le bas du mot
    return (
        <span className="relative inline-block">
            {children}
            <span
                aria-hidden
                style={tilt}
                className={cn(
                    "absolute bottom-[2px] left-0 w-full h-[25%] -z-10 origin-left",
                    color === "blue" ? "bg-[#deeefc]" : "bg-[#FFCC00]",
                    className
                )}
            />
        </span>
    );
}
