"""Injecte logo, voiture et polices (base64) dans src/index.html -> www/index.html"""
import base64, pathlib
root = pathlib.Path(__file__).parent
html = (root / 'src/index.html').read_text(encoding='utf-8')
def uri(f, mime='image/png'):
    return f'data:{mime};base64,' + base64.b64encode((root / 'assets' / f).read_bytes()).decode()
imgs = {'LAYER_BASE': 'layer-base.png', 'LAYER_CAR': 'layer-car.png', 'LAYER_NEEDLE': 'layer-needle.png',
        'LOGO_FULL': 'logo-mask.png', 'CAR_MASK': 'car-mask.png'}
fonts = {'FONT_J500': 'plus-jakarta-sans-latin-500', 'FONT_J600': 'plus-jakarta-sans-latin-600',
         'FONT_J700': 'plus-jakarta-sans-latin-700', 'FONT_J800': 'plus-jakarta-sans-latin-800',
         'FONT_O600': 'outfit-latin-600', 'FONT_O700': 'outfit-latin-700', 'FONT_O800': 'outfit-latin-800'}
for k, f in imgs.items():
    html = html.replace(k, uri(f))
def font_uri(f):
    name = f + '-normal.woff2'
    local = root / 'assets' / 'fonts' / name
    if not local.exists():
        pkg = 'outfit' if f.startswith('outfit') else 'plus-jakarta-sans'
        local = root / 'node_modules' / '@fontsource' / pkg / 'files' / name
    return 'data:font/woff2;base64,' + base64.b64encode(local.read_bytes()).decode()
for k, f in fonts.items():
    html = html.replace(k, font_uri(f))
(root / 'www').mkdir(exist_ok=True)
(root / 'www/index.html').write_text(html, encoding='utf-8')
print('www/index.html', len(html) // 1024, 'Ko')
