import * as React from 'react';
import { InfoWindow, MapElement } from '../../../../components/maps';
import { SelectedSectionViewProps } from '../../../../ww-clients/features/maps';

type Props = MapElement & SelectedSectionViewProps;

class SelectedSectionWeb extends React.PureComponent<Props> {
  onClose = () => {
    this.props.onSectionSelected(null);
  };

  render() {
    const { onPOISelected, onSectionSelected, selectedSection, ...mapElementProps } = this.props;
    if (!selectedSection) {
      return null;
    }
    const putIn = selectedSection.putIn;
    const putInLL = { lat: putIn.coordinates[1], lng: putIn.coordinates[0] };
    return (
      <InfoWindow position={putInLL} onCloseClick={this.onClose} {...mapElementProps}>
        <div>
          {selectedSection.name}
        </div>
      </InfoWindow>
    );
  }
}

export default SelectedSectionWeb;