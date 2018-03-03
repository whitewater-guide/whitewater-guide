import FlatButton from 'material-ui/FlatButton';
import * as React from 'react';
import { graphql } from 'react-apollo';
import { emitter, POKE_TABLES } from '../../../utils';
import TOGGLE_All_GAUGES from './toggleAllGauges.mutation';

interface OuterProps {
  label: string;
  sourceId: string;
  enabled: boolean;
}

interface Variables {
  sourceId: string;
  enabled: boolean;
}

interface InnerProps {
  label: string;
  mutate: () => Promise<any>;
}

const ToggleAllGaugesButton: React.StatelessComponent<InnerProps> = ({ label, mutate }) => (
  <FlatButton secondary label={label} onClick={mutate} />
);

const container = graphql<{}, OuterProps, InnerProps, Variables>(
  TOGGLE_All_GAUGES,
  {
    options: ({ sourceId, enabled }) => ({
      variables: { sourceId, enabled },
    }),
    props: ({ mutate, ownProps: { enabled, sourceId } }) => ({
      mutate: () =>
        mutate!({ sourceId, enabled } as any)
          .catch(() => {}) // Ignore -> error goes to global snackbar
          .finally(() => {
            emitter.emit(POKE_TABLES);
          }),
    }),
  },
);

export default container(ToggleAllGaugesButton);
