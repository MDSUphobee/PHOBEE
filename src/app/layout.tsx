import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Using Inter as requested
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
    title: "Phobee - Fini la phobie administrative",
    description: "L'assistant qui notifie tes échéances URSSAF et détecte tes aides oubliées.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="fr" className="scroll-smooth">
            <body className={cn("min-h-screen bg-background font-sans antialiased overflow-x-hidden", inter.variable)}>
                {children}
            </body>
        </html>
    );
}
