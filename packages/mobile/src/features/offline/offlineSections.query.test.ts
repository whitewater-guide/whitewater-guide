import { ListSectionsDocument } from '@whitewater-guide/clients';
import { mockApolloClient } from '@whitewater-guide/clients/dist/test';

import { ListSectionsDocument as OfflineDoc } from './offlineSections.generated';
import { mockApolloData } from './test-utils';

it('should be able to read regular query offline', async () => {
  const mockClient = mockApolloClient(mockApolloData);
  const mockedResult = await mockClient.query({
    query: OfflineDoc,
    fetchPolicy: 'network-only',
    variables: { filter: { regionId: '__test_region_id__' } },
  });
  const cachedResult = await mockClient.query({
    query: ListSectionsDocument,
    fetchPolicy: 'cache-only',
    variables: { filter: { regionId: '__test_region_id__' } },
  });
  expect(mockedResult.data.sections.nodes[0]).toMatchObject(
    cachedResult.data.sections.nodes[0],
  );
});
