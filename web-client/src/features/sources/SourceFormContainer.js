import {graphql} from 'react-apollo';
import {withState, withHandlers, withProps, compose} from 'recompose';
import gql from 'graphql-tag';
import {filter} from 'graphql-anywhere';
import moment from 'moment';
import {withAdmin} from '../users';
import {withRouter} from 'react-router';
import {Fragments as CoreFragments} from '../../core/queries';

const sourceDetailsFragment = gql`
  fragment SourceDetails on Source {
    _id
    name
    termsOfUse
    script
    cron
    harvestMode
    regions {
      _id
    }
    url
  }
`;

const sourceDetails = gql`
  query sourceDetails($_id: ID, $language:String) {
    source(_id: $_id, language: $language) {
      ...SourceDetails
    }
    
    regions(language: $language) {
      ...NamedFragment
    }
  
    scripts {
      script
      harvestMode
      error
    }
  }
  ${sourceDetailsFragment}
  ${CoreFragments.Named}
`;

const upsertSource = gql`
  mutation upsertSource($source: SourceInput!, $language:String){
    upsertSource(source: $source, language: $language){
      ...SourceDetails
    }
  }
  ${sourceDetailsFragment}
`;

export default compose(
  withAdmin(true),
  withRouter,
  withState('language', 'setLanguage', 'en'),
  withProps(props => ({
    sourceId: props.params.sourceId,
    multilang: !!props.params.sourceId,
    title: props.params.sourceId ? "Source settings" : "New source",
    submitLabel: props.params.sourceId ? "Update" : "Create",
  })),
  withHandlers({
    onLanguageChange: props => language => props.setLanguage(language),
    onSubmit: props => () => props.router.goBack(),
    onCancel: props => () => props.router.goBack(),
  }),
  graphql(
    sourceDetails,
    {
      options: ({sourceId, language}) => ({
        forceFetch: true,//i18n's problem with caching
        variables: {_id: sourceId, language},
      }),
//      props: ({data: {source, regions, scripts, loading}}) => {
//        const initialData = source ? filter(sourceDetailsFragment, source) : {cron: `${(moment().minute() + 2) % 60} * * * *`};
      props: ({data: {loading, ...data}}) => {
        if (!loading)
          data = filter(sourceDetails, data);
        let  {source, regions, scripts} = data;
        const initialData = source || {cron: `${(moment().minute() + 2) % 60} * * * *`};
        return {initialData, regions, scripts, loading}
      },
    }
  ),
  graphql(
    upsertSource,
    {
      props: ({mutate}) => ({
        method: ({data, language}) => {
          return mutate({variables: {source: data, language}});
        }
      }),
    }
  ),
);