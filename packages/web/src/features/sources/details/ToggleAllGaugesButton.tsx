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
  toggle: () => void;
}

const ToggleAllGaugesButton: React.StatelessComponent<InnerProps> = ({ label, toggle }) => (
  <FlatButton label={label} onClick={toggle} />
);

const container = graphql<{}, OuterProps, InnerProps, Variables>(
  TOGGLE_All_GAUGES,
  {
    options: ({ sourceId, enabled }) => ({
      variables: { sourceId, enabled },
    }),
    props: ({ mutate, ownProps: { enabled, sourceId} }) => ({
      toggle: () => {
        mutate!({ sourceId, enabled } as any).finally(() => {
          emitter.emit(POKE_TABLES);
        });
      },
    }),
  },
);

export default container(ToggleAllGaugesButton);
