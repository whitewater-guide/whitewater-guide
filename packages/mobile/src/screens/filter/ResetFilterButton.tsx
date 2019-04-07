import { consumeRegion, RegionContext } from '@whitewater-guide/clients';
import React from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Button } from 'react-native-paper';
import { NavigationSceneRendererProps } from 'react-navigation';
import { compose } from 'recompose';
import theme from '../../theme';

type Props = WithTranslation & {
  navigation: any;
} & Pick<RegionContext, 'resetSearchTerms'>;

class ResetFilterButton extends React.PureComponent<Props> {
  onPress = () => {
    this.props.resetSearchTerms();
    this.props.navigation.goBack(null);
  };

  render() {
    return (
      <Button
        compact={true}
        color={theme.colors.textLight}
        onPress={this.onPress}
      >
        {this.props.t('filter:reset')}
      </Button>
    );
  }
}

export default compose<Props, Pick<NavigationSceneRendererProps, 'navigation'>>(
  withTranslation(),
  consumeRegion(({ resetSearchTerms }) => ({ resetSearchTerms })),
)(ResetFilterButton);
