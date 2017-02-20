import {graphql} from 'react-apollo';
import {compose} from 'recompose';
import {withFeatureIds} from '../../core/hoc'
import gql from 'graphql-tag';
import {Fragments} from './queries';

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
  ${Fragments.Core}
`;

export default compose(
  withFeatureIds('section'),
  graphql(
    sectionDetails,
    {
      options: ({sectionId, language}) => ({
        variables: {_id: sectionId, language},
      }),
      props: ({data: {section, loading}}) => {
        return {section, loading};
      },
    }
  ),
);