import {graphql} from 'react-apollo';
import {withState, withHandlers, withProps, branch, compose} from 'recompose';
import gql from 'graphql-tag';
import {filter} from 'graphql-anywhere';
import adminOnly from '../../hoc/adminOnly';
import {withRouter} from 'react-router';

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
  adminOnly,
  withRouter,
  withState('language', 'setLanguage', 'en'),
  withProps(props => ({
    _id: props.params.riverId,
    multilang: !!props.params.riverId,
    title: props.params.riverId ? "River settings" : "New river",
    submitLabel: props.params.riverId ? "Update" : "Create",
  })),
  withHandlers({
    onLanguageChange: props => language => props.setLanguage(language),
    onSubmit: props => result => (!props._id && result && result._id) ? props.router.replace(`/rivers/${result._id}`) : props.router.goBack(),
    onCancel: props => () => props.router.goBack(),
  }),
  graphql(
    riverDetails,
    {
      options: ({_id, language}) => ({
        forceFetch: true,
        variables: {_id, language}
      }),
      props: ({data: {river, regions, loading}, ownProps}) => {
        let initialData = {};
        if (river){//Edit existing river - need to flatten region id
          const {region, ...rest} = filter(riverDetailsFragment, river);
          initialData = {...rest, regionId: region._id};
        }
        else {//New river - region might be preselected
          initialData = {regionId: ownProps.location.query.regionId};
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