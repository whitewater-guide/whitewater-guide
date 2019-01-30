import { RaisedButton } from 'material-ui';
import React from 'react';
import { Col } from 'react-grid-system';
import { RouteComponentProps, withRouter } from 'react-router';
import { Rating } from '../../../../components';
import { InfoWindow, MapElement } from '../../../../components/maps';
import { Container, Row, Title } from '../../../../layout/details';
import { Styles } from '../../../../styles';
import { paths } from '../../../../utils';
import { SelectedSectionViewProps } from '@whitewater-guide/clients';
import { renderDifficulty, stringifySeason } from '@whitewater-guide/clients';
import { Durations } from '@whitewater-guide/commons';

const styles: Styles = {
  h2: {
    fontWeight: 'bold',
    fontSize: '1.5em',
  },
};

type Props = MapElement &
  SelectedSectionViewProps &
  RouteComponentProps<{ regionId: string }>;

class SelectedSectionWebInner extends React.PureComponent<Props> {
  onClose = () => {
    this.props.onSectionSelected(null);
  };

  onDetails = () => {
    const { history, match, selectedSection } = this.props;
    history.push(
      paths.to({
        regionId: match.params.regionId,
        sectionId: selectedSection!.id,
      }),
    );
  };

  render() {
    const {
      onPOISelected,
      onSectionSelected,
      selectedSection: section,
      match,
      location,
      history,
      staticContext,
      // tslint:disable-next-line:trailing-comma
      ...mapElementProps
    } = this.props;
    if (!section) {
      return null;
    }
    const putIn = section.putIn;
    const putInLL = { lat: putIn.coordinates[1], lng: putIn.coordinates[0] };

    return (
      <InfoWindow
        position={putInLL}
        onCloseClick={this.onClose}
        {...mapElementProps}
      >
        <Container style={{ minWidth: 500 }}>
          <Row>
            <Col sm={9}>
              <div style={styles.h2}>{`${section.river.name} - ${
                section.name
              }`}</div>
              <Rating fontSize={16} value={section.rating!} />
            </Col>
            <Col style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <span style={styles.h2}>{renderDifficulty(section)}</span>
            </Col>
          </Row>
          <Row>
            <Col>
              <b>Drop</b>
            </Col>
            <Col>{`${section.drop} m`}</Col>
            <Col>
              <b>Length</b>
            </Col>
            <Col>{`${section.distance} km`}</Col>
            <Col>
              <b>Duration</b>
            </Col>
            <Col>{section.duration && Durations.get(section.duration)}</Col>
          </Row>
          <Row>
            <Title>Season</Title>
            <Col>
              <div>{section.season}</div>
              <div>{stringifySeason(section.seasonNumeric)}</div>
            </Col>
          </Row>
          <RaisedButton
            fullWidth
            primary
            label="More"
            onClick={this.onDetails}
          />
        </Container>
      </InfoWindow>
    );
  }
}

const SelectedSectionWeb: React.ComponentType<
  MapElement & SelectedSectionViewProps
> = withRouter(SelectedSectionWebInner);

export default SelectedSectionWeb;
