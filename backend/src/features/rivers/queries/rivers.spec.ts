import { holdTransaction, rollbackTransaction } from '../../../db';
import { superAdminContext, userContext } from '../../../test/context';
import { noTimestamps, runQuery } from '../../../test/db-helpers';

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

const query = `
  query listRivers($language: String, $page: Page){
    rivers(language: $language, page: $page) {
      nodes {
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
      count
    }
  }
`;

it('should return rivers', async () => {
});

it('should be able to specify language', async () => {
});

it('should return empty array of alt names when not translated', async () => {

});

it('should return sections count', async () => {
});
