import {graphql, compose} from 'react-apollo';
import {withRouter} from "react-router";
import withAdmin from "../../hoc/withAdmin";
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
  mutation removeRegion($regionId: ID!){
    removeRegion(regionId: $regionId)
  }
`;

const CreateRegionMutation = gql`
  mutation createRegion($region: RegionInput!, $language: String){
    region: upsertRegion(region: $region, language: $language){
      _id,
      name,
    }
  }
`;

export default compose(
  withAdmin,
  withRouter,
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
  ),
  graphql(
    CreateRegionMutation, {
      props: ({mutate}) => ({createRegion: (name) => mutate({
        variables: {region: {name}},
        updateQueries: {
          listRegions: (prev, {mutationResult}) => {
            const newRegion = mutationResult.data.region;
            return {...prev, regions: [...prev.regions, newRegion]};
          }
        },
      })}),
    }
  ),
);