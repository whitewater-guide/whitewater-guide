import { gql, graphql, compose } from 'react-apollo';
import { withRegionsList } from '../../commons/features/regions';
import { withAdmin } from '../users';

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
        }),
      }),
    },
  ),
  graphql(
    CreateRegionMutation, {
      props: ({ mutate }) => ({
        createRegion: name => mutate({
          variables: { region: { name } },
        }),
      }),
    },
  ),
);
