import {
  MapSelection,
  withMapSelection,
  withRegion,
  WithRegion,
} from '@whitewater-guide/clients';
import { isSection, Section } from '@whitewater-guide/commons';
import get from 'lodash/get';
import noop from 'lodash/noop';
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { compose, pure } from 'recompose';
import {
  connectPremiumDialog,
  WithPremiumDialog,
} from '../../../features/purchases';
import SectionDetailsButton from './SectionDetailsButton';
import SelectedElementView from './SelectedElementView';
import SelectedSectionHeader from './SelectedSectionHeader';
import SelectedSectionTable from './SelectedSectionTable';

type Props = WithRegion & WithPremiumDialog & MapSelection & WithTranslation;

interface State {
  section: Section | null;
}

class SelectedSectionViewInternal extends React.Component<Props, State> {
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

  shouldComponentUpdate(next: Props) {
    const oldId = this.props.selection && this.props.selection.id;
    const newId = next.selection && next.selection.id;
    return oldId !== newId;
  }

  canNavigate = () => {
    const { section } = this.state;
    const { region, buyRegion, canMakePayments } = this.props;
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

  renderHeader = () => {
    const { section } = this.state;
    const { region } = this.props;
    return <SelectedSectionHeader section={section} region={region} />;
  };

  render() {
    const { selection, t, onSelected } = this.props;
    const { section } = this.state;
    const name = section ? section.river.name + ' - ' + section.name : '';
    const buttons = [
      {
        label: t('commons:putIn') as string,
        coordinates: get(section, 'putIn.coordinates', [0, 0]),
        coordinateLabel: `${name}: ${t('commons:putIn')}`,
        canNavigate: this.canNavigate,
      },
      {
        label: t('commons:takeOut') as string,
        coordinates: get(section, 'takeOut.coordinates', [0, 0]),
        coordinateLabel: `${name}: ${t('commons:takeOut')}`,
        canNavigate: this.canNavigate,
      },
    ];

    return (
      <SelectedElementView
        renderHeader={this.renderHeader}
        buttons={buttons}
        selected={isSection(selection)}
        onSectionSelected={onSelected}
        onPOISelected={noop}
      >
        <SelectedSectionTable section={section} />
        <SectionDetailsButton sectionId={selection && selection.id} />
      </SelectedElementView>
    );
  }
}

export const SelectedSectionView = compose<Props, {}>(
  pure,
  withTranslation(),
  withMapSelection,
  withRegion,
  connectPremiumDialog,
)(SelectedSectionViewInternal);
