import {graphql, compose} from 'react-apollo';
import gql from 'graphql-tag';
import {withAdmin} from '../users';
import _ from 'lodash';

const ListSourcesQuery = gql`
  query listSources {
    sources {
      _id,
      name,
      url,
      script,
      harvestMode,
      cron,
      enabled,
    }
  }
`;

const RemoveSourceMutation = gql`
  mutation removeSource($_id: ID!){
    removeSource(_id: $_id)
  }
`;

const SetSourceEnabledMutation = gql`
  mutation setSourceEnabled($sourceId: ID!, $enabled: Boolean!){
    setSourceEnabled(_id: $sourceId, enabled: $enabled){
      _id,
      enabled,
    }
  }
`;

export default compose(
  withAdmin(),
  graphql(
    ListSourcesQuery, {
      props: ({data: {sources = [], loading}}) => ({sources, ready: !loading})
    }
  ),
  graphql(
    RemoveSourceMutation, {
      props: ({mutate}) => ({removeSource: _id => mutate({
        variables: {_id},
        updateQueries: {
          listSources: (prev) => {
            return {...prev, sources: _.filter(prev.sources, v => v._id !== _id)};
          }
        },
      })}),
    }
  ),
  graphql(
    SetSourceEnabledMutation, {
      props: ({mutate}) => ({setEnabled: (sourceId, enabled) => mutate({
        variables: {sourceId, enabled},
      })}),
    }
  ),
);