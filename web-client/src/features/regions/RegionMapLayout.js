import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';

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

export default class RegionMapLayout extends PureComponent {

  static propTypes = {
    mapView: PropTypes.element.isRequired,
    selectedSectionView: PropTypes.element.isRequired,
  };

  render() {
    const { mapView, selectedSectionView } = this.props;
    return (
      <div style={styles.container}>
        <div style={styles.mapContainer}>
          { mapView }
        </div>
        <div style={styles.rightColumn}>
          { selectedSectionView }
        </div>
      </div>
    );
  }

}
