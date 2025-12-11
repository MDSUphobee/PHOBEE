import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

export const metadata = {
    title: "Mentions légales | Phobee",
};

const sections = [
    {
        title: "Edition du site",
        content: (
            <>
                Le présent site, accessible à l’URL <a href="https://www.phobee.fr" className="text-primary font-semibold">https://www.phobee.fr</a> (le « Site »), est édité par :
                <br />
                Raphaël Lhommeau, résidant 49220, de nationalité Française (France), né(e) le 04/09/2004.
            </>
        ),
    },
    {
        title: "Hébergement",
        content: (
            <>
                Le Site est hébergé par la société OVH SAS, située 2 rue Kellermann - BP 80157 - 59053 Roubaix Cedex 1
                (contact téléphonique ou email : 1007).
            </>
        ),
    },
    {
        title: "Directeur de publication",
        content: <>Le Directeur de la publication du Site est Raphaël Lhommeau.</>,
    },
    {
        title: "Nous contacter",
        content: (
            <>
                Par téléphone : <a href="tel:+33786549033" className="text-primary font-semibold">+33 7 86 54 90 33</a>
                <br />
                Par email : <a href="mailto:phobeepro@gmail.com" className="text-primary font-semibold">phobeepro@gmail.com</a>
            </>
        ),
    },
    {
        title: "Données personnelles",
        content: (
            <>
                Le traitement de vos données à caractère personnel est régi par notre Charte du respect de la vie privée,
                disponible depuis la section « Charte de Protection des Données Personnelles », conformément au Règlement
                Général sur la Protection des Données 2016/679 du 27 avril 2016 (« RGPD »).
            </>
        ),
    },
];

export default function MentionsLegalesPage() {
    return (
        <main className="min-h-screen bg-background flex flex-col">
            <Navbar />

            <section className="bg-[#0F172A] text-white py-16 md:py-20">
                <div className="container mx-auto px-4 md:px-8">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 mt-10">Informations légales du site Phobee</h1>
                    <p className="text-slate-300 max-w-2xl">
                        Conformément à la loi n° 2004-575 du 21 juin 2004 pour la confiance en l'économie numérique,
                        vous trouverez ci-dessous l'identité des intervenants responsables du Site et les informations
                        utiles pour nous contacter.
                    </p>
                </div>
            </section>

            <section className="container mx-auto px-4 md:px-8 py-16 flex-grow">
                <div className="grid gap-10 max-w-4xl">
                    {sections.map(({ title, content }) => (
                        <div key={title} className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                            <h2 className="text-2xl font-semibold text-slate-900 mb-3">{title}</h2>
                            <p className="text-slate-700 leading-relaxed">{content}</p>
                        </div>
                    ))}
                </div>
            </section>

            <Footer />
        </main>
    );
}

