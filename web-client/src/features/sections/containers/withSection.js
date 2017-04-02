import { graphql, gql } from 'react-apollo';
import { compose } from 'recompose';
import { filter } from 'graphql-anywhere';
import { withFeatureIds } from '../../../commons/core';
import { SectionFragments } from '../../../commons/features/sections';

const sectionDetails = gql`
  query sectionDetails($_id: ID, $language:String, $withGeo:Boolean!, $withDescription:Boolean!) {
    section(_id: $_id, language: $language) {
      ...SectionCore
      ...SectionGeo @include(if: $withGeo)
      description @include(if: $withDescription)
    }

  }
  ${SectionFragments.Core}
  ${SectionFragments.Geo}
`;

export function withSection(options) {
  const { withGeo = false, withDescription = false, propName = 'section' } = options;
  return compose(
    withFeatureIds('section'),
    graphql(
      sectionDetails,
      {
        options: ({ sectionId, language }) => ({
          fetchPolicy: 'network-only', // i18n's problem with caching
          variables: { _id: sectionId, language, withGeo, withDescription },
        }),
        props: ({ data: { section, loading } }) => ({
          [propName]: section && filter(SectionFragments.All, section),
          sectionLoading: loading,
        }),
      },
    ),
  );
}
