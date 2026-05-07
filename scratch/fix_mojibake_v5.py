import os

def fix_file(path):
    with open(path, 'rb') as f:
        content = f.read()
    
    # Specific icons and emojis
    replacements = [
        (b'\xe2\x80\x94', b'-'), # em-dash to simple dash
        (b'\xc3\xa2\xe2\x82\xac\xe2\x80\x9d', b'-'), # mojibake em-dash
        (b'\xc3\x82\xe2\x80\x94', b'-'), # Â—
        (b'\xc3\xa2\xc2\x9a\xc2\xa0\xc3\xaf\xc2\xb8\xc2\x8f', '⚠️'.encode('utf-8')),
        (b'\xe2\x9a\xa0\xef\xb8\x8f', '⚠️'.encode('utf-8')),
        (b'âš\xa0ï¸\x8f'.encode('utf-8'), '⚠️'.encode('utf-8')),
    ]
    
    for old, new in replacements:
        content = content.replace(old, new)
    
    with open(path, 'wb') as f:
        f.write(content)

os_path = r'c:\Users\comun\Documents\GitHub\Grupos\Orden Servicio.html'
js_path = r'c:\Users\comun\Documents\GitHub\Grupos\js\Admin.js'

fix_file(os_path)
fix_file(js_path)

print("Done")
