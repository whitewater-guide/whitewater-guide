import React from 'react';
import PropTypes from 'prop-types';
import { Animated, Dimensions } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import { isEqual, merge, omit } from 'lodash';
import { compose } from 'recompose';
import { GuideStep, Icon } from '../../../components';
import { defaultSectionSearchTerms } from '../../../commons/domain';
import { tagsToSelections, withTags } from '../../../commons/features/tags';
import { updateSearchTerms, searchTermsSelector } from '../../../commons/features/regions';

const window = Dimensions.get('window');
// It has to fit in the window
const radius = Math.min(window.width, window.height) / 2 - 1;

class FilterButton extends React.PureComponent {
  static propTypes = {
    navigate: PropTypes.func.isRequired,
    hasFilters: PropTypes.bool.isRequired,
    defaultTerms: PropTypes.object.isRequired,
    filterRouteName: PropTypes.string.isRequired,
    updateSearchTerms: PropTypes.func.isRequired,
    regionId: PropTypes.string,
  };

  static defaultProps = {
    regionId: null,
  };

  onPress = () => {
    const { navigate, regionId, filterRouteName } = this.props;
    navigate({ routeName: filterRouteName, params: { regionId } });
  };

  onLongPress = () => {
    this.props.updateSearchTerms(this.props.regionId, this.props.defaultTerms);
  };

  renderGuideBackground = (animated, layout, completeGuideStep) => {
    const center = { x: layout.x + layout.width / 2, y: layout.y + layout.height / 2 };
    const circle = {
      position: 'absolute',
      top: center.y - radius,
      left: center.x - radius,
      width: 2 * radius,
      height: 2 * radius,
      borderRadius: radius,
      backgroundColor: '#000',
      transform: [{
        scale: animated.interpolate({ inputRange: [0, 1], outputRange: [0, 4], extrapolate: 'clamp' }),
      }],
      opacity: animated.interpolate({ inputRange: [0, 1], outputRange: [0, 0.3], extrapolate: 'clamp' }),
    };
    return (
      <Animated.View style={circle} pointerEvents="box-none" collapsable={false} />
    );
  };

  render() {
    const icon = this.props.hasFilters ? 'ios-funnel' : 'ios-funnel-outline';
    return (
      <GuideStep step={0} renderBackground={this.renderGuideBackground}>
        <Icon
          primary
          wide
          icon={icon}
          onPress={this.onPress}
          onLongPress={this.onLongPress}
        />
      </GuideStep>
    );
  }
}

export default compose(
  withTags(),
  connect(
    (state, props) => {
      const defaultTerms = { ...tagsToSelections(props), ...defaultSectionSearchTerms };
      const { searchTerms } = searchTermsSelector(state, props);
      const currentSearchTerms = merge({}, defaultTerms, searchTerms);// Keep default tags
      return {
        hasFilters: !isEqual(
          omit(defaultTerms, ['searchString']),
          omit(currentSearchTerms, ['searchString']),
        ),
        defaultTerms,
      };
    },
    { navigate: NavigationActions.navigate, updateSearchTerms },
  ),
)(FilterButton);
