import React, {Component, PropTypes} from 'react';
import {Map} from '../../core/components';
import _ from 'lodash';
import {compose} from 'recompose';
import {withSections, ViewSection} from '../sections';
import {withRegion} from './containers/withRegion';

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

  componentDidUpdate(prevPros){
    const {loadMore, sections, count} = this.props;
    if (prevPros.sections.length < sections.length && sections.length < count){
      loadMore({startIndex: sections.length, stopIndex: sections.length + 25});
    }
  }

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

  onSectionSelected = selectedSectionId => this.setState({selectedSectionId});

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
  withRegion({withBounds: true, withPOIs: false}),
  withSections({withGeo: true, sort: null}),
)(RegionMapPage);
