import React, { PropTypes } from 'react';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import { Text } from 'native-base';
import { Screen } from '../../../components';

class RegionMapScreen extends React.PureComponent {

  static propTypes = {
    back: PropTypes.func.isRequired,
    navigate: PropTypes.func.isRequired,
    screenProps: PropTypes.object,
  };

  static navigationOptions = {
    tabBar: {
      label: 'Map',
    },
  };

  render() {
    const { screenProps: { region, regionLoading } } = this.props;
    return (
      <Screen loading={regionLoading}>
        {region && <Text>{`Region ${region.name}`}</Text>}
      </Screen>
    );
  }

}

export default connect(undefined, NavigationActions)(RegionMapScreen);
