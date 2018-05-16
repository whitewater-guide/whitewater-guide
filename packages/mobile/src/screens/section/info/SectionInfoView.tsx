import capitalize from 'lodash/capitalize';
import groupBy from 'lodash/groupBy';
import trim from 'lodash/trim';
import React from 'react';
import { translate } from 'react-i18next';
import { Paragraph, Subheading } from 'react-native-paper';
import { Body, Chips, Left, Right, Row, StarRating } from '../../../components';
import { WithT } from '../../../i18n';
import { WithSection } from '../../../ww-clients/features/sections';
import { renderDifficulty, stringifySeason } from '../../../ww-clients/utils';
import { TagCategory } from '../../../ww-commons/features/tags';
import CoordinatesInfo from './CoordinatesInfo';

type Props = WithSection & WithT;

const SectionInfoView: React.StatelessComponent<Props> = ({ section: { node }, t }) => {
  if (!node) {
    return null;
  }
  let season = capitalize(trim(`${stringifySeason(node.seasonNumeric, false)}`));
  if (node.season) {
    season = `${season}\n${node.season}`;
  }
  const tagsByCategory = groupBy(node.tags, 'category');
  return (
    <React.Fragment>
      <Row>
        <Left><Subheading>{t('commons:difficulty')}</Subheading></Left>
        <Right><Paragraph>{renderDifficulty(node)}</Paragraph></Right>
      </Row>

      <Row>
        <Left><Subheading>{t('commons:rating')}</Subheading></Left>
        <Right>
          <StarRating value={node.rating} />
        </Right>
      </Row>

      {
        !!node.drop &&
        (
          <Row>
            <Left><Subheading>{t('commons:drop')}</Subheading></Left>
            <Right><Paragraph>{`${node.drop} ${t('commons:m')}`}</Paragraph></Right>
          </Row>
        )
      }

      {
        !!node.distance &&
        (
          <Row>
            <Left><Subheading>{t('commons:length')}</Subheading></Left>
            <Right><Paragraph>{`${node.distance} ${t('commons:km')}`}</Paragraph></Right>
          </Row>
        )
      }

      {
        !!node.duration &&
        (
          <Row>
            <Left><Subheading>{t('commons:duration')}</Subheading></Left>
            <Right><Paragraph>{t('durations:' + node.duration)}</Paragraph></Right>
          </Row>
        )
      }

      {
        !!node.flowsText &&
        (
          <Row>
            <Left><Subheading>{t('commons:flows')}</Subheading></Left>
            <Body>
              <Paragraph style={{ textAlign: 'right' }}>{node.flowsText}</Paragraph>
            </Body>
          </Row>
        )
      }

      <Row>
        <Left><Subheading>{t('commons:season')}</Subheading></Left>
        <Body>
          <Paragraph style={{ textAlign: 'right' }}>{season}</Paragraph>
        </Body>
      </Row>

      <CoordinatesInfo label={t('commons:putIn')} coordinates={node.putIn.coordinates} />

      <CoordinatesInfo label={t('commons:takeOut')} coordinates={node.takeOut.coordinates} />

      {
        !!tagsByCategory[TagCategory.kayaking] &&
        !!tagsByCategory[TagCategory.kayaking].length &&
        (
          <Row>
            <Chips label={t('commons:kayakingTypes')} items={tagsByCategory[TagCategory.kayaking]} />
          </Row>
        )
      }

      {
        !!tagsByCategory[TagCategory.hazards] &&
        !!tagsByCategory[TagCategory.hazards].length &&
        (
          <Row>
            <Chips label={t('commons:hazards')} items={tagsByCategory[TagCategory.hazards]} />
          </Row>
        )
      }

      {
        !!tagsByCategory[TagCategory.supply] &&
        !!tagsByCategory[TagCategory.supply].length &&
        (
          <Row>
            <Chips label={t('commons:supplyTypes')} items={tagsByCategory[TagCategory.supply]} />
          </Row>
        )
      }

      {
        !!tagsByCategory[TagCategory.misc] &&
        !!tagsByCategory[TagCategory.misc].length &&
        (
          <Row>
            <Chips label={t('commons:miscTags')} items={tagsByCategory[TagCategory.misc]} />
          </Row>
        )
      }

    </React.Fragment>
  );
};

export default translate()(SectionInfoView);
