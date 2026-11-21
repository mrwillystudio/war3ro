'use strict';
// Export the retained 7.0b07 baseline from the site's actual loader order.
// The current release overlay is deliberately not evaluated here.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const repo = path.resolve(process.argv[2] || path.join(__dirname, '../..'));
const output = process.argv[3];
if (!output) throw Error('Usage: node export_baseline.cjs REPO OUTPUT_JSON');
const context = { window: {} };
context.window = context;
vm.createContext(context);
const html = fs.readFileSync(path.join(repo, 'index.html'), 'utf8');
for (const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)) {
  const source = /\bsrc="([^"]+)"/.exec(match[1]);
  if (source) {
    const local = source[1].split('?')[0];
    if (local.includes('update-70c08.js')) break;
    if (!local.startsWith('./atlas-data/')) continue;
    vm.runInContext(fs.readFileSync(path.join(repo, local), 'utf8'), context, { filename: local });
  } else {
    if (match[2].includes('RO ATLAS · v68')) break;
    if (match[2].includes('__atlasParts') || match[2].includes('window.RODB')) {
      vm.runInContext(match[2], context);
    }
  }
}
assert.equal(context.RODB.meta.sha256, 'ec9ffd6c97bfefb647f1498e1b21f409c17068784855138ebdc53a15405fb057');
assert.equal(context.RODB.areas.length, 40);
fs.writeFileSync(output, JSON.stringify(context.RODB, null, 2) + '\n');
console.log(JSON.stringify({ output, version: context.RODB.meta.version, items: context.RODB.items.length, monsters: context.RODB.monsters.length }));
