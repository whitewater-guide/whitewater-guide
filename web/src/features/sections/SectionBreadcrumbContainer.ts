import { graphql, gql } from 'react-apollo';
import { compose } from 'recompose';
import { withFeatureIds } from '../../commons/core'
import { SectionFragments } from '../../commons/features/sections';

const sectionDetails = gql`
  query sectionDetails($_id: ID, $language:String) {
    section(_id: $_id, language: $language) {
      ...SectionCore
      region {
        _id
        name
      }
    }

  }
  ${SectionFragments.Core}
`;

export default compose(
  withFeatureIds('section'),
  graphql(
    sectionDetails,
    {
      options: ({ sectionId, language }) => ({
        variables: { _id: sectionId, language },
      }),
      props: ({ data: { section, loading } }) => ({ section, loading }),
    },
  ),
);
