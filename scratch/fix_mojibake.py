import re

path = r'c:\Users\comun\Documents\GitHub\Grupos\Orden Servicio.html'

# These are the patterns as they appear in the file when read as UTF-8
# but they represent corrupted UTF-8 sequences.
# However, the easiest is to replace the WHOLE line or a large unique part.

with open(path, 'r', encoding='utf-8', errors='ignore') as f:
    lines = f.readlines()

def fix_line(line_idx, expected_text, contains=None):
    if line_idx < len(lines):
        if contains is None or contains in lines[line_idx]:
            # Preservation of indentation
            indent = re.match(r'^\s*', lines[line_idx]).group(0)
            lines[line_idx] = indent + expected_text + '\n'
            return True
    return False

# Line 117 (0-indexed 116): Printer icon
fix_line(116, '    🖨️ Imprimir / PDF', 'Imprimir / PDF')

# Line 127 (0-indexed 126): Title
fix_line(126, '<h1 class="editable" contenteditable="true" id="informe-title" oninput="triggerSave()" style="margin-bottom: 0;">ORDEN DE SERVICIO — <span id="title-reserva">---</span></h1>', 'ORDEN DE SERVICIO')

# Line 152 (0-indexed 151): DÍA
fix_line(151, '<th style="width: 15%">DÍA</th>', 'width: 15%')

# Line 165 (0-indexed 164): Añadir
fix_line(164, '<button onclick="addRowPlan(\'\', \'\', \'\', \'\', \'\')" class="text-[10px] uppercase font-bold text-amber-600 hover:text-amber-800 tracking-wider bg-amber-50 px-2 py-1 rounded border border-amber-200 shadow-sm">+ Añadir servicio</button>', '+ A')

# Line 185 (0-indexed 184): Añadir
fix_line(184, '<button onclick="addRowIncidencia(\'\', \'\', \'\', \'\')" class="text-[10px] uppercase font-bold text-amber-600 hover:text-amber-800 tracking-wider bg-amber-50 px-2 py-1 rounded border border-amber-200 shadow-sm">+ Añadir incidencia</button>', '+ A')

# Line 192 (0-indexed 191): aquí
fix_line(191, '<li>Detalles operativos aquí...</li>', 'Detalles operativos')

# Global replacements for common patterns
full_text = "".join(lines)
replacements = [
    ('â€”', '—'),
    ('DÃ A', 'DÍA'),
    ('MENÃš', 'MENÚ'),
    ('MENÃšS', 'MENÚS'),
    ('NÂº PAX', 'Nº PAX'),
    ('AÃ±adir', 'Añadir'),
    ('aquÃ­', 'aquí'),
    ('parÃ¡metros', 'parámetros'),
    ('fÃ¡brica', 'fábrica'),
    ('RÃ©gimen', 'Régimen'),
    ('confirmaciÃ³n', 'confirmación'),
    ('Proforma', 'Proforma'),
    ('GestiÃ³n', 'Gestión'),
    ('Inteligente', 'Inteligente'),
]

for old, new in replacements:
    full_text = full_text.replace(old, new)

# Final cleanup of my specific printer mess
full_text = re.sub(r'Ã°Å¸â€“Â¨Ã¯Â¸Â\s+ðŸ–¨ï¸\s+', '🖨️ ', full_text)

with open(path, 'w', encoding='utf-8') as f:
    f.write(full_text)

print("Success")
