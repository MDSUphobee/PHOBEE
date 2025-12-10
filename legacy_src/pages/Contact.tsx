import { FormEvent, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

type FormState = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

const initialState: FormState = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

const Contact = () => {
  const [form, setForm] = useState<FormState>(initialState);
  const [sent, setSent] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSent(true);
    setForm(initialState);
  };

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <section className="container mx-auto px-6 py-16">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="space-y-2 text-center">
            <p className="text-sm text-muted-foreground">Contact</p>
            <h1 className="text-3xl font-bold text-foreground">
              Écrivez-nous
            </h1>
            <p className="text-muted-foreground">
              Une question ou un besoin ? Envoyez-nous un message, nous revenons
              vers vous rapidement.
            </p>
          </div>

          <div className="bg-card border border-border rounded-xl shadow-sm p-6 sm:p-8">
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="space-y-1">
                  <span className="text-sm font-medium text-foreground">
                    Nom complet
                  </span>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Votre nom"
                  />
                </label>
                <label className="space-y-1">
                  <span className="text-sm font-medium text-foreground">
                    Email
                  </span>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="vous@exemple.com"
                  />
                </label>
              </div>

              <label className="space-y-1 block">
                <span className="text-sm font-medium text-foreground">
                  Sujet
                </span>
                <input
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Sujet de votre message"
                />
              </label>

              <label className="space-y-1 block">
                <span className="text-sm font-medium text-foreground">
                  Message
                </span>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={5}
                  required
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Détaillez votre demande"
                />
              </label>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                {sent ? (
                  <p className="text-sm text-green-600">
                    Merci ! Votre message a été enregistré.
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Nous répondons généralement sous 24h.
                  </p>
                )}
                <Button type="submit" variant="hero" className="w-full sm:w-auto">
                  Envoyer
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
};

export default Contact;

