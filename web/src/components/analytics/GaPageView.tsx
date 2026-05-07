// typescript
'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

export default function GaPageView(): null {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (!GA_ID && !GTM_ID) return;

        // ensure dataLayer exists
        if (typeof window !== 'undefined') {
            (window as any).dataLayer = (window as any).dataLayer || [];
        }

        // prefer gtag if available, fallback to pushing to dataLayer
        const sendPageView = () => {
            if (typeof window === 'undefined') return;

            // setTimeout ensures Next.js has updated the document.title after navigation
            setTimeout(() => {
                const page_path = window.location.pathname + window.location.search;
                const page_location = window.location.href;
                const page_title = document.title;

                if (typeof (window as any).gtag === 'function') {
                    (window as any).gtag('event', 'page_view', {
                        page_path,
                        page_location,
                        page_title,
                    });
                } else {
                    (window as any).dataLayer.push({
                        event: 'page_view',
                        page_path,
                        page_location,
                        page_title,
                    });
                }
            }, 150);
        };

        // send once on mount / pathname change
        sendPageView();
    }, [pathname, searchParams]);

    return null;
}
