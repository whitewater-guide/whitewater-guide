import { useNavigation } from '@react-navigation/native';
import { format, utcToZonedTime } from 'date-fns-tz';
import React, { useCallback } from 'react';
import type { ListRenderItemInfo } from 'react-native';
import { Pressable, StyleSheet, View } from 'react-native';
import { Caption, Subheading } from 'react-native-paper';

import { Screens } from '~/core/navigation';
import descentLevelToString from '~/features/descents/descentLevelToString';
import getSectionTimezone from '~/features/descents/getSectionTimezone';
import theme from '~/theme';

import type { MyDescentFragment } from './myDescents.generated';

const ITEM_HEIGHT = 64;

const styles = StyleSheet.create({
  container: {
    height: ITEM_HEIGHT,
    padding: theme.margin.single,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.border,
    flexDirection: 'row',
  },
  rows: {
    flex: 1,
    justifyContent: 'space-around',
  },
  levelBlock: {
    alignItems: 'flex-end',
  },
});

interface Props {
  descent: MyDescentFragment;
}

const LogbookListItem: React.FC<Props> = ({ descent }) => {
  const { navigate } = useNavigation();
  const onPress = useCallback(() => {
    navigate(Screens.DESCENT, { descentId: descent.id });
  }, [navigate, descent]);

  const timeZone = getSectionTimezone(descent.section);
  const zonedStartedAt = utcToZonedTime(descent.startedAt, timeZone);
  const startedAtStr = format(zonedStartedAt, 'PP p zzz', { timeZone });

  return (
    <Pressable onPress={onPress}>
      <View style={styles.container}>
        <View style={styles.rows}>
          <Subheading>
            {`${descent.section.river.name} - ${descent.section.name}`}
          </Subheading>
          <Caption>{startedAtStr}</Caption>
        </View>
        {descent.level && (
          <View style={styles.levelBlock}>
            <Subheading>{descentLevelToString(descent.level)}</Subheading>
          </View>
        )}
      </View>
    </Pressable>
  );
};

export const getItemLayout = (data: any, index: number) => ({
  length: ITEM_HEIGHT,
  offset: index * ITEM_HEIGHT,
  index,
});

export const renderDescent = ({
  item,
}: ListRenderItemInfo<MyDescentFragment>) => <LogbookListItem descent={item} />;
