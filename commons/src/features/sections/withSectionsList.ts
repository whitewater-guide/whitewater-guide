import { gql, compose } from 'react-apollo';
import { mapProps, branch } from 'recompose';
import { connect } from 'react-redux';
import _ from 'lodash';
import { map, reject } from 'lodash/fp';
import update from 'immutability-helper';
import { enhancedQuery } from '../../apollo';
import { SectionFragments } from './sectionFragments';
import { withFeatureIds } from '../../core/withFeatureIds';
import sectionsListReducer from './sectionsListReducer';
import { searchTermsSelector } from '../regions';

const ListSectionsQuery = gql`
  query listSections($terms:SectionSearchTerms!, $language: String, $skip: Int, $limit: Int, $withGeo: Boolean!, $isLoadMore:Boolean!) {
    sections(terms:$terms, language:$language, skip: $skip, limit: $limit) {
      sections {
        ...SectionCore
        ...SectionMeasurements
        ...SectionEnds @include(if: $withGeo)
        updatedAt
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
function serializeSearchTerms(terms, regionId, offlineSearch) {
  const termsToSend = offlineSearch ?
    _.pick(terms, ['sortBy', 'sortDirection', 'riverId', 'searchString']) :
    terms;
  return {
    ...termsToSend,
    regionId,
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

const mergeListUpdates = (prevResult, { fetchMoreResult }) => {
  console.log('Updates are', fetchMoreResult);
  return prevResult;
};

const sectionsGraphql = ({ withGeo, pageSize, offlineSearch }) => enhancedQuery(
  ListSectionsQuery,
  {
    options: ({ language, regionId, searchTerms }) => ({
      fetchPolicy: 'cache-first',
      variables: {
        terms: serializeSearchTerms(searchTerms, regionId, offlineSearch),
        limit: pageSize,
        skip: 0,
        withGeo,
        language,
        isLoadMore: false,
      },
      reducer: sectionsListReducer,
      notifyOnNetworkStatusChange: true,
    }),
    props: ({ data: { sections: sectionsSearchResult, loading, variables, fetchMore, subscribeToMore } }) => {
      const { sections = [], count = 0 } = sectionsSearchResult || {};
      return {
        sections: {
          list: sections,
          count,
          loading: loading && !sections,
          loadMore: ({ startIndex: skip, stopIndex }) => fetchMore({
            variables: { skip, limit: stopIndex - skip, isLoadMore: true },
            updateQuery: mergeNextPage,
          }),
          loadUpdates: () => {
            const updatedAt = new Date(_.maxBy(sections, 'updatedAt').updatedAt).valueOf();
            const vars = { ...variables, isLoadMore: false, terms: { ...variables.terms, updatedAt } };
            console.log('Newest item', updatedAt);
            console.log('Old vars', variables);
            console.log('New vars', vars);
            fetchMore({
              variables: vars,
              updateQuery: mergeListUpdates,
            });
          },
          subscribeToUpdates: ({ regionId }) => subscribeToMore({
            document: UpdatesSubscription,
            variables: { regionId },
            onError: error => console.log(`Subscription error ${error}`),
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

const selectionToInt = { selected: 1, deselected: -1 };

const serializeTags = compose(
  reject({ selection: 'none' }),
  map(({ _id, selection }) => ({ _id, selection: selectionToInt[selection] })),
);

/**
 * High-order component that provides list of sections with optional sort and remove capabilities
 * @param options.withGeo (false) - should sections include put-in and take-out coordinates?
 * @param options.pageSize (25) - Number of sections per page;
 * @param options.offlineSearch - If true, search options will not be sent in graphql request
 *
 * @returns High order component with following props:
 *          searchTerms
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
    connect(searchTermsSelector),
    mapProps(({ searchTerms, ...props }) => ({
      ...props,
      searchTerms: {
        ...searchTerms,
        kayakingTags: serializeTags(searchTerms.kayakingTags),
        hazardsTags: serializeTags(searchTerms.hazardsTags),
        miscTags: serializeTags(searchTerms.miscTags),
        supplyTags: serializeTags(searchTerms.supplyTags),
      },
    })),
    branch(
      // If sections aren't provided from outside, fetch them
      props => !props.sections,
      sectionsGraphql(opts),
      // If sections are provided from outside - sort manually on client
      localFilter,
    ),
  );
}
