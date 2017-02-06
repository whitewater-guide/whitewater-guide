import {graphql, compose} from 'react-apollo';
import gql from 'graphql-tag';
import withAdmin from '../../hoc/withAdmin';
import {withRouter} from 'react-router';
import {withProps, withState, branch} from 'recompose';
import _ from 'lodash';

const ListRiversQuery = gql`
  query listRivers($regionId:ID, $language:String, $skip:Int, $limit:Int, $isLoadMore:Boolean!) {
    rivers(regionId:$regionId, language:$language, skip:$skip, limit:$limit) {
      _id
      name
      description
      region {
        _id
        name
      }
    }

    count: countRivers(regionId:$regionId) @skip(if: $isLoadMore)
  }
`;


const RemoveRiverMutation = gql`
  mutation removeRiver($_id: ID!){
    removeRiver(_id: $_id)
  }
`;

export default compose(
  withState('language', 'setLanguage', 'en'),
  withProps(props => ({regionId: props.location.query.regionId})),
  withAdmin,
  withRouter,
  graphql(
    ListRiversQuery, {
      options: ({regionId, language}) => ({
        forceFetch: true,
        variables: {regionId, language, isLoadMore: false},
      }),
      props: ({data: {rivers, count, loading, fetchMore}}) => {
        return {
          rivers,
          count,
          loading,
          loadMore: ({startIndex: skip, stopIndex}) => {
            return fetchMore({
              variables: {skip, limit: stopIndex - skip, isLoadMore: true},
              updateQuery: (prevResult, {fetchMoreResult}) => {
                if (!fetchMoreResult.data)
                  return prevResult;
                return {...prevResult, rivers: [...prevResult.rivers, ...fetchMoreResult.data.rivers]};
              }
            });
          }
        };
      }
    }
  ),
  branch(//Remove river mutation is provided only if user is admin
    props => props.admin,
    graphql(
      RemoveRiverMutation, {
        props: ({mutate}) => ({removeRiver: _id => mutate({
          variables: {_id},
          updateQueries: {
            listRivers: (prev) => {
              return {...prev, rivers: _.reject(prev.rivers, {_id})};
            }
          },
        })}),
      }
    )
  ),
);