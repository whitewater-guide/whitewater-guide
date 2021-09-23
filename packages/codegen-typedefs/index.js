// eslint-disable-next-line @typescript-eslint/no-var-requires
const { printSchemaWithDirectives } = require('@graphql-tools/utils');

module.exports = {
  plugin: (schema) =>
    [
      'import gql from "graphql-tag";',
      '',
      'export const typeDefs = gql`',
      printSchemaWithDirectives(schema),
      '`;',
    ].join('\n'),
};
