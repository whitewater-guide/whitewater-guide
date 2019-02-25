import { PlaygroundConfig } from 'apollo-server';
import { getIntrospectionQuery, graphql, GraphQLSchema } from 'graphql';
import { FilterRootFields } from 'graphql-tools';
// tslint:disable-next-line:no-submodule-imports
import { RootFilter } from 'graphql-tools/dist/transforms/FilterRootFields';
import { FilterFieldsWithDirective } from '../directives';

const rootFieldsFilter: RootFilter = (operation, fieldName, field) => {
  if (operation === 'Mutation') {
    return false;
  }
  const isAdmin =
    field.astNode &&
    field.astNode.directives &&
    field.astNode.directives.some((d) => d.name.value === 'admin');
  return !isAdmin;
};

const getPlaygroundSchema = (schema: GraphQLSchema) => {
  const filterRootFields = new FilterRootFields(rootFieldsFilter);
  const filterAdminFields = new FilterFieldsWithDirective('admin');
  return filterAdminFields.transformSchema(
    filterRootFields.transformSchema(schema),
  );
};

export const getPlaygroundConfig = async (
  schema: GraphQLSchema,
): Promise<PlaygroundConfig> => {
  const introspectionQuery = getIntrospectionQuery();
  const playgroundSchema = getPlaygroundSchema(schema);
  const { data } = await graphql(
    playgroundSchema,
    introspectionQuery,
    undefined,
  );
  return {
    schema: data,
    tabs: [
      {
        name: 'Example: some regions',
        endpoint: '',
        query: `
        query listRegions($page: Page) {
          regions(page: $page) {
            nodes {
              id
              name
              premium
              hasPremiumAccess
              editable
              sku
              rivers {
                count
              }
              gauges {
                count
              }
              sections {
                count
              }
            }
            count
          }
        }
       `,
        variables: JSON.stringify({ page: { limit: 5 } }),
      } as any,
    ],
  };
};
