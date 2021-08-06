import {
  ListSectionsDocument,
  ListSectionsQuery,
} from '@whitewater-guide/clients';
import { MutationUpdaterFn } from 'apollo-client';

import { RouterParams } from './types';
import { UpsertSectionMutation } from './upsertSection.generated';

const addToList =
  ({ regionId }: RouterParams): MutationUpdaterFn<UpsertSectionMutation> =>
  (store, result) => {
    const section = result.data?.upsertSection;
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
    sections.count += 1;
    sections.nodes.push(section);
    store.writeQuery({
      query: ListSectionsDocument,
      variables: { filter: { regionId } },
      data: queryResult,
    });
  };

export default addToList;
