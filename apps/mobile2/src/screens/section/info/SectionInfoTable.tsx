import type {
  DifficultyFragment,
  SafeSectionDetails,
} from '@whitewater-guide/clients';
import { renderDifficulty, stringifySeason } from '@whitewater-guide/clients';
import { TagCategory } from '@whitewater-guide/schema';
import groupBy from 'lodash/groupBy';
import isNil from 'lodash/isNil';
import trim from 'lodash/trim';
import upperFirst from 'lodash/upperFirst';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { Text } from 'react-native-paper';

import Chips from '../../../components/Chips';
import { Row } from '../../../components/Row';
import { SimpleStarRating } from '../../../components/star-rating';
import { getSeasonLocalizer } from '../../../i18n';

interface Props {
  section: SafeSectionDetails;
}

export const SectionInfoTable = memo<Props>(({ section }) => {
  const { t } = useTranslation();

  let season: string = upperFirst(
    trim(stringifySeason(section.seasonNumeric, false, getSeasonLocalizer(t))),
  );
  if (section.season) {
    season = `${season}\n${section.season}`.trim();
  }

  const tagsByCategory = groupBy(section.tags, 'category');

  return (
    <View>
      {!isNil(section.difficulty) && (
        <Row>
          <Text variant="titleSmall">{t('commons:difficulty')}</Text>
          <Text variant="bodyMedium">
            {renderDifficulty(section as DifficultyFragment)}
          </Text>
        </Row>
      )}

      {!isNil(section.rating) && (
        <Row>
          <Text variant="titleSmall">{t('commons:rating')}</Text>
          <SimpleStarRating value={section.rating} />
        </Row>
      )}

      {!!section.duration && (
        <Row>
          <Text variant="titleSmall">{t('commons:duration')}</Text>
          <Text variant="bodyMedium">{t(`durations:${section.duration}`)}</Text>
        </Row>
      )}

      {!!section.drop && (
        <Row>
          <Text variant="titleSmall">
            {t('commons:drop', { unit: t('commons:m') })}
          </Text>
          <Text variant="bodyMedium">{section.drop}</Text>
        </Row>
      )}

      {!!section.distance && (
        <Row>
          <Text variant="titleSmall">
            {t('commons:length', { unit: t('commons:km') })}
          </Text>
          <Text variant="bodyMedium">{section.distance}</Text>
        </Row>
      )}

      {!!section.flowsText && (
        <Row>
          <Text variant="titleSmall">{t('commons:flows')}</Text>
          <Text variant="bodyMedium" style={{ textAlign: 'right', flex: 1 }}>
            {section.flowsText}
          </Text>
        </Row>
      )}

      {!!season && (
        <Row>
          <Text variant="titleSmall">{t('commons:season')}</Text>
          <Text variant="bodyMedium" style={{ textAlign: 'right', flex: 1 }}>
            {season}
          </Text>
        </Row>
      )}

      {!!tagsByCategory[TagCategory.Kayaking]?.length && (
        <Row>
          <Chips
            label={t('commons:kayakingTypes')}
            items={tagsByCategory[TagCategory.Kayaking]}
          />
        </Row>
      )}

      {!!tagsByCategory[TagCategory.Hazards]?.length && (
        <Row>
          <Chips
            label={t('commons:hazards')}
            items={tagsByCategory[TagCategory.Hazards]}
          />
        </Row>
      )}

      {!!tagsByCategory[TagCategory.Supply]?.length && (
        <Row>
          <Chips
            label={t('commons:supplyTypes')}
            items={tagsByCategory[TagCategory.Supply]}
          />
        </Row>
      )}

      {!!tagsByCategory[TagCategory.Misc]?.length && (
        <Row>
          <Chips
            label={t('commons:miscTags')}
            items={tagsByCategory[TagCategory.Misc]}
          />
        </Row>
      )}
    </View>
  );
});

SectionInfoTable.displayName = 'SectionInfoTable';

export function getSectionInfoTableRowCount(
  section?: SafeSectionDetails | null,
): number {
  if (!section) {
    return 0;
  }
  const tagsByCategory = groupBy(section.tags, 'category');
  let total = 0;
  if (!isNil(section.difficulty)) {
    total += 1;
  }
  if (!isNil(section.rating)) {
    total += 1;
  }
  if (section.duration) {
    total += 1;
  }
  if (section.drop) {
    total += 1;
  }
  if (section.distance) {
    total += 1;
  }
  if (section.flowsText?.trim()) {
    total += 1;
  }
  if (section.seasonNumeric?.length || section.season?.trim()) {
    total += 1;
  }
  Object.values(tagsByCategory).forEach((tags) => {
    if (tags.length > 0) {
      total += 1;
    }
  });
  return total;
}
