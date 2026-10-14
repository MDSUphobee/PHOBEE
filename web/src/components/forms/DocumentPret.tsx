"use client";

import Link from "next/link";
import { toast } from "sonner";
import UnderNavbar from "@/components/ui/under_navbar";
import Highlight from "@/components/ui/highlight";

type Props = {
    /** Nom du document généré, affiché après « Type : » */
    label: string;
    /** URL (http ou blob:) du PDF généré */
    url: string;
    filename: string;
    /** Retour au formulaire pour corriger la saisie */
    onEdit: () => void;
};

const bouton = "inline-flex h-10 items-center justify-center whitespace-nowrap rounded-full px-6 text-base md:text-lg font-medium transition-all hover:-translate-y-0.5";

export default function DocumentPret({ label, url, filename, onEdit }: Props) {
    return (
        <div className="font-['Poppins',sans-serif] text-[#14233c] dark:text-white">
            <UnderNavbar
                imageSrc="/images/fond-marine.svg"
                title="Bravo, votre document est prêt !"
                subtitle={"Votre demande a été générée avec succès.\nVous pouvez maintenant la télécharger et l'envoyer."}
                dimensions={{ width: "1100px", height: "240px" }}
                highlightText={["Bravo,"]}
                titleSize="clamp(34px, 6vw, 60px)"
                subtitleSize="clamp(18px, 2.6vw, 26px)"
                highlightAngle={-1}
            />

            <div className="container mx-auto px-4 md:px-6 md:[zoom:0.8] pb-24 pt-14 md:pt-[110px]">
                <p className="text-center text-xl md:text-2xl leading-[42px]">
                    <Highlight variant="marker" color="blue" className="font-normal">Votre document est conforme et prêt à être utilisé.</Highlight>
                </p>

                <section className="mx-auto mt-12 max-w-[971px] rounded-[39px] bg-primary px-6 py-9 text-center shadow-[0_4px_13.6px_rgba(0,0,0,0.25)] text-[#14233c]">
                    <h2 className="text-xl md:text-2xl">Document généré avec succès</h2>
                    <p className="mt-2 font-['Gowun_Dodum',sans-serif] text-lg md:text-2xl">Type : {label}</p>
                    <div className="mt-7 flex flex-wrap items-center justify-center gap-4">
                        <a href={url} download={filename} className={`${bouton} bg-[#14233c] text-white`}>Télécharger le document (PDF)</a>
                        {/* ponytail: l'envoi recommandé (API La Poste) n'existe pas encore */}
                        <button type="button" onClick={() => toast.info("L'envoi en recommandé arrive bientôt.")} className={`${bouton} border border-black bg-white text-[#0f1729]`}>
                            Envoyer en recommandé
                        </button>
                        <button type="button" onClick={onEdit} className={`${bouton} border border-black bg-[#fff7d7] text-[#0f1729]`}>
                            Modifier le document
                        </button>
                    </div>
                </section>

                <section className="mx-auto mt-16 max-w-[971px] md:mt-24">
                    <h2 className="text-2xl md:text-[32px] leading-tight">Une fois votre document téléchargé, vous pouvez :</h2>
                    <p className="mt-6 text-lg md:text-2xl font-normal leading-[40px]">
                        <Highlight variant="marker" color="yellow" className="font-normal">l'envoyer</Highlight> à l'organisme concerné
                        <br />
                        ou utiliser notre <Highlight variant="marker" color="yellow" className="bg-[#fff7d7] font-normal">envoi recommandé</Highlight> pour gagner du temps
                    </p>
                </section>

                <div className="mt-20 flex justify-center">
                    <Link href="/dashboard" className={`${bouton} border border-black bg-[#deeefc] text-[#0f1729]`}>
                        Retourner à mon tableau de bord
                    </Link>
                </div>
            </div>
        </div>
    );
}
