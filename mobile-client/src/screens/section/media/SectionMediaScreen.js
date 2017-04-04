import React, { PropTypes } from 'react';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import { Text } from 'native-base';
import { Screen } from '../../../components';

class SectionMediaScreen extends React.PureComponent {

  static propTypes = {
    screenProps: PropTypes.object,
  };

  static navigationOptions = {
    tabBar: {
      label: 'Media',
    },
  };

  render() {
    const { screenProps: { section = { river: {} }, sectionLoading } } = this.props;
    return (
      <Screen loading={sectionLoading}>
        <Text>{`Section Media ${section.river.name} - ${section.name}`}</Text>
      </Screen>
    );
  }

}

export default connect(undefined, NavigationActions)(SectionMediaScreen);
