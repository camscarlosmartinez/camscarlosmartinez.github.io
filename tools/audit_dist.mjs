import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { extname, join, normalize, resolve } from 'node:path';

const dist = resolve('dist');
const requiredPages = [
  '/', '/cams/', '/estado-que-cumple/', '/documentos/', '/observatorio/',
  '/bitacora/', '/participar/', '/archivo/', '/propuestas/', '/conocimiento/',
  '/conocimiento/investigaciones/', '/conocimiento/documentos/',
  '/conocimiento/bitacora/', '/conocimiento/observatorio/', '/conocimiento/archivo/'
];
const requiredAssets = [
  '/assets/favicon.svg', '/assets/og-cams-v3.png',
  '/assets/branding/logo-cams.png', '/assets/branding/sello-cams.png',
  '/assets/documentos/estado-que-cumple-2026-2030.pdf',
  '/site.webmanifest', '/robots.txt', '/sitemap-index.xml'
];

let errors = 0;
let warnings = 0;
const report = (level, message) => {
  console.log(`${level} ${message}`);
  if (level === 'ERROR') errors += 1;
  if (level === 'WARNING') warnings += 1;
};
const outputPath = (urlPath) => urlPath === '/'
  ? join(dist, 'index.html')
  : join(dist, ...urlPath.split('/').filter(Boolean), 'index.html');
const assetPath = (urlPath) => join(dist, ...urlPath.split('/').filter(Boolean));

if (!existsSync(dist)) {
  report('ERROR', 'No existe dist/. Ejecute npm.cmd run build antes de la auditoría.');
  console.log(`ERROR Resumen: ${errors} error(es), ${warnings} advertencia(s).`);
  process.exitCode = 1;
} else {
  for (const route of requiredPages) {
    const file = outputPath(route);
    report(existsSync(file) ? 'PASS' : 'ERROR', `${route} -> ${existsSync(file) ? 'generada' : 'página requerida ausente'}`);
  }

  for (const resource of requiredAssets) {
    const file = assetPath(resource);
    const exists = existsSync(file) && statSync(file).size > 0;
    const label = resource.endsWith('.pdf') ? 'PDF' : resource.includes('favicon') ? 'favicon' : resource.includes('manifest') ? 'manifest' : resource.includes('robots') ? 'robots' : resource.includes('sitemap') ? 'sitemap' : 'asset requerido';
    report(exists ? 'PASS' : 'ERROR', `${resource} -> ${exists ? `${label} presente` : `${label} ausente`}`);
  }

  const htmlFiles = [];
  const walk = (directory) => {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) walk(path);
      else if (entry.name.endsWith('.html')) htmlFiles.push(path);
    }
  };
  walk(dist);

  const checked = new Set();
  for (const htmlFile of htmlFiles) {
    const html = readFileSync(htmlFile, 'utf8');
    const links = [...html.matchAll(/(?:href|src)=["']([^"']+)["']/gi)].map((match) => match[1]);
    for (const raw of links) {
      if (!raw.startsWith('/') || raw.startsWith('//')) continue;
      const pathname = raw.split(/[?#]/, 1)[0];
      if (!pathname || checked.has(pathname)) continue;
      checked.add(pathname);
      const extension = extname(pathname);
      const target = extension ? assetPath(pathname) : outputPath(pathname.endsWith('/') ? pathname : `${pathname}/`);
      if (!existsSync(normalize(target))) report('ERROR', `Enlace interno apunta a una ruta no generada: ${pathname}`);
    }
  }

  if (htmlFiles.length === 0) report('WARNING', 'dist no contiene archivos HTML para auditar enlaces.');
  if (errors === 0 && warnings === 0) report('PASS', 'dist satisface todas las rutas y recursos obligatorios.');
  else console.log(`${errors > 0 ? 'ERROR' : 'WARNING'} Resumen: ${errors} error(es), ${warnings} advertencia(s).`);
  process.exitCode = errors > 0 ? 1 : 0;
}
