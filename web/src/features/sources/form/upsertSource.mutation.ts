import gql from 'graphql-tag';

export default gql`
  mutation upsertSource($source: SourceInput!, $language:String){
    upsertSource(source: $source, language: $language){
      id
      name
      language
      termsOfUse
      script
      cron
      harvestMode
      url
      enabled
    }
  }
`;
