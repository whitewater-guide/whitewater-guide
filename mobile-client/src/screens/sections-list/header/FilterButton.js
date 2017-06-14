import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import { isEqual, merge, omit } from 'lodash';
import { compose } from 'recompose';
import Icon from 'react-native-vector-icons/Ionicons';
import theme from '../../../theme';
import { defaultSectionSearchTerms } from '../../../commons/domain';
import { tagsToSelections, withTags } from '../../../commons/features/tags';
import { updateSearchTerms, searchTermsSelector } from '../../../commons/features/regions';

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

  render() {
    const iconName = this.props.hasFilters ? 'ios-funnel' : 'ios-funnel-outline';
    return (
      <TouchableOpacity style={styles.button} onPress={this.onPress} onLongPress={this.onLongPress} >
        <Icon name={iconName} size={24} color={theme.colors.primary} />
      </TouchableOpacity>
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
    { ...NavigationActions, updateSearchTerms },
  ),
)(FilterButton);
