# Tests de non-régression

Tests de bout en bout dans un vrai navigateur (Chromium), sur des **données entièrement fictives**.
Ils ne modifient ni l'application ni les données d'un appareil réel : chaque test ouvre un navigateur neuf.

## Lancer

Prérequis : Node 20 ou plus et le paquet `playwright` avec Chromium (`npm i -g playwright && npx playwright install chromium`).
Aucune installation dans le dépôt, aucun build.

```sh
node --test --test-concurrency=1 tests/e2e/*.test.mjs
```

Un seul fichier : `node --test tests/e2e/05-sauvegarde.test.mjs`. Durée totale : environ 2 minutes.

## Contenu

| Fichier | Cas de non-régression (CLAUDE.md § 7) |
|---|---|
| `01-demarrage` | 9, 10 : versions cohérentes, fichiers préchargés, toutes les pages sans erreur, recherche, relance hors ligne, tablette portrait et téléphone sans débordement |
| `02-appel` | 3, 4 : anciens formats d'appel, présence + mentions, correction, inaptitude ≠ absence |
| `03-calendrier` | 1, 2 : aucune séance en vacances, alternance A/B, inversion A/B, séances personnalisées et avec contenu préservées |
| `04-notes` | 5 : moyenne pondérée, note « Abs » ignorée (pas un zéro), photo, appréciation, observation, besoins particuliers, brouillons sans appel réseau |
| `05-sauvegarde` | 8 : sauvegarde → effacement total → restauration identique (magasins, identifiants, photos, localStorage, bases des applications avec fichiers) ; fichiers tronqués, version future, valeurs invalides refusés sans modification |
| `06-applications` | 6, 7 : modules déclarés, pages d'entrée, liaisons SDK v1 (`collect`), aucune liaison en erreur, tableaux |
| `07-securite` | injection HTML dans un prénom affichée en texte, jamais exécutée |
| `09-conquete` | 7 : application Conquête ouverte depuis EPS Manager, classes reçues, résultat repris dans la séance du jour, sans doublon (serveur de jeu non contacté) |
| `10-hors-ligne` | 10 (lot 0.3) : `offline.json` à jour, applications associées ouvertes sans connexion après une première visite, mise à jour de version sans écran blanc, données gardées, applications non retéléchargées |
| `08-restauration-sure` | 8 (lot 0.2) : inventaire et SHA-256 dans le fichier, fichier modifié refusé, ancien fichier accepté, échec en cours de restauration → retour automatique complet, annulation de la dernière restauration, reprise d'une restauration interrompue, copie avant les données d'exemple |

## Organisation

- `helpers.mjs` : serveur statique local (port aléatoire), ouverture du navigateur à la date fixe du jeu de données (`page.clock`),
  chargement des données fictives depuis une page vide de la même origine, lecture brute de la base.
- `fixtures/donnees-fictives.mjs` : jeu de données (2 classes, 10 élèves dont un nom piégé, photo JPEG, anciens formats d'appel,
  inaptitude, notes avec coefficient et « Abs », tableaux, données et fichiers d'applications).
- Le test du calendrier utilise le bouton « Charger les données d’exemple » de l'application.

## Non couvert pour l'instant

Import trombinoscope PDF et CSV PRONOTE, import iCal, verrouillage par code, génération Gemini (réseau simulé seulement dans les essais manuels),
fonctionnement interne de chaque application associée.
