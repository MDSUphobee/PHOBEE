import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

type Contract = {
  id: number;
  title: string;
  pdfPath: string;
  status: string;
  description: string;
};

const API_BASE = import.meta.env.VITE_API_BASE as string;
const CONTRACTS_API = `${API_BASE}/api/contracts`;

const normalizeStatus = (status: string) => status?.toLowerCase().trim() || "inconnu";

export const ContratSection = () => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const staticContracts = useMemo(() => {
    const pdfModules = import.meta.glob("../../public/contracts/*.pdf", {
      eager: true,
      import: "default",
    }) as Record<string, string>;

    return Object.entries(pdfModules).map(([path, url], idx) => {
      const filename = path.split("/").pop() || `contrat-${idx + 1}.pdf`;
      const title = filename.replace(/\.pdf$/i, "").replace(/[_-]/g, " ");
      return {
        id: idx + 1,
        title: title || `Contrat ${idx + 1}`,
        pdfPath: url,
        status: "actif",
        description: "Contrat disponible au format PDF.",
      };
    });
  }, []);

  useEffect(() => {
    let cancelled = false;
    const fetchContracts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(CONTRACTS_API);
        const data = await res.json().catch(() => []);
        if (!res.ok) {
          throw new Error(data?.message || "Impossible de récupérer les contrats.");
        }
        if (!cancelled) {
          const parsed = Array.isArray(data) ? data : [];
          if (parsed.length) {
            setContracts(parsed);
          } else {
            setContracts(staticContracts);
          }
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(err.message || "Une erreur est survenue.");
          // Fallback sur les PDF du dossier public/contracts en cas d'erreur API.
          setContracts(staticContracts);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchContracts();
    return () => {
      cancelled = true;
    };
  }, []);

  const statusStyles = useMemo(
    () => ({
      actif: "bg-green-100 text-green-700 border-green-200",
      active: "bg-green-100 text-green-700 border-green-200",
      en_cours: "bg-blue-100 text-blue-700 border-blue-200",
      "en cours": "bg-blue-100 text-blue-700 border-blue-200",
      brouillon: "bg-amber-100 text-amber-700 border-amber-200",
      draft: "bg-amber-100 text-amber-700 border-amber-200",
      inactif: "bg-slate-100 text-slate-700 border-slate-200",
      inactive: "bg-slate-100 text-slate-700 border-slate-200",
    }),
    []
  );

  const formatStatusLabel = (status: string) => {
    const s = normalizeStatus(status);
    if (["actif", "active"].includes(s)) return "Actif";
    if (["en_cours", "en cours"].includes(s)) return "En cours";
    if (["brouillon", "draft"].includes(s)) return "Brouillon";
    if (["inactif", "inactive"].includes(s)) return "Inactif";
    return status || "Non précisé";
  };

  const resolvePdfUrl = (pdfPath: string) => {
    if (!pdfPath) return "#";
    if (pdfPath.startsWith("http")) return pdfPath;
    if (pdfPath.startsWith("/")) return pdfPath;
    // Les PDF sont servis depuis /public/contracts
    return `/contracts/${pdfPath}`;
  };

  const pdfPreviewUrl = (pdfPath: string) => {
    const base = resolvePdfUrl(pdfPath);
    if (base === "#") return base;
    const hashParams = "#toolbar=0&navpanes=0&scrollbar=0&view=FitH";
    return base.includes("#") ? base : `${base}${hashParams}`;
  };

  const skeletonCards = Array.from({ length: 6 }, (_, i) => (
    <div
      key={`skeleton-${i}`}
      className="h-48 rounded-xl border border-border bg-muted/40 animate-pulse"
    />
  ));

  return (
    <div className="container mx-auto px-6 pt-24 pb-16 space-y-8">
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">Contrats</p>
        <h1 className="text-3xl font-bold text-foreground">Liste des contrats</h1>
        <p className="text-muted-foreground">
          Retrouvez ici tous les contrats disponibles et ouvrez le PDF en un clic.
        </p>
      </div>

      {error ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 text-destructive px-4 py-3">
          {error}
        </div>
      ) : null}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading
          ? skeletonCards
          : contracts.map((contract) => {
              const statusKey = normalizeStatus(contract.status);
              const badgeClass =
                statusStyles[statusKey as keyof typeof statusStyles] ||
                "bg-slate-100 text-slate-700 border-slate-200";

              return (
                <article
                  key={contract.id}
                  className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5 shadow-sm"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <h3 className="text-lg font-semibold text-foreground">
                          {contract.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {contract.description}
                        </p>
                      </div>
                      <span
                        className={`shrink-0 rounded-full border px-3 py-1 text-xs font-medium ${badgeClass}`}
                      >
                        {formatStatusLabel(contract.status)}
                      </span>
                    </div>

                    <div className="relative overflow-hidden rounded-lg border border-border bg-muted/30">
                      <object
                        data={pdfPreviewUrl(contract.pdfPath)}
                        type="application/pdf"
                        className="pointer-events-none select-none w-[calc(100%+32px)] aspect-[4/3] -translate-x-4"
                        aria-label={`Aperçu du PDF ${contract.title}`}
                      >
                        <div className="p-4 text-sm text-muted-foreground">
                          Aperçu PDF indisponible
                        </div>
                      </object>
                    </div>

                    <div className="flex items-center justify-end">
                      <Button asChild variant="hero" size="sm">
                        <a
                          href={resolvePdfUrl(contract.pdfPath)}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Ouvrir le PDF
                        </a>
                      </Button>
                    </div>
                  </div>
                </article>
              );
            })}
      </div>

      {!isLoading && !contracts.length && !error ? (
        <div className="rounded-lg border border-border bg-muted/30 px-4 py-6 text-center text-muted-foreground">
          Aucun contrat disponible pour le moment.
        </div>
      ) : null}
    </div>
  );
};

const Contrat = () => {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <ContratSection />
      <Footer />
    </main>
  );
};

export default Contrat;