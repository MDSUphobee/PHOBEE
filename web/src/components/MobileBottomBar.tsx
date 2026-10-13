"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Tag, HelpCircle, MessageCircle, User, type LucideIcon } from "lucide-react";

type Tab = { href: string; label: string; icon: LucideIcon; match: (p: string) => boolean };

export default function MobileBottomBar() {
    const pathname = usePathname();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token);
    }, []);

    const tabs: Tab[] = [
        { href: "/", label: "Accueil", icon: Home, match: (p) => p === "/" },
        { href: "/abonnements", label: "Tarif", icon: Tag, match: (p) => p.startsWith("/abonnements") },
        { href: "/faq", label: "FAQ", icon: HelpCircle, match: (p) => p.startsWith("/faq") },
        { href: "/contact", label: "Contact", icon: MessageCircle, match: (p) => p.startsWith("/contact") },
        {
            href: isLoggedIn ? "/profile" : "/login",
            label: "Compte",
            icon: User,
            match: (p) => p.startsWith("/profile") || p.startsWith("/login"),
        },
    ];

    return (
        <nav
            aria-label="Navigation mobile"
            className="fixed inset-x-0 bottom-0 z-[55] flex justify-center px-4 pb-[calc(env(safe-area-inset-bottom,0px)+12px)] md:hidden"
        >
            <div className="flex items-center gap-1 rounded-full border border-white/5 bg-[#14233c] px-2 py-2 shadow-[0_8px_30px_rgba(0,0,0,0.45)]">
                {tabs.map((tab) => {
                    const active = tab.match(pathname);
                    const Icon = tab.icon;
                    return (
                        <Link
                            key={tab.href}
                            href={tab.href}
                            aria-label={tab.label}
                            aria-current={active ? "page" : undefined}
                            className={`flex h-14 w-14 flex-col items-center justify-center gap-0.5 rounded-full transition-colors active:scale-95 ${
                                active ? "bg-[#FFCC00] text-[#14233c]" : "text-[#FFCC00]/80 hover:text-[#FFCC00]"
                            }`}
                        >
                            <Icon className="h-[22px] w-[22px]" />
                            <span className="text-[10px] font-medium leading-none">{tab.label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
