import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function auditLog(message) {
  const entry = `[${new Date().toISOString()}] ${message}\n`;
  console.log(entry.trim());
  fs.appendFileSync(path.join(__dirname, "../audit.log"), entry);
}
