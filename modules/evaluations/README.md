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

## Évaluer (« Évaluer une classe »)
- Choisir la grille, la classe, le titre et la date (celle de la séance si le module est ouvert depuis une fiche séance).
- La grille est figée dans l'évaluation : modifier la grille ensuite ne change pas les notes déjà données.
- Toucher un élève, puis une case par ligne ; ajuster les points si besoin. Présent / Absent / Dispensé, commentaire.
- « Bilan de la classe » : points par ligne et degré, total, note sur 20, moyenne, export CSV.

## Liaison avec EPS Manager (eps-adapter.js)
- Reçoit les classes et élèves d'EPS Manager.
- Renvoie les notes sur 20 des élèves entièrement évalués (Évaluations), et dans la séance de la classe à la date
  de l'évaluation : la note et les degrés de chaque élève, les absents ou dispensés, un résumé (élèves notés, moyenne).

Données : localStorage « eps-evaluations-v1 » (sur l'appareil).
