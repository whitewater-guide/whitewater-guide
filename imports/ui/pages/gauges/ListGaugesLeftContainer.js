import {graphql, compose} from 'react-apollo';
import gql from 'graphql-tag';
import withAdmin from '../../hoc/withAdmin';
import {withRouter} from 'react-router';
import {withProps} from 'recompose';

const CountGaugesQuery = gql`
  query countGauges($sourceId: ID){
    count: countGauges(sourceId:$sourceId)
  }
`;

const RemoveGaugesMutation = gql`
  mutation removeGauges($sourceId: ID, $disabledOnly:Boolean){
    removeGauges(sourceId: $sourceId, disabledOnly: $disabledOnly)
  }
`;

const EnableGaugesMutation = gql`
  mutation setGaugesEnabled($sourceId: ID,, $enabled:Boolean!){
    gauges: setGaugesEnabled(sourceId: $sourceId, enabled: $enabled){
      _id,
      enabled
    }
  }
`;

const AutofillSourceMutation = gql`
  mutation autofillSource($sourceId: ID!){
    autofillSource(sourceId: $sourceId)
  }
`;

const GenerateScheduleMutation = gql`
  mutation generateSourceSchedule($sourceId: ID!){
    generateSourceSchedule(sourceId: $sourceId)
  }
`;

export default compose(
  withProps(props => ({sourceId: props.location.query.sourceId})),
  withAdmin,
  withRouter,
  graphql(
    CountGaugesQuery, {
      props: ({data: {count}}) => ({count})
    }
  ),
  graphql(
    RemoveGaugesMutation, {
      props: ({mutate}) => ({removeGauges: (sourceId, enabled) => mutate({
        variables: {sourceId, enabled},
        refetchQueries: ['listGauges', 'countGauges'],
      })}),
    }
  ),
  graphql(
    EnableGaugesMutation, {
      props: ({mutate}) => ({setEnabled: (sourceId, enabled) => mutate({
        variables: {sourceId, enabled},
        refetchQueries: ['listGauges'],
      })}),
    }
  ),
  graphql(
    AutofillSourceMutation, {
      props: ({mutate}) => ({autofill: sourceId => mutate({
        variables: {sourceId},
        refetchQueries: ['listGauges'],
      })}),
    }
  ),
  graphql(
    GenerateScheduleMutation, {
      props: ({mutate}) => ({generateSchedule: sourceId => mutate({
        variables: {sourceId},
        refetchQueries: ['listGauges'],
      })}),
    }
  ),
);