import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import Breadcrumb from "@/components/ui/Breadcrumb";

export const metadata = {
    title: "Politique de confidentialité | Phobee",
    description:
        "Quelles données PhoBee collecte, pourquoi, combien de temps elles sont conservées et comment exercer vos droits (RGPD).",
};

const DERNIERE_MAJ = "13 octobre 2026";

const dataRows = [
    {
        usage: "Créer et gérer votre compte",
        data: "Nom, prénom, email, téléphone, mot de passe (chiffré)",
        base: "Exécution du service",
        duree: "Durée du compte, puis 3 ans après la dernière activité",
    },
    {
        usage: "Remplir vos formulaires CERFA",
        data: "Identité, adresse, n° SIRET, informations de l'exploitation (surfaces, production…)",
        base: "Exécution du service",
        duree: "Brouillons : 12 mois sans activité. PDF finalisés : 3 ans",
    },
    {
        usage: "Encaisser et facturer",
        data: "Montant, référence de transaction, adresse de facturation",
        base: "Exécution du service et obligation légale",
        duree: "10 ans (obligation comptable)",
    },
    {
        usage: "Vous recommander des aides",
        data: "Profil d'exploitation, localisation, type de production",
        base: "Exécution du service",
        duree: "Durée du compte",
    },
    {
        usage: "Vous aider à pré-remplir vos formulaires grâce à une intelligence artificielle",
        data: "Contenu des pièces que vous fournissez, limité au nécessaire",
        base: "Exécution du service",
        duree: "Non conservé par notre fournisseur d'IA. Chez PhoBee : même durée que votre brouillon",
    },
    {
        usage: "Effectuer vos démarches d'aides à votre place (service facultatif)",
        data: "Données de votre compte personnel (MSA ou autre) consultées pendant la démarche, pièces justificatives, montant des aides obtenues",
        base: "Votre consentement et le mandat que vous signez",
        duree: "Mandat : 12 mois renouvelables. Preuves de la démarche et suivi des commissions : 5 ans après la dernière commission",
    },
    {
        usage: "Vous envoyer des emails de suivi",
        data: "Email, état de votre dossier",
        base: "Exécution du service",
        duree: "Durée du compte",
    },
    {
        usage: "Mesurer l'audience du site",
        data: "Identifiant de cookie, pages vues, type d'appareil",
        base: "Votre consentement",
        duree: "14 mois maximum",
    },
];

const cookieRows = [
    {
        type: "Cookies nécessaires",
        role: "Faire fonctionner le site (connexion, sécurité, enregistrement de vos brouillons)",
        accord: "Non requis",
    },
    {
        type: "Cookies de mesure d'audience (Google Analytics 4, via Google Tag Manager)",
        role: "Comprendre quelles pages sont consultées afin d'améliorer le site",
        accord: "Requis, via le bandeau cookies",
    },
];

const droits = [
    { t: "Accès", d: "obtenir une copie des données que nous détenons sur vous." },
    { t: "Rectification", d: "faire corriger des données inexactes." },
    { t: "Effacement", d: "demander la suppression de vos données et la fermeture de votre compte." },
    { t: "Opposition", d: "vous opposer à un usage de vos données." },
    { t: "Retrait du consentement", d: "retirer votre accord (cookies, mandat de démarches) sans effet rétroactif." },
    { t: "Portabilité", d: "récupérer vos données dans un fichier réutilisable." },
    { t: "Limitation", d: "demander le gel temporaire d'un traitement." },
];

const email = (
    <a href="mailto:phobeepro@gmail.com" className="font-semibold text-primary hover:underline">
        phobeepro@gmail.com
    </a>
);

function Card({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8 dark:border-slate-700 dark:bg-slate-800/60">
            <h2 className="mb-4 text-2xl font-semibold text-slate-900 dark:text-white">{title}</h2>
            <div className="space-y-4 leading-relaxed text-slate-700 dark:text-slate-300">{children}</div>
        </div>
    );
}

export default function ConfidentialitePage() {
    return (
        <main className="flex min-h-screen flex-col bg-background">
            <Navbar />

            <section className="bg-[#0F172A] py-16 text-white md:py-20">
                <div className="container mx-auto px-4 md:px-8">
                    <p className="mb-3 mt-10 text-sm font-medium uppercase tracking-wider text-[#FFCC00]">
                        Dernière mise à jour : {DERNIERE_MAJ}
                    </p>
                    <h1 className="mb-4 text-4xl font-bold md:text-5xl">Politique de confidentialité</h1>
                    <p className="max-w-3xl text-slate-300">
                        Cette politique explique quelles données nous collectons lorsque vous utilisez le site, pourquoi,
                        combien de temps nous les conservons et comment vous pouvez exercer vos droits. Elle s'applique à
                        tous les visiteurs et utilisateurs de phobee.net, et elle complète la Charte utilisateur.
                    </p>
                </div>
            </section>

            <section className="container mx-auto flex-grow px-4 py-12 md:px-8">
                <Breadcrumb items={[{ label: "Politique de confidentialité" }]} className="mx-auto mb-10 max-w-4xl" />
                <div className="mx-auto grid max-w-4xl gap-8">
                    <Card title="Qui est responsable de vos données">
                        <p>
                            Le responsable du traitement de vos données personnelles est PhoBee, société par actions
                            simplifiée (SAS) en cours de création, accessible sur phobee.net.
                        </p>
                        <p>Pour toute question, vous pouvez nous écrire à {email}.</p>
                    </Card>

                    <Card title="Les données que nous collectons">
                        <p>
                            Nous ne collectons que les données utiles pour chacun des usages ci-dessous. Nous ne vendons
                            jamais vos données. Vos données de carte bancaire ne passent pas par nos serveurs : elles sont
                            traitées par Stripe.
                        </p>
                        <div className="-mx-6 overflow-x-auto md:mx-0">
                            <table className="w-full min-w-[640px] border-collapse text-sm md:text-[15px]">
                                <thead>
                                    <tr className="border-b-2 border-slate-200 text-left dark:border-slate-600">
                                        <th className="p-3 font-semibold text-slate-900 dark:text-white">
                                            Pourquoi nous les utilisons
                                        </th>
                                        <th className="p-3 font-semibold text-slate-900 dark:text-white">
                                            Données concernées
                                        </th>
                                        <th className="p-3 font-semibold text-slate-900 dark:text-white">
                                            Fondement juridique
                                        </th>
                                        <th className="p-3 font-semibold text-slate-900 dark:text-white">
                                            Durée de conservation
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dataRows.map((row) => (
                                        <tr
                                            key={row.usage}
                                            className="border-b border-slate-100 align-top dark:border-slate-700/60"
                                        >
                                            <td className="p-3 font-medium text-slate-900 dark:text-slate-100">
                                                {row.usage}
                                            </td>
                                            <td className="p-3">{row.data}</td>
                                            <td className="p-3">{row.base}</td>
                                            <td className="p-3">{row.duree}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <p className="rounded-xl bg-[#f7f6fe] p-4 text-sm dark:bg-slate-900/60">
                            <strong>Intelligence artificielle :</strong> PhoBee utilise une IA uniquement pour vous aider à
                            lire vos pièces et pré-remplir vos formulaires. Elle ne prend aucune décision à votre place :
                            vous vérifiez et validez toujours le contenu avant de payer. Nos recommandations d'aides sont
                            calculées par des règles, sans IA. Votre fournisseur d'IA n'a pas le droit de réutiliser vos
                            données pour entraîner ses modèles.
                        </p>
                    </Card>

                    <Card title="Qui peut accéder à vos données, et comment nous les protégeons">
                        <p className="font-semibold text-slate-900 dark:text-white">Qui y accède :</p>
                        <ul className="list-disc space-y-2 pl-5">
                            <li>L'équipe PhoBee, avec des accès limités à ce dont chacun a besoin.</li>
                            <li>
                                Nos prestataires techniques, uniquement pour faire fonctionner le service : l'hébergeur du
                                serveur, Stripe pour le paiement, et Google Analytics pour la mesure d'audience (si vous
                                acceptez les cookies).
                            </li>
                            <li>
                                Les organismes concernés par vos demandes (MSA, DDT, etc.), uniquement lorsque vous nous
                                demandez de transmettre un dossier.
                            </li>
                        </ul>
                        <p>Nous ne transmettons vos données à aucun annonceur.</p>
                        <p>
                            <strong>Hébergement :</strong> vos données sont hébergées sur un serveur situé à Strasbourg, en
                            France, donc au sein de l'Union européenne.
                        </p>
                        <p className="font-semibold text-slate-900 dark:text-white">Sécurité :</p>
                        <ul className="list-disc space-y-2 pl-5">
                            <li>Connexion chiffrée (HTTPS) sur l'ensemble du site.</li>
                            <li>Mots de passe stockés sous forme chiffrée, jamais en clair.</li>
                            <li>
                                Base de données non accessible depuis Internet, accès d'administration réservé par
                                connexion sécurisée.
                            </li>
                            <li>Environnement de test séparé du site réel, sans vos données.</li>
                            <li>
                                En cas d'incident touchant vos données, nous prévenons la CNIL dans les 72 heures lorsque
                                la loi l'exige, et nous vous informons si vous êtes concerné.
                            </li>
                        </ul>
                    </Card>

                    <Card title="Cookies et mesure d'audience">
                        <p>Le site utilise deux types de cookies :</p>
                        <div className="-mx-6 overflow-x-auto md:mx-0">
                            <table className="w-full min-w-[560px] border-collapse text-sm md:text-[15px]">
                                <thead>
                                    <tr className="border-b-2 border-slate-200 text-left dark:border-slate-600">
                                        <th className="p-3 font-semibold text-slate-900 dark:text-white">Type</th>
                                        <th className="p-3 font-semibold text-slate-900 dark:text-white">
                                            À quoi il sert
                                        </th>
                                        <th className="p-3 font-semibold text-slate-900 dark:text-white">Votre accord</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cookieRows.map((row) => (
                                        <tr
                                            key={row.type}
                                            className="border-b border-slate-100 align-top dark:border-slate-700/60"
                                        >
                                            <td className="p-3 font-medium text-slate-900 dark:text-slate-100">
                                                {row.type}
                                            </td>
                                            <td className="p-3">{row.role}</td>
                                            <td className="p-3">{row.accord}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <p>
                            Vous pouvez accepter ou refuser les cookies de mesure d'audience lors de votre première visite,
                            et changer d'avis à tout moment depuis le bandeau. Refuser ces cookies n'a aucune conséquence
                            sur l'accès au service. Leur durée de vie est limitée à 14 mois maximum.
                        </p>
                    </Card>

                    <Card title="Vos droits">
                        <p>Conformément au RGPD, vous disposez à tout moment des droits suivants :</p>
                        <ul className="list-disc space-y-2 pl-5">
                            {droits.map((d) => (
                                <li key={d.t}>
                                    <strong className="text-slate-900 dark:text-white">{d.t} :</strong> {d.d}
                                </li>
                            ))}
                        </ul>
                        <p>
                            <strong>Comment les exercer :</strong> écrivez-nous à {email}. Nous pouvons vous demander un
                            justificatif d'identité en cas de doute. Nous vous répondons sous un mois.
                        </p>
                        <p>
                            <strong>Réclamation :</strong> si notre réponse ne vous satisfait pas, vous pouvez saisir la
                            CNIL sur{" "}
                            <a
                                href="https://www.cnil.fr"
                                target="_blank"
                                rel="noreferrer"
                                className="font-semibold text-primary hover:underline"
                            >
                                cnil.fr
                            </a>
                            .
                        </p>
                        <p>
                            <strong>Mises à jour :</strong> cette politique peut évoluer. La date en haut de page indique sa
                            dernière version. En cas de changement important, nous vous en informerons par email.
                        </p>
                    </Card>
                </div>
            </section>

            <Footer />
        </main>
    );
}
