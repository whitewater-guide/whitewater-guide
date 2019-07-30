import Button, { ButtonProps } from '@material-ui/core/Button';
import gql from 'graphql-tag';
import React from 'react';
import { graphql } from 'react-apollo';
import { compose, mapProps } from 'recompose';

const AUTOFILL_MUTATION = gql`
  mutation autofillSource($sourceId: ID!) {
    autofillSource(id: $sourceId) {
      id
      cron
    }
  }
`;

interface TVariables {
  sourceId: string;
}

type OuterProps = Partial<ButtonProps> & TVariables;

const container = compose<ButtonProps, OuterProps>(
  graphql<OuterProps, {}, {}, ButtonProps>(AUTOFILL_MUTATION, {
    options: () => ({
      refetchQueries: ['listGauges'],
    }),
    props: ({ mutate, ownProps: { sourceId } }) => ({
      onClick: () =>
        mutate!({ sourceId } as any).catch(() => {
          /* Ignore -> error goes to global snackbar */
        }),
    }),
  }),
  mapProps(({ sourceId, ...props }: ButtonProps & TVariables) => ({
    ...props,
  })),
);

const AutofillButton = container(Button);

export default AutofillButton;
