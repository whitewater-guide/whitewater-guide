import React, { PropTypes } from 'react';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import HTMLView from 'react-native-htmlview';
import { Screen } from '../../../components';

class SectionGuideScreen extends React.PureComponent {

  static propTypes = {
    screenProps: PropTypes.object,
  };

  static navigationOptions = {
    tabBar: {
      label: 'Guide',
    },
  };

  render() {
    const { screenProps: { section = { river: {} }, sectionLoading } } = this.props;
    return (
      <Screen loading={sectionLoading}>
        <HTMLView value={section.description} />
      </Screen>
    );
  }

}

export default connect(undefined, NavigationActions)(SectionGuideScreen);
