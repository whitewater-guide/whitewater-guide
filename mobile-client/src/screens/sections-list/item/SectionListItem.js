import React from 'react';
import PropTypes from 'prop-types';
import { Animated, StyleSheet, View } from 'react-native';
import Interactable from 'react-native-interactable';
import { SectionPropType } from '../../../commons/features/sections';
import NavigateButton from './NavigateButton';
import SectionListBody, { ITEM_HEIGHT } from './SectionListBody';

const styles = StyleSheet.create({
  buttonsWrapper: {
    position: 'absolute',
    right: 0,
    height: ITEM_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 8,
  },
  background: {
    backgroundColor: '#c9c9c9',
  },
});

export default class SectionListItem extends React.PureComponent {
  static propTypes = {
    section: SectionPropType.isRequired,
    onPress: PropTypes.func,
    initialOffset: PropTypes.number,
  };

  static defaultProps = {
    onPress: () => {},
    initialOffset: 0,
  };

  constructor(props) {
    super(props);
    this._deltaX = new Animated.Value(props.initialOffset);
  }

  render() {
    return (
      <View style={styles.background}>
        <View style={styles.buttonsWrapper}>
          <NavigateButton
            label="Put-in"
            driver={this._deltaX}
            inputRange={[-136, -72]}
            coordinates={this.props.section.putIn.coordinates}
          />
          <NavigateButton
            label="Take out"
            driver={this._deltaX}
            inputRange={[-72, -8]}
            coordinates={this.props.section.takeOut.coordinates}
          />
        </View>
        <Interactable.View
          horizontalOnly
          snapPoints={[
            { x: 0, damping: 0.6, tension: 300 },
            { x: -136, damping: 0.6, tension: 300 },
          ]}
          dragToss={0.01}
          animatedValueX={this._deltaX}
          initialPosition={{ x: this.props.initialOffset }}
        >
          <View style={{ left: 0, right: 0, height: ITEM_HEIGHT, backgroundColor: 'white' }}>
            <SectionListBody section={this.props.section} onPress={this.props.onPress} />
          </View>
        </Interactable.View>

      </View>
    );
  }
}