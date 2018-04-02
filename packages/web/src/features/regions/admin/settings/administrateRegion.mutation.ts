import gql from 'graphql-tag';

const ADMINISTRATE_REGION_MUTATION = gql`
  mutation administrateRegion($regionId: ID!, $settings: RegionAdminSettings!){
    administrateRegion(regionId: $regionId, settings: $settings) {
      id
      hidden
      premium
    }
  }
`;

export default ADMINISTRATE_REGION_MUTATION;
