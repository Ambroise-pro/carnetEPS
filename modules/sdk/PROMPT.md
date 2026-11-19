# Prompt : rendre une application compatible avec EPS Manager

Copiez tout le texte ci-dessous dans Claude Code (ou un autre assistant de programmation) **ouvert sur le dépôt de
l'application à adapter**, après avoir copié dans ce dépôt les fichiers `eps-sdk.js` et `eps-adapter.js` de ce dossier
(`modules/sdk/` d'EPS Manager).

---

Tu dois rendre cette application web compatible avec **EPS Manager**, le carnet de bord d'un professeur d'EPS.
EPS Manager pourra alors l'ouvrir comme « application associée » : il lui transmet les classes et les élèves,
et récupère les notes, les résultats par élève et un résumé de séance qu'elle produit.

## Comment EPS Manager utilise une application associée

- L'application est copiée telle quelle dans un dossier `modules/<nom-du-dossier>/` d'EPS Manager et servie depuis
  la même adresse (même origine : elle partage le `localStorage` d'EPS Manager).
- EPS Manager l'ouvre en plein écran dans un cadre (`iframe`), depuis la page « Applications » ou depuis une séance
  (icône puzzle). Il appelle alors la liaison `eps-adapter.js`, qui dépose les classes et élèves dans le `localStorage`.
- Pendant que l'application est ouverte (toutes les 20 s), à sa fermeture et au démarrage d'EPS Manager, la liaison
  reprend ce que l'application a envoyé avec le SDK.
- Les notes vont dans les Évaluations d'EPS Manager et la fiche de l'élève ; les résultats et le résumé vont dans la
  séance de la classe à la date indiquée (la séance d'où l'application a été ouverte si c'est le cas).

## Ce que tu dois faire

1. **Garder `eps-sdk.js` et `eps-adapter.js` tels quels** à la racine de l'application (à côté de sa page d'accueil).
   Ne les modifie pas.
2. **Créer `eps-module.json`** à la racine :
   ```json
   {
     "name": "Nom affiché dans EPS Manager",
     "description": "Une phrase : ce que fait l'application.",
     "entry": "index.html",
     "adapter": "eps-adapter.js",
     "classChoice": true
   }
   ```
   `entry` est la page d'accueil (chemin relatif). Mets `"classChoice": true` si l'application travaille classe par
   classe (EPS Manager affiche alors un choix de classe et transmet la classe de la séance), sinon retire la ligne.
3. **Charger le SDK** dans la page d'accueil, avant les scripts de l'application : `<script src="eps-sdk.js"></script>`.
   (Si l'application a plusieurs pages, charge-le dans chacune, avec le bon chemin relatif.)
4. **Recevoir les classes et élèves** quand `EPSManager.available()` est vrai :
   - `EPSManager.classes()` → `[{id, name, students: [{id, first, last, sex: 'F'|'G'|'', photo}]}]`
     (`photo` : image JPEG en `data:` ou chaîne vide) ;
   - `EPSManager.focus()` → `{classId, sessionId}` ou `null` : classe ou séance d'où l'application est ouverte ;
     ouvre directement cette classe si l'application a une notion de classe ;
   - `EPSManager.focusSession()` → `{id, classId, date, time, duration, title}` : utilise sa date par défaut ;
   - `student.inapt` (inaptitude en cours) et `student.attendance` (statut à l'appel du jour : 'Absent', 'Retard'…) :
     affiche-les pendant l'évaluation (ex. « dispensé de course », « absent à l'appel ») ;
   - `EPSManager.cycles()` : cycles de chaque classe avec leurs séances ;
   - `EPSManager.onChange(cb)` : la liste a été mise à jour (EPS Manager l'actualise en direct toutes les 20 s).
   Fais correspondre ces classes au modèle de l'application **en gardant les identifiants d'EPS Manager**
   (`class.id`, `student.id`) : ce sont eux qu'il faudra renvoyer. Si l'application a déjà ses propres listes,
   ajoute ou mets à jour les élèves sans effacer ses données (rapprochement par identifiant, sinon par nom).
   Remplace ou complète l'import manuel de listes (CSV, saisie) quand EPS Manager fournit les classes.
5. **Envoyer les résultats** au moment où l'application les produit (enregistrement d'une note, fin d'une épreuve…) :
   ```js
   EPSManager.grade({key: 'note:' + evaluationId + ':' + studentId, studentId, name: 'Titre de l’évaluation', grade: 14.5, date: '2026-11-19'});
   EPSManager.result({key: 'temps:' + courseId + ':' + studentId, studentId, label: 'Course 1 · 800 m', value: '3:12', unit: '', date});
   EPSManager.summary({key: 'resume:' + seanceId, classId, text: '22 élèves chronométrés · moyenne 12,4 / 20', date});
   EPSManager.remove(key);          // si la note ou le résultat est supprimé dans l'application
   ```
   - `key` doit être **stable** : renvoyer la même clé met à jour au lieu de créer un doublon.
   - `studentId` et `classId` sont les identifiants d'EPS Manager. `date` au format `AAAA-MM-JJ`.
   - `grade` est un nombre ; donne une note **sur 20** (convertis si l'application note autrement).
   - N'envoie que des résultats définitifs ou utiles au professeur (pas chaque frappe).
   - Appelle aussi ces fonctions pour les résultats déjà présents dans l'application (au démarrage), afin qu'EPS Manager
     les reprenne même s'ils ont été produits avant l'association.
6. **Ne rien casser hors d'EPS Manager** : si `EPSManager.available()` est faux (application ouverte seule), tout doit
   fonctionner comme avant ; les appels `grade/result/summary` sont alors ignorés sans erreur.
   Vérifie aussi que `window.EPSManager` existe avant de l'utiliser.
7. **Ne modifie pas EPS Manager** et n'écris pas dans ses clés `localStorage` (sauf via le SDK).
8. Garde l'interface en français, et le fonctionnement hors connexion de l'application s'il existe
   (si elle a un service worker, ajoute `eps-sdk.js`, `eps-adapter.js` et `eps-module.json` à ses fichiers en cache).

## Vérification attendue

- L'application fonctionne toujours seule, sans erreur dans la console.
- Copiée dans `modules/<nom>/` d'EPS Manager, puis associée (page « Applications » › « Associer une application »,
  nom du dossier) et ouverte depuis une séance : elle affiche les classes et élèves d'EPS Manager, ouvre la classe de la
  séance, et après une note donnée puis retour à EPS Manager, la note apparaît dans les Évaluations et dans la séance.
- Décris en fin de travail : les fichiers modifiés, où sont appelés `grade/result/summary`, et ce qui reste à faire.

## Variante sans modifier l'application

Si l'application ne doit pas être modifiée, n'utilise pas le SDK : écris un `eps-adapter.js` spécifique (module ES)
qui exporte `beforeOpen(ctx)` (recopie `ctx.classes` dans le stockage de l'application, dans son format) et
`collect(ctx)` (lit le stockage de l'application et renvoie `{grades, results, summaries}` au format ci-dessus,
avec `classId` dans chaque résultat). Le contexte `ctx` contient `module`, `base`, `today`, `focus`, `classes`,
`sessions`. Exemples dans EPS Manager : `modules/demi-fond/eps-adapter.js`, `modules/coeval/eps-adapter.js`.
