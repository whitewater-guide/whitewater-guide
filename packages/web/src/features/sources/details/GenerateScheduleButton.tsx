import { FlatButton, FlatButtonProps } from 'material-ui';
import * as React from 'react';
import { graphql } from 'react-apollo';
import { emitter, POKE_TABLES } from '../../../utils';
import GENERATE_SOURCE_SCHEDULE from './generateSourceSchedule.mutation';

type OuterProps = Partial<FlatButtonProps> & { sourceId: string };

const container = graphql<{}, OuterProps, FlatButtonProps>(
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
);

const GenerateScheduleButton = container(FlatButton);

export default GenerateScheduleButton;
