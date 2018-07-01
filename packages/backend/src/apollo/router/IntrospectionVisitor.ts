import { DirectiveNode, GraphQLField, GraphQLObjectType, GraphQLSchema } from 'graphql';
import { SchemaVisitor } from 'graphql-tools/dist/schemaVisitor';

const isAdmin = (field: GraphQLField<any, any>): boolean =>
  !!field.astNode &&
  !!field.astNode.directives &&
  field.astNode.directives.some((d: DirectiveNode) => d.name.value === 'admin');

export class LimitIntrospection extends SchemaVisitor {

  visitSchema(schema: GraphQLSchema) {
    (schema as any)._mutationType = null;
  }

  visitObject(object: GraphQLObjectType) {
    const fields = object.getFields();
    const adminKeys = Object.values(fields).reduce(
      (ak, field) => isAdmin(field) ? [...ak, field.name] : ak,
      [],
    );
    adminKeys.forEach(key => delete fields[key]);
  }
}
