import gql from 'graphql-tag';
import { FlatButton, FlatButtonProps } from 'material-ui';
import React from 'react';
import { graphql } from 'react-apollo';
import { compose, mapProps } from 'recompose';
import { emitter, POKE_TABLES } from '../../../utils';

const GENERATE_SOURCE_SCHEDULE = gql`
  mutation generateSourceSchedule($sourceId: ID!){
    generateSourceSchedule(id: $sourceId) {
      id
      language
      cron
    }
  }
`;

interface TVariables {
  sourceId: string;
}

type OuterProps = Partial<FlatButtonProps> & TVariables;

const container = compose<FlatButtonProps, OuterProps>(
  graphql<OuterProps, {}, TVariables, FlatButtonProps>(
    GENERATE_SOURCE_SCHEDULE,
    {
      props: ({ mutate, ownProps: { sourceId } }) => ({
        onClick: () =>
          mutate!({ sourceId } as any)
            .catch(() => {/* Ignore -> error goes to global snackbar */})
            .finally(() => {
              emitter.emit(POKE_TABLES);
            }),
      }),
    },
  ),
  mapProps(({ sourceId, ...props }: FlatButtonProps & TVariables) => ({ ...props })),
);

const GenerateScheduleButton = container(FlatButton);

export default GenerateScheduleButton;
