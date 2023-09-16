import { NEW_RIVER_ID } from '@whitewater-guide/commons';
import type { RiverInput, SectionInput } from '@whitewater-guide/schema';

import { UnknownError, UserInputError } from '../../../apollo/index';
import type { Sql } from '../../../db/index';
import { db, rawUpsert } from '../../../db/index';
import { OTHERS_REGION_ID } from '../../../features/regions/index';

export function isNewRiverId(id: string): boolean {
  // __NEW_ID__ is legacy input, required to support old mobile app versions
  return id === NEW_RIVER_ID || id === '__NEW_ID__';
}

export const checkForNewRiver = (section: SectionInput) => {
  const shouldInsertRiver = isNewRiverId(section.river.id);
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
