import { Coordinate, Section } from '@whitewater-guide/commons';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Reanimated from 'react-native-reanimated';
import {
  NAVIGATE_BUTTON_HEIGHT,
  NAVIGATE_BUTTON_WIDTH,
  NavigateButton,
} from '../../../../components';
import theme from '../../../../theme';
import { runAnimation, SwipeableAnimation } from './animations';
import SectionListBody from './SectionListBody';

const styles = StyleSheet.create({
  container: {
    width: theme.screenWidth,
    height: NAVIGATE_BUTTON_HEIGHT,
    backgroundColor: theme.colors.primary,
  },
  right: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    height: NAVIGATE_BUTTON_HEIGHT,
    right: 0,
  },
});

interface Props {
  hasPremiumAccess: boolean;
  index: number;
  swipedIndex: number;
  section: Section;
  onPress: (section: Section) => void;
  onMaximize?: (index: number) => void;
  canNavigate: (coordinates: Coordinate) => boolean;
}

export class SectionListItem extends React.Component<Props> {
  private readonly _animation: SwipeableAnimation;
  private readonly _scalePI: Reanimated.Node<number>;
  private readonly _scaleTO: Reanimated.Node<number>;

  constructor(props: Props) {
    super(props);
    this._animation = runAnimation(-2 * NAVIGATE_BUTTON_WIDTH, this.onOpen);
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
      swipedIndex !== prevProps.swipedIndex &&
      index !== swipedIndex &&
      prevProps.swipedIndex !== -1
    ) {
      this._animation.close();
    }
  }

  onPress = () => this.props.onPress(this.props.section);

  onOpen = () => {
    const { onMaximize, index } = this.props;
    if (onMaximize) {
      onMaximize(index);
    }
  };

  render() {
    const { section, hasPremiumAccess, canNavigate } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.right}>
          <NavigateButton
            labelKey="commons:putIn"
            point={section.putIn}
            canNavigate={canNavigate}
            onPress={this._animation.close}
            scale={this._scalePI}
          />
          <NavigateButton
            labelKey="commons:takeOut"
            point={section.takeOut}
            canNavigate={canNavigate}
            onPress={this._animation.close}
            scale={this._scaleTO}
          />
        </View>
        <Reanimated.Code exec={this._animation.watchOnOpen} />
        <PanGestureHandler
          minDeltaX={5}
          onGestureEvent={this._animation.gestureHandler}
          onHandlerStateChange={this._animation.gestureHandler}
        >
          <Reanimated.View
            style={
              { transform: [{ translateX: this._animation.position }] } as any
            }
          >
            <SectionListBody
              hasPremiumAccess={hasPremiumAccess}
              section={section}
              onPress={this.onPress}
            />
          </Reanimated.View>
        </PanGestureHandler>
      </View>
    );
  }
}
