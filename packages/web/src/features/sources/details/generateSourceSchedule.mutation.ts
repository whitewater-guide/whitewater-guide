import gql from 'graphql-tag';

const GENERATE_SOURCE_SCHEDULE = gql`
  mutation generateSourceSchedule($sourceId: ID!){
    generateSourceSchedule(id: $sourceId) {
      id
      language
      cron
    }
  }
`;

export default GENERATE_SOURCE_SCHEDULE;
