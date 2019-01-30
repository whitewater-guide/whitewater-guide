import React from 'react';
import { Animated, InteractionManager, StyleSheet, View } from 'react-native';
import Interactable from 'react-native-interactable';
import { NavigateButton } from '../../../../components';
import { WithTrans } from '../../../../i18n';
import theme from '../../../../theme';
import { Coordinate, Section } from '@whitewater-guide/commons';
import SectionListBody, { ITEM_HEIGHT } from './SectionListBody';

export { ITEM_HEIGHT } from './SectionListBody';

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
    backgroundColor: theme.colors.primary,
  },
  bodyWrapper: {
    left: 0,
    right: 0,
    height: ITEM_HEIGHT,
    backgroundColor: theme.colors.textLight,
  },
});

const BOUNDS = { left: -136, right: 30, bounce: 0.5 };

interface Props extends WithTrans {
  hasPremiumAccess: boolean;
  index: number;
  swipedIndex: number;
  section: Section;
  onPress: (section: Section) => void;
  onMaximize?: (index: number) => void;
  canNavigate: (coordinates: Coordinate) => boolean;
  shouldBounceOnMount: boolean;
}

export class SectionListItem extends React.PureComponent<Props> {
  _deltaX: Animated.Value = new Animated.Value(0);
  _interactable: any = null;
  _animatedBounce: boolean = false;

  componentDidMount() {
    this.animateInitialBounce();
  }

  componentDidUpdate(prevProps: Props) {
    const { shouldBounceOnMount, index, swipedIndex } = this.props;
    if (shouldBounceOnMount) {
      this.animateInitialBounce();
    } else if (
      this._interactable &&
      swipedIndex !== prevProps.swipedIndex &&
      index !== swipedIndex &&
      prevProps.swipedIndex !== -1
    ) {
      this._interactable.snapTo({ index: 0 });
    }
  }

  onInteractableMounted = (ref: any) => {
    this._interactable = ref;
    this.animateInitialBounce();
  };

  onPress = () => this.props.onPress(this.props.section);

  onNavigate = () => {
    if (this._interactable) {
      this._interactable.snapTo({ index: 0 });
    }
  };

  onSnap = ({ nativeEvent: { index } }: any) => {
    const { shouldBounceOnMount, onMaximize, index: itemIndex } = this.props;
    if (
      index === 1 &&
      onMaximize &&
      (this._animatedBounce || !shouldBounceOnMount)
    ) {
      onMaximize(itemIndex);
    }
  };

  animateInitialBounce = () => {
    if (
      this._interactable &&
      !this._animatedBounce &&
      this.props.shouldBounceOnMount
    ) {
      InteractionManager.runAfterInteractions(() => {
        setTimeout(() => {
          if (this._interactable) {
            this._interactable.snapTo({ index: 1 });
          }
          setTimeout(() => {
            if (this._interactable) {
              this._interactable.snapTo({ index: 0 });
              this._animatedBounce = true;
            }
          }, 700);
        }, 100);
      });
    }
  };

  render() {
    const { section, hasPremiumAccess, t, canNavigate } = this.props;
    return (
      <View style={styles.background}>
        <View style={styles.buttonsWrapper}>
          <NavigateButton
            label={t('commons:putIn')}
            driver={this._deltaX}
            inputRange={[-136, -72]}
            canNavigate={canNavigate}
            coordinates={this.props.section.putIn.coordinates}
            onPress={this.onNavigate}
          />
          <NavigateButton
            label={t('commons:takeOut')}
            driver={this._deltaX}
            inputRange={[-72, -8]}
            canNavigate={canNavigate}
            coordinates={this.props.section.takeOut.coordinates}
            onPress={this.onNavigate}
          />
        </View>
        <Interactable.View
          ref={this.onInteractableMounted}
          horizontalOnly
          animatedNativeDriver
          snapPoints={[
            { x: 0, damping: 0.6, tension: 300 },
            { x: -136, damping: 0.6, tension: 300 },
          ]}
          dragToss={0.01}
          boundaries={BOUNDS}
          animatedValueX={this._deltaX}
          onSnap={this.onSnap}
        >
          <View style={styles.bodyWrapper}>
            <SectionListBody
              hasPremiumAccess={hasPremiumAccess}
              section={section}
              onPress={this.onPress}
              t={t}
            />
          </View>
        </Interactable.View>
      </View>
    );
  }
}
