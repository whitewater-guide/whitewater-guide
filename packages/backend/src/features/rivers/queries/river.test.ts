import { fakeContext, noTimestamps, runQuery } from '@test';

import db, { holdTransaction, rollbackTransaction } from '~/db';
import { ADMIN, EDITOR_NO_EC } from '~/seeds/test/01_users';
import {
  RIVER_BZHUZHA,
  RIVER_GAL_BECA,
  RIVER_SJOA,
} from '~/seeds/test/07_rivers';

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

const query = `
  query river($id: ID, $sectionsPage: Page){
    river(id: $id) {
      id
      name
      altNames
      region {
        id
        name
      }
      sections(page: $sectionsPage) {
        nodes {
          id
          name
        }
        count
      }
      createdAt
      updatedAt
    }
  }
`;

it('should return river', async () => {
  const result = await runQuery(query, { id: RIVER_GAL_BECA });
  expect(result.errors).toBeUndefined();
  const river = result.data!.river;
  expect(noTimestamps(river)).toMatchSnapshot();
});

it('should return null when id not specified', async () => {
  const result = await runQuery(query);
  expect(result.errors).toBeUndefined();
  expect(result.data).toBeDefined();
  expect(result.data!.river).toBeNull();
});

it('should be able to specify language', async () => {
  const result = await runQuery(
    query,
    { id: RIVER_SJOA },
    fakeContext(EDITOR_NO_EC, 'ru'),
  );
  expect(result.errors).toBeUndefined();
  expect(result.data!.river.name).toBe('Шоа');
});

it('should fall back to english when not translated', async () => {
  const result = await runQuery(
    query,
    { id: RIVER_SJOA },
    fakeContext(EDITOR_NO_EC, 'pt'),
  );
  expect(result.errors).toBeUndefined();
  expect(result.data!.river.name).toBe('Sjoa');
});

it('should get sections', async () => {
  const result = await runQuery(query, { id: RIVER_GAL_BECA });
  expect(result.data!.river.sections).toMatchSnapshot();
});

it('should paginate sections', async () => {
  const result = await runQuery(query, {
    id: RIVER_BZHUZHA,
    sectionsPage: { limit: 1, offset: 1 },
  });
  expect(result.data!.river.sections.count).toBe(3);
  expect(result.data!.river.sections.nodes).toHaveLength(1);
  expect(result).toHaveProperty(
    'data.river.sections.nodes.0.name',
    'Long Race',
  );
});

it('should fire two queries for river->sections->river', async () => {
  const q = `
    query river($id: ID, $sectionsPage: Page){
      river(id: $id) {
        id
        sections(page: $sectionsPage) {
          nodes {
            id
            name
            river {
              id
              name
            }
          }
          count
        }
      }
    }
  `;

  const queryMock = jest.fn();
  db().on('query', queryMock);
  await runQuery(q, { id: RIVER_BZHUZHA }, fakeContext(ADMIN));
  db().removeListener('query', queryMock);
  expect(queryMock).toHaveBeenCalledTimes(2);
});
