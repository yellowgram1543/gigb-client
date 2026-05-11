import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function auditLog(message) {
  const entry = `[${new Date().toISOString()}] ${message}\n`;
  
  // 1. Always log to console (Render/Vercel capture this in their dashboard)
  console.log("📝 AUDIT:", message);

  // 2. Safely attempt to write to file (will fail on read-only clouds, but won't crash)
  try {
    fs.appendFileSync(path.join(__dirname, "../audit.log"), entry);
  } catch (err) {
    // Silently ignore file errors in production/cloud environments
    // We don't want a logging failure to stop a user from getting paid!
  }
}
