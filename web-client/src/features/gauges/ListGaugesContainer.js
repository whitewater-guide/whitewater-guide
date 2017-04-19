import { gql, graphql } from 'react-apollo';
import { compose, withState } from 'recompose';
import _ from 'lodash';
import { withAdmin } from '../users';
import { withFeatureIds } from '../../commons/core';
import { withGaugesList } from '../../commons/features/gauges';

const RemoveGaugeMutation = gql`
  mutation removeGauges($_id: ID){
    removeGauges(_id: $_id)
  }
`;

const EnableGaugeMutation = gql`
  mutation setGaugesEnabled($_id: ID, $enabled:Boolean!){
    gauges: setGaugesEnabled(_id:$_id, enabled: $enabled){
      _id,
      enabled
    }
  }
`;

export default compose(
  withState('language', 'setLanguage', 'en'),
  withFeatureIds(),
  withAdmin(),
  withGaugesList,
  graphql(
    RemoveGaugeMutation, {
      props: ({ mutate }) => ({
        removeGauge: _id => mutate({
          variables: { _id },
          updateQueries: {
            listGauges: prev => ({
              ...prev,
              gauges: _.reject(prev.gauges, { _id }),
              jobsReport: _.reject(prev.jobsReport, { _id }),
            }),
          },
        }),
      }),
    },
  ),
  graphql(
    EnableGaugeMutation, {
      props: ({ mutate }) => ({
        setEnabled: (_id, enabled) => mutate({
          variables: { _id, enabled },
        }),
      }),
    },
  ),
);
