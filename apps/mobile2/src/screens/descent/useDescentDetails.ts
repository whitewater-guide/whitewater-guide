import { useDescentDetailsQuery } from './descentDetails.generated';

export default function useDescentDetails(descentId: string) {
  return useDescentDetailsQuery({
    variables: { descentId },
    fetchPolicy: 'cache-and-network',
  });
}
