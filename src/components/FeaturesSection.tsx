import { FileText, Shield, Clock, Zap, Users, Bell } from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "Gestion documentaire",
    description: "Tous tes documents importants au même endroit, classés et accessibles en un clic.",
  },
  {
    icon: Shield,
    title: "Sécurité maximale",
    description: "Tes données sont chiffrées et protégées. Ta vie privée est notre priorité.",
  },
  {
    icon: Clock,
    title: "Rappels intelligents",
    description: "Ne rate plus jamais une deadline. PhoBee te prévient avant chaque échéance.",
  },
  {
    icon: Zap,
    title: "Automatisation",
    description: "Les démarches répétitives sont automatisées. Gagne du temps précieux.",
  },
  {
    icon: Users,
    title: "Support réactif",
    description: "Une équipe à ton écoute pour t'aider dans toutes tes démarches.",
  },
  {
    icon: Bell,
    title: "Notifications",
    description: "Reste informé en temps réel de l'avancement de tes dossiers.",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 relative">
      <div className="absolute inset-0 bg-glow opacity-30" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Tout ce dont tu as <span className="text-gradient">besoin</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Des outils puissants pour simplifier ton quotidien administratif
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
