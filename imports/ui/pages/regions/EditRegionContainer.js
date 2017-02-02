import {graphql} from 'react-apollo';
import {withState, withHandlers, withProps, compose} from 'recompose';
import gql from 'graphql-tag';
import _ from 'lodash';

const regionDetails = gql`
  query regionDetails($_id: ID!) {
    region(_id: $_id) {
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
  mutation editRegion($region: EditRegionInput!){
    editRegion(region: $region){
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
  graphql(
    regionDetails,
    {
      options: ({regionId}) => ({variables: {_id: regionId}}),
      props: ({data: {region, loading}}) => ({region, loading}),
    }
  ),
  graphql(
    editRegion, {
      props: ({mutate}) => ({method: ({data}) => {
        return mutate({ variables: {region: data}}).catch(err => console.error(err))
      }
      }),
    }
  ),
  withState('language', 'setLanguage', 'en'),
  withHandlers({
    onLanguageChange: props => language => props.setLanguage(language)
  }),
  withProps( ({region, loading}) => ({initialData: region, ready: !loading})),
);