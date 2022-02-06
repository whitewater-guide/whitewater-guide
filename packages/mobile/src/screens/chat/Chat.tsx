import { Room } from '@whitewater-guide/schema';
import { MatrixEvent } from 'matrix-js-sdk';
import React, { useRef } from 'react';
import { FlatList, Platform, StyleSheet } from 'react-native';

import KeyboardAvoidingView from '~/components/KeyboardAvoidingView';
import { useRoom, useScrollOnLiveEvent } from '~/features/chat';
import theme from '~/theme';

import ChatInputPanel from './ChatInputPanel';
import useRenderEvent from './useRenderEvent';

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
  room: Room;
}

const Chat: React.FC<ChatProps> = ({ room }) => {
  const listRef = useRef<FlatList<MatrixEvent>>(null);
  const { timeline, loading, loadOlder } = useRoom(room);
  const scrollProps = useScrollOnLiveEvent(listRef, timeline);
  const renderItem = useRenderEvent(timeline.length);

  return (
    <KeyboardAvoidingView
      style={styles.kav}
      behavior={Platform.OS === 'ios' ? 'padding' : 'none'}
      keyboardVerticalOffset={OFFSET}
    >
      <FlatList<MatrixEvent>
        ref={listRef}
        inverted
        style={styles.list}
        contentContainerStyle={styles.content}
        data={timeline}
        renderItem={renderItem}
        onEndReached={() => {
          if (!loading) {
            loadOlder();
          }
        }}
        keyExtractor={keyExtractor}
        {...scrollProps}
      />
      <ChatInputPanel room={room} />
    </KeyboardAvoidingView>
  );
};

export default Chat;
