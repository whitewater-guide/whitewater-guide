import { gql, graphql } from 'react-apollo';
import { withState, withHandlers, mapProps, compose } from 'recompose';
import { filter } from 'graphql-anywhere';
import moment from 'moment';
import { withFeatureIds } from '../../core/withFeatureIds';
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

const coreGraphql = propName => graphql(
  ViewGaugeQuery,
  {
    options: ({ gaugeId, admin, language }) => ({
      fetchPolicy: 'cache-and-network',
      variables: { gaugeId, language, withHarvestInfo: admin },
    }),
    props: ({ data: { gauge, loading } }) => {
      // Convert custom scalar, clean __typenames so they don't mess with forms
      let result = null;
      if (gauge) {
        result = {
          ...filter(GaugeFragments.All, gauge),
          requestParams: JSON.stringify(gauge.requestParams),
        };
      }
      return { [propName]: result, gaugeLoading: loading };
    },
  },
);

const measurementsGraphql = propName => graphql(
  ViewMeasurementsQuery,
  {
    options: ({ gaugeId, startDate, endDate }) => ({
      fetchPolicy: 'cache-and-network',
      variables: { gaugeId, startDate: startDate.toString(), endDate: endDate.toString() },
    }),
    props: ({ data: { gauge, loading }, ownProps }) => {
      if (!gauge) {
        return { [propName]: null, gaugeLoading: true };
      }
      const { measurements, ...restGauge } = gauge;
      // This measurements query is never used alone, only together with coreGraphql query (see above)
      // Therefore some gauge fields are coming from parent and should be merged, as well as loading status
      const mergedGauge = {
        ...ownProps.gauge,
        ...restGauge,
        measurements: measurements.map(({ date, ...rest }) => ({ date: new Date(date), ...rest })),
      };
      return { [propName]: mergedGauge, gaugeLoading: loading || ownProps.gaugeLoading };
    },
  },
);

export default function withGauge({ withMeasurements = false, propName = 'gauge' }) {
  let hocs = [
    withFeatureIds('gauge'),
    coreGraphql(propName),
  ];
  if (withMeasurements) {
    hocs = [
      ...hocs,
      withState('timeDomain', 'setTimeDomain', [moment().subtract(1, 'days').toDate(), new Date()]),
      withHandlers({
        onDomainChanged: props => ([startDate, endDate]) => {
          const [oldStart, oldEnd] = props.timeDomain;
          const newStart = moment(startDate).isBefore(oldStart) ? startDate : oldStart;
          const newEnd = moment(endDate).isAfter(oldEnd) ? endDate : oldEnd;
          props.setTimeDomain([newStart, newEnd]);
        },
      }),
      mapProps(({ timeDomain: [startDate, endDate], ...props }) => ({ ...props, startDate, endDate })),
      measurementsGraphql(propName),
    ];
  }
  return compose(...hocs);
}
