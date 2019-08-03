import Knex from 'knex';
import { SuggestionRaw } from '../../features/suggestions/raw_types';
import { SuggestionStatus } from '../../features/suggestions/types';
import { ADMIN_ID, EDITOR_NO_ID, TEST_USER_ID } from './01_users';
import { GALICIA_R1_S1, NORWAY_SJOA_AMOT } from './09_sections';

export const EDIT_SUGGESTION_ID1 = '5af79398-b3ba-11e9-a2a3-2a2ae2dbcce4';
export const EDIT_SUGGESTION_ID2 = '5af79622-b3ba-11e9-a2a3-2a2ae2dbcce4';
export const EDIT_SUGGESTION_ID3 = '5af79776-b3ba-11e9-a2a3-2a2ae2dbcce4';
export const MEDIA_SUGGESTION_ID1 = '5af798b6-b3ba-11e9-a2a3-2a2ae2dbcce4';
export const MEDIA_SUGGESTION_ID2 = '5af799ec-b3ba-11e9-a2a3-2a2ae2dbcce4';
export const MEDIA_SUGGESTION_ID3 = '5af79d34-b3ba-11e9-a2a3-2a2ae2dbcce4';

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
    section_id: GALICIA_R1_S1,
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
    section_id: GALICIA_R1_S1,
    copyright: 'copyleft2',
    filename: 'media_suggestion2.jpg',
    resolution: [100, 100],
    description: 'media suggestion 2',
    status: SuggestionStatus.ACCEPTED,
    resolved_by: ADMIN_ID,
  },
  {
    id: MEDIA_SUGGESTION_ID3,
    section_id: GALICIA_R1_S1,
    copyright: 'copyleft3',
    filename: 'media_suggestion3.jpg',
    resolution: [100, 100],
    description: 'media suggestion 3',
    status: SuggestionStatus.REJECTED,
    resolved_by: EDITOR_NO_ID,
  },
];

export async function seed(db: Knex) {
  await db.table('suggestions').del();
  await db.table('suggestions').insert(suggestions);
}
