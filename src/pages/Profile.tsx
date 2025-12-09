import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthSession } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronDown, ChevronUp } from "lucide-react";

type UserAccount = {
  id?: number;
  username?: string;
  email?: string;
};

type UserExtra = {
  exploiting_name?: string;
  name?: string;
  exploiting_address?: string;
  siret?: string;
  nature_income_id?: number;
  nature_income_name?: string;
};

type NatureOption = {
  id: number;
  name: string;
};

const API_BASE = import.meta.env.VITE_API_BASE as string;
const AUTH_API = `${API_BASE}/api/auth`;

const Profile = () => {
  const { session, isAuthenticated, logout } = useAuthSession();
  const navigate = useNavigate();
  const [account, setAccount] = useState<UserAccount | null>(null);
  const [extras, setExtras] = useState<UserExtra | null>(null);
  const [natureMap, setNatureMap] = useState<Record<number, string>>({});
  const [natureOptions, setNatureOptions] = useState<NatureOption[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<UserExtra>({
    exploiting_name: "",
    name: "",
    exploiting_address: "",
    siret: "",
    nature_income_id: undefined,
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Ajoute état pour le déroulant "Option avancée"
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const email = session?.user?.email;
    if (!email) return;

    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      setMessage(null);
      try {
        // Récupère l'utilisateur (id, username, email)
        const resUser = await fetch(`${AUTH_API}/user?email=${encodeURIComponent(email)}`);
        const dataUser = await resUser.json().catch(() => ({}));
        if (!resUser.ok) throw new Error(dataUser.message || "Impossible de récupérer le profil");
        setAccount(dataUser);

        // Récupère les informations complémentaires
        if (dataUser?.id) {
          const [resInfo, resNature] = await Promise.all([
            fetch(`${AUTH_API}/user-info/${dataUser.id}`),
            fetch(`${AUTH_API}/nature-income`),
          ]);

          const dataInfo = await resInfo.json().catch(() => ({}));
          if (!resInfo.ok && resInfo.status !== 404) {
            throw new Error(dataInfo.message || "Impossible de récupérer les infos");
          }

          const dataNature = await resNature.json().catch(() => []);
          if (resNature.ok && Array.isArray(dataNature)) {
            const map = (dataNature as NatureOption[]).reduce(
              (acc, cur) => ({ ...acc, [cur.id]: cur.name }),
              {} as Record<number, string>
            );
            setNatureMap(map);
            setNatureOptions(dataNature as NatureOption[]);
            const info = resInfo.status === 404 ? null : dataInfo;
            setExtras(
              info
                ? {
                    ...info,
                    nature_income_name:
                      info?.nature_income_id ? map[info.nature_income_id] : undefined,
                  }
                : null
            );
          } else {
            setNatureMap({});
            setExtras(resInfo.status === 404 ? null : dataInfo);
          }
        } else {
          setExtras(null);
        }
      } catch (err: any) {
        setError(err.message || "Erreur de chargement");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [session?.user?.email]);

  useEffect(() => {
    if (!extras) return;
    setForm({
      exploiting_name: extras.exploiting_name || "",
      name: extras.name || "",
      exploiting_address: extras.exploiting_address || "",
      siret: extras.siret || "",
      nature_income_id: extras.nature_income_id,
    });
  }, [extras]);

  const onChange = (key: keyof UserExtra, value: string | number | "") => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const onSave = async () => {
    if (!account?.id) return;
    setSaving(true);
    setError(null);
    setMessage(null);
    setValidationError(null);

    if (
      !form.exploiting_name ||
      !form.name ||
      !form.exploiting_address ||
      !form.siret ||
      !form.nature_income_id
    ) {
      setSaving(false);
      setValidationError("Tous les champs sont requis.");
      return;
    }
    try {
      const payload = {
        exploiting_name: form.exploiting_name,
        name: form.name,
        exploiting_address: form.exploiting_address,
        siret: form.siret,
        nature_income_id: form.nature_income_id,
      };

      const res = await fetch(`${AUTH_API}/user-info/${account.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Échec de la mise à jour");

      const updated: UserExtra = {
        ...data,
        nature_income_name:
          data?.nature_income_id && natureMap[data.nature_income_id]
            ? natureMap[data.nature_income_id]
            : undefined,
      };
      setExtras(updated);
      setIsEditing(false);
      setMessage("Profil mis à jour.");
    } catch (err: any) {
      setError(err.message || "Impossible de mettre à jour le profil");
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async () => {
    if (!account?.id) return;
    const confirmed = window.confirm("Supprimer votre profil et vos informations ?");
    if (!confirmed) return;
    setDeleting(true);
    setError(null);
    setMessage(null);
    try {
      const resInfo = await fetch(`${AUTH_API}/user-info/${account.id}`, {
        method: "DELETE",
      });
      if (!resInfo.ok && resInfo.status !== 204 && resInfo.status !== 404) {
        const data = await resInfo.json().catch(() => ({}));
        throw new Error(data.message || "Échec de la suppression des infos");
      }

      const resUser = await fetch(`${AUTH_API}/user/${account.id}`, {
        method: "DELETE",
      });
      if (!resUser.ok && resUser.status !== 204) {
        const data = await resUser.json().catch(() => ({}));
        throw new Error(data.message || "Échec de la suppression du compte");
      }

      setExtras(null);
      setMessage("Compte supprimé.");
      logout();
      navigate("/auth");
    } catch (err: any) {
      setError(err.message || "Impossible de supprimer le profil");
    } finally {
      setDeleting(false);
    }
  };

  const canEdit = useMemo(
    () =>
      Boolean(
        form.exploiting_name &&
          form.name &&
          form.exploiting_address &&
          form.siret &&
          form.nature_income_id
      ),
    [form]
  );

  if (!session?.user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-16 space-y-6">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Profil</p>
          <h1 className="text-3xl font-bold">Vos informations</h1>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
          {loading && <div className="text-sm text-muted-foreground">Chargement du profil...</div>}
          {error && <div className="text-sm text-destructive">{error}</div>}
          {message && <div className="text-sm text-green-600">{message}</div>}
          {validationError && <div className="text-sm text-destructive">{validationError}</div>}
          {!loading && !error && (
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <div className="text-sm text-muted-foreground">Nom d'utilisateur</div>
                <div className="text-lg font-semibold">
                  {account?.username || session.user.username || "Non renseigné"}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="text-sm text-muted-foreground">Email</div>
                <div className="text-lg font-semibold">{account?.email || session.user.email}</div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border">
                <InfoLine label="Nom complet" value={extras?.name || "Non renseigné"} />
                <InfoLine label="Nom de l'exploitation" value={extras?.exploiting_name || "Non renseigné"} />
                <InfoLine label="Adresse d'exploitation" value={extras?.exploiting_address || "Non renseigné"} />
                <InfoLine label="SIRET" value={extras?.siret || "Non renseigné"} />
                <InfoLine
                  label="Nature de revenus"
                  value={
                    extras?.nature_income_name ||
                    (extras?.nature_income_id ? `#${extras.nature_income_id}` : "Non renseigné")
                  }
                />
              </div>

              {/* Déroulant Option avancée */}
              <div className="pt-4 flex flex-col items-end">
                <button
                  type="button"
                  onClick={() => setShowAdvanced((val) => !val)}
                  className="flex items-center space-x-2 text-sm px-3 py-2 rounded-md border border-border bg-background hover:bg-muted transition-colors font-semibold focus:outline-none"
                  style={{ minWidth: 180 }}
                >
                  <span>Option avancée</span>
                  {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {showAdvanced && (
                  <div className="flex flex-col md:flex-row justify-end gap-3 pt-3 w-full">
                    <Button variant="outline" onClick={() => setIsEditing((v) => !v)}>
                      {isEditing ? "Annuler" : "Modifier"}
                    </Button>
                    <Button variant="destructive" onClick={onDelete} disabled={deleting}>
                        {deleting ? "Suppression..." : "Supprimer le compte"}
                    </Button>
                  </div>
                )}
              </div>

              {isEditing && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border">
                  <Field
                    label="Nom complet"
                    id="name"
                    value={form.name || ""}
                    onChange={(v) => onChange("name", v)}
                  />
                  <Field
                    label="Nom de l'exploitation"
                    id="exploiting_name"
                    value={form.exploiting_name || ""}
                    onChange={(v) => onChange("exploiting_name", v)}
                  />
                  <Field
                    label="Adresse d'exploitation"
                    id="exploiting_address"
                    value={form.exploiting_address || ""}
                    onChange={(v) => onChange("exploiting_address", v)}
                  />
                  <Field
                    label="SIRET"
                    id="siret"
                    value={form.siret || ""}
                    onChange={(v) => onChange("siret", v)}
                  />
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="nature_income">Nature de revenus</Label>
                    <select
                      id="nature_income"
                      className="w-full h-10 rounded-md border border-border bg-background px-3 text-foreground"
                      value={form.nature_income_id ?? ""}
                      onChange={(e) =>
                        onChange("nature_income_id", e.target.value ? Number(e.target.value) : "")
                      }
                    >
                      <option value="">Sélectionner</option>
                      {natureOptions.map((opt) => (
                        <option key={opt.id} value={opt.id}>
                          {opt.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* Harmonised: action buttons always bottom right */}
                  <div className="md:col-span-2 flex flex-col md:flex-row justify-end gap-3">
                    <Button variant="hero" onClick={onSave} disabled={!canEdit || saving}>
                      {saving ? "Sauvegarde..." : "Enregistrer"}
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)} disabled={saving}>
                      Annuler
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        {/* Harmonised: align navigation & logout buttons to the right, and keep vertical on mobile */}
        <div className="flex flex-col md:flex-row justify-end items-stretch md:items-center gap-3">
          <Button variant="outline" onClick={() => navigate("/")}>
            Retour à l'accueil
          </Button>
          <Button variant="destructive" onClick={() => { logout(); navigate("/auth"); }}>
            Se déconnecter
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;

type InfoLineProps = {
  label: string;
  value: string;
};

const InfoLine = ({ label, value }: InfoLineProps) => (
  <div className="flex flex-col gap-1">
    <span className="text-sm text-muted-foreground">{label}</span>
    <span className="font-semibold">{value}</span>
  </div>
);

type FieldProps = {
  label: string;
  id: string;
  value: string;
  onChange: (value: string) => void;
};

const Field = ({ label, id, value, onChange }: FieldProps) => (
  <div className="flex flex-col gap-2">
    <Label htmlFor={id}>{label}</Label>
    <Input
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-background"
    />
  </div>
);
