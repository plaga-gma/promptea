@echo off
setlocal
chcp 65001 >nul
title Publicar Promptea en GitHub
cd /d "%~dp0"

echo.
echo  ==========================================
echo    Promptea - Publicar cambios en GitHub
echo  ==========================================
echo.

where git >nul 2>nul
if errorlevel 1 (
  echo  [!] Git no esta instalado. Descargalo de https://git-scm.com/download/win
  goto fin
)

git rev-parse --is-inside-work-tree >nul 2>nul
if errorlevel 1 (
  echo  [!] Esta carpeta todavia no esta conectada a Git. Mira docs\06-github.md
  goto fin
)

git remote get-url origin >nul 2>nul
if errorlevel 1 (
  echo  [!] No hay un repositorio de GitHub conectado. Mira docs\06-github.md
  goto fin
)

echo  Cambios desde la ultima publicacion:
git status --short
echo.

set "MSG="
set /p "MSG=  Describe los cambios (o Enter para usar la fecha): "
if not defined MSG set "MSG=Actualizacion %date% %time:~0,5%"
set "MSG=%MSG:"='%"

git add -A
git diff --cached --quiet
if errorlevel 1 (
  git commit -m "%MSG%"
  if errorlevel 1 (
    echo  [!] No se pudo guardar el commit.
    goto fin
  )
) else (
  echo  No hay cambios nuevos para guardar. Se sube lo que falte.
)

echo.
git ls-remote --exit-code --heads origin main >nul 2>nul
if not errorlevel 1 (
  echo  Trayendo cambios de GitHub...
  git pull --rebase --autostash origin main
  if errorlevel 1 (
    echo  [!] Hay cambios en GitHub que chocan con los tuyos. Pedile ayuda a Claude.
    goto fin
  )
)

echo  Subiendo a GitHub...
git push -u origin main
if errorlevel 1 (
  echo  [!] No se pudo subir. Revisa tu conexion o tu sesion de GitHub.
  goto fin
)

echo.
echo  Listo. GitHub va a actualizar la web en 1 o 2 minutos.
for /f "delims=" %%u in ('git remote get-url origin') do set "REPO=%%u"
set "REPO=%REPO:.git=%"
echo  Progreso: %REPO%/actions

:fin
echo.
pause
endlocal
