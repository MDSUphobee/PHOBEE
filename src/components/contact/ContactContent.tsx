import Link from "next/link";
import { Mail, Instagram, MessageCircle } from "lucide-react";

// Contact page content extracted for reuse/testing.
export default function ContactContent() {
    return (
        <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-28 pb-24">
            <div className="container mx-auto max-w-3xl px-4">
                <div className="text-center mb-12">
                    <p className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wide">
                        Contactez-nous
                    </p>
                    <h1 className="mt-3 text-4xl md:text-5xl font-bold text-secondary mb-3">
                        Entrer en contact avec Phobee
                    </h1>
                    <p className="text-slate-600 text-base max-w-lg mx-auto">
                        Notre équipe se tient à votre disposition pour toute question, retour ou suggestion de partenariat.<br />
                        Remplissez le formulaire ci-dessous ou choisissez le mode de contact qui vous convient le mieux.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* FORMULAIRE DE CONTACT */}
                    <div>
                        <form
                            className="bg-white p-6 md:p-8 rounded-2xl shadow-md border border-slate-100 space-y-6"
                            action="https://formspree.io/f/mrgnkdqj"
                            method="POST"
                        >
                            <div>
                                <label className="block text-sm font-medium text-secondary mb-1" htmlFor="name">
                                    Nom complet
                                </label>
                                <input
                                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-primary"
                                    id="name"
                                    name="name"
                                    type="text"
                                    required
                                    placeholder="Votre nom"
                                    autoComplete="name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-secondary mb-1" htmlFor="email">
                                    Email
                                </label>
                                <input
                                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-primary"
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    placeholder="vous@email.com"
                                    autoComplete="email"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-secondary mb-1" htmlFor="message">
                                    Message
                                </label>
                                <textarea
                                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-base min-h-[100px] focus:outline-none focus:ring-2 focus:ring-primary"
                                    id="message"
                                    name="message"
                                    required
                                    placeholder="Comment pouvons-nous vous aider ?"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full py-3 rounded-full bg-primary text-primary-foreground font-semibold text-base shadow hover:bg-primary/90 transition-all"
                            >
                                Envoyer
                            </button>
                            <p className="text-xs text-slate-400 text-center pt-2">
                                Nous répondons sous 24h ouvrées.
                            </p>
                        </form>
                    </div>
                    {/* COORDONNÉES & SUPPORT */}
                    <div className="flex flex-col gap-6 justify-center">
                        <div className="flex items-start gap-4 p-4 bg-white rounded-xl border border-slate-100 shadow-md">
                            <Mail className="w-6 h-6 text-primary flex-shrink-0" />
                            <div>
                                <h2 className="text-md font-semibold text-secondary mb-1">Par email</h2>
                                <Link
                                    href="mailto:contact@phobee.fr"
                                    className="text-primary font-semibold hover:underline"
                                >
                                    contact@phobee.fr
                                </Link>
                                <p className="text-slate-600 text-xs">Réponse sous 24h ouvrées</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 p-4 bg-white rounded-xl border border-slate-100 shadow-md">
                            <MessageCircle className="w-6 h-6 text-primary flex-shrink-0" />
                            <div>
                                <h2 className="text-md font-semibold text-secondary mb-1">Support utilisateur</h2>
                                <Link
                                    href="mailto:support@phobee.fr"
                                    className="inline-flex items-center px-3 py-1.5 my-1 rounded-full text-xs font-semibold text-primary-foreground bg-primary shadow hover:scale-105 focus:ring-2 focus:ring-primary/50 transition"
                                >
                                    Contacter le support
                                </Link>
                                <p className="text-slate-600 text-xs">Pour tout problème technique ou de compte</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 p-4 bg-white rounded-xl border border-slate-100 shadow-md">
                            <Instagram className="w-6 h-6 text-primary flex-shrink-0" />
                            <div>
                                <h2 className="text-md font-semibold text-secondary mb-1">Instagram</h2>
                                <Link
                                    href="https://www.instagram.com/phobee.fr/?utm_source=ig_web_button_share_sheet"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-primary font-semibold hover:underline"
                                >
                                    @phobee.fr
                                </Link>
                                <p className="text-slate-600 text-xs">Suivez-nous pour ne rien manquer !</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-16 text-center">
                    <div className="inline-block bg-primary/5 px-6 py-4 rounded-2xl">
                        <h3 className="text-xl font-semibold text-secondary mb-1">
                            Nous répondons du lundi au vendredi de 9h à 18h
                        </h3>
                        <p className="text-slate-600 text-sm">
                            L'équipe Phobee s'efforce d'apporter une réponse personnelle et rapide à chaque message.
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}

