// Ajoute permissions GPS, orientation portrait, numéro de version et génère les icônes (voiture seule)
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const pkg = require(path.join(root, 'package.json'));

const manifest = path.join(root, 'android/app/src/main/AndroidManifest.xml');
let m = fs.readFileSync(manifest, 'utf8');
const perms = [
  '<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />',
  '<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />',
  '<uses-permission android:name="android.permission.VIBRATE" />',
  '<uses-permission android:name="android.permission.WAKE_LOCK" />',
  '<uses-feature android:name="android.hardware.location.gps" android:required="false" />'
].filter(p => !m.includes(p.match(/name="([^"]+)"/)[1]));
m = m.replace('</manifest>', '    ' + perms.join('\n    ') + '\n</manifest>');
if (!m.includes('screenOrientation')) m = m.replace('<activity', '<activity\n            android:screenOrientation="portrait"');
fs.writeFileSync(manifest, m);

const gradle = path.join(root, 'android/app/build.gradle');
let g = fs.readFileSync(gradle, 'utf8');
const code = parseInt(process.env.GITHUB_RUN_NUMBER || '1', 10);
g = g.replace(/versionCode \d+/, `versionCode ${code}`).replace(/versionName "[^"]*"/, `versionName "${pkg.version}"`);
fs.writeFileSync(gradle, g);
console.log(`Android patché : versionCode ${code}, versionName ${pkg.version}`);

// Icônes : voiture jaune sur fond noir, générées depuis assets/car-mask.png
(async () => {
  const sharp = require('sharp');
  const A = (f) => path.join(root, 'assets', f);
  const BG = { r: 11, g: 11, b: 13, alpha: 1 };
  async function car(width) {
    const alpha = await sharp(A('car-mask.png')).resize({ width, kernel: 'lanczos3' }).extractChannel('alpha').raw().toBuffer({ resolveWithObject: true });
    const { width: w, height: h } = alpha.info;
    const rgb = Buffer.alloc(w * h * 3);
    for (let i = 0; i < w * h; i++) { rgb[i * 3] = 255; rgb[i * 3 + 1] = 196; rgb[i * 3 + 2] = 0; }
    const img = await sharp(rgb, { raw: { width: w, height: h, channels: 3 } }).joinChannel(alpha.data, { raw: { width: w, height: h, channels: 1 } }).png().toBuffer();
    return { img, w, h };
  }
  const big = await car(760);
  await sharp({ create: { width: 1024, height: 1024, channels: 4, background: BG } })
    .composite([{ input: big.img, left: (1024 - big.w) >> 1, top: (1024 - big.h) >> 1 }]).flatten({ background: BG }).png().toFile(A('icon-only.png'));
  const fg = await car(600);
  await sharp({ create: { width: 1024, height: 1024, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([{ input: fg.img, left: (1024 - fg.w) >> 1, top: (1024 - fg.h) >> 1 }]).png().toFile(A('icon-foreground.png'));
  await sharp({ create: { width: 1024, height: 1024, channels: 3, background: BG } }).png().toFile(A('icon-background.png'));
  console.log('Icônes générées (voiture seule)');
})().catch(e => { console.error('Erreur icônes :', e); process.exit(1); });
