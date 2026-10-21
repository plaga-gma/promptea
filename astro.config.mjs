// @ts-check
import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import sitemap from '@astrojs/sitemap';
import { existsSync, readFileSync } from 'node:fs';

/**
 * URL pública del sitio, sin configuración manual:
 * - Si existe public/CNAME (dominio propio), se usa ese dominio en la raíz.
 * - Si se construye en GitHub Actions, se usa https://<usuario>.github.io/<repo>.
 * - En local, la raíz de localhost.
 */
function resolveSite() {
  const cnamePath = new URL('./public/CNAME', import.meta.url);
  if (existsSync(cnamePath)) {
    const domain = readFileSync(cnamePath, 'utf8').trim();
    if (domain) return { site: `https://${domain}`, base: '/' };
  }
  const repo = process.env.GITHUB_REPOSITORY; // "usuario/repo"
  if (repo) {
    const [owner, name] = repo.split('/');
    const isUserSite = name.toLowerCase() === `${owner.toLowerCase()}.github.io`;
    return { site: `https://${owner}.github.io`, base: isUserSite ? '/' : `/${name}` };
  }
  return { site: 'http://localhost:4321', base: '/' };
}

const { site, base } = resolveSite();

export default defineConfig({
  site,
  base,
  trailingSlash: 'always',
  integrations: [preact(), sitemap()],
  build: { inlineStylesheets: 'auto' },
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
});
