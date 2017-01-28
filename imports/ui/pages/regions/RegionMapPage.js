import React, {Component, PropTypes} from 'react';
import {withRouter} from 'react-router';
import {createContainer} from 'meteor/react-meteor-data';
import {Sections} from '/imports/api/sections';
import {mapQuery} from '/imports/api/sections/query';
import {compose, withProps} from 'recompose';
import {TAPi18n} from 'meteor/tap:i18n';
import Map from '/imports/ui/components/map/Map';

class RegionMapPage extends Component {

  static propTypes = {
    params: PropTypes.shape({
      regionId: PropTypes.string,
    }),
    sections: PropTypes.array,
  };

  render() {
    return (
      <div style={styles.container}>
        <div style={styles.mapContainer}>
          <Map sections={this.props.sections}/>
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
    return {
      ready: sub.ready(),
      sections: sub.ready() ? sections : [],
    };
  },
  RegionMapPage
);

export default compose(
  withRouter,
  withProps(props => ({regionId: props.params.regionId})),
)(DataContainer)