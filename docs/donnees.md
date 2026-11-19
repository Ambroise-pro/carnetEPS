# Données d'EPS Manager : inventaire (version 29)

Document de référence de la phase 0 (lot 0.1). À mettre à jour à chaque changement de format.
Toutes les données restent **sur l'appareil** ; rien n'est envoyé à un serveur, sauf les fonctions listées en fin de document.

## 1. Base principale : IndexedDB `eps-manager` (version 5)

- Ouverture : `indexedDB.open('eps-manager',5)` dans `app.js`. `onupgradeneeded` crée seulement les magasins manquants (aucune migration de schéma).
- Chaque magasin a la clé `id` (chaîne). **Toutes les valeurs sont des chaînes** : la restauration refuse un fichier contenant autre chose
  (les listes et objets sont stockés en JSON texte, ex. `settings.coefs`, `boards.board`).
- Les champs saisis dans les formulaires sont décrits par `fields` dans `app.js` ; les champs ci-dessous en italique sont ajoutés par le code.

| Magasin | Champs | Références |
|---|---|---|
| `years` | name, start, end, *firstWeek* (A/B) | — |
| `classes` | year, name | `year` → years |
| `students` | classId, first, last, sex (F/G), birth, needs (PAI/PAP), *photo* (data URL JPEG) | `classId` → classes |
| `groups` | classId, name | `classId` → classes |
| `cycles` | classId, name (activité), start, end | `classId` → classes |
| `sessions` | classId, date, time, duration, name, *slot* (cours d'origine), *called* ('1'), *cancelled* (motif), contenu : *objective, material, warmup, main, end, notes* | `classId`, `slot` → timetable |
| `attendance` | id = `séance/élève`, sessionId, student, status, *extras* | voir § 2 |
| `restrictions` | student, start, end, name (adaptation) — les inaptitudes | `student` → students |
| `grades` | student, name (« Activité · épreuve »), grade (texte ; non numérique = non noté, jamais zéro), date | `student` |
| `comments` | student, name (texte), date ; appréciations de bulletin : id `bulletin:<période>:<élève>`, *period*, *tags* | `student` |
| `observations` | student, name, date | `student` |
| `holidays` | year, name, start, end | `year` |
| `timetable` | year, classId, weekday (1–6), time, duration, freq (all/A/B), name, *skip* (dates) | `year`, `classId` |
| `settings` | un seul enregistrement `id:'app'` : alertes, périodes et coefficients (JSON), verrouillage (empreinte salée), clé Gemini, adjectifs, versions des applications… | — |
| `results` | sessionId, module, student, label, value, unit, date | `sessionId`, `student` |
| `boards` | classId, name, board (JSON), archives (JSON), created, updated | `classId` |

Suppressions en cascade : table `deps` dans `app.js` (ex. supprimer une classe supprime ses élèves, séances, tableaux…).

## 2. Appel (`attendance`)

- Présent par défaut : **seules les exceptions sont enregistrées**.
- Format actuel (v25) : `status` = présence (`Présent`, `Absent`, `Retard`) et `extras` = mentions cumulables séparées par des virgules
  (`Oubli de tenue`, `Oubli de chaussures`, `Inaptitude`, `Mot des parents`). Un enregistrement `Présent` sans mention est supprimé.
- Anciens formats encore lus (fonction `attOf`) :
  - une seule mention dans `status` (ex. `Oubli de tenue`) → présent + cette mention ;
  - `Certificat médical` → lu `Inaptitude` (pas réécrit en base) ;
  - très ancien format (`Présent`, `Non renseigné`, `En retard`, `Excusé`) → converti au démarrage par `migrateAttendance()`.
- Une inaptitude de longue durée (`restrictions`) n'est **pas** une absence ; la mention « Inaptitude » du jour non plus.

## 3. Autres stockages du même site

| Propriétaire | localStorage | IndexedDB |
|---|---|---|
| EPS Manager | `eps-last-backup`, `eps-backup-snooze` | — |
| Tableaux (`board/`) | — | `mon-tableau-blanc-documents` |
| Demi-fond | `eps-hub-v1`, `eps-hub-role`, `df-scan-ccf-v2`, `df-eps-export-v1`, `chronoCarnetEPS_v4`, `cc_classes`, `cc_history` (+ `sessionStorage` temporaire `eps-hub-roster`, `eps-hub-route`) | `chrono-eps`, `df-scan-ccf-backups`, `scan-document-eps-v1`, `eps-hub-photos` |
| Co-évaluation | `df-coeval-v1`, `coeval-ui` | — |
| Évaluations | `eps-evaluations-v1`, `eps-evaluations-context` | — |
| Conquête (`conquete-laser`) | `lrc-device`, `lrc-station`, `lrc-demo-state-v1`, `lrc-eps-<code partie>` (lien partie ↔ classe) | — |
| Applications du kit (SDK v1) | `eps-manager:<id>:context`, `eps-manager:outbox:<id>` | — |

## 4. Sauvegarde (format version 3)

Fichier JSON `eps-manager-AAAA-MM-JJ.json` produit par `exportBackup()` :

```json
{ "version": 3, "createdAt": "ISO", "appVersion": 27,
  "data":  { "<magasin>": [ {enregistrements} ] },
  "manifest": { "counts": { "<magasin>": n }, "localStorage": n, "indexedDB": [ { "name", "stores": { "<magasin>": n } } ], "sha256": "…" },
  "extra": { "localStorage": { "<clé>": "<valeur>" },
             "indexedDB": [ { "name", "version", "stores": [ { "name", "keyPath", "autoIncrement", "indexes", "records": [[clé, valeur]] } ] } ] } }
```

- `extra.indexedDB` : toutes les bases du site sauf `eps-manager`, listées par `indexedDB.databases()` ; à défaut, liste de secours `KNOWN_DBS`.
  Les fichiers (Blob/File) sont convertis en `{"__epsBlob": "data:…", name, type}`.
- `manifest` (depuis la v27, champ additionnel ignoré par les anciennes versions) : nombre d'enregistrements par magasin et
  SHA-256 de `JSON.stringify({data, extra})`. Absent des anciens fichiers, qui restent acceptés.
- Vérification complète **avant** toute écriture (`checkBackup`) : versions 1 à 3 (une version supérieure est refusée avec un message
  « mettez l'application à jour »), somme de contrôle et comptes si l'inventaire est présent, `id` texte unique, valeurs texte, structure de `extra`.
- Restauration (`safeRestore`) :
  1. copie complète de l'état actuel dans la base locale `eps-manager-restore-point` (point de restauration, **pas une sauvegarde externe**) ;
  2. journal `eps-restore-journal` (localStorage) ;
  3. écriture : les 16 magasins en une transaction, puis le localStorage, puis chaque base d'application supprimée et recréée ;
  4. en cas d'erreur, retour automatique à la copie (y compris retrait des clés et bases apportées par la sauvegarde ratée) ;
  5. si l'application est coupée pendant l'écriture, le journal reste : au démarrage suivant, elle propose de revenir à la copie.
- Page Sauvegardes › « Annuler la dernière restauration » : revient à la copie (en gardant l'état actuel comme nouvelle copie).
  « Charger les données d'exemple » fait aussi une copie avant de remplacer les données.
- `eps-manager-restore-point` et `eps-restore-journal` ne sont jamais inclus dans une sauvegarde ni écrasés par une restauration.
- La sauvegarde contient des données sensibles en clair (élèves, photos, besoins particuliers, clé Gemini, empreinte du code de verrouillage).

## 5. Cache hors ligne (`sw.js`)

- `VERSION` = `APP_VERSION`, cache du socle `eps-v<VERSION>` : mis en cache à l'installation (`index.html`, `app.js`, `style.css`,
  manifeste, icônes, `trombi.js`, pdf.js, `board/*`). À l'activation, les anciens caches `eps-v…` sont supprimés.
- Applications associées et bibliothèques : cache durable `eps-files`, **gardé d'une version à l'autre**. La liste vient de
  `offline.json` (chemin + empreinte SHA-256 tronquée), générée par `node tools/offline-list.mjs`. Le service worker télécharge
  en arrière-plan (4 à la fois) les seuls fichiers nouveaux ou modifiés, retire ceux qui ne sont plus listés, et note l'état dans
  `offline-state.json` (dans le cache). Ce téléchargement ne bloque jamais l'installation ni l'ouverture de l'application ;
  il est relancé à chaque ouverture (message `sync-files`).
- Stratégie : réseau d'abord (`no-cache`) avec copie en cache ; hors ligne, réponse du cache (tous caches), puis `index.html`
  pour une page de l'application (jamais pour une page d'application associée).
- Page Applications : état « disponibles hors connexion » ou progression du téléchargement.
- **Après toute modification de `modules/` ou `vendor/`, relancer `node tools/offline-list.mjs`** (le test `10-hors-ligne` le vérifie).

## 6. Fonctions qui communiquent avec l'extérieur (demandées par l'utilisateur)

- Gemini (appréciations) : seulement si une clé est saisie ; envoie sexe, période, moyennes, activités, assiduité, adjectifs (observations sur option) ; jamais nom, prénom ni besoins particuliers.
- `api/ical.js` (Vercel) : relais de l'emploi du temps PRONOTE (le lien iCal transite par le relais, sans données d'élèves).
- Clé de secours du verrouillage : lien `mailto:` ouvert par l'utilisateur.
- Conquête : prénoms des élèves présents envoyés au serveur de jeu (Vercel/Firebase) à la création d'une partie ; les élèves rejoignent par QR code.

## 7. Points de vigilance relevés (à traiter dans les lots suivants)

1. ~~Restauration non atomique sans copie préalable~~ : corrigé en v27 (copie, retour automatique, reprise au démarrage).
2. ~~Pas d'inventaire ni de somme de contrôle~~ : corrigé en v27.
3. ~~`KNOWN_DBS` incomplète~~ : corrigé en v27 (`chrono-eps`, `df-scan-ccf-backups`, `eps-hub-pf` ajoutées).
4. ~~`modules/` et `vendor/` non préchargés~~ : corrigé en v29 (cache durable `eps-files`, liste `offline.json`).
5. Le point de restauration double l'espace occupé pendant qu'il existe (photos comprises) ; un seul point est gardé.
