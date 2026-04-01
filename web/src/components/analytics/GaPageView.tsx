"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

declare global {
    interface Window {
        gtag?: (...args: any[]) => void;
    }
}

export function GaPageView() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const search = searchParams?.toString() ?? "";

    useEffect(() => {
        if (!GA_ID) return;
        if (typeof window === "undefined") return;
        if (typeof window.gtag !== "function") return;

        const url = search ? `${pathname}?${search}` : pathname;

        window.gtag("event", "page_view", {
            page_location: window.location.href,
            page_path: url,
        });
    }, [pathname, search]);

    return null;
}
