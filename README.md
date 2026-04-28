# Application Full-Stack de Gestion de Bibliothèque — SAE DDAW

Ce projet est une application complète (Frontend et Backend) conçue pour répondre aux critères de la SAE « Développement & Déploiement d’une Application Web RESTful Conteneurisée ». Il permet la gestion centralisée d'une bibliothèque : adhérents, livres, emprunts, auteurs, membres, etc.

## 🚀 Compétences Techniques Démontrées

Pour répondre aux exigences académiques, ce projet met en œuvre :

- **Structuration modulaire** : Code organisé en modules NestJS clairs et isolés.
- **Architecture API REST** : Usage strict de contrôleurs pour exposer des services JSON.
- **Documentation OpenAPI** : Documentation interactive complète via **Swagger**.
- **Tests automatisés** : Suite de tests unitaires avec **Jest**.
- **Gestion de versions** : Suivi du projet avec **Git**.
- **Conteneurisation (Docker)** : Déploiement via Docker Compose pour une portabilité totale.

## 1) Contexte du projet et Résumé des fonctionnalités

L'application permet de :

- **Gérer des adhérents et leurs profils détaillés** (1-1).
- **Gérer un catalogue de livres, classés par catégories et auteurs** (1-N et N-N) avec la gestion des images de couverture.
- **Réaliser des emprunts et des retours**, avec mise à jour automatisée des stocks de livres dispo.
- **Visualiser et interagir** via une interface utilisateur moderne (React/Vite).
- **Consommer les données** via une API REST sécurisée (NestJS) totalement documentée.

## 2) Stack Technique et Choix

### Backend (L'API)

- **NestJS** : Framework Node.js robuste et modulaire inspiré par Angular, garantissant une architecture propre.
- **Sequelize + sequelize-typescript** : ORM relationnel utilisé pour dialoguer avec MySQL tout en profitant des avantages de TypeScript.
- **Swagger / OpenAPI** : Outil de documentation interactive de l'API et de génération de contrats de données pour vos importations Postman.

### Frontend (L'Interface Utilisateur)

- **React.js + Vite** : Framework nouvelle génération très performant pour créer des interfaces utilisateur dynamiques.
- **Axios** : Client HTTP servant à lancer toutes les requêtes vers l'API NestJS.
- **Lucide-React** : Bibliothèque d'icônes ergonomiques.
- **Framer Motion** : Ajout d'animations (composants, modales) pour respecter les critères de design.

### Données & Conteneurisation

- **MySQL** : SGBD Relationnel classique, idéal pour des contraintes SAE.
- **Docker & Docker Compose** : Utilisé pour orchestrer la base de données MySQL, l'API et les scripts Seed automatiquement en une commande au lieu de faire de fastidieuses installations machine.

---

## 3) Structure Complète du Projet (De A à Z)

La hiérarchie a été pensée de manière logique, séparant formellement le Frontend du Backend. Le grand avantage de ce clivage est de comprendre qu'on a _deux applications distinctes qui communiquent entre elles_.

```text
Gestion-Bibliotheque-Mohamed-justin/
│
├── library-frontend/               <-- 💻 PARTIE FRONTEND (Dossier React/Vite)
│   ├── package.json                # Dépendances Vite et React
│   └── src/
│       ├── api/                    # Configuration Axios (liaison avec http://localhost:3000)
│       ├── assets/                 # Images et médias statiques
│       ├── components/             # Composants UI réutilisables (Modal, Sidebar...)
│       ├── views/                  # Vues complètes (BooksView, LoansView, etc.)
│       ├── App.css & index.css     # Design system global
│       └── App.tsx                 # Point d'entrée de l'application Front
│
├── src/                            <-- ⚙️ PARTIE BACKEND (Dossier NestJS)
│   ├── app.module.ts               # Module racine du backend
│   ├── main.ts                     # Configuration du serveur (Port, Activation globales : CORS, Swagger)
│   ├── common/                     # Filtres (ex: exceptions) gérés globalement
│   ├── auth/                       # Module d'authentification
│   │
│   ├── authors/                    # Entité de gestion des auteurs
│   ├── books/                      # Entité de gestion des livres (Logique de stock, DTOs, Covers)
│   ├── categories/                 # Entité de gestion des catégories / genres
│   ├── loans/                      # Entité de gestion des emprunts
│   ├── profiles/                   # Entité de gestion des profils détaillés
│   └── users/                      # Entité de gestion des adhérents / comptes de base
│
├── docker/
│   └── db/
│       └── seed.sql                # Jeu de données SQL initial (Livres de test injectés au démarrage)
│
├── docker-compose.yml              # Fichier d'orchestration Docker (Backend server + Database)
├── Dockerfile                      # Image définissant l'environnement de déploiement de l'API Node.js
├── export-openapi.ts               # Script générant le fichier JSON local pour configurer Postman
├── openapi.json                    # Résultat du script OpenAPI (à importer dans Postman !)
├── package.json                    # Dépendances Node.js du Backend
└── README.md                       # Ce fichier de documentation intégrale
```

Dans les dossiers sources du Backend (comme `src/books`), la logique suit l'architecture NestJS :

- **Un Controller (`x.controller.ts`)** : Il ne s'occupe _que_ d'écouter les routes HTTP (ex: `GET /books`).
- **Un Service (`x.service.ts`)** : Il concentre toute l'intelligence algorithmique et la modification base de données.
- **Des Modèles (`x.model.ts`)** : Les schémas de vos tables MySQL Sequelize (Users, Books, Loans, Reservations, etc.).
- **Des DTO (`/dto`)** : Data Transfer Object définissant strictement les JSON que l'utilisateur a le droit d'envoyer pour la création ou l'update de l'entité.

---

## 4) Le Modèle de Données (Relations de la SAE)

Ce projet respecte religieusement toutes les contraintes de base de données exigées par votre projet SAE :

### 🔗 Relation One-to-One

- **`User` ↔ `MemberProfile`**
- **Cardinalités :** `User (1,1) ── (1,1) MemberProfile` (Un utilisateur possède un profil unique, le profil appartient à un seul utilisateur).
- Géré par `@HasOne` et `@BelongsTo`.
- Chaque adhérent n'a qu'un et _un seul_ profil détaillé physique (adresse, numéro).

### 🔗 Relation One-to-Many

- **`Category` ↔ `Book`**
- **Cardinalités :** `Category (0,n) ── (1,1) Book` (Une catégorie contient de 0 à _n_ livres, un livre n'a qu'une seule catégorie).
- Géré par `@HasMany` et `@BelongsTo`.
- Une catégorie regroupe de nombreux livres. Mais un livre n'appartient qu'à une seule catégorie.
- **Même principe pour : `Book` ↔ `Loan`, `User` ↔ `Loan`, `Book` ↔ `Reservation` et `User` ↔ `Reservation`** (Un membre réalise plusieurs emprunts ou réservations).

### 🔗 Relation Many-to-Many

- **`Book` ↔ `Author`**
- **Cardinalités :** `Book (1,n) ── (1,n) Author` (Un livre a au moins un à _n_ auteurs, un auteur participe à au moins un à _n_ livres).
- Géré par `BelongsToMany` en passant par une table intermédiaire.
- Un livre peut avoir été co-écrit par de multiples auteurs. Inversement, un auteur écrit plusieurs livres. Lors de la structuration, nous utilisons une table de jointure explicite : `book_authors`.

---

## 5) Lancement et Installation de l'Outil

### Étape 1 : Démarrer le Serveur et la DB (Via Docker)

Ouvrez le dossier principal du projet à l'endroit où se situe le document `docker-compose.yml`. Assurez-vous d'avoir lancé le service Docker.

```bash
docker compose up --build
```

**Ce qui se passe :**
Docker va télécharger Node (pour le Backend), MySQL (pour la DB), paramétrer ce petit monde dans un espace fermé transparent appelé conteneur, et charger le code de `seed.sql` dans la DB.
Votre API répondra instantanément aux requêtes sur : `http://localhost:3000`.

### Étape 2 : Lancer le Frontend (React)

Vous avez deux façons de lancer le frontend selon vos besoins :

#### A) Mode Développement (Vite)

Idéal pour modifier le code en temps réel. Ouvrez le terminal dans le sous-dossier `library-frontend` :

```bash
cd library-frontend
npm install
npm run dev
```

Accessible sur : `http://localhost:5173`.

#### B) Mode Production (Docker + Nginx)

C'est la méthode la plus robuste. Le frontend est compilé et servi par un serveur **Nginx** haute performance à l'intérieur d'un conteneur Docker.

```bash
# Depuis la racine du projet (là où est le docker-compose.yml)
docker compose up --build frontend
```

Accessible sur : `http://localhost:80` (Le port standard du web).

**Pourquoi Nginx ?**
Dans ce mode, Nginx remplace le serveur de développement de Vite. Il est configuré (via `nginx.conf`) pour :

1. **Servir les fichiers statiques** très rapidement.
2. **Gérer le routage SPA** : il redirige toutes les requêtes vers `index.html` pour que React puisse gérer les routes sans erreurs 404.
3. **Optimiser les performances** avec la compression Gzip.

### Étape 3 : Lancer les Tests Automatisés (Jest)

Le projet inclut une suite de tests pour garantir la qualité du code. 

**Installation de l'environnement de test :**
```bash
npm install --save-dev @nestjs/testing jest ts-jest @types/jest supertest
```

**Exécution des tests :**
```bash
# Lancer les tests unitaires
npm test

# Lancer les tests de bout en bout (E2E)
npm run test:e2e
```

Les tests unitaires vérifient la logique des services, tandis que les tests E2E simulent des scénarios d'utilisation réels (création de livre, emprunt, etc.).

---

## 6) Utiliser efficacement Swagger et Postman

Nous avons inclus des décorateurs pointus (`@ApiProperty`) sur nos liaisons afin que Swagger et Postman reconnaissent avec exactitude la nature structurelle complexe de vos données :

### Utilisation de la visionneuse Swagger Route

Sans aucune installation, ouvrez votre lien vers l'API suivi de `/docs` dans votre navigateur principal tant que Docker est allumé (Ex: `http://localhost:3000/docs`). Un superbe portail UI exposera pour un autre dev toutes vos routes et affichera des champs pour écrire les valeurs d'API pour jouer avec.

### L'import de l'architecture dans Postman

1. Repérez dans le dossier racine de votre code le document **`openapi.json`**.
2. Lancez **Postman**.
3. Dans Postman, cliquez sur _Import_ en haut du menu, et sélectionnez / glissez ce fichier.
4. Cela génère l'ensemble des routes configurées du serveur dans une collection, contenant des modèles pré-formatés, épargnant d'insupportables minutes à taper les URL et les variables manuellement.

_(En coulisses: C'est le petit script magique `npm run export-openapi` défini dans `export-openapi.ts` qui a réinterprété les éléments et types stricts du Cœur NestJS en un format générique normalisé JSON que tout client d'API tiers comme Postman sait lire !)_

---

## 7) Conformité Technique (Critères de la SAE)

Ce projet a été conçu en respectant les standards de développement professionnel demandés :

- **Structuration modulaire** : Utilisation de NestJS pour séparer les fonctionnalités (Livres, Membres, Emprunts) en modules indépendants et réutilisables.
- **Architecture Contrôleur/Service** : Séparation stricte entre la réception des requêtes (Controllers) et la logique métier (Services).
- **Documentation API** : Intégration complète de **Swagger** (OpenAPI) pour documenter et tester les points de terminaison en temps réel.
- **Tests automatisés** : Mise en place de tests unitaires avec **Jest** pour garantir la robustesse du code.
- **Gestion de versions** : Utilisation rigoureuse de **Git** avec des messages de commit clairs pour assurer le suivi du développement.
- **Conteneurisation** : Déploiement simplifié et environnement identique via **Docker** et **Docker Compose**.

---

## 8) Explication chronologique des dernières révisions majeures !

Durant son élaboration tardive pour clôturer l'énoncé de la SAE, ce projet a opéré diverses avancées capitales justifiant sa solidité :

- **Intégration d'un Front-end Dédié et Moderne** : Le Front-end Vite avec React a été inclus pour remplacer des concepts d'anciennes templates pour se lier sur une structure d'envoi strict de requêtes dynamiques SPA via du JSON plutôt qu'un rafraichissement lourd de page de navigations.
- **Gestion des Book Covers (Image sur l'interface Front)** : Changement de code complexe pour permettre d'exhiber une donnée non-SQL basique (un visuel). Modification pour accepter dynamiquement un champ HTTP Text (`coverUrl`) sur le Back que le composant `Book` du Front gère sans broncher.
- **Corrections des fuites circulaires TS OpenAPI** : Reprise totale des modèles du Sequelize (Users, Authors, Books...) afin d'injecter des éléments pointus de décorateurs Swagger au sein des liaisons imbriquées One to Many (évitant que tout le flux Swagger n'ait la phobie de lire ces structures interdites du langage TypeScript).

---

## 8) Flux de Fonctionnement Global (Architecture End-to-End)

Cette section décrit précisément comment les trois couches du projet communiquent entre elles, de l'action utilisateur jusqu'à la base de données.

### Schéma du flux

```
Utilisateur
    │
    │  (interagit avec l'interface)
    ▼
┌─────────────────────────────────┐
│   Frontend React (port 5173)    │
│   library-frontend/src/         │
│   - App.tsx, views/, components/│
└────────────────┬────────────────┘
                 │
                 │  Requêtes HTTP (GET, POST, PUT, DELETE)
                 │  via Axios → http://localhost:3000
                 │
                 ▼
┌─────────────────────────────────┐
│   API NestJS (port 3000)        │
│   src/                          │
│   - Controllers : routing HTTP  │
│   - Services : logique métier   │
│   - Guards JWT : sécurité auth  │
└────────────────┬────────────────┘
                 │
                 │  Requêtes SQL via Sequelize ORM
                 │
                 ▼
┌─────────────────────────────────┐
│   MySQL 8.0 (port 3306)         │
│   Base : library_db             │
│   Tables : users, books,        │
│   authors, loans, categories,   │
│   member_profiles, book_authors │
└─────────────────────────────────┘
```

### Détail des étapes

**1. L'utilisateur interagit avec le Frontend React**

Le frontend (React + Vite, port `5173`) présente les vues : liste des livres, emprunts, utilisateurs, auteurs, etc. Chaque action (clic sur "Ajouter", "Supprimer", "Connexion"…) déclenche une fonction dans une vue (`BooksView.tsx`, `LoansView.tsx`…).

**2. React envoie une requête HTTP via Axios**

Le fichier `library-frontend/src/api/index.ts` configure une instance Axios pointant vers `http://localhost:3000`. Toutes les requêtes (avec le token JWT dans les headers pour les routes protégées) sont envoyées vers l'API NestJS.

```typescript
// library-frontend/src/api/index.ts
axios.defaults.baseURL = "http://localhost:3000";
axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
```

**3. L'API NestJS traite la logique métier**

Chaque module (`books`, `loans`, `users`…) suit la structure NestJS :

- Le **Controller** reçoit la requête HTTP et délègue au Service.
- Le **Service** contient la logique (vérification stock, calcul dates, règles métier).
- Le **Guard JWT** (`JwtAuthGuard`) protège les routes qui nécessitent une authentification.

**4. Sequelize échange avec MySQL**

Le Service appelle les modèles Sequelize (`Book.findAll()`, `Loan.create()`…). Sequelize traduit ces appels en requêtes SQL et les envoie à MySQL. Le résultat remonte en sens inverse jusqu'à l'interface React.

### Exemple concret : Créer un emprunt

```
[Clic "Emprunter" dans LoansView.tsx]
        │
        ▼
axios.post('/loans', { userId, bookId, dueDate })
        │
        ▼
LoansController → @Post() → loansService.create(dto)
        │
        ▼
loansService → vérifie stock du livre (booksService)
             → Loan.create({ userId, bookId, dueDate })
             → Book.decrement('stock', { where: { id: bookId } })
        │
        ▼
MySQL ← INSERT INTO loans ... / UPDATE books SET stock = stock - 1
        │
        ▼
Réponse JSON 201 → React met à jour l'affichage
```

**Oui, cette architecture est entièrement implémentée dans ce projet.** Le frontend React, l'API NestJS et la base MySQL sont chacun conteneurisés via Docker Compose et communiquent exactement selon ce schéma.

---
