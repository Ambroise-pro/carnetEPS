# Évaluations — module d'EPS Manager

Grilles d'évaluation par degrés, note sur 20.

## Créer une grille (« Mes grilles »)
- Quatre colonnes : degré 1 (le plus faible) à degré 4 (le meilleur).
- Autant de lignes que nécessaire (+ Ajouter une ligne, ↑ ↓ pour les ordonner, ✕ pour supprimer).
- Dans chaque case : les critères, puis les points « de … à … ».
  En évaluant, toucher la case donne le maximum ; on module ensuite jusqu'au minimum,
  par pas de 0,5 point (ou 0,25 / 1, réglable pour la grille). Mettre le même nombre aux deux = valeur fixe.
- Le barème est la somme des maxima de chaque ligne ; la note est ramenée sur 20.
- « Partir d'un exemple » propose une grille de badminton à adapter. « Enregistrer la grille » la sauvegarde.

## Barème de performance
- « + Barème de performance » (ou « Exemple de barème ») : temps (min:s), distance ou points convertis en note,
  avec un barème filles et un barème garçons (paliers performance → note, note sur …, arrondi).
- Entre deux paliers, la note est calculée proportionnellement ; au-delà du meilleur palier, la note maximale.
- Évaluation : toute la classe dans un tableau (sexe repris d'EPS Manager, modifiable), note en direct, export CSV.

## Grille liée au cycle
- L'« Activité » d'une grille ou d'un barème la lie aux cycles du même nom dans EPS Manager (« Badminton »).
- Pour chaque cycle en cours ou à venir, l'évaluation finale est créée automatiquement à la date de la dernière séance.
- Ouverte depuis une séance qui a une évaluation (classe et date), l'application l'ouvre directement.

## En direct depuis EPS Manager
- Inaptitude en cours et statut à l'appel du jour affichés sur les élèves (raccourcis « Dispensé », « Marquer absent »).

## Grilles au format Excel
- « Télécharger le modèle Excel » : un fichier avec une grille d'exemple (feuille « Grille ») et une feuille « Mode d'emploi ».
  Le collègue remplit : nom, activité, modulation, puis une ligne par ligne de la grille avec, pour chaque degré,
  les critères et les points minimum et maximum. Plusieurs grilles = plusieurs feuilles.
- « Importer une grille Excel » : la grille s'ouvre dans l'éditeur pour vérification, puis « Enregistrer la grille ».
  Avec plusieurs feuilles, toutes les grilles sont enregistrées directement.
- « Exporter en Excel » sur chaque grille : même format, réimportable.
- Bibliothèque : SheetJS 0.18.5 (vendor/xlsx.mini.min.js, licence Apache-2.0), chargée seulement à l'usage.

## Évaluer (« Évaluer une classe »)
- Choisir la grille, la classe, le titre et la date (celle de la séance si le module est ouvert depuis une fiche séance).
- La grille est figée dans l'évaluation : modifier la grille ensuite ne change pas les notes déjà données.
- Toucher un élève, puis une case par ligne, ou faire glisser le curseur de la ligne entre les degrés
  (il parcourt toutes les valeurs, du minimum du degré 1 au maximum du degré 4) ; ajuster les points si besoin. Présent / Absent / Dispensé, commentaire.
- « Bilan de la classe » : points par ligne et degré, total, note sur 20, moyenne, export CSV.

## Liaison avec EPS Manager (eps-adapter.js)
- Reçoit les classes et élèves d'EPS Manager.
- Renvoie les notes sur 20 des élèves entièrement évalués (Évaluations), et dans la séance de la classe à la date
  de l'évaluation : la note et les degrés de chaque élève, les absents ou dispensés, un résumé (élèves notés, moyenne).

Données : localStorage « eps-evaluations-v1 » (sur l'appareil).
