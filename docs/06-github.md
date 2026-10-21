# Publicar en GitHub

## Cómo funciona
1. El código vive en un repositorio de GitHub.
2. Cada vez que se suben cambios a la rama `main`, GitHub Actions construye el sitio y lo publica en **GitHub Pages** (`.github/workflows/deploy.yml`).
3. La dirección queda como `https://<usuario>.github.io/<repo>/` hasta que se configure un dominio propio.

## Publicar cambios (día a día)
Doble clic en **`publicar.bat`**, escribir una descripción corta de los cambios (o Enter para usar la fecha) y listo. En 1 o 2 minutos la web se actualiza.

El script:
1. Verifica que Git esté instalado y que la carpeta esté conectada a GitHub.
2. Guarda todos los cambios en un commit.
3. Trae lo que haya cambiado en GitHub (por si se editó algo desde la web) y sube todo.

## Configuración inicial (una sola vez)
1. Instalar Git para Windows (incluye Git Credential Manager, que abre el navegador para iniciar sesión en GitHub).
2. Configurar nombre y email: `git config --global user.name "…"` y `git config --global user.email "…"`.
3. Crear el repositorio en GitHub y conectarlo: `git remote add origin https://github.com/<usuario>/<repo>.git`.
4. Primer envío: `git push -u origin main`.
5. En GitHub: **Settings → Pages → Source: GitHub Actions**.

## Dominio propio (más adelante)
1. Crear `public/CNAME` con el dominio (por ejemplo `promptea.app`).
2. Configurar el DNS según la guía de GitHub Pages.
3. Publicar. `astro.config.mjs` detecta el `CNAME` y ajusta las URLs solo.

## Probar la web en tu computadora (opcional)
Requiere Node.js 22 o superior: `npm install` y después `npm run dev`, y abrir http://localhost:4321.
