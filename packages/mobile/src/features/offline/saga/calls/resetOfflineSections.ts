import { apolloClient } from '../../../../core/apollo';
import { OFFLINE_SECTIONS, Result, Vars } from '../../offlineSections.query';

export default async function resetOfflineSections(regionId: string) {
  apolloClient.writeQuery<Result, Vars>({
    query: OFFLINE_SECTIONS,
    variables: { regionId },
    data: {
      sections: {
        __typename: 'SectionsList',
        nodes: [],
        count: 0,
      },
    },
  });
}
