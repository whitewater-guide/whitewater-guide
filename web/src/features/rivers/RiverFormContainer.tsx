import {graphql} from 'react-apollo';
import {withState, withHandlers, withProps, compose} from 'recompose';
import gql from 'graphql-tag';
import {filter} from 'graphql-anywhere';
import {withAdmin} from '../users';
import {withFeatureIds} from '../../commons/core';

const riverDetailsFragment = gql`
  fragment RiverDetails on River {
    _id
    name
    description
    region {
      _id
    }
  }
`;

const riverDetails = gql`
  query riverDetails($_id: ID, $language:String) {
    river(_id: $_id, language: $language) {
      ...RiverDetails
    }

    regions(language: $language) {
      _id,
      name
    }

  }
  ${riverDetailsFragment}
`;

const upsertRiver = gql`
  mutation upsertRiver($river: RiverInput!, $language:String){
    upsertRiver(river: $river, language: $language){
      ...RiverDetails
    }
  }
  ${riverDetailsFragment}
`;

export default compose(
  withAdmin(true),
  withFeatureIds(),
  withState('language', 'setLanguage', 'en'),
  withProps(({riverId}) => ({
    _id: riverId,
    multilang: !!riverId,
    title: riverId ? "River settings" : "New river",
    submitLabel: riverId ? "Update" : "Create",
  })),
  withHandlers({
    onLanguageChange: props => language => props.setLanguage(language),
    onSubmit: props => result => (!props._id && result && result._id) ? props.history.replace(`/rivers/${result._id}`) : props.history.goBack(),
    onCancel: props => () => props.history.goBack(),
  }),
  graphql(
    riverDetails,
    {
      options: ({riverId, language}) => ({
        fetchPolicy: 'network-only',
        variables: {_id: riverId, language}
      }),
      props: ({data: {river, regions, loading}, ownProps}) => {
        let initialData = {};
        if (river) {//Edit existing river - need to flatten region id
          const {region, ...rest} = filter(riverDetailsFragment, river);
          initialData = {...rest, regionId: region._id};
        }
        else {//New river - region might be preselected
          initialData = {regionId: ownProps.regionId};
        }
        return {initialData, regions, loading};
      },
    }
  ),
  graphql(
    upsertRiver,
    {
      props: ({mutate}) => ({
        method: ({data, language}) => {
          return mutate({variables: {river: data, language}});
        }
      }),
    }
  ),
);