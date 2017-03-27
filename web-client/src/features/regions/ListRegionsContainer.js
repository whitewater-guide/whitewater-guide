import { gql, graphql, compose } from 'react-apollo';
import _ from 'lodash';
import { withRegionsList } from '../../commons/features/regions';
import { withAdmin } from "../users";

const RemoveRegionMutation = gql`
  mutation removeRegion($_id: ID!){
    removeRegion(_id: $_id)
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
  withAdmin(),
  withRegionsList,
  graphql(
    RemoveRegionMutation, {
      props: ({ mutate }) => ({
        removeRegion: _id => mutate({
          variables: { _id },
          updateQueries: {
            listRegions: (prev) => {
              return { ...prev, regions: _.filter(prev.regions, v => v._id !== _id) };
            }
          },
        })
      }),
    }
  ),
  graphql(
    CreateRegionMutation, {
      props: ({ mutate }) => ({
        createRegion: (name) => mutate({
          variables: { region: { name } },
          updateQueries: {
            listRegions: (prev, { mutationResult }) => {
              const newRegion = mutationResult.data.region;
              return { ...prev, regions: [...prev.regions, newRegion] };
            }
          },
        })
      }),
    }
  ),
);