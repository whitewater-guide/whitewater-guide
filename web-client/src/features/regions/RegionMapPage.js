import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import { compose } from 'recompose';
import { Map } from '../../core/components';
import { ViewSection } from '../sections';
import { withRegion } from '../../commons/features/regions';
import { withSections } from '../../commons/features/sections';

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
    region: PropTypes.object,
    sections: PropTypes.array,
    count: PropTypes.number,//Number of sections
    loadMore: PropTypes.func, //Load more sections
  };

  state = {
    selectedSectionId: null,
  };

  componentDidUpdate(prevPros) {
    const { loadMore, sections, count } = this.props;
    if (prevPros.sections.length < sections.length && sections.length < count) {
      loadMore({ startIndex: sections.length, stopIndex: sections.length + 25 });
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
              sections={sections}
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
  withSections({ withGeo: true, sort: null }),
)(RegionMapPage);
