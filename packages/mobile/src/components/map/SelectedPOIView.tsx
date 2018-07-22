import get from 'lodash/get';
import noop from 'lodash/noop';
import React from 'react';
import { translate } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Caption, Paragraph } from 'react-native-paper';
import { compose } from 'recompose';
import { connectPremiumDialog, WithPremiumDialog } from '../../features/purchases';
import { WithT } from '../../i18n';
import theme from '../../theme';
import { SelectedPOIViewProps } from '../../ww-clients/features/maps';
import { consumeRegion, WithRegion } from '../../ww-clients/features/regions';
import { Coordinate } from '../../ww-commons';
import SelectedElementView from './SelectedElementView';

const styles = StyleSheet.create({
  header: {
    flex: 1,
    padding: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.border,
  },
  body: {
    padding: 8,
  },
});

type Props = SelectedPOIViewProps & WithT & WithRegion & WithPremiumDialog;

class SelectedPOIViewInternal extends React.Component<Props> {

  shouldComponentUpdate(nextProps: Props) {
    const oldId = this.props.selectedPOI && this.props.selectedPOI.id;
    const newId = nextProps.selectedPOI && nextProps.selectedPOI.id;
    return oldId !== newId;
  }

  renderHeader = () => (
    <View style={styles.header}>
      <Paragraph>{get(this.props.selectedPOI, 'name', ' ')}</Paragraph>
      <Caption>{this.props.t('poiTypes:' + get(this.props.selectedPOI, 'kind', 'other'))}</Caption>
    </View>
  );

  canNavigate = () => {
    const { buyRegion, region, canMakePayments } = this.props;
    const result = !canMakePayments || !region.node || !region.node.premium || region.node.hasPremiumAccess;
    if (!result) {
      buyRegion(region.node!);
    }
    return result;
  };

  render() {
    const buttons = [{
      label: this.props.t('commons:navigate'),
      coordinates: get(this.props.selectedPOI, 'coordinates', [0, 0]) as Coordinate,
      canNavigate: this.canNavigate,
    }];
    return (
      <SelectedElementView
        renderHeader={this.renderHeader}
        buttons={buttons}
        selected={!!this.props.selectedPOI}
        onSectionSelected={noop}
        onPOISelected={noop}
      >
        <View style={styles.body}>
          <Paragraph>{get(this.props.selectedPOI, 'description', ' ')}</Paragraph>
        </View>
      </SelectedElementView>
    );
  }
}

export const SelectedPOIView: React.ComponentType<SelectedPOIViewProps> = compose<Props, SelectedPOIViewProps>(
  translate(),
  consumeRegion(),
  connectPremiumDialog,
)(SelectedPOIViewInternal);
