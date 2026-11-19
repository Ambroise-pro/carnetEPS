# Poules tournantes dans EPS Manager

Copie de l'application du dépôt `Ambroise-pro/poulestournante` (commit `247ec42`), branchée sur le kit SDK 1.0.

## Données envoyées à EPS Manager (choix de l'enseignant)

- **Classement par élève** → résultat dans la séance et la fiche élève :
  « Poules tournantes · Poule 1 » : « 2e / 8 · 13 pts · +7 · 5 matchs ».
- **Résumé de la poule** → résumé dans la séance de la classe : classement complet.
- Rien d'autre (aucune note sur 20). Envoi à chaque score saisi, corrigé ou annulé ; clés stables
  (`poules:<identifiant de la poule>:<élève>`) : pas de doublon. Plusieurs poules dans la même séance sont numérotées.

## Fonctionnement

- Ouverte depuis EPS Manager, l'écran de configuration affiche la classe (celle de la séance) : on coche les 6 à 9 joueurs
  de la poule (absents et inaptes signalés). Les noms affichés sont les prénoms (initiale du nom en cas d'homonyme).
- Si les noms sont modifiés à la main après avoir coché, la poule n'est pas reliée à EPS Manager (aucun envoi).
- Hors d'EPS Manager, l'application fonctionne exactement comme avant (saisie libre des noms).

## Différences avec l'original

| Fichier | Changement |
|---|---|
| `index.html` | Tailwind chargé depuis `tailwind.css` (local) au lieu du CDN ; ajout de `eps-sdk.js` et `eps-poules.js`. Rien d'autre. |
| `tailwind.css` | Généré : `npx tailwindcss@3.4.17 -i in.css -o tailwind.css --content "./index.html,./eps-poules.js" --minify` (in.css = les 3 directives `@tailwind`). À régénérer si des classes sont ajoutées. |
| `eps-poules.js` | Liaison EPS Manager (inactive hors EPS Manager). |
| `eps-sdk.js`, `eps-adapter.js` | Kit EPS Manager, copiés sans modification. |
| `script.js`, `styles.css` | Non repris (ancienne version, non chargée par `index.html`). |
