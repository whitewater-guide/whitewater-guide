import { gql } from 'react-apollo';
import { GaugeFragments } from './gaugeFragments';

export default gql`
  query listGauges($sourceId: ID, $language:String, $page: Page) {
    gauges(sourceId:$sourceId, language: $language, page: $page) {
      nodes {
        ...GaugeCore
        ...GaugeLocation
        ...GaugeHarvestInfo
        enabled
      }
      count
    }
  }
  ${GaugeFragments.Core}
  ${GaugeFragments.Location}
  ${GaugeFragments.HarvestInfo}
`;
