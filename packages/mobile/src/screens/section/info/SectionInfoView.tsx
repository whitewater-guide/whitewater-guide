import capitalize from 'lodash/capitalize';
import groupBy from 'lodash/groupBy';
import trim from 'lodash/trim';
import React from 'react';
import { translate } from 'react-i18next';
import { Paragraph, Subheading } from 'react-native-paper';
import { Chips, StarRating } from '../../../components';
import { WithT } from '../../../i18n';
import { WithSection } from '../../../ww-clients/features/sections';
import { renderDifficulty, stringifySeason } from '../../../ww-clients/utils';
import { TagCategory } from '../../../ww-commons/features/tags';
import CoordinatesInfo from './CoordinatesInfo';
import { Body, Left, ListItem, Right } from './ListItem';

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
      <ListItem>
        <Left><Subheading>{t('commons:difficulty')}</Subheading></Left>
        <Right><Paragraph>{renderDifficulty(node)}</Paragraph></Right>
      </ListItem>

      <ListItem>
        <Left><Subheading>{t('commons:rating')}</Subheading></Left>
        <Right>
          <StarRating value={node.rating} />
        </Right>
      </ListItem>

      <ListItem>
        <Left><Subheading>{t('commons:drop')}</Subheading></Left>
        <Right><Paragraph>{`${node.drop} ${t('commons:m')}`}</Paragraph></Right>
      </ListItem>

      <ListItem>
        <Left><Subheading>{t('commons:length')}</Subheading></Left>
        <Right><Paragraph>{`${node.distance} ${t('commons:km')}`}</Paragraph></Right>
      </ListItem>

      <ListItem>
        <Left><Subheading>{t('commons:duration')}</Subheading></Left>
        <Right><Paragraph>{node.duration ? t('durations:' + node.duration) : t('commons:unknown')}</Paragraph></Right>
      </ListItem>

      {
        !!node.flowsText &&
        (
          <ListItem>
            <Left><Subheading>{t('commons:flows')}</Subheading></Left>
            <Body>
              <Paragraph style={{ textAlign: 'right' }}>{node.flowsText}</Paragraph>
            </Body>
          </ListItem>
        )
      }

      <ListItem>
        <Left><Subheading>{t('commons:season')}</Subheading></Left>
        <Body>
          <Paragraph style={{ textAlign: 'right' }}>{season}</Paragraph>
        </Body>
      </ListItem>

      <CoordinatesInfo label={t('commons:putIn')} coordinates={node.putIn.coordinates} />

      <CoordinatesInfo label={t('commons:takeOut')} coordinates={node.takeOut.coordinates} />

      <ListItem>
        <Chips label={t('commons:kayakingTypes')} items={tagsByCategory[TagCategory.kayaking]} />
      </ListItem>

      <ListItem>
        <Chips label={t('commons:hazards')} items={tagsByCategory[TagCategory.hazards]} />
      </ListItem>

      <ListItem>
        <Chips label={t('commons:supplyTypes')} items={tagsByCategory[TagCategory.supply]} />
      </ListItem>

      <ListItem>
        <Chips label={t('commons:miscTags')} items={tagsByCategory[TagCategory.misc]} />
      </ListItem>

    </React.Fragment>
  );
};

export default translate()(SectionInfoView);
