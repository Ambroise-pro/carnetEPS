# Données d'EPS Manager : inventaire (version 25)

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
| Applications du kit (SDK v1) | `eps-manager:<id>:context`, `eps-manager:outbox:<id>` | — |

## 4. Sauvegarde (format version 3)

Fichier JSON `eps-manager-AAAA-MM-JJ.json` produit par `exportBackup()` :

```json
{ "version": 3, "createdAt": "ISO", "appVersion": 25,
  "data":  { "<magasin>": [ {enregistrements} ] },
  "extra": { "localStorage": { "<clé>": "<valeur>" },
             "indexedDB": [ { "name", "version", "stores": [ { "name", "keyPath", "autoIncrement", "indexes", "records": [[clé, valeur]] } ] } ] } }
```

- `extra.indexedDB` : toutes les bases du site sauf `eps-manager`, listées par `indexedDB.databases()` ; à défaut, liste de secours `KNOWN_DBS`.
  Les fichiers (Blob/File) sont convertis en `{"__epsBlob": "data:…", name, type}`.
- Restauration (`renderBackup`) : versions acceptées 1, 2, 3 ; magasins manquants des versions 1–2 complétés ;
  refus si un enregistrement n'a pas d'`id` texte ou contient une valeur non texte. Les 16 magasins sont remplacés **en une transaction** ;
  ensuite le localStorage est réécrit clé par clé et chaque base d'application est **supprimée puis recréée**.
- La sauvegarde contient des données sensibles en clair (élèves, photos, besoins particuliers, clé Gemini, empreinte du code de verrouillage).

## 5. Cache hors ligne (`sw.js`)

- `VERSION` = `APP_VERSION`, cache `eps-v<VERSION>` ; à l'activation, les autres caches sont supprimés.
- Stratégie : réseau d'abord (`no-cache`), copie en cache des réponses ; hors ligne, réponse du cache puis `index.html`.
- Préchargés : le shell (`index.html`, `app.js`, `style.css`, manifeste, icônes, `trombi.js`, pdf.js, `board/*`).
  Les applications (`modules/…`) et `vendor/` ne sont en cache qu'après une première ouverture en ligne.

## 6. Fonctions qui communiquent avec l'extérieur (demandées par l'utilisateur)

- Gemini (appréciations) : seulement si une clé est saisie ; envoie sexe, période, moyennes, activités, assiduité, adjectifs (observations sur option) ; jamais nom, prénom ni besoins particuliers.
- `api/ical.js` (Vercel) : relais de l'emploi du temps PRONOTE (le lien iCal transite par le relais, sans données d'élèves).
- Clé de secours du verrouillage : lien `mailto:` ouvert par l'utilisateur.

## 7. Points de vigilance relevés (à traiter dans les lots suivants)

1. Restauration non atomique pour les bases des applications (suppression puis recréation, sans copie préalable).
2. Pas d'inventaire ni de somme de contrôle dans le fichier de sauvegarde.
3. `KNOWN_DBS` ne contient pas `chrono-eps` ni `df-scan-ccf-backups` (navigateurs sans `indexedDB.databases()`).
4. `modules/` et `vendor/` non préchargés pour le hors ligne.
