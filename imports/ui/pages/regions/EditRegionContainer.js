import {graphql} from 'react-apollo';
import {withState, withHandlers, withProps, compose} from 'recompose';
import gql from 'graphql-tag';
import _ from 'lodash';

const regionDetails = gql`
  query regionDetails($_id: ID!, $language:String) {
    region(_id: $_id, language: $language) {
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
  }
`;

const editRegion = gql`
  mutation editRegion($region: EditRegionInput!, $language:String){
    editRegion(region: $region, language: $language){
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
  }
`;

export default compose(
  withState('language', 'setLanguage', 'en'),
  withHandlers({
    onLanguageChange: props => language => props.setLanguage(language),
  }),
  graphql(
    regionDetails,
    {
      options: ({regionId, language}) => ({variables: {_id: regionId, language}, forceFetch: true}),
      props: ({data: {region, loading}}) => ({initialData: region, ready: !loading}),
      shouldResubscribe: (props, nextProps) => props.language !== nextProps.language,
    }
  ),
  graphql(
    editRegion, {
      props: ({mutate}) => ({method: ({data, language}) => {
        return mutate({ variables: {region: data, language}});
      }
      }),
    }
  ),
);