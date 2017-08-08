import * as moment from 'moment';
import { gql, graphql } from 'react-apollo';
import { ComponentEnhancer, compose, mapProps, renameProp, withHandlers, withState } from 'recompose';
import { withFeatureIds } from '../../core/withFeatureIds';
import { Gauge } from '../../../ww-commons';
import { GaugeFragments } from './gaugeFragments';

const ViewGaugeQuery = gql`
  query viewGaugeQuery( $gaugeId: ID, $language:String ) {
    gauge(_id: $gaugeId, language: $language) {
      ...GaugeCore
      ...GaugeLocation
      ...GaugeHarvestInfo
    }
  }
  ${GaugeFragments.Core}
  ${GaugeFragments.Location}
  ${GaugeFragments.HarvestInfo}
`;

const ViewMeasurementsQuery = gql`
  query viewMeasurementsQuery($gaugeId: ID, $startDate: Date!, $endDate: Date!) {
    gauge(_id: $gaugeId) {
      _id
      lastTimestamp
      lastLevel
      lastFlow
      levelUnit
      flowUnit
      measurements(startDate: $startDate, endDate:$endDate) {
        date
        level
        flow
      }
    }
  }
`;

interface WithGaugeInput {
  gaugeId: string;
  language?: string;
  startDate?: Date;
  endDate?: Date;
}

interface WithGaugeResult {
  gauge: Gauge;
}

interface WithGaugeProps {
  gaugeLoading: boolean;
  gauge: Gauge;
}

const coreGraphql = graphql<WithGaugeResult, WithGaugeInput, WithGaugeProps>(
  ViewGaugeQuery,
  {
    options: ({ gaugeId, language }) => ({
      fetchPolicy: 'cache-and-network',
      variables: { gaugeId, language },
    }),
    props: ({ data }) => {
      const { gauge, loading } = data!;
      let result: Gauge | null = null;
      if (gauge) {
        result = {
          ...gauge,
          requestParams: JSON.stringify(gauge.requestParams),
        };
      }
      return { gauge: result, gaugeLoading: loading };
    },
  },
);

const measurementsGraphql = graphql<WithGaugeResult, WithGaugeInput & WithGaugeProps, WithGaugeProps>(
  ViewMeasurementsQuery,
  {
    options: ({ gaugeId, startDate, endDate }) => ({
      fetchPolicy: 'cache-and-network',
      variables: { gaugeId, startDate: startDate!.toString(), endDate: endDate!.toString() },
    }),
    props: ({ data, ownProps }) => {
      const { gauge, loading } = data!;
      if (!gauge) {
        return { gauge: ownProps.gauge, gaugeLoading: true };
      }
      const { measurements, ...restGauge } = gauge;
      // This measurements query is never used alone, only together with coreGraphql query (see above)
      // Therefore some gauge fields are coming from parent and should be merged, as well as loading status
      const mergedGauge: Gauge = {
        ...ownProps.gauge,
        ...restGauge,
        measurements: measurements!.map(({ date, ...rest }) => ({ date: new Date(date), ...rest })),
      };
      return { gauge: mergedGauge, gaugeLoading: loading || ownProps.gaugeLoading };
    },
  },
);

export interface WithGaugeOptions {
  withMeasurements?: boolean;
  propName?: string;
}

interface WithTimeDomain {
  timeDomain: [Date, Date];
  setTimeDomain: (domain: [Date, Date]) => void;
}

export function withGauge<GaugeProp = {gauge: Gauge | null}>(options: WithGaugeOptions) {
  const { withMeasurements = false, propName = 'gauge' } = options;
  let hocs: any[] = [
    withFeatureIds('gauge'),
    coreGraphql,
  ];
  if (withMeasurements) {
    hocs = [
      ...hocs,
      withState('timeDomain', 'setTimeDomain', [moment().subtract(1, 'days').toDate(), new Date()]),
      withHandlers<WithTimeDomain, any>({
        onDomainChanged: props => ([startDate, endDate]: [Date, Date]) => {
          const [oldStart, oldEnd] = props.timeDomain;
          const newStart = moment(startDate).isBefore(oldStart) ? startDate : oldStart;
          const newEnd = moment(endDate).isAfter(oldEnd) ? endDate : oldEnd;
          props.setTimeDomain([newStart, newEnd]);
        },
      }),
      mapProps(({ timeDomain: [startDate, endDate], ...props }) => ({ ...props, startDate, endDate })),
      measurementsGraphql,
    ];
  }
  if (propName !== 'gauge') {
    hocs = [...hocs, renameProp('gauge', propName)];
  }
  return compose(...hocs);
}

// Workaround to make TS emit declarations, see https://github.com/Microsoft/TypeScript/issues/9944
let a: ComponentEnhancer<any, any>;
