import gql from 'graphql-tag';

export default gql`
  mutation upsertSource($source: SourceInput!){
    upsertSource(source: $source){
      id
      name
      termsOfUse
      script
      cron
      harvestMode
      url
    }
  }
`;
