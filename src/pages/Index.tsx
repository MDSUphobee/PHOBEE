import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import { useAuthSession } from "@/hooks/use-auth";

const Index = () => {
  const { session, isAuthenticated } = useAuthSession();

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-20 pb-6 bg-gradient-to-b from-background via-background to-secondary/20">
        <div className="container mx-auto px-6">
          {isAuthenticated && session?.user ? (
            <div className="mb-8 rounded-2xl border border-border bg-card p-6 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Connecté</p>
                <h2 className="text-2xl font-semibold">
                  Bienvenue, {session.user.username || "utilisateur"} !
                </h2>
                <p className="text-muted-foreground">{session.user.email}</p>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                Votre espace est prêt. Naviguez dans les sections pour continuer.
              </div>
            </div>
          ) : null}
          <HeroSection />
        </div>
      </section>
      <FeaturesSection />
      <HowItWorksSection />
      <CTASection />
      <Footer />
    </main>
  );
};

export default Index;
