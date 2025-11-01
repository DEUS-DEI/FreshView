const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const outDir = path.join(repoRoot, 'dist');
const outFile = path.join(outDir, 'sw.js');

// Files to concatenate in order (same order as imported via importScripts)
const files = [
  'js/constants.js',
  'js/logger.js',
  'js/storage.js',
  'js/background.js'
];

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

let out = "// Bundled service worker (generated). Do not edit by hand.\n\n";
for (const f of files) {
  const p = path.join(repoRoot, f);
  if (!fs.existsSync(p)) {
    console.error(`Missing file: ${p}`);
    process.exit(1);
  }
  const content = fs.readFileSync(p, 'utf8');
  out += `// ---- ${f} ----\n`;
  out += content + '\n\n';
}

fs.writeFileSync(outFile, out, 'utf8');
console.log(`Wrote ${outFile}`);
