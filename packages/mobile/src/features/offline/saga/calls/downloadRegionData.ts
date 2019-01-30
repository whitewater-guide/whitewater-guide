import { REGION_DETAILS } from '@whitewater-guide/clients';
import { getApolloClient } from '../../../../core/apollo';

export default async function downloadRegionData(regionId: string) {
  const client = await getApolloClient();
  await client.query({
    query: REGION_DETAILS,
    variables: { regionId },
    fetchPolicy: 'network-only',
  });
}
