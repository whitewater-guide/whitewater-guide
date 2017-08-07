import { gql } from 'react-apollo';
import { compose } from 'recompose';
import { enhancedQuery } from '../../apollo';
import { withFeatureIds } from '../../core';
import { SectionFragments } from './sectionFragments';
import { Section } from './types';

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

export interface WithGaugeOptions {
  withGeo?: boolean;
  withDescription?: boolean;
  propName?: string;
}

interface Result {
  section: Section | null;
}

interface Props {
  sectionId?: string;
  language?: string;
}

interface TInner {
  sectionLoading: boolean;
  error?: any;
}

export function withSection<SectionProp = {section: Section | null}>(options: WithGaugeOptions) {
  const { withGeo = false, withDescription = false, propName = 'section' } = options;
  type ChildProps = TInner & SectionProp;
  return compose<TInner & ChildProps, any>(
    withFeatureIds('section'),
    enhancedQuery<Result, Props, ChildProps>(
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

export type WithSection<SectionProp = {section: Section | null}> = Props & TInner & SectionProp;
