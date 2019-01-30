import {
  FieldNode,
  FragmentDefinitionNode,
  FragmentSpreadNode,
  GraphQLNamedType,
  GraphQLOutputType,
  GraphQLResolveInfo,
  isObjectType,
  isWrappingType,
  SelectionNode,
} from 'graphql';
import get from 'lodash/get';
import upperFirst from 'lodash/upperFirst';

type Acc = Map<string, Set<string>>;
interface Fragments {
  [key: string]: FragmentDefinitionNode;
}

const isFieldNode = (node: SelectionNode): node is FieldNode =>
  node.kind === 'Field';
const isFragmentSpread = (node: SelectionNode): node is FragmentSpreadNode =>
  node.kind === 'FragmentSpread';

const unwrap = (type: GraphQLOutputType): GraphQLNamedType =>
  isWrappingType(type) ? unwrap(type.ofType) : type;

const inspectField = (
  field: FieldNode,
  type: GraphQLNamedType,
  fragments: Fragments,
  acc: Acc,
) => {
  if (field.name.value === '__typename') {
    return;
  }
  const typeFields: Set<string> =
    acc.get(type.name) || acc.set(type.name, new Set<string>()).get(type.name)!;
  typeFields.add(field.name.value);
  if (!isObjectType(type)) {
    return;
  }
  const selections: SelectionNode[] = get(field, 'selectionSet.selections', []);
  const fieldType = unwrap(type.getFields()[field.name.value].type);
  inspectSelections(selections, fieldType, fragments, acc);
};

const inspectSelections = (
  selections: SelectionNode[],
  type: GraphQLNamedType,
  fragments: Fragments,
  acc: Acc,
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
 * Use this in schema-level resolver
 * Inspects query, and for each type defined in GRAPHQL schema returns
 * set of fields that are selected anywhere in the query
 * @param info
 * @param result = optional map to save result in
 */
export const fieldsByType = (info: GraphQLResolveInfo, result?: Acc) => {
  const acc: Acc = result || new Map<string, Set<string>>();
  const {
    operation: { operation, selectionSet },
    schema,
    fragments,
  } = info;
  const typeMap = schema.getTypeMap();
  const rootType: GraphQLNamedType = typeMap[upperFirst(operation)];
  selectionSet.selections.forEach((field) => {
    if (isFieldNode(field)) {
      inspectField(field, rootType, fragments, acc);
    }
  });
  return acc;
};
