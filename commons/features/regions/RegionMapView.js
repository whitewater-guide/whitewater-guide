import React, { PropTypes } from 'react';
import { compose, setDisplayName, withState } from 'recompose';

import { RegionPropType } from './propTypes';
import { SectionPropType, SectionsPropType } from '../sections';

const getRegionMapView = (Layout, Map, SelectedSection) => (
  class RegionMapView extends React.PureComponent {
    static propTypes = {
      region: RegionPropType,
      regionLoading: PropTypes.bool.isRequired,
      sections: SectionsPropType.isRequired,
      selectedSection: SectionPropType,
      onSectionSelected: PropTypes.func.isRequired,
    };

    static defaultProps = {
      region: null,
      regionLoading: false,
      selectedSection: null,
    };

    componentDidUpdate(prevPros) {
      const { loadMore, list, count } = this.props.sections;
      const numSections = list.length;
      const prevNumSections = prevPros.sections.list.length;
      if (prevNumSections < numSections && numSections < count) {
        loadMore({ startIndex: numSections, stopIndex: numSections + 25 });
      }
    }

    renderMapView = () => {
      const { region, sections, selectedSection, onSectionSelected } = this.props;
      return (
        <Map
          region={region}
          sections={sections.list}
          selectedSection={selectedSection}
          onSectionSelected={onSectionSelected}
        />
      );
    };

    renderSelectedSectionView = () => {
      const { selectedSection } = this.props;
      return (
        <SelectedSection section={selectedSection} />
      );
    };

    render() {
      return (
        <Layout
          mapView={this.renderMapView()}
          selectedSectionView={this.renderSelectedSectionView()}
        />
      );
    }
  }
);

export default (Layout, Map, SelectedSection) => compose(
  setDisplayName('RegionMapView'),
  withState('selectedSection', 'onSectionSelected', null),
)(getRegionMapView(Layout, Map, SelectedSection));
