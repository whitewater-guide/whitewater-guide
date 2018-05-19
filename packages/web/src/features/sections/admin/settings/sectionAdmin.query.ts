import gql from 'graphql-tag';

const SECTION_ADMIN_SETTINGS_QUERY = gql`
  query sectionAdminSettings($sectionId: ID) {
    settings: section(id: $sectionId) {
      id
      demo
    }
  }
`;

export default SECTION_ADMIN_SETTINGS_QUERY;
