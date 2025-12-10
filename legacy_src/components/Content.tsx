import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import heroMock from "@/style/hero-mock.svg";
import featureClock from "@/style/icone/profile.ico";

const Content = () => {
  return (
    <div className="bg-[hsl(221,60%,8%)] text-white">
      {/* HERO */}
      <section className="container mx-auto px-6 pt-24 pb-24 lg:pb-28 flex flex-col lg:flex-row items-center gap-14">
        <div className="flex-1 space-y-6">
          <p className="text-white/70 text-sm uppercase tracking-[0.08em] font-semibold">Phobee.</p>
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
            Fini la phobie <span className="text-[hsl(48,100%,50%)]">administrative.</span>
          </h1>
          <p className="text-lg text-white/80 max-w-xl">
            Gérez votre micro-entreprise depuis votre ordi. Déclarations, devis, factures. Zéro stress.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/auth?mode=signup">
              <Button variant="hero" size="lg" className="px-8 py-4 text-base font-bold rounded-full shadow-[0_20px_40px_rgba(0,0,0,0.25)]">
                Commencer Gratuitement
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" size="lg" className="px-8 py-4 text-base font-semibold rounded-full border-white/40 hover:border-white">
                Voir l'application mobile
              </Button>
            </Link>
          </div>
        </div>

        <div className="flex-1 w-full">
          <div className="relative rounded-2xl bg-white shadow-[0_25px_80px_rgba(0,0,0,0.35)] overflow-hidden">
            <img src={heroMock} alt="Interface Phobee" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="bg-[hsl(210,40%,97%)] text-[hsl(217,64%,13%)]">
        <div className="container mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Rappels Intelligents",
                desc: "Reçois une notif 3 jours avant tes déclarations URSSAF. Fini les pénalités.",
              },
              {
                title: "Radar à Aides",
                desc: "ACRE, ARCE... Phobee scanne ton profil et te dit ce que tu peux toucher.",
              },
              {
                title: "Guide Simplifié",
                desc: "Pas de jargon comptable. On t'explique tout simplement.",
              },
            ].map((feature, idx) => (
              <div
                key={feature.title}
                className="bg-white rounded-2xl border border-[hsl(48,100%,85%)] shadow-[0_18px_40px_rgba(15,23,42,0.08)] p-6 flex flex-col gap-3"
                style={{ boxShadow: idx === 0 ? "0 18px 40px rgba(255,204,0,0.25)" : undefined }}
              >
                <div className="w-12 h-12 rounded-2xl bg-[hsl(48,100%,50%)/12] border border-[hsl(48,100%,80%)] flex items-center justify-center">
                  <img src={featureClock} alt="" className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MOBILE / CTA */}
      <section className="bg-[hsl(210,40%,97%)] text-[hsl(217,64%,13%)] pb-16">
        <div className="container mx-auto px-6">
          <div className="bg-white rounded-3xl shadow-[0_25px_60px_rgba(15,23,42,0.15)] p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold">Aussi dispo dans votre poche.</h2>
              <p className="text-slate-600 text-lg">
                Scan de justificatifs, notifs en temps réel... L'app mobile est le compagnon parfait de la version web.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button variant="secondary" size="lg" className="rounded-xl px-5 py-3">
                  App Store
                </Button>
                <Button variant="secondary" size="lg" className="rounded-xl px-5 py-3">
                  Google Play
                </Button>
              </div>
            </div>
            <div className="w-full h-full bg-[hsl(221,60%,8%)] rounded-[32px] relative overflow-hidden shadow-[0_25px_60px_rgba(15,23,42,0.35)]">
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center text-white/70 font-semibold">
                Aperçu mobile
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section className="bg-[hsl(210,40%,97%)] text-[hsl(217,64%,13%)] pb-20">
        <div className="container mx-auto px-6">
          <div className="text-center space-y-4 max-w-4xl mx-auto">
            <p className="text-2xl md:text-3xl font-semibold text-slate-800">
              "Avant, je payais toujours des majorations. Depuis Phobee, je suis à jour et j'ai l'esprit tranquille."
            </p>
            <div className="flex items-center justify-center gap-3 text-slate-600">
              <div className="w-10 h-10 rounded-full bg-slate-300 text-slate-600 flex items-center justify-center font-bold">J</div>
              <div className="text-left">
                <div className="font-semibold text-slate-800">Julie</div>
                <div className="text-xs">Graphiste Freelance</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Content;