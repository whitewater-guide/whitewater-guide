import {
  DifficultyFragment,
  renderDifficulty,
  stringifySeason,
  useSectionQuery,
} from '@whitewater-guide/clients';
import { TagCategory } from '@whitewater-guide/schema';
import groupBy from 'lodash/groupBy';
import isNil from 'lodash/isNil';
import trim from 'lodash/trim';
import upperFirst from 'lodash/upperFirst';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { Paragraph, Subheading } from 'react-native-paper';

import Chips from '~/components/Chips';
import { Body, Left, Right, Row } from '~/components/Row';
import SimpleStarRating from '~/components/SimpleStarRating';
import { PremiumSection } from '~/features/purchases';
import { getSeasonLocalizer } from '~/i18n';
import theme from '~/theme';

import CoordinatesInfo from './CoordinatesInfo';
import HelpNeeded from './HelpNeeded';

const styles = StyleSheet.create({
  content: {
    padding: theme.margin.single,
  },
  fabHelper: {
    height: 64,
  },
});

const SectionInfoView: React.FC = () => {
  const { data, refetch, loading } = useSectionQuery();
  const section = data?.section;
  const { t } = useTranslation();

  if (!section) {
    return null;
  }

  let season = upperFirst(
    trim(
      `${stringifySeason(section.seasonNumeric, false, getSeasonLocalizer(t))}`,
    ),
  );
  if (section.season) {
    season = `${season}\n${section.season}`;
  }
  const tagsByCategory = groupBy(section.tags, 'category');

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={refetch} />
      }
    >
      <HelpNeeded section={section} />

      {!isNil(section.difficulty) && (
        <Row>
          <Left>
            <Subheading>{t('commons:difficulty')}</Subheading>
          </Left>
          <Right>
            <Paragraph>
              {renderDifficulty(section as DifficultyFragment)}
            </Paragraph>
          </Right>
        </Row>
      )}

      <Row>
        <Left>
          <Subheading>{t('commons:rating')}</Subheading>
        </Left>
        <Right>
          <SimpleStarRating value={section.rating} />
        </Right>
      </Row>

      {!!section.drop && (
        <Row>
          <Left>
            <Subheading>{t('commons:drop')}</Subheading>
          </Left>
          <Right>
            <Paragraph>{`${section.drop} ${t('commons:m')}`}</Paragraph>
          </Right>
        </Row>
      )}

      {!!section.distance && (
        <Row>
          <Left>
            <Subheading>{t('commons:length')}</Subheading>
          </Left>
          <Right>
            <Paragraph>{`${section.distance} ${t('commons:km')}`}</Paragraph>
          </Right>
        </Row>
      )}

      {!!section.duration && (
        <Row>
          <Left>
            <Subheading>{t('commons:duration')}</Subheading>
          </Left>
          <Right>
            <Paragraph>{t(`durations:${section.duration}`)}</Paragraph>
          </Right>
        </Row>
      )}

      {!!section.flowsText && (
        <Row>
          <Left>
            <Subheading>{t('commons:flows')}</Subheading>
          </Left>
          <Body>
            <Paragraph style={{ textAlign: 'right' }}>
              {section.flowsText}
            </Paragraph>
          </Body>
        </Row>
      )}

      <Row>
        <Left>
          <Subheading>{t('commons:season')}</Subheading>
        </Left>
        <Body>
          <Paragraph style={{ textAlign: 'right' }}>{season}</Paragraph>
        </Body>
      </Row>

      {section.putIn && (
        <CoordinatesInfo
          label={t('commons:putIn')}
          coordinates={section.putIn.coordinates}
          section={section as PremiumSection}
        />
      )}

      {section.takeOut && (
        <CoordinatesInfo
          label={t('commons:takeOut')}
          coordinates={section.takeOut.coordinates}
          section={section as PremiumSection}
        />
      )}

      {!!tagsByCategory[TagCategory.Kayaking] &&
        !!tagsByCategory[TagCategory.Kayaking].length && (
          <Row>
            <Chips
              label={t('commons:kayakingTypes')}
              items={tagsByCategory[TagCategory.Kayaking]}
            />
          </Row>
        )}

      {!!tagsByCategory[TagCategory.Hazards] &&
        !!tagsByCategory[TagCategory.Hazards].length && (
          <Row>
            <Chips
              label={t('commons:hazards')}
              items={tagsByCategory[TagCategory.Hazards]}
            />
          </Row>
        )}

      {!!tagsByCategory[TagCategory.Supply] &&
        !!tagsByCategory[TagCategory.Supply].length && (
          <Row>
            <Chips
              label={t('commons:supplyTypes')}
              items={tagsByCategory[TagCategory.Supply]}
            />
          </Row>
        )}

      {!!tagsByCategory[TagCategory.Misc] &&
        !!tagsByCategory[TagCategory.Misc].length && (
          <Row>
            <Chips
              label={t('commons:miscTags')}
              items={tagsByCategory[TagCategory.Misc]}
            />
          </Row>
        )}
      <View style={styles.fabHelper} />
    </ScrollView>
  );
};

export default SectionInfoView;
