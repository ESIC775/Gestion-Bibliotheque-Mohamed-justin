# Application Full-Stack de Gestion de Bibliothèque — SAE DDAW

Ce projet est une application complète (Frontend et Backend) conçue pour répondre aux critères de la SAE « Développement & Déploiement d’une Application Web RESTful Conteneurisée ». Il permet la gestion centralisée d'une bibliothèque : adhérents, livres, emprunts, auteurs, membres, etc.

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

La hiérarchie a été pensée de manière logique, séparant formellement le Frontend du Backend. Le grand avantage de ce clivage est de comprendre qu'on a *deux applications distinctes qui communiquent entre elles*.

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
- **Un Controller (`x.controller.ts`)** : Il ne s'occupe *que* d'écouter les routes HTTP (ex: `GET /books`).
- **Un Service (`x.service.ts`)** : Il concentre toute l'intelligence algorithmique et la modification base de données.
- **Des Modèles (`x.model.ts`)** : Les schémas de vos tables MySQL Sequelize avec toutes leurs relations.
- **Des DTO (`/dto`)** : Data Transfer Object définissant strictement les JSON que l'utilisateur a le droit d'envoyer pour la création ou l'update de l'entité.

---

## 4) Le Modèle de Données (Relations de la SAE)

Ce projet respecte religieusement toutes les contraintes de base de données exigées par votre projet SAE :

### 🔗 Relation One-to-One
- **`User` ↔ `MemberProfile`**
- **Cardinalités :** `User (1,1) ── (1,1) MemberProfile` (Un utilisateur possède un profil unique, le profil appartient à un seul utilisateur).
- Géré par `@HasOne` et `@BelongsTo`.
- Chaque adhérent n'a qu'un et *un seul* profil détaillé physique (adresse, numéro). 

### 🔗 Relation One-to-Many
- **`Category` ↔ `Book`**
- **Cardinalités :** `Category (0,n) ── (1,1) Book` (Une catégorie contient de 0 à *n* livres, un livre n'a qu'une seule catégorie).
- Géré par `@HasMany` et `@BelongsTo`.
- Une catégorie regroupe de nombreux livres. Mais un livre n'appartient qu'à une seule catégorie.
- **Même principe pour : `Book` ↔ `Loan` et `User` ↔ `Loan`** (Un profil réalise plusieurs emprunts divers).

### 🔗 Relation Many-to-Many
- **`Book` ↔ `Author`**
- **Cardinalités :** `Book (1,n) ── (1,n) Author` (Un livre a au moins un à *n* auteurs, un auteur participe à au moins un à *n* livres).
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

### Étape 2 : Démarrer le Frontend (React)
Ouvrez spécifiquement le terminal dans le sous-dossier `library-frontend`.
```bash
cd library-frontend
npm install           # Uniquement fonctionnel la première fois, ou en cas de crash
npm run dev
```
Ouvrez votre navigateur au lien généré (En général `http://localhost:5173`). L'interface sera prête à communiquer avec le port 3000 généré à l'étape une, via Axios. 

---

## 6) Utiliser efficacement Swagger et Postman

Nous avons inclus des décorateurs pointus (`@ApiProperty`) sur nos liaisons afin que Swagger et Postman reconnaissent avec exactitude la nature structurelle complexe de vos données :

### Utilisation de la visionneuse Swagger Route
Sans aucune installation, ouvrez votre lien vers l'API suivi de `/docs` dans votre navigateur principal tant que Docker est allumé (Ex: `http://localhost:3000/docs`). Un superbe portail UI exposera pour un autre dev toutes vos routes et affichera des champs pour écrire les valeurs d'API pour jouer avec.

### L'import de l'architecture dans Postman
1. Repérez dans le dossier racine de votre code le document **`openapi.json`**.
2. Lancez **Postman**.
3. Dans Postman, cliquez sur *Import* en haut du menu, et sélectionnez / glissez ce fichier.
4. Cela génère l'ensemble des routes configurées du serveur dans une collection, contenant des modèles pré-formatés, épargnant d'insupportables minutes à taper les URL et les variables manuellement.

*(En coulisses: C'est le petit script magique `npm run export-openapi` défini dans `export-openapi.ts` qui a réinterprété les éléments et types stricts du Cœur NestJS en un format générique normalisé JSON que tout client d'API tiers comme Postman sait lire !)*

---

## 7) Explication chronologique des dernières révisions majeures !

Durant son élaboration tardive pour clôturer l'énoncé de la SAE, ce projet a opéré diverses avancées capitales justifiant sa solidité :
- **Intégration d'un Front-end Dédié et Moderne** : Le Front-end Vite avec React a été inclus pour remplacer des concepts d'anciennes templates pour se lier sur une structure d'envoi strict de requêtes dynamiques SPA via du JSON plutôt qu'un rafraichissement lourd de page de navigations.
- **Gestion des Book Covers (Image sur l'interface Front)** : Changement de code complexe pour permettre d'exhiber une donnée non-SQL basique (un visuel). Modification pour accepter dynamiquement un champ HTTP Text (`coverUrl`) sur le Back que le composant `Book` du Front gère sans broncher.
- **Corrections des fuites circulaires TS OpenAPI** : Reprise totale des modèles du Sequelize (Users, Authors, Books...) afin d'injecter des éléments pointus de décorateurs Swagger au sein des liaisons imbriquées One to Many (évitant que tout le flux Swagger n'ait la phobie de lire ces structures interdites du langage TypeScript).

---

## 8) 🎤 Conseils Stratégiques pour l'Oral de Soutenance

Pour impressionner l'auditoire (les examinateurs) et obtenir la plus haute note en moins de 15 minutes :

- **Attaquer avec le Visuel** : Débutez sur React / Front. On navigue sur `localhost:5173` sans accroc, et vous passez en revue livres et membres : "Le but de mon application c'est de gérer ceci : voici mon interface".
- **Expliquer l'écosystème transparent Backend** : Affichez avec fierté la commande `docker compose up`. Expliquez ce miracle : *"L'application et ma base SQL se lancent seuls grâce aux conteneurs, le code Sequelize fabrique les tables et le Seed remplit 100% de notre DB de façon agnostique, tout ça a pris cinq secondes"*.
- **Le Morceau Postman** : Ouvrez Swagger, ou Postman. Vous annoncez fièrement : *"Mon back n'est pas scellé au front : Voici mon contrat d'API Swagger en route, je fais un import Postman de mon OpenAPI et de manière indépendante, j'envoie une grosse requête POST (Livres/User)"*. Vous prouverez que le JSON formaté du Back-Nest est propre et protégé.
- **La Validation d'Entrée** : Sur Postman, volontairement, envoyez une erreur critique (créer un livre sans Titre !). Montrez l'erreur HTTP 400 ! Expliquez que dans votre architecture, les objets "DTO" NestJS et `class-validator` stoppent la requête avant qu'elle contamine toute la logique métier. 
- **Vocabulaire important** : "Découplage" (SQL vs Code vs Front), "Data Transfer Object (DTO)" (Validation des JSON entrant), "Relations Sequelize ORM" (Écriture de liaisons TS sans écrire de longues requêtes SQL basiques sujettes aux failles).
