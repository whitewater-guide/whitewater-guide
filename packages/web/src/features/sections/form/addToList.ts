import { ApolloCache, MutationUpdaterFunction } from '@apollo/client';
import {
  ListSectionsDocument,
  ListSectionsQuery,
} from '@whitewater-guide/clients';

import { RouterParams } from './types';
import {
  UpsertSectionMutation,
  UpsertSectionMutationVariables,
} from './upsertSection.generated';

const addToList =
  ({
    regionId,
  }: RouterParams): MutationUpdaterFunction<
    UpsertSectionMutation,
    UpsertSectionMutationVariables,
    unknown,
    ApolloCache<any>
  > =>
  (store, { data }) => {
    const section = data?.upsertSection;
    if (!section) {
      return;
    }
    let queryResult: ListSectionsQuery | null = null;
    try {
      queryResult = store.readQuery({
        query: ListSectionsDocument,
        variables: { filter: { regionId } },
      });
    } catch {}
    if (!queryResult) {
      return;
    }

    const { sections } = queryResult;
    const isNew = sections.nodes.findIndex((s) => s.id === section.id) === -1;
    if (!isNew) {
      return;
    }
    store.writeQuery({
      query: ListSectionsDocument,
      variables: { filter: { regionId } },
      data: {
        __typename: queryResult.__typename,
        sections: {
          ...sections,
          nodes: [...sections.nodes, section],
          count: sections.count + 1,
        },
      },
    });
  };

export default addToList;
