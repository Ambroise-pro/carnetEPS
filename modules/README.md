# Modules d'EPS Manager

Un module est une application web ajoutée telle quelle dans un dossier de `modules/`.
EPS Manager l'ouvre en plein écran, lui transmet les classes et récupère ses résultats.
**L'application principale n'a pas à être modifiée pour ajouter un module.**

## Ajouter un module

1. Copier l'application dans `modules/<nom-du-dossier>/` (lettres, chiffres, `-`, `_`).
2. Ajouter dans ce dossier un fichier `eps-module.json` :

   ```json
   { "name": "Demi-fond", "entry": "index.html", "adapter": "eps-adapter.js", "description": "…" }
   ```

3. Déclarer le dossier, au choix :
   - en ajoutant son nom dans `modules/modules.json` (ex. `["demi-fond", "mon-module"]`) ;
   - ou dans l'application : Réglages › Paramètres › Modules › « Ajouter un module ».

Le module apparaît alors dans le menu (groupe « Modules ») et dans chaque fiche séance.

## La liaison (`adapter`, facultative)

Sans adaptateur, le module s'ouvre simplement dans EPS Manager. Avec un adaptateur
(un module JavaScript placé dans le dossier du module), les données circulent dans les deux sens.
Il peut exporter deux fonctions, qui reçoivent le même contexte :

```js
ctx = {
  module: { id, name },
  base: 'https://…/modules/<dossier>/',
  today: 'AAAA-MM-JJ',
  classes: [{ id, name, students: [{ id, first, last, sex: 'F' | 'G' | '', photo }] }],
  sessions: [{ id, classId, date, time, duration, title }]
}

export async function beforeOpen(ctx) { /* recopier les classes dans le module */ }

export async function collect(ctx) {
  return {
    grades:   [{ key, studentId, name, grade, date }],                  // → Évaluations
    results:  [{ key, classId, date, studentId, label, value, unit }],  // → séance de la classe ce jour-là
    summaries:[{ key, classId, date, text }],                           // → résumé dans cette séance
    studentUpdates: [{ studentId, sex }]                                // → complète le sexe s'il manque
  };
}
```

- `key` doit être stable : la synchronisation peut être répétée sans créer de doublons.
- Les résultats vont dans la séance de la classe à cette date ; s'il n'y en a pas, une séance
  ponctuelle portant le nom du module est créée.
- `collect` est appelé à l'ouverture de l'application, toutes les 20 secondes quand le module est
  ouvert, à sa fermeture et avec le bouton « Synchroniser ».
- Le module est servi depuis la même adresse qu'EPS Manager : il peut lire ses propres données
  (localStorage, IndexedDB) dans l'adaptateur.
