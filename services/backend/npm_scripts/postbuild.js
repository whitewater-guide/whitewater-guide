const { fileLoader, mergeTypes } = require('merge-graphql-schemas');
const { resolve } = require('path');
const { writeFileSync } = require('fs');

/**
 * Generates GRAPHQL schema for further use in client tests
 */
const postbuild = () => {
  const typesArray = fileLoader(resolve(process.cwd(), 'dist'), {
    recursive: true,
    extensions: ['.graphql'],
  });
  const typeDefs = mergeTypes(typesArray);
  const schemaFile = resolve(process.cwd(), 'merged-schema.graphql');
  writeFileSync(schemaFile, typeDefs);
};

postbuild();
