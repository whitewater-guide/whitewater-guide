import { LIST_SECTIONS, mockApolloClient } from '@whitewater-guide/clients';
import { OFFLINE_SECTIONS } from './offlineSections.query';
import { mockApolloData } from './saga/test-utils';

it('should be able to read regular query offline', async () => {
  const mockClient = mockApolloClient(mockApolloData);
  const mockedResult = await mockClient.query({
    query: OFFLINE_SECTIONS,
    fetchPolicy: 'network-only',
    variables: { filter: { regionId: '__test_region_id__' } },
  });
  const cachedResult = await mockClient.query({
    query: LIST_SECTIONS,
    fetchPolicy: 'cache-only',
    variables: { filter: { regionId: '__test_region_id__' } },
  });
  expect(mockedResult.data.sections.nodes[0]).toMatchObject(
    cachedResult.data.sections.nodes[0],
  );
});
