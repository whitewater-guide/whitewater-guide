import React, { PropTypes } from 'react';
import HTMLView from 'react-native-htmlview';
import { flattenProp } from 'recompose';
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

export default flattenProp('screenProps')(SectionGuideScreen);
