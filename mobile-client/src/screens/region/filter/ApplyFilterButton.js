import React from 'react';
import PropTypes from 'prop-types';
import { Platform, StyleSheet, TouchableOpacity } from 'react-native';
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

class ApplyFilterButton extends React.PureComponent {
  static propTypes = {
    back: PropTypes.func.isRequired,
  };

  onPress = () => {
    this.props.back();
  }

  render() {
    return (
      <TouchableOpacity style={styles.button} onPress={this.onPress}>
        <Icon name={Platform.OS === 'ios' ? 'ios-checkmark' : 'md-checkmark'} size={20} color={variables.btnPrimaryBg} />
      </TouchableOpacity>
    );
  }
}

export default connect(undefined, NavigationActions)(ApplyFilterButton);
