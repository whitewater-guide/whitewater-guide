import React, { PropTypes } from 'react';
import { Text, Button } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import { Screen } from '../../components';

class PageThree extends React.PureComponent {

  static propTypes = {
    back: PropTypes.func.isRequired,
  };

  static navigationOptions = {
    title: 'Page Three',
  };

  goBack = () => {
    this.props.back();
  };

  render() {
    return (
      <Screen>
        <Text>
          Second Screen / Page 3
        </Text>
        <Button title="Go back" onPress={this.goBack} />
      </Screen>
    );
  }

}

export default connect(undefined, NavigationActions)(PageThree);
