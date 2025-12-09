import { useState, useEffect } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Mail, Lock, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { saveAuthSession, getStoredSession } from "@/hooks/use-auth";

const API_BASE = "http://localhost:3000/api/auth";

type NatureIncome = {
  id: number;
  name: string;
};

const Auth = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(searchParams.get("mode") === "signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [exploitingName, setExploitingName] = useState("");
  const [exploitingAddress, setExploitingAddress] = useState("");
  const [siret, setSiret] = useState("");
  const [natureIncomeId, setNatureIncomeId] = useState<number | "">("");
  const [natureOptions, setNatureOptions] = useState<NatureIncome[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsSignUp(searchParams.get("mode") === "signup");
  }, [searchParams]);

  useEffect(() => {
    // Charge les natures de revenu uniquement en mode inscription
    if (!isSignUp) return;
    const fetchNatures = async () => {
      try {
        const res = await fetch("http://localhost:3000/auth/nature-income");
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Échec du chargement");
        setNatureOptions(data);
      } catch (err: any) {
        toast({
          title: "Erreur",
          description: err.message || "Impossible de charger les natures de revenu",
          variant: "destructive",
        });
      }
    };
    fetchNatures();
  }, [isSignUp, toast]);

  useEffect(() => {
    const session = getStoredSession();
    if (session?.token) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (
      isSignUp &&
      (!email || !password || !username || !fullName || !exploitingName || !exploitingAddress || !siret || natureIncomeId === "")
    ) {
      toast({
        title: "Champs manquants",
        description: "Merci de remplir tous les champs pour créer votre compte.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        const registerPayload = {
          email,
          password,
          username: username || email.split("@")[0],
          exploiting_name: exploitingName,
          name: fullName || username || email.split("@")[0],
          exploiting_address: exploitingAddress,
          siret,
          nature_income_id: natureIncomeId,
        };

        const resRegister = await fetch(`${API_BASE}/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(registerPayload),
        });

        const dataRegister = await resRegister.json().catch(() => ({}));
        if (!resRegister.ok) {
          throw new Error(dataRegister.message || "Erreur lors de la création du compte");
        }
      }

      const resLogin = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const dataLogin = await resLogin.json().catch(() => ({}));
      if (!resLogin.ok) {
        throw new Error(dataLogin.message || "Erreur d'authentification");
      }

      const token =
        dataLogin.token || dataLogin.access_token || dataLogin.jwt || "session-cookie";
      const user = dataLogin.user || {
        email,
        username: dataLogin.username || username || email.split("@")[0],
      };
      saveAuthSession(token, user);

      toast({
        title: isSignUp ? "Compte créé !" : "Connexion réussie !",
        description: user.username ? `Bienvenue ${user.username}` : "Action réussie",
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
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Nom d'utilisateur</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="username"
                      type="text"
                      placeholder="mon.pseudo"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="pl-11 h-12 bg-secondary border-border"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fullname">Nom et prénom</Label>
                  <div className="relative">
                    <Input
                      id="fullname"
                      type="text"
                      placeholder="Jean Dupont"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="h-12 bg-secondary border-border"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="exploiting_name">Nom de l'exploitation</Label>
                  <div className="relative">
                    <Input
                      id="exploiting_name"
                      type="text"
                      placeholder="Exploitation PhoBee"
                      value={exploitingName}
                      onChange={(e) => setExploitingName(e.target.value)}
                      className="h-12 bg-secondary border-border"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="exploiting_address">Adresse de l'exploitation</Label>
                  <div className="relative">
                    <Input
                      id="exploiting_address"
                      type="text"
                      placeholder="12 rue des Abeilles, 75000 Paris"
                      value={exploitingAddress}
                      onChange={(e) => setExploitingAddress(e.target.value)}
                      className="h-12 bg-secondary border-border"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="siret">SIRET</Label>
                  <div className="relative">
                    <Input
                      id="siret"
                      type="text"
                      placeholder="00000000000000"
                      value={siret}
                      onChange={(e) => setSiret(e.target.value)}
                      className="h-12 bg-secondary border-border"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nature_income">Nature des revenus</Label>
                  <select
                    id="nature_income"
                    className="w-full h-12 rounded-md border border-border bg-secondary px-3 text-foreground"
                    value={natureIncomeId === "" ? "" : String(natureIncomeId)}
                    onChange={(e) => {
                      const value = e.target.value;
                      setNatureIncomeId(value ? Number(value) : "");
                    }}
                    required
                  >
                    <option value="">Choisis une nature de revenus</option>
                    {natureOptions.map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {opt.name}
                      </option>
                    ))}
                  </select>
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
