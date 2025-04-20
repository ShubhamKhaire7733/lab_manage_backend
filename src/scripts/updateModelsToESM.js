import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const modelsDir = path.join(__dirname, '../../models');

// Read all .js files in the models directory
const modelFiles = fs.readdirSync(modelsDir).filter(file => file.endsWith('.js'));

for (const file of modelFiles) {
  const filePath = path.join(modelsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Skip if already using ES modules
  if (content.includes('import { Model }')) {
    continue;
  }

  // Replace CommonJS syntax with ES modules
  content = content.replace(
    /const {\s*Model\s*} = require\('sequelize'\);/,
    "import { Model } from 'sequelize';"
  );
  content = content.replace(
    /module\.exports = \(sequelize, DataTypes\) => {/,
    'export default (sequelize, DataTypes) => {'
  );

  // Write the updated content back to the file
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${file} to use ES modules`);
}

console.log('Finished updating model files'); 