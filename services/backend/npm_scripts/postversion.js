const { fileLoader, mergeTypes } = require('merge-graphql-schemas');
const { resolve } = require('path');
const { spawnSync } = require('child_process');
const { config } = require('dotenv');
const { readJSONSync } = require('fs-extra');

/**
 * Uploads GRAPHQL schema from postbuild step to Apollo Engine
 */
const postversion = () => {
  const schemaFile = resolve(process.cwd(), 'merged-schema.graphql');
  // Step 1. Load ENGINE variables into env
  config({ path: resolve(process.cwd(), '.env.production') });
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
      '--localSchemaFile',
      schemaFile,
    ],
    { stdio: 'inherit' },
  );
};

postversion();
