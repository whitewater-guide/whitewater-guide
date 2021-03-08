import { sectionHasChanged } from '@whitewater-guide/clients';
import { Section } from '@whitewater-guide/commons';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Reanimated from 'react-native-reanimated';

import {
  NAVIGATE_BUTTON_HEIGHT,
  NAVIGATE_BUTTON_WIDTH,
  NavigateButton,
} from '~/components/NavigateButton';
import theme from '~/theme';

import { ItemProps } from '../types';
import { runAnimation, SwipeableAnimation } from './animations';
import SectionListBody from './SectionListBody';

const styles = StyleSheet.create({
  container: {
    width: theme.screenWidth,
    height: NAVIGATE_BUTTON_HEIGHT,
    backgroundColor: theme.colors.lightBackground,
  },
  right: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    height: NAVIGATE_BUTTON_HEIGHT,
    backgroundColor: theme.colors.primary,
    right: 0,
  },
});

const activeOffsetX = [-15, 15];
const activeOffsetY = [-10000, 10000];
const failOffsetY = [-15, 15];

type Props = ItemProps<Section>;

export class SectionListItem extends React.Component<Props> {
  private readonly _animation: SwipeableAnimation;
  private readonly _scalePI: Reanimated.Node<number>;
  private readonly _scaleTO: Reanimated.Node<number>;
  private readonly _animationStyle: any;

  constructor(props: Props) {
    super(props);
    this._animation = runAnimation(-2 * NAVIGATE_BUTTON_WIDTH, this.onOpen);
    this._animationStyle = {
      transform: [{ translateX: this._animation.position }],
    };
    this._scaleTO = Reanimated.interpolate(this._animation.position, {
      inputRange: [-NAVIGATE_BUTTON_WIDTH, 0],
      outputRange: [1, 0],
      extrapolate: Reanimated.Extrapolate.CLAMP,
    });
    this._scalePI = Reanimated.interpolate(this._animation.position, {
      inputRange: [-2 * NAVIGATE_BUTTON_WIDTH, -NAVIGATE_BUTTON_WIDTH],
      outputRange: [1, 0],
      extrapolate: Reanimated.Extrapolate.CLAMP,
    });
  }

  shouldComponentUpdate(next: Readonly<Props>): boolean {
    const props = this.props;
    return (
      props.forceCloseCnt !== next.forceCloseCnt ||
      sectionHasChanged(props.item, next.item) ||
      props.hasPremiumAccess !== next.hasPremiumAccess ||
      (props.item.id === props.swipedId && props.swipedId !== next.swipedId)
    );
  }

  componentDidUpdate(prevProps: Props) {
    const { swipedId, item, forceCloseCnt } = this.props;
    if (
      forceCloseCnt !== prevProps.forceCloseCnt ||
      (swipedId !== prevProps.swipedId &&
        item.id !== swipedId &&
        prevProps.swipedId !== '')
    ) {
      this._animation.close();
    }
  }

  onPress = () => this.props.onPress(this.props.item);

  onOpen = () => {
    const { onMaximize, item } = this.props;
    if (onMaximize) {
      onMaximize(item.id);
    }
  };

  premiumGuard = () => {
    const { hasPremiumAccess, buyRegion } = this.props;
    this._animation.close();
    if (hasPremiumAccess) {
      return true;
    } else {
      buyRegion();
      return false;
    }
  };

  render() {
    const { item, regionPremium, testID } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.right}>
          <NavigateButton
            labelKey="commons:putIn"
            point={item.putIn}
            premiumGuard={this.premiumGuard}
            scale={this._scalePI}
          />
          <NavigateButton
            labelKey="commons:takeOut"
            point={item.takeOut}
            premiumGuard={this.premiumGuard}
            scale={this._scaleTO}
          />
        </View>
        <Reanimated.Code exec={this._animation.watchOnOpen} />
        <PanGestureHandler
          minDist={20}
          activeOffsetX={activeOffsetX}
          activeOffsetY={activeOffsetY}
          failOffsetY={failOffsetY}
          onGestureEvent={this._animation.gestureHandler}
          onHandlerStateChange={this._animation.gestureHandler}
        >
          <Reanimated.View style={this._animationStyle}>
            <SectionListBody
              regionPremium={regionPremium}
              section={item}
              onPress={this.onPress}
              testID={testID}
            />
          </Reanimated.View>
        </PanGestureHandler>
      </View>
    );
  }
}
