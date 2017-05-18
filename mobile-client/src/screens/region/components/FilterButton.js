import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import { isEqual, omit } from 'lodash';
import Icon from 'react-native-vector-icons/Ionicons';
import variables from '../../../theme/variables/platform';
import { currentSectionSearchTerms } from '../../../core/selectors';
import { defaultSectionSearchTerms } from '../../../commons/domain';

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
    hasFilters: PropTypes.bool.isRequired,
  };

  onPress = () => {
    this.props.navigate({ routeName: 'RegionStackFilter' });
  }

  render() {
    const iconName = this.props.hasFilters ? 'ios-funnel' : 'ios-funnel-outline';
    return (
      <TouchableOpacity style={styles.button} onPress={this.onPress}>
        <Icon name={iconName} size={20} color={variables.btnPrimaryBg} />
      </TouchableOpacity>
    );
  }
}

export default connect(
  state => ({
    hasFilters: !isEqual(
      omit(defaultSectionSearchTerms, ['searchString']),
      omit(currentSectionSearchTerms(state), ['regionId', 'searchString']),
    ),
  }),
  NavigationActions,
)(FilterButton);
