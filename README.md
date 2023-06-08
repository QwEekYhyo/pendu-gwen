# Rendu du jeu du pendu pour le cours de Web

## Ce que j'ai fait (les bonus)
- Un bouton reset qui permet de relancer une partie du même niveau de difficulté
- La possibilité d'appuyer sur les touches du clavier ainsi que sur les boutons de l'écran
- Si ce n'est pas une lettre il, ne se passe rien
- Si on clique sur une lettre déjà testée, un message s'affiche mais on ne perd pas de tentative
- Pas besoin d'écrire /index.html après http://localhost:8000/
- Renvoie d'une page 404 si le chemin est le mauvais (exemple : http://localhost:8000/blabla)
- Vérification du chemin pour qu'il ne contienne pas de '..'
- Les mots en minuscules présent dans "Les Miserables" sont stockés dans une liste en fonction de leurs tailles
- GetWord peut prendre en argument minLetter et maxLetter (actuellement en commentaire)
- Un message d'ereur est renvoyé si minLetter>maxLetter
- Un mot est choisi aléatoirement en fonction de minLetter et maxLetter
- Select au début de la partie pour choisir un niveau de difficulté
- Le niveau de difficulté dans lequel on est est affiché pendant la partie
- Plus le niveau de difficulté est grand plus les mots sont longs
- L'appel à newGame se fait avec la valeur du niveau de difficulté choisi
- Dans l'api newGame on regarde le niveau choisi et minLetter et maxLetter sont défini en fonction de cela
