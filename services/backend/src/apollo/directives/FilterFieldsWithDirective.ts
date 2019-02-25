// tslint:disable:no-submodule-imports
import {
  GraphQLFieldConfig,
  GraphQLNamedType,
  GraphQLObjectType,
  GraphQLSchema,
} from 'graphql';
import { Transform } from 'graphql-tools';
import isEmptyObject from 'graphql-tools/dist/isEmptyObject';
import {
  createResolveType,
  fieldToFieldConfig,
} from 'graphql-tools/dist/stitching/schemaRecreation';
import {
  visitSchema,
  VisitSchemaKind,
} from 'graphql-tools/dist/transforms/visitSchema';

export class FilterFieldsWithDirective implements Transform {
  private readonly directive: string;

  constructor(directive: string) {
    this.directive = directive;
  }

  transformSchema(originalSchema: GraphQLSchema): GraphQLSchema {
    return visitSchema(originalSchema, {
      [VisitSchemaKind.OBJECT_TYPE]: (
        type: GraphQLObjectType,
      ): GraphQLObjectType => {
        const resolveType = createResolveType(
          (name: string, originalType: GraphQLNamedType): GraphQLNamedType =>
            originalType,
        );
        const fields = type.getFields();
        const newFields: { [key: string]: GraphQLFieldConfig<any, any> } = {};
        Object.keys(fields).forEach((fieldName) => {
          const field = fields[fieldName];
          const shouldExclude =
            field.astNode &&
            field.astNode.directives &&
            field.astNode.directives.some(
              (d) => d.name.value === this.directive,
            );
          if (!shouldExclude) {
            newFields[fieldName] = fieldToFieldConfig(field, resolveType, true);
          }
        });
        if (isEmptyObject(newFields)) {
          return null as any;
        } else {
          return new GraphQLObjectType({
            name: type.name,
            description: type.description,
            astNode: type.astNode,
            fields: newFields,
          });
        }
      },
    });
  }
}
