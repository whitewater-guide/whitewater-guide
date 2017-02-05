import gql from 'graphql-tag';
import {graphql} from 'react-apollo';
import {withState, withHandlers, withProps, mapProps, compose} from 'recompose';
import moment from 'moment';

const ViewGaugeQuery = gql`
  query viewGaugeQuery($_id: ID, $startDate: Date!, $endDate: Date!) {
    gauge(_id: $_id) {
      _id
      name
      levelUnit
      flowUnit
      lastTimestamp
      lastLevel
      lastFlow
      measurements(startDate: $startDate, endDate:$endDate){
        date
        level
        flow
      }
    }
  }
`;

export default compose(
  withProps(props => ({_id: props.params.gaugeId})),
  withState('timeDomain', 'setTimeDomain', [moment().subtract(1, 'days').toDate(), new Date()]),
  withHandlers({
    onDomainChanged: props => ([startDate, endDate]) => {
      const [oldStart, oldEnd] = props.timeDomain;
      const newStart = moment(startDate).isBefore(oldStart) ? startDate : oldStart;
      const newEnd = moment(endDate).isAfter(oldEnd) ? endDate : oldEnd;
      props.setTimeDomain([newStart, newEnd]);
    }
  }),
  mapProps(({timeDomain: [startDate, endDate], ...props}) => ({...props, startDate, endDate})),
  graphql(
    ViewGaugeQuery,
    {
      options: ({_id, startDate, endDate}) => ({
        variables: {_id, startDate: startDate.toString(), endDate: endDate.toString()}
      }),
      props: ({data: {gauge, loading}}) => {
        if (!gauge)
          return {gauge, loading};
        let {measurements, ...restGauge} = gauge;
        measurements = measurements.map(({date, ...rest}) => ({date: new Date(date), ...rest}));
        return {gauge: {measurements, ...restGauge}, loading};
      },
    }
  ),
)