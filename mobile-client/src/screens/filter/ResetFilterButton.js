import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { resetSearchTerms } from '../../commons/features/regions';
import variables from '../../theme/variables/platform';

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  label: {
    color: variables.btnPrimaryBg,
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
