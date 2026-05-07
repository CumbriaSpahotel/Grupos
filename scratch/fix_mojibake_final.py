import os

path = r'c:\Users\comun\Documents\GitHub\Grupos\Orden Servicio.html'

with open(path, 'rb') as f:
    content = f.read()

# Replace any sequence of non-ascii chars that are likely mojibake
# or just the specific ones we know

content = content.replace(b'\xc3\x83\xc2\x83\xc3\x82\xc2\x8d', b'\xc3\x8d') # Double Í
content = content.replace(b'\xc3\x83\xc2\x83\xc3\x82\xc2\x9a', b'\xc3\x9a') # Double Ú
content = content.replace(b'\xc3\x83\xc2\xa2\xc3\xa2\xe2\x82\xac\xe2\x80\x9d', b'\xe2\x80\x94') # em-dash
content = content.replace(b'\xc3\x83\xc2\xa2\xc3\xa2\xc2\x9c\xc2\x93', b'\xe2\x9c\x93') # check

# Clean up the specific lines by finding them
lines = content.split(b'\n')
for i in range(len(lines)):
    if b'Imprimir / PDF' in lines[i]:
        lines[i] = b'                \xf0\x9f\x96\xa8\xef\xb8\x8f Imprimir / PDF'
    if b'ORDEN DE SERVICIO' in lines[i]:
        lines[i] = lines[i].replace(b'\xc3\xa2\xe2\x82\xac\xe2\x80\x9d', b'\xe2\x80\x94')
        lines[i] = lines[i].replace(b'\xc3\x83\xc2\xa2\xc3\xa2\xe2\x82\xac\xe2\x80\x9d', b'\xe2\x80\x94')
        # Hard fix for line 113
        if b'ORDEN DE SERVICIO' in lines[i]:
             lines[i] = b'            <h1 class="editable" contenteditable="true" id="informe-title" oninput="triggerSave()" style="margin-bottom: 0;">ORDEN DE SERVICIO \xe2\x80\x94 <span id="title-reserva">---</span></h1>'

    if b'width: 15%' in lines[i] and b'D' in lines[i]:
        lines[i] = b'                    <th style="width: 15%">D\xc3\x8dA</th>'

with open(path, 'wb') as f:
    f.write(b'\n'.join(lines))

print("Success")
