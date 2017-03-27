import React, { PropTypes } from 'react';
import { Text, Button } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import { Screen } from '../../components';

class PageOne extends React.PureComponent {

  static propTypes = {
    back: PropTypes.func.isRequired,
    navigate: PropTypes.func.isRequired,
  };

  static navigationOptions = {
    title: 'Page 1',
  };

  goBack = () => {
    this.props.back();
  };

  goToPageTwo = () => {
    this.props.navigate({ routeName: 'PageTwo' });
  };

  goToPageThree = () => {
    this.props.navigate({ routeName: 'PageThree' });
  };

  render() {
    return (
      <Screen>
        <Text>
          Third Screen / Page 1
        </Text>
        <Button title="Go back" onPress={this.goBack} />
        <Button title="Go to page 2" onPress={this.goToPageTwo} />
        <Button title="Go to page 3" onPress={this.goToPageThree} />
      </Screen>
    );
  }

}

export default connect(undefined, NavigationActions)(PageOne);
