import { MatrixEvent } from 'matrix-js-sdk';
import React from 'react';
import { FlatList, StyleSheet } from 'react-native';

import { Screen } from '~/components/Screen';
import { useRoom } from '~/features/chat';
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

const ChatScreen: React.FC<ChatNavProps> = ({ route: { params } }) => {
  const { roomId, roomType } = params;

  const { timeline, loading, loadOlder } = useRoom(roomId);

  return (
    <Screen>
      <FlatList<MatrixEvent>
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
      />
    </Screen>
  );
};

export default ChatScreen;
