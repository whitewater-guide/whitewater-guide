import { REGION_DETAILS } from '@whitewater-guide/clients';
import { apolloClient } from '../../../../core/apollo';
import theme from '../../../../theme';

export default async function downloadRegionData(regionId: string) {
  return apolloClient.query({
    query: REGION_DETAILS(theme.screenWidthPx),
    variables: { regionId },
    fetchPolicy: 'network-only',
  });
}
