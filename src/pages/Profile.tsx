import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthSession } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";

type UserInfo = {
  username?: string;
  email?: string;
  [key: string]: any;
};

const Profile = () => {
  const { session, isAuthenticated, logout } = useAuthSession();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      try {
        const res = await fetch(`http://localhost:3000/api/auth/user?email=${encodeURIComponent(email)}`);
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.message || "Impossible de récupérer le profil");
        setProfile(data);
      } catch (err: any) {
        setError(err.message || "Erreur de chargement");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [session?.user?.email]);

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
          {!loading && !error && (
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <div className="text-sm text-muted-foreground">Nom d'utilisateur</div>
                <div className="text-lg font-semibold">
                  {profile?.username || session.user.username || "Non renseigné"}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="text-sm text-muted-foreground">Email</div>
                <div className="text-lg font-semibold">{profile?.email || session.user.email}</div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
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

