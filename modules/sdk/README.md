# Kit de compatibilité EPS Manager

Ce dossier permet de rendre **n'importe quelle application web** compatible avec EPS Manager, pour l'associer
(dossier `modules/<nom>/`, page « Applications »).

| Fichier | Rôle |
|---|---|
| `PROMPT.md` | Prompt prêt à coller dans Claude Code (ou un autre assistant) ouvert sur l'application à adapter. |
| `eps-sdk.js` | Bibliothèque à copier dans l'application : lire les classes, envoyer notes, résultats et résumés. |
| `eps-adapter.js` | Liaison standard à copier telle quelle dans l'application (aucune modification). |
| `../exemple-sdk/` | Petite application d'exemple qui utilise le kit (à associer pour tester). |

## En trois étapes

1. Dans le dépôt de l'application : copier `eps-sdk.js` et `eps-adapter.js`, puis donner `PROMPT.md` à l'assistant
   (ou suivre ses étapes à la main) : il ajoute `eps-module.json`, charge le SDK et branche les envois.
2. Copier l'application dans `modules/<nom-du-dossier>/` d'EPS Manager.
3. Dans EPS Manager : page « Applications » › « Associer une application » › nom du dossier
   (ou ajouter le nom dans `modules/modules.json`).

## Référence du SDK (`window.EPSManager`)

| Fonction | Renvoie / effet |
|---|---|
| `available()` | `true` si l'application est ouverte depuis EPS Manager. |
| `classes()` | `[{id, name, students: [{id, first, last, sex, photo, inapt, attendance}]}]` — `inapt` : inaptitude en cours ; `attendance` : statut à l'appel du jour (mis à jour en direct toutes les 20 s, et `onChange` est appelé). |
| `cycles()` | `[{id, classId, name, start, end, sessions: [{id, date, time}]}]` |
| `classById(id)`, `students(classId)`, `student(id)`, `classOfStudent(studentId)` | Accès aux classes et élèves (élèves triés par nom). |
| `focus()` | `{classId, sessionId}` : classe ou séance d'où l'application est ouverte, sinon `null`. |
| `focusSession()` | `{id, classId, date, time, duration, title}` de cette séance, sinon `null`. |
| `today()`, `fullName(student)` | Date `AAAA-MM-JJ`, « NOM Prénom ». |
| `grade({key, studentId, name, grade, date})` | Note (sur 20) → Évaluations d'EPS Manager. |
| `result({key, studentId, label, value, unit, date})` | Résultat d'un élève → séance de sa classe à cette date. |
| `summary({key, classId, text, date})` | Résumé → séance de la classe à cette date. |
| `remove(key)`, `clear(prefix)` | Retirer un envoi, ou tous ceux dont la clé commence par `prefix`. |
| `pending()` | Envois en attente. |
| `onChange(callback)` | Appelé quand EPS Manager met à jour les classes. |

- `key` est stable : renvoyer la même clé met à jour l'envoi (pas de doublon).
- Hors d'EPS Manager, `available()` vaut `false` et les envois sont ignorés.
- Stockage : `localStorage` « eps-manager:context:<dossier> » (déposé par EPS Manager) et
  « eps-manager:outbox:<dossier> » (rempli par l'application, repris par EPS Manager).

## `eps-module.json`

```json
{ "name": "Nom affiché", "description": "…", "entry": "index.html", "adapter": "eps-adapter.js", "classChoice": true }
```

`classChoice` : l'application travaille classe par classe (choix de classe dans sa barre, classe de la séance transmise).
