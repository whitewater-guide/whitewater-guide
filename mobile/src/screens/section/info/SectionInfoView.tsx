import {
  renderDifficulty,
  stringifySeason,
  WithNode,
} from '@whitewater-guide/clients';
import { Section, TagCategory } from '@whitewater-guide/commons';
import groupBy from 'lodash/groupBy';
import trim from 'lodash/trim';
import upperFirst from 'lodash/upperFirst';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { Paragraph, Subheading } from 'react-native-paper';

import Chips from '~/components/Chips';
import { Body, Left, Right, Row } from '~/components/Row';
import SimpleStarRating from '~/components/SimpleStarRating';

import { getSeasonLocalizer } from '../../../i18n';
import theme from '../../../theme';
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

interface Props {
  section: WithNode<Section | null>;
}

const SectionInfoView: React.FC<Props> = ({ section }) => {
  const { node, refetch, loading } = section;
  const [t] = useTranslation();
  if (!node) {
    return null;
  }
  let season = upperFirst(
    trim(
      `${stringifySeason(node.seasonNumeric, false, getSeasonLocalizer(t))}`,
    ),
  );
  if (node.season) {
    season = `${season}\n${node.season}`;
  }
  const tagsByCategory = groupBy(node.tags, 'category');
  return (
    <ScrollView
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={refetch} />
      }
    >
      <HelpNeeded section={node} />

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
          <SimpleStarRating value={node.rating} />
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
      <View style={styles.fabHelper} />
    </ScrollView>
  );
};

export default SectionInfoView;