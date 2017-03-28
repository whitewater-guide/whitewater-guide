import {graphql, compose} from 'react-apollo';
import gql from 'graphql-tag';
import {withAdmin} from '../users';
import {withFeatureIds} from '../../core/hoc';
import {withState} from 'recompose';
import _ from 'lodash';

const ListGaugesQuery = gql`
  query listGauges($sourceId:ID!, $language:String, $skip:Int, $limit:Int, $isLoadMore:Boolean!) {
    gauges(sourceId:$sourceId, language:$language, skip:$skip, limit:$limit) {
      _id
      name
      code
      location {
        coordinates
      }
      levelUnit
      flowUnit
      requestParams
      cron
      lastTimestamp
      lastLevel
      lastFlow
      url
      enabled
    }
    
    count: countGauges(sourceId:$sourceId) @skip(if: $isLoadMore)
    
    source(_id:$sourceId) @skip(if: $isLoadMore) {
      _id
      harvestMode
    }

    jobsReport(sourceId:$sourceId) @skip(if: $isLoadMore) {
      _id,
      count,
    }
  }
`;

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
  withState('language','setLanguage','en'),
  withFeatureIds(),
  withAdmin(),
  graphql(
    ListGaugesQuery, {
      options: ({sourceId, language}) => ({
        fetchPolicy: 'network-only',
        variables: {sourceId, language, isLoadMore: false},
      }),
      props: ({data: {gauges, count, source, jobsReport, loading, fetchMore}}) => {
        return {
          gauges,
          count,
          jobsReport,
          source,
          loading,
          loadMore: ({startIndex: skip, stopIndex}) => {
            return fetchMore({
              variables: {skip, limit: stopIndex - skip, isLoadMore: true},
              updateQuery: (prevResult, {fetchMoreResult}) => {
                if (!fetchMoreResult.data)
                  return prevResult;
                return {...prevResult, gauges: [...prevResult.gauges, ...fetchMoreResult.data.gauges]};
              }
            });
          }
        };
      }
    }
  ),
  graphql(
    RemoveGaugeMutation, {
      props: ({mutate}) => ({removeGauge: _id => mutate({
        variables: {_id},
        updateQueries: {
          listGauges: (prev) => {
            return {...prev, gauges: _.reject(prev.gauges, {_id}), jobsReport: _.reject(prev.jobsReport, {_id})};
          }
        },
      })}),
    }
  ),
  graphql(
    EnableGaugeMutation, {
      props: ({mutate}) => ({setEnabled: (_id, enabled) => mutate({
        variables: {_id, enabled},
      })}),
    }
  ),
);