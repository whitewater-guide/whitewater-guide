import { gql } from 'react-apollo';
import { GaugeFragments } from './gaugeFragments';

export default gql`
  query viewGaugeQuery($gaugeId: ID, $language:String ) {
    gauge(id: $gaugeId, language: $language) {
      ...GaugeCore
      ...GaugeLocation
      ...GaugeHarvestInfo
    }
  }
  ${GaugeFragments.Core}
  ${GaugeFragments.Location}
  ${GaugeFragments.HarvestInfo}
`;
