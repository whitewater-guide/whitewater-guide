import { InMemoryCache } from '@apollo/client';
import {
  QuerySectionsArgs,
  RegionSectionsArgs,
} from '@whitewater-guide/schema';
import stringify from 'fast-json-stable-stringify';

import cursorPagination from './cursorPagination';
import { StrictTypedTypePolicies } from './helpers.generated';
import nodesPagination from './nodesPagination';

export function configureApolloCache(): InMemoryCache {
  const typePolicies: StrictTypedTypePolicies = {
    Query: {
      fields: {
        // Only paginated queries are here. E.g. `groups` is not paginated and doesn't need merge function
        gauges: nodesPagination(['filter']),
        mediaBySection: nodesPagination(['sectionId']),
        regions: nodesPagination(['filter']),
        rivers: nodesPagination(['filter']),
        sections: nodesPagination((args: QuerySectionsArgs, { fieldName }) => {
          // Updated after is more like page really, but it's in filter
          const { updatedAfter: _updatedAfter, ...filter } = args.filter ?? {};
          return fieldName + ':' + stringify(filter);
        }),
        sectionsEditLog: nodesPagination(['filter']),
        sources: nodesPagination(),
        suggestions: nodesPagination(['filter']),

        descents: cursorPagination(['filter']),
        myDescents: cursorPagination(['filter']),

        // This is the only cache redirect we have now:
        // It allows to read sections downloaded by offline query
        // https://www.apollographql.com/docs/react/caching/advanced-topics/#cache-redirects
        section: {
          read: (existing, { args, toReference }) => {
            return (
              existing ??
              toReference({
                __typename: 'Section',
                id: args?.id,
              })
            );
          },
        },
      },
    },
    Region: {
      fields: {
        banners: nodesPagination(),
        gauges: nodesPagination(),
        rivers: nodesPagination(),
        sections: nodesPagination(
          (args: RegionSectionsArgs | null, { fieldName }) => {
            // Updated after is more like page really, but it's in filter
            const { updatedAfter: _updatedAfter, ...filter } =
              args?.filter ?? {};
            return fieldName + ':' + stringify(filter);
          },
        ),
        sources: nodesPagination(),
      },
    },
    River: {
      fields: {
        sections: nodesPagination(),
      },
    },
    Section: {
      fields: {
        media: nodesPagination(),
      },
    },
    Source: {
      fields: {
        regions: nodesPagination(),
        gauges: nodesPagination(),
      },
    },
  };
  return new InMemoryCache({
    typePolicies,
  });
}
