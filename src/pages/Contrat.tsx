import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const ContratSection = () => (
  <div className="container mx-auto px-6 py-16">
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">Contrats</p>
      <h1 className="text-3xl font-bold text-foreground">Liste des contrats</h1>
    </div>
  </div>
);

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