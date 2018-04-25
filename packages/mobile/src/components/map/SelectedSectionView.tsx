import { capitalize, compact, get, noop, trim } from 'lodash';
import React from 'react';
import { translate } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Button, Paragraph, Subheading } from 'react-native-paper';
import Svg, { Path } from 'react-native-svg';
import { WithT } from '../../i18n';
import theme from '../../theme';
import { SelectedSectionViewProps } from '../../ww-clients/features/maps';
import { stringifySeason } from '../../ww-clients/utils';
import { DifficultyThumb } from '../DifficultyThumb';
import { Icon } from '../Icon';
import { NAVIGATE_BUTTON_HEIGHT, NAVIGATE_BUTTON_WIDTH } from '../NavigateButton';
import { StarRating } from '../StarRating';
import { Text } from '../Text';
import SectionFlowsRow from './SectionFlowsRow';
import SelectedElementView from './SelectedElementView';

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: theme.margin.single,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.border,
    flex: 1,
  },
  body: {
    flex: 1,
  },
  title: {
    lineHeight: undefined,
  },
  starsContainer: {
    width: 80,
    paddingTop: 2,
  },
  col1: {
    alignSelf: 'stretch',
    paddingRight: theme.margin.half,
    width: 2 * NAVIGATE_BUTTON_WIDTH - theme.margin.single,
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: theme.colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  col2: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
    paddingHorizontal: theme.margin.half,
    flex: 1,
  },
  col3: {
    alignSelf: 'stretch',
    paddingLeft: theme.margin.half,
    width: 2 * NAVIGATE_BUTTON_WIDTH - theme.margin.single,
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderLeftColor: theme.colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  colText: {
    flex: 1,
    textAlign: 'right',
  },
  listItem: {
    padding: theme.margin.single,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: theme.rowHeight,
  },
  listItemWithBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
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

  renderHeader = () => {
    const { selectedSection: section } = this.props;
    return (
      <View style={styles.header}>
        <View style={styles.body}>
          <Paragraph numberOfLines={1} style={styles.title}>
            {get(section, 'river.name', ' ')}
          </Paragraph>
          <Subheading numberOfLines={1} style={styles.title}>
            {get(section, 'name', ' ')}
          </Subheading>
          <View style={styles.starsContainer}>
            <StarRating value={get(section, 'rating', 0)} />
          </View>
        </View>
        <DifficultyThumb
          difficulty={get(section, 'difficulty', 1)}
          difficultyXtra={get(section, 'difficultyXtra', ' ')}
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
    let season = ' ';
    if (section) {
      season = [
        capitalize(trim(stringifySeason(section.seasonNumeric, false))),
        trim(section.season),
      ].join('\n');
    }
    const seasonNumLines = season.includes('\n') ? 2 : 1;
    const duration = section && t('durations:' + section.duration);
    const drop = section && section.drop;
    const distance = section && section.distance;
    return (
      <SelectedElementView
        renderHeader={this.renderHeader}
        buttons={buttons}
        selected={!!section}
        onSectionSelected={this.props.onSectionSelected}
        onPOISelected={noop}
      >
        <View style={[styles.listItem, styles.listItemWithBorder]}>
          <View style={styles.col1}>
            <Svg width={24} height={24} >
              <Path fill={theme.colors.textMain} d="M6.5,8.11C5.61,8.11 4.89,7.39 4.89,6.5A1.61,1.61 0 0,1 6.5,4.89C7.39,4.89 8.11,5.61 8.11,6.5V6.5A1.61,1.61 0 0,1 6.5,8.11M6.5,2C4,2 2,4 2,6.5C2,9.87 6.5,14.86 6.5,14.86C6.5,14.86 11,9.87 11,6.5C11,4 9,2 6.5,2M17.5,8.11A1.61,1.61 0 0,1 15.89,6.5C15.89,5.61 16.61,4.89 17.5,4.89C18.39,4.89 19.11,5.61 19.11,6.5A1.61,1.61 0 0,1 17.5,8.11M17.5,2C15,2 13,4 13,6.5C13,9.87 17.5,14.86 17.5,14.86C17.5,14.86 22,9.87 22,6.5C22,4 20,2 17.5,2M17.5,16C16.23,16 15.1,16.8 14.68,18H9.32C8.77,16.44 7.05,15.62 5.5,16.17C3.93,16.72 3.11,18.44 3.66,20C4.22,21.56 5.93,22.38 7.5,21.83C8.35,21.53 9,20.85 9.32,20H14.69C15.24,21.56 16.96,22.38 18.5,21.83C20.08,21.28 20.9,19.56 20.35,18C19.92,16.8 18.78,16 17.5,16V16M17.5,20.5A1.5,1.5 0 0,1 16,19A1.5,1.5 0 0,1 17.5,17.5A1.5,1.5 0 0,1 19,19A1.5,1.5 0 0,1 17.5,20.5Z" />
            </Svg>
            <Paragraph style={styles.colText}>
              {distance ? `${distance} ${t('commons:km')}` : t('commons:unknown')}
            </Paragraph>
          </View>
          <View style={styles.col2}>
            <Icon icon="trending-down" color={theme.colors.textMain} size={24} />
            <Paragraph  style={styles.colText}>
              {drop ? `${drop} ${t('commons:m')}` : t('commons:unknown')}
            </Paragraph>
          </View>
          <View style={styles.col3}>
            <Icon icon="clock" color={theme.colors.textMain} size={24} />
            <Paragraph style={styles.colText}>
              {duration ? duration : t('commons:unknown')}
            </Paragraph>
          </View>
        </View>

        <SectionFlowsRow section={section} t={t} />

        <View style={styles.listItem}>
          <Subheading>{t('commons:season')}</Subheading>
          <Paragraph numberOfLines={seasonNumLines}>
            {season}
          </Paragraph>
        </View>
        <Button primary raised onPress={this.onDetails}>
          {t('region:map.selectedSection.details')}
        </Button>
      </SelectedElementView>
    );
  }

}

export const SelectedSectionView: React.ComponentType<SelectedSectionViewProps> =
  translate()(SelectedSectionViewInternal);
