import { useRef, useEffect } from "react";

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
  const heroDescRef = useFadeInOnScroll<HTMLParagraphElement>(200);
  const heroBtnRef = useFadeInOnScroll<HTMLAnchorElement>(400);

  // Feature cards refs
  const featRefs = [
    useFadeInOnScroll<HTMLDivElement>(0),
    useFadeInOnScroll<HTMLDivElement>(150),
    useFadeInOnScroll<HTMLDivElement>(300),
  ];

  // How it works refs
  const howRefs = [
    useFadeInOnScroll<HTMLLIElement>(0),
    useFadeInOnScroll<HTMLLIElement>(150),
    useFadeInOnScroll<HTMLLIElement>(300),
  ];

  // Pricing refs
  const pricingRefs = [
    useFadeInOnScroll<HTMLDivElement>(0),
    useFadeInOnScroll<HTMLDivElement>(150),
    useFadeInOnScroll<HTMLDivElement>(300),
  ];

  return (
    <section className="pt-28 pb-20 bg-background">
      {/* Hero */}
      <div className="container mx-auto px-6 flex flex-col items-center text-center gap-8">
        <h1
          ref={heroTitleRef}
          className={
            "text-4xl md:text-6xl font-extrabold text-foreground"
          }
        >
          Bienvenue sur <span className="text-primary">PhoBee</span>
        </h1>
        <p
          ref={heroDescRef}
          className="text-lg md:text-2xl text-muted-foreground max-w-2xl"
        >
          Partagez, stockez et organisez vos photos en toute simplicité.
          Profitez d'une interface intuitive, d'une gestion intelligente des albums et d'une sécurité optimale pour vos souvenirs.
        </p>
        <a
          ref={heroBtnRef}
          href="#pricing"
          className="inline-block px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold shadow hover:bg-primary/90 transition-transform transform hover:scale-105"
        >
          Découvrir nos offres
        </a>
      </div>

      {/* Fonctionnalités */}
      <section id="features" className="container mx-auto px-6 mt-32">
        <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
          Fonctionnalités principales
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div
            ref={featRefs[0]}
            className="bg-card border border-border rounded-lg p-8 flex flex-col items-center"
          >
            <span className="text-5xl mb-4 animate-bounce" style={{ animationDelay: '0.1s', animationDuration: '1.5s' }}>📦</span>
            <h3 className="text-xl font-semibold mb-2">Stockage sécurisé</h3>
            <p className="text-muted-foreground">
              Sauvegardez toutes vos photos dans le cloud, avec chiffrement pour garantir leur sécurité et leur confidentialité.
            </p>
          </div>
          <div
            ref={featRefs[1]}
            className="bg-card border border-border rounded-lg p-8 flex flex-col items-center"
          >
            <span className="text-5xl mb-4 animate-bounce" style={{ animationDelay: '0.22s', animationDuration: '1.5s' }}>🗂️</span>
            <h3 className="text-xl font-semibold mb-2">Organisation intelligente</h3>
            <p className="text-muted-foreground">
              Créez des albums, classez et recherchez vos photos facilement grâce à des outils puissants et intuitifs.
            </p>
          </div>
          <div
            ref={featRefs[2]}
            className="bg-card border border-border rounded-lg p-8 flex flex-col items-center"
          >
            <span className="text-5xl mb-4 animate-bounce" style={{ animationDelay: '0.34s', animationDuration: '1.5s' }}>🔗</span>
            <h3 className="text-xl font-semibold mb-2">Partage simplifié</h3>
            <p className="text-muted-foreground">
              Partagez vos albums et photos en un clic avec vos proches, en toute simplicité via un lien sécurisé.
            </p>
          </div>
        </div>
      </section>

      {/* Comment ça marche */}
      <section id="how-it-works" className="container mx-auto px-6 mt-32">
        <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
          Comment ça marche ?
        </h2>
        <ol className="flex flex-col md:flex-row md:justify-center gap-10 text-lg">
          <li
            ref={howRefs[0]}
            className="flex-1 bg-card border border-border rounded-lg px-8 py-6 flex flex-col items-center"
          >
            <span className="text-3xl font-bold mb-2 text-primary animate-pulse">1</span>
            <span>Inscrivez-vous gratuitement</span>
          </li>
          <li
            ref={howRefs[1]}
            className="flex-1 bg-card border border-border rounded-lg px-8 py-6 flex flex-col items-center"
          >
            <span className="text-3xl font-bold mb-2 text-primary animate-pulse" style={{ animationDelay: "0.12s" }}>2</span>
            <span>Importez vos photos en un clic</span>
          </li>
          <li
            ref={howRefs[2]}
            className="flex-1 bg-card border border-border rounded-lg px-8 py-6 flex flex-col items-center"
          >
            <span className="text-3xl font-bold mb-2 text-primary animate-pulse" style={{ animationDelay: "0.24s" }}>3</span>
            <span>Créez vos albums et partagez-les facilement</span>
          </li>
        </ol>
      </section>

      {/* Tarifs */}
      <section id="pricing" className="container mx-auto px-6 mt-32">
        <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
          Nos tarifs
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div
            ref={pricingRefs[0]}
            className="bg-card border border-border rounded-lg py-10 px-8 flex flex-col items-center hover:-translate-y-2 transition-transform duration-300 group"
          >
            <h3 className="text-xl font-semibold mb-4">Gratuit</h3>
            <p className="text-4xl font-bold mb-4">0€</p>
            <ul className="text-muted-foreground mb-6 space-y-2 text-center">
              <li>• 5 Go de stockage</li>
              <li>• Albums illimités</li>
              <li>• Partage de base</li>
            </ul>
            <a href="/auth?mode=signup" className="px-6 py-2 bg-primary text-primary-foreground rounded font-bold shadow hover:bg-primary/90 transition-transform transform hover:scale-105">Commencer</a>
          </div>
          <div
            ref={pricingRefs[1]}
            className="bg-card border border-primary rounded-lg py-12 px-8 flex flex-col items-center shadow-lg ring-2 ring-primary scale-105 hover:scale-110 transition-transform duration-300 group"
          >
            <h3 className="text-xl font-semibold mb-4 text-primary">Premium</h3>
            <p className="text-4xl font-bold mb-4">5€<span className="text-base font-normal text-muted-foreground">/mois</span></p>
            <ul className="text-muted-foreground mb-6 space-y-2 text-center">
              <li>• 100 Go de stockage</li>
              <li>• Partage avancé & privé</li>
              <li>• Assistance prioritaire</li>
            </ul>
            <a href="/auth?mode=signup" className="px-6 py-2 bg-primary text-primary-foreground rounded font-bold shadow hover:bg-primary/90 transition-transform transform hover:scale-105">Essayer Premium</a>
          </div>
          <div
            ref={pricingRefs[2]}
            className="bg-card border border-border rounded-lg py-10 px-8 flex flex-col items-center hover:-translate-y-2 transition-transform duration-300 group"
          >
            <h3 className="text-xl font-semibold mb-4">Pro</h3>
            <p className="text-4xl font-bold mb-4">15€<span className="text-base font-normal text-muted-foreground">/mois</span></p>
            <ul className="text-muted-foreground mb-6 space-y-2 text-center">
              <li>• Stockage illimité</li>
              <li>• Collaboration d'équipe</li>
              <li>• Outils professionnels</li>
            </ul>
            <a href="/auth?mode=signup" className="px-6 py-2 bg-primary text-primary-foreground rounded font-bold shadow hover:bg-primary/90 transition-transform transform hover:scale-105">Passer Pro</a>
          </div>
        </div>
      </section>
    </section>
  );
};

export default Content;