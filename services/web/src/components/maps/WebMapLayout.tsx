import { MapLayoutProps } from '@whitewater-guide/clients';
import React from 'react';
import { Styles } from '../../styles';

const styles: Styles = {
  container: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
  },
};

export class WebMapLayout extends React.PureComponent<MapLayoutProps> {
  render() {
    const { mapView, selectedSectionView, selectedPOIView } = this.props;
    return (
      <div style={styles.container}>
        {React.cloneElement(mapView as any, {}, [
          selectedSectionView,
          selectedPOIView,
        ])}
      </div>
    );
  }
}
