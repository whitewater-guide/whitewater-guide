import {graphql} from 'react-apollo';
import {withState, withHandlers, compose} from 'recompose';
import gql from 'graphql-tag';
import {filter} from 'graphql-anywhere';

const regionDetailsFragment = gql`
  fragment RegionDetails on Region {
    _id,
    name,
    description,
    season,
    seasonNumeric,
    pois {
      _id
      name
      description
      coordinates
      altitude
      kind
    }
  }
`;

const regionDetails = gql`
  query regionDetails($_id: ID!, $language:String) {
    region(_id: $_id, language: $language) {
      ...RegionDetails
    }
  }
  ${regionDetailsFragment}
`;

const editRegion = gql`
  mutation editRegion($region: RegionInput!, $language:String){
    upsertRegion(region: $region, language: $language){
      ...RegionDetails
    }
  }
  ${regionDetailsFragment}
`;

export default compose(
  withState('language', 'setLanguage', 'en'),
  withHandlers({
    onLanguageChange: props => language => props.setLanguage(language),
  }),
  graphql(
    regionDetails,
    {
      options: ({regionId, language}) => ({
        forceFetch: true,//i18n's problem with caching
        variables: {_id: regionId, language},
      }),
      props: ({data: {region, loading}}) => {
        return {initialData: region && filter(regionDetailsFragment, region), ready: !loading}
      },
      shouldResubscribe: (props, nextProps) => props.language !== nextProps.language,
    }
  ),
  graphql(
    editRegion,
    {
      props: ({mutate}) => ({
        method: ({data, language}) => {
          return mutate({variables: {region: data, language}});
        }
      }),
    }
  ),
);