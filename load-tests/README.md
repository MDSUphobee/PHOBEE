# Tests de montée en charge & suivi des performances — PHOBEE

Ce dossier couvre le critère **« montée en charge testée, suivi des performances (tableaux de bord) »** de la grille d'évaluation.

## 1. Test de charge (k6)

[k6](https://k6.io) simule des centaines d'utilisateurs simultanés et mesure les temps de réponse.

### Installer k6
```bash
# macOS
brew install k6
# Debian/Ubuntu
sudo gpg -k && sudo apt-get install k6   # (voir https://grafana.com/docs/k6/latest/set-up/install-k6/)
# Windows
winget install k6
```

### Lancer le test
```bash
# Montée en charge complète sur le dev (défaut)
k6 run load-tests/load-test.js

# Vérification rapide (3 utilisateurs, ~30 s)
PROFILE=smoke k6 run load-tests/load-test.js

# Cibler la prod
BASE_URL=https://phobee.net k6 run load-tests/load-test.js
```

### Ce que fait le test
- **Montée progressive** : 0 → 10 → 30 utilisateurs simultanés, avec paliers, puis descente.
- **Pages testées** : accueil, abonnements, FAQ, dictionnaire, contact.
- **API en lecture** : `GET /api/pdfs` (statut + JSON valide) et `GET /api/aides` (liste non vide).
- **API en écriture** : `POST /api/pdfs/fill` (remplissage CERFA 16015 → génère un PDF), sur ~1 itération sur 5 (opération lourde, pour ne pas saturer le disque).
- **Seuils (SLA)** — le test **échoue** si :
  - plus de **1 %** des requêtes sont en erreur,
  - le **p95** dépasse : **2 s** global, **1,5 s** pages, **2,5 s** API lecture, **5 s** écriture PDF.

### Le rapport (tableau de bord)
À la fin, k6 génère **`load-tests/rapport.html`** : ouvre-le dans un navigateur pour le tableau de bord (débit, p90/p95/p99, taux d'erreur, courbes). C'est le livrable à mettre dans le dossier / montrer en soutenance.

Un résumé s'affiche aussi dans le terminal.

## 2. Suivi des performances en continu (monitoring)

Pour le suivi dans le temps (au-delà d'un test ponctuel), options simples :

- **Uptime Kuma** (auto-hébergé sur le VPS) : disponibilité + temps de réponse, avec alertes.
- **Métriques OVH** / `docker stats` : CPU / RAM / réseau des conteneurs.
- **k6 + Grafana/InfluxDB** (`k6 run --out influxdb=...`) : historiser les runs de charge dans un dashboard Grafana.

> Recommandé pour le dossier : un run k6 (rapport HTML) **+** une capture d'un monitoring (Uptime Kuma ou `docker stats`) suffisent à couvrir le critère.
