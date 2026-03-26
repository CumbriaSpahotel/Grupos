@echo off
title Servidor Local Nexus Groups
echo ========================================================
echo   Iniciando servidor web local para Nexus Groups...
echo ========================================================
echo.

:: Verificar npx (Node.js)
call npx --version >nul 2>&1
IF %ERRORLEVEL% EQU 0 (
    echo [INFO] Node.js detectado. Instalando dependencias e iniciando en el puerto 3000...
    echo [INFO] Tu navegador se abrira en unos segundos.
    timeout /t 3 /nobreak >nul
    start "" "http://localhost:3000/index.html"
    call npx -y serve .
    goto :End
)

:: Si no encuentra nada
echo [ERROR] No se ha detectado Python ni Node.js instalados en tu sistema.
echo Para abrir el servidor necesitas una de esas herramientas,
echo o usar la extension "Live Server" desde Visual Studio Code.
pause

:End
