import PropTypes from 'prop-types';
import React from 'react';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import { HTMLView, Screen } from '../../../components';
import NoRegionDescription from './NoRegionDescription';
import I18n from '../../../i18n';

class RegionDescriptionScreen extends React.PureComponent {

  static propTypes = {
    screenProps: PropTypes.object,
  };

  static navigationOptions = {
    tabBarLabel: I18n.t('region.description.title'),
  };

  render() {
    const { screenProps: { region = {} } } = this.props;
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
