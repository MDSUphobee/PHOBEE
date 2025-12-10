import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuthSession } from "@/hooks/use-auth";
import profileIcon from "@/style/icone/profile.ico";

const Navbar = () => {
  const { session, isAuthenticated, hydrated } = useAuthSession();
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[hsl(217,64%,13%)] text-white border-b border-white/10">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-white text-[hsl(217,64%,13%)] flex items-center justify-center font-extrabold">
            P
          </div>
          <span className="text-xl font-bold text-white">Phobee</span>
          <span className="text-primary text-2xl font-extrabold">.</span>
        </Link>

        <div className="flex items-center gap-5">
          <Link to="/faq" className="text-sm font-medium text-white/80 hover:text-white transition-colors">
            Ressources
          </Link>
          <Link to="/contrat" className="text-sm font-medium text-white/80 hover:text-white transition-colors">
            Contrats
          </Link>
          {!hydrated ? null : isAuthenticated && session?.user ? (
            <button
              onClick={() => navigate("/profile")}
              className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50"
              aria-label="Voir le profil"
            >
              <img
                src={profileIcon}
                alt="Profil"
                className="h-9 w-9 rounded-full border border-white/20 bg-white object-cover"
              />
              <span className="hidden md:inline text-sm font-medium text-white">
                {session.user.username || session.user.email}
              </span>
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/auth">
                <Button variant="outline" size="sm">
                  Connexion
                </Button>
              </Link>
              <Link to="/auth?mode=signup">
                <Button variant="hero" size="sm">
                  Commencer
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
