import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const migrationsDir = path.join(__dirname, '../../migrations');

// Read all .js files in the migrations directory
const migrationFiles = fs.readdirSync(migrationsDir).filter(file => file.endsWith('.js'));

for (const file of migrationFiles) {
  const filePath = path.join(migrationsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Skip if already using ES modules
  if (content.includes('export default {')) {
    continue;
  }

  // Replace CommonJS syntax with ES modules
  content = content.replace(
    /module\.exports = {/,
    'export default {'
  );

  // Write the updated content back to the file
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${file} to use ES modules`);
}

console.log('Finished updating migration files'); 