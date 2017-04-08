import React, { PropTypes } from 'react';
import HTMLView from 'react-native-htmlview';
import { flattenProp, hoistStatics } from 'recompose';
import { Screen } from '../../../components';

class SectionGuideScreen extends React.PureComponent {

  static propTypes = {
    section: PropTypes.object,
  };

  static navigationOptions = {
    tabBar: {
      label: 'Guide',
    },
  };

  render() {
    return (
      <Screen>
        <HTMLView value={this.props.section.description} />
      </Screen>
    );
  }

}

const container = flattenProp('screenProps');

export default hoistStatics(container)(SectionGuideScreen);
