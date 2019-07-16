import {
  MapSelection,
  withMapSelection,
  WithRegion,
  withRegion,
} from '@whitewater-guide/clients';
import { isPoint, Point } from '@whitewater-guide/commons';
import get from 'lodash/get';
import React from 'react';
import { StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Paragraph } from 'react-native-paper';
import Animated from 'react-native-reanimated';
import { compose, pure } from 'recompose';
import {
  connectPremiumDialog,
  WithPremiumDialog,
} from '../../../features/purchases';
import theme from '../../../theme';
import { NAVIGATE_BUTTON_HEIGHT, NavigateButton } from '../../NavigateButton';
import SelectedElementView from './SelectedElementView';
import SelectedPOIHeader from './SelectedPOIHeader';

const styles = StyleSheet.create({
  scroll: {
    backgroundColor: theme.colors.primaryBackground,
    height: theme.rowHeight * 3,
  },
  scrollContent: {
    padding: theme.margin.single,
  },
});

const SNAP_POINTS: [number, number, number] = [
  NAVIGATE_BUTTON_HEIGHT + theme.rowHeight * 3,
  NAVIGATE_BUTTON_HEIGHT,
  0,
];

type Props = WithRegion & WithPremiumDialog & MapSelection;

interface State {
  poi: Point | null;
}

class SelectedPOIViewInternal extends React.PureComponent<Props, State> {
  private _scroll = React.createRef<ScrollView>();

  constructor(props: Props) {
    super(props);
    this.state = {
      poi: isPoint(props.selection) ? props.selection : null,
    };
  }

  static getDerivedStateFromProps(nextProps: Props, prevState: State): State {
    // Keep poi as state to prevent flash of empty content before panel hides
    if (isPoint(nextProps.selection)) {
      return {
        poi: nextProps.selection,
      };
    }
    return prevState;
  }

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

  renderContent = () => {
    const { poi } = this.state;
    return (
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        ref={this._scroll}
        bounces={false}
      >
        <Paragraph>{get(poi, 'description', ' ')}</Paragraph>
      </ScrollView>
    );
  };

  renderHeader = () => {
    const { poi } = this.state;
    return <SelectedPOIHeader poi={poi} />;
  };

  renderButtons = (scale?: Animated.Node<number>) => {
    const { poi } = this.state;
    return (
      <NavigateButton
        labelKey="commons:navigate"
        point={poi}
        canNavigate={this.canNavigate}
        scale={scale}
      />
    );
  };

  render() {
    const { selection, onSelected } = this.props;
    const poi = isPoint(selection) ? selection : null;
    return (
      <SelectedElementView
        snapPoints={SNAP_POINTS}
        renderHeader={this.renderHeader}
        renderButtons={this.renderButtons}
        renderContent={this.renderContent}
        selection={poi}
        onSelected={onSelected}
        simultaneousHandlers={this._scroll}
      />
    );
  }
}

export const SelectedPOIView = compose<Props, {}>(
  pure,
  withMapSelection,
  withRegion,
  connectPremiumDialog,
)(SelectedPOIViewInternal);
