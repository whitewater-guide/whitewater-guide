import gql from 'graphql-tag';

export const MY_PROFILE_QUERY = gql`
  query myProfile {
    me {
      id
      name
      avatar
      email
      admin
      language
      imperial
      editorSettings {
        language
      }
    }
  }
`;
