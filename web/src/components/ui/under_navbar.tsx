// web/src/components/ui/under_navbar.tsx
"use client";
import React from "react";
import { cn } from "@/lib/utils";

interface Dimensions {
    width?: string | number;
    height?: string | number;
}

interface UnderNavbarProps {
    imageSrc?: string;
    title?: string;
    subtitle?: string;
    dimensions?: Dimensions;
    showSearch?: boolean;
    highlightText?: string | string[]; // accepte une string ou un tableau de strings
    titleSize?: string; // ex. "64px" — override la taille du titre
    subtitleSize?: string; // ex. "64px" — override la taille du sous-titre
    highlightAngle?: number; // inclinaison du surligneur en degrés (0 = droit)
    searchPlaceholder?: string;
    searchValue?: string; // si fourni avec onSearchChange, la recherche est contrôlée
    onSearchChange?: (value: string) => void;
}

export default function UnderNavbar({
                                        imageSrc = "faq-hero.png",
                                        title = "FAQ",
                                        subtitle = "Tout comprendre simplement",
                                        dimensions,
                                        highlightText,
                                        showSearch = false,
                                        titleSize = "96px",
                                        subtitleSize = "48px",
                                        highlightAngle = -1,
                                        searchPlaceholder = "Rechercher une question...",
                                        searchValue,
                                        onSearchChange,
                                    }: UnderNavbarProps) {
    // Base height utilisée comme référence pour le scaling
    const baseBannerHeight = 392;

    const toCssValue = (val?: string | number) =>
        val === undefined ? undefined : typeof val === "number" ? `${val}px` : val;

    const parsePx = (val?: string | number, fallback = baseBannerHeight) => {
        if (val === undefined) return fallback;
        if (typeof val === "number") return val;
        const s = String(val).trim();
        const m = s.match(/^(\d+(?:\.\d+)?)(px)?$/);
        return m ? Number(m[1]) : fallback;
    };

    const requestedHeightNum = parsePx(dimensions?.height, baseBannerHeight);

    // Si on reçoit une taille simple en px (ex. "56px"), on la rend fluide via clamp().
    // Si la taille est déjà fluide (ex. "clamp(...)"), on la respecte telle quelle.
    const isPlainPx = (val?: string) => !!val && /^\d+(?:\.\d+)?px$/.test(val.trim());
    const titleFontSize = isPlainPx(titleSize)
        ? `clamp(1.75rem, 7.5vw, ${parsePx(titleSize, 96)}px)`
        : titleSize;
    const subtitleFontSize = isPlainPx(subtitleSize)
        ? `clamp(0.95rem, 3.2vw, ${parsePx(subtitleSize, 48)}px)`
        : subtitleSize;

    // On garde le style inline pour la largeur personnalisée si définie
    const containerStyle: React.CSSProperties = {
        maxWidth: toCssValue(dimensions?.width) ?? "1200px",
    };

    // Hauteur fluide : s'adapte au mobile et plafonne à la hauteur demandée sur grand écran
    const bannerStyle: React.CSSProperties = {
        backgroundImage: `linear-gradient(180deg, rgba(3,7,18,0.25), rgba(3,7,18,0.1)), url(${imageSrc})`,
        minHeight: `clamp(200px, 42vw, ${requestedHeightNum}px)`,
    };

    // Tailles de police fluides (clamp) : lisibles sur mobile, plafonnées à la taille demandée
    const titleStyle: React.CSSProperties = {
        color: "#FFF",
        textAlign: "center",
        textShadow: "0 4px 10px rgba(0, 0, 0, 0.29)",
        fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
        fontSize: titleFontSize,
        fontStyle: "normal",
        fontWeight: 700,
        lineHeight: 1.1,
        letterSpacing: "-0.02em",
    };

    const subtitleStyle: React.CSSProperties = {
        color: "#FFF",
        textAlign: "center",
        textShadow: "0 4px 10px rgba(0, 0, 0, 0.29)",
        fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
        fontSize: subtitleFontSize,
        fontStyle: "normal",
        fontWeight: 700,
        lineHeight: 1.4,
        letterSpacing: "-0.01em",
    };

    const needles = (Array.isArray(highlightText)
            ? highlightText
            : highlightText
                ? [highlightText]
                : []
    )
        .map((s) => s.trim())
        .filter(Boolean);

    const highlightTextNodes = (text?: string) => {
        if (!text || needles.length === 0) return <>{text}</>;
        const lower = text.toLowerCase();
        const needlesLower = needles.map((n) => n.toLowerCase());

        const parts: React.ReactNode[] = [];
        let cursor = 0;
        let id = 0;

        while (cursor < text.length) {
            const matches = needlesLower
                .map((n, i) => {
                    const pos = lower.indexOf(n, cursor);
                    if (pos === -1) return null;
                    return { pos, idx: i, len: n.length };
                })
                .filter(Boolean) as { pos: number; idx: number; len: number }[];

            if (matches.length === 0) {
                parts.push(<span key={`t-${id++}`}>{text.slice(cursor)}</span>);
                break;
            }

            matches.sort((a, b) => a.pos - b.pos || b.len - a.len);
            const m = matches[0];

            if (m.pos > cursor) {
                parts.push(<span key={`t-${id++}`}>{text.slice(cursor, m.pos)}</span>);
            }

            const matchText = text.slice(m.pos, m.pos + m.len);
            parts.push(
                <span key={`h-${id++}`} className="relative inline-block">
          <span className="relative z-10">{matchText}</span>
          <span
              aria-hidden
              style={{
                  position: "absolute",
                  bottom: "-2px",
                  left: "-1px",
                  width: "100%",
                  height: "25%",
                  backgroundColor: "#FFCC00",
                  zIndex: 0,
                  transform: `rotate(${highlightAngle}deg) scaleX(1)`,
                  transformOrigin: "left center",
                  borderRadius: "4px",
              }}
          />
        </span>
            );

            cursor = m.pos + m.len;
        }

        return <>{parts}</>;
    };

    return (
        <section aria-label="Bannière" className="w-full pt-24 px-4">
            <div
                className={cn(
                    "mx-auto w-full overflow-hidden",
                    "rounded-[40px] md:rounded-[80px] lg:rounded-[107px]"
                )}
                style={containerStyle}
            >
                <div
                    className={cn(
                        "relative w-full flex flex-col items-center justify-center text-center",
                        "px-5 py-10 sm:px-6 sm:py-12 md:py-14",
                        "bg-center bg-cover bg-no-repeat transition-all duration-500"
                    )}
                    style={bannerStyle}
                >
                    <div className="w-full max-w-4xl mx-auto">
                        <h1 style={titleStyle} className="drop-shadow-xl max-w-full">
                            {highlightTextNodes(title)}
                        </h1>

                        <p style={subtitleStyle} className="mt-3 sm:mt-4 max-w-2xl mx-auto whitespace-pre-line">
                            {highlightTextNodes(subtitle)}
                        </p>

                        {showSearch && (
                            <form
                                onSubmit={(e) => e.preventDefault()}
                                className="w-full max-w-2xl mt-5 sm:mt-6 mx-auto flex justify-center"
                                role="search"
                                aria-label="Rechercher une question"
                            >
                                <div className="relative w-full">
                                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-400">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                                      <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                      <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></circle>
                                    </svg>
                                  </span>

                                    <input
                                        type="search"
                                        aria-label="Rechercher"
                                        placeholder={searchPlaceholder}
                                        {...(onSearchChange ? { value: searchValue ?? "", onChange: (e) => onSearchChange(e.target.value) } : {})}
                                        className="w-full pl-14 pr-4 py-3 rounded-full border border-white bg-transparent text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
                                    />
                                    <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hidden md:block" />
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
