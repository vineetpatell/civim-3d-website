from PIL import Image
import os
pub = r'f:\Clients\CIVI M Grains\civim-3d-website\public'
src = Image.open(os.path.join(pub, 'civim-grains-logo.png')).convert('RGBA')
print('logo size:', src.size)
src.resize((32, 32), Image.LANCZOS).save(os.path.join(pub, 'favicon-32x32.png'))
src.save(os.path.join(pub, 'favicon.ico'), sizes=[(16, 16), (32, 32), (48, 48)])
bg = Image.new('RGBA', (180, 180), (247, 244, 235, 255))
logo = src.resize((152, 152), Image.LANCZOS)
bg.alpha_composite(logo, (14, 14))
bg.convert('RGB').save(os.path.join(pub, 'apple-touch-icon.png'))
for f in ['favicon-32x32.png', 'favicon.ico', 'apple-touch-icon.png']:
    p = os.path.join(pub, f)
    print(f, os.path.getsize(p), 'bytes')
