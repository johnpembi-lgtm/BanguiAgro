# Images BanguiAgro

## Images manquantes corrigées

| Produit | URL de téléchargement | Commande curl |
|---------|----------------------|---------------|
| **Fond herbe (Hero)** | [Unsplash Grass](https://images.unsplash.com/photo-1611100481087-2eb83c1dc219?w=1200&q=80) | `curl -o fresh-grass.jpg \"https://images.unsplash.com/photo-1611100481087-2eb83c1dc219?ixlib=rb-4.0.3&w=1200&q=80\"` |
| **Maïs** | [Unsplash Corn](https://images.unsplash.com/photo-1589924691995-400dc9ecc0af?w=400&q=80) | `curl -o maïs.jpg \"https://images.unsplash.com/photo-1589924691995-400dc9ecc0af?ixlib=rb-4.0.3&w=400&q=80\"` |
| **Arachide** | [Unsplash Peanuts](https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80) | `curl -o arachide.jpg \"https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&w=400&q=80\"` |
| **Charbon** | [Unsplash Charcoal](https://images.unsplash.com/photo-1605404122809-e12a42d391cc?w=400&q=80) | `curl -o charbon.webp \"https://images.unsplash.com/photo-1605404122809-e12a42d391cc?ixlib=rb-4.0.3&w=400&q=80\"` |

**Exécutez les curls pour télécharger directement dans `image/`.**

## Fix temporaire (URLs directes)
Pour un fix immédiat sans téléchargement, remplacez dans `index.html` :\n```html
<img src=\"https://images.unsplash.com/photo-1611100481087-2eb83c1dc219?w=1200&q=80\" alt=\"Grass\">
<img src=\"https://images.unsplash.com/photo-1589924691995-400dc9ecc0af?w=400&q=80\" alt=\"Maïs\">
<img src=\"https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80\" alt=\"Arachide\">
<img src=\"https://images.unsplash.com/photo-1605404122809-e12a42d391cc?w=400&q=80\" alt=\"Charbon\">
```

