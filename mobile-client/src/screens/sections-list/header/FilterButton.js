import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import { isEqual, omit } from 'lodash';
import { compose } from 'recompose';
import Icon from 'react-native-vector-icons/Ionicons';
import variables from '../../../theme/variables/platform';
import { currentSectionSearchTerms } from '../../../core/selectors';
import { defaultSectionSearchTerms } from '../../../commons/domain';
import { tagsToSelections, withTags } from '../../../commons/features/tags';

const styles = StyleSheet.create({
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
  },
});

class FilterButton extends React.PureComponent {
  static propTypes = {
    navigate: PropTypes.func.isRequired,
    hasFilters: PropTypes.bool.isRequired,
    filterRouteName: PropTypes.string.isRequired,
  };

  onPress = () => {
    this.props.navigate({ routeName: this.props.filterRouteName });
  }

  render() {
    const iconName = this.props.hasFilters ? 'ios-funnel' : 'ios-funnel-outline';
    return (
      <TouchableOpacity style={styles.button} onPress={this.onPress}>
        <Icon name={iconName} size={24} color={variables.btnPrimaryBg} />
      </TouchableOpacity>
    );
  }
}

export default compose(
  withTags(),
  connect(
    (state, props) => ({
      hasFilters: !isEqual(
        omit({ ...tagsToSelections(props), ...defaultSectionSearchTerms }, ['searchString']),
        omit(currentSectionSearchTerms(state), ['regionId', 'searchString']),
      ),
    }),
    NavigationActions,
  ),
)(FilterButton);
