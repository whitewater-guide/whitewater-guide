import { gql } from 'react-apollo';

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
