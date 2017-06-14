import PropTypes from 'prop-types';
import React from 'react';
import { Clipboard, Linking, StyleSheet } from 'react-native';
import { IonIcon, Left, Right, ListItem, Text  } from '../../../components';
import { arrayToDMSString } from '../../../commons/utils/GeoUtils';

const styles = StyleSheet.create({
  icon: {
    width: 32,
    height: 32,
  },
});

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
        <IonIcon icon="copy" onPress={copyHandler} size={21} style={styles.icon} />
        <IonIcon icon="car" onPress={directionsHandler} size={21} style={styles.icon} />
      </Right>
    </ListItem>
  );
};

CoordinatesInfo.propTypes = {
  label: PropTypes.string.isRequired,
  coordinates: PropTypes.arrayOf(PropTypes.number).isRequired,
};

export default CoordinatesInfo;
