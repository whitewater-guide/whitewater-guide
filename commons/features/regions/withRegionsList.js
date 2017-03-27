import { gql, graphql } from 'react-apollo';

const ListRegionsQuery = gql`
  query listRegions {
    regions {
      _id,
      name,
    }
  }
`;

const withRegionsList = graphql(
  ListRegionsQuery,
  {
    props: ({ data: { regions } }) => ({ regions: regions || [] }),
  },
);

export default withRegionsList;
