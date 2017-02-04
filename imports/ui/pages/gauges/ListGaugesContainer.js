import {graphql, compose} from 'react-apollo';
import gql from 'graphql-tag';
import withAdmin from '../../hoc/withAdmin';
import {withRouter} from 'react-router';
import {withProps, withState} from 'recompose';

const ListGaugesQuery = gql`
  query listGauges($sourceId:ID, $language:String, $skip:Int, $limit:Int, $isLoadMore:Boolean!) {
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

    jobsReport(sourceId:$sourceId) @skip(if: $isLoadMore) {
      _id,
      count,
    }
  }
`;

export default compose(
  withState('language','setLanguage','en'),
  withProps(props => ({sourceId: props.location.query.sourceId})),
  withAdmin,
  withRouter,
  graphql(
    ListGaugesQuery, {
      options: ({sourceId, language}) => ({
        forceFetch: true,
        variables: {sourceId, language, isLoadMore: false}
      }),
      props: ({data: {gauges, count, jobsReport, loading, fetchMore}}) => {
        return {
          gauges,
          count,
          jobsReport,
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
);