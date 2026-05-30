import { useSectionQuery } from '@whitewater-guide/clients';
import { BannerPlacement } from '@whitewater-guide/schema';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { Text } from 'react-native-paper';

import { Collapsible, useCollapsible } from '../../../components/Collapsible';
import Icon from '../../../components/Icon';
import { Row } from '../../../components/Row';
import { RegionBanners } from '../../../features/banners';
import theme from '../../../theme';
import CoordinatesInfo from './CoordinatesInfo';
import HelpNeeded from './HelpNeeded';
import SectionInfoDescription from './SectionInfoDescription';
import {
  getSectionInfoTableRowCount,
  SectionInfoTable,
} from './SectionInfoTable';

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    padding: theme.margin.single,
    paddingBottom: 80,
  },
  infoBlock: {
    backgroundColor: theme.colors.lightBackground,
  },
  descriptionBlock: {
    padding: theme.margin.single,
    backgroundColor: theme.colors.lightBackground,
  },
  caption: {
    height: 32,
    justifyContent: 'center',
  },
  more: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  moreText: {
    color: theme.colors.primary,
    textTransform: 'uppercase',
  },
  flippedIcon: {
    transform: [{ rotate: '180deg' }],
  },
});

function SectionInfoView() {
  const { t } = useTranslation();
  const { data, refetch, loading } = useSectionQuery();
  const section = data?.section;
  const [collapsed, toggleCollapsed] = useCollapsible(true);

  const tableRowCount = useMemo(
    () => getSectionInfoTableRowCount(section),
    [section],
  );

  if (!section) {
    return null;
  }

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={refetch} />
      }
    >
      <HelpNeeded helpNeeded={section.helpNeeded} />

      <View style={styles.caption}>
        <Text variant="labelSmall">{t('screens:section.info.infoBlock')}</Text>
      </View>

      <View style={styles.infoBlock}>
        <Collapsible
          collapsed={collapsed}
          collapsedHeight={Math.min(3, tableRowCount) * theme.rowHeight}
        >
          <SectionInfoTable section={section} />
        </Collapsible>

        {tableRowCount > 3 && (
          <Pressable onPress={toggleCollapsed}>
            <Row style={styles.more}>
              <Text variant="labelMedium" style={styles.moreText}>
                {t(
                  'screens:section.info.tableCollapsible.' +
                    (collapsed ? 'more' : 'less'),
                )}
              </Text>
              <Icon
                icon="chevron-down"
                color={theme.colors.primary}
                style={collapsed ? undefined : styles.flippedIcon}
              />
            </Row>
          </Pressable>
        )}
      </View>

      <View style={styles.caption}>
        <Text variant="labelSmall">
          {t('screens:section.info.descriptionBlock')}
        </Text>
      </View>

      <View style={styles.descriptionBlock}>
        <SectionInfoDescription section={section} />
      </View>

      <CoordinatesInfo
        putIn={section.putIn?.coordinates}
        takeOut={section.takeOut?.coordinates}
      />

      <RegionBanners
        placement={BannerPlacement.MobileSectionDescription}
        count={1}
      />
    </ScrollView>
  );
}

export default SectionInfoView;
