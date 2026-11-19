# Applications associées à EPS Manager (dossier modules/)

Une application associée (appelée « module » dans le code) est une application web ajoutée telle quelle dans un dossier de `modules/`.
EPS Manager l'ouvre en plein écran, lui transmet les classes et récupère ses résultats.
**L'application principale n'a pas à être modifiée pour ajouter un module.**

## Rendre une application compatible

Le dossier `sdk/` contient le kit : un prompt prêt à coller dans un assistant de programmation (`sdk/PROMPT.md`),
une bibliothèque à inclure dans l'application (`sdk/eps-sdk.js`) et une liaison standard (`sdk/eps-adapter.js`).
Voir `sdk/README.md` et l'application d'exemple `exemple-sdk/`.

## Ajouter un module

1. Copier l'application dans `modules/<nom-du-dossier>/` (lettres, chiffres, `-`, `_`).
2. Ajouter dans ce dossier un fichier `eps-module.json` :

   ```json
   { "name": "Demi-fond", "entry": "index.html", "adapter": "eps-adapter.js", "description": "…" }
   ```

   Option : `"classChoice": true` pour un module qui travaille classe par classe. Une liste des classes
   s'affiche alors dans la barre du module ; ouvert depuis une fiche séance, il reçoit la classe de la séance.

3. Déclarer le dossier, au choix :
   - en ajoutant son nom dans `modules/modules.json` (ex. `["demi-fond", "mon-module"]`) ;
   - ou dans EPS Manager : page « Applications » › « Associer une application ».

L'application apparaît alors dans la page « Applications » et dans l'icône puzzle de chaque fiche séance.

## La liaison (`adapter`, facultative)

Sans adaptateur, le module s'ouvre simplement dans EPS Manager. Avec un adaptateur
(un module JavaScript placé dans le dossier du module), les données circulent dans les deux sens.
Il peut exporter deux fonctions, qui reçoivent le même contexte :

```js
ctx = {
  module: { id, name },
  base: 'https://…/modules/<dossier>/',
  today: 'AAAA-MM-JJ',
  focus: { classId, sessionId } | null,   // classe choisie ou séance d'où le module est ouvert
  classes: [{ id, name, students: [{ id, first, last, sex: 'F' | 'G' | '', photo, inapt, attendance }] }],
  cycles: [{ id, classId, name, start, end, sessions: [{ id, date, time }] }],
  sessions: [{ id, classId, date, time, duration, title }]
}

export async function beforeOpen(ctx) { /* recopier les classes dans le module */ }
export async function refresh(ctx) { /* facultatif : mise à jour en direct (toutes les 20 s, module ouvert) */ }

export async function collect(ctx) {
  return {
    grades:   [{ key, studentId, name, grade, date }],                  // → Évaluations
    results:  [{ key, classId, date, studentId, label, value, unit }],  // → séance de la classe ce jour-là
    summaries:[{ key, classId, date, text }],                           // → résumé dans cette séance
    studentUpdates: [{ studentId, sex }]                                // → complète le sexe s'il manque
  };
}
```

- Ajoutez `"version"` dans `eps-module.json` : EPS Manager l'affiche et signale les mises à jour.
- Si `collect` échoue ou renvoie un mauvais format, EPS Manager l'indique (page Applications et barre de l'application).
- `key` doit être stable : la synchronisation peut être répétée sans créer de doublons.
- Les résultats vont dans la séance de la classe à cette date ; s'il n'y en a pas, une séance
  ponctuelle portant le nom du module est créée.
- `collect` est appelé à l'ouverture de l'application, toutes les 20 secondes quand le module est
  ouvert, à sa fermeture et avec le bouton « Synchroniser ».
- Le module est servi depuis la même adresse qu'EPS Manager : il peut lire ses propres données
  (localStorage, IndexedDB) dans l'adaptateur.
