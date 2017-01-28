import React, {Component, PropTypes} from 'react';
import {withRouter} from 'react-router';
import {createContainer} from 'meteor/react-meteor-data';
import {Sections} from '/imports/api/sections';
import {Regions} from '/imports/api/regions';
import {mapQuery} from '/imports/api/sections/query';
import {compose, withProps, withState} from 'recompose';
import SectionInfo from './SectionInfo';
import {TAPi18n} from 'meteor/tap:i18n';
import Map from '/imports/ui/components/map/Map';
import _ from 'lodash';

class RegionMapPage extends Component {

  static propTypes = {
    regionId: PropTypes.string,
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

const DataContainer = createContainer(
  (props) => {
    const query = mapQuery(props);
    const sub = TAPi18n.subscribe('sections.map', null, props);
    const selectedSub = TAPi18n.subscribe('sections.details', null, props.selectedSectionId);
    const sections = Sections.find(query.selector, query.options).fetch();
    const selectedSection = Sections.findOne({_id: props.selectedSectionId});
    const region = Regions.find({_id: props.regionId}, {limit: 1}).fetch()[0];
    const ready = sub.ready() && selectedSub.ready();

    return {
      ready,
      sections: ready ? sections : [],
      selectedSection,
      region,
    };
  },
  RegionMapPage
);

export default compose(
  withRouter,
  withProps(props => ({regionId: props.params.regionId})),
  withState('selectedSectionId', 'setSelectedSectionId', null),
)(DataContainer)