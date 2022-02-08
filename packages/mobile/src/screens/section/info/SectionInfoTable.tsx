import {
  DifficultyFragment,
  renderDifficulty,
  SafeSectionDetails,
  stringifySeason,
} from '@whitewater-guide/clients';
import { TagCategory } from '@whitewater-guide/schema';
import groupBy from 'lodash/groupBy';
import isNil from 'lodash/isNil';
import trim from 'lodash/trim';
import upperFirst from 'lodash/upperFirst';
import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Paragraph, Subheading } from 'react-native-paper';

import Chips from '~/components/Chips';
import { Body, Left, Right, Row } from '~/components/Row';
import SimpleStarRating from '~/components/SimpleStarRating';
import { PremiumSection } from '~/features/purchases';
import { getSeasonLocalizer } from '~/i18n';

import CoordinatesInfo from './CoordinatesInfo';

interface SectionInfoTableProps {
  section: SafeSectionDetails;
}

export const SectionInfoTable = memo<SectionInfoTableProps>(({ section }) => {
  const { t } = useTranslation();
  let season = upperFirst(
    trim(
      `${stringifySeason(section.seasonNumeric, false, getSeasonLocalizer(t))}`,
    ),
  );
  if (section.season) {
    season = `${season}\n${section.season}`.trim();
  }
  const tagsByCategory = groupBy(section.tags, 'category');

  return (
    <>
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

      {!isNil(section.rating) && (
        <Row>
          <Left>
            <Subheading>{t('commons:rating')}</Subheading>
          </Left>
          <Right>
            <SimpleStarRating value={section.rating} />
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

      {!!season && (
        <Row>
          <Left>
            <Subheading>{t('commons:season')}</Subheading>
          </Left>
          <Body>
            <Paragraph style={{ textAlign: 'right' }}>{season}</Paragraph>
          </Body>
        </Row>
      )}

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
    </>
  );
});

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
  if (section.putIn) {
    total += 1;
  }
  if (section.takeOut) {
    total += 1;
  }
  Object.values(tagsByCategory).forEach((tags) => {
    if (tags.length > 0) {
      total += 1;
    }
  });
  return total;
}
