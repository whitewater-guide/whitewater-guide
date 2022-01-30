import { MatrixEvent } from 'matrix-js-sdk';
import React, { useRef } from 'react';
import { FlatList, StyleSheet } from 'react-native';

import { Screen } from '~/components/Screen';
import { useRoom, useScrollOnLiveEvent } from '~/features/chat';
import theme from '~/theme';

import Item from './Item';
import { ChatNavProps } from './types';

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  content: {
    padding: theme.margin.double,
  },
});

const keyExtractor = (item: MatrixEvent) => item.getId();

const ChatScreen: React.FC<ChatNavProps> = ({
  route: {
    params: { roomId },
  },
}) => {
  const listRef = useRef<FlatList<MatrixEvent>>(null);
  const { timeline, loading, loadOlder } = useRoom(roomId);
  const scrollProps = useScrollOnLiveEvent(listRef, timeline);

  return (
    <Screen>
      <FlatList<MatrixEvent>
        ref={listRef}
        inverted
        style={styles.list}
        contentContainerStyle={styles.content}
        data={timeline}
        renderItem={({ item }) => <Item message={item} />}
        onEndReached={() => {
          if (!loading) {
            loadOlder();
          }
        }}
        keyExtractor={keyExtractor}
        {...scrollProps}
      />
    </Screen>
  );
};

export default ChatScreen;
