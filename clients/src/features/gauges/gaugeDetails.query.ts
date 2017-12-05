import gql from 'graphql-tag';
import { GaugeFragments } from './gaugeFragments';

export default gql`
  query viewGaugeQuery($gaugeId: ID, $language:String ) {
    gauge(id: $gaugeId, language: $language) {
      ...GaugeCore
      ...GaugeLocation
      ...GaugeHarvestInfo
      ...GaugeSource
    }
  }
  ${GaugeFragments.Core}
  ${GaugeFragments.Location}
  ${GaugeFragments.HarvestInfo}
  ${GaugeFragments.Source}
`;
