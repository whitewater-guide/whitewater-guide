import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { resetSearchTerms } from '../../commons/features/regions';
import theme from '../../theme';

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  label: {
    color: theme.colors.primary,
    fontSize: 14,
  },
});

class ResetFilterButton extends React.PureComponent {
  static propTypes = {
    resetSearchTerms: PropTypes.func.isRequired,
    regionId: PropTypes.string.isRequired,
  };

  onPress = () => {
    this.props.resetSearchTerms(this.props.regionId);
  };

  render() {
    return (
      <TouchableOpacity style={styles.button} onPress={this.onPress}>
        <Text style={styles.label}>Reset</Text>
      </TouchableOpacity>
    );
  }
}

export default connect(undefined, { resetSearchTerms })(ResetFilterButton);
