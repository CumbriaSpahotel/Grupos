# Despliegue aislado de la administración de usuarios de Nexus Groups
# Ejecutar SOLO desde la rama security/firebase-auth-migration-20261122,
# con Firebase CLI instalado y sesión administrativa autenticada.
# No modifica reglas Firestore, Hosting ni funciones de correo/pagos.
$ErrorActionPreference = "Stop"
$expected = "security/firebase-auth-migration-20261122"
$current = (git branch --show-current).Trim()
if ($current -ne $expected) { throw "Rama incorrecta: $current. Se requiere $expected" }
if (-not (Get-Command firebase -ErrorAction SilentlyContinue)) { throw "Instala Firebase CLI y ejecuta firebase login." }
if ((git status --porcelain).Length -gt 0) { throw "El repositorio tiene cambios sin guardar. Revisa antes de desplegar." }
Write-Host "Proyecto fijo: gest-grupos-hotel" -ForegroundColor Yellow
Write-Host "Funciones: nexusListUsers, nexusCreateUser, nexusLinkUser, nexusUpdateUser, nexusResetUser" -ForegroundColor Yellow
Write-Host "No se desplegarán reglas, Hosting ni otras funciones."
$answer = Read-Host "Escribe DESPLEGAR-USUARIOS para confirmar"
if ($answer -cne "DESPLEGAR-USUARIOS") { throw "Cancelado: no hay cambios." }
firebase deploy --project gest-grupos-hotel --only "functions:nexusListUsers,functions:nexusCreateUser,functions:nexusLinkUser,functions:nexusUpdateUser,functions:nexusResetUser"
if ($LASTEXITCODE -ne 0) { throw "Despliegue fallido. Revisa Firebase Console y logs." }
Write-Host "Despliegue solicitado. Verifica permisos con cuenta administradora y usuario sin permiso." -ForegroundColor Green
