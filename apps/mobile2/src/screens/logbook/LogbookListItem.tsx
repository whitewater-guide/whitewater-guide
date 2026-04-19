import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { format, utcToZonedTime } from 'date-fns-tz';
import { useCallback } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import type { RootStackParamsList } from '../../core/navigation';
import { Screens } from '../../core/navigation';
import descentLevelToString from '../../features/descents/descentLevelToString';
import getSectionTimezone from '../../features/descents/getSectionTimezone';
import theme from '../../theme';
import type { MyDescentFragment } from './myDescents.generated';

export const ITEM_HEIGHT = 64;

const styles = StyleSheet.create({
  container: {
    height: ITEM_HEIGHT,
    padding: theme.margin.single,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.border,
    flexDirection: 'row',
    alignItems: 'center',
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

function LogbookListItem({ descent }: Props) {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamsList>>();

  const onPress = useCallback(() => {
    navigation.navigate(Screens.DESCENT, { descentId: descent.id });
  }, [navigation, descent.id]);

  const timeZone = getSectionTimezone(descent.section);
  const zonedStartedAt = utcToZonedTime(descent.startedAt, timeZone);
  const startedAtStr = format(zonedStartedAt, 'PP p zzz', { timeZone });

  return (
    <Pressable onPress={onPress}>
      <View style={styles.container}>
        <View style={styles.rows}>
          <Text variant="titleSmall">
            {`${descent.section.river.name} - ${descent.section.name}`}
          </Text>
          <Text variant="bodySmall">{startedAtStr}</Text>
        </View>
        {!!descent.level && (
          <View style={styles.levelBlock}>
            <Text variant="titleSmall">
              {descentLevelToString(descent.level)}
            </Text>
          </View>
        )}
      </View>
    </Pressable>
  );
}

export default LogbookListItem;
