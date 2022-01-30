import { MatrixEvent } from 'matrix-js-sdk';
import React, { useRef } from 'react';
import { FlatList, Platform, StyleSheet } from 'react-native';

import KeyboardAvoidingView from '~/components/KeyboardAvoidingView';
import { useRoom, useScrollOnLiveEvent } from '~/features/chat';
import theme from '~/theme';

import ChatInputPanel from './ChatInputPanel';
import Item from './Item';

const styles = StyleSheet.create({
  kav: {
    flex: 1,
  },
  list: {
    flex: 1,
  },
  content: {
    padding: theme.margin.double,
  },
});

const keyExtractor = (item: MatrixEvent) => item.getId();

const OFFSET = (Platform.OS === 'ios' ? 72 : 64) + theme.safeBottom;

interface ChatProps {
  roomId: string;
}

const Chat: React.FC<ChatProps> = ({ roomId }) => {
  const listRef = useRef<FlatList<MatrixEvent>>(null);
  const { timeline, loading, loadOlder } = useRoom(roomId);
  const scrollProps = useScrollOnLiveEvent(listRef, timeline);

  return (
    <KeyboardAvoidingView
      style={styles.kav}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={OFFSET}
    >
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
      <ChatInputPanel roomId={roomId} />
    </KeyboardAvoidingView>
  );
};

export default Chat;
