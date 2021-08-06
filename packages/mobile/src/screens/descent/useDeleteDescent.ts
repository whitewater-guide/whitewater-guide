import { useNavigation } from '@react-navigation/native';

import { RootStackNav } from '~/core/navigation';

import { useDeleteDescentMutation } from './deleteDescent.generated';

export default (descentId: string) => {
  const { goBack } = useNavigation<RootStackNav>();
  const [mutate, { loading }] = useDeleteDescentMutation({
    variables: { id: descentId },
    refetchQueries: ['listMyDescents'],
  });
  return {
    loading,
    deleteDescent: () =>
      mutate()
        .catch(() => {
          // ignore error
        })
        .then(() => goBack()),
  };
};
