import { NEW_RIVER_ID } from '@whitewater-guide/commons';
import { RiverInput, SectionInput } from '@whitewater-guide/schema';
import { UserInputError } from 'apollo-server-koa';

import { UnknownError } from '~/apollo';
import { db, rawUpsert, Sql } from '~/db';
import { OTHERS_REGION_ID } from '~/features/regions';

export const checkForNewRiver = (section: SectionInput) => {
  const shouldInsertRiver = section.river.id === NEW_RIVER_ID;
  if (shouldInsertRiver && section.id) {
    throw new UserInputError('cannot create new river for existing section');
  }
  return shouldInsertRiver;
};

export const insertNewRiver = async (
  section: SectionInput,
  language: string,
) => {
  if (!section.river.name) {
    throw new UnknownError('new river must have name');
  }
  const riverInput: RiverInput = {
    id: null,
    altNames: null,
    name: section.river.name,
    region: section.region ?? { id: OTHERS_REGION_ID },
  };
  const river: Sql.RiversView | undefined = await rawUpsert(
    db(),
    'SELECT upsert_river(?, ?)',
    [riverInput, language],
  );
  if (!river) {
    throw new UnknownError('failed to insert new river');
  }
  return river.id;
};
