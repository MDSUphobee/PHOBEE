import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import jsxA11y from "eslint-plugin-jsx-a11y";

// Config Next (le plugin jsx-a11y y est déjà enregistré) + règles a11y recommandées en erreur.
export default [
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      ...jsxA11y.flatConfigs.recommended.rules,
      "@typescript-eslint/no-unused-vars": "off",
      // Apostrophes françaises dans le JSX : sans risque, bruit pur.
      "react/no-unescaped-entities": "off",
      // ponytail: dette existante passée en warn pour que le lint bloque en CI dès maintenant ;
      // repasser en "error" règle par règle une fois les avertissements corrigés.
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-require-imports": "warn",
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/immutability": "warn",
      "react-hooks/static-components": "warn",
    },
  },
  { ignores: [".next/**", "node_modules/**", "coverage/**", "playwright-report/**", "test-results/**", "next-env.d.ts"] },
];
