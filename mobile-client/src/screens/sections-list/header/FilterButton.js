import React from 'react';
import PropTypes from 'prop-types';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import { isEqual, merge, omit } from 'lodash';
import { compose } from 'recompose';
import { Icon } from '../../../components';
import { GuideOverlay, DefaultOverlay } from '../../../guide';
import { defaultSectionSearchTerms } from '../../../commons/domain';
import { tagsToSelections, withTags } from '../../../commons/features/tags';
import { searchTermsSelector, updateSearchTerms } from '../../../commons/features/regions';

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
    const icon = this.props.hasFilters ? 'ios-funnel' : 'ios-funnel-outline';
    const overlay = <DefaultOverlay />;
    return (
      <GuideOverlay step={2} background={overlay}>
        <Icon
          primary
          wide
          icon={icon}
          onPress={this.onPress}
          onLongPress={this.onLongPress}
        />
      </GuideOverlay>
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
    { navigate: NavigationActions.navigate, updateSearchTerms },
  ),
)(FilterButton);
