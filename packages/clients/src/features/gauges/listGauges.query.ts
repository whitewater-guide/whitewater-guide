import gql from 'graphql-tag';
import { GaugeFragments } from './gaugeFragments';

export default gql`
  query listGauges($sourceId: ID, $language:String, $page: Page) {
    gauges(sourceId:$sourceId, language: $language, page: $page) {
      nodes {
        ...GaugeCore
        ...GaugeLocation
        ...GaugeHarvestInfo
        ...GaugeStatus
        ...GaugeLastMeasurement
        source {
          id
        }
        enabled
      }
      count
    }
  }
  ${GaugeFragments.Core}
  ${GaugeFragments.LastMeasurement}
  ${GaugeFragments.Location}
  ${GaugeFragments.HarvestInfo}
  ${GaugeFragments.Status}
`;
