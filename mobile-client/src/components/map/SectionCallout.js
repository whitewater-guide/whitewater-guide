import React from 'react';
import PropTypes from 'prop-types';
import { Dimensions, Linking, StyleSheet, View } from 'react-native';
import { Text, Button, Icon } from 'native-base';
import StarRating from 'react-native-star-rating';
import { SectionPropType } from '../../commons/features/sections';
import { renderDifficulty } from '../../commons/utils/TextUtils';

const dimensions = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    maxWidth: Math.round(dimensions.width * 0.66),
  },
  titleWrapper: {
    marginTop: 8,
    marginHorizontal: 8,
  },
  attributesRow: {
    marginHorizontal: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#a7a7a7',
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
    marginBottom: 16,
  },
  closeButtonWrapper: {
    position: 'absolute',
    top: -8,
    right: -16,
  },
});

const SectionCallout = ({ section, onClose, onDetails }) => {
  const { putIn: { coordinates: [pLng, pLat] }, takeOut: { coordinates: [tLng, tLat] } } = section;
  const putInHandler = () => Linking.openURL(`https://www.google.com/maps/dir/Current+Location/${pLat},${pLng}`)
    .catch(() => {
    });
  const takeOutHandler = () => Linking.openURL(`https://www.google.com/maps/dir/Current+Location/${tLat},${tLng}`)
    .catch(() => {
    });
  return (
    <View style={styles.container}>
      <View style={styles.titleWrapper}>
        <Text>{`${section.river.name} - ${section.name}`}</Text>
      </View>
      <View style={styles.attributesRow}>
        <Text note>Class</Text>
        <Text note>{renderDifficulty(section)}</Text>
        <Text note>Rating</Text>
        <StarRating disabled rating={section.rating} starSize={14} starColor={'#a7a7a7'} />
      </View>
      <View style={styles.buttonsRow}>
        <Button small primary onPress={putInHandler}>
          <Icon name="car" style={{ fontSize: 24, color: 'white' }} />
          <Text>Put-in</Text>
        </Button>
        <Button small primary onPress={takeOutHandler}>
          <Icon name="car" style={{ fontSize: 24, color: 'white' }} />
          <Text>Take-out</Text>
        </Button>
      </View>
      <Button full onPress={onDetails}>
        <Text>Details</Text>
      </Button>
      <View style={styles.closeButtonWrapper}>
        <Button transparent style={{ padding: 0, margin: 0 }} onPress={onClose}>
          <Icon primary name="close" style={{ fontSize: 24 }} />
        </Button>
      </View>
    </View>
  );
};

SectionCallout.propTypes = {
  section: SectionPropType.isRequired,
  onClose: PropTypes.func.isRequired,
  onDetails: PropTypes.func.isRequired,
};

export default SectionCallout;
