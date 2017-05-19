import React from 'react';
import PropTypes from 'prop-types';
import { Animated, InteractionManager, StyleSheet, View } from 'react-native';
import Interactable from 'react-native-interactable';
import { SectionPropType } from '../../../commons/features/sections';
import { NavigateButton } from '../../../components';
import SectionListBody, { ITEM_HEIGHT } from './SectionListBody';
import variables from '../../../theme/variables/platform';

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
    backgroundColor: variables.btnPrimaryBg,
  },
});

const BOUNDS = { left: -136, right: 30, bounce: 0.5 };

export default class SectionListItem extends React.PureComponent {
  static propTypes = {
    section: SectionPropType.isRequired,
    onPress: PropTypes.func,
    shouldBounceOnMount: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    onPress: () => {},
  };

  constructor(props) {
    super(props);
    this._deltaX = new Animated.Value(0);
    this._interactable = null;
    this._animatedBounce = false;
  }

  componentDidMount() {
    this.animateInitialBounce();
  }

  onInteractableMounted = (ref) => {
    this._interactable = ref;
    this.animateInitialBounce();
  };

  animateInitialBounce = () => {
    if (this._interactable && !this._animatedBounce && this.props.shouldBounceOnMount) {
      InteractionManager.runAfterInteractions(() => {
        this._animatedBounce = true;
        setTimeout(
          () => {
            if (this._interactable) {
              this._interactable.snapTo({ index: 1 });
            }
            setTimeout(() => {
              if (this._interactable) {
                this._interactable.snapTo({ index: 0 });
              }
            }, 100);
          },
          100,
        );
      });
    }
  };

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
            label="Take-out"
            driver={this._deltaX}
            inputRange={[-72, -8]}
            coordinates={this.props.section.takeOut.coordinates}
          />
        </View>
        <Interactable.View
          ref={this.onInteractableMounted}
          horizontalOnly
          snapPoints={[
            { x: 0, damping: 0.6, tension: 300 },
            { x: -136, damping: 0.6, tension: 300 },
          ]}
          dragToss={0.01}
          boundaries={BOUNDS}
          animatedValueX={this._deltaX}
        >
          <View style={{ left: 0, right: 0, height: ITEM_HEIGHT, backgroundColor: 'white' }}>
            <SectionListBody section={this.props.section} onPress={this.props.onPress} />
          </View>
        </Interactable.View>

      </View>
    );
  }
}
