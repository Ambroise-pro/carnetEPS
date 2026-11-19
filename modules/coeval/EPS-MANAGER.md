# Co-évaluation Bac dans EPS Manager

Copie de https://github.com/Ambroise-pro/coeval (commit f581d87), utilisée comme module.
**Aucun fichier de Coeval n'est modifié** : la copie peut être remplacée telle quelle par une version plus récente.

## Fichiers ajoutés pour la liaison
- `eps-module.json` : déclaration du module (`"classChoice": true` : le module travaille classe par classe).
- `eps-adapter.js` : la liaison, qui utilise le noyau de Coeval (`coeval-core.js`) et ses données (`localStorage` « df-coeval-v1 »).

## Ce qui circule
- Vers Coeval : la classe choisie (ou celle de la séance d'où l'on ouvre le module) a son épreuve
  « Musculation CA5 · classe », créée avec la liste des élèves au format Pronote (NOM Prénom) et ouverte.
  Les élèves ajoutés plus tard dans EPS Manager sont ajoutés aux épreuves liées.
- Vers EPS Manager : les notes **validées** (sur 20) vont dans les Évaluations ; la note (validée ou provisoire,
  sinon l'AFL1 sur 12) et un résumé (élèves évalués, AFL1 terminées, notes validées) vont dans la séance
  du jour de l'évaluation. L'épreuve d'exemple de Coeval est ignorée.
