"use client";

import { useEffect, useLayoutEffect, useRef, useState, type ComponentType, type CSSProperties } from "react";
import {
    motion,
    AnimatePresence,
    useScroll,
    useSpring,
    useTransform,
    useMotionValueEvent,
    useReducedMotion,
} from "framer-motion";
import { AlertCircle, Bell, CheckCircle2, FileText, Shield, Zap } from "lucide-react";
import Highlight from "@/components/ui/highlight";
import { cn } from "@/lib/utils";

/* ════════════════════════════ Données ════════════════════════════ */

const STEPS = [
    { title: "Vous indiquez votre situation", desc: "Répondez à quelques questions simples sur votre activité. (30s chrono, promis)." },
    { title: "PhoBee liste vos obligations et vos aides disponibles", desc: "Nous détectons vos échéances, vos aides potentielles et vos plafonds." },
    { title: "On demande à votre place vos aides", desc: "Nous remplissons le document. Vous vérifiez en quelques minutes." },
    { title: "Rappel avant chaque date importante", desc: "Seulement l'essentiel, sans vous déranger inutilement." },
];

/** Desktop : progression du scroll (0 → 1) où chaque étape est « centrée ». */
const STOPS = [0, 0.3, 0.6, 0.9];

/** Mobile : demi-hauteur du rond numéroté (size-9 = 36px). */
const DOT_CENTER = 18;

/** Taille « de conception » du téléphone : il est dessiné à cette taille puis mis à l'échelle. */
const PHONE_W = 300;
const PHONE_H = 600;

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/* ═════════════════════ Écrans du téléphone ═════════════════════ */

function ScreenForm() {
    return (
        <div className="flex h-full flex-col">
            <div className="flex flex-col gap-3">
                <p className="max-w-[85%] rounded-2xl rounded-tl-none bg-slate-800 p-3 text-sm text-slate-200">
                    Bonjour ! Quelle est votre situation ?
                </p>
                <p className="max-w-[85%] self-end rounded-2xl rounded-tr-none bg-[#FFD700] p-3 text-sm font-medium text-slate-900">
                    Je suis agriculteur 🚜
                </p>
                <p className="max-w-[85%] rounded-2xl rounded-tl-none bg-slate-800 p-3 text-sm text-slate-200">
                    Très bien. Quelles sont vos cultures principales ?
                </p>
            </div>
            <div className="mb-4 mt-auto flex h-12 items-center rounded-full border border-slate-700 bg-slate-800 px-4 text-sm text-slate-500">
                Écrivez votre réponse...
            </div>
        </div>
    );
}

function ScreenRadar() {
    return (
        <div className="flex h-full flex-col">
            <div className="mb-6 text-center">
                <div className="mx-auto mb-3 flex size-16 animate-pulse items-center justify-center rounded-full border-2 border-[#FFD700] bg-slate-800">
                    <Zap className="size-8 text-[#FFD700]" />
                </div>
                <p className="text-sm text-white">Notre algo scanne votre profil et trouve l'argent que vous méritez.</p>
            </div>
            <div className="space-y-3">
                <div className="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-800/50 p-4">
                    <div className="h-2 w-24 rounded bg-slate-600" />
                    <CheckCircle2 className="ml-auto size-5 text-green-500" />
                </div>
                <div className="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-800/50 p-4">
                    <div className="h-2 w-20 rounded bg-slate-600" />
                    <AlertCircle className="ml-auto size-5 text-orange-500" />
                </div>
            </div>
        </div>
    );
}

function ScreenFilling() {
    return (
        <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="mb-6 flex size-20 items-center justify-center rounded-full bg-[#FFD700]/20">
                <FileText className="size-10 text-[#FFD700]" />
            </div>
            <h4 className="mb-2 text-xl font-bold text-white">Dossier en cours</h4>
            <p className="text-sm text-slate-400">Nous remplissons vos formulaires automatiquement.</p>
        </div>
    );
}

function ScreenReminder() {
    return (
        <div className="flex h-full flex-col">
            <div className="mb-6 mt-8">
                <h4 className="mb-1 text-xl font-bold text-white">Octobre</h4>
                <p className="text-sm text-slate-400">Vos prochaines échéances</p>
            </div>
            <div className="flex rotate-1 items-start gap-4 rounded-xl bg-white p-4 shadow-lg dark:bg-slate-800">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500 dark:bg-red-900/30 dark:text-red-400">
                    <Bell className="size-5" />
                </div>
                <div>
                    <h5 className="text-sm font-bold text-slate-900 dark:text-white">Rappel important</h5>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-300">Échéance demain !</p>
                </div>
            </div>
        </div>
    );
}

const SCREENS: ComponentType[] = [ScreenForm, ScreenRadar, ScreenFilling, ScreenReminder];

// TODO: Placer le téléphone sous la barre "ils nous font confiances" et le pivoter légérement comme sur Figma

/* ═════════════════════ Téléphone (mis à l'échelle) ═════════════════════
 * Le téléphone est toujours dessiné en 300×600 puis réduit avec un scale()
 * pour remplir son conteneur. Résultat : le contenu est identique et
 * proportionné partout, du petit mobile au desktop. Le parent choisit
 * juste la taille (largeur OU hauteur, le ratio 1:2 fait le reste).
 */
function Phone({ active, className, style }: { active: number; className?: string; style?: CSSProperties }) {
    const ref = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState<number | null>(null);

    useIsoLayoutEffect(() => {
        const el = ref.current;
        if (!el) return;
        const update = () => setScale(el.clientWidth / PHONE_W);
        update();
        const ro = new ResizeObserver(update);
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    const Screen = SCREENS[active];

    return (
        <div ref={ref} className={cn("relative aspect-[1/2]", className)} style={style}>
            <div
                className="absolute left-0 top-0 origin-top-left"
                style={{
                    width: PHONE_W,
                    height: PHONE_H,
                    transform: `scale(${scale ?? 1})`,
                    visibility: scale === null ? "hidden" : undefined, // évite le flash avant la mesure
                }}
            >
                <div className="relative h-full w-full overflow-hidden rounded-[3rem] border-[10px] border-slate-800 bg-[#0F172A] shadow-2xl ring-1 ring-white/10">
                    {/* Encoche */}
                    <div className="absolute top-0 z-40 flex h-8 w-full justify-center">
                        <div className="h-6 w-32 rounded-b-xl bg-slate-900" />
                    </div>

                    <div className="flex h-full flex-col px-6 pb-6 pt-12">
                        <div className="mb-8 flex items-center gap-2">
                            <div className="flex size-8 items-center justify-center rounded-lg bg-[#FFCC00]/10">
                                <img src="/images/radar.svg" className="size-6" alt="" />
                            </div>
                            <h4 className="text-lg font-bold text-white">Radar à Aides</h4>
                        </div>

                        <div className="relative flex-1">
                            <AnimatePresence mode="wait" initial={false}>
                                <motion.div
                                    key={active}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="h-full"
                                >
                                    <Screen />
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>

                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0F172A] to-transparent" />
                </div>
            </div>
        </div>
    );
}

/* ═════════════════════════ Petits blocs partagés ═════════════════════════ */

function SectionTitle({ className }: { className?: string }) {
    return (
        <h2 className={cn("font-extrabold leading-tight text-[#0F172A] dark:text-white", className)}>
            Une plateforme qui vous guide, <br className="hidden sm:block" />
            <Highlight>étape par étape</Highlight>
        </h2>
    );
}

function SecurityCard({ className }: { className?: string }) {
    return (
        <div
            className={cn(
                "flex items-start gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-2xl dark:border-slate-800 dark:bg-slate-900",
                className
            )}
        >
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
                <Shield className="size-5 text-slate-900 dark:text-white" />
            </div>
            <div>
                <h5 className="text-sm font-extrabold text-slate-900 dark:text-white">Sécurité maximale</h5>
                <p className="mt-1 text-xs leading-snug text-slate-500 dark:text-slate-400">
                    Vos données restent cryptées sur votre téléphone. On ne vend rien.
                </p>
            </div>
        </div>
    );
}

/* ════════════════════════════ Section ════════════════════════════ */

export default function HowItWorks() {
    return (
        <section id="how-it-works" className="relative bg-white dark:bg-slate-950">
            <MobileTimeline />
            <DesktopTimeline />
        </section>
    );
}

/* ═════════════ MOBILE / TABLETTE (< lg) : chemin vertical + téléphone sticky ═════════════
 *
 *   ┌──────────────┬───────────┐
 *   │ ① Étape 1    │ ┌───────┐ │
 *   │ ┆            │ │       │ │  ← le téléphone reste collé au centre de
 *   │ 🐝 (centre)  │ │ écran │ │    l'écran pendant que les étapes défilent
 *   │ ┆            │ │       │ │
 *   │ ② Étape 2    │ └───────┘ │
 *   └──────────────┴───────────┘
 *
 * Le suivi va de « haut de la liste au centre de l'écran » à « bas de la liste
 * au centre de l'écran » : l'abeille est donc toujours au milieu de l'écran,
 * au même niveau que le centre du téléphone, et une étape devient active
 * exactement quand l'abeille atteint son rond.
 */
function MobileTimeline() {
    const reduce = useReducedMotion();
    const listRef = useRef<HTMLOListElement>(null);
    const stepRefs = useRef<(HTMLLIElement | null)[]>([]);
    const [reached, setReached] = useState(0);
    const [goingDown, setGoingDown] = useState(true);

    const { scrollYProgress } = useScroll({ target: listRef, offset: ["start center", "end center"] });
    // Comme le desktop : on lisse le scroll avec un ressort → l'abeille se déplace
    // de façon fluide (et non collée image par image au scroll brut).
    const progress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

    // Fraction de la hauteur de la liste où se trouve le centre du DERNIER rond.
    // On y plafonne l'abeille et la barre : elles s'arrêtent sur le rond n°4
    // au lieu de filer dans le vide sous la dernière étape.
    const maxFracRef = useRef(1);
    useIsoLayoutEffect(() => {
        const ol = listRef.current;
        if (!ol) return;
        const compute = () => {
            const last = stepRefs.current[stepRefs.current.length - 1];
            const h = ol.offsetHeight;
            if (last && h) maxFracRef.current = Math.min(1, (last.offsetTop + DOT_CENTER) / h);
        };
        compute();
        const ro = new ResizeObserver(compute);
        ro.observe(ol);
        return () => ro.disconnect();
    }, []);
    const clamp = (v: number) => Math.min(v, maxFracRef.current);

    const beeTop = useTransform(progress, (v) => `${clamp(v) * 100}%`);
    const beeX = useTransform(progress, (v) => (reduce ? 0 : Math.sin(clamp(v) * Math.PI * 10) * 6));
    const barScale = useTransform(progress, clamp);

    useMotionValueEvent(progress, "change", (v) => {
        // Sens du scroll → l'abeille regarde vers le bas ou vers le haut
        const prev = progress.getPrevious();
        if (prev !== undefined && v !== prev) setGoingDown(v > prev);

        const h = listRef.current?.offsetHeight;
        if (!h) return;
        const count = stepRefs.current.filter((li) => li && (li.offsetTop + DOT_CENTER) / h <= v).length;
        setReached(count); // React ignore le setState si la valeur ne change pas
    });

    const active = Math.max(reached - 1, 0);

    // Largeur du téléphone : 52 % de l'écran, mais jamais plus haut que 72 % de la hauteur (ratio 1:2)
    const phoneVars = { "--pw": "min(52vw, 36svh)" } as CSSProperties;

    return (
        <div className="px-4 py-16 sm:px-8 lg:hidden">
            <SectionTitle className="text-3xl sm:text-4xl" />

            <div className="mt-10 grid grid-cols-[1fr_auto] gap-3 sm:gap-8" style={phoneVars}>
                {/* ── Chemin + étapes ── */}
                <ol ref={listRef} className="relative">
                    <div aria-hidden className="pointer-events-none absolute inset-y-0 left-[18px]">
                        <div className="absolute inset-y-0 -left-px border-l-2 border-dotted border-slate-300 dark:border-slate-700" />
                        <motion.div
                            className="absolute inset-y-0 -left-px w-0.5 origin-top bg-[#FFD700]"
                            style={{ scaleY: barScale }}
                        />
                        <motion.img
                            src="/images/abeille.png"
                            alt=""
                            className="absolute z-20 -ml-5 -mt-5 w-10 max-w-none drop-shadow-xl"
                            style={{ top: beeTop, x: beeX }}
                            // L'image regarde vers la droite : +90° = vers le bas (+12° d'inclinaison
                            // comme sur desktop). Demi-tour quand on remonte.
                            initial={false}
                            animate={{ rotate: goingDown ? 102 : -78 }}
                            transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 200, damping: 18 }}
                        />
                    </div>

                    {STEPS.map((step, i) => {
                        const isReached = i < reached;
                        const isActive = i === active;

                        return (
                            <li
                                key={step.title}
                                ref={(el) => {
                                    stepRefs.current[i] = el;
                                }}
                                aria-current={isActive ? "step" : undefined}
                                // Chaque étape occupe ~une demi-hauteur d'écran → le téléphone a le temps d'être vu
                                className="relative min-h-[55svh] pl-12"
                            >
                                <span
                                    className={cn(
                                        "absolute left-0 top-0 z-10 grid size-9 place-items-center rounded-full border-[3px] bg-white text-base shadow-md transition-all duration-300 dark:bg-slate-900",
                                        isReached
                                            ? "border-[#FFD700] text-slate-900 dark:text-white"
                                            : "border-slate-200 text-slate-400 dark:border-slate-700",
                                        isActive && "scale-110"
                                    )}
                                >
                                    {i + 1}
                                </span>

                                <div className={cn("pt-1 transition-opacity duration-300", isActive ? "opacity-100" : "opacity-50")}>
                                    <h3 className="text-sm font-bold leading-snug text-[#0F172A] sm:text-lg dark:text-white">
                                        {step.title}
                                    </h3>
                                    <p className="mt-1.5 text-xs leading-relaxed text-slate-500 sm:text-sm dark:text-slate-400">
                                        {step.desc}
                                    </p>
                                </div>
                            </li>
                        );
                    })}
                </ol>

                {/* ── Téléphone collé au centre de l'écran ── */}
                <div>
                    <Phone
                        active={active}
                        className="sticky"
                        style={{ width: "var(--pw)", top: "calc(50svh - var(--pw))" }}
                    />
                </div>
            </div>

            <div className="relative mx-auto mt-14 max-w-sm">
                <SecurityCard />
                <img
                    src="/images/badge-modifiable-tout-moment.svg"
                    alt=""
                    className="absolute -right-2 -top-10 size-20 rotate-12"
                />
            </div>
        </div>
    );
}

/* ═════════════════ DESKTOP (lg+) : timeline horizontale sticky ═════════════════ */
function DesktopTimeline() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [active, setActive] = useState(0);

    const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
    const progress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

    const beeX = useTransform(progress, [0, 1], ["0%", "92%"]);
    const beeY = useTransform(
        progress,
        [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
        [0, -10, 0, 10, 0, -10, 0, 10, 0, -5, 0]
    );

    // Étape active = dernier STOP franchi (bascule à mi-chemin entre deux stops)
    useMotionValueEvent(progress, "change", (v) => {
        let idx = 0;
        STOPS.forEach((s, i) => {
            if (v >= s - 0.15) idx = i;
        });
        setActive(idx);
    });

    const scrollToStep = (i: number) => {
        const el = containerRef.current;
        if (!el) return;
        const top = el.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top: top + (el.offsetHeight - window.innerHeight) * STOPS[i], behavior: "smooth" });
    };

    return (
        <div ref={containerRef} className="relative hidden h-[300vh] lg:block">
            <div className="sticky top-0 flex h-screen w-full flex-col justify-center overflow-hidden">
                <div className="container mx-auto px-6">
                    <SectionTitle className="mb-8 max-w-4xl text-5xl" />

                    <div className="flex items-center justify-between gap-8">
                        {/* ── Timeline ── */}
                        <div className="relative w-3/5">
                            <div className="absolute left-[5%] right-[5%] top-10 border-t-2 border-dotted border-slate-300 dark:border-slate-700" />

                            <motion.img
                                src="/images/abeille.png"
                                alt=""
                                aria-hidden
                                className="pointer-events-none absolute top-2 z-30 -ml-8 w-16 drop-shadow-xl"
                                style={{ left: beeX, y: beeY, rotate: 12 }}
                            />

                            <div className="grid grid-cols-4 gap-8">
                                {STEPS.map((step, i) => {
                                    const isCurrent = active === i;
                                    return (
                                        <button
                                            key={step.title}
                                            type="button"
                                            onClick={() => scrollToStep(i)}
                                            aria-current={isCurrent ? "step" : undefined}
                                            className="group relative flex flex-col items-center rounded-xl text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD700]"
                                        >
                                            <span
                                                className={cn(
                                                    "z-20 mb-6 grid size-20 place-items-center rounded-full border-[3px] bg-white text-3xl shadow-lg transition-all duration-300 dark:bg-slate-900",
                                                    isCurrent
                                                        ? "scale-110 border-[#FFD700] text-slate-900 dark:text-white"
                                                        : "border-slate-200 text-slate-400 group-hover:border-slate-300 dark:border-slate-700"
                                                )}
                                            >
                                                {i + 1}
                                            </span>
                                            <h3 className="mb-2 min-h-[3rem] text-sm font-bold leading-tight text-[#0F172A] dark:text-white">
                                                {step.title}
                                            </h3>
                                            <p className="mx-auto max-w-[150px] text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                                                {step.desc}
                                            </p>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* ── Téléphone ── */}
                        <div className="relative flex w-2/5 justify-center" style={{ perspective: 1000 }}>
                            <Phone
                                active={active}
                                className="z-10 h-[min(600px,72vh)]"
                            />

                            <motion.div
                                initial={{ opacity: 0, x: -20, y: 20 }}
                                whileInView={{ opacity: 1, x: 0, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.5 }}
                                className="absolute bottom-[10%] -left-12 z-20 max-w-[260px]"
                            >
                                <SecurityCard />
                            </motion.div>

                            <img
                                src="/images/badge-modifiable-tout-moment.svg"
                                alt=""
                                className="absolute -right-8 top-[80%] z-30 size-24 rotate-12"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}