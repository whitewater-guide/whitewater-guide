import * as React from 'react';
import { Styles } from '../../../../styles';
import { MapLayoutProps } from '../../../../ww-clients/features/maps';

const styles: Styles = {
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

export default class RegionMapLayout extends React.PureComponent<MapLayoutProps> {

  render() {
    const { mapView, selectedSectionView, selectedPOIView } = this.props;
    return (
      <div style={styles.container}>
        <div style={styles.mapContainer}>
          {mapView}
        </div>
        <div style={styles.rightColumn}>
          {selectedSectionView}
          {selectedPOIView}
        </div>
      </div>
    );
  }

}
