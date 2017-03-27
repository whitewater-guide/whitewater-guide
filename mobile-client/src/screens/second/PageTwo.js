import React, { PropTypes } from 'react';
import { Text, Button } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import { Screen } from '../../components';

class PageTwo extends React.PureComponent {

  static propTypes = {
    back: PropTypes.func.isRequired,
  };

  static navigationOptions = {
    title: 'Page Two',
  };

  goBack = () => {
    this.props.back();
  };

  render() {
    return (
      <Screen>
        <Text>
          Second Screen / Page 2
        </Text>
        <Button title="Go back" onPress={this.goBack} />
      </Screen>
    );
  }

}

export default connect(undefined, NavigationActions)(PageTwo);
