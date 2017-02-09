import {graphql} from 'react-apollo';
import {withState, withHandlers, mapProps, compose} from 'recompose';
import gql from 'graphql-tag';
import {filter} from 'graphql-anywhere';
import adminOnly from '../../hoc/adminOnly';
import {withRouter} from 'react-router';
import _ from 'lodash';
import {Fragments} from '../queries';

const sectionDetails = gql`
  query sectionDetails($_id: ID, $language:String) {
    section(_id: $_id, language: $language) {
      ...SectionDetails
    }

  }
  ${sectionDetailsFragment}
  ${regionWithRiversFragment}
`;
