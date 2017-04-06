import React, { PropTypes } from 'react';
import { Clipboard, Linking, View } from 'react-native';
import { Button, Icon, Left, ListItem, Text } from 'native-base';
import { arrayToDMSString } from '../../../commons/utils/GeoUtils';

const CoordinatesInfo = ({ label, coordinates }) => {
  const prettyCoord = arrayToDMSString(coordinates);
  const copyHandler = () => Clipboard.setString(prettyCoord);
  const direcionsURL = `https://www.google.com/maps/dir/Current+Location/${coordinates[1]},${coordinates[0]}`;
  const directionsHandler = () => Linking.openURL(direcionsURL).catch(() => {});
  return (
    <ListItem>
      <Left><Text>{label}</Text></Left>
      <View style={{ paddingRight: 12 }}>
        <Text note>{prettyCoord}</Text>
      </View>
      <View style={{ flexDirection: 'row' }}>
        <Button transparent style={{ paddingLeft: 0, paddingRight: 4 }} onPress={copyHandler}>
          <Icon name="copy" style={{ color: 'black', fontSize: 21 }} />
        </Button>
        <Button transparent style={{ paddingLeft: 4, paddingRight: 0 }} onPress={directionsHandler}>
          <Icon name="navigate" style={{ color: 'black', fontSize: 21 }} />
        </Button>
      </View>
    </ListItem>
  );
};

CoordinatesInfo.propTypes = {
  label: PropTypes.string.isRequired,
  coordinates: PropTypes.arrayOf(PropTypes.number).isRequired,
};

export default CoordinatesInfo;
