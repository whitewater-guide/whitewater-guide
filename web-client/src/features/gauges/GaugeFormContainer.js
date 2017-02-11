import {graphql} from 'react-apollo';
import {withState, withHandlers, withProps, compose} from 'recompose';
import gql from 'graphql-tag';
import {filter} from 'graphql-anywhere';
import {withAdmin} from '../users';
import {withRouter} from 'react-router';

const gaugeDetailsFragment = gql`
  fragment GaugeDetails on Gauge {
    _id
    name
    code
    source {
      _id
    }
    location {
      _id
      coordinates
      altitude
    }
    levelUnit
    flowUnit
    requestParams
    cron
    url
  }
`;

const gaugeDetails = gql`
  query gaugeDetails($_id: ID, $language:String) {
    gauge(_id: $_id, language: $language) {
      ...GaugeDetails
    }
  }
  ${gaugeDetailsFragment}
`;

const upsertGauge = gql`
  mutation upsertGauge($gauge: GaugeInput!, $language:String){
    upsertGauge(gauge: $gauge, language: $language){
      ...GaugeDetails
    }
  }
  ${gaugeDetailsFragment}
`;

export default compose(
  withAdmin(true),
  withRouter,
  withState('language', 'setLanguage', 'en'),
  withProps(props => ({
    _id: props.params.gaugeId,
    sourceId: props.location.query.sourceId,
    multilang: !!props.params.gaugeId,
    title: props.params.gaugeId ? "Gauge settings" : "New gauge",
    submitLabel: props.params.gaugeId ? "Update" : "Create",
  })),
  withHandlers({
    onLanguageChange: props => language => props.setLanguage(language),
    onSubmit: props => () => props.router.goBack(),
    onCancel: props => () => props.router.goBack(),
  }),
  graphql(
    gaugeDetails,
    {
      options: () => ({forceFetch: true}),//i18n's problem with caching
      props: ({ownProps, data: {gauge, loading}}) => {
        let initialData = gauge ? filter(gaugeDetailsFragment, gauge) : {sourceId: ownProps.sourceId};
        if (initialData.hasOwnProperty('source')) {
          initialData.sourceId = initialData.source._id;
          delete initialData.source;
        }
        if (initialData.requestParams)
          initialData.requestParams = JSON.stringify(initialData.requestParams);
        return {initialData, loading};
      },
    }
  ),
  graphql(
    upsertGauge,
    {
      props: ({mutate}) => ({
        method: ({data, language}) => {
          return mutate({variables: {gauge: data, language}});
        }
      }),
    }
  ),
);