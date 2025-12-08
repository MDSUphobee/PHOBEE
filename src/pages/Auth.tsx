import { useState, useEffect } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Mail, Lock, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { saveAuthSession, getStoredSession } from "@/hooks/use-auth";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(searchParams.get("mode") === "signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsSignUp(searchParams.get("mode") === "signup");
  }, [searchParams]);

  useEffect(() => {
    const session = getStoredSession();
    if (session?.token) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const endpoint = isSignUp ? "/auth/register" : "/auth/login";
    const payload = isSignUp
      ? { username: name, email, password }
      : { email, password };

    try {
      const res = await fetch(`http://localhost:3000${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.message || "Erreur d'authentification");
      }

      const token = data.token || data.access_token || data.jwt || "session-cookie";
      if (token && data.user) {
        saveAuthSession(token, data.user);
      }

      toast({
        title: isSignUp ? "Compte créé !" : "Connexion réussie !",
        description: data.user?.username
          ? `Bienvenue ${data.user.username}`
          : "Action réussie",
      });
      navigate("/", { replace: true });
    } catch (err: any) {
      toast({
        title: "Erreur",
        description: err.message || "Impossible de se connecter",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left panel - Form */}
      <div className="flex-1 flex flex-col justify-center px-8 md:px-16 lg:px-24">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-12"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à l'accueil
        </Link>

        <div className="max-w-md">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">P</span>
            </div>
            <span className="text-2xl font-bold text-foreground">PhoBee</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            {isSignUp ? "Crée ton compte" : "Content de te revoir"}
          </h1>
          <p className="text-muted-foreground mb-8">
            {isSignUp 
              ? "Rejoins PhoBee et simplifie ta vie administrative" 
              : "Connecte-toi pour accéder à ton espace"}
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="name">Prénom</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Ton prénom"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-11 h-12 bg-secondary border-border"
                    required
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="ton@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-11 h-12 bg-secondary border-border"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-11 h-12 bg-secondary border-border"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <Button 
              type="submit" 
              variant="hero" 
              size="lg" 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading 
                ? "Chargement..." 
                : isSignUp 
                  ? "Créer mon compte" 
                  : "Se connecter"}
            </Button>
          </form>

          <p className="mt-6 text-center text-muted-foreground">
            {isSignUp ? "Déjà un compte ?" : "Pas encore de compte ?"}{" "}
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-primary hover:underline font-medium"
            >
              {isSignUp ? "Se connecter" : "S'inscrire"}
            </button>
          </p>
        </div>
      </div>

      {/* Right panel - Visual */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-background" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/30 rounded-full blur-[150px] animate-pulse-glow" />
        
        <div className="relative z-10 flex flex-col justify-center items-center p-16 text-center">
          <div className="w-24 h-24 rounded-3xl bg-gradient-primary flex items-center justify-center mb-8 animate-float">
            <span className="text-primary-foreground font-bold text-5xl">P</span>
          </div>
          <h2 className="text-3xl font-bold mb-4">
            Simplifie ton <span className="text-gradient">quotidien</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-md">
            Fini le stress des papiers. PhoBee s'occupe de tout pour que tu puisses te concentrer sur l'essentiel.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
