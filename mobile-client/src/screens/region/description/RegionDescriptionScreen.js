import React, { PropTypes } from 'react';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import { H1 } from 'native-base';
import HTMLView from 'react-native-htmlview';
import { Screen } from '../../../components';

class RegionDescriptionScreen extends React.PureComponent {

  static propTypes = {
    screenProps: PropTypes.object,
  };

  static navigationOptions = {
    title: 'Description',
  };

  render() {
    const { screenProps: { region = {}, regionLoading } } = this.props;
    return (
      <Screen loading={regionLoading}>
        <H1>{region.name}</H1>
        <HTMLView value={region.description} />
      </Screen>
    );
  }

}

export default connect(undefined, NavigationActions)(RegionDescriptionScreen);
