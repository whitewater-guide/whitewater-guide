import {
  DefinitionNode,
  DocumentNode,
  FieldNode,
  FragmentDefinitionNode,
  FragmentSpreadNode,
  GraphQLNamedType,
  GraphQLOutputType,
  GraphQLSchema,
  isObjectType,
  isWrappingType,
  OperationDefinitionNode,
  SelectionNode,
} from 'graphql';
import get from 'lodash/get';
import upperFirst from 'lodash/upperFirst';

import { FieldsByType } from './types';

interface Fragments {
  [key: string]: FragmentDefinitionNode;
}

const isFieldNode = (node: SelectionNode): node is FieldNode =>
  node.kind === 'Field';
const isFragmentSpread = (node: SelectionNode): node is FragmentSpreadNode =>
  node.kind === 'FragmentSpread';
const isOperation = (node: DefinitionNode): node is OperationDefinitionNode =>
  node.kind === 'OperationDefinition';
const isFragment = (node: DefinitionNode): node is FragmentDefinitionNode =>
  node.kind === 'FragmentDefinition';

const unwrap = (type: GraphQLOutputType): GraphQLNamedType =>
  isWrappingType(type) ? unwrap(type.ofType) : type;

const inspectField = (
  field: FieldNode,
  type: GraphQLNamedType,
  fragments: Fragments,
  acc: FieldsByType,
) => {
  if (field.name.value === '__typename') {
    return;
  }
  const typeFields: Set<string> =
    acc.get(type.name) ??
    acc.set(type.name, new Set<string>()).get(type.name) ??
    new Set();
  typeFields.add(field.name.value);
  if (!isObjectType(type)) {
    return;
  }
  const selections: SelectionNode[] = get(field, 'selectionSet.selections', []);
  const fields = type.getFields();
  const fieldType = unwrap(fields[field.name.value].type);
  // this is a recursion
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  inspectSelections(selections, fieldType, fragments, acc);
};

const inspectSelections = (
  selections: SelectionNode[],
  type: GraphQLNamedType,
  fragments: Fragments,
  acc: FieldsByType,
) => {
  selections.forEach((subField) => {
    if (isFieldNode(subField)) {
      inspectField(subField, type, fragments, acc);
    } else if (isFragmentSpread(subField)) {
      const fragment = fragments[subField.name.value];
      const fragmentSelections: SelectionNode[] = get(
        fragment,
        'selectionSet.selections',
        [],
      );
      inspectSelections(fragmentSelections, type, fragments, acc);
    }
  });
};

/**
 * Inspects query, and for each type defined in GRAPHQL schema returns
 * set of fields that are selected anywhere in the query
 * @param info
 * @param result = optional map to save result in
 */
export const fieldsByType = (
  { definitions }: DocumentNode,
  schema: GraphQLSchema,
  result?: FieldsByType,
) => {
  const acc: FieldsByType = result || new Map<string, Set<string>>();

  const ops: OperationDefinitionNode[] = [];
  const fragments: { [key: string]: FragmentDefinitionNode } = {};
  definitions.forEach((def) => {
    if (isOperation(def)) {
      ops.push(def);
    } else if (isFragment(def)) {
      fragments[def.name.value] = def;
    }
  });

  const typeMap = schema.getTypeMap();
  ops.forEach(({ operation, selectionSet }) => {
    const rootType: GraphQLNamedType = typeMap[upperFirst(operation)];
    selectionSet.selections.forEach((field) => {
      if (isFieldNode(field)) {
        inspectField(field, rootType, fragments, acc);
      }
    });
  });

  return acc;
};
