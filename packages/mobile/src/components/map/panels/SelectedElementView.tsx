import { StyleSheet, View } from 'react-native';

import Animated from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet';
import { MapSelection } from '@whitewater-guide/clients';
import React from 'react';
import { SnapPoints } from './types';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import getSnapPoints from './getSnapPoints';
import theme from '~/theme';

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    backgroundColor: theme.colors.primaryBackground,
  },
  headerTouchable: {
    flex: 1,
  },
});

// Value to compensate springiness when detecting open/closed state
const HIDE_THRESHOLD_OVERSHOOT = 10;

const {
  Value,
  Extrapolate,
  call,
  greaterOrEq,
  color,
  interpolate,
  onChange,
} = Animated;

interface Props extends MapSelection {
  snapPoints: SnapPoints;
  renderHeader: () => React.ReactNode;
  renderButtons: (scale?: Animated.Node<number>) => React.ReactNode;
  renderContent: () => React.ReactNode;
  innerGestureHandlerRefs?: React.ComponentProps<
    typeof BottomSheet
  >['innerGestureHandlerRefs'];
  simultaneousHandlers?: React.ComponentProps<
    typeof BottomSheet
  >['simultaneousHandlers'];
}

class SelectedElementView extends React.PureComponent<Props> {
  private readonly _sheet = React.createRef<BottomSheet>();
  private readonly _headerPosition: Animated.Value<number>;
  private readonly _overlayBackground: Animated.Node<number>;
  private readonly _watchHide: Animated.Node<number>;
  private readonly _buttonsScale: Animated.Node<number>;

  constructor(props: Props) {
    super(props);
    const snapPoints = getSnapPoints(props.snapPoints);
    this._headerPosition = new Value(
      snapPoints[0] - snapPoints[1] + HIDE_THRESHOLD_OVERSHOOT,
    );
    this._overlayBackground = color(
      0,
      0,
      0,
      interpolate(this._headerPosition, {
        inputRange: [0, snapPoints[0] - snapPoints[1]],
        outputRange: [0.5, 0.0],
        extrapolate: Extrapolate.CLAMP,
      }),
    );
    const hideThreshold = greaterOrEq(
      this._headerPosition,
      snapPoints[0] - snapPoints[1] + HIDE_THRESHOLD_OVERSHOOT,
    );
    this._watchHide = onChange(
      hideThreshold,
      call([hideThreshold], this.onHide),
    );
    this._buttonsScale = interpolate(this._headerPosition, {
      inputRange: [
        snapPoints[0] - snapPoints[1],
        snapPoints[0] - snapPoints[2],
      ],
      outputRange: [1.0, 0.0],
      extrapolate: Extrapolate.CLAMP,
    });
  }

  componentDidUpdate(prevProps: Props) {
    if (!this._sheet.current) {
      return;
    }
    if (!prevProps.selection && this.props.selection) {
      this._sheet.current.snapTo(1);
    }
    if (prevProps.selection && !this.props.selection) {
      this._sheet.current.snapTo(2);
    }
  }

  onHide = ([hidden]: any) => {
    if (hidden && !!this.props.selection) {
      this.props.onSelected(null);
    }
  };

  onMaximize = () => {
    if (this._sheet.current) {
      // this is workaround
      // https://github.com/osdnk/react-native-reanimated-bottom-sheet/issues/16#issuecomment-576467991
      this._sheet.current.snapTo(0);
      this._sheet.current.snapTo(0);
    }
  };

  renderHeader = () => {
    const { renderHeader, renderButtons } = this.props;
    return (
      <View style={styles.header}>
        <View style={styles.headerTouchable}>
          <TouchableWithoutFeedback onPress={this.onMaximize}>
            {renderHeader()}
          </TouchableWithoutFeedback>
        </View>
        {renderButtons(this._buttonsScale)}
      </View>
    );
  };

  render() {
    const {
      renderContent,
      innerGestureHandlerRefs,
      simultaneousHandlers,
    } = this.props;
    const snapPoints = getSnapPoints(this.props.snapPoints);
    // TODO: use custom bottom sheet because of Cancelled state hack
    // https://github.com/osdnk/react-native-reanimated-bottom-sheet/issues/69
    return (
      <React.Fragment>
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: this._overlayBackground,
            } as any,
          ]}
          pointerEvents="none"
        />
        <Animated.Code exec={this._watchHide} />
        <BottomSheet
          ref={this._sheet}
          initialSnap={2}
          snapPoints={snapPoints}
          renderContent={renderContent}
          renderHeader={this.renderHeader}
          headerPosition={this._headerPosition}
          innerGestureHandlerRefs={innerGestureHandlerRefs}
          simultaneousHandlers={simultaneousHandlers}
        />
      </React.Fragment>
    );
  }
}

export default SelectedElementView;
