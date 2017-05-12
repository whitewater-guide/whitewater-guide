import { gql, compose } from 'react-apollo';
import { withState, withHandlers, mapProps, branch } from 'recompose';
import _ from 'lodash';
import update from 'immutability-helper';
import { enhancedQuery } from '../../apollo';
import { SectionFragments } from './sectionFragments';
import { withFeatureIds } from '../../core/withFeatureIds';
import sectionsListReducer from './sectionsListReducer';

const ListSectionsQuery = gql`
  query listSections($terms:SectionSearchTerms!, $language: String, $skip: Int, $limit: Int, $withGeo: Boolean!, $isLoadMore:Boolean!) {
    sections(terms:$terms, language:$language, skip: $skip, limit: $limit) {
      sections {
        ...SectionCore
        ...SectionMeasurements
        ...SectionEnds @include(if: $withGeo)
      }
      count @skip(if: $isLoadMore)
    }
  }
  ${SectionFragments.Measurements}
  ${SectionFragments.Core}
  ${SectionFragments.Ends}
`;

const UpdatesSubscription = gql`
  subscription measurementsUpdated($regionId: ID!){
    measurementsUpdated(regionId: $regionId){
      _id
      levels {
        lastTimestamp
        lastValue
      }
      flows {
        lastTimestamp
        lastValue
      }
    }
  }
`;

/**
 * Transforms client-side search terms to search terms that will be send in graphql query
 */
function serializeSearchTerms(terms, offlineSearch) {
  const termsToSend = offlineSearch ?
    _.pick(terms, ['sortBy', 'sortDirection', 'riverId', 'regionId', 'searchString']) :
    terms;
  return {
    ...termsToSend,
    sortDirection: terms.sortDirection.toLowerCase(),
  };
}

const mergeNextPage = (prevResult, { fetchMoreResult }) => {
  if (!fetchMoreResult.sections) {
    return prevResult;
  }
  const newSections = fetchMoreResult.sections.sections;
  return update(prevResult, {
    sections: { sections: { $push: newSections } },
  });
};

const sectionsGraphql = ({ withGeo, pageSize, offlineSearch }) => enhancedQuery(
  ListSectionsQuery,
  {
    options: ({ language, sectionSearchTerms }) => ({
      fetchPolicy: 'cache-and-network',
      variables: {
        terms: serializeSearchTerms(sectionSearchTerms, offlineSearch),
        limit: pageSize,
        skip: 0,
        withGeo,
        language,
        isLoadMore: false,
      },
      reducer: sectionsListReducer,
      notifyOnNetworkStatusChange: true,
    }),
    props: ({ data: { sections: sectionsSearchResult, loading, fetchMore, subscribeToMore } }) => {
      const { sections = [], count = 0 } = sectionsSearchResult || {};
      return {
        sections: {
          list: sections,
          count,
          loading,
          loadMore: ({ startIndex: skip, stopIndex }) => fetchMore({
            variables: { skip, limit: stopIndex - skip, isLoadMore: true },
            updateQuery: mergeNextPage,
          }),
          subscribeToUpdates: ({ regionId }) => subscribeToMore({
            document: UpdatesSubscription,
            variables: { regionId },
          }),
        },
      };
    },
  },
);

const localFilter = mapProps(({ sortBy, sortDirection, searchString, sections, ...props }) => {
  const sort = sortBy === 'name' ? [sec => sec.river.name, 'name'] : [sortBy];
  let sortedSections = sections;
  if (searchString) {
    const regex = new RegExp(searchString, 'i');
    sortedSections = _.filter(sortedSections, s => regex.test(s.name) || regex.test(s.river.name));
  }
  sortedSections = _.sortBy(sortedSections, sort);
  if (sortDirection.toLowerCase() === 'desc') {
    sortedSections = _.reverse(sortedSections);
  }
  return {
    sortBy,
    sortDirection,
    sections: sortedSections,
    sectionsCount: sections.length,
    loadMore: _.noop,
    ...props,
  };
});

/**
 * If sectionSearchTerms are not provided by upper-level components (e.g. connect),
 * then provides seacrh terms as props and also provides handlers to update seacrh terms
 */
const withSectionSearchProps = branch(
  ({ sectionSearchTerms }) => !sectionSearchTerms,
  compose(
    withState(
      'sectionSearchTerms',
      'setSectionSearchTerms',
      props => ({
        sortBy: 'name',
        sortDirection: 'ASC',
        riverId: props.riverId,
        regionId: props.regionId,
        searchString: '',
      }),
    ),
    withHandlers({
      updateSectionSearchTerms: ({ sectionSearchTerms, setSectionSearchTerms }) =>
        terms => setSectionSearchTerms({ ...sectionSearchTerms, ...terms }),
    }),
  ),
);

/**
 * High-order component that provides list of sections with optional sort and remove capabilities
 * @param options.withGeo (false) - should sections include put-in and take-out coordinates?
 * @param options.pageSize (25) - Number of sections per page;
 * @param options.offlineSearch - If true, search options will not be sent in graphql request
 *
 * @returns High order component with following props:
 *          sectionSearchTerms: {
 *            sortBy
 *            sortDirection
 *            riverId
 *            regionId
 *            searchString
 *          }
 *          updateSectionSearchTerms (optional)
 *          riverId
 *          regionId
 *          sections: {
 *            list
 *            count
 *            loading
 *            loadMore function({ startIndex, stopIndex })
 *          }
 *
 */
export function withSectionsList(options) {
  const opts = _.defaults({}, options, { withGeo: false, pageSize: 25, offlineSearch: false });
  return compose(
    withFeatureIds(['region', 'river']),
    withSectionSearchProps,
    branch(
      // If sections aren't provided from outside, fetch them
      props => !props.sections,
      sectionsGraphql(opts),
      // If sections are provided from outside - sort manually on client
      localFilter,
    ),
  );
}
