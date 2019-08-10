import { LIST_SECTIONS, ListSectionsResult } from '@whitewater-guide/clients';
import { MutationUpdaterFn } from 'apollo-client';
import { RouterParams } from './types';
import { MResult } from './upsertSection.mutation';

const addToList = ({ regionId }: RouterParams): MutationUpdaterFn<MResult> => (
  store,
  result,
) => {
  const section = result.data && result.data.upsertSection;
  if (!section) {
    return;
  }
  const queryResult: ListSectionsResult | null = store.readQuery({
    query: LIST_SECTIONS,
    variables: { filter: { regionId } },
  });
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
    query: LIST_SECTIONS,
    variables: { filter: { regionId } },
    data: queryResult,
  });
};

export default addToList;
