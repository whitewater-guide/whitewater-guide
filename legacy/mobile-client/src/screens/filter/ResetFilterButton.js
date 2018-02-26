import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { Button } from '../../components';
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
      <Button link small padding={12} label="reset" onPress={this.onPress} />
    );
  }
}

export default connect(undefined, { resetSearchTerms })(ResetFilterButton);
