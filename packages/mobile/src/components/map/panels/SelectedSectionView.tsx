import {
  MapSelection,
  withMapSelection,
  WithRegion,
  withRegion,
} from '@whitewater-guide/clients';
import { isSection, Section } from '@whitewater-guide/commons';
import React from 'react';
import Animated from 'react-native-reanimated';
import { compose, pure } from 'recompose';
import {
  connectPremiumDialog,
  WithPremiumDialog,
} from '../../../features/purchases';
import theme from '../../../theme';
import { NAVIGATE_BUTTON_HEIGHT, NavigateButton } from '../../NavigateButton';
import {
  SECTION_DETAILS_BUTTON_HEIGHT,
  SectionDetailsButton,
} from './SectionDetailsButton';
import { FLOWS_ROW_HEIGHT } from './SectionFlowsRow';
import SelectedElementView from './SelectedElementView';
import SelectedSectionHeader from './SelectedSectionHeader';
import SelectedSectionTable from './SelectedSectionTable';

const SNAP_POINTS: [number, number, number] = [
  NAVIGATE_BUTTON_HEIGHT +
    theme.rowHeight * 2 +
    FLOWS_ROW_HEIGHT +
    SECTION_DETAILS_BUTTON_HEIGHT,
  NAVIGATE_BUTTON_HEIGHT,
  0,
];

type Props = WithRegion & WithPremiumDialog & MapSelection;

interface State {
  section: Section | null;
}

class SelectedSectionViewInternal extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      section: isSection(props.selection) ? props.selection : null,
    };
  }

  static getDerivedStateFromProps(nextProps: Props, prevState: State): State {
    // Keep section as state to prevent flash of empty content before panel hides
    if (isSection(nextProps.selection)) {
      return { ...prevState, section: nextProps.selection };
    }
    return prevState;
  }

  canNavigate = () => {
    const { region, buyRegion, canMakePayments } = this.props;
    const { section } = this.state;
    const result =
      !canMakePayments ||
      (section && section.demo) ||
      !region.node ||
      !region.node.premium ||
      region.node.hasPremiumAccess;
    if (!result) {
      buyRegion(region.node!);
    }
    return result;
  };

  renderContent = () => {
    const { section } = this.state;
    return (
      <React.Fragment>
        <SelectedSectionTable section={section} />
        <SectionDetailsButton sectionId={section && section.id} />
      </React.Fragment>
    );
  };

  renderHeader = () => {
    const { region } = this.props;
    const { section } = this.state;
    return <SelectedSectionHeader section={section} region={region} />;
  };

  renderButtons = (scale?: Animated.Node<number>) => {
    const { section } = this.state;
    return (
      <React.Fragment>
        <NavigateButton
          labelKey="commons:putIn"
          point={section ? section.putIn : null}
          canNavigate={this.canNavigate}
          scale={scale}
        />
        <NavigateButton
          point={section ? section.takeOut : null}
          labelKey="commons:takeOut"
          canNavigate={this.canNavigate}
          scale={scale}
        />
      </React.Fragment>
    );
  };

  render() {
    const { selection, onSelected } = this.props;
    const section = isSection(selection) ? selection : null;
    return (
      <SelectedElementView
        snapPoints={SNAP_POINTS}
        renderHeader={this.renderHeader}
        renderButtons={this.renderButtons}
        renderContent={this.renderContent}
        selection={section}
        onSelected={onSelected}
      />
    );
  }
}

export const SelectedSectionView = compose<Props, {}>(
  pure,
  withMapSelection,
  withRegion,
  connectPremiumDialog,
)(SelectedSectionViewInternal);
