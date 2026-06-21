# Projet concret — SpotTrail

## Objectif global

Créer une petite application complète permettant d’enregistrer, consulter et gérer des points d’intérêt géographiques lors de balades.

L’objectif est de sortir des katas tout en réutilisant ce qui a été travaillé avec Bun + TypeScript dans un vrai projet concret.

Le projet doit permettre de pratiquer :

- la création d’un serveur HTTP avec Bun ;
- la gestion de routes ;
- les méthodes HTTP `GET`, `POST`, `PATCH`, `DELETE` ;
- la lecture de query params et de paramètres d’URL ;
- la lecture et la validation de JSON ;
- les types TypeScript ;
- les unions discriminées ;
- le narrowing TypeScript ;
- la gestion propre des erreurs ;
- la séparation entre logique métier et réponses HTTP ;
- la persistance en base de données ;
- la création d’un frontend ;
- l’utilisation d’une carte interactive ;
- la géolocalisation navigateur.

L’application finale doit permettre de :

- afficher une carte ;
- se géolocaliser ;
- ajouter un point d’intérêt ;
- donner un titre, une description et une catégorie au point ;
- sauvegarder les points ;
- afficher les points existants ;
- consulter le détail d’un point ;
- modifier un point ;
- supprimer un point ;
- filtrer les points par catégorie ;
- utiliser l’application depuis un téléphone via le navigateur.

Le but n’est pas de créer une application parfaite immédiatement.

Le but est de construire un vrai projet utilisable étape par étape, en gardant une progression simple et maîtrisée.

---

## Stack recommandée

### Backend

- Bun
- TypeScript
- API HTTP simple avec `Bun.serve`
- Validation manuelle au début
- SQLite dans un second temps

### Frontend

- Vite
- React
- TypeScript
- Leaflet pour la carte

### Base de données

- Stockage en mémoire au départ
- SQLite ensuite
- PostgreSQL seulement plus tard si le projet évolue vraiment

---

## Principe général

Le projet doit être construit par étapes courtes.

Chaque étape doit produire quelque chose qui fonctionne réellement avant de passer à la suivante.

Il faut éviter de commencer directement par :

- une architecture trop complexe ;
- une authentification ;
- une application mobile native ;
- un mode hors ligne complet ;
- un système de partage ;
- un upload de photos ;
- une grosse structure de projet.

Le projet doit commencer simple, puis évoluer progressivement.

---

# Étapes du projet

## Étape 1 — Backend minimal

### Objectif

Créer une API Bun + TypeScript minimale.

### Routes attendues

    GET /health
    GET /spots

### Comportement attendu

`GET /health` doit retourner :

    { "ok": true }

`GET /spots` doit retourner une liste de points d’intérêt.

Au départ, les points peuvent être stockés dans un simple tableau en mémoire.

### Critères de validation

- Le serveur démarre correctement.
- `GET /health` répond avec un statut 200.
- `GET /spots` répond avec un statut 200.
- Les routes inconnues renvoient une 404.
- Le code reste simple et lisible.

---

## Étape 2 — Modèle de données

### Objectif

Définir le type principal de l’application.

### Type attendu

    type Spot = {
      id: string
      title: string
      description: string | null
      category: "viewpoint" | "danger" | "water" | "parking" | "other"
      latitude: number
      longitude: number
      createdAt: string
    }

### Critères de validation

- Le type `Spot` est utilisé dans le code.
- Les données retournées par `GET /spots` respectent ce type.
- Les catégories sont limitées à une liste claire.
- Les coordonnées sont représentées par des nombres.

---

## Étape 3 — Création d’un point

### Objectif

Ajouter une route permettant de créer un nouveau point d’intérêt.

### Route attendue

    POST /spots

### Body attendu

    {
      "title": "Belle vue",
      "description": "Point de vue sur la vallée",
      "category": "viewpoint",
      "latitude": 48.8566,
      "longitude": 2.3522
    }

### Comportement attendu

Si le body est valide :

- créer un nouveau point ;
- générer un `id` ;
- générer une date de création ;
- ajouter le point au tableau en mémoire ;
- retourner le point créé avec un statut 201.

Si le body est invalide :

- retourner une erreur claire avec un statut 400.

### Critères de validation

- `POST /spots` accepte un JSON valide.
- `POST /spots` refuse un body invalide.
- Les erreurs sont gérées proprement.
- Le point créé apparaît ensuite dans `GET /spots`.

---

## Étape 4 — Validation typée du body

### Objectif

Mettre en place une validation propre du JSON reçu.

### Types attendus

    type CreateSpotInput = {
      title: string
      description: string | null
      category: "viewpoint" | "danger" | "water" | "parking" | "other"
      latitude: number
      longitude: number
    }

    type CreateSpotError =
      | "invalid_body"
      | "missing_title"
      | "invalid_title"
      | "invalid_description"
      | "invalid_category"
      | "invalid_latitude"
      | "invalid_longitude"

    type CreateSpotResult =
      | { ok: true; value: CreateSpotInput }
      | { ok: false; error: CreateSpotError }

### Fonction attendue

    function validateCreateSpotBody(body: unknown): CreateSpotResult

### Critères de validation

- Le body est traité comme `unknown` au départ.
- Le code vérifie que le body est bien un objet.
- Le titre est obligatoire.
- Le titre doit être une chaîne de caractères non vide.
- La description peut être une chaîne ou `null`.
- La catégorie doit faire partie des catégories autorisées.
- La latitude doit être un nombre.
- La longitude doit être un nombre.
- Les erreurs sont typées avec une union.
- Le serveur utilise le narrowing TypeScript avant d’accéder aux valeurs validées.

---

## Étape 5 — Rendu des erreurs

### Objectif

Séparer la validation de la réponse HTTP.

### Fonction attendue

    function renderCreateSpotError(error: CreateSpotError): Response

### Exemples de messages

    missing_title      -> Missing title
    invalid_title      -> Invalid title
    invalid_category   -> Invalid category
    invalid_latitude   -> Invalid latitude
    invalid_longitude  -> Invalid longitude

### Critères de validation

- La fonction de validation ne crée pas directement de `Response`.
- La fonction de rendu transforme une erreur métier en réponse HTTP.
- Le code de la route reste lisible.
- Le switch pourra être rendu exhaustif plus tard.

---

## Étape 6 — Récupérer un point par id

### Objectif

Ajouter une route permettant de consulter un point précis.

### Route attendue

    GET /spots/:id

### Comportement attendu

Si le point existe :

- retourner le point avec un statut 200.

Si le point n’existe pas :

- retourner une erreur 404.

### Critères de validation

- L’id est extrait depuis l’URL.
- Un point existant est retrouvé correctement.
- Un id inconnu renvoie une 404.
- Le comportement est testé avec `curl` ou un client HTTP.

---

## Étape 7 — Supprimer un point

### Objectif

Ajouter une route permettant de supprimer un point.

### Route attendue

    DELETE /spots/:id

### Comportement attendu

Si le point existe :

- le supprimer ;
- retourner une réponse de succès.

Si le point n’existe pas :

- retourner une 404.

### Critères de validation

- Un point supprimé disparaît de `GET /spots`.
- Supprimer un id inconnu renvoie une 404.
- Les méthodes non autorisées sont correctement refusées.

---

## Étape 8 — Persistance avec SQLite

### Objectif

Remplacer le tableau en mémoire par une vraie base de données SQLite.

### Table attendue

    CREATE TABLE spots (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      category TEXT NOT NULL,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL,
      created_at TEXT NOT NULL
    );

### Critères de validation

- Les points restent disponibles après redémarrage du serveur.
- `GET /spots` lit depuis SQLite.
- `POST /spots` écrit dans SQLite.
- `GET /spots/:id` lit un point depuis SQLite.
- `DELETE /spots/:id` supprime un point en base.

---

## Étape 9 — Frontend minimal sans carte

### Objectif

Créer une première interface React simple pour consommer l’API.

### Fonctionnalités attendues

- Afficher la liste des points.
- Ajouter un point via un formulaire.
- Afficher les erreurs de validation.
- Supprimer un point.

### Critères de validation

- Le frontend appelle réellement l’API.
- Les points s’affichent dans une liste.
- Le formulaire permet de créer un point.
- Les erreurs backend sont visibles côté interface.
- La suppression fonctionne.

---

## Étape 10 — Affichage sur une carte

### Objectif

Ajouter une carte avec Leaflet.

### Fonctionnalités attendues

- Afficher une carte.
- Afficher les points sous forme de marqueurs.
- Cliquer sur un marqueur pour voir le titre et la description.
- Garder la liste des points en complément.

### Critères de validation

- La carte s’affiche correctement.
- Les coordonnées des points sont utilisées.
- Chaque point apparaît au bon endroit.
- Les marqueurs se mettent à jour après création ou suppression.

---

## Étape 11 — Géolocalisation navigateur

### Objectif

Permettre à l’utilisateur d’ajouter un point à sa position actuelle.

### Fonctionnalités attendues

- Bouton `Me localiser`.
- Récupération de la latitude et de la longitude via le navigateur.
- Préremplissage du formulaire avec les coordonnées.
- Gestion du refus de permission.

### Critères de validation

- La géolocalisation fonctionne sur téléphone.
- Le refus de permission est géré proprement.
- Les coordonnées récupérées sont bien envoyées au backend.
- Le point apparaît sur la carte.

---

## Étape 12 — Filtres et recherche

### Objectif

Améliorer l’utilisation de l’application.

### Fonctionnalités attendues

- Filtrer les points par catégorie.
- Rechercher par titre.
- Afficher uniquement certains types de points.

### Critères de validation

- Le filtre catégorie fonctionne.
- La recherche par texte fonctionne.
- Les filtres ne cassent pas l’affichage de la carte.
- L’interface reste simple.

---

## Étape 13 — Modification d’un point

### Objectif

Permettre de modifier un point existant.

### Route attendue

    PATCH /spots/:id

### Fonctionnalités attendues

- Modifier le titre.
- Modifier la description.
- Modifier la catégorie.
- Modifier éventuellement les coordonnées.

### Critères de validation

- Le backend valide les données modifiées.
- Le frontend permet d’éditer un point.
- Les modifications sont persistées.
- Les erreurs sont gérées proprement.

---

## Étape 14 — Améliorations possibles

Ces fonctionnalités ne doivent pas être faites au début.

Elles peuvent être ajoutées seulement quand le MVP fonctionne déjà.

### Idées d’évolution

- Authentification utilisateur.
- Points privés et publics.
- Upload de photos.
- Partage d’une carte.
- Export GPX ou KML.
- Mode hors ligne.
- Installation comme PWA.
- Déploiement public.
- Tests automatisés.
- Documentation API.

---

# MVP à atteindre en premier

La première version réussie doit contenir :

- une API Bun + TypeScript ;
- une base SQLite ;
- les routes suivantes :
  - `GET /spots`
  - `POST /spots`
  - `GET /spots/:id`
  - `DELETE /spots/:id`
- une validation propre des entrées ;
- une interface React simple ;
- une carte Leaflet ;
- l’affichage des points sur la carte ;
- l’ajout d’un point depuis un formulaire ;
- la suppression d’un point.

---

# Règle importante

Ne pas chercher à tout faire d’un coup.

À chaque étape :

1. faire fonctionner la fonctionnalité ;
2. tester manuellement ;
3. nettoyer un peu le code ;
4. passer seulement ensuite à l’étape suivante.

Le but est de construire un vrai projet utilisable, tout en consolidant les bases TypeScript, HTTP, validation, backend et frontend.