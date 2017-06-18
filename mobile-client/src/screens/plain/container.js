import { compose, hoistStatics } from 'recompose';
import { gql } from 'react-apollo';
import get from 'lodash/get';
import choose from '../../commons/utils/choose';
import { spinnerWhileLoading } from '../../components';
import { enhancedQuery } from '../../commons/apollo';

const sourceDetails = gql`
  query sourceDetails($_id: ID, $language:String) {
    source(_id: $_id, language: $language) {
      _id
      name
      termsOfUse
      url
    }
  }
`;

const sourceContainer = enhancedQuery(
  sourceDetails,
  {
    options: props => ({
      fetchPolicy: 'cache-and-network',
      variables: {
        _id: get(props, 'navigation.state.params.source._id'),
        language: props.language,
      },
    }),
    props: ({ data: { loading, source } }) => ({
      htmlText: get(source, 'termsOfUse'),
      loading,
      screenProps: { title: `Data source: ${get(source, 'name')}` },
    }),
  },
);

// Choose data provider based on navigation params
const chooser = props => get(props, 'navigation.state.params.data');

const container = compose(
  choose(
    chooser,
    {
      source: sourceContainer,
    },
  ),
  spinnerWhileLoading(props => props.loading),
);

export default hoistStatics(container);
