import PropTypes from 'prop-types';
import React from 'react';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import HTMLView from 'react-native-htmlview';
import { Screen } from '../../../components';

class RegionDescriptionScreen extends React.PureComponent {

  static propTypes = {
    screenProps: PropTypes.object,
  };

  static navigationOptions = {
    tabBarLabel: 'Description',
  };

  render() {
    const { screenProps: { region = {} } } = this.props;
    return (
      <Screen>
        <HTMLView value={region.description} />
      </Screen>
    );
  }

}

export default connect(undefined, NavigationActions)(RegionDescriptionScreen);
