import React from 'react';
import { Clipboard } from 'react-native';
import { Paragraph, Subheading } from 'react-native-paper';
import { Icon, Left, Right, Row } from '../../../components';
import { openGoogleMaps } from '../../../utils/maps';
import { arrayToDMSString } from '../../../ww-clients/utils';
import { Coordinate } from '../../../ww-commons';

interface Props {
  label: string;
  coordinates: Coordinate;
}

const CoordinatesInfo: React.StatelessComponent<Props> = ({ label, coordinates }) => {
  const prettyCoord = arrayToDMSString(coordinates);
  const copyHandler = () => Clipboard.setString(prettyCoord);
  const directionsHandler = () => openGoogleMaps(coordinates);
  return (
    <Row>
      <Left>
        <Subheading>{label}</Subheading>
      </Left>
      <Right flexDirection="row">
        <Paragraph>{prettyCoord}</Paragraph>
        <Icon icon="content-copy" onPress={copyHandler} />
        <Icon icon="car" onPress={directionsHandler} />
      </Right>
    </Row>
  );
};

export default CoordinatesInfo;
