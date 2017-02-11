import gql from 'graphql-tag';
import {graphql} from 'react-apollo';
import {withProps, compose} from 'recompose';
import {withAdmin} from '../users';
import {withRouter} from 'react-router';

const ViewGaugeLeftQuery = gql`
  query viewGaugeLeftQuery($_id: ID) {
    gauge(_id: $_id) {
      _id
      source {
        _id
      }
    }
  }
`;

export default compose(
  withAdmin(),
  withRouter,
  withProps(props => ({_id: props.params.gaugeId})),
  graphql(
    ViewGaugeLeftQuery,
    {
      props: ({data: {gauge}}) => ({ sourceId: gauge && gauge.source._id}),
    }
  ),
);