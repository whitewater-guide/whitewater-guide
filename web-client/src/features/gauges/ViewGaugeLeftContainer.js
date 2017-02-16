import gql from 'graphql-tag';
import {graphql} from 'react-apollo';
import {compose} from 'recompose';
import {withAdmin} from '../users';
import {withFeatureIds} from '../../core/hoc';

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
  withFeatureIds('gauge'),
  graphql(
    ViewGaugeLeftQuery,
    {
      props: ({data: {gauge}}) => ({sourceId: gauge && gauge.source._id}),
    }
  ),
);