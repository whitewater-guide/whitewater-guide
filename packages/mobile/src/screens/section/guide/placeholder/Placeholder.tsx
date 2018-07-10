import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Caption } from 'react-native-paper';
import { WithT } from '../../../../i18n';
import { WithNode } from '../../../../ww-clients/apollo';
import { Region } from '../../../../ww-commons';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
  },
  premiumRoot: {
    height: 100,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

interface Props extends WithT {
  region: WithNode<Region>;
  buyRegion: (region: Region) => void;
}

class Placeholder extends React.PureComponent<Props> {
  onBuy = () => this.props.buyRegion(this.props.region.node);

  renderBuy = () => {
    const { t } = this.props;
    return (
      <View style={styles.premiumRoot}>
        <Caption>{t('iap:section.message')}</Caption>
        <Button raised primary onPress={this.onBuy}>
          {t('iap:section.button')}
        </Button>
      </View>
    );
  };

  renderNoData = () => {
    const { t } = this.props;
    return (
      <View style={styles.container}>
        <Caption>
          {t('section:guide.noData')}
        </Caption>
      </View>
    );
  };

  render() {
    const node = this.props.region.node;
    if (node.premium && !node.hasPremiumAccess) {
      return this.renderBuy();
    }
    return this.renderNoData();
  }
}

export default Placeholder;
