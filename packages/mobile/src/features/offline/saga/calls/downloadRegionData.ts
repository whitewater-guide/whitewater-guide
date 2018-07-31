import { getApolloClient } from '../../../../core/apollo';
import { REGION_DETAILS } from '../../../../ww-clients/features/regions';

export default async function downloadRegionData(regionId: string) {
  const client = await getApolloClient();
  await client.query({
    query: REGION_DETAILS,
    variables: { regionId },
    fetchPolicy: 'network-only',
  });
}
