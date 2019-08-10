import Button from '@material-ui/core/Button';
import React from 'react';
import { graphql } from 'react-apollo';
import { TOGGLE_ALL_GAUGES } from './toggleAllGauges.mutation';

interface OuterProps {
  label: string;
  sourceId: string;
}

interface Variables {
  sourceId: string;
  enabled: boolean;
}

interface InnerProps {
  mutate: () => Promise<any>;
}

const DisableAllGaugesButton: React.FC<InnerProps & OuterProps> = ({
  label,
  mutate,
}) => (
  <Button variant="contained" onClick={mutate}>
    {label}
  </Button>
);

const container = graphql<OuterProps, {}, Variables, InnerProps>(
  TOGGLE_ALL_GAUGES,
  {
    options: ({ sourceId }) => ({
      variables: { sourceId, enabled: false },
    }),
    props: ({ mutate, ownProps: { sourceId } }) => ({
      mutate: () =>
        mutate!({ sourceId } as any).catch(() => {
          /* Ignore -> error goes to global snackbar */
        }),
    }),
  },
);

export default container(DisableAllGaugesButton);
