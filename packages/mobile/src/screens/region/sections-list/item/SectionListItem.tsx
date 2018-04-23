import React from 'react';
import { Animated, InteractionManager, StyleSheet, View } from 'react-native';
import Interactable from 'react-native-interactable';
import { NavigateButton } from '../../../../components';
import { WithT } from '../../../../i18n';
import theme from '../../../../theme';
import { Section } from '../../../../ww-commons';
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
});

const BOUNDS = { left: -136, right: 30, bounce: 0.5 };

interface Props extends WithT {
  section: Section;
  onPress: (section: Section) => void;
  onMaximize?: () => void;
  shouldBounceOnMount: boolean;
}

export class SectionListItem extends React.PureComponent<Props> {

  _deltaX: Animated.Value = new Animated.Value(0);
  _interactable: any = null;
  _animatedBounce: boolean = false;

  componentDidMount() {
    this.animateInitialBounce();
  }

  componentDidUpdate() {
    if (this.props.shouldBounceOnMount) {
      this.animateInitialBounce();
    }
  }

  onInteractableMounted = (ref: any) => {
    this._interactable = ref;
    this.animateInitialBounce();
  };

  onPress = () => this.props.onPress(this.props.section);

  onSnap = ({ nativeEvent: { index } }) => {
    const { shouldBounceOnMount, onMaximize } = this.props;
    if (index === 1 && onMaximize && (this._animatedBounce || !shouldBounceOnMount)) {
      onMaximize();
    }
  };

  animateInitialBounce = () => {
    if (this._interactable && !this._animatedBounce && this.props.shouldBounceOnMount) {
      InteractionManager.runAfterInteractions(() => {
        setTimeout(
          () => {
            if (this._interactable) {
              this._interactable.snapTo({ index: 1 });
            }
            setTimeout(() => {
              if (this._interactable) {
                this._interactable.snapTo({ index: 0 });
                this._animatedBounce = true;
              }
            }, 700);
          },
          100,
        );
      });
    }
  };

  render() {
    const { section, t } = this.props;
    return (
      <View style={styles.background}>
        <View style={styles.buttonsWrapper}>
          <NavigateButton
            label={t('commons:putIn')}
            driver={this._deltaX}
            inputRange={[-136, -72]}
            coordinates={this.props.section.putIn.coordinates}
          />
          <NavigateButton
            label={t('commons:takeOut')}
            driver={this._deltaX}
            inputRange={[-72, -8]}
            coordinates={this.props.section.takeOut.coordinates}
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
          <View style={{ left: 0, right: 0, height: ITEM_HEIGHT, backgroundColor: 'white' }}>
            <SectionListBody section={section} onPress={this.onPress} t={t} />
          </View>
        </Interactable.View>

      </View>
    );
  }
}
