import { resolve } from 'node:path';

// import { dirname } from 'node:path';
// import { fileURLToPath } from 'node:url';
// function dirName(importMetaUrl: string): string {
//   const __filename = fileURLToPath(importMetaUrl);
//   return dirname(__filename);
// }

// dummy for easier migration to ESM in future
function dirName(name: string): string {
  return name;
}

export function resolveRelative(
  importMetaUrl: string,
  ...paths: string[]
): string {
  return resolve(dirName(importMetaUrl), ...paths);
}
