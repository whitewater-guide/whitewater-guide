import {graphql} from 'react-apollo';
import {compose} from 'recompose';
import {withFeatureIds} from '../../../core/hoc'
import gql from 'graphql-tag';
import {filter} from 'graphql-anywhere';
import {Fragments} from '../queries';

const sectionDetails = gql`
  query sectionDetails($_id: ID, $language:String, $withGeo:Boolean!, $withDescription:Boolean!) {
    section(_id: $_id, language: $language) {
      ...SectionCore
      ...SectionGeo @include(if: $withGeo)
      description @include(if: $withDescription)
    }

  }
  ${Fragments.Core}
  ${Fragments.Geo}
`;

export function withSection(options) {
  const {withGeo = false, withDescription = false, propName = 'section'} = options;
  return compose(
    withFeatureIds('section'),
    graphql(
      sectionDetails,
      {
        options: ({sectionId, language}) => ({
          fetchPolicy: 'network-only',//i18n's problem with caching
          variables: {_id: sectionId, language, withGeo, withDescription},
        }),
        props: ({data: {section, loading}}) => {
          return {[propName]: section && filter(Fragments.All, section), sectionLoading: loading};
        },
      }
    ),
  );
}
