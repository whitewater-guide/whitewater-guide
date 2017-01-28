import React, {Component, PropTypes} from 'react';
import {withRouter} from 'react-router';
import {createContainer} from 'meteor/react-meteor-data';
import {Sections} from '/imports/api/sections';
import {Regions} from '/imports/api/regions';
import {mapQuery} from '/imports/api/sections/query';
import {compose, withProps} from 'recompose';
import {TAPi18n} from 'meteor/tap:i18n';
import Map from '/imports/ui/components/map/Map';
import _ from 'lodash';

class RegionMapPage extends Component {

  static propTypes = {
    regionId: PropTypes.string,
    region: PropTypes.object,
    sections: PropTypes.array,
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
          {region && <Map {...bounds} sections={sections}/>}
        </div>
        <div style={styles.rightColumn}>
          info
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
  },
};

const DataContainer = createContainer(
  (props) => {
    const query = mapQuery(props);
    const sub = TAPi18n.subscribe('sections.map', null, props);
    const sections = Sections.find(query.selector, query.options).fetch();
    const region = Regions.find({_id: props.regionId}, {limit: 1}).fetch()[0];
    return {
      ready: sub.ready(),
      sections: sub.ready() ? sections : [],
      region,
    };
  },
  RegionMapPage
);

export default compose(
  withRouter,
  withProps(props => ({regionId: props.params.regionId})),
)(DataContainer)