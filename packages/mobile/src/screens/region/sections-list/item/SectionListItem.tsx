import { Coordinate, Section } from '@whitewater-guide/commons';
import React from 'react';
import { WithTranslation } from 'react-i18next';
import { Animated, StyleSheet, View } from 'react-native';
import Interactable from 'react-native-interactable';
import { NavigateButton } from '../../../../components';
import theme from '../../../../theme';
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

interface OwnProps {
  hasPremiumAccess: boolean;
  index: number;
  swipedIndex: number;
  section: Section;
  onPress: (section: Section) => void;
  onMaximize?: (index: number) => void;
  canNavigate: (coordinates: Coordinate) => boolean;
}

type Props = OwnProps & Pick<WithTranslation, 't'>;

export class SectionListItem extends React.Component<Props> {
  _deltaX: Animated.Value = new Animated.Value(0);
  _interactable: any = null;

  shouldComponentUpdate(next: Readonly<Props>): boolean {
    const props = this.props;
    return (
      props.index !== next.index ||
      props.section.id !== next.section.id ||
      props.hasPremiumAccess !== next.hasPremiumAccess ||
      (props.index === props.swipedIndex &&
        props.swipedIndex !== next.swipedIndex)
    );
  }

  componentDidUpdate(prevProps: Props) {
    const { index, swipedIndex } = this.props;
    if (
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
  };

  onPress = () => this.props.onPress(this.props.section);

  onNavigate = () => {
    if (this._interactable) {
      this._interactable.snapTo({ index: 0 });
    }
  };

  onSnap = ({ nativeEvent: { index } }: any) => {
    const { onMaximize, index: itemIndex } = this.props;
    if (index === 1 && onMaximize) {
      onMaximize(itemIndex);
    }
  };

  render() {
    const { section, hasPremiumAccess, t, canNavigate } = this.props;
    const name = section.river.name + ' - ' + section.name;
    return (
      <View style={styles.background}>
        <View style={styles.buttonsWrapper}>
          <NavigateButton
            label={t('commons:putIn')}
            coordinateLabel={`${name}: ${t('commons:putIn')}`}
            driver={this._deltaX}
            inputRange={[-136, -72]}
            canNavigate={canNavigate}
            coordinates={this.props.section.putIn.coordinates}
            onPress={this.onNavigate}
          />
          <NavigateButton
            coordinateLabel={`${name}: ${t('commons:takeOut')}`}
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
          horizontalOnly={true}
          animatedNativeDriver={true}
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
            />
          </View>
        </Interactable.View>
      </View>
    );
  }
}
