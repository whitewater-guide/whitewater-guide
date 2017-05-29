import React from 'react';
import PropTypes from 'prop-types';
import { Animated, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { TabBarTop } from 'react-navigation';
import { settingsSelector } from '../../commons/features/regions';
import { withFeatureIds } from '../../commons/core';
import { NAVIGATE_BUTTON_HEIGHT } from '../../components';

const styles = StyleSheet.create({
  tabBarHeightStyle: {
    height: NAVIGATE_BUTTON_HEIGHT,
  },
});

class RegionTabBar extends React.PureComponent {
  static propTypes = {
    hidden: PropTypes.bool.isRequired,
    style: PropTypes.any,
  };

  constructor(props) {
    super(props);
    this._hideAnimated = new Animated.Value(0);
  }

  componentDidMount() {
    this.animateToPosition(this.props.hidden);
  }

  componentWillUpdate(nextProps) {
    if (nextProps.hidden !== this.props.hidden) {
      this.animateToPosition(nextProps.hidden);
    }
  }

  animateToPosition = (hidden) => {
    Animated.timing(
      this._hideAnimated,
      { toValue: hidden ? -NAVIGATE_BUTTON_HEIGHT : 0, useNativeDriver: false },
    ).start();
  };

  render() {
    const { style, ...props } = this.props;
    const barStyles = [style, styles.tabBarHeightStyle, { marginBottom: this._hideAnimated }];
    return (
      <TabBarTop {...props} style={barStyles} />
    );
  }
}

export default compose(
  withFeatureIds('region'),
  connect(
    (state, props) => {
      const settings = settingsSelector(state, props);
      return {
        hidden: !!(settings.selectedSectionId || settings.selectedPOIId),
      };
    },
  ),
)(RegionTabBar);
