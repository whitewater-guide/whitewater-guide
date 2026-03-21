import type { Knex } from 'knex';

import type { Sql } from '../../db/index';
import { ADMIN_ID, EDITOR_GE_ID } from './01_users';
import { REGION_GEORGIA, REGION_NORWAY } from './04_regions';
import { RIVER_BZHUZHA, RIVER_SJOA } from './07_rivers';
import {
  GEORGIA_BZHUZHA_LONG,
  GEORGIA_BZHUZHA_QUALI,
  NORWAY_SJOA_AMOT,
} from './09_sections';

export const SECTION_EDIT_LOG_ENTRY_1 = '9ac6562b-91fa-49f2-a765-4efe3a4d2680';
export const SECTION_EDIT_LOG_ENTRY_2 = '23d7e919-77e1-412b-87d6-7420fe1c70b6';
export const SECTION_EDIT_LOG_ENTRY_3 = 'badb7ed1-c43a-4297-842a-7f12a59501a1';
export const SECTION_EDIT_LOG_ENTRY_4 = 'b4d42c34-5a2d-4136-b11e-35fda268f080';
export const DELETED_SECTION_ID1 = '2bc05fa8-34d5-447a-bf55-34a9a7e726e1';

const logEntries: Array<Omit<Sql.SectionsEditLog, 'editor_name' | 'diff'>> = [
  {
    id: SECTION_EDIT_LOG_ENTRY_1,
    section_id: DELETED_SECTION_ID1,
    section_name: 'deleted_section1_name',
    river_id: RIVER_BZHUZHA,
    river_name: 'Bzhuzha',
    region_id: REGION_GEORGIA,
    region_name: 'Georgia',
    editor_id: EDITOR_GE_ID,
    action: 'delete',
    created_at: new Date(Date.UTC(2017, 1, 1)),
  },
  {
    id: SECTION_EDIT_LOG_ENTRY_2,
    section_id: GEORGIA_BZHUZHA_LONG,
    section_name: 'Long Race',
    river_id: RIVER_BZHUZHA,
    river_name: 'Bzhuzha',
    region_id: REGION_GEORGIA,
    region_name: 'Georgia',
    editor_id: EDITOR_GE_ID,
    action: 'create',
    created_at: new Date(Date.UTC(2017, 1, 2)),
  },
  {
    id: SECTION_EDIT_LOG_ENTRY_3,
    section_id: GEORGIA_BZHUZHA_QUALI,
    section_name: 'Квалификация',
    river_id: RIVER_BZHUZHA,
    river_name: 'Бжужа',
    region_id: REGION_GEORGIA,
    region_name: 'Грузия',
    editor_id: ADMIN_ID,
    action: 'update',
    created_at: new Date(Date.UTC(2017, 1, 3)),
  },
  {
    id: SECTION_EDIT_LOG_ENTRY_4,
    section_id: NORWAY_SJOA_AMOT,
    section_name: 'Amot',
    river_id: RIVER_SJOA,
    river_name: 'Sjoa',
    region_id: REGION_NORWAY,
    region_name: 'Norway',
    editor_id: ADMIN_ID,
    action: 'update',
    created_at: new Date(Date.UTC(2017, 1, 4)),
  },
];

export async function seed(db: Knex) {
  await db.table('sections_edit_log').del();
  await db.table('sections_edit_log').insert(logEntries);
}
