import React, { Component } from 'react';
import _ from 'lodash';
import { compose } from 'recompose';
import { Map } from '../../core/components';
import { ViewSection } from '../sections';
import { withRegion, RegionPropType } from '../../commons/features/regions';
import { withSections, SectionsPropType } from '../../commons/features/sections';

const styles = {
  container: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
  },
  mapContainer: {
    display: 'flex',
    flex: 3,
  },
  rightColumn: {
    display: 'flex',
    flex: 1,
    padding: 8,
    maxWidth: 360,
  },
};

class RegionMapPage extends Component {

  static propTypes = {
    region: RegionPropType,
    sections: SectionsPropType.isRequired,
  };

  static defaultProps = {
    region: null,
  };

  state = {
    selectedSectionId: null,
  };

  componentDidUpdate(prevPros) {
    const { loadMore, list, count } = this.props.sections;
    const numSections = list.length;
    const prevNumSections = prevPros.sections.list.length;
    if (prevNumSections < numSections && numSections < count) {
      loadMore({ startIndex: numSections, stopIndex: numSections + 25 });
    }
  }

  onSectionSelected = selectedSectionId => this.setState({ selectedSectionId });

  render() {
    const { region, sections } = this.props;
    const bounds =
      region && region.bounds && region.bounds.sw ?
      {
        bounds: {
          sw: { lat: _.get(region, 'bounds.sw.1'), lng: _.get(region, 'bounds.sw.0') },
          ne: { lat: _.get(region, 'bounds.ne.1'), lng: _.get(region, 'bounds.ne.0') },
        },
      } :
      {};

    return (
      <div style={styles.container}>
        <div style={styles.mapContainer}>
          {
            region &&
            <Map
              {...bounds}
              sections={sections.list}
              selectedSectionId={this.state.selectedSectionId}
              onSectionSelected={this.onSectionSelected}
            />
          }
        </div>
        <div style={styles.rightColumn}>
          <ViewSection sectionId={this.state.selectedSectionId} />
        </div>
      </div>
    );
  }

}

export default compose(
  withRegion({ withBounds: true, withPOIs: false }),
  withSections({ withGeo: true }),
)(RegionMapPage);
