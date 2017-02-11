import {graphql, compose} from 'react-apollo';
import gql from 'graphql-tag';
import {withAdmin} from '../users';
import {withRouter} from 'react-router';
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

    jobsReport {
      _id,
      count,
    }
  }
`;

const RemoveSourceMutation = gql`
  mutation removeSource($sourceId: ID!){
    removeSource(sourceId: $sourceId)
  }
`;

const SetSourceEnabledMutation = gql`
  mutation setSourceEnabled($sourceId: ID!, $enabled: Boolean!){
    setSourceEnabled(sourceId: $sourceId, enabled: $enabled){
      _id,
      enabled,
    }
  }
`;

export default compose(
  withAdmin(),
  withRouter,
  graphql(
    ListSourcesQuery, {
      props: ({data: {sources, jobsReport, loading}}) => ({sources, jobsReport, ready: !loading})
    }
  ),
  graphql(
    RemoveSourceMutation, {
      props: ({mutate}) => ({removeSource: sourceId => mutate({
        variables: {sourceId},
        updateQueries: {
          listSources: (prev) => {
            return {...prev, sources: _.filter(prev.sources, v => v._id != sourceId), jobsReport: _.filter(prev.jobsReport, v => v._id != sourceId)};
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