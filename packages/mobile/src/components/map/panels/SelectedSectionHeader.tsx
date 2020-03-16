import { WithNode } from '@whitewater-guide/clients';
import { Region, Section } from '@whitewater-guide/commons';
import get from 'lodash/get';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Paragraph, Subheading } from 'react-native-paper';
import DifficultyThumb from '~/components/DifficultyThumb';
import theme from '../../../theme';
import Icon from '../../Icon';
import { NAVIGATE_BUTTON_HEIGHT } from '../../NavigateButton';
import SimpleStarRating from '../../SimpleStarRating';

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: theme.margin.single,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.border,
    backgroundColor: theme.colors.primaryBackground,
    height: NAVIGATE_BUTTON_HEIGHT,
    flex: 1,
  },
  body: {
    flex: 1,
  },
  title: {
    lineHeight: undefined,
  },
  starsContainer: {
    width: 80,
    paddingTop: 2,
  },
  row: {
    flexDirection: 'row',
  },
  unlocked: {
    position: 'absolute',
    top: -3,
  },
});

interface Props {
  section: Section | null;
  region: WithNode<Region | null>;
}

const SelectedSectionHeader: React.FC<Props> = React.memo(
  ({ section, region }) => {
    const sectionName = (section && section.name) || '';
    const riverName = (section && section.river && section.river.name) || '';
    return (
      <View style={styles.header}>
        <View style={styles.body}>
          <Paragraph numberOfLines={1} style={styles.title}>
            {riverName}
          </Paragraph>
          <View style={styles.row}>
            <Subheading numberOfLines={1} style={styles.title}>
              {sectionName}
            </Subheading>
            {section &&
              section.demo &&
              region.node &&
              region.node.premium &&
              !region.node.hasPremiumAccess && (
                <View>
                  <Icon
                    style={styles.unlocked}
                    icon="lock-open-outline"
                    color={theme.colors.textMain}
                    size={16}
                  />
                </View>
              )}
          </View>
          <View style={styles.starsContainer}>
            <SimpleStarRating value={get(section, 'rating', 0) || 0} />
          </View>
        </View>
        <DifficultyThumb
          difficulty={get(section, 'difficulty', 1)}
          difficultyXtra={get(section, 'difficultyXtra', ' ')}
          noBorder={true}
        />
      </View>
    );
  },
);

SelectedSectionHeader.displayName = 'SelectedSectionHeader';

export default SelectedSectionHeader;
