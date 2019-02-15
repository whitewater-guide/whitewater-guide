const { fileLoader, mergeTypes } = require('merge-graphql-schemas');
const { resolve } = require('path');
const { writeFileSync } = require('fs');

const typesArray = fileLoader(resolve(process.cwd(), 'dist'), {
  recursive: true,
  extensions: ['.graphql'],
});
const typeDefs = mergeTypes(typesArray);
writeFileSync('merged-schema.graphql', typeDefs);
