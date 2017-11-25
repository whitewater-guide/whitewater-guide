import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Screen } from '../../../components';
import { searchTermsSelector } from '../../../commons/features/regions';
import { SectionsList } from '../../sections-list';
import I18n from '../../../i18n';

class RegionSectionsScreen extends React.PureComponent {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    screenProps: PropTypes.object,
    searchTerms: PropTypes.object,
  };

  static navigationOptions = {
    tabBarLabel: I18n.t('region.sections.title'),
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
        <SectionsList
          loadUpdates={sections.loadUpdates}
          sections={sections.list}
          dispatch={this.props.dispatch}
          extraData={this.props.searchTerms}
        />
      </Screen>
    );
  }

}

export default connect(searchTermsSelector)(RegionSectionsScreen);
