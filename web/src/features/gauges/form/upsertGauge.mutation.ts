import { gql } from 'react-apollo';
import { GaugeFragments } from '../../../ww-clients/features/gauges';

const UPSERT_GAUGE = gql`
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

export default UPSERT_GAUGE;
