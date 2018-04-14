import { compose, hoistStatics, withProps } from 'recompose';
import { gql } from 'react-apollo';
import get from 'lodash/get';
import choose from '../../commons/utils/choose';
import { spinnerWhileLoading } from '../../components';
import { enhancedQuery } from '../../commons/apollo';
import I18n from '../../i18n';

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

const fixtureContainer = withProps(props => ({
  htmlText: I18n.t('markdown.' + get(props, 'navigation.state.params.textId')),
  format: get(props, 'navigation.state.params.format', 'html'),
  loading: false,
}));

// Choose data provider based on navigation params
const chooser = props => get(props, 'navigation.state.params.data');

const container = compose(
  choose(
    chooser,
    {
      source: sourceContainer,
      fixture: fixtureContainer,
    },
  ),
  spinnerWhileLoading(props => props.loading),
);

export default hoistStatics(container);
