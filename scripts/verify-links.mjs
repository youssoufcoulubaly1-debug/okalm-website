import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, extname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('../public/', import.meta.url)));
const pages = [];
function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name.endsWith('.html')) pages.push(full);
  }
}
walk(root);
const failures = [];
let checked = 0;
for (const file of pages) {
  const html = readFileSync(file, 'utf8');
  const name = relative(root, file);
  for (const match of html.matchAll(/(?:href|src)=["']([^"'<>]+)["']/g)) {
    const uri = match[1];
    if (/^(?:https?:|mailto:|tel:|data:|javascript:|\/\/)/i.test(uri)) continue;
    const [pathAndHash] = uri.split('?');
    const [pathPart, hash] = pathAndHash.split('#');
    let target = !pathPart ? file : pathPart.startsWith('/')
      ? resolve(root, '.' + pathPart)
      : resolve(dirname(file), pathPart);
    if (!extname(target)) {
      target = /[\\/]$/.test(pathPart) || !pathPart || pathPart === '/'
        ? join(target, 'index.html') : target + '.html';
    }
    checked++;
    const safe = target === root || target.startsWith(root + sep);
    if (!safe || !existsSync(target)) {
      failures.push(name + ': ' + uri + ' (fichier absent / hors public)');
      continue;
    }
    if (hash && extname(target) === '.html') {
      const dest = readFileSync(target, 'utf8');
      if (!dest.includes('id="' + decodeURIComponent(hash) + '"')) {
        failures.push(name + ': ' + uri + ' (ancre absente)');
      }
    }
  }
}
if (failures.length) {
  for (const failure of failures) console.error(failure);
  process.exitCode = 1;
}
console.log('Liens locaux : ' + checked + ' vérifiés sur ' + pages.length +
  ' pages HTML, ' + failures.length + ' défaut(s).');
