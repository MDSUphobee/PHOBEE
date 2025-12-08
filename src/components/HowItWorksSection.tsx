const steps = [
  {
    number: "01",
    title: "Crée ton compte",
    description: "Inscription rapide en 2 minutes. Aucune carte bancaire requise.",
  },
  {
    number: "02",
    title: "Importe tes documents",
    description: "Scanne ou téléverse tes documents. PhoBee les classe automatiquement.",
  },
  {
    number: "03",
    title: "Laisse PhoBee agir",
    description: "On s'occupe de tout : rappels, démarches, suivi de dossiers.",
  },
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Comment ça <span className="text-gradient">marche</span> ?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Trois étapes simples pour dire adieu à la paperasse
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="relative flex gap-8 pb-12 last:pb-0">
              {/* Line connector */}
              {index < steps.length - 1 && (
                <div className="absolute left-6 top-16 w-0.5 h-full bg-gradient-to-b from-primary to-transparent" />
              )}
              
              {/* Step number */}
              <div className="relative z-10 flex-shrink-0 w-12 h-12 rounded-full bg-gradient-honey flex items-center justify-center">
                <span className="text-primary-foreground font-bold">{step.number}</span>
              </div>
              
              {/* Content */}
              <div className="flex-1 pt-1">
                <h3 className="text-2xl font-semibold mb-2 text-foreground">{step.title}</h3>
                <p className="text-lg text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
