import React, { PropTypes } from 'react';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import { Screen } from '../../components';
import { SectionsList } from '../sections-list';

class RegionSectionsScreen extends React.PureComponent {

  static propTypes = {
    back: PropTypes.func.isRequired,
    navigate: PropTypes.func.isRequired,
    screenProps: PropTypes.object,
  };

  static navigationOptions = {
    title: 'Sections',
  };

  render() {
    const { screenProps: { sections } } = this.props;
    return (
      <Screen noScroll>
        <SectionsList sections={sections} />
      </Screen>
    );
  }

}

export default connect(undefined, NavigationActions)(RegionSectionsScreen);
