import React, { PropTypes } from 'react';
import { Text, Button } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import Config from 'react-native-config';
import { Screen } from '../../components';

class FirstScreen extends React.PureComponent {

  static propTypes = {
    navigate: PropTypes.func.isRequired,
  };

  static navigationOptions = {
    title: 'First Screen',
  };

  toSecondScreen = () => {
    this.props.navigate({ routeName: 'SecondScreen' });
  };

  render() {
    return (
      <Screen>
        <Text>
          {Config.GREETING}
        </Text>
        <Button title="Go to second screen" onPress={this.toSecondScreen} />
      </Screen>
    );
  }

}

export default connect(undefined, NavigationActions)(FirstScreen);
