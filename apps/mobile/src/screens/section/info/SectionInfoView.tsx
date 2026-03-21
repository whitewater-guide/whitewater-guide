import { useSectionQuery } from '@whitewater-guide/clients';
import { BannerPlacement } from '@whitewater-guide/schema';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { Caption } from 'react-native-paper';

import { Collapsible, useCollapsible } from '~/components/Collapsible';
import Icon from '~/components/Icon';
import { Row } from '~/components/Row';
import { RegionBanners } from '~/features/banners';
import theme from '~/theme';

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
  descriptionBlock: {
    padding: theme.margin.single,
    backgroundColor: theme.colors.lightBackground,
  },
  infoBlock: {
    backgroundColor: theme.colors.lightBackground,
  },
  caption: {
    height: 32,
    justifyContent: 'center',
  },
});

const SectionInfoView: React.FC = () => {
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
      <HelpNeeded section={section} />

      <View style={styles.caption}>
        <Caption>{t('screens:section.info.infoBlock')}</Caption>
      </View>

      <View style={styles.infoBlock}>
        <Collapsible
          collapsed={collapsed}
          collapsedHeight={Math.min(3, tableRowCount) * theme.rowHeight}
        >
          <SectionInfoTable section={section} />
        </Collapsible>

        {tableRowCount > 3 && (
          <RectButton onPress={toggleCollapsed}>
            <Row style={styles.more}>
              <Caption style={styles.moreText}>
                {t(
                  'screens:section.info.tableCollapsible.' +
                    (collapsed ? 'more' : 'less'),
                )}
              </Caption>
              <Icon
                icon="chevron-down"
                color={theme.colors.primary}
                style={collapsed ? undefined : styles.flippedIcon}
              />
            </Row>
          </RectButton>
        )}
      </View>

      <View style={styles.caption}>
        <Caption>{t('screens:section.info.descriptionBlock')}</Caption>
      </View>

      <View style={styles.descriptionBlock}>
        <SectionInfoDescription section={section} loading={loading} />
        <RegionBanners
          placement={BannerPlacement.MobileSectionDescription}
          count={1}
        />
      </View>
    </ScrollView>
  );
};

export default SectionInfoView;
