import PropTypes from 'prop-types';
import React from 'react';
import { Text } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import { Screen } from '../../../components';
import ApplyFilterButton from './ApplyFilterButton';

class RegionFilterScreen extends React.PureComponent {

  static propTypes = {
    screenProps: PropTypes.object,
    back: PropTypes.func.isRequired,
  };

  static navigationOptions = {
    title: 'Filters',
    headerLeft: null,
    headerRight: (<ApplyFilterButton />),
  };

  onGoBack = () => this.props.back();

  render() {
    return (
      <Screen>
        <Text>Filters</Text>
      </Screen>
    );
  }

}

export default connect(undefined, NavigationActions)(RegionFilterScreen);
