path = r'c:\Users\comun\Documents\GitHub\Grupos\Orden Servicio.html'

with open(path, 'r', encoding='utf-8') as f:
    text = f.read()

# Fix the double newline issue
# If it's \n\n or \r\n\r\n
import re
text = re.sub(r'\n\s*\n', '\n', text)

with open(path, 'w', encoding='utf-8', newline='\n') as f:
    f.write(text)

print("Success")
