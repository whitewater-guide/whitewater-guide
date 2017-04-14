import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { compose, hoistStatics } from 'recompose';
import SectionsList from './list/SectionsList';
import { withSectionsList, SectionsPropType } from '../../commons/features/sections';
import { ErrorRefetchScreen, Screen, withErrorsView } from '../../components';

class SectionsListScreen extends PureComponent {
  static propTypes = {
    sections: SectionsPropType.isRequired,
  };

  static navigationOptions = {
    title: 'All Sections',
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
        <SectionsList sections={this.props.sections} onEndReached={this.onEndReached} />
      </Screen>
    );
  }
}

const container = compose(
  withSectionsList({ withGeo: true }),
  withErrorsView,
  connect(),
);
export default hoistStatics(container)(SectionsListScreen);

