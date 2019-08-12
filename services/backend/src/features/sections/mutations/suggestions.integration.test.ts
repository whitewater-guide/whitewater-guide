import db, { holdTransaction, rollbackTransaction } from '@db/db';
import { EDITOR_NO, EDITOR_NO_ID, TEST_USER_ID } from '@seeds/01_users';
import { REGION_NORWAY } from '@seeds/04_regions';
import { SUGGESTED_SECTION_ID1 } from '@seeds/17_suggestions';
import { fakeContext, runQuery, TIMESTAMP_REGEX, UUID_REGEX } from '@test';
import { SuggestionStatus } from '@whitewater-guide/commons';

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

const query = `
  query suggestedSection($id: ID!){
    suggestedSection(id: $id) {
      __typename
      status
      region {
        id
        name
      }
      river {
        id
        name
      }
      name
      section
    }
  }
`;

const mutation = `
  mutation upsertSection($section: SectionInput!){
    upsertSection(section: $section){
      id
      name
      description
      season
      seasonNumeric
      region {
        id
        name
      }
      river {
        id
        name
      }
      gauge {
        id
        name
      }
      levels {
        minimum
        optimum
        maximum
        impossible
        approximate
      }
      flows {
        minimum
        optimum
        maximum
        impossible
        approximate
      }
      flowsText
      putIn {
        id
        name
        coordinates
      }
      takeOut {
        id
        name
        coordinates
      }
      shape
      distance
      drop
      duration
      difficulty
      difficultyXtra
      rating
      tags {
        id
        name
      }
      createdAt
      updatedAt
      hidden
      pois {
        id
        name
        coordinates
      }
    }
  }
`;

const testCase = async () => {
  const input = await runQuery(
    query,
    { id: SUGGESTED_SECTION_ID1 },
    fakeContext(EDITOR_NO),
  );
  return runQuery(
    mutation,
    { section: input.data.suggestedSection.section },
    fakeContext(EDITOR_NO),
  );
};

describe('suggested section as upsert input', () => {
  it('should return result', async () => {
    const result = await testCase();
    expect(result.errors).toBeUndefined();
    expect(result.data.upsertSection).toMatchObject({
      id: expect.stringMatching(UUID_REGEX),
      name: 'Upper',
      river: {
        id: expect.stringMatching(UUID_REGEX),
        name: 'Driva',
      },
      region: {
        id: REGION_NORWAY,
        name: 'Norway',
      },
    });
  });

  it('should mark suggested section as accepted by this editor', async () => {
    const result = await testCase();
    const suggestedSection = await db(false)
      .select('*')
      .from('suggested_sections')
      .where({ id: SUGGESTED_SECTION_ID1 })
      .first();
    expect(suggestedSection).toMatchObject({
      status: SuggestionStatus.ACCEPTED,
      resolved_at: expect.any(Date),
      resolved_by: EDITOR_NO_ID,
    });
  });

  it('upserted section should keep original creator', async () => {
    const result = await testCase();
    const { created_by } = await db(false)
      .select('created_by')
      .from('sections')
      .where({ id: result.data.upsertSection.id })
      .first();
    expect(created_by).toBe(TEST_USER_ID);
  });
});
