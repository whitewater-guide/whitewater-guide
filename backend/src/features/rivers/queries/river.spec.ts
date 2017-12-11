import { holdTransaction, rollbackTransaction } from '../../../db';
import { superAdminContext, userContext } from '../../../test/context';
import { noTimestamps, runQuery } from '../../../test/db-helpers';

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

const query = `
  query riverDetails($id: ID, $language: String){
    river(id: $id, language: $language) {
      id
      language
      name
      description
      season
      seasonNumeric
      bounds
      hidden
      createdAt
      updatedAt
      pois {
        id
        language
        name
        description
        kind
        coordinates
      }
    }
  }
`;

it('should return river', async () => {
});

it('should return null when id not specified', async () => {
});

it('should be able to specify language', async () => {
});

it('should be able to get basic attributes without translation', async () => {
});

it('should get sections count', async () => {
});
