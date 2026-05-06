// typescript
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/ThemeProvider";
import { CookieBanner } from "@/components/CookieBanner";
import Script from "next/script";
import { GaPageView } from "@/components/analytics/GaPageView";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

export const metadata: Metadata = {
    title: "Phobee - Fini la phobie administrative",
    description: "L'assistant qui notifie tes échéances URSSAF et détecte tes aides oubliées.",
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "#ffffff" },
        { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
    ],
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="fr" className="scroll-smooth" suppressHydrationWarning>
        <head>
            {/* Typekit */}
            <script
                dangerouslySetInnerHTML={{
                    __html: `(function(d){var config={kitId:'afd8wvd',scriptTimeout:3000,async:true},h=d.documentElement,t=setTimeout(function(){h.className=h.className.replace(/\\bwf-loading\\b/g,"")+" wf-inactive";},config.scriptTimeout),tk=d.createElement("script"),f=false,s=d.getElementsByTagName("script")[0],a;h.className+=" wf-loading";tk.src='https://use.typekit.net/'+config.kitId+'.js';tk.async=true;tk.onload=tk.onreadystatechange=function(){a=this.readyState;if(f||a&&a!="complete"&&a!="loaded")return;f=true;clearTimeout(t);try{Typekit.load(config)}catch(e){}};s.parentNode.insertBefore(tk,s)})(document);`,
                }}
            />

            {/* Google Tag Manager (gtm.js) */}
            {GTM_ID ? (
                <Script
                    id="gtm-init"
                    strategy="afterInteractive"
                    dangerouslySetInnerHTML={{
                        __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`,
                    }}
                />
            ) : null}

            {/* Google Analytics 4 (gtag.js) */}
            {GA_ID ? (
                <>
                    <Script
                        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
                        strategy="afterInteractive"
                    />
                    <Script id="ga4-init" strategy="afterInteractive">
                        {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}', { send_page_view: false });
              `}
                    </Script>
                </>
            ) : null}
        </head>

        <body
            className={cn("min-h-screen bg-background antialiased overflow-x-hidden", inter.variable)}
            suppressHydrationWarning
        >
        {/* GTM noscript for browsers with JS disabled */}
        {GTM_ID ? (
            <noscript
                dangerouslySetInnerHTML={{
                    __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=${GTM_ID}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
                }}
            />
        ) : null}

        <ThemeProvider>
            <Suspense fallback={null}>
                <GaPageView />
            </Suspense>

            {children}

            <Toaster richColors position="top-center" />
            <CookieBanner />
        </ThemeProvider>
        </body>
        </html>
    );
}
