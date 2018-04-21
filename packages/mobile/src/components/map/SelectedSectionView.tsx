import { capitalize, compact, get, noop, trim } from 'lodash';
import React from 'react';
import { translate } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';
import { WithT } from '../../i18n';
import theme from '../../theme';
import { SelectedSectionViewProps } from '../../ww-clients/features/maps';
import { stringifySeason } from '../../ww-clients/utils';
import { DifficultyThumb } from '../DifficultyThumb';
import { NAVIGATE_BUTTON_HEIGHT, NAVIGATE_BUTTON_WIDTH } from '../NavigateButton';
import { StarRating } from '../StarRating';
import { Text } from '../Text';
import SectionFlowsRow from './SectionFlowsRow';
import SelectedElementView from './SelectedElementView';

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.border,
    flex: 1,
  },
  body: {
    flex: 1,
  },
  starsContainer: {
    width: 80,
    paddingTop: 2,
  },
  distance: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 8,
    flex: 1,
  },
  drop: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 8,
    width: 2 * NAVIGATE_BUTTON_WIDTH - 8,
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderLeftColor: theme.colors.border,
  },
  guide: {
    ...StyleSheet.absoluteFillObject,
    bottom: NAVIGATE_BUTTON_HEIGHT,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  guideBox: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    elevation: 4,
  },
  guideText: {
    color: theme.colors.textLight,
    fontSize: 16,
    fontWeight: 'bold',
  },
  listItem: {
    padding: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 48,
  },
});

interface Props extends SelectedSectionViewProps, WithT {
  navigate: () => void;
}

class SelectedSectionViewInternal extends React.Component<Props> {

  shouldComponentUpdate(next: Props) {
    const oldId = this.props.selectedSection && this.props.selectedSection.id;
    const newId = next.selectedSection && next.selectedSection.id;
    return oldId !== newId;
  }

  onDetails = () => {
    // this.props.navigate({
    //   routeName: 'SectionDetails',
    //   params: { sectionId: this.props.selectedSection._id },
    // });
  };

  onMaximize = () => {
    // this.props.guideStep.complete();
  };

  renderBackground = () => {
    return null;
    // if (!this.props.selectedSection || this.props.guideStep.completed) {
    //   return null;
    // }
    // return (
    //   <View style={styles.guide} pointerEvents="none">
    //     <Animatable.View
    //       useNativeDriver
    //       style={styles.guideBox}
    //       animation="weakSlideInDown"
    //       iterationCount="infinite"
    //       direction="alternate"
    //     >
    //       <Icon narrow icon="arrow-up" color={theme.colors.textLight} />
    //       <Text style={styles.guideText}>{I18n.t('region.map.selectedSection.swipeUpTip')}</Text>
    //     </Animatable.View>
    //   </View>
    // );
  };

  renderHeader = () => {
    const { selectedSection: section } = this.props;
    return (
      <View style={styles.header}>
        <View style={styles.body}>
          <Text numberOfLines={1}>{get(section, 'river.name', '_')}</Text>
          <Text numberOfLines={1}>{get(section, 'name', '_')}</Text>
          <View style={styles.starsContainer}>
            <StarRating value={get(section, 'rating', 0)} />
          </View>
        </View>
        <DifficultyThumb
          difficulty={get(section, 'difficulty', 1)}
          difficultyXtra={get(section, 'difficultyXtra', '_')}
          noBorder
        />
      </View>
    );
  };

  render() {
    const { selectedSection: section, t } = this.props;
    const buttons = [
      { label: t('commons:putIn'), coordinates: get(section, 'putIn.coordinates', [0, 0]) },
      { label: t('commons:takeOut'), coordinates: get(section, 'takeOut.coordinates', [0, 0]) },
    ];
    let season = ' \n ';
    if (section) {
      season = [
        capitalize(trim(stringifySeason(section.seasonNumeric, false))),
        trim(section.season),
      ].join('\n');
    }
    const duration = section && t('durations:' + section.duration);
    const drop = section && section.drop;
    const distance = section && section.distance;
    const distanceStr = compact([distance ? `${distance} ${t('commons:km')}` : '', duration]).join(' / ');
    return (
      <SelectedElementView
        renderHeader={this.renderHeader}
        renderBackground={this.renderBackground}
        buttons={buttons}
        selected={!!section}
        onMaximize={this.onMaximize}
        onSectionSelected={this.props.onSectionSelected}
        onPOISelected={noop}
      >
        <View>
          <View style={styles.listItem}>
            <View style={styles.distance}>
              <Text>{t('commons:length')}</Text>
              <Text>{distanceStr}</Text>
            </View>
            <View style={styles.drop}>
              <Text>{t('commons:drop')}</Text>
              <Text>{drop ? `${drop} ${t('commons:m')}` : t('commons:unknown')}</Text>
            </View>
          </View>

          <SectionFlowsRow section={section} t={t} />

          <View style={styles.listItem}>
            <Text>{t('commons:season')}</Text>
            <Text numberOfLines={2}>
              {season}
            </Text>
          </View>
        </View>
        <Button primary onPress={this.onDetails}>
          {t('region:map.selectedSection.details')}
        </Button>
      </SelectedElementView>
    );
  }

}

export const SelectedSectionView: React.ComponentType<SelectedSectionViewProps> = translate()(SelectedSectionViewInternal);
