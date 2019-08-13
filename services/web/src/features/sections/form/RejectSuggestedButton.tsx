import Button from '@material-ui/core/Button';
import gql from 'graphql-tag';
import React, { useCallback } from 'react';
import { useMutation } from 'react-apollo';
import useRouter from 'use-react-router';
import { ButtonProgress } from '../../../components';

const mutation = gql`
  mutation rejectSuggestedSection($id: ID!) {
    rejectSuggestedSection(id: $id) {
      id
      status
    }
  }
`;

interface Props {
  suggestedSectionId?: string;
}

const RejectSuggestedButton: React.FC<Props> = React.memo(
  ({ suggestedSectionId }) => {
    const { history } = useRouter();
    const [mutate, { loading }] = useMutation(mutation, {
      variables: { id: suggestedSectionId },
    });
    const onClick = useCallback(() => mutate().then(() => history.goBack()), [
      history,
    ]);
    if (!suggestedSectionId) {
      return null;
    }
    return (
      <ButtonProgress loading={loading}>
        <Button
          variant="contained"
          color="primary"
          onClick={loading ? undefined : onClick}
        >
          Reject
        </Button>
      </ButtonProgress>
    );
  },
);

RejectSuggestedButton.displayName = 'RejectSuggestedButton';

export default RejectSuggestedButton;
