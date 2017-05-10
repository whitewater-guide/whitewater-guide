import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import variables from '../../../theme/variables/platform';

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
});

class FilterButton extends React.PureComponent {
  static propTypes = {
    navigate: PropTypes.func.isRequired,
  };

  onPress = () => {
    this.props.navigate({ routeName: 'RegionStackFilter' });
  }

  render() {
    return (
      <TouchableOpacity style={styles.button} onPress={this.onPress}>
        <Icon name="ios-funnel-outline" size={20} color={variables.btnPrimaryBg} />
      </TouchableOpacity>
    );
  }
}

export default connect(undefined, NavigationActions)(FilterButton);
