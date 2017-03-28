import React, { PropTypes } from 'react';
import { Text, Button } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import { Screen } from '../../components';

class PageThree extends React.PureComponent {

  static propTypes = {
    back: PropTypes.func.isRequired,
    navigate: PropTypes.func.isRequired,
  };

  static navigationOptions = {
    title: 'Sections',
  };

  goBack = () => {
    this.props.back();
  };

  goToPageOne = () => {
    this.props.navigate({ routeName: 'PageOne' });
  };

  goToPageTwo = () => {
    this.props.navigate({ routeName: 'PageTwo' });
  };

  render() {
    return (
      <Screen>
        <Text>
          Third Screen / Page 3
        </Text>
        <Button title="Go back" onPress={this.goBack} />
        <Button title="Go to page 1" onPress={this.goToPageOne} />
        <Button title="Go to page 2" onPress={this.goToPageTwo} />
      </Screen>
    );
  }

}

export default connect(undefined, NavigationActions)(PageThree);
