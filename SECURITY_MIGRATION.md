# Nexus Groups — migración de seguridad (BORRADOR, NO DESPLEGAR)

Estado de producción comprobado por el usuario el 22-11-2026: Firestore cerrado con `allow read, write: if false`; la interfaz muestra **BD Offline**. Mantener cerrado hasta completar migración y pruebas.

## Hallazgos de código (rama main)

- `js/firebase-init.js` inicializa Firestore pero no la sesión de Firebase Authentication.
- `js/navigation.js` obtiene la identidad de `nexus_user` / `nexus_session` en almacenamiento del navegador; esto NO es una identidad verificable en reglas.
- `js/Configuracion.js` contiene clave PIN predeterminada 1234 y el directorio de usuarios reside en `settings/main`.
- `js/services/agencyDepositService.js` realiza escrituras económicas desde cliente, incluso transacciones.
- Las reglas `firestore.rules` de main están desfasadas: se ve `if true` en grupos/configuración, pero las reglas activas de producción fueron cerradas desde la consola.

## Secuencia segura y sin pérdida de datos

1. Exportar/copiar Firestore desde Google Cloud antes de cambios y guardar copia independiente.
2. Activar proveedor Email/Password en Firebase Auth, confirmar los 4 UID reales y quitar o deshabilitar cuentas de prueba no utilizadas; jamás publicar contraseñas ni tokens.
3. Crear documentos `access_members/{uid}` SOLO con Admin SDK o consola privilegiada, con `{active: true, role: 'admin'|'direction'|'commercial'}`. Hacerlo para cada UID real; NO usar nombres ni correos almacenados en el navegador para autorizar.
4. Crear flujo de login Auth (signInWithEmailAndPassword, onAuthStateChanged, signOut) que espere usuario autenticado Y membresía activa antes de iniciar suscripciones. No habilitar persistencia offline de escritura sin controles de sincronización.
5. Retirar claves PIN y directorio sensible de `settings/main`; no copiar PIN a documentos legibles por otros empleados. Revocar y sustituir las claves predeterminadas.
6. Separar datos de configuración públicos dentro del equipo y datos administrativos, con reglas por colección y campo.
7. Trasladar a Cloud Functions las escrituras de estados de pago, depósitos, importes cobrados, referencias PayGold y conciliaciones. Las funciones deben comprobar Auth, membresía, rol, importe, pedido, titularidad del comercio, idempotencia y firma bancaria donde corresponda.
8. Probar con Firebase Emulator Suite: anónimo, UID inexistente, usuario revocado, comercial, dirección y admin; probar lectura/escritura/denegaciones e integridad de las transacciones.
9. Publicar conjuntamente el frontend autenticado y las reglas finales; verificar lectura, edición, pagos y acceso denegado desde un dispositivo ajeno.
10. Analizar registros y pagos previos al bloqueo por posibles alteraciones; desplegar rollback seguro que no reabra accesos públicos.

El archivo `firestore.auth-staging.rules` NO aparece en firebase.json y no se despliega automáticamente. Es deliberadamente **de solo lectura parcial**. No debe utilizarse tal cual como solución final ni activarse en producción.

## Criterios de aceptación

- Usuario anónimo o no autorizado: sin acceso a Firestore.
- El usuario comercial puede consultar y editar solo los datos comerciales permitidos, no cambiar estado bancario ni historial de depósitos.
- Dirección puede gestionar reservas según permisos, pero no inventar una confirmación Redsys.
- Solo el servidor, tras validar el pago contra fuente bancaria fiable, declara una operación cobrada.
- La aplicación NO muestra «BD Online» antes de verificar una lectura autorizada.
- Las contraseñas/PIN no aparecen en Firestore accesible a personal común ni en código publicado.


## Panel unificado de usuarios — implementación en esta rama

- `Usuarios.html` sustituye al antiguo directorio basado en PIN: lista las identidades asociadas, permite altas, cambios de rol, revocación/reactivación y genera enlaces privados para restablecer claves.
- `functions/nexus-users.js` contiene cuatro funciones callable con Firebase Admin SDK. Solo un UID autenticado, activo y con rol `admin` en `access_members` puede ejecutarlas. No devuelve contraseñas.
- `functions/index.js` exporta las funciones. No se desplegaron.
- `Configuracion.html` envía la antigua pestaña de usuarios a `Usuarios.html`; `js/navigation.js` sustituye el cambio de PIN antiguo por restablecimiento gestionado por Firebase.

### Puesta en marcha administrativa (requiere acceso al proyecto Firebase)

1. Hacer copia de seguridad. Verificar que la cuenta admin de Authentication existe y está habilitada.
2. Con una credencial administrativa confiable de Google Cloud, crear el primer documento `access_members/<UID_ADMIN_REAL>` usando `node tools/provision-access.js <UID_ADMIN_REAL> admin --apply`. **Jamás** escribir o subir esa credencial a GitHub; no usar la cuenta `demo@hotel.com`.
3. Publicar las funciones callable (solo después de revisar y probar en emulador) mediante `firebase deploy --only functions`, teniendo en cuenta que el proyecto despliega también otras funciones existentes.
4. Probar `nexusListUsers` con cuenta admin y cuenta no autorizada; debe denegarse a la segunda. Dar de alta a Óscar desde `Usuarios.html` y entregarle de modo privado el enlace para crear su clave; el enlace no debe guardarse en bases de datos ni registrarse en logs.
5. Probar revocación y reactivación con cuenta de pruebas controlada. Comprobar que los tokens antiguos no permiten nuevas operaciones y no dejar copias del enlace de invitación.
6. Desvincular la gestión antigua `settings/main.system.users` en todas las pantallas. **Aún no está realizada**: configuración, navegación y aplicaciones pueden seguir leyendo ese directorio para mostrar perfiles.
7. Implementar reglas de Firestore y funciones de negocio que permitan leer/escribir reservas autorizadas, pero nieguen cambiar los importes y estados bancarios desde el navegador. **Aún pendiente**; la regla `allow false` debe seguir vigente.
8. Probar integración completa en una copia de ensayo con datos ficticios, incluido el guardado de presupuestos, depósitos, correo y calendario. Recién entonces fusionar/publicar.

**No publicar la rama directamente.** La nueva pantalla requiere primero membresía de administrador y permisos de lectura de `access_members/<uid>`; con las reglas actuales `allow false`, la administración de usuarios no estará disponible. Las reglas de ensayo son parciales y tampoco habilitan el uso normal del programa.

### Riesgos identificados que no resuelve la administración de usuarios

- Un usuario real con permiso comercial no debe poder certificar pagos, alterar los depósitos conciliados ni cambiar importes mediante modificaciones directas de Firestore.
- La aplicación actual mezcla cambios comerciales y bancarios en documentos; se necesita separación de datos/funciones y una migración conservadora.
- Los archivos Javascript/HTML siguen siendo visibles para los visitantes si se publican con GitHub Pages; control de acceso al servidor y privado GitHub son tareas independientes.
