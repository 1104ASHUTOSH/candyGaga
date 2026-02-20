import fs from 'node:fs';
import path from 'node:path';

const levelsPath = path.resolve(process.cwd(), '../frontend/src/levels/levels.json');

export const getLevels = () => JSON.parse(fs.readFileSync(levelsPath, 'utf-8'));
