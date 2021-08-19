import Knex from 'knex';

import { Sql } from '~/db';

import { TEST_USER_ID } from './01_users';
import { REGION_GEORGIA } from './04_regions';
import { NORWAY_SJOA_AMOT, RUSSIA_MZYMTA_PASEKA } from './09_sections';

const regions: Sql.FavRegions[] = [
  {
    user_id: TEST_USER_ID,
    region_id: REGION_GEORGIA,
  },
];

const sections: Sql.FavSections[] = [
  {
    user_id: TEST_USER_ID,
    section_id: NORWAY_SJOA_AMOT,
  },
  {
    user_id: TEST_USER_ID,
    section_id: RUSSIA_MZYMTA_PASEKA,
  },
];

export async function seed(db: Knex) {
  await db.table('fav_regions').del();
  await db.table('fav_regions').insert(regions);

  await db.table('fav_sections').del();
  await db.table('fav_sections').insert(sections);
}
