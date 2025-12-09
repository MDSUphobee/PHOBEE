import { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuthSession } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";

const fadeInClass =
  "opacity-0 translate-y-8 transition-all duration-700 ease-out";
const fadeInVisibleClass =
  "opacity-100 translate-y-0";

function useFadeInOnScroll<T extends HTMLElement>(delay = 0) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.classList.add(...fadeInClass.split(" "));
    el.style.transitionDelay = `${delay}ms`;

    let observer = new window.IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.classList.add(...fadeInVisibleClass.split(" "));
            observer.disconnect();
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [delay]);

  return ref;
}

const Content = () => {
  // Hero animation refs
  const heroTitleRef = useFadeInOnScroll<HTMLHeadingElement>(0);

  // Auth session
  const { isAuthenticated, hydrated } = useAuthSession();

  return (
    <section className="pt-28 pb-20 bg-background">
      {/* Hero */}
      <div className="container flex flex-col items-center text-center gap-8">
        <h1
          ref={heroTitleRef}
          className={
            "text-4xl md:text-6xl font-extrabold text-foreground"
          }
        >
          Bienvenue sur <span className="text-primary">PhoBee</span>
        </h1>
      </div>

      {/* Comment ça marche / CTA */}
      <section id="how-it-works" className="container mx-auto px-6 mt-24">
        {!hydrated ? null : !isAuthenticated ? (
          <div className="max-w-2xl mx-auto bg-card border border-border rounded-lg p-8 flex flex-col items-center space-y-4 shadow-sm">
            <p className="text-lg text-foreground text-center mb-4">
              Pour poursuivre, veuillez créer votre compte ou vous connecter&nbsp;!
            </p>
            <div className="flex gap-4 flex-wrap justify-center">
              <Link to="/auth">
                <Button variant="hero" size="lg" className="w-40">Connexion</Button>
              </Link>
              <Link to="/auth?mode=signup">
                <Button variant="outline" size="lg" className="w-40">Créer un compte</Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto bg-card border border-border rounded-lg p-8 space-y-6 shadow-sm text-center">
            <h2 className="text-2xl font-semibold">Bienvenue !</h2>
            <p className="text-muted-foreground">
              Votre compte est prêt. Consultez vos informations ou créez un contrat.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/profile">
                <Button variant="outline" size="lg" className="w-40">
                  Mon profil
                </Button>
              </Link>
              <Link to="/contrat">
                <Button variant="hero" size="lg" className="w-40">
                  Contrat
                </Button>
              </Link>
            </div>
          </div>
        )}
      </section>
    </section>
  );
};

export default Content;