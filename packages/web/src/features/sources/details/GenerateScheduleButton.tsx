import gql from 'graphql-tag';
import { FlatButton, FlatButtonProps } from 'material-ui';
import * as React from 'react';
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

type OuterProps = Partial<FlatButtonProps> & { sourceId: string };

const container = compose<FlatButtonProps, OuterProps>(
  graphql<{}, OuterProps, FlatButtonProps>(
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
  mapProps(({ sourceId, ...props }) => ({ ...props })),
);

const GenerateScheduleButton = container(FlatButton);

export default GenerateScheduleButton;
