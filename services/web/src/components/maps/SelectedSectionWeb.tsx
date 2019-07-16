import {
  renderDifficulty,
  stringifySeason,
  useMapSelection,
} from '@whitewater-guide/clients';
import { Durations, isSection, sectionName } from '@whitewater-guide/commons';
import { RaisedButton } from 'material-ui';
import React, { useCallback } from 'react';
import { Col, Container, Row } from 'react-grid-system';
import useRouter from 'use-react-router';
import { Title } from '../../layout/details';
import { Styles } from '../../styles';
import { paths } from '../../utils';
import { Rating } from '../Rating';
import { InfoWindow } from './InfoWindow';
import { MapElementProps } from './types';

const styles: Styles = {
  h2: {
    fontWeight: 'bold',
    fontSize: '1.5em',
  },
};

const SelectedSectionWeb: React.FC<MapElementProps> = (props) => {
  const { selection, onSelected } = useMapSelection();
  const onDetails = useCallback(() => {
    const { history, match } = useRouter<{ regionId: string }>();
    if (isSection(selection)) {
      history.push(
        paths.to({
          regionId: match.params.regionId,
          sectionId: selection.id,
        }),
      );
    }
  }, [selection]);
  const onClose = useCallback(() => onSelected(null), [onSelected]);

  if (!isSection(selection)) {
    return null;
  }
  const putIn = selection.putIn;
  const putInLL = { lat: putIn.coordinates[1], lng: putIn.coordinates[0] };

  return (
    <InfoWindow position={putInLL} onCloseClick={onClose} {...props}>
      <Container style={{ minWidth: 500 }}>
        <Row>
          <Col sm={9}>
            <div style={styles.h2}>{sectionName(selection)}</div>
            <Rating fontSize={16} value={selection.rating!} />
          </Col>
          <Col style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <span style={styles.h2}>{renderDifficulty(selection)}</span>
          </Col>
        </Row>
        <Row>
          <Col>
            <b>Drop</b>
          </Col>
          <Col>{`${selection.drop} m`}</Col>
          <Col>
            <b>Length</b>
          </Col>
          <Col>{`${selection.distance} km`}</Col>
          <Col>
            <b>Duration</b>
          </Col>
          <Col>{selection.duration && Durations.get(selection.duration)}</Col>
        </Row>
        <Row>
          <Title>Season</Title>
          <Col>
            <div>{selection.season}</div>
            <div>{stringifySeason(selection.seasonNumeric)}</div>
          </Col>
        </Row>
        <RaisedButton
          fullWidth={true}
          primary={true}
          label="More"
          onClick={onDetails}
        />
      </Container>
    </InfoWindow>
  );
};

export default SelectedSectionWeb;
