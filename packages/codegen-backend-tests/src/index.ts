import type { PluginFunction, Types } from '@graphql-codegen/plugin-helpers';
import type {
  LoadedFragment,
  RawClientSideBasePluginConfig,
} from '@graphql-codegen/visitor-plugin-common';
import type { FragmentDefinitionNode, GraphQLSchema } from 'graphql';
import { concatAST, Kind } from 'graphql';

import { visit15 } from './visit15';
import { BackendTestsVisitor } from './visitor';

export const plugin: PluginFunction<
  RawClientSideBasePluginConfig,
  Types.ComplexPluginOutput
> = (
  schema: GraphQLSchema,
  documents: Types.DocumentFile[],
  config: RawClientSideBasePluginConfig,
) => {
  const allAst = concatAST(documents.map((v) => v.document!));

  const allFragments: LoadedFragment[] = [
    ...(
      allAst.definitions.filter(
        (d) => d.kind === Kind.FRAGMENT_DEFINITION,
      ) as FragmentDefinitionNode[]
    ).map((fragmentDef) => ({
      node: fragmentDef,
      name: fragmentDef.name.value,
      onType: fragmentDef.typeCondition.name.value,
      isExternal: false,
    })),
    ...(config.externalFragments || []),
  ];

  const visitor = new BackendTestsVisitor(
    schema,
    allFragments,
    config,
    documents,
  );
  // TODO: @graphql-codegen/visitor-plugin-common does not support graphql 16
  // as a workaround, I copied 'visit' function from graphql 15
  const visitorResult = visit15(allAst, { leave: visitor });

  return {
    prepend: visitor.getImports(),
    content: [
      visitor.fragments,
      ...visitorResult.definitions.filter((t: any) => typeof t === 'string'),
    ].join('\n'),
  };
};
