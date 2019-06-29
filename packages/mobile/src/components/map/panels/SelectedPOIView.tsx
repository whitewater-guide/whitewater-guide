import {
  MapSelection,
  withMapSelection,
  withRegion,
  WithRegion,
} from '@whitewater-guide/clients';
import { Coordinate, isPoint, Point } from '@whitewater-guide/commons';
import get from 'lodash/get';
import noop from 'lodash/noop';
import React from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Caption, Paragraph } from 'react-native-paper';
import { compose, pure } from 'recompose';
import {
  connectPremiumDialog,
  WithPremiumDialog,
} from '../../../features/purchases';
import theme from '../../../theme';
import SelectedElementView from './SelectedElementView';

const styles = StyleSheet.create({
  header: {
    flex: 1,
    padding: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.border,
  },
  body: {
    maxHeight: theme.screenHeight / 2,
  },
  bodyContent: {
    padding: 8,
  },
});

type Props = WithTranslation & WithRegion & WithPremiumDialog & MapSelection;

interface State {
  poi: Point | null;
}

class SelectedPOIViewInternal extends React.Component<Props, State> {
  readonly state: State = { poi: null };

  static getDerivedStateFromProps(props: Props, prevState: State): State {
    if (isPoint(props.selection)) {
      return { poi: props.selection };
    }
    return prevState;
  }

  shouldComponentUpdate(nextProps: Props) {
    const oldId = this.props.selection && this.props.selection.id;
    const newId = nextProps.selection && nextProps.selection.id;
    return oldId !== newId;
  }

  renderHeader = () => (
    <View style={styles.header}>
      <Paragraph>{get(this.state.poi, 'name', ' ')}</Paragraph>
      <Caption>
        {this.props.t('poiTypes:' + get(this.state.poi, 'kind', 'other'))}
      </Caption>
    </View>
  );

  canNavigate = () => {
    const { buyRegion, region, canMakePayments } = this.props;
    const result =
      !canMakePayments ||
      !region.node ||
      !region.node.premium ||
      region.node.hasPremiumAccess;
    if (!result) {
      buyRegion(region.node!);
    }
    return result;
  };

  render() {
    const { t, selection } = this.props;
    const { poi } = this.state;
    const buttons = [
      {
        label: t('commons:navigate') as string,
        coordinates: get(poi, 'coordinates', [0, 0]) as Coordinate,
        canNavigate: this.canNavigate,
      },
    ];
    return (
      <SelectedElementView
        renderHeader={this.renderHeader}
        buttons={buttons}
        selected={isPoint(selection)}
        onSectionSelected={noop}
        onPOISelected={noop}
      >
        <ScrollView
          contentContainerStyle={styles.bodyContent}
          style={styles.body}
        >
          <Paragraph>{get(poi, 'description', ' ')}</Paragraph>
        </ScrollView>
      </SelectedElementView>
    );
  }
}

export const SelectedPOIView = compose<Props, {}>(
  pure,
  withMapSelection,
  withTranslation(),
  withRegion,
  connectPremiumDialog,
)(SelectedPOIViewInternal);
