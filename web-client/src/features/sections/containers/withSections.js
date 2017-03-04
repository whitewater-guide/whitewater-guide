import {graphql, compose} from 'react-apollo';
import gql from 'graphql-tag';
import {withProps, withState, withHandlers, flattenProp, mapProps, branch} from 'recompose';
import _ from 'lodash';
import update from 'immutability-helper';
import {Fragments} from '../queries';

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
  ${Fragments.Core}
  ${Fragments.Geo}
`;

const RemoveSectionMutation = gql`
  mutation removeSection($_id: ID!){
    removeSection(_id: $_id)
  }
`;

/**
 * High-order component that provides list of sections with optional sort and remove capabilities
 * @param options.withGeo (false) - should sections include put-in and take-out coordinates?
 * @param options.sort ('name') - default sort key. If falsey - sort functionality is not provided
 * @param options.withRemove (false) - If true, provides remove handler;
 * @param options.pageSize (25) - Number of sections per page;
 *
 * @returns High order component with following props:
 *          sortBy:String
 *          sortDirection:String
 *          onSort: function({sortBy, sortDirection})
 *          riverId
 *          regionId
 *          sections
 *          count - number of sections
 *          loading
 *          loadMore: function({startIndex, stoIndex})
 *          removeSection: function(sectionId)
 *
 */
export function withSections(options) {
  let {withGeo = false, sort = 'name', withRemove = false, pageSize = 25} = options;

  const termsFromProps = props => {
    let result = _.pick(props, ['sortBy', 'sortDirection', 'riverId', 'regionId', 'searchString']);
    if (result.sortDirection)
      result.sortDirection = result.sortDirection.toLowerCase();
    //When sort functionality is not required, set sortBy to '_id',
    //because resolver will set it to some default value
    if (!sort)
      result.sortBy = '_id';
    return result;
  };

  const hocs = _.compact([
    withProps(({riverId, regionId, match}) => ({
      regionId: regionId || match.params.regionId,
      riverId: riverId || match.params.riverId,
    })),
    !!sort && withState('sortOptions','setSortOptions', {sortBy: sort, sortDirection: 'ASC'}),
    !!sort && withHandlers({
      onSort: props => sortOptions => props.setSortOptions(sortOptions),
    }),
    !!sort && flattenProp('sortOptions'),
    withState('searchString', 'onSearch', ''),
    branch(
      //If sections aren't provided from outside, fetch them
      //If they are provided by parent, sort them here
      props => !props.sections,
      graphql(
        ListSectionsQuery, {
          options: ({language, ...props}) => ({
            forceFetch: true,
            variables: {terms: {...termsFromProps(props), limit: pageSize}, withGeo, language, isLoadMore: false},
          }),
          props: ({data: {sections: sectionsSearchResult, loading, fetchMore}, ownProps}) => {
            const {sections = [], count = 0} = sectionsSearchResult || {};
            return {
              sections,
              count,
              loading,
              loadMore: ({startIndex: skip, stopIndex}) => {
                //Variables are shallowly merged, but skip and limit should be merge into terms
                //Maybe they shouldn't be part of terms?
                let terms = termsFromProps(ownProps);
                return fetchMore({
                  variables: {terms: {...terms, skip, limit: stopIndex - skip}, isLoadMore: true},
                  updateQuery: (prevResult, {fetchMoreResult}) => {
                    if (!fetchMoreResult.data)
                      return prevResult;
                    const newSections = fetchMoreResult.data.sections.sections;
                    return update(prevResult, {
                      sections: {sections: {$push: newSections}}
                    });
                  }
                });
              }
            };
          }
        }
      ),
      //When sections are provided from outside:
      //If sort is enabled - sort manually on client
      //If sort is disabled = just pass through (_.identity)
      sort ? mapProps(({sortBy = sort, sortDirection = 'asc', searchString, sections, ...props}) => {
        const sort = sortBy === 'name' ? [sec => sec.river.name, 'name'] : [sortBy];
        let sortedSections = sections;
        if (searchString){
          const regex = new RegExp(searchString, 'i');
          sortedSections = _.filter(sortedSections, section => {
            return regex.test(section.name) || regex.test(section.river.name);
          });
        }
        sortedSections = _.sortBy(sortedSections, sort);
        if (sortDirection.toLowerCase() === 'desc')
          sortedSections = _.reverse(sortedSections);
        return {
          sortBy,
          sortDirection,
          sections: sortedSections,
          count: sections.length,
          loadMore: _.noop,
          ...props
        };
      }) : _.identity
    ),
    withRemove && branch(
      props => props.admin,
      graphql(
        RemoveSectionMutation, {
          props: ({mutate}) => ({removeSection: _id => mutate({
            variables: {_id},
            updateQueries: {
              listSections: (prev) => {
                const {sections: {sections, count}} = prev;
                return {...prev, sections: {sections: _.reject(sections, {_id}), count: count - 1}};
              }
            },
          })}),
        }
      ),
    )
  ]);

  return compose.apply(null, hocs);
}