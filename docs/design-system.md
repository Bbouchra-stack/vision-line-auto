# Vision Line Auto — Design System

Direction : sobre, doré, ancré dans le logo réel (pas un vocabulaire "dashboard"). Validé avec le client le 17/08/2026.

## Palette (dérivée du logo)

| Nom | Hex | Usage |
|---|---|---|
| Obsidienne | `#0B0A08` | Fond principal |
| Encre | `#15120E` | Surfaces élevées / cartes |
| Encre claire | `#1E1A14` | Hover de cartes |
| Or Vision | `#D4A64A` | Accent principal, liens, bordures fines |
| Or clair | `#F0C878` | Highlights, dégradés, hover |
| Or profond | `#9C7024` | Ombres sur éléments dorés |
| Chrome | `#C6CBD1` | Accent secondaire (mécanique/diagnostic) |
| Porcelaine | `#F3EEE2` | Texte clair sur fond sombre |
| Porcelaine atténuée | `#C9C2B2` | Texte secondaire sur fond sombre |

## Typographie

- Display FR : **Instrument Serif** — titres, grande taille, italique pour les accents
- Corps FR / UI : **Manrope** — texte courant, labels trackés en majuscules
- Display AR : **Amiri** — même rôle éditorial que Instrument Serif
- Corps AR : **IBM Plex Sans Arabic**

## Signature — "Le Filet d'Or"

Un filet doré fin, littéralement le nom de la marque (Vision *Line*) et le motif de pouls du logo, décliné sobrement :
- Se dessine (scaleX 0→1) sous le titre du hero à l'ouverture
- Sépare les sections comme un simple trait, avec un petit losange centré (écho aux bannières du blason du logo)
- Devient soulignement au survol des liens/boutons
- Forme des amorces d'angle (coins en L) sur les cadres photo, comme un sceau

Pas d'effet "moniteur clignotant" — mouvement discret, une fois au chargement, puis au scroll (reveal), rien de permanent qui clignote.

## Layout

- Radius quasi nul (2–4px) : lecture "précision/blason", pas SaaS arrondi
- Espacements généreux (échelle 8–144px), sections aérées
- Cartes/services : panneaux à liseré or fin, pas d'ombres portées lourdes
- Photos réelles encadrées d'un filet or avec amorces d'angle, jamais pleine largeur agressive vu leur résolution limitée

## Mouvement

- Easing signature : `cubic-bezier(0.22, 1, 0.36, 1)`
- Séquence d'entrée hero orchestrée une fois (emblème → titre → filet → CTA), ~1.2s
- Reveal au scroll : fade + translateY(16px), léger décalage entre éléments
- `prefers-reduced-motion` : toutes les animations passent à l'état final instantané
