import gql from 'graphql-tag';

const ADMINISTRATE_REGION_MUTATION = gql`
  mutation administrateRegion($settings: RegionAdminSettings!){
    administrateRegion(settings: $settings) {
      id
      hidden
      premium
      sku
      coverImage {
        mobile
      }
      banners {
        regionDescriptionMobile
        regionLoadingMobile
        sectionDescriptionMobile
        sectionMediaMobile
        sectionRowMobile
      }
    }
  }
`;

export default ADMINISTRATE_REGION_MUTATION;
