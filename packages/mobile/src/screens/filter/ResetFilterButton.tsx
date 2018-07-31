import React from 'react';
import { withI18n, WithI18n } from 'react-i18next';
import { Button } from 'react-native-paper';
import { NavigationInjectedProps } from 'react-navigation';
import { compose } from 'recompose';
import theme from '../../theme';
import { consumeRegion, RegionContext } from '../../ww-clients/features/regions';

type Props = WithI18n & NavigationInjectedProps & Pick<RegionContext, 'resetSearchTerms'>;

class ResetFilterButton extends React.PureComponent<Props> {
  onPress = () => {
    this.props.resetSearchTerms();
    this.props.navigation.goBack(null);
  };

  render() {
    return (
      <Button compact color={theme.colors.textLight} onPress={this.onPress}>
        {this.props.t('filter:reset')}
      </Button>
    );
  }
}

export default compose<Props, NavigationInjectedProps>(
  withI18n(),
  consumeRegion(({ resetSearchTerms }) => ({ resetSearchTerms })),
)(ResetFilterButton);
