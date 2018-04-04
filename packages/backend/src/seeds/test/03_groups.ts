import Knex from 'knex';

export const GROUP_EU = 'c9bf96be-37f5-11e8-b467-0ed5f89f718b';
export const GROUP_EU_CIS = '88a55b3c-37f5-11e8-b467-0ed5f89f718b';
export const GROUP_LATIN = '904a4852-37f5-11e8-b467-0ed5f89f718b';
export const GROUP_EMPTY = '9f4c3c98-37f5-11e8-b467-0ed5f89f718b';

const groups = [
  {
    id: GROUP_EU,
  },
  {
    id: GROUP_EU_CIS,
  },
  {
    id: GROUP_LATIN,
  },
  {
    id: GROUP_EMPTY,
  },
];

const groupsEn = [
  {
    group_id: GROUP_EU,
    language: 'en',
    name: 'Europe',
  },
  {
    group_id: GROUP_EU_CIS,
    language: 'en',
    name: 'Europe & CIS',
  },
  {
    group_id: GROUP_LATIN,
    language: 'en',
    name: 'Latin America',
  },
  {
    group_id: GROUP_EMPTY,
    language: 'en',
    name: 'Empty',
  },
];

const groupsRu = [
  {
    group_id: GROUP_EU,
    language: 'ru',
    name: 'Европа',
  },
  {
    group_id: GROUP_EU_CIS,
    language: 'ru',
    name: 'Европа и СНГ',
  },
];

export async function seed(db: Knex) {
  await db.table('groups').del();
  await db.table('groups_translations').del();
  await db.table('groups').insert(groups);
  await db.table('groups_translations').insert([...groupsEn, ...groupsRu]);
}
