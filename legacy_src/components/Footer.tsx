import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="py-12 border-t border-slate-200 mt-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-[hsl(217,64%,13%)] text-white flex items-center justify-center font-extrabold">
              P
            </div>
            <span className="text-xl font-bold text-[hsl(217,64%,13%)]">Phobee</span>
            <span className="text-[hsl(48,100%,50%)] text-2xl font-extrabold">.</span>
          </Link>

          <div className="flex items-center gap-8 text-sm text-slate-500">
            <a href="#" className="hover:text-[hsl(217,64%,13%)] transition-colors">Confidentialité</a>
            <a href="#" className="hover:text-[hsl(217,64%,13%)] transition-colors">Conditions</a>
            <Link to="/contact" className="hover:text-[hsl(217,64%,13%)] transition-colors">Contact</Link>
          </div>

          <p className="text-sm text-slate-500">
            © 2025 Phobee. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
