# Demi-fond dans EPS Manager

Copie de https://github.com/EPS-BARLETTA/Demi-Fond- (commit 59fbb6e), utilisée comme module.

## Fichiers ajoutés pour la liaison
- `eps-module.json` : déclaration du module.
- `eps-adapter.js` : recopie les classes, élèves, sexes et photos d'EPS Manager dans l'accueil Demi-fond
  (donc dans Scan CCF, PhotoFinish et ScanDocument), puis renvoie les notes, les temps et un résumé par séance.
- `scan/eps-export.js` : publie les notes calculées par Scan CCF (clé `df-eps-export-v1`), sans modifier ses données.

## Retouches dans le code de Demi-fond (2 lignes, marquées « EPS Manager »)
- `scan/exam500-ui.js`, fonction `install()` : `window.DFScore500 = score500;` (la note du 3 × 500 était inaccessible).
- `scan/index.html` : chargement de `eps-export.js`.

Pour mettre le module à jour, recopier la nouvelle version de Demi-fond dans ce dossier en gardant ces
fichiers et ces deux lignes. L'idéal est d'ajouter ces deux lignes et `scan/eps-export.js` au dépôt
Demi-fond lui-même : la copie pourra alors être remplacée telle quelle.
