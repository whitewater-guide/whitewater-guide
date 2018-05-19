import gql from 'graphql-tag';

const ADMINISTRATE_SECTION_MUTATION = gql`
  mutation administrateSection($sectionId: ID!, $settings: SectionAdminSettings!){
    administrateSection(id: $sectionId, settings: $settings) {
      id
      demo
    }
  }
`;

export default ADMINISTRATE_SECTION_MUTATION;
