import FlatButton from 'material-ui/FlatButton';
import * as React from 'react';
import { graphql, ChildProps } from 'react-apollo';
import TOGGLE_All_GAUGES from './toggleAllGauges.mutation';

interface OuterProps {
  label: string;
  sourceId: string;
  enabled: boolean;
}

const ToggleAllGaugesButton: React.StatelessComponent<ChildProps<OuterProps, any>> = ({ label, mutate }) => (
  <FlatButton label={label} onClick={() => mutate!({})} />
);

const container = graphql<{}, OuterProps>(
  TOGGLE_All_GAUGES,
  {
    options: ({ sourceId, enabled }) => ({
      variables: { sourceId, enabled },
    }),
  },
);

export default container(ToggleAllGaugesButton);
