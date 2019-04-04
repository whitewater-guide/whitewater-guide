import {
  renderDifficulty,
  stringifySeason,
  WithSection,
} from '@whitewater-guide/clients';
import { TagCategory } from '@whitewater-guide/commons';
import capitalize from 'lodash/capitalize';
import groupBy from 'lodash/groupBy';
import trim from 'lodash/trim';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Paragraph, Subheading } from 'react-native-paper';
import { Body, Chips, Left, Right, Row, StarRating } from '../../../components';
import CoordinatesInfo from './CoordinatesInfo';

const SectionInfoView: React.FC<WithSection> = ({ section: { node } }) => {
  const [t, i18n] = useTranslation();
  if (!node) {
    return null;
  }
  let season = capitalize(
    trim(`${stringifySeason(node.seasonNumeric, false, i18n!.languages[0])}`),
  );
  if (node.season) {
    season = `${season}\n${node.season}`;
  }
  const tagsByCategory = groupBy(node.tags, 'category');
  return (
    <React.Fragment>
      <Row>
        <Left>
          <Subheading>{t('commons:difficulty')}</Subheading>
        </Left>
        <Right>
          <Paragraph>{renderDifficulty(node)}</Paragraph>
        </Right>
      </Row>

      <Row>
        <Left>
          <Subheading>{t('commons:rating')}</Subheading>
        </Left>
        <Right>
          <StarRating value={node.rating || 0} />
        </Right>
      </Row>

      {!!node.drop && (
        <Row>
          <Left>
            <Subheading>{t('commons:drop')}</Subheading>
          </Left>
          <Right>
            <Paragraph>{`${node.drop} ${t('commons:m')}`}</Paragraph>
          </Right>
        </Row>
      )}

      {!!node.distance && (
        <Row>
          <Left>
            <Subheading>{t('commons:length')}</Subheading>
          </Left>
          <Right>
            <Paragraph>{`${node.distance} ${t('commons:km')}`}</Paragraph>
          </Right>
        </Row>
      )}

      {!!node.duration && (
        <Row>
          <Left>
            <Subheading>{t('commons:duration')}</Subheading>
          </Left>
          <Right>
            <Paragraph>{t('durations:' + node.duration)}</Paragraph>
          </Right>
        </Row>
      )}

      {!!node.flowsText && (
        <Row>
          <Left>
            <Subheading>{t('commons:flows')}</Subheading>
          </Left>
          <Body>
            <Paragraph style={{ textAlign: 'right' }}>
              {node.flowsText}
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

      <CoordinatesInfo
        label={t('commons:putIn')}
        coordinates={node.putIn.coordinates}
        section={node}
      />

      <CoordinatesInfo
        label={t('commons:takeOut')}
        coordinates={node.takeOut.coordinates}
        section={node}
      />

      {!!tagsByCategory[TagCategory.kayaking] &&
        !!tagsByCategory[TagCategory.kayaking].length && (
          <Row>
            <Chips
              label={t('commons:kayakingTypes') as string}
              items={tagsByCategory[TagCategory.kayaking]}
            />
          </Row>
        )}

      {!!tagsByCategory[TagCategory.hazards] &&
        !!tagsByCategory[TagCategory.hazards].length && (
          <Row>
            <Chips
              label={t('commons:hazards') as string}
              items={tagsByCategory[TagCategory.hazards]}
            />
          </Row>
        )}

      {!!tagsByCategory[TagCategory.supply] &&
        !!tagsByCategory[TagCategory.supply].length && (
          <Row>
            <Chips
              label={t('commons:supplyTypes') as string}
              items={tagsByCategory[TagCategory.supply]}
            />
          </Row>
        )}

      {!!tagsByCategory[TagCategory.misc] &&
        !!tagsByCategory[TagCategory.misc].length && (
          <Row>
            <Chips
              label={t('commons:miscTags') as string}
              items={tagsByCategory[TagCategory.misc]}
            />
          </Row>
        )}
    </React.Fragment>
  );
};

export default SectionInfoView;
