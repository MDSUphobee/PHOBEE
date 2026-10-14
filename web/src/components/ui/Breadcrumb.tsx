import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

export type Crumb = {
    label: string;
    href?: string; // sans href = page courante (dernier élément)
};

interface BreadcrumbProps {
    items: Crumb[];
    className?: string;
}

/**
 * Fil d'Ariane réutilisable pour les sous-pages.
 * « Accueil » est ajouté automatiquement en premier.
 * Le dernier élément (sans href) représente la page courante.
 *
 * Exemple : <Breadcrumb items={[{ label: "Nos tarifs" }]} />
 */
export default function Breadcrumb({ items, className }: BreadcrumbProps) {
    const crumbs: Crumb[] = [{ label: "Accueil", href: "/" }, ...items];

    return (
        <nav aria-label="Fil d'Ariane" className={cn("w-full", className)}>
            <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm text-slate-600 dark:text-slate-400">
                {crumbs.map((crumb, i) => {
                    const isLast = i === crumbs.length - 1;
                    const isHome = i === 0;

                    return (
                        <li key={`${crumb.label}-${i}`} className="flex items-center gap-1.5">
                            {i > 0 && (
                                <ChevronRight aria-hidden className="h-4 w-4 shrink-0 text-slate-300 dark:text-slate-600" />
                            )}

                            {isLast || !crumb.href ? (
                                <span aria-current="page" className="font-semibold text-[#14233c] dark:text-white">
                                    {crumb.label}
                                </span>
                            ) : (
                                <Link
                                    href={crumb.href}
                                    className="inline-flex items-center gap-1 transition-colors hover:text-[#14233c] dark:hover:text-white"
                                >
                                    {isHome && <Home aria-hidden className="h-4 w-4 shrink-0" />}
                                    {crumb.label}
                                </Link>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}
