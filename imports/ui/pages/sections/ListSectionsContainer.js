import {graphql, compose} from 'react-apollo';
import gql from 'graphql-tag';
import withAdmin from '../../hoc/withAdmin';
import {withRouter} from 'react-router';
import {mapProps, withState, withHandlers, flattenProp, branch} from 'recompose';
import _ from 'lodash';
import update from 'immutability-helper';

const ListSectionsQuery = gql`
  query listSections($terms:SectionSearchTerms!, $language: String, $isLoadMore:Boolean!) {
    sections(terms:$terms, language:$language) {
      sections {
        _id
        name
        difficulty
        rating
        drop
        distance
        duration
        river {
          _id
          name
        }
      }
      count @skip(if: $isLoadMore)
    }
  }
`;

const RemoveSectionMutation = gql`
  mutation removeSection($_id: ID!){
    removeSection(_id: $_id)
  }
`;


function termsFromProps(props) {
  let result = _.pick(props, ['sortBy', 'sortDirection', 'riverId', 'regionId']);
  if (result.sortDirection)
    result.sortDirection = result.sortDirection.toLowerCase();
  return result;
}

export default compose(
  withAdmin,
  withRouter,
  mapProps(({riverId, regionId, location, params, ...props}) => ({
    ...props,
    regionId: regionId || params.regionId || location.query.regionId,
    riverId: riverId || params.riverId || location.query.riverId,
  })),
  withState('sortOptions','setSortOptions', {sortBy: 'name', sortDirection: 'ASC'}),
  withHandlers({
    onSort: props => sortOptions => props.setSortOptions(sortOptions),
  }),
  flattenProp('sortOptions'),
  branch(
    //If sections aren't provided from outside, fetch them
    //If they are provided by parent, sort them here
    props => !props.sections,
    graphql(
      ListSectionsQuery, {
        options: ({language, ...props}) => ({
          forceFetch: true,
          variables: {terms: termsFromProps(props), language, isLoadMore: false},
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
    mapProps(({sortBy, sortDirection, sections, ...props}) => {
      const sort = sortBy === 'name' ? [sec => sec.river.name, 'name'] : [sortBy];
      let seq = _.chain(sections).sortBy(sort);
      if (sortDirection.toLowerCase() === 'desc')
        seq = seq.reverse();
      return {
        sortBy,
        sortDirection,
        sections: seq.value(),
        count: sections.length,
        loadMore: _.noop,
        ...props
      };
    })
  ),
  branch(
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
);