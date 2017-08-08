import { gql } from 'react-apollo';
import { ComponentEnhancer, compose } from 'recompose';
import { enhancedQuery } from '../../apollo';
import { withFeatureIds } from '../../core';
import { Section } from '../../../ww-commons';
import { SectionFragments } from './sectionFragments';

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

export interface WithSectionOptions {
  withGeo?: boolean;
  withDescription?: boolean;
  propName?: string;
}

export interface WithSectionResult {
  section: Section | null;
}

export interface WithSectionProps {
  sectionId?: string;
  language?: string;
}

export interface WithSectionChildProps {
  sectionLoading: boolean;
  error?: any;
}

export function withSection<SectionProp = {section: Section | null}>(options: WithSectionOptions) {
  const { withGeo = false, withDescription = false, propName = 'section' } = options;
  type ChildProps = WithSectionChildProps & SectionProp;
  return compose<WithSectionChildProps & ChildProps, any>(
    withFeatureIds('section'),
    enhancedQuery<WithSectionResult, WithSectionProps, ChildProps>(
      sectionDetails,
      {
        options: ({ sectionId, language }) => ({
          fetchPolicy: 'cache-and-network',
          variables: { _id: sectionId, language, withGeo, withDescription },
        }),
        props: ({ data }) => {
          const { section, loading } = data!;
          return {
            [propName]: section,
            sectionLoading: loading && !section,
          };
        },
      },
    ),
  );
}

export type WithSection<SectionProp = {section: Section | null}> =
  WithSectionProps & WithSectionChildProps & SectionProp;

// Workaround to make TS emit declarations, see https://github.com/Microsoft/TypeScript/issues/9944
let a: ComponentEnhancer<any, any>;
