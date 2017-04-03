import { graphql, gql, compose } from 'react-apollo';
import { withState, withHandlers, flattenProp, mapProps, branch } from 'recompose';
import _ from 'lodash';
import update from 'immutability-helper';

import { SectionFragments } from './sectionFragments';
import { withFeatureIds } from '../../core/withFeatureIds';
import sectionsListReducer from './sectionsListReducer';

const ListSectionsQuery = gql`
  query listSections($terms:SectionSearchTerms!, $language: String, $withGeo: Boolean!, $isLoadMore:Boolean!) {
    sections(terms:$terms, language:$language) {
      sections {
        ...SectionCore
        ...SectionGeo @include(if: $withGeo)
      }
      count @skip(if: $isLoadMore)
    }
  }
  ${SectionFragments.Core}
  ${SectionFragments.Geo}
`;

const termsFromProps = (props) => {
  const result = _.pick(props, ['sortBy', 'sortDirection', 'riverId', 'regionId', 'searchString']);
  if (result.sortDirection) {
    result.sortDirection = result.sortDirection.toLowerCase();
  }
  return result;
};

const mergeNextPage = (prevResult, { fetchMoreResult }) => {
  if (!fetchMoreResult.sections) {
    return prevResult;
  }
  const newSections = fetchMoreResult.sections.sections;
  return update(prevResult, {
    sections: { sections: { $push: newSections } },
  });
};

const sectionsGraphql = (withGeo, pageSize) => graphql(
  ListSectionsQuery,
  {
    options: ({ language, ...props }) => ({
      variables: { terms: { ...termsFromProps(props), limit: pageSize }, withGeo, language, isLoadMore: false },
      reducer: sectionsListReducer,
      notifyOnNetworkStatusChange: true,
    }),
    props: ({ data: { sections: sectionsSearchResult, loading, fetchMore }, ownProps }) => {
      const { sections = [], count = 0 } = sectionsSearchResult || {};
      return {
        sections: {
          list: sections,
          count,
          loading,
          loadMore: ({ startIndex: skip, stopIndex }) => {
            // Variables are shallowly merged, but skip and limit should be merge into terms
            // Maybe they shouldn't be part of terms?
            const terms = termsFromProps(ownProps);
            return fetchMore({
              variables: { terms: { ...terms, skip, limit: stopIndex - skip }, isLoadMore: true },
              updateQuery: mergeNextPage,
            });
          },
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
 * High-order component that provides list of sections with optional sort and remove capabilities
 * @param options.withGeo (false) - should sections include put-in and take-out coordinates?
 * @param options.pageSize (25) - Number of sections per page;
 *
 * @returns High order component with following props:
 *          sortBy:String
 *          sortDirection:String
 *          onSort: function({sortBy, sortDirection})
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
export function withSections(options = {}) {
  const { withGeo = false, pageSize = 25 } = options;
  return compose(
    withFeatureIds(['region', 'river']),
    withState('sortOptions', 'setSortOptions', { sortBy: 'name', sortDirection: 'ASC' }),
    withHandlers({
      onSort: props => sortOptions => props.setSortOptions(sortOptions),
    }),
    flattenProp('sortOptions'),
    withState('searchString', 'onSearch', ''),
    branch(
      // If sections aren't provided from outside, fetch them
      props => !props.sections,
      sectionsGraphql(withGeo, pageSize),
      // If sections are provided from outside - sort manually on client
      localFilter,
    ),
  );
}
