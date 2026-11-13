# CLAUDE.md — Taximètre

## Informations du projet (vérifiées dans le dépôt)

| | |
|---|---|
| Nom | Taximètre (compteur de taxi GPS) |
| Stack | Capacitor 8, HTML/CSS/JS vanilla dans un seul fichier, Android |
| applicationId | `be.taximetre.app` (`capacitor.config.json` → `appId`) |
| Workflow | `.github/workflows/blank.yml` (« Build APK »), sur push `main`/`master`, tag `v*` ou lancement manuel |
| Signature | Keystore fixe intégré au workflow (alias `taximetre`), remplacé par les secrets `KEYSTORE_BASE64`, `KEYSTORE_PASSWORD`, `KEY_ALIAS`, `KEY_PASSWORD` s'ils existent |
| Version | `versionName` = `package.json` → `version` ; `versionCode` auto (horodatage) dans `scripts/patch-android.js` |
| Données locales | `localStorage` de la WebView : `tx_history`, `tx_settings`, `tx_tariff`, `tx_active`, `tx_sper` (via l'objet `store` de `src/index.html`) |
| Appareil cible | Xiaomi 17T Pro (HyperOS) |

### Structure
- `src/index.html` : **seul fichier à modifier** pour l'interface et la logique.
- `build.py` : intègre les images et polices en base64 → `www/index.html` (généré, ne pas éditer).
- `scripts/patch-android.js` : permissions, portrait, version, icônes, notification, correctif du plugin GPS.
- `android/` : absent du dépôt, recréé à chaque build.
- `assets/icon-*.png` : régénérés par le script de patch.

## Collaboration
- Je décris les fonctionnalités en français ; prends en charge la technique et réponds brièvement en français.
- Comprends d'abord la demande et les fichiers concernés. Ne relis pas tout le dépôt à chaque tâche.
- Modifications ciblées, réutilise l'existant. Pas de sous-agents ni d'opérations coûteuses sans bénéfice clair.
- Décision importante ou ambiguë : propose brièvement une solution et demande confirmation.

## Sécurité des mises à jour Android
- Ne change jamais `applicationId`, la clé de signature, le certificat ou le keystore sans mon accord explicite.
- N'ajoute pas un secret `KEYSTORE_BASE64` contenant une autre clé : cela casserait les mises à jour.
- Vérifie la signature existante avant une mise à jour. Si une clé est indisponible, signale-le ; n'en invente pas une nouvelle.
- `versionCode` doit augmenter à chaque mise à jour distribuée (déjà automatique) ; ajuste `versionName` dans `package.json` selon la convention semver.
- Préserve les données locales : ne renomme pas les clés `tx_*`, ne change pas leur format sans migration rétrocompatible, ne touche pas à `server.hostname` / `androidScheme` de Capacitor (changerait l'origine et rendrait le `localStorage` invisible).
- Ne désinstalle jamais l'application pour résoudre un problème de signature.
- Ne publie jamais de keystore, mot de passe, jeton ou secret dans le dépôt, les logs ou les réponses.

## GitHub et compilation
- Respecte le workflow existant ; ne le modifie pas sans nécessité expliquée.
- Avant un push, résume les fichiers modifiés et demande mon autorisation explicite.
- Après modification de `src/index.html`, lance `python3 build.py` pour vérifier que la génération passe.
- Échec de compilation : analyse les lignes d'erreur utiles et corrige la cause, sans relancer en boucle.
- Ne supprime ni historique Git, ni branche, ni données sans mon accord.

## Livraison de l'APK
- Après une compilation réussie, identifie l'APK final et donne en priorité un lien direct.
- Release (tag `v*`) : URL directe de l'asset `Taximetre.apk`. Ne crée pas de Release ni de tag sans autorisation.
- Artifact Actions (`Taximetre-apk`) : c'est une archive ZIP qui demande une connexion GitHub ; dis-le, et donne le lien précis de l'artifact du run.
- Ne fabrique jamais d'URL ; vérifie que le build a réussi et que le fichier existe.
- Compte rendu final : d'abord **Télécharger l'APK : [lien]**, puis la version et un bref résumé.

## Design et expérience utilisateur
- Interface cohérente, soignée, moderne, accessible et fluide ; priorité au Xiaomi 17T Pro (encoche caméra, zones sûres, barre d'état).
- Respecte la direction artistique existante (thème sombre `#0B0B0D`, jaune `#FFC400`, polices Outfit et Plus Jakarta Sans).
- Soigne la typographie, les espacements, les états de chargement/erreur, la navigation et les animations.
- Ne refonds pas les écrans non concernés par la demande.

## Optimisation
- Modifications minimales et précises ; recherche ciblée plutôt que lecture intégrale.
- Ne relis pas un fichier déjà analysé s'il n'a pas changé.
- Pas de refactorisation, de fichier inutile ni de compilation multiple non demandés.
- Ne sacrifie jamais le design, les animations, l'UX ou les fonctionnalités pour économiser des tokens.
- Ne supprime ni ne modifie aucune fonctionnalité existante sans demande explicite.
- Applique ces règles automatiquement, sans rappel.

## Points de vigilance connus
- Si le dépôt est public, la clé de signature intégrée au workflow est lisible par tous.
- Pas de `package-lock.json` et dépendances en `^` : un build peut casser à cause d'une mise à jour d'un paquet. `sharp` n'arrive qu'indirectement via `@capacitor/assets`.
- Le README cite `build-apk.yml` alors que le workflow s'appelle `blank.yml`.
