import PropTypes from 'prop-types';
import React from 'react';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import { HTMLView, Screen } from '../../../components';
import NoRegionDescription from './NoRegionDescription';

class RegionDescriptionScreen extends React.PureComponent {

  static propTypes = {
    screenProps: PropTypes.object,
  };

  static navigationOptions = {
    tabBarLabel: 'Description',
  };

  render() {
    const { screenProps: { region = {} } } = this.props;
    console.log('Region description', region.description ? 'a' : 'b');
    return (
      <Screen noScroll={!region.description}>
        {
          region.description ? (<HTMLView value={region.description} />) : (<NoRegionDescription />)
        }
      </Screen>
    );
  }

}

export default connect(undefined, NavigationActions)(RegionDescriptionScreen);
