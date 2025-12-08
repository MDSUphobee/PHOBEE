import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuthSession } from "@/hooks/use-auth";
import profileIcon from "@/style/icone/profile.ico";

const Navbar = () => {
  const { session, isAuthenticated, hydrated } = useAuthSession();
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">P</span>
          </div>
          <span className="text-xl font-bold text-foreground">PhoBee</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
            Fonctionnalités
          </a>
          <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
            Comment ça marche
          </a>
          <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
            Tarifs
          </a>
        </div>

        {!hydrated ? null : isAuthenticated && session?.user ? (
          <button
            onClick={() => navigate("/profile")}
            className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50"
            aria-label="Voir le profil"
          >
            <img
              src={profileIcon}
              alt="Profil"
              className="h-9 w-9 rounded-full border border-border bg-card object-cover"
            />
            <span className="hidden md:inline text-sm font-medium">
              {session.user.username || session.user.email}
            </span>
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <Link to="/auth">
              <Button variant="ghost" size="sm">
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
    </nav>
  );
};

export default Navbar;
