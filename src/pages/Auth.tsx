import { useState, useEffect } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Mail, Lock, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { saveAuthSession, getStoredSession } from "@/hooks/use-auth";

const API_BASE = import.meta.env.VITE_API_BASE as string;
const AUTH_API = `${API_BASE}/api/auth`;

type NatureIncome = {
  id: number;
  name: string;
};
// Les patterns doivent être compatibles avec le flag /v utilisé par les inputs HTML
const EMAIL_REGEX =
  /^[A-Za-z0-9.!#$%&'*+/=?^_{|}~-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*$/;
const STRONG_PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!"#$%&'()*+,.:;<=>?@\[\]^_{|}~-])[A-Za-z0-9!"#$%&'()*+,.:;<=>?@\[\]^_{|}~-]{8,}$/;

const Auth = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(searchParams.get("mode") === "signup");
  const [step, setStep] = useState(0); // 0: email/pass, 1: infos (si signup)
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

  // Validation error state
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    setIsSignUp(searchParams.get("mode") === "signup");
    setStep(0);
  }, [searchParams]);

  useEffect(() => {
    // Charge les natures de revenu uniquement en mode inscription
    if (!isSignUp) return;
    const fetchNatures = async () => {
      try {
        const res = await fetch(`${AUTH_API}/nature-income`);
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

  // Validation helpers
  function validateStep0() {
    let stepErrors: { [key: string]: string } = {};
    if (!email) stepErrors.email = "L'email est requis";
    else if (!EMAIL_REGEX.test(email)) stepErrors.email = "Email invalide";
    if (!password) stepErrors.password = "Le mot de passe est requis";
    else if (!STRONG_PASSWORD_REGEX.test(password))
      stepErrors.password =
        "Le mot de passe doit comporter au moins 8 caractères avec minuscule, majuscule, chiffre et un caractère spécial.";
    return stepErrors;
  }
  function validateStep1() {
    let stepErrors: { [key: string]: string } = {};
    if (!username) stepErrors.username = "Ce champ est requis.";
    if (!fullName) stepErrors.fullName = "Ce champ est requis.";
    if (!exploitingName) stepErrors.exploitingName = "Ce champ est requis.";
    if (!exploitingAddress) stepErrors.exploitingAddress = "Ce champ est requis.";
    if (!siret) stepErrors.siret = "Ce champ est requis.";
    else if (!/^\d{14}$/.test(siret)) stepErrors.siret = "Le numéro SIRET doit comporter 14 chiffres.";
    if (natureIncomeId === "") stepErrors.natureIncomeId = "Sélectionne une nature de revenus.";
    return stepErrors;
  }

  const handleStepContinue = (e: React.FormEvent) => {
    e.preventDefault();
    let stepErrors: { [key: string]: string } = {};
    if (step === 0) {
      stepErrors = validateStep0();
      setErrors(stepErrors);
      if (Object.keys(stepErrors).length === 0) {
        if (isSignUp) setStep(1);
        else handleLoginSubmit(); // direct login
      }
    } else if (step === 1) {
      stepErrors = validateStep1();
      setErrors(stepErrors);
      if (Object.keys(stepErrors).length === 0) {
        handleSignUpSubmit();
      }
    }
  };

  async function handleLoginSubmit() {
    setIsLoading(true);
    try {
      const resLogin = await fetch(`${AUTH_API}/login`, {
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
        username: dataLogin.username || email.split("@")[0],
      };
      saveAuthSession(token, user);
      toast({
        title: "Connexion réussie !",
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
  }

  async function handleSignUpSubmit() {
    setIsLoading(true);
    try {
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

      const resRegister = await fetch(`${AUTH_API}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerPayload),
      });

      const dataRegister = await resRegister.json().catch(() => ({}));
      if (!resRegister.ok) {
        throw new Error(dataRegister.message || "Erreur lors de la création du compte");
      }

      // auto-login après inscription
      await handleLoginSubmit();
    } catch (err: any) {
      toast({
        title: "Erreur",
        description: err.message || "Impossible de créer le compte",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  }

  // Step Forms
  const renderStep0 = () => (
    <form onSubmit={handleStepContinue} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            pattern={EMAIL_REGEX.source}
            placeholder="ton@email.com"
            value={email}
            spellCheck={false}
            maxLength={128}
            onChange={(e) => {
              setEmail(e.target.value.trim());
              setErrors({ ...errors, email: undefined });
            }}
            className="pl-11 h-12 bg-secondary border-border"
            required
          />
        </div>
        {errors.email && (
          <p className="text-red-500 text-xs mt-1">{errors.email}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Mot de passe</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            id="password"
            type="password"
            autoComplete={isSignUp ? "new-password" : "current-password"}
            placeholder="••••••••"
            value={password}
            minLength={8}
            maxLength={64}
            pattern={STRONG_PASSWORD_REGEX.source}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrors({ ...errors, password: undefined });
            }}
            className="pl-11 h-12 bg-secondary border-border"
            required
          />
        </div>
        {errors.password && (
          <p className="text-red-500 text-xs mt-1">{errors.password}</p>
        )}
        <p className="text-xs text-muted-foreground mt-1">
          Au moins 8 caractères avec majuscule, minuscule, chiffre et caractère spécial.
        </p>
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
            ? "Continuer"
            : "Se connecter"}
      </Button>
    </form>
  );

  const renderStep1 = () => (
    <form onSubmit={handleStepContinue} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="username">Nom d'utilisateur</Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            id="username"
            type="text"
            autoComplete="username"
            placeholder="mon.pseudo"
            value={username}
            minLength={3}
            maxLength={32}
            pattern="^[A-Za-z0-9_.-]+$"
            onChange={(e) => {
              setUsername(e.target.value);
              setErrors({ ...errors, username: undefined });
            }}
            className="pl-11 h-12 bg-secondary border-border"
            required
          />
        </div>
        {errors.username && (
          <p className="text-red-500 text-xs mt-1">{errors.username}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="fullname">Nom et prénom</Label>
        <Input
          id="fullname"
          type="text"
          autoComplete="name"
          placeholder="Jean Dupont"
          value={fullName}
          maxLength={64}
          pattern="^[A-Za-zÀ-ÿ' -]+$"
          onChange={(e) => {
            setFullName(e.target.value);
            setErrors({ ...errors, fullName: undefined });
          }}
          className="h-12 bg-secondary border-border"
          required
        />
        {errors.fullName && (
          <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="exploiting_name">Nom de l'exploitation</Label>
        <Input
          id="exploiting_name"
          type="text"
          placeholder="Exploitation PhoBee"
          value={exploitingName}
          maxLength={64}
          onChange={(e) => {
            setExploitingName(e.target.value);
            setErrors({ ...errors, exploitingName: undefined });
          }}
          className="h-12 bg-secondary border-border"
          required
        />
        {errors.exploitingName && (
          <p className="text-red-500 text-xs mt-1">{errors.exploitingName}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="exploiting_address">Adresse de l'exploitation</Label>
        <Input
          id="exploiting_address"
          type="text"
          placeholder="12 rue des Abeilles, 75000 Paris"
          value={exploitingAddress}
          maxLength={128}
          onChange={(e) => {
            setExploitingAddress(e.target.value);
            setErrors({ ...errors, exploitingAddress: undefined });
          }}
          className="h-12 bg-secondary border-border"
          required
        />
        {errors.exploitingAddress && (
          <p className="text-red-500 text-xs mt-1">{errors.exploitingAddress}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="siret">SIRET</Label>
        <Input
          id="siret"
          type="text"
          inputMode="numeric"
          pattern="[0-9]{14}"
          placeholder="00000000000000"
          value={siret}
          maxLength={14}
          onChange={(e) => {
            setSiret(e.target.value.replace(/[^0-9]/g, ""));
            setErrors({ ...errors, siret: undefined });
          }}
          className="h-12 bg-secondary border-border"
          required
        />
        {errors.siret && (
          <p className="text-red-500 text-xs mt-1">{errors.siret}</p>
        )}
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
            setErrors({ ...errors, natureIncomeId: undefined });
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
        {errors.natureIncomeId && (
          <p className="text-red-500 text-xs mt-1">{errors.natureIncomeId}</p>
        )}
      </div>
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="flex-1"
          disabled={isLoading}
          onClick={() => setStep(0)}
        >
          Retour
        </Button>
        <Button
          type="submit"
          variant="hero"
          size="lg"
          className="flex-1"
          disabled={isLoading}
        >
          {isLoading ? "Chargement..." : "Créer mon compte"}
        </Button>
      </div>
    </form>
  );

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
            {isSignUp
              ? step === 0
                ? "Crée ton compte"
                : "Informations supplémentaires"
              : "Content de te revoir"}
          </h1>
          <p className="text-muted-foreground mb-8">
            {isSignUp
              ? "Étape " + (step + 1) + " sur 2"
              : "Connecte-toi pour accéder à ton espace"}
          </p>
          {step === 0 && renderStep0()}
          {step === 1 && isSignUp && renderStep1()}

          <p className="mt-6 text-center text-muted-foreground">
            {isSignUp ? "Déjà un compte ?" : "Pas encore de compte ?"}{" "}
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setStep(0);
                setErrors({});
              }}
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
