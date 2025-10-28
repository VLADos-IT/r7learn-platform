import { writeFileSync, copyFileSync, existsSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const hash = crypto.randomBytes(3).toString('hex');

const date = new Date().toISOString();

const buildVersion = { version: hash, date };

const distDir = resolve(__dirname, 'dist');
const outFile = resolve(distDir, 'build_version.json');

if (!existsSync(distDir)) mkdirSync(distDir, { recursive: true });

writeFileSync(outFile, JSON.stringify(buildVersion, null, 2));
console.log(`Build version generated: ${hash} -> ${outFile}`);

