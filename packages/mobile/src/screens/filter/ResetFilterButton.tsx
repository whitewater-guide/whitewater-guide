import React from 'react';
import { translate } from 'react-i18next';
import { Button } from 'react-native-paper';
import { compose } from 'recompose';
import { NavigationInjectedProps } from '../../../typings/react-navigation';
import { WithT } from '../../i18n';
import theme from '../../theme';
import { consumeRegion, RegionContext } from '../../ww-clients/features/regions';

type Props = WithT & NavigationInjectedProps & Pick<RegionContext, 'resetSearchTerms'>;

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
  translate(),
  consumeRegion(({ resetSearchTerms }) => ({ resetSearchTerms })),
)(ResetFilterButton);