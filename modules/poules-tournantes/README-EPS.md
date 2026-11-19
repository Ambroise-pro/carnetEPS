# Poules tournantes dans EPS Manager

Copie de la branche `main` du dépôt `Ambroise-pro/poulestournante` (commit `5aa2c6d`, « Make the app an EPS Manager module
(teacher-side only) »). L'intégration avec EPS Manager est celle de ce dépôt : elle n'est pas modifiée ici.

## Données envoyées à EPS Manager (définies dans le dépôt de l'application)

Quand une poule est **terminée** (tous ses matchs joués, saisis à la main ou reçus par QR code), pour chaque élève choisi
dans une classe d'EPS Manager : trois résultats dans la séance du jour — « Poules tournantes · Classement » (ex. `2e/8`),
« Poules tournantes · Points », « Poules tournantes · Goal average » — et un résumé de la poule pour la classe.
Aucune note sur 20. Clés stables `poulestournante:<poule>:…` : pas de doublon. Un élève saisi à la main (sans classe) n'est pas envoyé.

## Différences avec le dépôt

| Fichier | Changement |
|---|---|
| `index.html` | Seules 3 lignes changent : Tailwind, `qrcode-generator` et `html5-qrcode` chargés en local au lieu des CDN (fonctionne hors connexion). |
| `tailwind.css` | Généré : `npx tailwindcss@3.4.17 -i in.css -o tailwind.css --content "./index.html" --minify` (in.css = les 3 directives `@tailwind`). À régénérer après une mise à jour d'`index.html`. |
| `vendor/qrcode.js` | `qrcode-generator@1.4.4` (licence MIT), fichier du paquet npm, identique à celui du CDN. |
| `vendor/html5-qrcode.min.js` | `html5-qrcode@2.3.8` (licence Apache-2.0), fichier du paquet npm, identique à celui du CDN. |
| `eps-sdk.js`, `eps-adapter.js`, `eps-module.json` | Identiques au dépôt. |
| `script.js`, `styles.css` | Non repris (non chargés par `index.html`). |

## Mettre à jour

Recopier `index.html` (et `eps-module.json`) depuis la branche `main` du dépôt, refaire les 3 remplacements de lignes,
régénérer `tailwind.css`, puis `node tools/offline-list.mjs` à la racine d'EPS Manager et lancer les tests.
