import PropTypes from 'prop-types';
import React from 'react';
import { Clipboard, Linking } from 'react-native';
import { Icon, Left, Right, ListItem, Text  } from '../../../components';
import { arrayToDMSString } from '../../../commons/utils/GeoUtils';

const CoordinatesInfo = ({ label, coordinates }) => {
  const prettyCoord = arrayToDMSString(coordinates);
  const copyHandler = () => Clipboard.setString(prettyCoord);
  const direcionsURL = `https://www.google.com/maps/dir/Current+Location/${coordinates[1]},${coordinates[0]}`;
  const directionsHandler = () => Linking.openURL(direcionsURL).catch(() => {});
  return (
    <ListItem>
      <Left>
        <Text>{label}</Text>
      </Left>
      <Right flexDirection="row">
        <Text note>{prettyCoord}</Text>
        <Icon icon="copy" onPress={copyHandler} />
        <Icon icon="car" onPress={directionsHandler} />
      </Right>
    </ListItem>
  );
};

CoordinatesInfo.propTypes = {
  label: PropTypes.string.isRequired,
  coordinates: PropTypes.arrayOf(PropTypes.number).isRequired,
};

export default CoordinatesInfo;
