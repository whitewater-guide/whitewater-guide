import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import {withAdmin} from '../users';
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
  withAdmin(true),
  graphql(
    sourceSchedule,
    {
      options: ({match: {params: sourceId}}) => ({
        fetchPolicy: 'network-only',
        variables: {_id: sourceId},
      }),
      props: ({data: {source, jobs, loading}}) => {
        const gauges = source ? source.gauges : [];
        return {gauges, jobs, loading};
      },
    }
  )
);