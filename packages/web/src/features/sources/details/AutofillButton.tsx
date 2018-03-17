import gql from 'graphql-tag';
import { FlatButton, FlatButtonProps } from 'material-ui';
import * as React from 'react';
import { graphql } from 'react-apollo';
import { emitter, POKE_TABLES } from '../../../utils';

const AUTOFILL_MUTATION = gql`
  mutation autofillSource($sourceId: ID!){
    autofillSource(id: $sourceId) {
      id
      language
      cron
    }
  }
`;

type OuterProps = Partial<FlatButtonProps> & { sourceId: string };

const container = graphql<{}, OuterProps, FlatButtonProps>(
  AUTOFILL_MUTATION,
  {
    options: {
      refetchQueries: ['listGauges'],
    },
    props: ({ mutate, ownProps: { sourceId } }) => ({
      onClick: () =>
        mutate!({ sourceId } as any)
          .catch(() => {/* Ignore -> error goes to global snackbar */})
          .finally(() => {
            emitter.emit(POKE_TABLES);
          }),
    }),
  },
);

const AutofillButton = container(FlatButton);

export default AutofillButton;