import {graphql, compose} from 'react-apollo';
import gql from 'graphql-tag';
import withAdmin from '../../hoc/withAdmin';
import {withRouter} from 'react-router';

const ListSourcesQuery = gql`
  query listSources {
    sources {
      _id,
      name,
      url,
      script,
      harvestMode,
      cron,
    }

    jobsReport {
      _id,
      count,
    }
  }
`;

export default compose(
  withAdmin,
  withRouter,
  graphql(
    ListSourcesQuery, {
      props: ({data: {sources, jobsReport, loading}}) => ({sources, jobsReport, ready: !loading})
    }
  ),
);