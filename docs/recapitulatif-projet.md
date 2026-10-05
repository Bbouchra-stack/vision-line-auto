# Vision Line Auto — Récapitulatif du projet

Document de passation, rédigé pour accompagner le code (utile si le projet est repris dans Claude Code, par un développeur, ou dans une future session). Complète `docs/design-system.md` (charte graphique détaillée) sans le remplacer.

Dernière mise à jour : 25 août 2026.

## 1. Le projet

Site vitrine statique, bilingue FR/AR, pour Vision Line Auto — atelier automobile à Tanger (peinture automobile, mécanique automobile, diagnostic automobile). Pas de CMS, pas de framework, pas d'étape de build : HTML/CSS/JS purs, pensés pour fonctionner aussi bien en ouverture locale (double-clic sur `index.html`) qu'une fois déployés sur un vrai serveur.

Domaine visé (pas encore acheté) : `visionlineauto.ma`. En attendant, le site a été testé via un lien de prévisualisation Netlify Drop et sauvegardé sur GitHub.

## 2. Charte graphique (résumé — détails dans `docs/design-system.md`)

- Palette dérivée du logo réel : Obsidienne `#0B0A08` (fond), Or Vision `#D4A64A` / Or clair `#F0C878` (accent), Chrome `#C6CBD1` (accent secondaire), Porcelaine `#F3EEE2` (texte clair).
- Typographie : Instrument Serif + Manrope en FR, Amiri + IBM Plex Sans Arabic en AR.
- Signature visuelle "Le Filet d'Or" : trait doré fin utilisé pour le hero, les séparateurs de section, les soulignements de liens, et les amorces d'angle (coins en L) sur les cadres photo.
- Radius quasi nul, espacements généreux, pas d'ombres portées lourdes — lecture "précision/blason", pas "SaaS arrondi".
- Toutes les animations respectent `prefers-reduced-motion`.

## 3. Structure du site

```
index.html                  Accueil FR
politique-cookies.html      Page cookies FR
ar/index.html               Accueil AR (miroir RTL complet)
ar/politique-cookies.html   Page cookies AR
favicon.svg
robots.txt
sitemap.xml
assets/
  css/style.css             Tout le CSS du site
  js/main.js                Header au scroll, menu mobile, carte Google Maps au clic, bannière cookies, etc.
  images/
    logo/                   Variantes du logo (clair/sombre, tailles)
    real/                   Photos réelles de l'atelier, retravaillées (voir section 4)
    clean/                  Anciens visuels (hérité d'une itération précédente)
docs/
  design-system.md          Charte graphique détaillée
  recapitulatif-projet.md   Ce document
```

Sections de la page d'accueil (ancres) : `#services` (Peinture / Mécanique / Diagnostic, chacune avec photo + description), `#atelier` (présentation de l'atelier, photo + texte), `#realisations` (galerie de 6 photos avec défilement horizontal), `#avis` (témoignages), `#contact` (coordonnées, carte Google Maps au clic, formulaire).

Éléments transverses : en-tête fixe avec logo, nav desktop (≥992px) / menu hamburger mobile, sélecteur FR/AR ; bouton WhatsApp flottant ; bannière de consentement cookies ; bouton "Demander un devis" qui apparaît dans l'en-tête au scroll (desktop uniquement, voir section 6).

Le site est un **catalogue de composants HTML/CSS quasi identique en FR et en AR** — toute modification de structure doit être répercutée dans les deux fichiers `index.html` (chemins relatifs adaptés : `assets/...` en FR, `../assets/...` en AR).

## 4. Traitement des photos

Deux approches de retouche ont été utilisées selon la qualité de la source, via des scripts Python (Pillow + numpy), tous dans `scripts/` (utilitaires ponctuels, ne font pas partie du site livré) :

- **`cinematic_grade()`** (traitement lourd : flou léger + net renforcé + grain + vignette forte + duotone) — pour les photos sources petites ou déjà dégradées (captures réseaux sociaux, exports basse résolution).
- **`light_grade()`** (traitement léger : pas de flou, net doux, pas de grain, vignette légère + duotone doux) — pour les photos sources déjà nettes et en haute résolution. **C'est le traitement de référence depuis le retour client "mauvaise résolution"** : ne jamais appliquer de flou/lissage à une photo déjà nette.
- **Correction de dominante bleue** : certaines photos avaient une forte dominante bleue (éclairage ambiant, reflet de ciel) qui jurait avec l'identité chaude du site. Solution : désaturation complète en niveaux de gris puis reconstruction du duotone or/obsidienne via des multiplicateurs de canaux (R×1.09, G×1.015, B×0.86) — plus fiable qu'une simple balance des blancs quand la dominante est incrustée dans les hautes lumières du matériau.
- **Recadrage** : format 4:5 pour les photos de service/atelier, 3:4 pour la galerie — toujours un recadrage centré ou suivant le sujet, jamais un simple redimensionnement qui déformerait l'image.

Toutes les photos actuellement **utilisées** sur le site (à vérifier avec `grep -o "assets/images/real/[a-zA-Z0-9_-]*\.(jpg|png)" index.html` si besoin) :

| Emplacement | Fichier |
|---|---|
| Service Peinture | `service-peinture-pistolet.jpg` |
| Service Mécanique | `service-mecanique-transmission.jpg` |
| Service Diagnostic | `service-diagnostic-obd.jpg` |
| Atelier (présentation) | `atelier-technicien-capot.jpg` |
| Galerie — Carrosserie | `atelier-vehicule-exterieur.jpg` |
| Galerie — Peinture | `atelier-carrosserie-teinte.jpg` |
| Galerie — Mécanique | `atelier-mecanique-intervention.jpg` |
| Galerie — Finition | `atelier-finition-optique.jpg` |
| Galerie — Diagnostic | `service-diagnostic-obd.jpg` (réutilisée) |
| Galerie — Entretien | `service-mecanique-transmission.jpg` (réutilisée) |

Le dossier `assets/images/real/` contient aussi d'anciennes versions non référencées (`atelier-capot-ouvert.jpg`, `atelier-carrosserie-avant.jpg`, `atelier-carrosserie-detail.jpg`, `atelier-mecanique-ratchet.jpg`, `atelier-moteur-technicien.jpg`, `service-mecanique-freins.jpg`, `service-peinture-carrosserie.jpg`, `atelier-diagnostic-interieur.jpg`) — sans risque pour le site (non chargées par le navigateur), mais peuvent être supprimées pour faire du ménage.

## 5. SEO

Présent en FR et en AR : meta description et keywords, `<link rel="canonical">`, `hreflang` (fr / ar / x-default), Open Graph, données structurées JSON-LD de type `AutoRepair` (nom, adresse, téléphone, horaires). `sitemap.xml` et `robots.txt` à la racine.

Point à surveiller : l'adresse dans le JSON-LD reste en français même sur la page arabe (`Route de Tétouan...`) — acceptable au Maroc mais pourrait être dupliquée en arabe pour un score SEO local optimal.

## 6. Historique des corrections apportées

- **Navigation cassée en ouverture locale (`file://`)** : les liens `href="ar/"`, `href="./"`, `href="../"` résolvaient vers des listages de dossiers au lieu de `index.html`. Corrigé partout avec des noms de fichiers explicites.
- **Logo/texte du header tronqué** : l'effet de brillance décoratif utilisait `overflow:hidden` sur tout le bloc marque, rognant le texte au resserrement. Isolé sur un `.brand-mark` dédié autour du logo seul.
- **Traduction arabe incorrecte** : "الحساس" (mauvais terme) remplacé par "المستشعر" (capteur, terme correct) dans la description des services.
- **Carte Google Maps précisée** avec le paramètre `ftid` exact du client, + lien de secours "Ouvrir directement dans Google Maps" ajouté.
- **Plusieurs vagues de remplacement de photos** basse résolution par des photos nettes fournies par le client (services, section atelier, galerie), avec homogénéisation des couleurs (voir section 4).
- **Bug mobile important (25 août)** : après un scroll sur téléphone, le bouton "Demander un devis" apparaissant dans l'en-tête poussait le bouton menu (hamburger) hors de l'écran — rendant la navigation mobile inaccessible après le premier scroll, en FR et en AR, sur tous les téléphones testés (jusqu'à 320px de large). Corrigé : le bouton CTA est maintenant masqué sous 992px (le menu mobile et le bouton WhatsApp flottant couvrent le même besoin), et l'espacement de l'en-tête a été resserré sur les très petits écrans.
- **Photo de galerie "Diagnostic" non mise à jour** : référençait encore une ancienne image floue (`atelier-diagnostic-interieur.jpg`, 304×778) alors qu'une version nette du même sujet (`service-diagnostic-obd.jpg`) était déjà utilisée ailleurs sur le site. Corrigé.

## 7. Déploiement et sauvegardes

- **Aperçu client (Netlify Drop)** : `sunny-cheesecake-15d786.netlify.app` — nécessite de re-glisser manuellement le contenu du site sur [app.netlify.com/drop](https://app.netlify.com/drop) à chaque mise à jour pour que le lien reflète la dernière version.
- **Sauvegarde du code (GitHub)** : [github.com/Bbouchra-stack/vision-line-auto](https://github.com/Bbouchra-stack/vision-line-auto) — dépôt créé le 25 août par upload manuel (glisser-déposer). Une tentative d'automatiser les envois futurs depuis l'environnement cloud de Cowork a échoué : cet environnement n'a pas d'accès réseau sortant vers GitHub (restriction volontaire de la plateforme, pas un problème de configuration). Un jeton d'accès personnel (`Claude - vision-line-auto`, accès en lecture/écriture limité à ce dépôt, expire le 23/11/2026) a été généré côté client mais n'a pas pu être exploité pour cette raison. **Piste recommandée pour la suite** : GitHub Desktop (déjà évoqué avec le client) ou, puisque Claude Code est maintenant installé sur son PC avec Git et Node.js, une synchronisation directe depuis Claude Code (qui, exécuté localement, a un accès réseau normal contrairement à cet environnement cloud).
- Le dossier de travail de référence sur le PC du client : `C:\Users\hp\Desktop\DIVERS PROJETS SITES WEB\SITE VISION LINE AUTO`.

## 8. Reste à faire / recommandations

1. Compresser davantage les 4 photos les plus récentes (300 à 490 Ko chacune) pour réduire le poids total de la page (~2,9 Mo actuellement) sans perte visible.
2. Envisager une grille de services à 2 colonnes sur tablette portrait (768–860px) plutôt que la colonne unique actuelle, pour mieux exploiter l'espace.
3. Resserrer visuellement les légendes de la galerie sur les très petits mobiles (catégorie et description un peu collées).
4. Dupliquer l'adresse en arabe dans les données structurées JSON-LD de la page AR (optionnel, SEO local).
5. Remplacer les témoignages génériques par de vrais avis Instagram/Facebook du client, une fois fournis.
6. Aucune photo dédiée "vidange en cours" n'a été fournie — la section Entretien réutilise actuellement la photo de transmission ; à remplacer si une photo plus spécifique est fournie.
7. Mettre en place une méthode de sauvegarde GitHub simple et répétable (GitHub Desktop ou Claude Code local) avant l'achat du nom de domaine et de l'hébergement.
8. Vérification finale une fois déployé sur le vrai domaine (carte Google Maps, formulaire de contact FormSubmit — nécessite un premier clic de confirmation par email du client).
