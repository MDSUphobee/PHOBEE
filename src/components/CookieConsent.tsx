import { useState } from "react";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "phobee_cookie_consent";

type ConsentStatus = "accepted" | "rejected";

const getStoredConsent = (): ConsentStatus | null => {
  if (typeof window === "undefined") return null;
  const value = localStorage.getItem(STORAGE_KEY);
  return value === "accepted" || value === "rejected" ? value : null;
};

const CookieConsent = () => {
  const [consent, setConsent] = useState<ConsentStatus | null>(() =>
    getStoredConsent()
  );

  const handleChoice = (choice: ConsentStatus) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, choice);
    }
    setConsent(choice);
  };

  if (consent) return null;

  return (
    <div className="fixed bottom-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-3xl -translate-x-1/2 rounded-xl border border-border bg-card shadow-lg">
      <div className="p-4 sm:p-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <p className="text-sm sm:text-base font-medium text-foreground">
            Nous utilisons des cookies
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Ils servent à améliorer votre expérience et à conserver vos
            préférences. Vous pouvez refuser si vous le souhaitez.
          </p>
        </div>
        <div className="flex gap-2 justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleChoice("rejected")}
          >
            Refuser
          </Button>
          <Button
            variant="hero"
            size="sm"
            onClick={() => handleChoice("accepted")}
          >
            Accepter
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;

