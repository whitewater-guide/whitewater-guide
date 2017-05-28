import React from 'react';
import PropTypes from 'prop-types';
import { Animated, Platform } from 'react-native';
import { connect } from 'react-redux';
import { TabBarBottom, TabBarTop } from 'react-navigation';
import { currentScreenSelector } from '../../utils';

const TabBarComponent = Platform.OS === 'ios' ? TabBarBottom : TabBarTop;

class RegionTabBar extends React.PureComponent {
  static propTypes = {
    hidden: PropTypes.bool.isRequired,
  };

  constructor(props) {
    super(props);
    this._hideAnimated = new Animated.Value(0);
  }

  componentWillUpdate(nextProps) {
    if (nextProps.hidden !== this.props.hidden) {
      Animated.timing(this._hideAnimated, { toValue: nextProps.hidden ? -49 : 0 }).start();
    }
  }

  render() {
    const { hidden, style, ...props } = this.props;
    const styles = [style, { marginTop: this._hideAnimated }];
    return (
      <TabBarComponent {...props} style={styles} />
    );
  }
}

export default connect(
  state => ({ hidden: currentScreenSelector(state).routeName === 'RegionMap' }),
)(RegionTabBar);
