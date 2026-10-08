"use client";

const logos = [
    { src: "/images/trusted_customers/customer-trust-1.png", alt: "La Ferme aux Granges" },
    { src: "/images/trusted_customers/customer-trust-2.png", alt: "Le Troglo" },
    { src: "/images/trusted_customers/customer-trust-3.png", alt: "Le Mail" },
    { src: "/images/trusted_customers/customer-trust-4.png", alt: "Anthony Coiffure" },
    { src: "/images/trusted_customers/customer-trust-5.png", alt: "Ferme du Domaine" },
];

export default function SocialProof() {
    return (
        <section className="bg-[#FFCC00]">
            <div className="container mx-auto px-4 md:px-6 py-10 md:py-12">
                <h2 className="text-center text-2xl md:text-[28px] font-extrabold text-[#0F172A] font-heading tracking-tight">
                    Ils nous ont fait{" "}
                    <span className="bg-white px-3 py-1 rounded-lg ml-1 inline-block">confiance</span>
                </h2>

                <div className="mt-8 md:mt-10 flex flex-wrap items-center justify-center gap-x-10 gap-y-6 md:gap-x-16 lg:gap-x-20">
                    {logos.map((logo) => (
                        <img
                            key={logo.src}
                            src={logo.src}
                            alt={logo.alt}
                            className="h-14 md:h-[68px] w-auto max-w-[170px] object-contain"
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
