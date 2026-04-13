"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function FormulairePage() {
    const router = useRouter();

    useEffect(() => {
        router.replace("/formulaires");
    }, [router]);

    return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4 text-gray-400">
                <Loader2 className="w-10 h-10 animate-spin text-amber-400" />
                <p className="font-medium">Redirection en cours...</p>
            </div>
        </div>
    );
}
