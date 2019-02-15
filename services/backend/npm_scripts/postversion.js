const { fileLoader, mergeTypes } = require('merge-graphql-schemas');
const { resolve } = require('path');
const { writeFileSync } = require('fs');
const { spawnSync } = require('child_process');
const { config } = require('dotenv');
const { readJSONSync } = require('fs-extra');

/**
 * Generates GRAPHQL schema and uploads it to Apollo Engine
 */
const postversion = () => {
  // Step 1. Write schema into file (because introspection is disabled)
  const typesArray = fileLoader(resolve(process.cwd(), 'dist'), {
    recursive: true,
    extensions: ['.graphql'],
  });
  const typeDefs = mergeTypes(typesArray);
  const schemaFile = resolve(process.cwd(), 'merged-schema.graphql');
  writeFileSync(schemaFile, typeDefs);

  // Step 2. Load ENGINE variables into env
  config({ path: resolve(process.cwd(), '.env.development') });
  // Step 2. Push schema to Apollo Engine
  const pJson = readJSONSync(resolve(process.cwd(), 'package.json'));
  spawnSync(
    'apollo',
    [
      'service:push',
      '--tag',
      pJson.version,
      '--key',
      process.env.ENGINE_API_KEY,
      'localSchemaFile',
      schemaFile,
    ],
    { stdio: 'inherit' },
  );
};

postversion();
