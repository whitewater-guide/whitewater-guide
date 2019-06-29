import { useMapSelection } from '@whitewater-guide/clients';
import { isPoint } from '@whitewater-guide/commons';
import React, { useCallback } from 'react';
import { Container, Row } from 'react-grid-system';
import { Styles } from '../../styles';
import { InfoWindow } from './InfoWindow';
import { MapElementProps } from './types';

const styles: Styles = {
  h2: {
    fontWeight: 'bold',
    fontSize: '1.5em',
  },
};

const SelectedPOIWeb: React.FC<MapElementProps> = (props) => {
  const { selection, onSelected } = useMapSelection();
  const onClose = useCallback(() => onSelected(null), [onSelected]);

  if (!isPoint(selection)) {
    return null;
  }
  const position = {
    lat: selection.coordinates[1],
    lng: selection.coordinates[0],
  };
  return (
    <InfoWindow position={position} onCloseClick={onClose} {...props}>
      <Container style={{ minWidth: 500 }}>
        <Row>
          <span style={styles.h2}>{selection.name}</span>
        </Row>
        <Row>
          <p>{selection.description}</p>
        </Row>
      </Container>
    </InfoWindow>
  );
};

export default SelectedPOIWeb;
