import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import adminOnly from '../../hoc/adminOnly';
import {compose} from 'recompose';

const sourceSchedule = gql`
  query sourceSchedule($_id: ID!) {
    source(_id: $_id) {
      _id
      name
      gauges {
        _id
        name
      }
    }

    jobs(sourceId: $_id) {
      _id
      data
      status
      updated
      after
      result
    }

  }
`;

export default compose(
  adminOnly,
  graphql(
    sourceSchedule,
    {
      options: ({params}) => ({
        forceFetch: true,
        variables: {_id: params.sourceId},
      }),
      props: ({data: {source, jobs, loading}}) => {
        const gauges = source ? source.gauges : [];
        return {gauges, jobs, loading};
      },
    }
  )
);