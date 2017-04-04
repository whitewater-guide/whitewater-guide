import React, { PropTypes } from 'react';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import { Text } from 'native-base';
import { Screen } from '../../../components';

class SectionInfoScreen extends React.PureComponent {

  static propTypes = {
    screenProps: PropTypes.object,
  };

  static navigationOptions = {
    tabBar: {
      label: 'Info',
    },
  };

  render() {
    const { screenProps: { section = { river: {} }, sectionLoading } } = this.props;
    return (
      <Screen loading={sectionLoading}>
        <Text>{JSON.stringify(section)}</Text>
      </Screen>
    );
  }

}

export default connect(undefined, NavigationActions)(SectionInfoScreen);
