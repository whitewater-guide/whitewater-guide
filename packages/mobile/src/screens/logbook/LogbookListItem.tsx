import { useNavigation } from '@react-navigation/native';
import { Descent } from '@whitewater-guide/commons';
import format from 'date-fns/format';
import React, { useCallback } from 'react';
import { ListRenderItemInfo, Pressable, StyleSheet, View } from 'react-native';
import { Caption, Subheading } from 'react-native-paper';
import { RootStackNav, Screens } from '~/core/navigation';
import descentLevelToString from '~/features/descents/descentLevelToString';
import theme from '~/theme';

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
  descent: Descent;
}

const LogbookListItem: React.FC<Props> = ({ descent }) => {
  const { navigate } = useNavigation<RootStackNav>();
  const onPress = useCallback(() => {
    navigate(Screens.DESCENT, { descentId: descent.id });
  }, [navigate, descent]);
  return (
    <Pressable onPress={onPress}>
      <View style={styles.container}>
        <View style={styles.rows}>
          <Subheading>
            {descent.section.river.name + ' - ' + descent.section.name}
          </Subheading>
          <Caption>{format(new Date(descent.startedAt), 'PP p')}</Caption>
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

export const useRenderDescent = () =>
  useCallback(
    ({ item }: ListRenderItemInfo<Descent>) => (
      <LogbookListItem descent={item} />
    ),
    [],
  );
