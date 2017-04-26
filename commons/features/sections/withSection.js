import { gql } from 'react-apollo';
import { branch, compose } from 'recompose';
import { filter } from 'graphql-anywhere';
import { withFeatureIds } from '../../core';
import { SectionFragments } from './sectionFragments';
import { enhancedQuery } from '../../apollo';

const sectionDetails = gql`
  query sectionDetails($_id: ID, $language:String, $withGeo:Boolean!, $withDescription:Boolean!) {
    section(_id: $_id, language: $language) {
      ...SectionCore
      ...SectionMeasurements
      ...SectionMedia
      ...SectionTags
      ...SectionDescription @include(if: $withDescription)
      ...SectionShape @include(if: $withGeo)
      ...SectionEnds @include(if: $withGeo)
      ...SectionPOIs @include(if: $withGeo)
    }

  }
  ${SectionFragments.Core}
  ${SectionFragments.Measurements}
  ${SectionFragments.Media}
  ${SectionFragments.Tags}
  ${SectionFragments.Description}
  ${SectionFragments.Shape}
  ${SectionFragments.Ends}
  ${SectionFragments.POIs}
`;

export function withSection(options) {
  const { withGeo = false, withDescription = false, propName = 'section' } = options;
  return compose(
    withFeatureIds('section'),
    // Do not fetch section if info is provided from outside
    // This is probably temporary until ViewSection on web is refined
    branch(
      props => !props.section,
      enhancedQuery(
        sectionDetails,
        {
          options: ({ sectionId, language }) => ({
            fetchPolicy: 'cache-and-network',
            variables: { _id: sectionId, language, withGeo, withDescription },
          }),
          props: ({ data: { section, loading } }) => ({
            [propName]: section && filter(SectionFragments.All, section),
            sectionLoading: loading,
          }),
        },
      ),
    ),
  );
}
