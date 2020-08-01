import { NEW_ID, SuggestionStatus } from '@whitewater-guide/commons';
import Knex from 'knex';
import { SuggestionRaw } from '../../features/suggestions/types';
import {
  ADMIN_ID,
  BOOM_USER_1500_ID,
  EDITOR_NO_ID,
  TEST_USER_ID,
} from './01_users';
import { REGION_GEORGIA, REGION_NORWAY } from './04_regions';
import { GALICIA_BECA_LOWER, NORWAY_SJOA_AMOT } from './09_sections';

export const EDIT_SUGGESTION_ID1 = '5af79398-b3ba-11e9-a2a3-2a2ae2dbcce4';
export const EDIT_SUGGESTION_ID2 = '5af79622-b3ba-11e9-a2a3-2a2ae2dbcce4';
export const EDIT_SUGGESTION_ID3 = '5af79776-b3ba-11e9-a2a3-2a2ae2dbcce4';
export const MEDIA_SUGGESTION_ID1 = '5af798b6-b3ba-11e9-a2a3-2a2ae2dbcce4';
export const MEDIA_SUGGESTION_ID2 = '5af799ec-b3ba-11e9-a2a3-2a2ae2dbcce4';
export const MEDIA_SUGGESTION_ID3 = '5af79d34-b3ba-11e9-a2a3-2a2ae2dbcce4';

export const SUGGESTED_SECTION_ID1 = 'd9baf062-bcd4-11e9-9cb5-2a2ae2dbcce4';
export const SUGGESTED_SECTION_ID2 = 'e4d6135a-bd06-11e9-9cb5-2a2ae2dbcce4';

const suggestions: Array<Partial<SuggestionRaw>> = [
  {
    id: EDIT_SUGGESTION_ID1,
    section_id: NORWAY_SJOA_AMOT,
    description: 'edit suggestion 1',
    created_by: TEST_USER_ID,
  },
  {
    id: EDIT_SUGGESTION_ID2,
    section_id: NORWAY_SJOA_AMOT,
    description: 'edit suggestion 2',
    status: SuggestionStatus.ACCEPTED,
    resolved_by: ADMIN_ID,
  },
  {
    id: EDIT_SUGGESTION_ID3,
    section_id: GALICIA_BECA_LOWER,
    description: 'edit suggestion 3',
    status: SuggestionStatus.REJECTED,
    resolved_by: ADMIN_ID,
  },
  {
    id: MEDIA_SUGGESTION_ID1,
    section_id: NORWAY_SJOA_AMOT,
    copyright: 'copyleft1',
    filename: 'media_suggestion1.jpg',
    resolution: [100, 100],
    description: 'media suggestion 1',
    created_by: TEST_USER_ID,
  },
  {
    id: MEDIA_SUGGESTION_ID2,
    section_id: GALICIA_BECA_LOWER,
    copyright: 'copyleft2',
    filename: 'media_suggestion2.jpg',
    resolution: [100, 100],
    description: 'media suggestion 2',
    status: SuggestionStatus.ACCEPTED,
    resolved_by: ADMIN_ID,
  },
  {
    id: MEDIA_SUGGESTION_ID3,
    section_id: GALICIA_BECA_LOWER,
    copyright: 'copyleft3',
    filename: 'media_suggestion3.jpg',
    resolution: [100, 100],
    description: 'media suggestion 3',
    status: SuggestionStatus.REJECTED,
    resolved_by: EDITOR_NO_ID,
  },
];

const suggestedSections = [
  {
    id: SUGGESTED_SECTION_ID1,
    section: {
      id: null,
      name: 'Upper',
      altNames: [],
      seasonNumeric: [],
      river: {
        id: NEW_ID,
        name: 'Driva',
      },
      region: {
        id: REGION_NORWAY,
        name: 'Norway',
      },
      shape: [
        [1, 1, 0],
        [2, 2, 0],
      ],
      difficulty: 4,
      hidden: true,
      tags: [],
      pois: [],
      createdBy: TEST_USER_ID,
    },
  },
  {
    id: SUGGESTED_SECTION_ID2,
    status: SuggestionStatus.ACCEPTED,
    section: {
      id: null,
      name: 'Supsa',
      altNames: [],
      seasonNumeric: [],
      river: {
        id: NEW_ID,
        name: 'Supsa',
      },
      region: {
        id: REGION_GEORGIA,
        name: 'Georgia',
      },
      shape: [
        [2, 2, 0],
        [3, 2, 0],
      ],
      difficulty: 3,
      hidden: true,
      tags: [],
      pois: [],
      createdBy: BOOM_USER_1500_ID,
    },
  },
];

export async function seed(db: Knex) {
  await db.table('suggestions').del();
  await db.table('suggested_sections').del();
  await db.table('suggestions').insert(suggestions);
  await db.table('suggested_sections').insert(suggestedSections);
}
