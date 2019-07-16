import { stringifySeason } from '@whitewater-guide/clients';
import { Section } from '@whitewater-guide/commons';
import trim from 'lodash/trim';
import upperFirst from 'lodash/upperFirst';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Paragraph, Subheading } from 'react-native-paper';
import Svg, { Path } from 'react-native-svg';
import { getSeasonLocalizer } from '../../../i18n';
import theme from '../../../theme';
import { Icon } from '../../Icon';
import { NAVIGATE_BUTTON_WIDTH } from '../../NavigateButton';
import SectionFlowsRow from './SectionFlowsRow';

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.primaryBackground,
  },
  col: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
    flex: 1,
    height: theme.rowHeight,
  },
  col1: {
    paddingRight: theme.margin.half,
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: theme.colors.border,
  },
  col2: {
    paddingHorizontal: theme.margin.half,
  },
  col3: {
    paddingLeft: theme.margin.half,
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderLeftColor: theme.colors.border,
    width: 2 * NAVIGATE_BUTTON_WIDTH - theme.margin.single,
    flex: undefined,
  },
  colText: {
    flex: 1,
    textAlign: 'right',
  },
  row1: {
    flexDirection: 'row',
    height: theme.rowHeight,
    paddingHorizontal: theme.margin.single,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
  },
  row3: {
    flexDirection: 'row',
    height: theme.rowHeight,
    padding: theme.margin.single,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

interface Props {
  section: Section | null;
}

const propsAreEqual = (a: Props, b: Props): boolean =>
  (a.section && a.section.id) === (b.section && b.section.id);

const SelectedSectionTable: React.FC<Props> = React.memo(({ section }) => {
  const { t } = useTranslation();
  let season = ' ';
  if (section) {
    season = [
      upperFirst(
        trim(
          stringifySeason(section.seasonNumeric, false, getSeasonLocalizer(t)),
        ),
      ),
      trim(section.season || ''),
    ]
      .join('\n')
      .trim();
  }
  const seasonNumLines = season.includes('\n') ? 2 : 1;
  const duration =
    section && section.duration
      ? t('durations:' + section.duration)
      : t('commons:unknown');
  const drop = section && section.drop;
  const distance = section && section.distance;
  return (
    <View style={styles.container}>
      <View style={styles.row1}>
        <View style={[styles.col, styles.col1]}>
          <Svg width={24} height={24}>
            {/*tslint:disable-next-line*/}
            <Path
              fill={theme.colors.textMain}
              d="M6.5,8.11C5.61,8.11 4.89,7.39 4.89,6.5A1.61,1.61 0 0,1 6.5,4.89C7.39,4.89 8.11,5.61 8.11,6.5V6.5A1.61,1.61 0 0,1 6.5,8.11M6.5,2C4,2 2,4 2,6.5C2,9.87 6.5,14.86 6.5,14.86C6.5,14.86 11,9.87 11,6.5C11,4 9,2 6.5,2M17.5,8.11A1.61,1.61 0 0,1 15.89,6.5C15.89,5.61 16.61,4.89 17.5,4.89C18.39,4.89 19.11,5.61 19.11,6.5A1.61,1.61 0 0,1 17.5,8.11M17.5,2C15,2 13,4 13,6.5C13,9.87 17.5,14.86 17.5,14.86C17.5,14.86 22,9.87 22,6.5C22,4 20,2 17.5,2M17.5,16C16.23,16 15.1,16.8 14.68,18H9.32C8.77,16.44 7.05,15.62 5.5,16.17C3.93,16.72 3.11,18.44 3.66,20C4.22,21.56 5.93,22.38 7.5,21.83C8.35,21.53 9,20.85 9.32,20H14.69C15.24,21.56 16.96,22.38 18.5,21.83C20.08,21.28 20.9,19.56 20.35,18C19.92,16.8 18.78,16 17.5,16V16M17.5,20.5A1.5,1.5 0 0,1 16,19A1.5,1.5 0 0,1 17.5,17.5A1.5,1.5 0 0,1 19,19A1.5,1.5 0 0,1 17.5,20.5Z"
            />
          </Svg>
          <Paragraph
            style={styles.colText}
            adjustsFontSizeToFit={true}
            numberOfLines={1}
          >
            {distance ? `${distance} ${t('commons:km')}` : t('commons:unknown')}
          </Paragraph>
        </View>
        <View style={[styles.col, styles.col2]}>
          <Icon
            icon="arrow-expand-vertical"
            color={theme.colors.textMain}
            size={24}
          />
          <Paragraph
            style={styles.colText}
            adjustsFontSizeToFit={true}
            numberOfLines={1}
          >
            {drop ? `${drop} ${t('commons:m')}` : t('commons:unknown')}
          </Paragraph>
        </View>
        <View style={[styles.col, styles.col3]}>
          <Icon icon="clock" color={theme.colors.textMain} size={24} />
          <Paragraph
            style={styles.colText}
            adjustsFontSizeToFit={true}
            numberOfLines={1}
          >
            {duration}
          </Paragraph>
        </View>
      </View>

      <SectionFlowsRow section={section} />

      <View style={styles.row3}>
        <Subheading>{t('commons:season')}</Subheading>
        <Paragraph numberOfLines={seasonNumLines}>{season}</Paragraph>
      </View>
    </View>
  );
}, propsAreEqual);

SelectedSectionTable.displayName = 'SelectedSectionTable';

export default SelectedSectionTable;
