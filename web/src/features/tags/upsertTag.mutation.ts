import { gql } from 'react-apollo';

export const UPSERT_TAG = gql`
  mutation upsertTag($tag: TagInput!, $language:String){
    upsertTag(tag: $tag, language: $language){
      id
      language
      name
      category
    }
  }
`;
