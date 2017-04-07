import { gql, graphql } from 'react-apollo';
import { mapProps, withState, withHandlers, withProps, compose } from 'recompose';
import { withAdmin } from '../../users';
import { withFeatureIds } from '../../../commons/core';
import { spinnerWhileLoading } from '../../../core/components';
import { GaugeFragments, withGauge } from '../../../commons/features/gauges';

const upsertGauge = gql`
  mutation upsertGauge($gauge: GaugeInput!, $language:String){
    upsertGauge(gauge: $gauge, language: $language){
      ...GaugeCore
      ...GaugeLocation
      ...GaugeHarvestInfo
    }
  }
  ${GaugeFragments.Core}
  ${GaugeFragments.Location}
  ${GaugeFragments.HarvestInfo}
`;

export default compose(
  withAdmin(true),
  withFeatureIds(['source', 'gauge']), // Needed for new gauge form
  withState('language', 'setLanguage', 'en'),
  withProps(props => ({
    multilang: !!props.gaugeId,
    title: props.gaugeId ? 'Gauge settings' : 'New gauge',
    submitLabel: props.gaugeId ? 'Update' : 'Create',
  })),
  withHandlers({
    onLanguageChange: props => language => props.setLanguage(language),
    onSubmit: props => () => props.history.goBack(),
    onCancel: props => () => props.history.goBack(),
  }),
  withGauge({ propName: 'initialData' }),
  spinnerWhileLoading(props => props.gaugeLoading),
  graphql(
    upsertGauge,
    {
      props: ({ mutate }) => ({
        method: ({ data, language }) => mutate({ variables: { gauge: data, language } }),
      }),
    },
  ),
  mapProps(({ initialData, sourceId, ...props }) => {
    if (!initialData) { // New gauge form
      return { ...props, initialData: { sourceId } };
    }
    const { source, ...rest } = initialData;
    return { ...props, initialData: { ...rest, sourceId: source._id } };
  }),
);
