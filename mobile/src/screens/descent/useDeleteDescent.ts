import { useNavigation } from '@react-navigation/native';
import gql from 'graphql-tag';
import { useMutation } from 'react-apollo';

import { RootStackNav } from '~/core/navigation';

const DELETE_DESCENT_MUTATION = gql`
  mutation deleteDescent($id: ID!) {
    deleteDescent(id: $id)
  }
`;

interface Vars {
  id: string;
}

export default (descentId: string) => {
  const { goBack } = useNavigation<RootStackNav>();
  const [mutate, { loading }] = useMutation<any, Vars>(
    DELETE_DESCENT_MUTATION,
    {
      variables: { id: descentId },
      refetchQueries: ['listMyDescents'],
    },
  );
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
