import { Types } from '@graphql-codegen/plugin-helpers';
import {
  ClientSideBaseVisitor,
  LoadedFragment,
  RawClientSideBasePluginConfig,
} from '@graphql-codegen/visitor-plugin-common';
import { GraphQLSchema, OperationDefinitionNode } from 'graphql';
import upperFirst from 'lodash/upperFirst';

export class BackendTestsVisitor extends ClientSideBaseVisitor {
  private _externalImportPrefix: string;
  protected rawConfig: RawClientSideBasePluginConfig;

  constructor(
    schema: GraphQLSchema,
    fragments: LoadedFragment[],
    rawConfig: RawClientSideBasePluginConfig,
    documents: Types.DocumentFile[],
  ) {
    super(schema, fragments, rawConfig, {});
    this.rawConfig = rawConfig;
    this._externalImportPrefix = this.config.importOperationTypesFrom
      ? `${this.config.importOperationTypesFrom}.`
      : '';
    this._documents = documents;
  }

  public getImports(): string[] {
    const baseImports = super.getImports();
    return [
      "import { anonContext, createTestClient } from '@test';",
      "import { GraphQLResponse } from 'apollo-server-types';",
      "import { createTestServer } from '~/apollo/server';",
      "import { Context } from '~/apollo';",
      ...baseImports,
    ];
  }

  protected buildOperation(
    node: OperationDefinitionNode,
    documentVariableName: string,
    operationType: string,
    operationResultType: string,
    operationVariablesTypes: string,
  ): string {
    const operationName = upperFirst(node.name?.value ?? '');

    const clientCall =
      operationType === 'Query'
        ? `client.query<${operationResultType}>({ query: ${documentVariableName}, variables })`
        : `client.mutate<${operationResultType}>({ mutation: ${documentVariableName}, variables })`;

    return `
      export type ${operationResultType}Result = Omit<GraphQLResponse, 'data'> & {
        data?: ${operationResultType};
      };

      export function test${operationName}(
        variables?: ${operationVariablesTypes},
        context?: Omit<Context, 'dataSources'>
      ) {
        const server = createTestServer(context || anonContext());
        const client = createTestClient(server);
        return ${clientCall};
      }`;
  }
}
