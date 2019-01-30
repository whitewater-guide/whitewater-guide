import { graphql } from 'react-apollo';
import TOGGLE_GAUGE from './toggleGauge.mutation';

export interface WithToggleGauge {
  toggleGauge: (id: string, enabled: boolean) => Promise<any>;
}

export default graphql(TOGGLE_GAUGE, {
  props: ({ mutate }) => ({
    toggleGauge: (id: string, enabled: boolean) =>
      mutate!({ variables: { id, enabled } }),
  }),
});
