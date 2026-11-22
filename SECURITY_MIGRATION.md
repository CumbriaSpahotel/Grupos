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
