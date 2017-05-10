import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Screen } from '../../../components';
import { SectionsList } from '../../sections-list';

class RegionSectionsScreen extends React.PureComponent {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    screenProps: PropTypes.object,
  };

  static navigationOptions = {
    tabBarLabel: 'Sections',
  };

  componentWillMount() {
    const { region, sections } = this.props.screenProps;
    sections.subscribeToUpdates({
      regionId: region._id,
    });
  }

  render() {
    const { screenProps: { sections } } = this.props;
    return (
      <Screen noScroll>
        <SectionsList sections={sections.list} dispatch={this.props.dispatch} />
      </Screen>
    );
  }

}

export default connect()(RegionSectionsScreen);
