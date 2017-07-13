import { gql, graphql } from 'react-apollo';
import { GaugeFragments } from './gaugeFragments';
import { enhancedQuery } from '../../apollo';

const ListGaugesQuery = gql`
  query listGauges($sourceId:ID!, $language:String, $skip:Int, $limit:Int, $isLoadMore:Boolean!) {
    gauges(sourceId:$sourceId, language:$language, skip:$skip, limit:$limit) {
      ...GaugeCore
      ...GaugeLocation
      ...GaugeLastMeasurements
      ...GaugeHarvestInfo
      enabled
    }

    count: countGauges(sourceId:$sourceId) @skip(if: $isLoadMore)

    source(_id:$sourceId) @skip(if: $isLoadMore) {
      _id
      harvestMode
    }

  }#
  ${GaugeFragments.Core}
  ${GaugeFragments.Location}
  ${GaugeFragments.LastMeasurements}
  ${GaugeFragments.HarvestInfo}
`;

const updateQuery = (prevResult, { fetchMoreResult }) => {
  if (!fetchMoreResult.gauges) {
    return prevResult;
  }
  return { ...prevResult, gauges: [...prevResult.gauges, ...fetchMoreResult.gauges] };
};

const withGaugesList = enhancedQuery(
  ListGaugesQuery,
  {
    options: ({ sourceId, language }) => ({
      fetchPolicy: 'cache-and-network',
      variables: { sourceId, language, isLoadMore: false },
      notifyOnNetworkStatusChange: true,
    }),
    props: ({ data: { gauges, count, source, loading, fetchMore } }) => ({
      source,
      gauges: {
        list: gauges,
        count,
        loading,
        loadMore: ({ startIndex: skip, stopIndex }) => fetchMore({
          variables: { skip, limit: stopIndex - skip, isLoadMore: true },
          updateQuery,
        }),
      },
    }),
  },
);

export default withGaugesList;
