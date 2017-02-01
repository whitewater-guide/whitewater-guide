import {graphql, compose} from 'react-apollo';
import gql from 'graphql-tag';
import _ from 'lodash';

const ListRegionsQuery = gql`
  query listRegions {
    regions {
      _id,
      name,
    }
  }
`;

const RemoveRegionMutation = gql`
  mutation removeRegion($regionId: String!){
    removeRegion(regionId: $regionId)
  }
`;

export default compose(
  graphql(
    ListRegionsQuery, {
      props: ({data: {regions}}) => ({regions: regions || []})
    }
  ),
  graphql(
    RemoveRegionMutation, {
      props: ({mutate}) => ({removeRegion: regionId => mutate({
        variables: {regionId},
        updateQueries: {
          listRegions: (prev) => {
            return {...prev, regions: _.filter(prev.regions, v => v._id != regionId)};
          }
        },
      })}),
    }
  )
);