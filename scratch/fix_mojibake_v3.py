import os

def fix_file(path):
    with open(path, 'rb') as f:
        content = f.read()
    
    # Specific mojibake strings (using .encode('utf-8') on strings)
    replacements = [
        (b'\xc3\x83\xc2\xa2\xc3\x85\xe2\x80\x9c\xc3\xa2\xe2\x82\xac\xc2\xa2', '✖'.encode('utf-8')), # Ã¢Å“â€¢ -> ✖
        (b'\xc3\xa2\xc2\x9c\xc2\x96', '✖'.encode('utf-8')),
        (b'\xc3\x83\xc2\xa2\xc3\xa2\xe2\x82\xac\xe2\x80\x9d', '—'.encode('utf-8')),
        
        ('Ã¢Å“â€¢'.encode('utf-8'), '✖'.encode('utf-8')),
        ('Ã¢â€¢Â '.encode('utf-8'), b''),
        ('Ã¢â€ â‚¬'.encode('utf-8'), b''),
        ('Ã¢â€ â€™'.encode('utf-8'), '->'.encode('utf-8')),
        ('Ãƒâ€˜A'.encode('utf-8'), 'ÑA'.encode('utf-8')),
        ('Ãƒâ€œN'.encode('utf-8'), 'ÓN'.encode('utf-8')),
        ('Ãƒâ€”'.encode('utf-8'), '×'.encode('utf-8')),
        ('nÃºmero'.encode('utf-8'), 'número'.encode('utf-8')),
        ('menÃº'.encode('utf-8'), 'menú'.encode('utf-8')),
        ('NÂº'.encode('utf-8'), 'Nº'.encode('utf-8')),
        ('Â¿'.encode('utf-8'), '¿'.encode('utf-8')),
        ('Ãƒâ€˜'.encode('utf-8'), 'Ñ'.encode('utf-8')),
        ('Ãƒâ€œ'.encode('utf-8'), 'Ó'.encode('utf-8')),
        ('ÃƒÂ '.encode('utf-8'), 'Á'.encode('utf-8')),
        ('Ãƒâ€°'.encode('utf-8'), 'É'.encode('utf-8')),
        ('ÃƒÂ '.encode('utf-8'), 'Í'.encode('utf-8')),
        ('ÃƒÅ¡'.encode('utf-8'), 'Ú'.encode('utf-8')),
        ('ÃƒÂ¡'.encode('utf-8'), 'á'.encode('utf-8')),
        ('ÃƒÂ©'.encode('utf-8'), 'é'.encode('utf-8')),
        ('ÃƒÂ\xad'.encode('utf-8'), 'í'.encode('utf-8')),
        ('ÃƒÂ³'.encode('utf-8'), 'ó'.encode('utf-8')),
        ('ÃƒÂº'.encode('utf-8'), 'ú'.encode('utf-8')),
        ('ÃƒÂ±'.encode('utf-8'), 'ñ'.encode('utf-8')),
        ('ï¼‹'.encode('utf-8'), '＋'.encode('utf-8')),
        ('â†º'.encode('utf-8'), '↺'.encode('utf-8')),
        ('Ã¢â‚¬â€ '.encode('utf-8'), '—'.encode('utf-8')),
    ]
    
    for old, new in replacements:
        content = content.replace(old, new)
    
    with open(path, 'wb') as f:
        f.write(content)

os_path = r'c:\Users\comun\Documents\GitHub\Grupos\Orden Servicio.html'
fac_path = r'c:\Users\comun\Documents\GitHub\Grupos\Fac Prof.html'

fix_file(os_path)
fix_file(fac_path)

print("Done")
