# Taximètre

Compteur de taxi GPS pour Android. Interface sombre, animation de lancement avec le logo, tarifs jour et nuit, historique des courses avec tracé et reçu partageable.

## Obtenir l'APK via GitHub

1. Crée un dépôt sur GitHub et envoie tout le contenu de ce dossier (le dossier `.github` compris).
2. Ouvre l'onglet **Actions**. Le workflow **Build APK** se lance à chaque push sur `main`.
3. Une fois terminé (environ 5 min), ouvre le run et télécharge **Taximetre-apk** en bas de la page.
4. Pour une release avec l'APK attaché : crée un tag `v1.0.0` et pousse-le (`git tag v1.0.0 && git push --tags`).

### Signature

Le workflow signe chaque APK avec la même clé permanente, intégrée dans `build-apk.yml`. Les mises à jour s'installent par-dessus l'ancienne version, sans désinstaller. Le numéro de version augmente à chaque build.

Ne change jamais cette clé ni l'identifiant `be.taximetre.app`, sinon Android refusera la mise à jour.

Si ton dépôt est public, n'importe qui peut lire la clé. Mets le dépôt en privé, ou ajoute tes propres secrets `KEYSTORE_BASE64`, `KEYSTORE_PASSWORD`, `KEY_ALIAS`, `KEY_PASSWORD` dans **Settings → Secrets and variables → Actions**.

## Installer sur le Xiaomi 17T Pro

1. Télécharge l'APK sur le téléphone et ouvre-le. Autorise l'installation depuis cette source.
2. Au premier lancement, accepte la localisation **précise**.
3. HyperOS coupe les apps en arrière-plan. Va dans **Paramètres → Applis → Taximètre → Économiseur de batterie** et choisis **Aucune restriction**.
4. Garde l'option **Écran toujours allumé** active : le compteur fonctionne écran allumé, téléphone sur support.

## Fonctionnement

- **Prix** = prise en charge + km × tarif + temps d'attente × tarif horaire.
- Sous le **seuil d'attente** (10 km/h par défaut), le compteur facture le temps au lieu de la distance.
- Le tarif se verrouille au démarrage d'une course. Le mode **Nuit automatique** choisit T2 entre 22 h et 6 h.
- **Terminer** demande un appui long, pour éviter un arrêt accidentel.
- Le filtre GPS ignore les positions imprécises (> 40 m) et les sauts impossibles.
- Une course interrompue (app fermée) revient en pause au prochain lancement.
- **Mode démo** dans les réglages : simule un trajet pour tester sans rouler.

## Modifier l'app

Le code de l'interface tient dans `src/index.html`. Après modification :

```bash
python3 build.py   # régénère www/index.html avec le logo intégré
```

Pour compiler en local avec Android Studio : `npm install && npm run android:prepare && npx cap open android`.

## Structure

```
src/index.html              interface (HTML/CSS/JS)
build.py                    injecte les calques du logo → www/index.html
assets/                     logo, calques de l'animation, icône, splash
capacitor.config.json       config Capacitor
scripts/patch-android.js    permissions GPS, portrait, version
.github/workflows/          compilation automatique de l'APK
```
