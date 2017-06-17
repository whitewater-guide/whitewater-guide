/* eslint react/sort-comp: 0 */
import React from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import { StyleSheet, Dimensions, Animated, Easing, TouchableWithoutFeedback, View, Modal } from 'react-native';

const styles = StyleSheet.create({
  container: {
    opacity: 0,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    position: 'absolute',
    backgroundColor: 'transparent',
  },
  containerVisible: {
    opacity: 1,
  },
  background: {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  contentContainer: {
    flexDirection: 'column',
    position: 'absolute',
  },
  selectContainer: {
    backgroundColor: '#f2f2f2',
    position: 'absolute',
  },
  dropShadow: {
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 2,
    shadowOpacity: 0.8,
  },
  arrow: {
    position: 'absolute',
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
  },
});

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

function Point(x, y) {
  this.x = x;
  this.y = y;
}

function Size(width, height) {
  this.width = width;
  this.height = height;
}

const DEFAULT_ARROW_SIZE = new Size(16, 8);

const PLACEMENT_OPTIONS = {
  TOP: 'top',
  RIGHT: 'right',
  BOTTOM: 'bottom',
  LEFT: 'left',
  AUTO: 'auto',
};

function Rect(x, y, width, height) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
}

export default class Popover extends React.Component {
  static propTypes = {
    isVisible: PropTypes.bool,
    onClose: PropTypes.func,
    arrowSize: PropTypes.object,
    placement: PropTypes.oneOf(Object.values(PLACEMENT_OPTIONS)),
    layoutDirection: PropTypes.string,
    fromRect: PropTypes.object.isRequired,
    displayArea: PropTypes.object,
    backgroundStyle: PropTypes.any,
    arrowStyle: PropTypes.any,
    popoverStyle: PropTypes.any,
    contentStyle: PropTypes.any,
  };

  static defaultProps = {
    isVisible: false,
    onClose: () => {},
    displayArea: new Rect(10, 10, SCREEN_WIDTH - 20, SCREEN_HEIGHT - 20),
    arrowSize: DEFAULT_ARROW_SIZE,
    placement: PLACEMENT_OPTIONS.AUTO,
  };

  constructor(props) {
    super(props);
    this.state = {
      contentSize: {},
      anchorPoint: {},
      popoverOrigin: {},
      placement: PLACEMENT_OPTIONS.AUTO,
      visible: false,
      defaultAnimatedValues: {
        scale: new Animated.Value(0),
        translate: new Animated.ValueXY({ x: 0, y: 0 }),
        fade: new Animated.Value(0),
      },
    };
  }

  measureContent = ({ nativeEvent: { layout: { width, height } } }) => {
    if (width && height) {
      const contentSize = { width, height };
      const geom = this.computeGeometry({ contentSize });

      const isAwaitingShow = this.state.isAwaitingShow;

      // Debounce to prevent flickering when displaying a popover with content
      // that doesn't show immediately.
      this.updateState(({ ...geom, contentSize, isAwaitingShow: undefined }), () => {
        // Once state is set, call the showHandler so it can access all the geometry
        // from the state
        if (isAwaitingShow) {
          this._startAnimation({ show: true });
        }
      });
    }
  };

  updateState = (state, callback) => {
    if (!this._updateState) {
      this._updateState = debounce(this.setState, 100);
    }
    this._updateState(state, callback);
  };

  computeGeometry = ({ contentSize, placement }, fromRect, displayArea) => {
    placement = placement || this.props.placement;
    fromRect = fromRect || this.props.fromRect;
    displayArea = displayArea || this.props.displayArea;

    const arrowSize = this.getArrowSize(placement);

    const options = { displayArea, fromRect, arrowSize, contentSize };

    switch (placement) {
      case PLACEMENT_OPTIONS.TOP:
        return this.computeTopGeometry(options);
      case PLACEMENT_OPTIONS.BOTTOM:
        return this.computeBottomGeometry(options);
      case PLACEMENT_OPTIONS.LEFT:
        return this.computeLeftGeometry(options);
      case PLACEMENT_OPTIONS.RIGHT:
        return this.computeRightGeometry(options);
      default:
        return this.computeAutoGeometry(options);
    }
  };

  computeTopGeometry = ({ displayArea, fromRect, contentSize, arrowSize }) => {
    const popoverOrigin = new Point(
      Math.min(displayArea.x + displayArea.width - contentSize.width,
        Math.max(displayArea.x, fromRect.x + (fromRect.width - contentSize.width) / 2)),
      fromRect.y - contentSize.height - arrowSize.height);

    const anchorPoint = new Point(fromRect.x + fromRect.width / 2.0, fromRect.y);

    return {
      popoverOrigin,
      anchorPoint,
      placement: PLACEMENT_OPTIONS.TOP,
    };
  };

  computeBottomGeometry = ({ displayArea, fromRect, contentSize, arrowSize }) => {
    const popoverOrigin = new Point(
      Math.min(displayArea.x + displayArea.width - contentSize.width,
        Math.max(displayArea.x, fromRect.x + (fromRect.width - contentSize.width) / 2)),
      fromRect.y + fromRect.height + arrowSize.height);

    const anchorPoint = new Point(fromRect.x + fromRect.width / 2.0, fromRect.y + fromRect.height);

    return {
      popoverOrigin,
      anchorPoint,
      placement: PLACEMENT_OPTIONS.BOTTOM,
    };
  };

  computeLeftGeometry = ({ displayArea, fromRect, contentSize, arrowSize }) => {
    const popoverOrigin = new Point(fromRect.x - contentSize.width - arrowSize.width,
      Math.min(displayArea.y + displayArea.height - contentSize.height,
        Math.max(displayArea.y, fromRect.y + (fromRect.height - contentSize.height) / 2)));

    const anchorPoint = new Point(fromRect.x, fromRect.y + fromRect.height / 2.0);

    return {
      popoverOrigin,
      anchorPoint,
      placement: PLACEMENT_OPTIONS.LEFT,
    };
  };

  computeRightGeometry = ({ displayArea, fromRect, contentSize, arrowSize }) => {
    const popoverOrigin = new Point(fromRect.x + fromRect.width + arrowSize.width,
      Math.min(displayArea.y + displayArea.height - contentSize.height,
        Math.max(displayArea.y, fromRect.y + (fromRect.height - contentSize.height) / 2)));

    const anchorPoint = new Point(fromRect.x + fromRect.width, fromRect.y + fromRect.height / 2.0);

    return {
      popoverOrigin,
      anchorPoint,
      placement: PLACEMENT_OPTIONS.RIGHT,
    };
  };

  computeAutoGeometry = ({ displayArea, contentSize }) => {
    let geom;
    const placements = ['left', 'right', 'bottom', 'top'];
    for (let i = 0; i < 4; i += 1) {
      const placement = placements[i];
      geom = this.computeGeometry({ contentSize, placement });
      const { popoverOrigin } = geom;

      if (popoverOrigin.x >= displayArea.x
        && popoverOrigin.x <= displayArea.x + displayArea.width - contentSize.width
        && popoverOrigin.y >= displayArea.y
        && popoverOrigin.y <= displayArea.y + displayArea.height - contentSize.height) {
        break;
      }
    }
    return geom;
  };

  getArrowSize = (placement) => {
    const size = this.props.arrowSize;
    switch (placement) {
      case PLACEMENT_OPTIONS.LEFT:
      case PLACEMENT_OPTIONS.RIGHT:
        return new Size(size.height, size.width);
      default:
        return size;
    }
  };

  getArrowColorStyle = borderTopColor => ({ borderTopColor });

  getArrowRotation = (placement) => {
    switch (placement) {
      case PLACEMENT_OPTIONS.BOTTOM:
        return '180deg';
      case PLACEMENT_OPTIONS.LEFT:
        return '-90deg';
      case PLACEMENT_OPTIONS.RIGHT:
        return '90deg';
      default:
        return '0deg';
    }
  };

  getArrowDynamicStyle = () => {
    const { anchorPoint, popoverOrigin } = this.state;
    const arrowSize = this.props.arrowSize;

    // Create the arrow from a rectangle with the appropriate borderXWidth set
    // A rotation is then applied dependending on the placement
    // Also make it slightly bigger
    // to fix a visual artifact when the popover is animated with a scale
    const width = arrowSize.width + 2;
    const height = arrowSize.height * 2 + 2;

    return {
      left: anchorPoint.x - popoverOrigin.x - width / 2,
      top: anchorPoint.y - popoverOrigin.y - height / 2,
      width,
      height,
      borderTopWidth: height / 2,
      borderRightWidth: width / 2,
      borderBottomWidth: height / 2,
      borderLeftWidth: width / 2,
    };
  };

  getTranslateOrigin = () => {
    const { contentSize, popoverOrigin, anchorPoint } = this.state;
    const popoverCenter = new Point(popoverOrigin.x + contentSize.width / 2, popoverOrigin.y + contentSize.height / 2);
    return new Point(anchorPoint.x - popoverCenter.x, anchorPoint.y - popoverCenter.y);
  };

  componentWillReceiveProps(nextProps) {
    const willBeVisible = nextProps.isVisible;
    const { isVisible, fromRect, displayArea } = this.props;

    if (willBeVisible !== isVisible) {
      if (willBeVisible) {
        // We want to start the show animation only when contentSize is known
        // so that we can have some logic depending on the geometry
        this.setState({ contentSize: {}, isAwaitingShow: true, visible: true });
      } else {
        this._startAnimation({ show: false });
      }
    } else if (willBeVisible && ((fromRect !== undefined && JSON.stringify(nextProps.fromRect) !== JSON.stringify(fromRect)) || (displayArea !== undefined && JSON.stringify(nextProps.displayArea) !== JSON.stringify(displayArea)))) {
      const contentSize = this.state.contentSize;

      const geom = this.computeGeometry({ contentSize }, nextProps.fromRect, nextProps.displayArea);

      const isAwaitingShow = this.state.isAwaitingShow;
      this.setState({ ...geom, contentSize, isAwaitingShow: undefined }, () => {
        // Once state is set, call the showHandler so it can access all the geometry
        // from the state
        if (isAwaitingShow) {
          this._startAnimation({ show: true });
        }
      });
    }
  }

  _startAnimation = ({ show }) => {
    const animDuration = 300;
    const values = this.state.defaultAnimatedValues;
    const translateOrigin = this.getTranslateOrigin();

    if (show) {
      values.translate.setValue(translateOrigin);
    }

    const commonConfig = {
      duration: animDuration,
      easing: show ? Easing.out(Easing.back()) : Easing.inOut(Easing.quad),
      // useNativeDriver: true,
    };

    const doneCallback = show ? null : () => this.setState({ visible: false });

    Animated.parallel([
      Animated.timing(values.fade, {
        toValue: show ? 1 : 0,
        ...commonConfig,
      }),
      Animated.timing(values.translate, {
        toValue: show ? new Point(0, 0) : translateOrigin,
        ...commonConfig,
      }),
      Animated.timing(values.scale, {
        toValue: show ? 1 : 0,
        ...commonConfig,
      }),
    ]).start(doneCallback);
  };

  _getStyles = () => {
    const animatedValues = this.state.defaultAnimatedValues;

    return {
      background: [
        this.props.backgroundStyle,
        { opacity: animatedValues.fade },
      ],
      arrow: [
        this.props.arrowStyle,
        {
          transform: [
            {
              scale: animatedValues.scale,
            },
          ],
        },
      ],
      popover: this.props.popoverStyle,
      content: [
        this.props.contentStyle,
        {
          transform: [
            { translateX: animatedValues.translate.x },
            { translateY: animatedValues.translate.y },
            { scale: animatedValues.scale },
          ],
        },
      ],
    };
  };

  render() {
    const { popoverOrigin, placement } = this.state;
    const extendedStyles = this._getStyles();
    const contentContainerStyle = [styles.contentContainer, ...extendedStyles.content];
    const arrowColorStyle = this.getArrowColorStyle(StyleSheet.flatten(contentContainerStyle).backgroundColor);
    const arrowDynamicStyle = this.getArrowDynamicStyle();

    // Special case, force the arrow rotation even if it was overriden
    let arrowStyle = [styles.arrow, arrowDynamicStyle, arrowColorStyle, ...extendedStyles.arrow];
    const arrowTransform = (StyleSheet.flatten(arrowStyle).transform || []).slice(0);
    arrowTransform.unshift({ rotate: this.getArrowRotation(placement) });
    arrowStyle = [...arrowStyle, { transform: arrowTransform }];

    const contentSizeAvailable = this.state.contentSize.width;

    return (
      <Modal transparent hardwareAccelerated visible={this.state.visible} onRequestClose={this.props.onClose}>
        <View style={[styles.container, contentSizeAvailable && styles.containerVisible]} collapsible={false}>
          <TouchableWithoutFeedback onPress={this.props.onClose}>
            <Animated.View style={[styles.background, ...extendedStyles.background]} />
          </TouchableWithoutFeedback>
          <Animated.View style={[{ top: popoverOrigin.y, left: popoverOrigin.x }, extendedStyles.popover]}>
            <Animated.View onLayout={this.measureContent} style={contentContainerStyle}>
              {this.props.children}
            </Animated.View>
            <Animated.View style={arrowStyle} />
          </Animated.View>
        </View>
      </Modal>
    );
  }

}
