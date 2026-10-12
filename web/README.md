# PHOBEE — Front (Next.js)

Front Next.js du projet PHOBEE. Il consomme l'API Laravel (dépôt `PHOBEE-API-V2`).

Deux façons de lancer le projet, au choix :
- **A. Docker** — rien à installer (ni PHP, ni Node, ni MySQL). Recommandé.
- **B. Natif** — sans Docker, avec PHP/Composer/Node installés sur la machine.

Les deux dépôts doivent être côte à côte : `PHOBEE/` et `PHOBEE-API-V2/`.
Les commandes marchent sous Windows (PowerShell/CMD), macOS et Linux.

---

## A. Lancer avec Docker

### Prérequis
- Docker Desktop (Windows / macOS / Linux) ou OrbStack (macOS).
- Windows : activer **WSL2**.

### 1. Réseau partagé (une seule fois)
```bash
docker network create phobee_shared_net
```

### 2. Fichiers de config (non versionnés)

**`PHOBEE-API-V2/.env`** — copier `.env.example` puis fixer la base sur le MySQL du compose :
```env
DB_CONNECTION=mysql
DB_HOST=db_dev
DB_PORT=3306
DB_DATABASE=phobee_dev
DB_USERNAME=phobee_dev
DB_PASSWORD=phobee_dev
```

**`PHOBEE/.env` et `PHOBEE/web/.env`** (même contenu) :
```env
APP_ENV=development
NEXT_PUBLIC_APP_ENV=staging
SUFFIX=_dev
API_BASE=http://phobee_nginx_dev/api     # serveur->serveur (conteneur), finit par /api
API_URL=http://phobee_nginx_dev          # utilisé avec new URL('api/...'), sans /api
NEXT_PUBLIC_API_BASE=http://localhost:8000/api   # navigateur->API (figé au build)
VITE_API_BASE=http://localhost:8000/api
JWT_SECRET=change-me
JWT_EXPIRES_IN=1h
```

**Overrides Docker locaux** (ports + hot-reload, gitignorés — à recréer chez soi) :

`PHOBEE-API-V2/docker-compose.override.yml`
```yaml
services:
  nginx_dev:
    ports: ["8000:80"]
```

`PHOBEE/docker-compose.override.yml`
```yaml
services:
  nextjs:
    user: root
    command: npm run dev -- -H 0.0.0.0
    environment:
      - NODE_ENV=development
      - WATCHPACK_POLLING=true
      - CHOKIDAR_USEPOLLING=true
    volumes:
      - ./web:/app
      - /app/node_modules
      - /app/.next
    ports: ["3000:3000"]
```

### 3. API puis Front
```bash
cd PHOBEE-API-V2
docker compose up -d --build
docker compose exec app_dev composer install
docker compose exec app_dev php artisan key:generate   # si APP_KEY vide
docker compose exec app_dev php artisan migrate --force

cd ../PHOBEE
docker compose up -d --build
```

- Front : http://localhost:3000 — API : http://localhost:8000

---

## B. Lancer en natif (sans Docker)

### Prérequis
- **PHP 8.2+** + **Composer** (API), **Node.js 20+** + **npm** (front).
- Pas besoin de MySQL : on utilise **SQLite**.

### 1. API (Laravel) — terminal 1
```bash
cd PHOBEE-API-V2
composer install
cp .env.example .env            # Windows : copy .env.example .env
php artisan key:generate
```
Dans `.env`, utiliser SQLite :
```env
DB_CONNECTION=sqlite
# (laisser les lignes DB_HOST/PORT/DATABASE/USERNAME/PASSWORD commentées)
```
Créer le fichier de base puis lancer :
```bash
# créer le fichier SQLite vide
touch database/database.sqlite        # Windows : type nul > database\database.sqlite
php artisan migrate
php artisan serve                     # API sur http://127.0.0.1:8000
```

### 2. Front (Next.js) — terminal 2
Créer `PHOBEE/.env` et `PHOBEE/web/.env` **pointant vers l'API locale** :
```env
APP_ENV=development
NEXT_PUBLIC_APP_ENV=development
API_BASE=http://127.0.0.1:8000/api
API_URL=http://127.0.0.1:8000
NEXT_PUBLIC_API_BASE=http://localhost:8000/api
VITE_API_BASE=http://localhost:8000/api
JWT_SECRET=change-me
JWT_EXPIRES_IN=1h
```
Puis :
```bash
cd PHOBEE/web
npm install
npm run dev                           # Front sur http://localhost:3000
```

---

## Développement (hot-reload)
- Modif front (`web/src/...`) → prise en compte sans rebuild (Docker : grâce à l'override ; natif : `npm run dev`).
- Modif PHP de l'API → immédiate (Docker : volume monté ; natif : `php artisan serve`).
- **Rebuild Docker** seulement si nouvelle dépendance ou changement d'un `Dockerfile` : `docker compose up -d --build`.

## IDE (enlever le "rouge")
Installer les dépendances en local (gitignorées) : `npm install` dans `web/`, `composer install` dans `PHOBEE-API-V2/`.

## Tests
```bash
npm run test      # unitaires (Jest)
npm run test:e2e  # end-to-end (Playwright)
```

## Dépannage
- **Port 3000/8000 occupé** : changer le port (override Docker `"3001:3000"`, ou `php artisan serve --port=8001` / `npm run dev -- -p 3001`).
- **`network phobee_shared_net not found`** (Docker) : relancer `docker network create phobee_shared_net`.
- **Natif : erreur `could not find driver`** : activer les extensions PHP `pdo_sqlite` (ou `pdo_mysql`) dans `php.ini`.
- **Windows + hot-reload Docker** : garder le projet dans le système de fichiers **WSL2**.
