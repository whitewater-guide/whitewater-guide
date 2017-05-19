import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose, hoistStatics } from 'recompose';
import SectionsList from './SectionsList';
import { withSectionsList, SectionsPropType } from '../../commons/features/sections';
import { Screen, withErrorsView } from '../../components';
import { currentSectionSearchTerms } from '../../core/selectors';
import SectionSearchHeader from './header/SectionSearchHeader';
import FilterButton from './header/FilterButton';

class AllSectionsScreen extends PureComponent {
  static propTypes = {
    sections: SectionsPropType.isRequired,
    dispatch: PropTypes.func.isRequired,
  };

  static navigationOptions = {
    headerTitle: (<SectionSearchHeader />),
    headerRight: (<FilterButton filterRouteName="AllSectionsFilter" />),
  };

  onEndReached = () => {
    const { list, count, loadMore, loading } = this.props.sections;
    const numSections = list.length;
    if (numSections < count && !loading) {
      loadMore({ startIndex: numSections, stopIndex: numSections + 25 });
    }
  };

  render() {
    return (
      <Screen noScroll>
        <SectionsList
          sections={this.props.sections.list}
          onEndReached={this.onEndReached}
          dispatch={this.props.dispatch}
        />
      </Screen>
    );
  }
}

const container = compose(
  connect(state => ({ sectionSearchTerms: currentSectionSearchTerms(state) })),
  withSectionsList({ withGeo: true }),
  withErrorsView,
  connect(),
);
export default hoistStatics(container)(AllSectionsScreen);

