import React from 'react';
import PropTypes from 'prop-types';
import { Linking, StyleSheet, View } from 'react-native';
import { Text, Button, Icon } from 'native-base';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import StarRating from 'react-native-star-rating';
import { SectionPropType } from '../../../commons/features/sections';
import { renderDifficulty } from '../../../commons/utils/TextUtils';

const styles = StyleSheet.create({
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

const SelectedSectionView = ({ selectedSection, onSectionSelected, dispatch }) => {
  if (!selectedSection) {
    return null;
  }
  const { putIn: { coordinates: [pLng, pLat] }, takeOut: { coordinates: [tLng, tLat] } } = selectedSection;
  const putInHandler = () => Linking.openURL(`https://www.google.com/maps/dir/Current+Location/${pLat},${pLng}`)
    .catch(() => {
    });
  const takeOutHandler = () => Linking.openURL(`https://www.google.com/maps/dir/Current+Location/${tLat},${tLng}`)
    .catch(() => {
    });
  const deselect = () => onSectionSelected(null);
  const detailsHandler = () => {
    dispatch(NavigationActions.navigate({
      routeName: 'SectionDetails',
      params: { sectionId: selectedSection._id },
    }));
  };
  return (
    <View>
      <View style={styles.titleWrapper}>
        <Text>{`${selectedSection.river.name} - ${selectedSection.name}`}</Text>
      </View>
      <View style={styles.attributesRow}>
        <Text note>Class</Text>
        <Text note>{renderDifficulty(selectedSection)}</Text>
        <Text note>Rating</Text>
        <StarRating disabled rating={selectedSection.rating} starSize={14} starColor={'#a7a7a7'} />
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
      <Button full onPress={detailsHandler}>
        <Text>Details</Text>
      </Button>
      <View style={styles.closeButtonWrapper}>
        <Button transparent style={{ padding: 0, margin: 0 }} onPress={deselect}>
          <Icon primary name="close" style={{ fontSize: 24 }} />
        </Button>
      </View>
    </View>
  );
};

SelectedSectionView.propTypes = {
  selectedSection: SectionPropType,
  onSectionSelected: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
};

SelectedSectionView.defaultProps = {
  selectedSection: null,
};

export default connect()(SelectedSectionView);
