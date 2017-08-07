import { gql } from 'react-apollo';
import { ComponentDecorator } from 'react-apollo/types';
import { enhancedQuery, FetchMoreResult } from '../../apollo';
import { Source } from '../sources';
import { GaugeFragments } from './gaugeFragments';
import { Gauge } from './types'; import { ErrorItem } from '../../apollo/enhancedQuery';

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

export interface Result {
  gauges?: Gauge[];
  source: Source;
  count: number;
}

export interface Props {
  sourceId?: string;
  language?: string;
}

export interface GaugesList {
  list: Gauge[];
  count: number;
  loading: boolean;
  loadMore: (params: LoadMoreParams) => void;
}

export interface LoadMoreParams {
  startIndex: number;
  stopIndex: number;
}

export interface ChildProps {
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

// Workaround to make TS emit declarations, see https://github.com/Microsoft/TypeScript/issues/9944
let a: ComponentDecorator<any, any>;
let e: ErrorItem;
