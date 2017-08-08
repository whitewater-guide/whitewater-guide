import { gql } from 'react-apollo';
import { enhancedQuery } from '../../apollo/enhancedQuery';
import { FetchMoreResult } from '../../apollo/types';
import { Gauge, Source } from '../../ww-commons';
import { GaugeFragments } from './gaugeFragments';

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

interface Result {
  gauges?: Gauge[];
  source: Source;
  count: number;
}

interface Props {
  sourceId?: string;
  language?: string;
}

interface GaugesList {
  list: Gauge[];
  count: number;
  loading: boolean;
  loadMore: (params: LoadMoreParams) => void;
}

interface LoadMoreParams {
  startIndex: number;
  stopIndex: number;
}

interface ChildProps {
  source: Source;
  gauges: GaugesList;
}

const updateQuery = (prevResult: Result, { fetchMoreResult }: FetchMoreResult<Result> ) => {
  if (!fetchMoreResult.gauges) {
    return prevResult;
  }
  return { ...prevResult, gauges: [...prevResult.gauges!, ...fetchMoreResult.gauges] };
};

export const withGaugesList = enhancedQuery<Result, Props, ChildProps>(
  ListGaugesQuery,
  {
    options: ({ sourceId, language }) => ({
      fetchPolicy: 'cache-and-network',
      variables: { sourceId, language, isLoadMore: false },
      notifyOnNetworkStatusChange: true,
    }),
    props: ({ data }) => {
      const { gauges, count, source, loading, fetchMore } = data!;
      return {
        source,
        gauges: {
          list: gauges,
          count,
          loading,
          loadMore: ({ startIndex: skip, stopIndex }: LoadMoreParams) => fetchMore({
            variables: { skip, limit: stopIndex - skip, isLoadMore: true },
            updateQuery,
          }),
        },
      };
    },
  },
);
