# CLAUDE.md — EPS Manager V2

> Instructions de travail pour Claude Code sur `Ambroise-pro/carnetEPS`.
> **Document de planification : aucune modification du dépôt n'est autorisée par la simple lecture de ce fichier.**

## 1. Mission

Faire évoluer EPS Manager en carnet de bord pédagogique d'EPS, prioritairement utilisable sur tablette, tout en conservant **toutes** les fonctionnalités, données et modules existants. Livrer progressivement : tableau de bord, mode terrain, fiche élève enrichie, sauvegardes robustes, SDK v2, progression, compétences, groupes dynamiques, bibliothèque pédagogique, exports et bilans.

### Contraintes impératives

- **Ne jamais réécrire l'application de zéro.** Procéder par petits changements testables.
- **Ne supprimer aucune fonctionnalité existante** et ne modifier aucun comportement sans test et justification.
- **Local-first, sans backend ni compte** : IndexedDB comme stockage principal, `localStorage` seulement pour les petits échanges ou préférences compatibles avec l'existant.
- **HTML/CSS/JavaScript natifs, sans build obligatoire** ; aucun framework imposé. Conserver la compatibilité avec l'hébergement statique (GitHub Pages ou équivalent) et le service worker.
- **Un seul appareil est la source de vérité** ; ne pas promettre de synchronisation multi-appareils. Prévoir des sauvegardes externes explicites.
- **Données d'élèves sensibles** : aucune transmission à un service distant, télémétrie ou dépendance externe sans validation préalable. Utiliser des données fictives dans les tests.
- **SDK v1 maintenu** : ne pas casser les modules déjà installés.
- **Travailler directement sur `main`** (décision de l'utilisateur du 19/11/2026) : petits commits testables et poussés sur `main`, sans branche ni PR sauf demande explicite. Incrémenter `APP_VERSION` (app.js) et `VERSION` (sw.js) à chaque livraison.
- Ne jamais effectuer de suppression destructive, migration irréversible ou restauration écrasante sans sauvegarde préalable et confirmation.

## 2. État du dépôt vérifié au 19 novembre 2026

- Branche par défaut : `main`.
- `index.html` : shell, barre latérale, barre supérieure, recherche et point de montage `#view`.
- `app.js` : version `APP_VERSION=25`, navigation, données, vues, gestion des années, classes, élèves, groupes, cycles, séances, appel, inaptitudes, évaluations, moyennes, appréciations, observations, applications, tableaux et sauvegardes.
- `style.css` : styles principaux ; `board/board.js`, `board/host.js`, `board/board.css`, `board/host.css` : tableaux.
- `sw.js` : `VERSION=25`, cache `eps-v25`, stratégie réseau d'abord puis cache hors ligne ; précacher le shell.
- Base `indexedDB.open('eps-manager',5)` ; magasins actuels : `years`, `classes`, `students`, `groups`, `cycles`, `sessions`, `attendance`, `restrictions`, `grades`, `comments`, `observations`, `holidays`, `timetable`, `settings`, `results`, `boards`.
- `modules/modules.json` : `demi-fond`, `coeval`, `evaluations`, `conquete-laser`, `poules-tournantes`.
- `modules/poules-tournantes/` : copie de la branche **`main`** du dépôt `Ambroise-pro/poulestournante` (intégration EPS Manager propre à l'application, non modifiée ; seules les bibliothèques en CDN sont remplacées par des copies locales). Voir son `README-EPS.md` pour la mise à jour.
- `modules/README.md` et `modules/sdk/README.md` décrivent le protocole actuel.
- `modules/sdk/eps-sdk.js` (SDK 1.0), `modules/sdk/eps-adapter.js` : contexte via `localStorage` et outbox ; `beforeOpen`, `refresh`, `collect`.
- `modules/evaluations/eval.js`, `modules/evaluations/eps-adapter.js`, `modules/coeval/eps-adapter.js`, `modules/demi-fond/eps-adapter.js` sont des points d'intégration existants.
- La sauvegarde actuelle dans `renderBackup()` couvre déjà des données de l'application et des modules ; l'étendre, ne pas la remplacer aveuglément.
- La synchronisation des modules peut se produire à l'ouverture, à la fermeture, sur action manuelle et périodiquement ; préserver ces comportements.

Fonctions déjà demandées par l'utilisateur qui communiquent avec l'extérieur (à conserver, désactivées par défaut ou sans données d'élèves) :
- génération d'appréciations par Gemini (v23) : active seulement si une clé est saisie ; nom, prénom et besoins particuliers jamais envoyés, observations seulement sur option ;
- relais `api/ical.js` (Vercel) pour l'emploi du temps PRONOTE : aucun lien iCal ni jeton ne doit être enregistré dans le dépôt ;
- envoi de la clé de secours du verrouillage par lien `mailto:`.
- application associée Conquête (`modules/conquete-laser/`, dépôt `Ambroise-pro/conquete-laser`, ajoutée le 19/11/2026) : jeu en ligne ; les prénoms des élèves présents (initiale du nom en cas d'homonyme) sont envoyés au serveur de jeu (`server` de son `eps-module.json`, Vercel/Firebase) à la création d'une partie. Dossier produit par `npm run build:eps` dans son dépôt : ne pas le modifier à la main, sauf `eps-module.json`.

**Avant chaque phase, relire le dépôt réel.** Les noms de fonctions, versions et chemins peuvent avoir changé depuis ce constat. Ne jamais présumer qu'un fichier proposé ci-dessous existe déjà.

## 3. Démarrage obligatoire de chaque tâche Claude Code

1. Lire `CLAUDE.md`, `README` et les fichiers concernés ; inspecter `git status`, branche, historique récent et manifestes de modules.
2. Établir un inventaire précis des comportements actuels et des données affectées.
3. Présenter un plan limité à une fonctionnalité ou une migration, avec fichiers à modifier, risques, tests et critères d'acceptation.
4. Attendre l'accord avant toute modification si la tâche initiale est une analyse ou une planification.
5. Travailler sur `main`, sans toucher aux données réelles.
6. Implémenter le changement minimal ; ne pas mélanger refactorisation et nouvelle fonctionnalité dans la même PR si évitable.
7. Exécuter les tests, vérifier le hors ligne, les données existantes, les modules v1 et les tailles tablette/mobile.
8. Fournir un compte rendu : fichiers changés, migrations, tests passés/échoués, limites, procédures de retour arrière.

## 4. Architecture cible progressive

```text
/
├── index.html                  # Shell existant
├── app.js                      # Point d'entrée et compatibilité, progressivement allégé
├── style.css                   # Styles existants
├── sw.js                       # Cache et cycle de mises à jour
├── core/                       # À créer progressivement
│   ├── db.js                   # Transactions, repositories et schémas
│   ├── migrations.js           # Migrations versionnées
│   ├── backup.js               # Export/restauration/intégrité
│   ├── events.js               # Bus d'événements interne
│   ├── router.js               # Navigation
│   └── modules-host.js         # Hôte SDK v1/v2
├── features/                   # À créer au fur et à mesure
│   ├── dashboard/
│   ├── terrain/
│   ├── students/
│   ├── groups/
│   ├── evaluations/
│   ├── progression/
│   ├── library/
│   └── reports/
├── components/                 # Contrôles réutilisables, accessibles
├── board/                      # À préserver
├── modules/                    # Applications indépendantes
│   ├── sdk/
│   ├── demi-fond/
│   ├── coeval/
│   └── evaluations/
└── tests/                      # Tests unitaires, intégration, migrations, E2E
```

Cette arborescence est **une cible**, pas une instruction de déplacer tous les fichiers immédiatement. Préférer les modules ES natifs. Éviter les dépendances inutiles, les imports circulaires et les duplications de logique. Les modules externes restent autonomes lorsqu'ils sont ouverts hors d'EPS Manager.

### Règles de conception

- `core/db.js` : accès centralisé, transactions atomiques et validation ; aucune vue ne manipule directement les magasins après migration de son domaine.
- Les fonctionnalités exposent des services métiers distincts des composants d'interface.
- Les identifiants d'élèves, classes, séances et modules restent stables ; jamais de liaison par simple nom/prénom.
- Ne pas confondre « absent », « inapte », « non évalué » et « résultat zéro ».
- Les calculs de moyennes et de progression sont testés avec valeurs manquantes et règles de pondération explicites.
- Toutes les nouvelles interactions fonctionnent au clavier et au tactile ; cibles tactiles confortables, contraste suffisant, focus visible, dialogues accessibles.
- Les actions de modification doivent afficher une confirmation ou un retour clair, avec prévention des doubles soumissions.
- Chaque évolution du shell nécessite la mise à jour cohérente de `APP_VERSION`, `sw.js`, des ressources précachées et de la stratégie d'activation ; ne pas supprimer les caches nécessaires à une version encore active sans stratégie de mise à jour.
- Après toute modification de `modules/` ou `vendor/` (ajout ou mise à jour d'une application associée), relancer `node tools/offline-list.mjs` pour mettre à jour `offline.json` (cache hors ligne durable `eps-files`). Lancer les tests : `node --test --test-concurrency=1 tests/e2e/*.test.mjs`.

## 5. Phases de livraison et dépendances

### Phase 0 — Socle, tests, migrations et sauvegardes (4–6 jours indicatifs)

**Objectif :** rendre les évolutions sûres avant d'ajouter des fonctions.

Travaux :
- Documenter les structures existantes et les formats d'export actuels.
- Créer un jeu de données fictif couvrant élèves, photos, absences, inaptitudes, notes, séances, groupes, tableaux et modules.
- Ajouter des tests de non-régression et un test de restauration complète.
- Extraire progressivement `core/db.js` et `core/migrations.js` sans changer les signatures utilisées par les vues.
- Étendre la sauvegarde actuelle : manifeste de version, inventaire des magasins, checksums, tailles, dates, état de complétude et modules inclus.
- Créer des points de restauration locaux versionnés, mais **ne jamais les présenter comme une sauvegarde externe**.
- Prévoir export vers fichier externe (File System Access API seulement si disponible, sinon téléchargement explicite), import avec aperçu, contrôle d'intégrité et restauration transactionnelle autant que possible.
- En cas de restauration multi-bases non atomique : effectuer une copie préalable, journaliser les étapes et proposer un mécanisme de reprise/rollback.
- Chiffrement des exports sensible : optionnel, fondé sur Web Crypto et dérivation de clé robuste ; pas de mot de passe stocké en clair.

Fichiers : `app.js`, `index.html`, `sw.js`, `style.css` ; nouveaux `core/db.js`, `core/migrations.js`, `core/backup.js`, `tests/` ; inspecter les mécanismes de stockage propres aux modules.

**Acceptation :** sauvegarde puis restauration sur installation de test avec comparaison du nombre d'enregistrements, identifiants, références, médias et données de modules ; sauvegarde corrompue rejetée ; anciennes données toujours lisibles.

### Phase 1 — Tableau de bord et mode terrain (6–9 jours)

**Objectif :** accès immédiat au cours et à ses actions sur tablette.

Tableau de bord : vues « Aujourd'hui », « Semaine », « À terminer » ; prochain cours, appels incomplets, évaluations en attente, inaptitudes pertinentes et séance à préparer. Les indicateurs proviennent des données réelles et leurs règles sont documentées. Ne pas introduire de fausses alertes.

Mode terrain : depuis une séance, cinq onglets `Appel`, `Élèves`, `Activités`, `Évaluation`, `Notes` ; trombinoscope, grands boutons, statut de présence, mentions complémentaires, inaptitudes, lancement d'un module avec contexte de séance, notes autosauvegardées. Retour depuis un module sans perte de contexte.

Fichiers : `app.js` (dont `renderHome()`), `index.html`, `style.css` ; nouveaux `features/dashboard/`, `features/terrain/`, `components/`.

**Acceptation :** depuis l'accueil, ouvrir le cours du jour, faire l'appel, ouvrir un module, enregistrer une note de séance, revenir ; le tout sans réseau, sur tablette portrait et paysage.

### Phase 2 — Fiche élève enrichie et groupes dynamiques (6–9 jours)

**Objectif :** vue longitudinale de l'élève et composition souple des groupes.

Fiche élève : synthèse, assiduité, restrictions, résultats sportifs, évaluations, observations, compétences, graphiques et bilans ; filtres par année, APSA et cycle. Les informations de santé sont affichées avec sobriété et uniquement lorsque pertinentes.

Groupes : aléatoire, homogène, hétérogène, équipes équilibrées, contraintes d'association/exclusion, rotation des partenaires et recomposition selon les présents. Toute proposition automatique est **validée et modifiable par l'enseignant** ; mémoriser la composition effective par séance. Fournir un algorithme déterministe à graine optionnelle pour tests reproductibles et un rapport des contraintes impossibles.

Fichiers : `app.js` (dont `renderStudent()` et groupes), `style.css`, `board/host.js` si intégration justifiée ; nouveaux `features/students/`, `features/groups/`, adaptations de `core/db.js`.

**Acceptation :** composer des groupes pour 28 élèves avec 3 absents, valider les remplacements, enregistrer les groupes et retrouver les compositions antérieures sans altérer les groupes existants.

### Phase 3 — SDK modules v2 (6–10 jours)

**Objectif :** échanges riches et fiables, avec compatibilité totale v1.

Préserver : `EPSManager.available()`, `classes()`, `students()`, `focus()`, `grade()`, `result()`, `summary()`, `remove()`, `clear()`, `pending()`, `onChange()`, et le protocole `beforeOpen`/`refresh`/`collect`, les clés stables et les formats existants.

Ajouter une API `EPSManager.v2` **additive**, versionnée, documentée et testée :

```js
const context = await EPSManager.v2.context();
const students = await EPSManager.v2.students.list({
  classId: context.classId,
  presentOnly: true
});
await EPSManager.v2.results.upsert({
  key: 'jump:session-12:student-45',
  studentId: 'student-45',
  sessionId: context.sessionId,
  metric: 'vertical_jump',
  value: 38,
  unit: 'cm'
});
const unsubscribe = EPSManager.v2.events.on('attendance.changed', payload => {
  // Actualiser la liste sans rechargement
});
```

**Ceci est une API cible, pas une API existante.** Définir explicitement les schémas, permissions, limites de taille, validation d'origine, cycle de vie, gestion des erreurs, accusés de réception, reprises et déduplication. Privilégier `postMessage`/`MessageChannel` pour les événements si l'architecture d'intégration le justifie ; contrôler strictement `origin` et source. Ne pas rendre les données de santé accessibles par défaut. Conserver `collect()` comme voie de secours compatible.

Fichiers : `modules/sdk/eps-sdk.js`, `modules/sdk/eps-adapter.js`, `modules/sdk/PROMPT.md`, `modules/sdk/README.md`, `modules/README.md`, `app.js` ; nouveau `core/modules-host.js`, exemple v2 dans `modules/exemple-sdk/` ; tests des adaptateurs `demi-fond`, `coeval`, `evaluations`.

**Acceptation :** les trois modules déclarés dans `modules/modules.json` fonctionnent toujours sans changement ; un module v2 reçoit l'appel modifié et envoie un résultat sans doublon même après reprise hors ligne.

### Phase 4 — Compétences et progression (8–12 jours)

**Objectif :** ajouter les référentiels sans casser les notes sur 20.

- Référentiels paramétrables : APSA, niveau, critères, degrés, descripteurs, coefficients, règles de conversion optionnelles.
- Saisie rapide de tous les critères sur un même écran, avec curseurs/degrés tactiles, validation et retour visuel.
- Évaluations formatives et certificatives distinguées ; historique des corrections et des dates.
- Résultats typés : mesure, unité, protocole, date, séance, tentative, source, version du protocole.
- Courbes individuelles et statistiques de classe, avec filtres et comparaison uniquement de mesures compatibles.
- Aucun calcul de note officiel inventé : les conversions sont explicitement configurées et validées.

Fichiers : `app.js`, `modules/evaluations/eval.js`, `modules/evaluations/eps-adapter.js`, `modules/coeval/eps-adapter.js` si nécessaire ; nouveaux `features/evaluations/`, `features/progression/` ; migrations.

**Acceptation :** anciennes notes inchangées ; nouvelle évaluation par degrés enregistrée, modifiée, retrouvée et affichée dans la progression, sans confondre absence et zéro.

### Phase 5 — Bibliothèque pédagogique (5–8 jours)

**Objectif :** capitaliser sur les séances et cycles déjà conçus.

- Trois niveaux : situation, séance type, cycle complet.
- Champs : APSA, niveau, objectifs, matériel, organisation, consignes, critères de réussite, variables, durée, documents éventuels.
- Recherche, filtres, duplication, import/export JSON versionné.
- Copie indépendante de la ressource lorsqu'elle est insérée dans une séance ; conserver provenance et version sans mise à jour rétroactive implicite.
- Pas de partage automatique en ligne.

Fichiers : `app.js`, `style.css`, `features/terrain/` ; nouveau `features/library/` ; migrations et schémas.

**Acceptation :** transformer une séance existante en modèle, l'utiliser dans une autre classe, modifier la copie sans changer la source.

### Phase 6 — Exports et bilans (5–8 jours)

**Objectif :** produire des documents pédagogiques exploitables, distincts des sauvegardes techniques.

- CSV UTF-8 (compatible tableurs) pour notes, moyennes, résultats et appréciations ; XLSX uniquement si une bibliothèque locale validée est intégrée.
- PDF imprimable pour bilan élève, bilan de classe, bilan de cycle, progression et séances ; privilégier les fonctionnalités navigateur si elles satisfont le besoin, sinon dépendance embarquée et auditée.
- Sélection des classes, élèves, période, APSA, champs et niveau de détail.
- Bilans avec règles de calcul explicites, source des données et indicateurs manquants.
- Génération locale d'appréciations par modèles/règles, toujours modifiables et validées par l'enseignant ; ne pas appeler d'IA externe par défaut.
- Contrôler les données personnelles incluses et proposer une prévisualisation avant export.

Fichiers : `app.js`, `style.css`, `features/evaluations/`, `features/progression/` ; nouveau `features/reports/` ; distinguer `core/backup.js` de l'export pédagogique.

**Acceptation :** produire un CSV exploitable et un bilan PDF cohérent avec les données affichées, sans exporter des informations non sélectionnées.

## 6. Contrats de données et migrations

### Principes

- Ne jamais modifier silencieusement la signification d'un champ existant.
- Ajouter des magasins ou champs de manière additive ; prévoir un adaptateur de lecture pour l'ancien format.
- Toute migration est idempotente et testée depuis **chaque version historique effectivement supportée**.
- Une migration IndexedDB se fait dans `onupgradeneeded` pour les changements de schéma ; les transformations longues doivent être planifiées hors transaction de version avec reprise sûre et état explicite.
- Ne pas incrémenter la version de la base sans raison et sans tests ; documenter chaque changement dans `core/migrations.js`.
- Ne jamais régénérer les IDs existants ni casser les références élèves/classes/séances.
- Ne pas supprimer un magasin ancien avant qu'une migration de données, une période de compatibilité et une sauvegarde vérifiée soient validées.
- Prévoir un mode lecture seule ou une erreur explicite lorsqu'une sauvegarde provient d'une version future non prise en charge.

### Nouvelles entités envisagées (noms à confirmer après audit)

- `competencyFrameworks`, `competencyAssessments` : référentiels, évaluations, critères, degrés.
- `measurements` : mesures typées et provenance des modules.
- `groupAssignments` : composition validée par séance et historique.
- `libraryItems` : ressources pédagogiques versionnées.
- `backupManifest` / `migrationJournal` : métadonnées et état des opérations si nécessaire.

**Exemple de mesure** :

```json
{
  "id": "measure-001",
  "studentId": "student-45",
  "sessionId": "session-12",
  "sourceModuleId": "jumpmeasure",
  "metric": "vertical_jump",
  "value": 38,
  "unit": "cm",
  "protocolId": "vertical-jump-v1",
  "attempt": 1,
  "recordedAt": "2026-11-19T10:00:00.000Z"
}
```

Les exemples d'identifiants et d'API ne sont pas des contraintes sur les données existantes.

### Protocole de migration

1. Générer une sauvegarde intégrale vérifiée sur copie de test.
2. Tester l'ouverture avec l'ancien schéma et des données réalistes fictives.
3. Exécuter la migration ; contrôler les comptes, relations, photos, dates et notes.
4. Réexécuter la migration : aucun doublon, aucune perte.
5. Simuler une interruption et vérifier la reprise.
6. Tester les anciens modules et la restauration.
7. Documenter les limitations de retour arrière ; ne pas promettre un downgrade de schéma IndexedDB automatique.

## 7. Tests et qualité

### Stratégie

- Tests unitaires : calendrier et semaines A/B, moyennes, compétences, répartition de groupes, formatage, validation des mesures.
- Tests d'intégration : transactions IndexedDB, migrations, sauvegarde/restauration, cohérence des IDs, adaptateurs v1/v2.
- Tests navigateur E2E : création année/classe/élève, import trombinoscope, appel, inaptitude, séance, note, module, export, restauration.
- Tests hors ligne : première installation en ligne puis utilisation hors ligne, redémarrage, mise à jour du service worker, cache des nouveaux fichiers.
- Tests responsive : tablette portrait/paysage, ordinateur, téléphone ; clavier, lecteur d'écran, focus, zones tactiles.
- Tests de sécurité : injection HTML dans noms et commentaires, données malformées, fichiers importés, validation des messages inter-fenêtres, permissions de module.
- Tests de performance : plusieurs années, nombreuses classes et séances, photos volumineuses, sauvegardes volumineuses ; mesurer les temps et la consommation mémoire.

### Cas de non-régression incontournables

1. Années scolaires, vacances et alternance A/B.
2. Création automatique des séances depuis l'emploi du temps et préservation des séances personnalisées.
3. Appel : présence par défaut, absences, retards, mentions complémentaires et ancien format.
4. Inaptitudes et adaptations ; aucune confusion avec les absences.
5. Notes, moyennes, appréciations, observations et photos.
6. Tableaux et données associées.
7. Lancement, fonctionnement autonome et récupération des données des modules `demi-fond`, `coeval`, `evaluations`.
8. Sauvegarde/restauration complète, y compris modules et médias.
9. Recherche et navigation existantes.
10. Mise à jour du cache sans écran blanc ni perte de données.

### Critères de fusion

- Tests automatisés verts ; toute exception documentée.
- Test manuel du parcours métier concerné sur tablette.
- Aucune perte ni mutation imprévue des données historiques.
- Migration et restauration vérifiées lorsque le schéma change.
- Compatibilité SDK v1 vérifiée si le code des modules ou de l'hôte change.
- Documentation et versions du service worker mises à jour.
- Diff limité et relisible, avec capture ou description du comportement avant/après pour les changements UI.

## 8. Ergonomie et UX

- Priorité aux actions du cours en cours : ouvrir la séance, faire l'appel, accéder aux élèves, lancer le module, saisir l'observation.
- Conserver les routes et accès existants pendant la transition ; si une route change, prévoir une redirection interne.
- Pas de navigation complexe au milieu d'un cours : contexte de classe/séance toujours visible.
- Trombinoscope et listes alternatives ; ne jamais imposer la présence d'une photo.
- Afficher les états « sauvegardé », « en cours », « erreur » ; sauvegarde automatique sans masquer les échecs.
- Un statut d'appel doit pouvoir être corrigé facilement ; les actions destructives nécessitent confirmation.
- Utiliser des composants partagés et des variables CSS ; éviter les styles dispersés ou les régressions du thème existant.

## 9. Sécurité, confidentialité et robustesse locale

- IndexedDB et cache navigateur peuvent être effacés par le système ou l'utilisateur ; afficher clairement la date de dernière **sauvegarde externe**.
- Ne pas inclure les données élèves dans les URLs, logs de production ou événements analytiques.
- Ne pas charger de CDN indispensable pour le fonctionnement hors ligne.
- Les photos, restrictions et observations ne sont accessibles aux modules qu'en fonction du besoin et de permissions explicites.
- Éviter de dupliquer inutilement des données personnelles dans `localStorage` ; pour SDK v2, privilégier des messages ciblés.
- Les fichiers exportés sont des données sensibles : informer avant export, proposer chiffrement et exclusion des champs sensibles.
- En cas d'erreur de quota, de base indisponible ou d'export interrompu : message clair, pas de suppression automatique, possibilité de réessayer.
- Vérifier les règles RGPD et les politiques de l'établissement avant usage réel ; le stockage local seul ne constitue pas une garantie de conformité.

## 10. Séquencement des lots (commits sur `main`)

| Phase | Nom du lot | Premier lot recommandé |
|---|---|---|
| 0 | `feature/v2-foundation` | Tests de non-régression et inventaire des données |
| 1 | `feature/v2-dashboard-terrain` | Tableau de bord sans modifier le stockage |
| 2 | `feature/v2-students-groups` | Fiche élève enrichie en lecture seule |
| 3 | `feature/v2-sdk` | Contrats et tests SDK v1/v2 |
| 4 | `feature/v2-assessment` | Schéma des référentiels et tests de calcul |
| 5 | `feature/v2-library` | Modèle des ressources et duplication |
| 6 | `feature/v2-reports` | Export CSV et prévisualisation |

Ne pas cumuler plusieurs phases dans un même commit. Chaque lot (message de commit et compte rendu) indique : objectif, fichiers touchés, données migrées, tests, captures si UI, risques et retour arrière.

## 11. Format attendu des réponses de Claude Code

Avant de coder :

```text
OBJECTIF
ÉTAT EXISTANT CONFIRMÉ
FICHIERS CONCERNÉS
PLAN MINIMAL
RISQUES DE RÉGRESSION
TESTS PRÉVUS
POINTS À VALIDER
```

Après avoir codé :

```text
RÉSUMÉ DES MODIFICATIONS
FICHIERS MODIFIÉS / CRÉÉS
MIGRATIONS ET COMPATIBILITÉ
TESTS EXÉCUTÉS ET RÉSULTATS
LIMITATIONS CONNUES
PROCÉDURE DE RETOUR ARRIÈRE
PROCHAINE PETITE ÉTAPE
```

Ne jamais prétendre qu'un test a été effectué s'il ne l'a pas été. Ne pas inventer un chemin ou une fonction : rechercher d'abord dans le dépôt. Si la demande est trop vaste, proposer un découpage et réaliser uniquement le lot explicitement autorisé.

## 12. Première mission recommandée

**Phase 0, lot 0.1 : audit et sécurisation, sans changement fonctionnel.**

1. Cartographier les magasins IndexedDB et autres stockages utilisés par l'hôte et chaque module.
2. Documenter précisément les exports, imports, migrations et mécanismes de cache existants.
3. Construire des fixtures de test fictives et une procédure reproductible de sauvegarde/restauration.
4. Proposer les tests de non-régression prioritaires et les fichiers exacts à modifier.
5. Présenter le plan de PR avant toute implémentation.

**Définition de terminé :** un rapport d'audit vérifiable et une proposition de première PR de tests, sans modification du dépôt tant que l'utilisateur ne l'a pas demandée.
