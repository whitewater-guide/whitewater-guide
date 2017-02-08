import React, {Component, PropTypes} from 'react';
import {withRouter} from 'react-router';
import SectionInfo from './SectionInfo';
import Map from '/imports/ui/components/map/Map';
import _ from 'lodash';
import {compose, withState} from 'recompose';
import {withSections} from '../sections';
import {withRegion} from '../regions';

class RegionMapPage extends Component {

  static propTypes = {
    region: PropTypes.object,
    sections: PropTypes.array,
    selectedSectionId: PropTypes.string,
    setSelectedSectionId: PropTypes.func,
    selectedSection: PropTypes.object,
  };

  render() {
    const {region, sections} = this.props;
    const bounds =
      region && region.bounds && region.bounds.sw ?
        {
          bounds: {
            sw: {lat: _.get(region, 'bounds.sw.1'), lng: _.get(region, 'bounds.sw.0')},
            ne: {lat: _.get(region, 'bounds.ne.1'), lng: _.get(region, 'bounds.ne.0')},
          }
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
              selectedSectionId={this.props.selectedSectionId}
              onSectionSelected={this.props.setSelectedSectionId}
            />
          }
        </div>
        <div style={styles.rightColumn}>
          <SectionInfo section={this.props.selectedSection}/>
        </div>
      </div>
    );
  }

}

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

export default compose(
  withRouter,
  withRegion({withBounds: true, withPOIs: false}),
  withSections({withGeo: true, sort: null}),
  withState('selectedSectionId', 'setSelectedSectionId', null),
)(RegionMapPage)
