import os
import re

file_path = r'c:\Users\comun\OneDrive\Documentos\GitHub\Grupos\Orden Servicio.html'

try:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Surgical replacements for stubborn mojibake
    content = content.replace('DÃ A', 'DÍA')
    content = content.replace('DÃ\xa0A', 'DÍA')
    content = re.sub(r'DÃ\s*A', 'DÍA', content)
    content = content.replace('MENÃš', 'MENÚ')
    content = content.replace('NÂº', 'Nº')
    content = content.replace('â€”', '—')
    content = content.replace('â€"', '—')
    content = content.replace('€”', '—')
    
    # Global replacement for common ones
    content = content.replace('ORDEN DE SERVICIO —', 'ORDEN DE SERVICIO Nº')
    content = content.replace('ORDEN DE SERVICIO –', 'ORDEN DE SERVICIO Nº')
    
    # Adjust column widths while we're at it
    content = content.replace('style="width: 47%">MENÚ', 'style="width: 45%">MENÚ')
    content = content.replace('style="width: 10%">HORA', 'style="width: 12%">HORA')

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Successfully updated Orden Servicio.html with surgical regex")
except Exception as e:
    print(f"Error: {e}")
