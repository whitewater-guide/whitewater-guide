import type { Types } from '@graphql-codegen/plugin-helpers';
import type {
  LoadedFragment,
  RawClientSideBasePluginConfig,
} from '@graphql-codegen/visitor-plugin-common';
import { ClientSideBaseVisitor } from '@graphql-codegen/visitor-plugin-common';
import type { GraphQLSchema, OperationDefinitionNode } from 'graphql';
import upperFirst from 'lodash/upperFirst';

export class BackendTestsVisitor extends ClientSideBaseVisitor {
  protected rawConfig: RawClientSideBasePluginConfig;

  constructor(
    schema: GraphQLSchema,
    fragments: LoadedFragment[],
    rawConfig: RawClientSideBasePluginConfig,
    documents: Types.DocumentFile[],
  ) {
    super(schema, fragments, rawConfig, {});
    this.rawConfig = rawConfig;
    this._documents = documents;
  }

  public getImports(): string[] {
    const baseImports = super.getImports();
    return [
      "import { anonContext, createTestClient } from '../../../test/index';",
      "import type { FormattedExecutionResult } from 'graphql';",
      "import { createTestServer } from '../../../apollo/server/index';",
      "import { Context } from '../../../apollo/index';",
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
        ? `client.query<${operationResultType}>({ query: ${documentVariableName}, variables }, context ?? anonContext())`
        : `client.mutate<${operationResultType}>({ mutation: ${documentVariableName}, variables }, context ?? anonContext())`;

    return `
      export type ${operationResultType}Result = FormattedExecutionResult<${operationResultType}>;

      export function test${operationName}(
        variables?: ${operationVariablesTypes},
        context?: Context,
      ) {
        const server = createTestServer();
        const client = createTestClient(server);
        return ${clientCall};
      }`;
  }
}
