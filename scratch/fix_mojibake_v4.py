import os
import re

def clean_mojibake(content):
    # This function handles the most common double-encoding patterns
    # pattern: utf-8 bytes interpreted as windows-1252 and then encoded to utf-8 again
    
    replacements = [
        # Double encoded UTF-8 sequences
        (b'\xc3\x82\xc2\xa0', b' '), # Non-breaking space
        (b'\xc3\x83\xc2\x81', b'\xc3\x81'), # Á
        (b'\xc3\x83\xc2\x89', b'\xc3\x89'), # É
        (b'\xc3\x83\xc2\x8d', b'\xc3\x8d'), # Í
        (b'\xc3\x83\xc2\x93', b'\xc3\x93'), # Ó
        (b'\xc3\x83\xc2\x9a', b'\xc3\x9a'), # Ú
        (b'\xc3\x83\xc2\x91', b'\xc3\x91'), # Ñ
        (b'\xc3\x83\xc2\xa1', b'\xc3\xa1'), # á
        (b'\xc3\x83\xc2\xa9', b'\xc3\xa9'), # é
        (b'\xc3\x83\xc2\xad', b'\xc3\xad'), # í
        (b'\xc3\x83\xc2\xb3', b'\xc3\xb3'), # ó
        (b'\xc3\x83\xc2\xba', b'\xc3\xba'), # ú
        (b'\xc3\x83\xc2\xb1', b'\xc3\xb1'), # ñ
        (b'\xc3\x82\xc2\xba', b'\xc2\xba'), # º
        (b'\xc3\x83\xc2\xa2\xc3\xa2\xe2\x82\xac\xe2\x80\x9d', b'\xe2\x80\x94'), # em-dash
        (b'\xc3\x82\xc2\xbf', b'\xc2\xbf'), # ¿
        (b'\xc3\x83\xc2\x97', b'\xc3\x97'), # ×
        
        # Specific em-dash mojibake from screenshot: Â€” (E2 80 94 in UTF-8)
        # interpreted as E2=Â, 80=€, 94=”
        (b'\xc3\xa2\xe2\x82\xac\xe2\x80\x9d', b'-'), # Hard replace with simple dash
        (b'\xc3\x82\xe2\x80\x94', b'-'),
        
        # Other common ones
        (b'\xc3\x83\xc2\x8d', b'\xc3\x8d'), # Í
        (b'\xc3\x83\xc2\xba', b'\xc3\xba'), # ú
        (b'\xc3\x83\xc2\xad', b'\xc3\xad'), # í
    ]
    
    for old, new in replacements:
        content = content.replace(old, new)
    
    return content

def process_file(path):
    with open(path, 'rb') as f:
        content = f.read()
    
    new_content = clean_mojibake(content)
    
    # If the file is HTML, we might want to escape some things just in case
    # but for now let's just do the clean up.
    
    if new_content != content:
        with open(path, 'wb') as f:
            f.write(new_content)
        return True
    return False

files_to_fix = [
    r'c:\Users\comun\Documents\GitHub\Grupos\Orden Servicio.html',
    r'c:\Users\comun\Documents\GitHub\Grupos\Fac Prof.html',
    r'c:\Users\comun\Documents\GitHub\Grupos\js\GestionGrupos.js',
    r'c:\Users\comun\Documents\GitHub\Grupos\Admin.html',
    r'c:\Users\comun\Documents\GitHub\Grupos\js\Admin.js'
]

for p in files_to_fix:
    if os.path.exists(p):
        changed = process_file(p)
        print(f"{p}: {'Fixed' if changed else 'No changes needed'}")
    else:
        print(f"{p}: Not found")
